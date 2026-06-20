const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://fiesta-pagana.vercel.app';

const tickets = [
  { id: 'FrancoSubcodigo1', nombre: 'Franco' },
  { id: 'FrancoAPT2', nombre: 'Franco' },
  { id: 'FrancoAPT3', nombre: 'Franco' },
  { id: 'ChompaAPT4', nombre: 'Chompa' },
  { id: 'ChompaAPT5', nombre: 'Chompa' },
  { id: 'ChompaAPT6', nombre: 'Chompa' },
  { id: 'MartiAPT7', nombre: 'Marti' },
  { id: 'MartiAPT8', nombre: 'Marti' },
  { id: 'MartiAPT9', nombre: 'Marti' },
  { id: 'LucianaAPT10', nombre: 'Luciana' },
  { id: 'LucianaAPT11', nombre: 'Luciana' },
  { id: 'LucianaAPT12', nombre: 'Luciana' },
  { id: 'AixaAPT13', nombre: 'Aixa' },
  { id: 'AixaAPT14', nombre: 'Aixa' },
  { id: 'AixaAPT15', nombre: 'Aixa' },
  { id: 'BelenAPT16', nombre: 'Belen' },
  { id: 'BelenAPT17', nombre: 'Belen' },
  { id: 'BelenAPT18', nombre: 'Belen' },
  { id: 'GloriaAPT19', nombre: 'Gloria' },
  { id: 'GloriaAPT20', nombre: 'Gloria' },
  { id: 'GloriaAPT21', nombre: 'Gloria' },
  { id: 'OlmoAPT22', nombre: 'Olmo' },
  { id: 'OlmoAPT23', nombre: 'Olmo' },
  { id: 'OlmoAPT24', nombre: 'Olmo' },
  { id: 'TomasAPT25', nombre: 'Tomas' },
  { id: 'TomasAPT26', nombre: 'Tomas' },
  { id: 'TomasAPT27', nombre: 'Tomas' },
  { id: 'FlorAPT28', nombre: 'Flor' },
  { id: 'FlorAPT29', nombre: 'Flor' },
  { id: 'FlorAPT30', nombre: 'Flor' },
  { id: 'OriAPT31', nombre: 'Ori' },
  { id: 'OriAPT32', nombre: 'Ori' },
  { id: 'OriAPT33', nombre: 'Ori' },
  { id: 'DarioAPT34', nombre: 'Dario' },
  { id: 'DarioAPT35', nombre: 'Dario' },
  { id: 'DarioAPT36', nombre: 'Dario' },
  { id: 'JulioAPT37', nombre: 'Julio' },
  { id: 'JulioAPT38', nombre: 'Julio' },
  { id: 'JulioAPT39', nombre: 'Julio' },
  { id: 'UlisesAPT40', nombre: 'Ulises' },
  { id: 'UlisesAPT41', nombre: 'Ulises' },
  { id: 'UlisesAPT42', nombre: 'Ulises' }
];

const outputDir = path.join(__dirname, '..', 'public', 'qrs_generados');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateQRs() {
  console.log(`Generando ${tickets.length} Códigos QR...`);
  
  for (const ticket of tickets) {
    const url = `${SITE_URL}/entrada/${ticket.id}`;
    const filePath = path.join(outputDir, `${ticket.id}.png`);
    
    try {
      await QRCode.toFile(filePath, url, {
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 300,
        margin: 2
      });
      console.log(`✓ Generado: ${ticket.id}.png`);
    } catch (err) {
      console.error(`Error generando ${ticket.id}:`, err);
    }
  }
  
  console.log('¡Todos los QRs han sido generados exitosamente en la carpeta public/qrs_generados!');
}

generateQRs();
