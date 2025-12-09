import JsonFormatterClient from './JsonFormatterClient';

export const metadata = {
    title: 'Conversor JSON a CSV y CSV a JSON Online | Transformador de Datos',
    description: 'Convierte datos entre formatos JSON y CSV rápidamente. Limpia y formatea tu JSON y CSV gratis y sin registro.',
    keywords: ['json', 'csv', 'converter', 'formatter', 'json to csv', 'csv to json', 'online tool'],
};

export default function JsonFormatterPage() {
    return <JsonFormatterClient />;
}
