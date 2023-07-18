import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import cookieSession from 'cookie-session';
import compression from 'compression';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';
/*
 */
// Instance of express server class
export class SetupAppserver {
	private app: Application;

	constructor(app: Application) {
		this.app = app;
	}

	/* set security middleware */
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

	/* set standard middleware */
	private standardMiddleware(app: Application): void {
		app.use(compression());
		app.use(json({ limit: '50mb' }));
		app.use(urlencoded({ extended: true, limit: '50mb' }));
	}

	/* set routing middleware */
	private routingMiddleware(app: Application): void {}

	/* set methods */
	private errorGlobalHandler(app: Application): void {}
	private startServerHandler(app: Application): void {}
	private httpServerHandler(httpServer: http.Server): void {}
	private socketIOHandler(httpServer: http.Server): void {}

	public start(): void {
		this.securityMiddleware(this.app);
		this.standardMiddleware(this.app);
		this.routingMiddleware(this.app);
		this.errorGlobalHandler(this.app);
		this.startServerHandler(this.app);
	}
}
