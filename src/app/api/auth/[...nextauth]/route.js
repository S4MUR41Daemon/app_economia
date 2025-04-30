import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import mysql from 'mysql2/promise';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        const connection = await mysql.createConnection({
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        });

        const [usuarios] = await connection.execute(
          `SELECT id, rol FROM Usuario WHERE email = ?`,
          [profile.email]
        );

        if (usuarios.length === 0) return null;

        const usuario = usuarios[0];
        token.userId = usuario.id;
        token.rol = usuario.rol;

        const [deps] = await connection.execute(
          `SELECT d.id, d.tipo FROM Usuario_Departamento ud
           JOIN Departamento d ON ud.id_Departamento = d.id
           WHERE ud.id_Usuario = ?`,
          [usuario.id]
        );

        token.departamentos = deps;

        await connection.end();
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.userId;
      session.user.rol = token.rol;
      session.user.departamentos = token.departamentos;
      return session;
    }
  }
});

export { handler as GET, handler as POST };
