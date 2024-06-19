import express from "express";
import errorMiddleware from "./middlewares/error.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

// route imports
// product router
import productRouter from "./routes/product.route.js";
// order router
import orderRouter from "./routes/order.route.js";
//import userRouter from "/routes/user.route.js"
import user from "./routes/user.route.js";
import bodyParser from "body-parser";
app.use("/api/v1", user);
app.use("/api/v1", productRouter);
app.use("/api/v1", orderRouter);
// middleware error handler
app.use(errorMiddleware);
export { app };
