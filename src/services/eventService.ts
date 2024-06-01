import pool from "../config/database";
import { AuthenticatedUser } from "../models/apiRequest";
import { CreateEventRequest, EventResponse } from "../models/event";

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
        status: event.status,
        created_at: event.created_at,
        updated_at: event.updated_at,
      }

      // set company
      const companyResult = await pool.query(
        'SELECT * FROM companies WHERE id = $1', 
        [props.user.company_id]
      )
      eventResponse.company = companyResult.rows[0]

      // set vendors
      const eventVendorResult = await pool.query(
        'SELECT user_id FROM event_vendors WHERE event_id = $1',
        [event.id]
      )
      const userResult = await pool.query(
        'SELECT company_id FROM users WHERE id = ANY ($1)',
        [eventVendorResult.rows.map((value) => value.user_id)]
      )
      const vendorResult = await pool.query(
        'SELECT * FROM companies WHERE id = ANY ($1)', 
        [userResult.rows.map((value) => value.company_id)]
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
        status: event.status,
        created_at: event.created_at,
        updated_at: event.updated_at,
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
      const eventVendorResult = await pool.query(
        'SELECT user_id FROM event_vendors WHERE event_id = $1',
        [event.id]
      )
      const userResult = await pool.query(
        'SELECT company_id FROM users WHERE id = ANY ($1)',
        [eventVendorResult.rows.map((value) => value.user_id)]
      )
      const vendorResult = await pool.query(
        'SELECT * FROM companies WHERE id = ANY ($1)', 
        [userResult.rows.map((value) => value.company_id)]
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
    status: "",
    created_at: "",
    updated_at: "",
  }
  
  try {
    await client.query('BEGIN')

    // insert events
    const queryInsertEventText = `
      INSERT INTO events(user_id, name, location, status, remarks) 
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING *;
    `
    const resultEvent = await client.query(queryInsertEventText, [props.auth.user.id, props.name, props.location, 'pending', ''])

    // insert event_vendor
    props.vendors.map(async (vendor) => {
      const queryInsertEventVendorText = `
        INSERT INTO event_vendors(event_id, user_id) 
        VALUES
          ($1, $2)
        RETURNING *;
      `
      const resultVendor = await client.query('SELECT * FROM companies WHERE id = $1;', [vendor])
      result.vendors.push({
        id: resultVendor.rows[0].id,
        name: resultVendor.rows[0].name,
      })
      await client.query(queryInsertEventVendorText, [resultEvent.rows[0].id, vendor])
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
    result.status = resultEvent.rows[0].status
    result.remarks = resultEvent.rows[0].remarks
    result.created_at = resultEvent.rows[0].created_at
    result.updated_at = resultEvent.rows[0].updated_at

    await client.query('COMMIT')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }

  return result as EventResponse;
};