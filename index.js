import { app } from "./app.js";
import dotenv from "dotenv";
import {connectDB} from "./db/db.js";

// handling uncaught exception 
// asy error >> console.log(youtube) to error ay ga q kay hum ny string mn n likha to asy error uncaught error
process.on("uncaughtException", (err) => {
  console.log(`Error:${err.message}`);
  console.log(`shutting down the server  due to uncaught excepton  `);
  process.exit(1);
});


dotenv.config();

// connecting db
connectDB();

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`server is listening on: ${process.env.PORT}`);
});

// ager connection string mn koi issue a jay to to usy kay eeror ko handle kerny kay liy following name dety han

// unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error:${err.message}`);
  console.log(`shutting down the serer due to unhandled  promise rejections  `);

  server.close(() => {
    process.exit(1);
  });
});   
