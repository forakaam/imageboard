exports.up = function(knex) {
	return knex.schema.createTable("images", (table) => {
		table.increments();
		table.string('filename');
		table.string('width');
		table.string('height');
		table.string('filesize');
		table.integer('post_id').unsigned().index().references('posts.id').onDelete('CASCADE');
	});	
};

exports.down = function(knex) {
	return knex.schema.dropTable('images');
};


