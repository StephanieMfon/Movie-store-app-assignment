import express from "express";
import UserControllers from "../controller/userController.js";
import { tryCatchFunction } from "../utils/tryCatchHandler.js";
import authMiddleware from "../middlewares/authentication.js";
// Create a new express router
const router = express.Router();

// Endpoint to handle the creation of a new user
router.post("/create", tryCatchFunction(UserControllers.createUser)); //createUser controller imported from the UsersController and wrapped in a try catch block

//  Endpoint to handle showing all movies in a users wishlist
router.get(
  "/show-wishlist",
  authMiddleware, //Middleware for authentication

  tryCatchFunction(UserControllers.getAllMoviesInWishlist) //Get all movies in user's wishlist controller imported from the UsersController and wrapped in a try catch block
);
//  Endpoint to handle adding a new movie to a wishlist
router.patch(
  "/add-to-wishlist",
  authMiddleware, //Middleware for authentication
  tryCatchFunction(UserControllers.addMovieToWishlist) //Get all movies in user's wishlist controller imported from the UsersController and wrapped in a try catch block
);

// Endpoint to handle user login
router.post("/login", tryCatchFunction(UserControllers.loginUser)); //Log a user into application controller imported from the UsersController and wrapped in a try catch block
export { router };
