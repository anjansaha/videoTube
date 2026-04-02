import { Router } from "express";
import { verifyAuthentication } from "../middlewares/auth.middlewares.js";
import { subcribeChannel } from "../controlers/subcription.controler.js";

const subcriptionRouter = Router();
subcriptionRouter.use(verifyAuthentication);
subcriptionRouter.route("/:channelId").post(subcribeChannel);

export default subcriptionRouter;
