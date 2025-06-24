import { Injectable, NestMiddleware } from '@nestjs/common';

import { UsersService } from '../users.service';
import { NextFunction, Request, Response } from 'express';
import { User } from '../user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User | null;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    // const idNum = parseInt(userId);
    if (userId) {
      const user = await this.usersService.findOne(userId);

      req.currentUser = user;
    }

    next();
  }
}
