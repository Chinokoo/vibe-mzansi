import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h2 className="text-2xl font-bold text-center">Oops, vibes lost ! 🚫</h2>
      <p className="text-lg text-center">404 | Page not found</p>

      <Button variant="ghost" className="m-5">
        <Link href={"/"}>Return Home</Link>
      </Button>
    </div>
  );
}
