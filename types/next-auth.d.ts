import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      username: string;
      jwt?: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image: string;
    username: string;
    jwt?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    image: string;
    username: string;
    accessToken: string;
    jwt?: string;
  }
}
