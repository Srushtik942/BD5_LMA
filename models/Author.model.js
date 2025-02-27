const {DataTypes, sequelize} = require('../lib/index');

const Author = sequelize.define("Author",{
    name : DataTypes.STRING,
    birthdate : DataTypes.DATE,
    email : DataTypes.STRING
});
module.exports = {
    Author
}