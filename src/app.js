import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();
app.use(
  cors({
    origin: process.env.CROS_ORIGIN,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static("public"))
app.use(cookieParser())

//import routes
import userRouter from "./routes/user.route.js";
import subcriptionRouter from "./routes/subcription.route.js";

//use routes
app.use("/api/v1/user", userRouter)
app.use("/api/v1/subscribe", subcriptionRouter)


export { app };
