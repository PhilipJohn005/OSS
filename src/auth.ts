import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import jwt from "jsonwebtoken";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          scope: "read:user repo user:email admin:repo_hook",
        },
      },
      profile: async (profile, tokens) => {  //after login github will send user details...we want to shape it how it looks like
        let email = profile.email;

        if (!email) {
          const res = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `token ${tokens.access_token}`,
              Accept: "application/vnd.github.v3+json",
            },
          });
          const emails = await res.json();

          if (!Array.isArray(emails)) {
            throw new Error("Could not fetch emails from GitHub");
          }

          const primary = emails.find((email) => email.primary && email.verified);
          email = primary?.email ?? null;
        }

        // Return an object matching the User type (id as string)
        return {
          id: String(profile.id),
          name: profile.name ?? profile.login ?? null,
          email: email,
          image: profile.avatar_url ?? null,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 10,
  },

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.id = profile.id;
        token.email = profile.email;
        token.name = profile.name;
        token.username = profile.login;
        token.role = 'user'; 
        token.loginProvider = account.provider; 
        token.issuedAt = Date.now();
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = String(token.id);
      (session.user as any).username = token.username;
      (session.user as any).jwt = jwt.sign({
          id: token.id,
          name: token.name,
          email: token.email,
          username: token.username,
          accessToken: token.accessToken,
        },
        process.env.BACKEND_JWT_SECRET!
      );
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,   //signing internal jwt
});
