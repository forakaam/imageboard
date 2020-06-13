
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('threads').del()
    .then(function () {
      // Inserts seed entries
      return knex('threads').insert([
        {id: 1, title: 'Creepy/unsettling images thread', archived: false},
        {id: 2, title: 'You are sent to 500BC...', archived: false},
        {id: 3, title: '>"Dude Kurt was a bad singer"', archived: false}
      ]);
    });
};
