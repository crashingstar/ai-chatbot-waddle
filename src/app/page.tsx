"use client";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoaderSpinner from "@/component/loaderspinner";

export default function Home() {
  const { user } = useAuthContext() as { user: any };
  const router = useRouter();

  useEffect(() => {
    if (user == null) {
      router.push("/signin");
    } else {
      router.push("/chat");
    }
  }, [user, router]);

  return (
    <>
      <LoaderSpinner />
    </>
  );
}
