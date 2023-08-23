import HTTP_STATUS from 'http-status-codes';
/**
 * Setup for CustomError class handler
 * for Global error handler in setupApp
 */
// Type interface
export interface IErrorResponse {
	message: string;
	statusRead: string;
	statusCode: number;
	serializedError(): IErrorSeries;
}

// Type interface
export interface IErrorSeries {
	message: string;
	statusRead: string;
	statusCode: number;
}

// Create CustomError using Abstract or Base Class
export abstract class CustomError extends Error {
	abstract statusRead: string;
	abstract statusCode: number;

	constructor(message: string) {
		super(message);
	}

	serializedError(): IErrorSeries {
		return {
			message: this.message,
			statusRead: this.statusRead,
			statusCode: this.statusCode,
		};
	}
}

// Set Request Validation Error from Base Class
export class RequestValidationError extends CustomError {
	statusRead = 'Error, invalid request!';
	statusCode = HTTP_STATUS.BAD_REQUEST;

	constructor(message: string) {
		super(message);
	}
}

// Set Bad Request Error from Base Class
export class BadRequestError extends CustomError {
	statusRead = 'Error, bad request!';
	statusCode = HTTP_STATUS.BAD_REQUEST;

	constructor(message: string) {
		super(message);
	}
}

// Set Not Found Error from Base Class
export class NotFoundError extends CustomError {
	statusRead = 'Error, items not found!';
	statusCode = HTTP_STATUS.NOT_FOUND;

	constructor(message: string) {
		super(message);
	}
}

// Set Unauthorized Error from Base Class
export class UnAuthorizedError extends CustomError {
	statusRead = 'Error, user not authorized!';
	statusCode = HTTP_STATUS.UNAUTHORIZED;

	constructor(message: string) {
		super(message);
	}
}

// Set Request 2Long Error from Base Class
export class RequestTooLongError extends CustomError {
	statusRead = 'Error, files too large!';
	statusCode = HTTP_STATUS.REQUEST_TOO_LONG;

	constructor(message: string) {
		super(message);
	}
}

// Set Server Down Error from Base Class
export class ServerUnavailableError extends CustomError {
	statusRead = 'Error, server not ready!';
	statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;

	constructor(message: string) {
		super(message);
	}
}
