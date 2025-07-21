import { createCookie } from "@remix-run/node";

export const accessTokenCookie = createCookie("accessToken", {
  maxAge: 900,
  path: "/",
});