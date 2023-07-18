import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieSession from 'cookie-session';
import compression from 'compression';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';

const SERVER_PORT = 5000;
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
				keys: ['test1', 'test2'],
				maxAge: 7 * 24 * 60 * 60,
				secure: false,
			})
		);
		app.use(hpp());
		app.use(helmet());
		app.use(
			cors({
				origin: '*',
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
	private routingMiddleware(app: Application): void {}

	/* global Error handler  */
	private globalErrorHandler(app: Application): void {}

	/* start server handler */
	private async startHttpServer(app: Application): Promise<void> {
		try {
			const server: http.Server = new http.Server(app);
			this.configureHttServer(server);
		} catch (error) {}
	}

	private createSocketIO(httpServer: http.Server): void {}

	/* configure server */
	private configureHttServer(httpServer: http.Server): void {
		httpServer.listen(SERVER_PORT, () => {
			console.log(`**Started server on port ${SERVER_PORT}`);
		});
	}
}
