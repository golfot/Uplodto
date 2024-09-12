const fetch = require('node-fetch');
const FormData = require('form-data');

// Gantilah dengan PCloud access token kamu
const ACCESS_TOKEN = 'your_pcloud_access_token';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileName, fileBuffer } = req.body;

    if (!fileName || !fileBuffer) {
      return res.status(400).json({ error: 'File name or content missing' });
    }

    const form = new FormData();
    form.append('filename', fileName);
    form.append('file', Buffer.from(fileBuffer, 'base64'), { filename: fileName });

    const response = await fetch(`https://api.pcloud.com/uploadfile?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      body: form
    });

    const data = await response.json();

    if (data.result === 0) {
      return res.status(200).json({ message: 'File uploaded successfully', data });
    } else {
      return res.status(500).json({ error: 'Failed to upload file', details: data });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
