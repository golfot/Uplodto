const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

// Font size list
const size = [25, 32, 16, 40];

// Load fonts
registerFont(path.join(__dirname, '../font/Arrial.ttf'), { family: 'Arial' });
registerFont(path.join(__dirname, '../font/Sign.ttf'), { family: 'Sign' });
registerFont(path.join(__dirname, '../font/Ocr.ttf'), { family: 'Ocr' });

// Load data from data.json
const data = require('../data.json');

module.exports = async (req, res) => {
  try {
    // Load template and pas photo
    const templatePath = path.join(__dirname, '../public/Template.png');
    const photoPath = path.join(__dirname, '../public/bronya(1).jpg');
    
    const template = await loadImage(templatePath);
    const pasPhoto = await loadImage(photoPath);

    // Create canvas with the same size as template
    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext('2d');

    // Draw template on canvas
    ctx.drawImage(template, 0, 0);

    // Resize and crop pas photo if needed
    const photoSize = { width: 432, height: 450 };
    if (pasPhoto.width !== photoSize.width) {
      const croppedPhoto = ctx.drawImage(pasPhoto, 0, 0, photoSize.width, photoSize.height);
      ctx.drawImage(croppedPhoto, 520, 140, Math.round(pasPhoto.width * 0.4), Math.round(pasPhoto.height * 0.4));
    } else {
      ctx.drawImage(pasPhoto, 520, 140, Math.round(pasPhoto.width * 0.4), Math.round(pasPhoto.height * 0.4));
    }

    // Font settings for different parts
    ctx.font = `${size[0]}px Arial`;  // Font for provinsi
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(`PROVINSI ${data.provinsi.toUpperCase()}`, 380, 45);
    ctx.fillText(`KOTA ${data.kota.toUpperCase()}`, 380, 70);

    ctx.font = `${size[1]}px Ocr`;  // Font for NIK
    ctx.textAlign = 'left';
    ctx.fillText(data.nik, 170, 105);

    ctx.font = `${size[2]}px Arial`;  // Font for data
    ctx.fillText(data.nama.toUpperCase(), 190, 145);
    ctx.fillText(data.ttl.toUpperCase(), 190, 168);
    ctx.fillText(data.jenis_kelamin.toUpperCase(), 190, 191);
    ctx.fillText(data.golongan_darah.toUpperCase(), 463, 190);
    ctx.fillText(data.alamat.toUpperCase(), 190, 212);
    ctx.fillText(data["rt/rw"].toUpperCase(), 190, 234);
    ctx.fillText(data.kel_desa.toUpperCase(), 190, 257);
    ctx.fillText(data.kecamatan.toUpperCase(), 190, 279);
    ctx.fillText(data.agama.toUpperCase(), 190, 300);
    ctx.fillText(data.status.toUpperCase(), 190, 323);
    ctx.fillText(data.pekerjaan.toUpperCase(), 190, 346);
    ctx.fillText(data.kewarganegaraan.toUpperCase(), 190, 369);
    ctx.fillText(data.masa_berlaku.toUpperCase(), 190, 390);

    // Kota dan tanggal
    ctx.fillText(`KOTA ${data.kota.toUpperCase()}`, 553, 340);
    ctx.fillText(data.terbuat, 570, 360);

    // Font for signature
    ctx.font = `${size[3]}px Sign`;
    const sign = data.nama.split(' ')[0];  // Ambil nama depan sebagai tanda tangan
    ctx.fillText(sign, 540, 395);

    // Save the result image
    const outputPath = path.join(__dirname, '../public/result.png');
    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on('finish', () => {
      res.status(200).send('E-KTP Generated!');
    });

  } catch (error) {
    res.status(500).send('Error generating E-KTP: ' + error.message);
  }
};
