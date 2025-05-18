import fs from 'fs';
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

  try {
    const { codigo, documento_pdf } = req.body;

    if (!codigo) {
      return res.status(400).json({ error: 'Código de orden requerido' });
    }

    const connection = await mysql.createConnection(dbConfig);

    // Eliminar de Pedir
    await connection.execute(`DELETE FROM Pedir WHERE codigo_OrdenCompra = ?`, [codigo]);

    // Eliminar de Orden_Pres y Orden_Inver (ambas por si acaso)
    await connection.execute(`DELETE FROM Orden_Pres WHERE id_OrdenCompra = ?`, [codigo]);
    await connection.execute(`DELETE FROM Orden_Inver WHERE id_OrdenCompra = ?`, [codigo]);

    // Eliminar de Bolsa si está huérfana (esto no siempre aplica, así que envolvemos en try/catch)
    try {
      await connection.execute(`DELETE FROM Bolsa WHERE id IN (
        SELECT b.id FROM Bolsa b
        LEFT JOIN Presupuesto p ON b.id = p.id_Bolsa_Presupuesto
        LEFT JOIN Inversion i ON b.id = i.id_Bolsa_Inversion
        WHERE b.cantidad = 0 AND b.año = CURDATE()
      )`);
    } catch (err) {
      console.warn('Ninguna bolsa eliminada o error ignorado:', err.message);
    }

    // Eliminar orden principal
    await connection.execute(`DELETE FROM Orden_Compra WHERE id_OrdenCompra = ?`, [codigo]);

    await connection.end();

    // Eliminar PDF si existe
    if (documento_pdf) {
      const filePath = path.join(process.cwd(), 'public', 'uploads', documento_pdf);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    return res.status(200).json({ ok: true, message: 'Consulta eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar la orden:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}
