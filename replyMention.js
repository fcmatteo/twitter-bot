const request = require('./request');
const createImage = require('./createImage');

module.exports = async function replyMention(mention) {
  const response = await request(
    'get',
    'https://api.twitter.com/1.1/statuses/show.json',
    {
      params: {
        id: mention.in_reply_to_status_id_str,
      },
    },
  );

  const img = await createImage(
    response.data.text,
    response.data.user.profile_image_url_https,
  );

  const upload = await request(
    'post',
    'https://upload.twitter.com/1.1/media/upload.json',
    {
      body: {
        media: img,
      },
    },
    true,
  );
  const imageId = upload.data.media_id_string;

  await request('post', 'https://api.twitter.com/1.1/statuses/update.json', {
    params: {
      status: '😘',
      in_reply_to_status_id: mention.id_str,
      auto_populate_reply_metadata: true,
      media_ids: [imageId],
    },
  });
};
