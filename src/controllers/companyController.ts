import { Request, Response } from 'express';
import { getAllVendorService } from '../services/companyService';

export const getAllVendorController = async (req: Request, res: Response) => {
  try {
    const vendors = await getAllVendorService();
    if (vendors.length >= 1) {
      res.status(200).json({
        code: 200,
        status: 'success',
        message: 'Get vendors success!',
        data: vendors
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