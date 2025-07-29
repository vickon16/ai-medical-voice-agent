import { Button } from "@/components/ui/button";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { doctors, sessionsChat, users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { Circle, PhoneCall } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    sessionId: string;
  }>;
};

const getSessionDetails = async (sessionId: string) => {
  const user = await auth();
  if (!user) return redirect("/auth/login");

  try {
    const result = await db
      .select()
      .from(sessionsChat)
      .where(eq(sessionsChat.id, sessionId))
      .leftJoin(users, eq(users.id, sessionsChat.userId))
      .leftJoin(doctors, eq(doctors.id, sessionsChat.doctorId));

    return result[0];
  } catch (error) {
    console.error("Error fetching session details:", error);
    return null;
  }
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
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle className="size-4" /> Not Connected
        </h2>
        <h3 className="font-bold text-xl text-gray-400">00:00</h3>
      </div>

      <div className="flex items-center flex-col mt-10">
        <Image
          src={sessionDetails?.doctor?.image || "/doctor1.png"}
          alt="Doctor Image"
          width={100}
          height={100}
          className="size-[100px] object-cover rounded-full"
        />
        <h2 className="text-lg mt-1">{sessionDetails?.doctor?.specialist}</h2>
        <p className="text-sm text-gray-400 capitalize">
          AI Medical voice agent
        </p>

        <div className="mt-32">
          <h2 className="text-gray-400">Assistant Message</h2>
          <h2 className="text-lg">User Message</h2>
        </div>

        <Button className="mt-20">
          <PhoneCall className="size-5" /> Start Call{" "}
        </Button>
      </div>
    </div>
  );
};

export default MedicalAgentSessionId;
