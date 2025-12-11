import type { Metadata } from 'next';
import GastosCompartidosClient from './GastosCompartidosClient';

export const metadata: Metadata = {
    title: 'Cuentas Claras - División de Gastos | La Caja de Herramientas Digital',
    description: 'Calculadora gratuita para dividir gastos entre amigos. Calcula quién le debe a quién en asados, viajes y juntadas. Copia el resumen para WhatsApp.',
    keywords: 'dividir gastos, calculadora gastos compartidos, cuentas claras, split bills, gastos viaje amigos',
};

export default function GastosCompartidosPage() {
    return <GastosCompartidosClient />;
}
