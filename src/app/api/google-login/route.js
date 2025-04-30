import { OAuth2Client } from 'google-auth-library';
import { NextResponse } from 'next/server';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(request) {
  try {
    const { credential } = await request.json();

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;

    // Simulación: autorizamos solo ciertos dominios o emails
    // 👉 Aquí podrías hacer una consulta a tu base de datos si quieres
    let departamentoId;

    if (email.endsWith('@zaragoza.salesianos.edu')) {
      departamentoId = 1; // puedes ajustar esto según el email
    } else if (email === 'dmaicasvalero@gmail.com') {
      departamentoId = 2; // ejemplo de usuario autorizado por su email exacto
    } else {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    return NextResponse.json({
      ok: true,
      email,
      name,
      departamentoId,
    });
  } catch (error) {
    console.error('Error al verificar el token de Google:', error);
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}
