// import { Attest } from "@/components/Attest";
// import { NavBar } from "@/components/NavBar";
import { PostBounty } from "@/components/PostBounty";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <PostBounty />
    </main>
  );
}
