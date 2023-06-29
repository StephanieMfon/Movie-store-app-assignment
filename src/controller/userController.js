import {
  createUserValidator,
  loginUserValidator,
} from "./../validators/userValidator.js";
import User from "../model/userModel.js";
import Movie from "./../model/movieModel.js";
import { newToken } from "../utils/jwtHandler.js";
import { mongoIdValidator } from "../validators/mongoIdValidator.js";
import { NotfoundError, BadUserRequestError } from "../error/error.js";
import bcrypt from "bcrypt";
// console.log(req.user._id);
// change the bcrypt to saving in a mongoose hook instead

export default class UserControllers {
  static async createUser(req, res, next) {
    const { error } = createUserValidator.validate(req.body);
    if (error) throw error;
    // Use the or mongodb operator to make this user.find email or username at once
    const emailExists = await User.find({ email: req.body.email });
    if (emailExists.length > 0)
      throw new BadUserRequestError("A user with that email alraedy exists");

    const usernameExists = await User.find({ email: req.body.username });
    if (usernameExists.length > 0)
      throw new BadUserRequestError("A user with that email alraedy exists");
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);

    const user = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      movieWishlist: req.body.movieWishlist,
    };
    const newUser = await User.create(user);
    res.status(201).json({
      status: "Success",
      message: "Account creation successful",
      data: {
        user: newUser,
      },
    });
  }

  static async loginUser(req, res) {
    const { error } = loginUserValidator.validate(req.body);
    if (error) throw error;
    if (!req.body?.username && !req.body?.email)
      throw new BadUserRequestError("Input a username or email");

    const user = await User.findOne({
      $or: [{ email: req.body?.email }, { username: req.body?.username }],
    }).populate([{ path: "movieWishlist", strictPopulate: true }]);

    const hash = bcrypt.compareSync(req.body.password, user.password);
    if (!hash)
      throw new BadUserRequestError("Incorrect username, email or password");

    const { _id, firstname, lastname, username, email, createdAt, updatedAt } =
      user;

    res.status(200).json({
      message: "Login succesful",
      status: "success",
      data: {
        _id,
        firstname,
        lastname,
        username,
        email,
        createdAt,
        updatedAt,
        accessToken: newToken(user),
      },
    });
  }

  // Add movie to wishlist

  static async addMovieToWishlist(req, res) {
    const movieInCollection = await Movie.find({
      _id: req.body.selectedMovieId,
    });
    if (!movieInCollection)
      throw new NotfoundError("Please input a valid movie ID");
    const movieInWishlist = await User.findOne({
      _id: req.user.id,
      movieWishlist: req.body.selectedMovieId,
    });
    if (movieInWishlist) {
      throw new BadUserRequestError(
        "This movie already exists in your wishlist"
      );
    }
    await User.updateOne(
      {
        _id: req.user.id,
      },
      { $push: { movieWishlist: req.body.selectedMovieId } }
    );
    const userDetails = await User.find({ _id: req.user.id });
    res.status(200).json({
      status: "success",
      message: " Movie wishlist updated",
      data: {
        userDetails,
      },
    });
  }

  static async getAllMoviesInWishlist(req, res) {
    console.log(req.user.id);
    const user = await User.findOne({ _id: req.user.id }).populate(
      "movieWishlist"
    );
    if (!user)
      throw new NotfoundError("User does not exist, create user account first");
    const { movieWishlist } = user;
    return res.status(200).json({
      status: "success",
      results: movieWishlist.length,
      data: {
        movieWishlist,
      },
    });
  }
}
