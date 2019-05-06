const express = require('express');
const router = express.Router();

// Models
const Movie = require('../models/Movie');

// List All Movie
router.get('/', (req, res) => {
    const promise = Movie.aggregate([
        {
            $lookup: {
                from: 'directors',
                localField: 'director_id',
                foreignField: '_id',
                as: 'director'
            }
        },
        {
            $unwind: {
                path: '$director',
                preserveNullAndEmptyArrays: true
            }
        }
    ]);

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

// Add new movie
router.post('/', (req, res, next) => {
    // const { title, imdb_score, category, country, year } = req.body;

    /*
    const movie = new Movie({
        title: title,
        imdb_score: imdb_score,
        category: category,
        country: country,
        year: year
    });
    */

    const movie = new Movie(req.body);

    /* Callback fonksiyon ile save
    movie.save((err, data) => {
        if(err)
            res.json(err);

        res.json(data);
    });
    */

    // Promise ile save
    const promise = movie.save();

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });

});

// Top 10 list
router.get('/top10', (req, res) => {
    const promise = Movie.find({  }).limit(10).sort({ imdb_score: -1 });

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

// get one movie
router.get('/:movie_id', (req, res, next) => {
    const promise = Movie.findById(req.params.movie_id);

    promise.then((movie) => {
        if(!movie)
            next({ message: 'The movie was not found!', code: 99 });
        res.json(movie);
    }).catch((err) => {
        res.json(err);
    });
});

// update movie
router.put('/:movie_id', (req, res, next) => {
    const promise = Movie.findByIdAndUpdate(req.params.movie_id, req.body, { new: true });

    promise.then((movie) => {
        if(!movie)
            next({ message: 'The movie was not found!', code: 99 });
        res.json(movie);
    }).catch((err) => {
        res.json(err);
    });
});

// Delete movie
router.delete('/:movie_id', (req, res, next) => {
    const promise = Movie.findByIdAndRemove(req.params.movie_id);

    promise.then((movie) => {
        if(!movie)
            next({ message: 'The movie was not found!', code: 99 });
        res.json({ status: 1 });
    }).catch((err) => {
        res.json(err);
    });
});

// Between
router.get('/between/:start_year/:end_year', (req, res) => {
    const { start_year, end_year } = req.params;
    const promise = Movie.find(
        {
            year: { "$gte": parseInt(start_year), "$lte": parseInt(end_year) }
        }
    );

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    });
});

module.exports = router;
