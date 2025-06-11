import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github"
import jwt from "jsonwebtoken";

export const{
    handlers:{GET,POST},
    auth,
    signIn,
    signOut,
}=NextAuth({
    providers:[
        GitHubProvider({
            clientId:process.env.GITHUB_CLIENT_ID,
            clientSecret:process.env.GITHUB_CLIENT_SECRET,
            authorization:{
                params:{
                    prompt:"consent",
                    access_type:"offline",
                    response_type:"code",
                },
            },
        }),
    ],
   session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 10, // 10 days session expiry
  },
  callbacks: {
    async jwt({ token, account, profile }) {
        if (account && profile) {
            token.id = profile.id;        // GitHub ID
            token.email = profile.email;  // GitHub Email
            token.name = profile.name;         // GitHub Display Name (Full name)
            token.username = profile.login;
        }
        return token;
    },
    async session({ session, token }) {
        // Optionally, add custom properties to session.user
        session.user.id = String(token.id);
        // If you want to include the signed JWT, add it as a custom property on session.user
        (session.user as any).jwt = jwt.sign(token, process.env.NEXTAUTH_SECRET!);
        return session;
    },
},

  secret: process.env.NEXTAUTH_SECRET,
});