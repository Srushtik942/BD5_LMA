const express = require('express');
const { sequelize } = require('./lib');
const { Author } = require('./models/Author.model');
const { Genre } = require('./models/Genre.model');
const { Book } = require('./models/Book.model');
const { where } = require('sequelize');
const app = express();
app.use(express.json());
const PORT = 3000;
const authorsData = [
    { name: 'J.K. Rowling', birthdate: '1965-07-31', email: 'jkrowling@books.com' },
    { name: 'George R.R. Martin', birthdate: '1948-09-20', email: 'grrmartin@books.com' }
  ];

  const genresData = [
    { name: 'Fantasy', description: 'Magical and mythical stories.' },
    { name: 'Drama', description: 'Fiction with realistic characters and events.' }
  ];

  const booksData = [
    { title: 'Harry Potter and the Philosopher\'s Stone', description: 'A young wizard\'s journey begins.', publicationYear: 1997, authorId: 1 },
    { title: 'Game of Thrones', description: 'A medieval fantasy saga.', publicationYear: 1996, authorId: 2 }
  ];

//   Seeding Database

app.get('/seed_db',async(req,res)=>{
    try{

        await sequelize.sync({force :true});
       const authors =  await Author.bulkCreate(authorsData);
       const genres = await Genre.bulkCreate(genresData);
       const books = await Book.bulkCreate(booksData);

       await books[0].setGenres([genres[0]]);
       await books[1].setGenres([genres[0], genres[1]]);



        res.status(200).json({message:"Database Seeding successfully"})
    }catch(error){
        res.status(500).json({message:"Seeding Db failed!",error:error.message});
    }
})

// Get All Books:
async function fetchAllBooks() {
    let response = await Book.findAll();
    return {response};
}

app.get('/books',async(req,res)=>{
    try{
    let result = await fetchAllBooks();
    // validation
    if(result.length === 0){
        res.status(404).json({message:"Books are not present"});
    }
    res.status(200).json({result});

    }catch(error){
        res.status(500).json({message:"Internal Server Error!",error:error.message});
    }
})

// Fetch All Books Written by an Author:

async function fetchBookByAuthor(authorId) {
    let response = await Book.findAll({where:{authorId}});
    return {response};
}

app.get('/authors/:authorId/books',async(req,res)=>{
    try{
    let authorId = parseInt(req.params.authorId);
    let result = await fetchBookByAuthor(authorId);
// validation
    if(result.response.length === 0){
        res.status(404).json({message:"Author Id is wrong!"});
    }
    res.status(200).json({result});
    }catch(error){
        res.status(500).json({message:"Unable to Fetch book",error:error.message});
    }
});

// Get Books by Genre:

async function getBookBygenreId(genreId) {
    let response = await Genre.findByPk(genreId,{
        include : Book
    })
    return {response};
}

app.get('/genres/:genreId/books',async(req,res)=>{
    try{
    let genreId = parseInt(req.params.genreId);
    let result = await getBookBygenreId(genreId);

    // validation
    if(!result){
        res.status(404).json({message:"Genre Id is wrong!"});
    }
    res.status(200).json({result});
    }catch(error){
        res.status(500).json({message:"Internal Server Error",error:error.message});
    }
})

// Add a New Book:
app.post('/books', async (req, res) => {
    try {
        let { title, description, publicationYear, authorId, genreIds } = req.body;

        // Validate input
        if (!title || !description || !publicationYear || !authorId || !genreIds) {
            return res.status(400).json({ message: "Invalid request body. Check required fields!" });
        }

        console.log("Received authorId:", authorId);

        // Check if author exists
        const author = await Author.findByPk(authorId);
        if (!author) {
            return res.status(404).json({ message: "Invalid Author ID!" });
        }

        // Check for duplicate book title
        const existingBook = await Book.findOne({ where: { title } });
        if (existingBook) {
            return res.status(400).json({ message: "Book with this title already exists!" });
        }

        // Create book
        const newBook = await Book.create({ title, description, publicationYear, authorId });

        // Associate book with genres
        await newBook.addGenres(genres);

        res.status(200).json({ message: " Book added successfully!", book: newBook });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error!", error: error.message });
    }
});


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})