const fetch = require('node-fetch');
const FormData = require('form-data');

// Gantilah dengan PCloud access token kamu
const ACCESS_TOKEN = 'TkMdBVZuYY97ZDcRhn7dTET4Yo6P3N4OlNJSbwpjy';

// Gantilah dengan folderid yang valid dari PCloud kamu
const FOLDER_ID = '0';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ambil file name dan file buffer dari request body
    const { fileName, fileBuffer } = req.body;

    if (!fileName || !fileBuffer) {
      return res.status(400).json({ error: 'File name or content missing' });
    }

    // Buat form data untuk upload file
    const form = new FormData();
    form.append('filename', fileName);
    form.append('file', Buffer.from(fileBuffer, 'base64'), { filename: fileName });

    // URL API PCloud dengan folderid yang sudah ditentukan
    const apiUrl = `https://api.pcloud.com/uploadfile?auth=${ACCESS_TOKEN}&folderid=${FOLDER_ID}`;

    // Kirim request POST ke PCloud API untuk upload file
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: form,
    });

    const data = await response.json();

    if (data.result === 0) {
      // Jika upload berhasil
      return res.status(200).json({ message: 'File uploaded successfully', data });
    } else {
      // Jika ada kesalahan dalam upload
      return res.status(500).json({ error: 'Failed to upload file', details: data });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
