import { Inter } from 'next/font/google';
import '../globals.css';
import Footer from '../components/footer/footer';
import Header from '../components/header/header';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: "Nueva orden",
  description: "Formulario de nueva orden",
};

export default function NuevaOrdenLayout({ children }) {
    return (
      <html lang="es">
        <body className={`${inter.variable}`}>
          <div className="nuevaOrdenWrapper">
            <Header />
            <main className="nuevaOrdenMain">{children}</main>
            <Footer />
          </div>
        </body>
      </html>
    );
  }
  
