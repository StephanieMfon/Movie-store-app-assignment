import Movie from "./../model/movieModel.js";
import { addNewMovieValidator } from "./../validators/movieValidator.js";

export default class MovieController {
  // ADD A NEW MOVIE CONTROLLER
  /**
   *
   * @param {*} req - request object
   * @param {*} res - response object
   */
  static async addNewMovie(req, res) {
    const { error } = addNewMovieValidator.validate(req.body);
    if (error) throw error;
    const movieInCollection = await Movie.find({ title: req.body.title });
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

  // SHOW ALL MOVIES CONTROLLER
  /**
   *
   * @param {*} req - request object
   * @param {*} res - response object
   */
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
}
