import simpleOauth2 from "simple-oauth2";
import { API_BASE_URL } from "~/constants";

export const googleOauth2 = new simpleOauth2.AuthorizationCode({
  client: {
    id: process.env.GOOGLE_CLIENT_ID,
    secret: process.env.GOOGLE_CLIENT_SECRET,
  },
  auth: {
    authorizeHost: "https://accounts.google.com",
    authorizePath: "/o/oauth2/v2/auth",
    tokenHost: "https://www.googleapis.com",
    tokenPath: "/oauth2/v4/token",
  },
});

export const CALLBACK_URI = API_BASE_URL + "/auth/google/callback";
