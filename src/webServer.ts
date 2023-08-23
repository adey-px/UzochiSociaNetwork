import express, { Express } from 'express';
import { SetupAppserver } from '@root/setupApp';
import { envConfig } from '@root/envConfig';
import mongoConnection from '@root/setupDb';
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
