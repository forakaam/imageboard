exports.up = function(knex) {
	return knex.schema.createTable('threads', (table) => {
		table.increments();
		table.string('subject');
		table.boolean('archived');
	});
};

exports.down = function(knex) {
	return knex.schema.dropTable('threads');
};



