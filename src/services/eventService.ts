import pool from "../config/database";
import { AuthenticatedUser, CreateEventRequest, updateStatusEventRequest } from "../models/apiRequest";
import { EventResponse, updateStatusEventResponse } from "../models/apiResponse";
import { formatDateToString } from "../utils/helper";

export const getEventService = async (props: AuthenticatedUser): Promise<EventResponse[]> => {

  if (props.role.id === 1) {

    const eventsResult = await pool.query(
      'SELECT * FROM events WHERE user_id = $1',
      [props.user.id]
    )

    let promises = eventsResult.rows.map(async (event) => {

      let eventResponse: EventResponse = {
        company: {
          id: 0,
          name: ""
        },
        vendors: [],
        dates: [],
        id: event.id,
        user_id: event.user_id,
        name: event.name,
        location: event.location,
        created_at: event.created_at,
      }

      // set company
      const companyResult = await pool.query(
        'SELECT * FROM companies WHERE id = $1', 
        [props.user.company_id]
      )
      eventResponse.company = companyResult.rows[0]

      // set vendors
      const vendorResult = await pool.query(
        `
        SELECT 
        t3.name, t1.status, t1.status, t1.remarks, t1.updated_at
        FROM event_vendors t1
        INNER JOIN users t2 ON t1.user_id = t2.id
        INNER JOIN companies t3 ON t2.company_id = t3.id
        WHERE 
          t1.event_id = $1;
        `, 
        [event.id]
      )
      eventResponse.vendors = vendorResult.rows

      //set dates
      const datesResult = await pool.query(
        'SELECT date FROM event_dates WHERE event_id = $1',
        [event.id]
      )
      eventResponse.dates = datesResult.rows.map((value) => value.date)

      // push eventResponse
      return eventResponse

    })

    const result = await Promise.all(promises)
    return result

  } else if (props.role.id === 2) {

    const eventsVendorResult = await pool.query(
      'SELECT event_id FROM event_vendors WHERE user_id = $1',
      [props.user.id]
    )
    const eventsResult = await pool.query(
      'SELECT * FROM events WHERE id = ANY ($1)',
      [eventsVendorResult.rows.map((value) => value.event_id)]
    )

    let promises = eventsResult.rows.map(async (event) => {

      let eventResponse: EventResponse = {
        company: {
          id: 0,
          name: ""
        },
        vendors: [],
        dates: [],
        id: event.id,
        user_id: event.user_id,
        name: event.name,
        location: event.location,
        created_at: event.created_at,
      }

      // set company
      const userCompanyResult = await pool.query(
        'SELECT * FROM users WHERE id = $1', 
        [event.user_id]
      )
      const companyResult = await pool.query(
        'SELECT * FROM companies WHERE id = $1', 
        [userCompanyResult.rows[0].company_id]
      )
      eventResponse.company = companyResult.rows[0]

      // set vendors
      const vendorResult = await pool.query(
        `
        SELECT 
        t3.name, t1.status, t1.status, t1.remarks, t1.updated_at
        FROM event_vendors t1
        INNER JOIN users t2 ON t1.user_id = t2.id
        INNER JOIN companies t3 ON t2.company_id = t3.id
        WHERE 
          t1.event_id = $1;
        `, 
        [event.id]
      )
      eventResponse.vendors = vendorResult.rows

      //set dates
      const datesResult = await pool.query(
        'SELECT date FROM event_dates WHERE event_id = $1',
        [event.id]
      )
      eventResponse.dates = datesResult.rows.map((value) => value.date)

      // push eventResponse
      return eventResponse

    })

    const result = await Promise.all(promises)
    return result
  }

  return []

};

export const createEventService = async (props: CreateEventRequest): Promise<EventResponse> => {

  const client = await pool.connect()
  let result : EventResponse = {
    vendors: [],
    dates: [],
    id: 0,
    user_id: 0,
    company: {
      id: 0,
      name: ""
    },
    name: "",
    location: "",
    created_at: "",
  }
  
  try {
    await client.query('BEGIN')

    // insert events
    const queryInsertEventText = `
      INSERT INTO events(user_id, name, location) 
      VALUES
        ($1, $2, $3)
      RETURNING *;
    `
    const resultEvent = await client.query(queryInsertEventText, [props.auth.user.id, props.name, props.location])

    // insert event_vendor
    props.vendors.map(async (vendor) => {

      const queryInsertEventVendorText = `
      WITH inserted_event_vendor AS (
        INSERT INTO event_vendors(event_id, user_id, status, remarks, updated_at) 
        VALUES
          ($1, $2, $3, '', NULL)
        RETURNING *
      ) SELECT * FROM inserted_event_vendor 
          LEFT JOIN companies ON inserted_event_vendor.user_id = companies.id;
      `
      const resultEventVendor = await client.query(queryInsertEventVendorText, [resultEvent.rows[0].id, vendor, 'pending'])
      result.vendors.push({
        name: resultEventVendor.rows[0].name,
        status: resultEventVendor.rows[0].status,
        remarks: resultEventVendor.rows[0].remarks,
        updated_at: resultEventVendor.rows[0].updated_at
      })
    })
    
    // insert event_dates
    props.dates.map(async (date) => {
      const queryInsertEventDateText = `
        INSERT INTO event_dates(event_id, date) 
        VALUES
          ($1, $2)
        RETURNING *;
      `
      const resultEventDate = await client.query(queryInsertEventDateText, [resultEvent.rows[0].id, date])
      result.dates.push(resultEventDate.rows[0].date)
    })

    result.id = resultEvent.rows[0].id
    result.user_id = props.auth.user.id
    result.company = props.auth.company
    result.name = resultEvent.rows[0].name
    result.location = resultEvent.rows[0].location
    result.created_at = resultEvent.rows[0].created_at

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }

  return result as EventResponse;
};

