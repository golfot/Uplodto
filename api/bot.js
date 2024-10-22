const fetch = require('node-fetch');

// Fungsi untuk membuat email acak
function generateRandomEmail() {
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `user${randomStr}@example.com`;
}

// Fungsi untuk melakukan pendaftaran
module.exports = async (req, res) => {
  const email = generateRandomEmail();
  const bodyData = {
    "email": email,
    "password": "tesku123",
    "ref_code": "fb92933540a04cd9bad29f39"
  };

  try {
    const response = await fetch('https://api.undress.cc/login/local/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://undress.cc',
        'Referer': 'https://undress.cc'
      },
      body: JSON.stringify(bodyData)
    });

    const result = await response.json();
    if (response.ok) {
      console.log(`Pendaftaran sukses dengan email: ${email}`);
      res.status(200).json({ message: `Pendaftaran sukses dengan email: ${email}`, result });
    } else {
      console.log(`Pendaftaran gagal: ${result.message}`);
      res.status(400).json({ message: `Pendaftaran gagal: ${result.message}` });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server', error });
  }
};
