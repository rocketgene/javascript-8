const express = require('express');
const router = express.Router();
const Book = require('../models').Book;
const { Op } = require("sequelize");

/* Async handler for each route */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.render("page_not_found");
    }
  }
}
let search_query;

/* GET books listing. */
router.get('/', asyncHandler(async (req, res) => {
  const {count,rows} = await Book.findAndCountAll({ 
    order: [["createdAt", "ASC"]],
    offset: 0,
    limit: 2
  });
  const books = rows;
  res.render("index", { books, count });

}));

/* GET page */
router.get('/page/:page', asyncHandler(async (req, res) => {
  const {count,rows} = await Book.findAndCountAll({ 
    order: [["createdAt", "ASC"]],
    offset: (req.params.page-1)*2,
    limit: 2
  });
  const books = rows;
  res.render("index", { books, count });
}));

/* POST search books */
router.post('/', asyncHandler(async (req, res) => {
  search_query = req.body.search.toLowerCase();
  res.redirect('/books/search');
}));

/* GET searched books */
router.get('/search', asyncHandler(async (req, res) => {
  
  try {
    const books = await Book.findAll({ 
      order: [["createdAt", "DESC"]],
      where: {
        [Op.or]: {
          title: { [Op.like]: `%${search_query}%` },
          author: { [Op.like]: `%${search_query}%` },
          genre: { [Op.like]: `%${search_query}%` },
          year: { [Op.like]: `%${search_query}%` },
        }
      }
    });

    // Render results conditionally
    if (books.length > 0 ) {
      res.render("search_results", { books, msg: 'Books found: ' });
    } else {
      res.render("search_results", { books, msg: 'No books found' });
    }
  } catch (error) {
    res.render('error', { error })
  }
  
}));

/* Create a new book form. */
router.get('/new', (req, res) => {
  res.render("books/new", { book: {}, title: "New Book" });
});

/* POST create book. */
router.post('/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books");
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("books/new", { book, errors: error.errors, title: "New Book" })
    } else {
      res.render("error");
    }  
  }
}));

/* Edit book form. */
router.get("/:id", asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("books/update", { book, title: "Edit Book" });      
  } else {
    res.render("page_not_found");
  }
}));

/* Update a book. */
router.post('/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect("/books");
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("books/update", { book, errors: error.errors, title: "Edit Book" })
    } else {
      next(error);
    }
  }
}));

/* Delete a book. */
router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  try {
    await book.destroy();
    res.redirect("/books");
  } catch (error) {
    next(error)
  }
}));

module.exports = router;
