import { AIDoctorAgents } from "@/lib/shared/list";
import DoctorAgentCard from "./DoctorAgentCard";

const DoctorsAgentList = () => {
  return (
    <div className="mt-10">
      <h2 className="font-bold text-xl">AI Specialist Doctor Agent</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-7 mt-5">
        {AIDoctorAgents.map((agent, index) => (
          <DoctorAgentCard key={index} agent={agent} />
        ))}
      </div>
    </div>
  );
};

export default DoctorsAgentList;
