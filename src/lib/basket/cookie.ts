import "server-only";

import { cookies } from "next/headers";

const BASKET_COOKIE = "asw_basket_token";
const ONE_YEAR = 60 * 60 * 24 * 365;

export async function getBasketToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(BASKET_COOKIE)?.value ?? null;
}

export async function setBasketToken(token: string) {
  const store = await cookies();
  store.set(BASKET_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ONE_YEAR,
  });
}

export async function clearBasketToken() {
  const store = await cookies();
  store.delete(BASKET_COOKIE);
}
