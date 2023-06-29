import Movie from "./../model/movieModel.js";
import User from "../model/userModel.js";
import { addNewMovieValidator } from "./../validators/movieValidator.js";
import { BadUserRequestError, NotfoundError } from "../error/error.js";
import { mongoIdValidator } from "../validators/mongoIdValidator.js";

export default class MovieController {
  static async addNewMovie(req, res) {
    const { error } = addNewMovieValidator.validate(req.body);
    if (error) throw error;
    const movieInCollection = await Movie.find({ title: req.body.title });
    console.log(movieInCollection);
    if (movieInCollection.length > 0) {
      return res.status(400).json({
        status: "success",
        message: "Movie already exists, use a different title",
        data: {
          movieInCollection,
        },
      });
    }

    const newMovie = await Movie.create(req.body);

    const { genre, title, description, movieLength, yearReleased } = newMovie;
    res.status(201).json({
      status: "success",
      message: "Movie added succesfully",
      data: {
        genre,
        title,
        description,
        movieLength,
        yearReleased,
      },
    });
  }

  static async findAll(req, res) {
    const movies = await Movie.find().select("-__v -isDeleted");

    res.status(200).json({
      status: "success",
      result: movies.length,
      data: {
        movies,
      },
    });
  }

  static async addMovieToWishlist(req, res, next) {
    const { id } = req.query;
    // const { err } = mongoIdValidator.validate(req.query);
    // if (err) throw err;

    const movieInCollection = await Movie.find({
      _id: req.body.selectedMovieId,
    });
    if (!movieInCollection)
      throw new NotfoundError("Please input a valid movie ID");

    const movieInWishlist = await User.find({
      _id: id,
      movieWishlist: req.body.selectedMovieId,
    });

    if (movieInWishlist) {
      throw new BadUserRequestError(
        "This movie already exists in your wishlist"
      );
    }
    const user = await User.updateOne(
      {
        _id: id,
      },
      { $push: { movieWishlist: req.body.selectedMovieId } }
    );
    res.status(200).json({
      status: "success",
      message: " Movie wishlist updated",
      data: {
        user,
      },
    });
  }
}
