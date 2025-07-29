"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

const menuOptions = [
  { id: 1, name: "Home", href: "/home" },
  { id: 2, name: "History", href: "/history" },
  { id: 3, name: "Pricing", href: "/pricing" },
  { id: 4, name: "Profile", href: "/profile" },
];

const AppHeader = () => {
  const { data: session } = useSession();
  return (
    <header className="flex items-center justify-between py-3 px-8 shadow border-b">
      <div className="flex items-center gap-1">
        <Image src="/logo.svg" alt="logo" width={30} height={15} />
        <span className="text-primary font-bold text-2xl">
          Medical Voice Agent
        </span>
      </div>

      <nav className="flex items-center gap-6">
        <ul className="hidden md:flex gap-6 items-center">
          {menuOptions.map((option) => (
            <li
              key={option.id}
              className="hover:text-primary hover:font-medium transition-all"
            >
              <Link href={option.href}>{option.name}</Link>
            </li>
          ))}
        </ul>

        <div>
          <Image
            src={session?.user?.image || "/male-avatar.png"}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      </nav>
    </header>
  );
};

export default AppHeader;
