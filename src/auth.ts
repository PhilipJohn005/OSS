import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github"

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
    session:{
        strategy:"jwt",
        maxAge:60*60*24*10
    },
    secret: process.env.NEXTAUTH_SECRET,

    callbacks:{
        async jwt({ token, user, account, profile, isNewUser }) {
            console.log("JWT callback token (payload):", token);
            return token;
        },
        async session({ session, token, user }) {
            console.log("Session callback session:", session);
            return session;
        },
    }
});