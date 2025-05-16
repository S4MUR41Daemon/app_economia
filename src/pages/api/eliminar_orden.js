import fs from 'fs/promises';
import path from 'path';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { codigo, documento_pdf } = req.body;

  if (!codigo || !documento_pdf) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Eliminar registros relacionados
    await connection.execute('DELETE FROM Pedir WHERE codigo_OrdenCompra = ?', [codigo]);
    await connection.execute('DELETE FROM Orden_Inver WHERE id_OrdenCompra = ?', [codigo]);
    await connection.execute('DELETE FROM Orden_Pres WHERE id_OrdenCompra = ?', [codigo]);
    await connection.execute('DELETE FROM Bolsa WHERE id_OrdenCompra = ?', [codigo]); // solo si lo hubieras vinculado directamente, si no omite esta línea

    // Eliminar la orden principal
    await connection.execute('DELETE FROM Orden_Compra WHERE id_OrdenCompra = ?', [codigo]);
    await connection.end();

    // Eliminar archivo PDF si existe
    const filePath = path.join(process.cwd(), 'public', 'uploads', documento_pdf);
    await fs.unlink(filePath);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error al eliminar orden:', error);
    return res.status(500).json({ error: 'Error al eliminar orden' });
  }
}
