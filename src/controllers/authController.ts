import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { ApiResponseBody } from '../models/apiResponse';
import { loginUser } from '../services/authService';
import { extractAuthHeader } from '../utils/helper';

export const login = async (req: Request, res: Response<ApiResponseBody>) => {
  const { username, password } = req.body;

  try {
    const token = await loginUser(username, password);

    if (token) {
      res.status(200).json({
        code: 200,
        status: 'success',
        message: 'Login success!',
        data: {token}
      });
    } else {
      res.status(401).json({
        code: 401,
        status: 'failed',
        message: 'Invalid credentials!',
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

export const checkAuth = async (req: Request, res: Response<ApiResponseBody>) => {
  const token = extractAuthHeader(req.headers['authorization']);

  try {
    jwt.verify(token, config.secret, (err: any, user: any) => {
      if (err) {
        res.status(401).json({
          code: 401,
          status: 'failed',
          message: 'Not logged in!',
          data: null
        });
      } else {
        res.status(200).json({
          code: 200,
          status: 'success',
          message: 'Authorized!',
          data: { user }
        });
      }
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