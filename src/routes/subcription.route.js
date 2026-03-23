import { Router } from "express";
import { verifyAuthentication } from "../middlewares/auth.middlewares";

const subcriptionRouter = Router();
subcriptionRouter.use(verifyAuthentication);
subcriptionRouter.route("/:userId").post();

export default subcriptionRouter;
