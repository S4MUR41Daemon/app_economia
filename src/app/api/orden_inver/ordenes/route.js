import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idDepartamento = parseInt(searchParams.get('departamento'));

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      `
      SELECT 
        oc.id_OrdenCompra AS codigo,
        oc.fecha,
        oc.saldo_gastado,
        oc.documento_pdf, -- 👈 AÑADIDO AQUÍ TAMBIÉN
        d.tipo AS nombreDepartamento,
        p.nombre AS nombreProveedor,
        oc.comentarios
      FROM Orden_Compra oc
      INNER JOIN Orden_Inver oi ON oc.id_OrdenCompra = oi.id_OrdenCompra
      LEFT JOIN Inversion i ON oi.id_Inversion = i.id
      LEFT JOIN Bolsa b ON i.id_Bolsa_Inversion = b.id
      LEFT JOIN Departamento d ON b.id_Departamento = d.id
      LEFT JOIN Pedir pe ON pe.codigo_OrdenCompra = oc.id_OrdenCompra
      LEFT JOIN Proveedor p ON pe.cif_Proveedor = p.cif
      WHERE (d.id = ? OR d.id IS NULL)
      ORDER BY oc.fecha DESC
      LIMIT 10
      `,
      [idDepartamento]
    );

    await connection.end();
    return NextResponse.json({ ordenes: rows });
  } catch (error) {
    console.error('Error al cargar órdenes de inversión:', error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
