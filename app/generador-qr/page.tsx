import QrGeneratorClient from './QrGeneratorClient';

export const metadata = {
    title: 'Generador de Códigos QR Online | Gratis y Seguro',
    description: 'Crea códigos QR personalizados para URLs, WiFi, Texto o Email. Descarga en PNG o SVG. Sin registro y 100% privado.',
    keywords: ['qr', 'generador qr', 'crear qr', 'codigo qr', 'wifi qr', 'qr code generator', 'online', 'privado'],
};

export default function QrGeneratorPage() {
    return <QrGeneratorClient />;
}
