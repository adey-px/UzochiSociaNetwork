import { Application, json, urlencoded, Response, Request, NextFunction } from 'express';
import http from 'http';

// Instance of express app server
export class SetupServer {
	private app: Application;

	constructor(app: Application) {
		this.app = app;
	}

	/* set middlewares & methods */
	private standardMiddleware(app: Application): void {}
	private securityMiddleware(app: Application): void {}
	private routingMiddleware(app: Application): void {}
	private errorGlobalHandler(app: Application): void {}
	private startServerHandler(app: Application): void {}
	private socketIOHandler(httpServer: http.Server): void {}
	private httpServerHandler(httpServer: http.Server): void {}

	public start(): void {
		this.standardMiddleware(this.app);
		this.securityMiddleware(this.app);
		this.routingMiddleware(this.app);
		this.errorGlobalHandler(this.app);
		this.startServerHandler(this.app);
	}
}
