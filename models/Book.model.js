const {DataTypes, sequelize} = require('../lib/index');
const{Author} = require('../models/Author.model');
const{Genre} = require('../models/Genre.model');

const Book = sequelize.define("Book",{
    title : DataTypes.STRING,
    description : DataTypes.TEXT,
    publicationYear :DataTypes.INTEGER
})
// Associations
Book.belongsTo(Author ,  {
    foreignKey: {
      name: "authorId",
      allowNull: false,
    },
  }); // One book belongs to one author

Book.belongsToMany(Genre, { through: 'BookGenres' ,foreignKey: "bookId"}); // Many-to-many relationship with Genre
Genre.belongsToMany(Book, { through: 'BookGenres', foreignKey:"genreId" }); // Many-to-many relationship with Book

module.exports={
    Book
}