
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('images').del()
    .then(function () {
      // Inserts seed entries
      return knex('images').insert([
        {
          filename: '1591692573308.jpg',
          filesize: '99.64 KB',
          height: '1200',
          post_id: 1,
          width:'1600'        
        },        
        {
          filename: '1591702978091.jpg',
          filesize: '582.91 KB',
          height: '1008',
          post_id: 2,
          width: '1280' 
        },        
        {
          filename: '1591724924905.jpg',
          filesize: '25.73 KB',
          height: '455',
          post_id: 3,
          width: '674'
        },        
        {
          filename: '1591854487873.jpg',
          filesize: '174.22 KB',
          height: '682',
          post_id: 4,
          width: '1200'
        },        
        {
          filename: '1591854971169.jpg',
          filesize: '28.19 KB',
          height: '394',
          post_id: 5,
          width: '262'
        },        
        {
          filename: '1591855004718.png',
          filesize: '1.17 MB',
          height: '1600',
          post_id: 6,
          width: '1600'
        },        
        {
          filename: '1591921503473.gif',
          filesize: '837.97 KB',
          height: '224',
          post_id: 9,
          width: '280'
        },
        {
          filename: '1591921503473.gif',
          filesize: '837.97 KB',
          height: '224',
          post_id: 9,
          width: '280'
        }
      ]);
    });
};
