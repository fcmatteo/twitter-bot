const axios = require('axios');
const querystring = require('querystring');
const FormData = require('form-data');
const crypto = require('crypto');
const {
  API_KEY,
  ACCESS_TOKEN,
  API_KEY_SECRET,
  ACCESS_TOKEN_SECRET,
} = require('./config');

const oauthVersion = '1.0';
const signatureMethod = 'HMAC-SHA1';

function sorted(o) {
  let p = Object.create(null);
  for (const k of Object.keys(o).sort()) p[k] = o[k];
  return p;
}

const addQuote = (str) => `"${str}"`;

module.exports = async function request(
  method,
  endpoint,
  options = {},
  isUpload = false,
) {
  try {
    const timestamp = parseInt(Date.now() / 1000, 10);
    const nonce = crypto.randomBytes(32).toString('hex');
    const parameters = {
      oauth_consumer_key: API_KEY,
      oauth_nonce: nonce,
      oauth_token: ACCESS_TOKEN,
      oauth_version: oauthVersion,
      oauth_signature_method: signatureMethod,
      oauth_timestamp: timestamp,
      ...(!isUpload
        ? {
            ...options.params,
            //...options.body,
          }
        : {}),
    };

    const parameterString = querystring.stringify(sorted(parameters));

    const signingValue = `${method.toUpperCase()}&${encodeURIComponent(
      endpoint,
    )}&${encodeURIComponent(parameterString)}`;

    const signingKey = `${encodeURIComponent(
      API_KEY_SECRET,
    )}&${encodeURIComponent(ACCESS_TOKEN_SECRET)}`;

    const signature = crypto
      .createHmac('sha1', signingKey)
      .update(signingValue)
      .digest('base64');

    const finalEndpoint = options.params
      ? `${endpoint}?${querystring.stringify(options.params)}`
      : endpoint;

    let data = options.body;

    if (method.toLowerCase() === 'post' && isUpload) {
      const form = new FormData();
      form.append('media', data.media);
      data = form;
      const response = await axios.post(finalEndpoint, data.getBuffer(), {
        headers: {
          Authorization: `OAuth oauth_consumer_key="${encodeURIComponent(
            API_KEY,
          )}", oauth_nonce="${encodeURIComponent(
            nonce,
          )}", oauth_signature=${addQuote(
            encodeURIComponent(signature),
          )}, oauth_signature_method="${encodeURIComponent(
            signatureMethod,
          )}", oauth_timestamp="${encodeURIComponent(
            timestamp,
          )}", oauth_token="${encodeURIComponent(
            ACCESS_TOKEN,
          )}", oauth_version="${encodeURIComponent(oauthVersion)}"`,
          ...data.getHeaders(),
        },
      });
      return response;
    }

    const response = await axios.request({
      url: finalEndpoint,
      method: method.toLowerCase(),
      headers: {
        Authorization: `OAuth oauth_consumer_key="${encodeURIComponent(
          API_KEY,
        )}", oauth_nonce="${encodeURIComponent(
          nonce,
        )}", oauth_signature=${addQuote(
          encodeURIComponent(signature),
        )}, oauth_signature_method="${encodeURIComponent(
          signatureMethod,
        )}", oauth_timestamp="${encodeURIComponent(
          timestamp,
        )}", oauth_token="${encodeURIComponent(
          ACCESS_TOKEN,
        )}", oauth_version="${encodeURIComponent(oauthVersion)}"`,
      },
      ...(options.body ? { data } : {}),
    });
    return response;
  } catch (e) {
    console.log(e.message);
    console.log(e.response.data);
  }
};
