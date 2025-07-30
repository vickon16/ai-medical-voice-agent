import { getSessionDetails } from "@/lib/dal/session.dal";
import SessionChatComponent from "./_components/SessionChatComponent";

type Props = {
  params: Promise<{
    sessionId: string;
  }>;
};

const MedicalAgentSessionId = async (props: Props) => {
  const params = await props.params;
  const sessionDetails = await getSessionDetails(params.sessionId);
  console.log("Session Details:", sessionDetails);

  if (!sessionDetails) {
    return (
      <div className="w-full h-full min-h-screen flex items-center justify-center text-center">
        No session Details found
      </div>
    );
  }

  return (
    <div className="p-5 border rounded-3xl bg-secondary/50">
      <SessionChatComponent sessionDetails={sessionDetails} />
    </div>
  );
};

export default MedicalAgentSessionId;
