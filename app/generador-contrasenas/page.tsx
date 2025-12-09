import PasswordGeneratorClient from './PasswordGeneratorClient';

export const metadata = {
  title: 'Generador de Contraseñas Seguras y Robustas',
  description: 'Crea passwords imposibles de hackear al instante. Configura longitud y caracteres. Totalmente aleatorio y seguro.',
  keywords: ['password', 'generador', 'contraseña', 'seguridad', 'random', 'online'],
};

export default function PasswordGeneratorPage() {
  return <PasswordGeneratorClient />;
}