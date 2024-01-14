import { getServices } from "controller/v1/services";
import { Router } from "express";
import expressAsyncHandler from "express-async-handler";

const router = Router();

router.get('/', expressAsyncHandler(getServices));

export default router