import mongoose from 'mongoose';
import { envConfig } from '@root/envConfig';
// import { redisConnection } from '@services/redis/redis.connection';
// import Logger from 'bunyan';
/**
 */
// Create Logger
// const setLog: Logger = config.createLogger('setupDb');

// Export as Anonymous function, import with any name
export default () => {
  const connectToMongo = () => {
    mongoose
      .connect(envConfig.MONGO_URL!)
      .then(() => {
        console.log('Server connected to mongodb :)');
        // redisConnection.connect();
      })
      .catch((error) => {
        console.log('Error connecting to mongodb (:', error);
        return process.exit(1);
      });
  };
  connectToMongo();

  // if disconnected, try connect again
  mongoose.connection.on('disconnected', connectToMongo);
};
