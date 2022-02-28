module.exports = (bookshelf) => {
	return bookshelf.model('Album', {
		tableName: 'albums',
        photos() {
            return this.hasMany('Photo');
        },
        users() {
            return this.belongsTo('User')
        }
	});
};