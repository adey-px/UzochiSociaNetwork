import express, { Express } from 'express';
import { SetupAppserver } from './setupApp';
import mongoConnection from './setupDb';
import { envConfig } from './envConfig';
/*
 */
// Finish setup & run server
class AppFactory {
	public activate(): void {
		this.enVariables();
		mongoConnection();
		const appy: Express = express();
		const sure: SetupAppserver = new SetupAppserver(appy);
		sure.start();
	}

	/* load validated env vars from config.ts */
	private enVariables(): void {
		envConfig.validate();
	}
}

const factory: AppFactory = new AppFactory();
factory.activate();
