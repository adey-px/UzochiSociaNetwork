import express, { Express } from 'express';
import { SetupAppserver } from './setupApp';
/*
 */
// Finish setup & run server
class AppFactory {
	public activate(): void {
		const appy: Express = express();
		const sure: SetupAppserver = new SetupAppserver(appy);
		sure.start();
	}
}

const factory: AppFactory = new AppFactory();
factory.activate();
