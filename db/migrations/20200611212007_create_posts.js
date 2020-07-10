exports.up = function(knex) {
	return knex.schema.createTable("posts", (table) => {
		table.increments();
		table.integer('address');
		table.text('content');
		table.string('IP');
		table.string('name');
		table.string('image');
		table.string('uid');
		table.string('tripcode');
		table.boolean('head');
		table.timestamp('created_at', {precision:  2}).defaultTo(knex.fn.now(2));
		table.integer('thread_id').unsigned().index().references('threads.id').onDelete('CASCADE');
	});	
};

exports.down = function(knex) {
	return knex.schema.dropTable('posts');
};


