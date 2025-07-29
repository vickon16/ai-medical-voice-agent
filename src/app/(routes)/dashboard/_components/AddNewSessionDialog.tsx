"use client";

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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { TDoctor } from "@/lib/types";
import { toast } from "sonner";

type Props = {
  buttonTitle: string;
  buttonClassName?: string;
};

enum Steps {
  NOTES = 0,
  DOCTOR_SELECTION = 1,
}

const AddNewSessionDialog = (props: Props) => {
  const { buttonTitle, buttonClassName } = props;
  const [note, setNote] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<TDoctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<TDoctor | null>(null);
  const [currentStep, setCurrentStep] = useState(Steps.NOTES);

  const onClickNext = async () => {
    setLoading(true);
    const result = await axios.post("/api/suggest-doctors", {
      notes: note,
    });

    console.log(result.data);
    if (result.status !== 200 || !result.data?.doctors) {
      console.error("Failed to fetch doctors");
      setLoading(false);
      setSuggestedDoctors([]);
      return;
    }

    setCurrentStep(Steps.DOCTOR_SELECTION);
    setSuggestedDoctors(result.data.doctors);
    setLoading(false);
  };

  const onStartConsultation = async () => {
    if (!note || !selectedDoctor?.id) return;
    setLoading(true);
    const result = await axios.post("/api/session-chat", {
      notes: note,
      selectedDoctorId: selectedDoctor.id,
    });

    if (!result?.data?.sessionId) {
      return toast.error("Failed to get sessionId");
    }

    console.log(result.data);
    router.push(`/dashboard/medical-agent/${result.data.sessionId}`);
    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={cn(buttonClassName)}>{buttonTitle}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        {currentStep === Steps.NOTES ? (
          <>
            <DialogHeader>
              <DialogTitle>Add Basic Details</DialogTitle>
              <DialogDescription asChild>
                <div>
                  <h2>Add Symptoms or any other details</h2>
                  <Textarea
                    placeholder="Add Details here..."
                    className="h-[200px] mt-4"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                disabled={!note || loading}
                onClick={onClickNext}
                className="ml-2"
              >
                {loading ? "Loading..." : <>Next &rarr;</>}
              </Button>
            </DialogFooter>
          </>
        ) : (
          currentStep === Steps.DOCTOR_SELECTION && (
            <>
              {suggestedDoctors?.length === 0 ? (
                <div className="w-full h-full flex-1 min-h-[200px] flex items-center justify-center">
                  <p>No doctors found</p>
                </div>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle>
                      Select A Doctor to start Conversation
                    </DialogTitle>
                    <DialogDescription asChild>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
                        {suggestedDoctors.map((doctor) => (
                          <div
                            key={doctor.id}
                            className={cn(
                              "border p-4 rounded-lg cursor-pointer",
                              selectedDoctor?.id === doctor.id
                                ? "border-blue-500"
                                : "border-gray-300"
                            )}
                            onClick={() => setSelectedDoctor(doctor)}
                          >
                            <Image
                              src={doctor.image}
                              alt={doctor.specialist}
                              width={100}
                              height={150}
                              className="w-full h-[100px] object-cover rounded-lg"
                            />
                            <h3 className="font-bold text-lg">
                              {doctor.specialist}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {doctor.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      disabled={!selectedDoctor}
                      onClick={onStartConsultation}
                      className="ml-2"
                    >
                      {loading ? "Loading..." : "Start Conversation"}
                    </Button>
                  </DialogFooter>
                </>
              )}
            </>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddNewSessionDialog;
