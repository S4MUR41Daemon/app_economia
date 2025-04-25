import { Inter } from 'next/font/google';
import '../globals.css';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: "Bolsa de Inversiones",
  description: "Últimas órdenes de inversión",
};

export default function BolsaInversionesLayout({ children }) {
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
