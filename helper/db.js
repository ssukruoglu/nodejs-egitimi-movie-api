const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb+srv://movie_user:x113041X@cluster0-ny1l8.mongodb.net/movie-api', { useNewUrlParser: true });

    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);

    mongoose.connection.on('open', () => {
        //console.log('MongoDB: Conneted!');
    });

    mongoose.connection.on('error', (err) => {
        console.log('MongoDB: ERROR!', err);
    });

    mongoose.Promise = global.Promise;
};