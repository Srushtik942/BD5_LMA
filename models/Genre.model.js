const {DataTypes, sequelize} = require('../lib/index');

const Genre = sequelize.define("Genre",{
    name : DataTypes.STRING,
    description : DataTypes.TEXT,
});

module.exports = {
    Genre
}