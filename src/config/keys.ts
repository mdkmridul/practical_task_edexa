export class Keys {
  PORT: string = null;
  MONGO_URI: string = null;
  JWT_SECRET: string = null;

  constructor() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('dotenv').config();
    } catch (error) {}
    this.prepareKeys();
  }

  prepareKeys() {
    // this.MONGO_URI =
    //   process.env.NODE_ENV === `test`
    //     ? process.env.MONGO_URI_TEST
    //     : process.env.MONGO_URI;
    this.PORT = process.env.PORT;
    this.MONGO_URI = process.env.MONGO_URI;
    this.JWT_SECRET = process.env.JWT_SECRET;
  }
}
