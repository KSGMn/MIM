// context.ts

import { Request, Response } from 'express';

export interface IAuthUser {
  user?: {
    email: string;
    id: string;
    name: string;
  };
}

export interface IContext {
  req: Request & IAuthUser;
  res: Response;
}
