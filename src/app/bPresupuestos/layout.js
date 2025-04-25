import { Inter } from 'next/font/google';
import '../globals.css';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: "Bolsa de Presupuestos",
  description: "Últimas órdenes de presupuesto",
};

export default function BolsaPresupuestosLayout({ children }) {
  return (
    <>
      <Header />
      <main className={`${inter.variable} nuevaOrdenMain`}>
        {children}
      </main>
      <Footer />
    </>
  );
}
