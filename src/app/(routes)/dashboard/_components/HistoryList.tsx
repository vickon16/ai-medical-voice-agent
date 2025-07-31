import Image from "next/image";
import AddNewSessionDialog from "./AddNewSessionDialog";
import { db } from "@/server/db";
import { getAllSessionDetails } from "@/lib/dal/session.dal";
import HistoryTable from "./HistoryTable";

const HistoryList = async () => {
  const sessionChats = await getAllSessionDetails();

  return (
    <div className="mt-10">
      {sessionChats.length === 0 ? (
        <div className="flex items-center flex-col justify-center text-center gap-y-2 mt-5 p-7 border-2 border-dashed rounded-2xl">
          <Image
            src="/medical-assistance.png"
            alt="History Icon"
            width={150}
            height={150}
          />

          <h2 className="font-bold text-xl">No recent consultation</h2>
          <p>It looks like you haven't consulted with any doctor yet.</p>
          <AddNewSessionDialog buttonTitle="+ Start a consultation" />
        </div>
      ) : (
        <div className="w-full max-w-[1200px] mx-auto">
          <HistoryTable sessionChats={sessionChats} />
        </div>
      )}
    </div>
  );
};

export default HistoryList;
