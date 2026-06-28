const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://fiesta-pagana.vercel.app';

const tickets = [
  { id: 'Adicional_1', nombre: 'General' },
  { id: 'Adicional_2', nombre: 'General' },
  { id: 'Adicional_3', nombre: 'General' },
  { id: 'Adicional_4', nombre: 'General' },
  { id: 'Adicional_5', nombre: 'General' },
  { id: 'Adicional_6', nombre: 'General' },
  { id: 'Adicional_7', nombre: 'General' },
  { id: 'Adicional_8', nombre: 'General' },
  { id: 'Adicional_9', nombre: 'General' },
  { id: 'Adicional_10', nombre: 'General' },
  { id: 'Adicional_11', nombre: 'General' },
  { id: 'Adicional_12', nombre: 'General' },
  { id: 'Adicional_13', nombre: 'General' },
  { id: 'Adicional_14', nombre: 'General' },
  { id: 'Adicional_15', nombre: 'General' },
  { id: 'Adicional_16', nombre: 'General' },
  { id: 'Adicional_17', nombre: 'General' },
  { id: 'Adicional_18', nombre: 'General' },
  { id: 'Adicional_19', nombre: 'General' },
  { id: 'Adicional_20', nombre: 'General' },
  { id: 'Adicional_21', nombre: 'General' },
  { id: 'Adicional_22', nombre: 'General' },
  { id: 'Adicional_23', nombre: 'General' },
  { id: 'Adicional_24', nombre: 'General' },
  { id: 'Adicional_25', nombre: 'General' },
  { id: 'Adicional_26', nombre: 'General' },
  { id: 'Adicional_27', nombre: 'General' },
  { id: 'Adicional_28', nombre: 'General' },
  { id: 'Adicional_29', nombre: 'General' },
  { id: 'Adicional_30', nombre: 'General' }
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
