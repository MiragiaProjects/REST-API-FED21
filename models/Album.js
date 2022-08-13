module.exports = (bookshelf) => {
	return bookshelf.model('Album', {
		tableName: 'album',
        photos() {
            return this.belongsToMany('Photo');
        },
        users() {
            return this.belongsTo('User')
        },
    }, {
        async fetchById(id, fetchOptions = {}) {
            return await new this({ id }).fetch(fetchOptions); 
    },
	});
};