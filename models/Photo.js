const User = require("./User");

module.exports = (bookshelf) => {
	return bookshelf.model('Photo', {
		tableName: 'photo',
        albums() {
            return this.belongsToMany('Album')
        },
        user() {
            return this.belongsTo('User')
        }
    }, {
        async fetchById(id, fetchOptions = {}) {
            return await new this({ id }).fetch(fetchOptions); 
    },
	});
};