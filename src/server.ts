import express, { Express } from 'express';
import { SetupAppserver } from './setupApp';
import mongoConnection from './setupDb';
/*
 */
// Finish setup & run server
class AppFactory {
	public activate(): void {
		mongoConnection();
		const appy: Express = express();
		const sure: SetupAppserver = new SetupAppserver(appy);
		sure.start();
	}
}

const factory: AppFactory = new AppFactory();
factory.activate();
