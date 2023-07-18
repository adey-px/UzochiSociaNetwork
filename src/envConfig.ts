import dotenv from 'dotenv';
// import bunyan from 'bunyan';
// import cloudinary from 'cloudinary';

// Load config vars from .env in root/
dotenv.config({});

// Create class to contain ALL config vars
class Config {
	[ x: string ]: any;
	public NODE_ENV: string | undefined;
	public CLIENT_URL: string | undefined;
	public JWT_TOKEN: string | undefined;
	public SECRET_KEY_ONE: string | undefined;
	public SECRET_KEY_TWO: string | undefined;
	public MONGO_URL: string | undefined;

	// public REDIS_HOST: string | undefined;
	// public CLOUD_NAME: string | undefined;
	// public CLOUD_API_KEY: string | undefined;
	// public CLOUD_API_SECRET: string | undefined;
	// public SENDER_EMAIL: string | undefined;
	// public SENDER_EMAIL_PASSWORD: string | undefined;
	// public SENDGRID_API_KEY: string | undefined;
	// public SENDGRID_SENDER: string | undefined;
	// public EC2_URL: string | undefined;

	private readonly DEFAULT_MONGO_URL = 'mongodb://localhost:27017/sampledb';

	constructor() {
		this.NODE_ENV = process.env.NODE_ENV || '';
		this.CLIENT_URL = process.env.CLIENT_URL || '';
		this.JWT_TOKEN = process.env.JWT_TOKEN || '1234';
		this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || '';
		this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || '';
		this.MONGO_URL = process.env.MONGO_URL || this.DEFAULT_MONGO_URL;

		// this.REDIS_HOST = process.env.REDIS_HOST || '';
		// this.CLOUD_NAME = process.env.CLOUD_NAME || '';
		// this.CLOUD_API_KEY = process.env.CLOUD_API_KEY || '';
		// this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || '';
		// this.SENDER_EMAIL = process.env.SENDER_EMAIL || '';
		// this.SENDER_EMAIL_PASSWORD = process.env.SENDER_EMAIL_PASSWORD || '';
		// this.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
		// this.SENDGRID_SENDER = process.env.SENDGRID_SENDER || '';
		// this.EC2_URL = process.env.EC2_URL || '';
	}

	// public createLogger(name: string): bunyan {
	// 	return bunyan.createLogger({ name, level: 'debug' });
	// }

  /* validate key/value of vars in constructor, error for missing values */
	public validate(): void {
		for (const [key, value] of Object.entries(this)) {
			if (value === undefined) {
				throw new Error(`Config ${key} is not found!!`);
			}
		}
	}

	// public cloudinaryConfig(): void {
	// 	cloudinary.v2.config({
	// 		cloud_name: this.CLOUD_NAME,
	// 		api_key: this.CLOUD_API_KEY,
	// 		api_secret: this.CLOUD_API_SECRET,
	// 	});
	// }
}

// Create instance of the Config class, 
// - to be used to load env vars across project files
export const envConfig: Config = new Config();
