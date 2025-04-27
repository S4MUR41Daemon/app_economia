import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const idDepartamento = searchParams.get('departamento'); // recogerá el departamento que se seleccione

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      `
      SELECT DISTINCT
        oc.codigo,
        oc.fecha,
        oc.saldo_gastado,
        p.nombre AS nombreProveedor,
        oc.comentarios
      FROM Orden_Compra oc
      INNER JOIN Pedir pe ON oc.codigo = pe.codigo_OrdenCompra
      INNER JOIN Proveedor p ON pe.cif_Proveedor = p.cif
      INNER JOIN Suministrar s ON p.cif = s.cif_Proveedor
      INNER JOIN Departamento d ON s.id_Departamento = d.id_departamento
      INNER JOIN Orden_Inver oi ON oc.codigo = oi.id_Orden_Inver
      WHERE d.id_departamento = ?
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
