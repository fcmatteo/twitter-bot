const request = require('./request');
const checkMentions = require('./checkMentions');

const endpoint = 'https://api.twitter.com/1.1/statuses/mentions_timeline.json';

async function adInfinitum() {
  console.log('Checking mentions');
  const response = await request('get', endpoint);
  checkMentions(response.data);
  setTimeout(adInfinitum, 15000);
}

adInfinitum();
