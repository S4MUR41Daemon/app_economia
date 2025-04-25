import { Inter } from 'next/font/google';
import '../globals.css';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: "Nueva Orden",
  description: "Formulario de nueva orden de compra",
};

export default function NuevaOrdenLayout({ children }) {
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
