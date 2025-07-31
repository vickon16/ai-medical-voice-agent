import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllSessionDetails } from "@/lib/dal/session.dal";
import { Button } from "@/components/ui/button";
import ViewReportDialog from "./ViewReportDialog";

type Props = {
  sessionChats: Awaited<ReturnType<typeof getAllSessionDetails>>;
};

const HistoryTable = (props: Props) => {
  const { sessionChats } = props;

  return (
    <Table>
      <TableCaption>Previous Consultation table</TableCaption>
      <TableHeader className="[&_th]:font-bold">
        <TableRow>
          <TableHead className="w-[100px]">AI Medical Specialist</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessionChats.map((chat, index) => {
          const record = chat?.sessionChat;
          if (!record) return null;
          return (
            <TableRow key={record?.id + index}>
              <TableCell className="font-medium">
                {chat?.doctor?.specialist || "---"}
              </TableCell>
              <TableCell>{record?.notes || "---"}</TableCell>
              <TableCell>
                {record?.createdAt
                  ? new Date(record.createdAt).toLocaleDateString()
                  : "---"}
              </TableCell>
              <TableCell className="text-right">
                  <ViewReportDialog reportDetails={record.report} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default HistoryTable;
