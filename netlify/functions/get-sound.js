// netlify/functions/get-sounds.js
const path = require('path');
const fs = require('fs');
const soundsDir = path.join(__dirname, '..', 'sounds');

exports.handler = async (event, context) => {
  try {
    const files = fs.readdirSync(soundsDir);
    if (files.length === 0) {
      return {
        statusCode: 404,
        body: 'Všechny nahrávky ohodnoceny. Děkuji, pane doktore, za Vaši práci!',
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(files),
    };
  } catch (err) {
    console.error('Error reading sounds directory:', err);
    return {
      statusCode: 500,
      body: 'Error reading sounds directory',
    };
  }
};