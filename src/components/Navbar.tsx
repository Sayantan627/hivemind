import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";

const Navbar = async () => {
  const session = await getAuthSession();
  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 py-2 z-[10]">
      <div className="container h-full max-w-7xl flex mx-auto justify-between items-center gap-2">
        {/* logo */}
        <Link href="/" className="flex gap-2 items-center">
          {/* Logo image */}
          <p className="text-sm text-zinc-700 font-medium">HiveMind</p>
        </Link>

        {/* Search bar */}

        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};
export default Navbar;
