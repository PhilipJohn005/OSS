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

                },
            },
        }),
    ],
});