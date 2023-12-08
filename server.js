const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// const uri = process.env.ATLAS_URI;
const uri =
  'mongodb+srv://test_user:test@cluster0testfullstackdo.mxhexez.mongodb.net/BookList';
mongoose.connect(uri);

const connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

const Schema = mongoose.Schema;

// Create a Schema object
const testSchema = new Schema(
  {
    title: { type: String, required: true },
    author: {type: String, required: true},
    description: {type: String},
    pages: {type: Number},
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

// This Activitry creates the collection called activitimodels
const model = mongoose.model('300365472-oliver', testSchema);

//Get all books
app.get('/', (req, res) => {
  model.find()
    .then((books) => res.json(books))
    .catch((err) => res.status(400).json('Error: ' + err));
});

//Add book
app.post('/', async (req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const description = req.body.description;
  const pages = req.body.pages;
  // create a new Activity object
  const newBook = await new model({
    title,
    author,
    description,
    pages
  });
  console.log(newBook);
  // save the new object
  newBook
    .save()
    .then(() => res.json('Book added!'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

//Get single book by id
app.get('/:id', (req, res) => {
  console.log('just id' + req.params.id);
  model.findById(req.params.id)
    .then((book) => res.json(book))
    .catch((err) => res.status(400).json('Error: ' + err));
});

//Update book by id
app.post('/:id', async (req, res) => {
  console.log(req.params.id);
  await model.findById(req.params.id)
    .then((bookforedit) => {
      bookforedit.title = req.body.title;
      bookforedit.author = req.body.author;
      bookforedit.description = req.body.description;
      bookforedit.pages = req.body.pages;

      bookforedit
        .save()
        .then(() => res.json('Book updated!'))
        .catch((err) => res.status(400).json('Error: ' + err));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

//Delete book by id
app.delete('/:id', async (req, res) => {
  console.log('delete logged');
  await model.findByIdAndDelete(req.params.id)
    .then(() => res.json('Book deleted.'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
