import Router from "express";
import MovieController from "../controller/movieController.js";
import { tryCatchFunction } from "../utils/tryCatchHandler.js";
import authMiddleware from "../middlewares/authentication.js";
const router = Router();

router.post(
  "/create",
  authMiddleware,
  tryCatchFunction(MovieController.addNewMovie)
);
router.get("/find", authMiddleware, tryCatchFunction(MovieController.findAll));

export { router };
