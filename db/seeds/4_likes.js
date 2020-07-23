
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('likes').del()
    .then(function () {
      // Inserts seed entries
      return knex('likes').insert([
        {
          IP: '69.89.31.225',
          post_id: 1
        },        
        {
          IP: '69.89.31.226',
          post_id: 1
        },        
        {
          IP: '69.89.31.227',
          post_id: 1
        },        
        {
          IP: '69.89.31.228',
          post_id: 2
        },        
        {
          IP: '69.89.31.226',
          post_id: 2
        },        
        {
          IP: '69.89.31.226',
          post_id: 3
        },        
        {
          IP: '69.89.31.227',
          post_id: 3
        },        
        {
          IP: '69.89.31.228',
          post_id: 3
        },        
        {
          IP: '69.89.31.229',
          post_id: 3
        },        
        {
          IP: '69.89.31.230',
          post_id: 3
        }
      ]);
    });
};
