var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var books = require('./routes/books');

var app = express();

//import sequelize instance
var sequelize = require('./models').sequelize;
const Book = require('./models').Book;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', books);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use( (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  if (err.status === 404) {
    res.render('page_not_found');
  } else {
    res.render('error');
  }
});

(async () => {
  await sequelize.sync({ force: true });
   try {

    const book1 = await Book.create({
      title: 'title1',
      author: 'author1',
      genre: 'genre1',
      year: 1881
    });

    const book2 = await Book.create({
      title: 'title2',
      author: 'author2',
      genre: 'genre2',
      year: 1882
    });

    const book3 = await Book.create({
      title: 'title3',
      author: 'author3',
      genre: 'genre3',
      year: 1883
    });

    const book4 = await Book.create({
      title: 'title4',
      author: 'author4',
      genre: 'genre4',
      year: 1884
    });

    const book5 = await Book.create({
      title: 'title5',
      author: 'author5',
      genre: 'genre5',
      year: 1885
    });

    const book6 = await Book.create({
      title: 'title6',
      author: 'author6',
      genre: 'genre6',
      year: 1886
    });

  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();


module.exports = app;
