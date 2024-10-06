const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // Ambil text dan lc dari query URL, default lc ke 'id' (bahasa Indonesia)
    const isipesan = req.query.text || 'Halo, apa kabar?';
    const bahasa = req.query.lc || 'id'; // Default bahasa 'id' untuk Indonesia

    // URL API SimSimi
    const url = `https://simsimi.vn/web/simtalk?text=${encodeURIComponent(isipesan)}&lc=${bahasa}`;

    try {
        // Fetch API SimSimi dengan GET
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "X-Requested-With": "XMLHttpRequest"
            }
        });

        const result = await response.json();

        // Kirim hasil respons dari SimSimi ke klien
        res.json(result);

    } catch (error) {
        // Jika terjadi error
        res.status(500).json({ error: 'Terjadi kesalahan saat memanggil API SimSimi' });
    }
};
