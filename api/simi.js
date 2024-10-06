const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        const isipesan = req.query.text || 'Halo, apa kabar?';
        const bahasa = req.query.lc || 'id';

        const url = `https://simsimi.vn/web/simtalk?text=${encodeURIComponent(isipesan)}&lc=${bahasa}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "X-Requested-With": "XMLHttpRequest"
            }
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const result = await response.json();
        res.status(200).json(result);

    } catch (error) {
        console.error('Error occurred:', error.message);
        res.status(500).json({ error: 'Terjadi kesalahan saat memanggil API SimSimi', detail: error.message });
    }
};
