import ImageConverterClient from './ImageConverterClient';

export const metadata = {
    title: 'Conversor de Imágenes (JPG, PNG, WEBP) Privado y Local',
    description: 'Convierte tus imágenes entre JPG, PNG y WEBP sin subir archivos a internet. Rápido, gratis y seguro.',
    keywords: ['convertir imagen', 'jpg', 'png', 'webp', 'converter', 'image', 'online', 'privado'],
};

export default function ImageConverterPage() {
    return <ImageConverterClient />;
}
