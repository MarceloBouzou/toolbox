import TextToolsClient from './TextToolsClient';

export const metadata = {
    title: 'Herramientas de Texto Online: Limpiar, Formatear y Extraer',
    description: 'Utilidades de texto gratis: pasar a mayúsculas, eliminar espacios, extraer emails y URLs. Procesamiento local instantáneo.',
    keywords: ['texto', 'editor', 'limpiar', 'formatear', 'mayusculas', 'extraer emails', 'online'],
};

export default function TextToolsPage() {
    return <TextToolsClient />;
}
