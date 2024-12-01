"use client";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Chat from "../../component/chat";
import logout from "@/firebase/auth/logout";

function Page(): JSX.Element {
  const { user } = useAuthContext() as { user: any };
  const router = useRouter();

  useEffect(() => {
    if (user == null) {
      router.push("/");
    }
  }, [user, router]);

  const handleLogout = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    logout();
    console.log("lougout");
  };

  return (
    <>
      <div className="flex justify-self-end p-4">
        <button onClick={handleLogout}>Logout</button>
      </div>
      <Chat />
    </>
  );
}

export default Page;
