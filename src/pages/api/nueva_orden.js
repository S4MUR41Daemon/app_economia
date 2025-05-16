import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

export const config = {
  api: {
    bodyParser: false,
  },
};

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

  const form = formidable({
    uploadDir: path.join(process.cwd(), '/public/uploads'),
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
  });

  try {
    const data = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const get = (field) => Array.isArray(field) ? field[0] : field;

    const proveedor = get(data.fields.proveedor);
    const saldo = parseFloat(get(data.fields.saldo));
    const numInversion = get(data.fields.numInversion);
    const departamento = get(data.fields.departamento);
    const comentarios = get(data.fields.comentarios);
    const pdf = data.files.pdf?.[0];
    const nombrePDF = path.basename(pdf?.filepath || '');
    const fecha = new Date();
    const codigo = `OC-${Date.now()}`;

    const connection = await mysql.createConnection(dbConfig);

    // Insertar orden
    await connection.execute(
      `INSERT INTO Orden_Compra (id_OrdenCompra, fecha, saldo_gastado, comentarios, num_inversion, documento_pdf)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [codigo, fecha, saldo, comentarios, numInversion || null, nombrePDF]
    );

    if (numInversion && numInversion.trim() !== '') {
      const [inv] = await connection.execute(
        `SELECT i.id FROM Inversion i
         JOIN Bolsa b ON i.id_Bolsa_Inversion = b.id
         WHERE b.id_Departamento = ? AND YEAR(b.año) = YEAR(CURDATE())
         ORDER BY i.id ASC LIMIT 1`,
        [departamento]
      );

      const idInversion = inv[0]?.id;
      if (idInversion) {
        await connection.execute(
          `INSERT INTO Orden_Inver (id_OrdenCompra, id_Inversion) VALUES (?, ?)`,
          [codigo, idInversion]
        );

        await connection.execute(
          `UPDATE Inversion SET cantidad = cantidad - ? WHERE id = ?`,
          [saldo, idInversion]
        );
      }
    } else {
      const [pres] = await connection.execute(
        `SELECT p.id FROM Presupuesto p
         JOIN Bolsa b ON p.id_Bolsa_Presupuesto = b.id
         WHERE b.id_Departamento = ? AND YEAR(b.año) = YEAR(CURDATE())
         ORDER BY p.id ASC LIMIT 1`,
        [departamento]
      );

      const idPresupuesto = pres[0]?.id;
      if (idPresupuesto) {
        await connection.execute(
          `INSERT INTO Orden_Pres (id_OrdenCompra, id_Presupuesto) VALUES (?, ?)`,
          [codigo, idPresupuesto]
        );

        await connection.execute(
          `UPDATE Presupuesto SET cantidad = cantidad - ? WHERE id = ?`,
          [saldo, idPresupuesto]
        );
      }
    }

    await connection.execute(
      `INSERT INTO Pedir (codigo_OrdenCompra, cif_Proveedor) VALUES (?, ?)`,
      [codigo, proveedor]
    );

    await connection.end();
    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Error al procesar nueva orden:', error);
    return res.status(500).json({ error: 'Error al subir la orden' });
  }
}
