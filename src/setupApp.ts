/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Application,
  json,
  urlencoded,
  Response,
  Request,
  NextFunction,
} from 'express';
import { envConfig } from '@root/envConfig';
import { Server } from 'socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import 'express-async-errors';
import Logger from 'bunyan';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieSession from 'cookie-session';
import compression from 'compression';
import HTTP_STATUS from 'http-status-codes';
import routeHandler from '@root/routes';
import {
  CustomError,
  IErrorResponse,
} from '@globals/helpers/errorHandler';
/*
 */
const PORT = 5000;

// Set custom logger from env config file,
// name string identifies error source file
const setLog: Logger = envConfig.customLogger('setupApp');

// Instance of express server class
export class SetupAppserver {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routingMiddleware(this.app);
    this.globalErrorHandler(this.app);
    this.startHttpServer(this.app);
  }

  /* security middleware */
  private securityMiddleware(app: Application): void {
    app.use(
      cookieSession({
        name: 'session',
        keys: [envConfig.SECRET_KEY_ONE!, envConfig.SECRET_KEY_TWO!],
        maxAge: 7 * 24 * 60 * 60,
        secure: envConfig.NODE_ENV !== 'development',
      }),
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: envConfig.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        optionsSuccessStatus: 200,
      }),
    );
  }

  /* standard middleware */
  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));
  }

  /* routing middleware */
  private routingMiddleware(app: Application): void {
    routeHandler(app);
  }

  // /* global Error handler, first check all urls */
  private globalErrorHandler(app: Application): void {
    app.all('*', async (req: Request, res: Response) => {
      res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ messgae: `${req.originalUrl} not found` });
    });
    app.use(
      (
        err: IErrorResponse,
        _req: Request,
        res: Response,
        next: NextFunction,
      ) => {
        setLog.error(err);
        if (err instanceof CustomError) {
          return res.status(err.statusCode).json(err.serializedError());
        }
        next();
      },
    );
  }

  /* start httpServer handler */
  private async startHttpServer(app: Application): Promise<void> {
    try {
      const httpServer: http.Server = new http.Server(app);
      const socketIO: Server = await this.createSocketIO(httpServer);
      this.startAppServer(httpServer);
      this.socketIOConnections(socketIO);
    } catch (err) {
      setLog.error(err);
    }
  }

  /* create socketIO & redis adapter */
  private async createSocketIO(httpServer: http.Server): Promise<Server> {
    const io: Server = new Server(httpServer, {
      cors: {
        origin: envConfig.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      },
    });
    const pubClient = createClient({ url: envConfig.REDIS_HOST });
    const subClient = pubClient.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    return io;
  }

  /* configure express server */
  private startAppServer(httpServer: http.Server): void {
    setLog.info(`Started server with socket process ${process.pid}`);
    httpServer.listen(PORT, () => {
      setLog.info(
        `Started server on http://localhost:${PORT}`,
      );
    });
  }

  /* create connections for socketIO */
  private socketIOConnections(io: Server): void {}
}
