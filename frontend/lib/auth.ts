import { AxiosResponse } from "axios";
import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { axiosPrivate } from "./axios";

export const authOptions: NextAuthOptions = {
  secret: process.env.SESSION_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
    verifyRequest: "/",
    newUser: "/",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@example.com",
        },
        password1: { label: "Password 1", type: "password" },
        password2: { label: "Password 2", type: "password" },
      },
      async authorize(credentials: any, req) {
        try {
          let res: AxiosResponse;

          if (credentials.is_registration == "true") {
            res = await axiosPrivate.post("/back/api/auth/registration/", {
              email: credentials?.email,
              password1: credentials?.password1,
              password2: credentials?.password2,
            });
          } else {
            res = await axiosPrivate.post("/back/api/auth/login/", {
              email: credentials?.email,
              password: credentials?.password,
            });
          }

          const user: User = res.data;

          if (user) {
            return user;
          } else {
            return null;
          }
        } catch (e: any) {
          throw new Error(
            JSON.stringify({ errors: e.response.data, status: false }),
          );
        }
      },
    }),
  ],

  callbacks: {
    async signIn(params: { user; account; profile? }) {
      if (params.account) {
        if (params.account.provider === "credentials") {
          const user = params.user.user;

          if (!user) {
            return false;
          }

          params.user.hasFinishedIntro = user.hasFinishedIntro;
          params.user.email = user.email;
          params.user.userId = user.userId;
          params.user.image = user.image;
          return true;
        }

        if (params.account.provider === "google") {
          const { access_token: googleAccessToken, id_token: googleIdToken } =
            params.account;

          try {
            const response = await axiosPrivate.post(
              "/back/api/social/login/google/",
              {
                accessToken: googleIdToken, // https://gonzafirewall.medium.com/google-oauth2-and-django-rest-auth-92b0d8f70575
                idToken: googleIdToken,
              },
            );

            const {
              user,
              access,
              refresh,
              accessTokenExpiration,
              refreshTokenExpiration,
            } = response.data;

            params.user.access = access;
            params.user.refresh = refresh;
            params.user.hasFinishedIntro = user.hasFinishedIntro;
            params.user.accessTokenExpiration = accessTokenExpiration;
            params.user.refreshTokenExpiration = refreshTokenExpiration;
            params.user.userId = user.userId;

            return true;
          } catch (error: any) {
            return false;
          }
        }
      }
      return false;
    },

    async jwt(params: {
      token;
      user;
      account;
      profile?;
      isNewUser?;
      session?;
      trigger?;
    }) {
      if (params.user) {
        params.token = {
          ...params.token,
          ...params.user,
        };
      }

      if (Date.now() > Date.parse(params.token.accessTokenExpiration)) {
        try {
          const res = await axiosPrivate.post("/back/api/auth/token/refresh/", {
            refresh: params.token.refresh,
          });

          const tokens: any = await res.data;

          return {
            ...params.token,
            access: tokens.access,
            accessTokenExpiration: tokens.accessTokenExpiration,
          };
        } catch (error) {
          return {
            ...params.token,
            error: "RefreshAccessTokenError" as const,
          };
        }
      }

      if (params.trigger && params.trigger == "update") {
        if (params.session && params.session.user) {
          params.token = {
            ...params.token,
            ...params.session.user,
          };
        }
      }

      return params.token;
    },

    session(params: { session; token; user }) {
      if (params.session.user) {
        params.session.user = {
          ...params.session.user,
          ...params.token,
        };
      }
      return params.session;
    },
  },
};
