import { auth } from "@/server/auth";
import HistoryList from "./_components/HistoryList";
import { Button } from "@/components/ui/button";
import DoctorsAgentList from "./_components/DoctorsAgentList";

const DashboardPage = async () => {
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">My Dashboard</h2>
        <Button>+ Consult With Doctor</Button>
      </div>

      <HistoryList />
      <DoctorsAgentList />
    </div>
  );
};

export default DashboardPage;
