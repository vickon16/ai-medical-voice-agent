"use client";

import { type PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";

const Providers = (props: PropsWithChildren) => {
  const { children } = props;
  return (
    <SessionProvider>
      {children}
      <Toaster />
    </SessionProvider>
  );
};

export default Providers;
