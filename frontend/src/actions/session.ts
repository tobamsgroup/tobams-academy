"use server";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const fetchUser = async () => {
  const user = await auth();
  return user;
};

export async function checkSession() {
  const user = await fetchUser();

  if (!user?.user) {
    throw new Error("Unauthorized");
  }

  return user;
}



