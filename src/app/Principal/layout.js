import { Inter } from 'next/font/google';
import '../globals.css';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: "Página Principal",
  description: "Panel de control de saldos y órdenes",
};

export default function PrincipalLayout({ children }) {
  return (
    <>
      <Header />
      <main className={inter.variable}>
        {children}
      </main>
      <Footer />
    </>
  );
}
