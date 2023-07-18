import mongoose from 'mongoose';
// import Logger from 'bunyan';
import { envConfig } from './envConfig';
// import { redisConnection } from '@service/redis/redis.connection';

// Create Logger
// const log: Logger = config.createLogger('setupDb');

// Export as Anonymous function, can be imported with any name
export default () => {
  const connectToMongo = () => {
    mongoose
			.connect(envConfig.MONGO_URL!)
			.then(() => {
				console.log('**Connected to mongo database');
				// redisConnection.connect();
			})
			.catch((error) => {
				console.log('Error connecting to mongodb!!', error);
				return process.exit(1);
			});
  };
  connectToMongo();

  // if disconnected, try connect again
  mongoose.connection.on('disconnected', connectToMongo);
};