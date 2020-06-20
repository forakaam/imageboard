
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('threads').del()
    .then(function () {
      // Inserts seed entries
      return knex('threads').insert([
        {subject: 'Creepy/unsettling images thread', archived: false},
        {subject: 'You are sent to 500BC...', archived: false},
        {subject: '>"Dude Kurt was a bad singer"', archived: false}
      ]);
    });
};
