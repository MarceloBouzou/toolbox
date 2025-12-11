import type { Metadata } from 'next';
import RandomDataClient from './RandomDataClient';

export const metadata: Metadata = {
    title: 'Generador de Datos y Azar | La Caja de Herramientas Digital',
    description: 'Herramientas gratuitas para generar números aleatorios, sorteos y UUID/GUIDs v4 para desarrollo y testing.',
    keywords: 'generador numeros aleatorios, random numbers, uuid generator, guid generator, random data tool',
};

export default function RandomDataPage() {
    return <RandomDataClient />;
}
