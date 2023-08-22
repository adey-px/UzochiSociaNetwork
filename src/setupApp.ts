import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';
import { envConfig } from './envConfig';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieSession from 'cookie-session';
import compression from 'compression';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';
import routesHandler from './routes';
import { CustomError, IErrorResponse } from './shared/globals/helpers/errorHandler';
/*
 */
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
			})
		);
		app.use(hpp());
		app.use(helmet());
		app.use(
			cors({
				origin: envConfig.CLIENT_URL,
				credentials: true,
				methods: ['GET', 'POST', 'PUT', 'DELETE'],
				optionsSuccessStatus: 200,
			})
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
		routesHandler(app);
	}

	/* global Error handler, first check all urls */
	private globalErrorHandler(app: Application): void {
		app.all('*', async (req: Request, res: Response) => {
			res.status(HTTP_STATUS.NOT_FOUND).json({ messgae: `${req.originalUrl} not found` });
		});
		app.use((error: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
			console.log(error);
			if (error instanceof CustomError) {
				return res.status(error.statusCode).json(error.serializedError());
			}
			next();
		});
	}

	/* start server handler */
	private async startHttpServer(app: Application): Promise<void> {
		try {
			const server: http.Server = new http.Server(app);
			this.configureHttServer(server);
		} catch (error) {}
	}

	/* connect to socket IO */
	private createSocketIO(httpServer: http.Server): void {}

	/* configure server */
	private configureHttServer(httpServer: http.Server): void {
		httpServer.listen(envConfig.SERVER_PORT, () => {
			console.log(`**Started server on http://localhost:${envConfig.SERVER_PORT}`);
		});
	}
}