export const approveEventService = async (props: updateStatusEventRequest): Promise<updateStatusEventResponse> => {

  let result : updateStatusEventResponse = {
    name: "",
    status: "",
    remarks: "",
    updated_at: ""
  }
  
  try {

    const eventVendorResult = await pool.query(
      `
        WITH updated_event_vendor AS (
          UPDATE event_vendors 
          SET status = $1, remarks = $2, updated_at = $3
          WHERE event_id = $4 AND user_id = $5 
          RETURNING *
        ) SELECT * FROM updated_event_vendor 
            LEFT JOIN users u ON updated_event_vendor.user_id = u.id
            LEFT JOIN companies c ON u.company_id = c.id;
      `,
      ['approved', props.remarks, formatDateToString(new Date), props.event_id, props.auth.user.id]
    )

    // result.name = eventVendorResult.rows[0].name
    result.status = eventVendorResult.rows[0].status
    result.remarks = eventVendorResult.rows[0].remarks
    result.updated_at = eventVendorResult.rows[0].updated_at

  } catch (error) {
    throw error
  }

  return result;
};

export const rejectEventService = async (props: updateStatusEventRequest): Promise<updateStatusEventResponse> => {

  let result : updateStatusEventResponse = {
    name: "",
    status: "",
    remarks: "",
    updated_at: ""
  }
  
  try {

    const eventVendorResult = await pool.query(
      `
        WITH updated_event_vendor AS (
          UPDATE event_vendors 
          SET status = $1, remarks = $2, updated_at = $3
          WHERE event_id = $4 AND user_id = $5 
          RETURNING *
        ) SELECT * FROM updated_event_vendor 
            LEFT JOIN users u ON updated_event_vendor.user_id = u.id
            LEFT JOIN companies c ON u.company_id = c.id;
      `,
      ['rejected', props.remarks, formatDateToString(new Date), props.event_id, props.auth.user.id]
    )

    // result.name = eventVendorResult.rows[0].name
    result.status = eventVendorResult.rows[0].status
    result.remarks = eventVendorResult.rows[0].remarks
    result.updated_at = eventVendorResult.rows[0].updated_at

  } catch (error) {
    throw error
  }

  return result;
};

export const getEventDetailService = async (event_id: number, props: AuthenticatedUser): Promise<EventResponse | boolean> => {

  let eventResponse: EventResponse = {
    company: {
      id: 0,
      name: ""
    },
    vendors: [],
    dates: [],
    id: 0,
    user_id: 0,
    name: "",
    location: "",
    created_at: "",
  }

  // set event
  const eventResult = await pool.query(
    'SELECT * FROM events WHERE id = $1', 
    [event_id]
  )
  eventResponse.id = eventResult.rows[0].id
  eventResponse.user_id = eventResult.rows[0].user_id
  eventResponse.name = eventResult.rows[0].name
  eventResponse.location = eventResult.rows[0].location
  eventResponse.created_at = eventResult.rows[0].created_at

  // set company
  const companyResult = await pool.query(
    'SELECT * FROM companies WHERE id = $1', 
    [props.user.company_id]
  )
  eventResponse.company = companyResult.rows[0]

  // set vendors
  const vendorResult = await pool.query(
    `
    SELECT 
    t3.name, t1.status, t1.status, t1.remarks, t1.updated_at
    FROM event_vendors t1
    INNER JOIN users t2 ON t1.user_id = t2.id
    INNER JOIN companies t3 ON t2.company_id = t3.id
    WHERE 
      t1.event_id = $1;
    `, 
    [event_id]
  )
  eventResponse.vendors = vendorResult.rows

  //set dates
  const datesResult = await pool.query(
    'SELECT date FROM event_dates WHERE event_id = $1',
    [event_id]
  )
  eventResponse.dates = datesResult.rows.map((value) => value.date)

  // push eventResponse
  return eventResponse

};