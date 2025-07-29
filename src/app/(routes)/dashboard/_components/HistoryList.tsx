"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import AddNewSessionDialog from "./AddNewSessionDialog";

const HistoryList = () => {
  const [historyList, setHistoryList] = useState([]);

  return (
    <div className="mt-10">
      {historyList.length === 0 ? (
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
        <div>List</div>
      )}
    </div>
  );
};

export default HistoryList;
