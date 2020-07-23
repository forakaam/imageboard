
exports.up = function(knex) {
  	return knex.schema.createTable("likes", (table) => {
		table.increments();
		table.string('IP');
		table.integer('post_id').unsigned().index().references('posts.id').onDelete('CASCADE');
	});
};

exports.down = function(knex) {
	return knex.schema.dropTable('likes');
};
