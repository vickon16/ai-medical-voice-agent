import { type PropsWithChildren } from "react";
import AppHeader from "./_components/AppHeader";

const DashboardLayout = (props: PropsWithChildren) => {
  const { children } = props;
  return (
    <main>
      <AppHeader />
      <div className="p-4 max-w-[1500px] mx-auto">{children}</div>
    </main>
  );
};

export default DashboardLayout;
