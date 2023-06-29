import express from "express";
import UserControllers from "../controller/userController.js";
import { tryCatchFunction } from "../utils/tryCatchHandler.js";
import authMiddleware from "../middlewares/authentication.js";
const router = express.Router();

router.post("/create", tryCatchFunction(UserControllers.createUser));
router.get(
  "/show-wishlist",
  authMiddleware,

  tryCatchFunction(UserControllers.getAllMoviesInWishlist)
);
router.patch(
  "/add-to-wishlist",
  authMiddleware,
  tryCatchFunction(UserControllers.addMovieToWishlist)
);

router.post("/login", tryCatchFunction(UserControllers.loginUser));

export { router };
