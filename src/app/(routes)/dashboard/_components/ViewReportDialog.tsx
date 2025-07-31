"use client";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TGenerateReport } from "@/lib/ai/schema";

type Props = {
  reportDetails: TGenerateReport | null;
};

const ViewReportDialog = (props: Props) => {
  const { reportDetails } = props;
  if (!reportDetails) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" size="sm">
          View Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Medical Report Details</DialogTitle>
          <DialogDescription asChild>
            <div className="mb-4 text-muted-foreground text-sm">
              Below is the generated report for this session.
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div>
            <span className="font-semibold">Doctor:</span>{" "}
            {reportDetails.doctor}
          </div>
          <div>
            <span className="font-semibold">Patient:</span>{" "}
            {reportDetails.patient}
          </div>
          <div>
            <span className="font-semibold">Timestamp:</span>{" "}
            {new Date(reportDetails.timestamp).toLocaleString()}
          </div>
          <div>
            <span className="font-semibold">Chief Complaint:</span>{" "}
            {reportDetails.chiefComplaint}
          </div>
          <div>
            <span className="font-semibold">Summary:</span>{" "}
            {reportDetails.summary}
          </div>
          <div>
            <span className="font-semibold">Symptoms:</span>{" "}
            {reportDetails.symptoms.length > 0
              ? reportDetails.symptoms.join(", ")
              : "None"}
          </div>
          <div>
            <span className="font-semibold">Duration:</span>{" "}
            {reportDetails.duration || "Not specified"}
          </div>
          <div>
            <span className="font-semibold">Severity:</span>{" "}
            {reportDetails.severity}
          </div>
          <div>
            <span className="font-semibold">Medications Mentioned:</span>{" "}
            {reportDetails.medicationsMentioned.length > 0
              ? reportDetails.medicationsMentioned.join(", ")
              : "None"}
          </div>
          <div>
            <span className="font-semibold">Recommendations:</span>
            <ul className="list-disc list-inside ml-4">
              {reportDetails.recommendations.length > 0 ? (
                reportDetails.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))
              ) : (
                <li>None</li>
              )}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReportDialog;
