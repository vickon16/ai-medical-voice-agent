import { Button } from "@/components/ui/button";
import { AIDoctorAgents } from "@/lib/shared/list";
import Image from "next/image";
import AddNewSessionDialog from "./AddNewSessionDialog";

type Props = {
  agent: (typeof AIDoctorAgents)[number];
};

const DoctorAgentCard = ({ agent }: Props) => {
  return (
    <div className="space-y-1">
      <Image
        src={agent.image}
        alt={agent.specialist}
        width={200}
        height={300}
        className="w-full h-[250px] object-cover rounded-xl"
      />

      <h2 className="font-bold text-lg">{agent.specialist}</h2>
      <p className="line-clamp-2 text-sm text-gray-500">{agent.description}</p>
      <AddNewSessionDialog
        buttonTitle="Consult &rarr;"
        buttonClassName="w-full !mt-2"
      />
    </div>
  );
};

export default DoctorAgentCard;
