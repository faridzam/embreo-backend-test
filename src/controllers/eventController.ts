import { Request, Response } from 'express';
import { ApiResponseBody } from '../models/apiResponse';
import { createEventService, getEventService } from '../services/eventService';

export const getEventController = async (req: Request, res: Response<ApiResponseBody>) => {

  try {
    const events = await getEventService(req.body.auth);

    if (events.length >= 1) {
      res.status(200).json({
        code: 200,
        status: 'success',
        message: 'Get event success!',
        data: {events}
      });
    } else {
      res.status(404).json({
        code: 404,
        status: 'failed',
        message: 'Event not found!',
        data: null
      });
    }
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: 'failed',
      message: `Internal server error: ${error}`,
      data: null
    });
  }
};

export const createEventController = async (req: Request, res: Response<ApiResponseBody>) => {

  try {
    const eventData = await createEventService(req.body);

    res.status(201).json({
      code: 201,
      status: 'success',
      message: 'Create event success!',
      data: {eventData}
    });
  } catch (error) {
    res.status(500).json({
      code: 500,
      status: 'failed',
      message: `Internal server error: ${error}`,
      data: null
    });
  }
};