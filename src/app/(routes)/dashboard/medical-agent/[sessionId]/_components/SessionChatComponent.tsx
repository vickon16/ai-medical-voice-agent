"use client";
import { Button } from "@/components/ui/button";
import { getSessionDetails } from "@/lib/dal/session.dal";
import { TMessages } from "@/lib/types";
import { cn } from "@/lib/utils";
import Vapi from "@vapi-ai/web";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import axios from "axios";
import { Circle, Loader, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  sessionDetails: Awaited<ReturnType<typeof getSessionDetails>>;
};

const SessionChatComponent = ({ sessionDetails }: Props) => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentRole, setCurrentRole] = useState<"user" | "assistant">();
  const [liveTranscript, setLiveTranscript] = useState<string>("");
  const [messages, setMessages] = useState<TMessages[]>([]);
  const [loading, setLoading] = useState(false);
  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!;

  useEffect(() => {
    const vapiInstance = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapi(vapiInstance);

    // Event listeners
    vapiInstance.on("call-start", () => {
      console.log("Call started");
      setIsConnected(true);
    });
    vapiInstance.on("call-end", () => {
      console.log("Call ended");
      setIsConnected(false);
      setCurrentRole(undefined);
    });
    vapiInstance.on("speech-start", () => {
      console.log("Assistant started speaking");
      setCurrentRole("assistant");
    });
    vapiInstance.on("speech-end", () => {
      console.log("Assistant stopped speaking");
      setCurrentRole("user");
    });
    vapiInstance.on("message", (message) => {
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;
        if (transcriptType === "partial") {
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          // Final transcript
          setMessages((prevMessages) => [
            ...prevMessages,
            { role, text: transcript },
          ]);
          setLiveTranscript("");
          setCurrentRole(undefined);
        }
      }
    });
    vapiInstance.on("error", (error) => {
      console.error("Vapi error:", error);
    });
    return () => {
      vapiInstance?.stop();
    };
  }, []);

  const generateReport = async () => {
    if (
      !sessionDetails ||
      !sessionDetails?.sessionChat.id ||
      messages.length === 0
    )
      return;

    try {
      const result = await axios.post("/api/medical-reports", {
        messages: messages,
        sessionId: sessionDetails?.sessionChat.id,
      });

      if (result.status !== 200 || !result.data) {
        throw new Error("Failed to generate report");
      }

      return result.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const startCall = () => {
    if (!vapi) return;
    const vapiAgentConfig: CreateAssistantDTO = {
      name: "AI Medical Doctor Voice Agent",
      firstMessage:
        "Hi there!. I'm your AI Medical Assistant. How can I help you today?",
      transcriber: {
        provider: "assembly-ai",
        language: "en",
      },
      voice: {
        provider: "deepgram",
        voiceId: (sessionDetails?.doctor?.voiceId as any) || "asteria",
      },
      model: {
        provider: "google",
        model: "gemini-2.0-flash",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              sessionDetails?.doctor?.agentPrompt ||
              "You are a helpful AI medical assistant.",
          },
        ],
      },
    };

    vapi.start(vapiAgentConfig);
  };

  const endCall = async () => {
    if (!vapi) return;
    setLoading(true);
    vapi.stop();
    setIsConnected(false);
    setCurrentRole(undefined);
    setVapi(null);

    const data = await generateReport();
    if (!data) {
      toast.error("Failed to generate report");
      setLoading(false);
      return;
    }

    console.log("Generated Report:", data);
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={cn("size-4 rounded-full", {
              "text-green-500": isConnected,
              "text-red-500": !isConnected,
            })}
          />
          {isConnected ? "Connected" : "Not Connected"}
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

        <div className="mt-8 overflow-y-auto max-w-[600px] w-full mx-auto flex flex-col gap-2 items-center">
          {messages.slice(-4).map((message, index) => (
            <div
              key={index}
              className={cn("mb-2", {
                "text-right": message.role === "user",
                "text-left": message.role === "assistant",
              })}
            >
              <h2
                className={cn("inline-block p-2 rounded-lg", {
                  "bg-blue-500 text-white": message.role === "user",
                  "bg-gray-200 text-black": message.role === "assistant",
                })}
              >
                {message.role} : {message.text}
              </h2>
            </div>
          ))}
          {liveTranscript?.length > 0 && (
            <span className="text-lg">
              {currentRole} : {liveTranscript}
            </span>
          )}
        </div>

        {!isConnected ? (
          <Button className="mt-20" onClick={startCall}>
            <PhoneCall className="size-5" /> Start Call{" "}
          </Button>
        ) : (
          <Button
            variant="destructive"
            disabled={loading}
            className="mt-20"
            onClick={endCall}
          >
            {loading ? (
              <Loader className="animate-spin size-5" />
            ) : (
              <PhoneOff />
            )}{" "}
            Disconnect
          </Button>
        )}
      </div>
    </>
  );
};

export default SessionChatComponent;
