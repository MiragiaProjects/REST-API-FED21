module.exports = (bookshelf) => {
	return bookshelf.model('User', {
		tableName: 'user',
        albums() {
            return this.hasMany('Album');
        },
        photos() {
            return this.hasMany('Photo');
        }
    }, {
        async fetchById(id, fetchOptions = {}) {
            return await new this({ id }).fetch(fetchOptions); 
    },
	});
};