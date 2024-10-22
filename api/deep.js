const fetch = require('node-fetch');

// Fungsi untuk membuat email acak
function generateRandomEmail() {
  const randomStr = Math.random().toString(36).substring(2, 10);
  return `user${randomStr}@sayurals.com`;
}

// Fungsi untuk melakukan pendaftaran
async function registerAccount() {
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
      return { success: true, message: `Pendaftaran sukses dengan email: ${email}`, result };
    } else {
      console.log(`Pendaftaran gagal: ${result.message}`);
      return { success: false, message: `Pendaftaran gagal: ${result.message}` };
    }
  } catch (error) {
    console.error('Error:', error);
    return { success: false, message: 'Terjadi kesalahan server', error };
  }
}

// Fungsi utama untuk menangani permintaan pendaftaran otomatis
module.exports = async (req, res) => {
  const { autoregis } = req.query; // Ambil parameter autoregis dari query
  const count = parseInt(autoregis, 10) || 1; // Default ke 1 jika tidak ada parameter atau invalid

  if (count < 1) {
    return res.status(400).json({ message: "Jumlah harus lebih dari 0." });
  }

  const results = [];

  for (let i = 0; i < count; i++) {
    const result = await registerAccount();
    results.push(result);
    // Tunggu 2 detik sebelum mendaftar akun berikutnya
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  res.status(200).json({ message: "Pendaftaran selesai", results });
};
