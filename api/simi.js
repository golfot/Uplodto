const fetch = require('node-fetch');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { isipesan } = req.body;

    if (!isipesan) {
        return res.status(400).json({ error: 'isipesan is required' });
    }

    try {
        // Mengirim request ke API SimSimi
        const response = await fetch('https://simsimi.vn/web/simtalk', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: `text=${encodeURIComponent(isipesan)}&lc=id&=`
        });

        // Parsing response dari SimSimi
        const data = await response.json();

        // Mengirim response JSON ke client
        res.status(200).json({ response: data });
    } catch (error) {
        console.error('Error fetching from SimSimi:', error);
        res.status(500).json({ error: 'Something went wrong!' });
    }
};
