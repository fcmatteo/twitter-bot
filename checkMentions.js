const replyMention = require('./replyMention');
const fs = require('fs');

const rawdata = fs.readFileSync('lastProcessed.json');
let data = new Set(JSON.parse(rawdata));
let newData;

function loopThroughMentions(mentions) {
  let enough = false;
  let i = 0;
  while (!enough) {
    if (i === mentions.length || data.has(mentions[i].id_str)) {
      enough = true;
      return;
    }

    const mention = mentions[i];

    newData.add(mention.id_str);
    if (mention.in_reply_to_status_id) {
      replyMention(mention);
    }
    i++;
  }
}

module.exports = function checkMentions(mentions) {
  newData = new Set([]);

  if (mentions.length === 0) {
    return;
  }

  loopThroughMentions(mentions);

  if (newData.size > 0) {
    data = newData;
    fs.writeFileSync('lastProcessed.json', JSON.stringify(Array.from(data)));
  }
};
