import mongoose from "mongoose";
import envConfig from "./env";

export const databaseConfig = () => {
  mongoose
    .connect(envConfig.mongo_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => console.log("Database connected!"))
    .catch((ex) => {
      // Only log error stack on development environment
      if (envConfig.node_env === "development") {
        console.error(`Database error! \n${ex}`);
      }

      // The process must exit if there's no db connection
      process.exit(1);
    });
};
