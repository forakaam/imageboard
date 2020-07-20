
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('posts').del()
    .then(function () {
      // Inserts seed entries
      let sec = 0;
      return knex('posts').insert([
        { 
          address: '25191103',
          content: 'Post unsettling images',
          IP: '69.89.31.226',
          uid: '0Q9KWGq4',
          head: true,
          created_at: new Date(new Date().getTime() + 900000000),
          thread_id: 1
        },
        { 
          address: '25191104',
          content: '>>25191103  Creepy!',
          IP: '69.89.31.225',
          uid: 'fzhJEp66',
          head: false,
          created_at: new Date(new Date().getTime() + 900000000),
          thread_id: 1
        },
        {          address: '25191105',
          content: '',
          IP: '69.89.31.226',
          uid: '0Q9KWGq4',
          head: false,
          created_at: new Date(new Date().getTime() + 900000000),
          thread_id: 1
        },
        {          address: '8839518',
          content: `By some miracle of the universe, you are transported to 500BC. Following your paternal line (maternal for femanons), where are you? Who are you? Your social status and livelihood are the Antique equivalents of your current social status and livelihood. How screwed are you?
          >Location:
          >People:
          >Status:
          >Livelihood:
          >Positives:
          >Negatives:`,
          IP: '69.89.31.226',
          uid: '0Q9KWGq4',
          head: true,
          created_at: new Date(new Date().getTime() + 900000000),
          thread_id: 2
        },
        {          address: '88839519',
          content: `>Location: Western Gaul
          >People: Some Gaulish tribe
          >Status: Probably the son of a wealthy landowner or minor noble
          >Livelihood: Some kind of administrator or diplomat
          >Positives: Simple life, natural beauty, tribal qts
          >Negatives: Probably the food, bad medicine, war, no vidya, no books
          Not that fucked. Could be A LOT worse.`,
          IP: '69.89.31.225',
          uid: 'fzhJEp66',
          head: false,
          created_at: new Date(new Date().getTime() + 900000000),
          thread_id: 2
        },
        {          address: '88839600',
          content: `>Sitting somewhere in India (no idea where because am Tamil Brahmin so no clue how far my IE bloodline is from reaching Tamil Nadu). 
          >Medical resident right now and am Brahmin by birth, so probably some village/city doctor and priest?
          >Positives: qt Indian waifu, probably get to live a nice long life treating the sick and the poor without having to worry about the bills, wholesome support from my community for doing what I love
          >Negatives: leaving current qt Chinese waifu, lack of access to much of modern medicine (although Ayurveda was pretty good at finding the plants we get all the modern extracts from anyways), surgery is very risky to do without true general anaesthetic so much unnecessary death, it's 500 BC so no more 4chinz or any social media to occupy my time and no beautiful modern cityscapes to lose myself in (although ancient Indian cities are still beautiful to lose yourself in to this day desu)
          Idk seems like a net positive just because of food security except for the fact that I don't want to leave parents and gf );`,
          IP: '69.89.31.233',
          uid: 'XKT4sFEc',
          head: false,
          created_at: new Date(new Date().getTime() + 900000000),
          thread_id: 2
        },
        {          address: '88839601',
          content: `>>88839600
          India would be cozy`,
          IP: '69.89.31.228',
          uid: 'm4NyHDLV',
          head: false,
          created_at: new Date(new Date().getTime() + 900000000),
          thread_id: 2
        },
        {          address: '88839602',
          content: `    >Location: Northern Gaul
          >People: Belgae probabaly
          >Status: Whatever's just above a slave
          >Livelihood: farming?
          >Positives: im fucked
          >Negatives: literally everything`,
          IP: '69.89.31.333',
          uid: 'FwEfJP4h',
          head: false,
          created_at: new Date(new Date().getTime() + 900000000),
          thread_id: 2
        },
        {          address: '95936237',
          content: `>Possesses a range of four fucking octaves 
          Why do people say this? He also conveyed incredible emotion and had an amazing scream.`,
          IP: '69.89.31.226',
          uid: '0Q9KWGq4',
          head: true,
          created_at: new Date(new Date().getTime() + 900000000),
          thread_id: 3
        },
        {
          address: '95936238',
          content: `>>95936237
    Because people don't know much and in general are kind of dumb`,
          IP: '69.89.33.276',
          uid: 'yzy9IiJZ',
          head: false,
          created_at: new Date(new Date().getTime() + 900000000),
          thread_id: 3
        },
        {
          address: '95936239',
          content: `Cobain had a very impressive vocal range actually. His vocal range was right up there with the likes of Aretha Franklin, Kelly Clarkston, Bob Dylon and even Justin Bieber. He may have been the best all time of screaming pitch perfect tones.
          Check out this list of vocalists and their vocal range. Cobain was no joke: https://www.concerthotels.com/worlds-greatest-vocal-ranges`,
          IP: '69.89.31.626',
          uid: 'kTcuXQaQ',
          head: false,
          created_at: new Date(new Date().getTime() + 900000000),
          thread_id: 3
        },
        {
          address: '95936240',
          content: `>>95936239
          Holy shit, didn't think Thom Yorke would be way up there. Says his highest note is on Just, so did they count his "Ow!" or something?`,
          IP: '69.89.31.226',
          uid: '0Q9KWGq4',
          head: false,
          created_at: new Date(new Date().getTime() + (sec += 300000)),
          thread_id: 3
        }
      ]);
    });
};
