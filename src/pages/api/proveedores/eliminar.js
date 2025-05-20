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

  const { cif } = req.body;
  if (!cif) return res.status(400).json({ error: 'CIF requerido' });

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Eliminar de Suministrar y luego de Proveedor
    await connection.execute(`DELETE FROM Suministrar WHERE cif_Proveedor = ?`, [cif]);
    await connection.execute(`DELETE FROM Proveedor WHERE cif = ?`, [cif]);

    await connection.end();
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error al eliminar proveedor:', error);
    return res.status(500).json({ error: 'Error al eliminar proveedor' });
  }
}
