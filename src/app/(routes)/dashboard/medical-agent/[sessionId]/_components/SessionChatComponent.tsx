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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Props = {
  sessionDetails: Awaited<ReturnType<typeof getSessionDetails>>;
};

const additionalPrompt = `\n\n Keep your responses concise and conversational. You're speaking to someone through voice, so avoid using formatting or special characters.`;

const SessionChatComponent = ({ sessionDetails }: Props) => {
  const [vapi] = useState(
    () => new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!)
  );
  const [assistantIsSpeaking, setAssistantIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<TMessages[]>([]);
  const [loading, setLoading] = useState(false);
  const assistantId = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!;
  const [currentTime, setCurrentTime] = useState("");
  const router = useRouter();

  const addMessage = (
    type: TMessages["type"],
    content: TMessages["content"]
  ) => {
    setMessages((prev) => [
      ...prev,
      {
        time: new Date().toLocaleTimeString(),
        type,
        content,
      },
    ]);
  };

  useEffect(() => {
    if (!vapi) return;

    // Update current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    // Event listeners
    vapi.on("call-start", () => {
      console.log("Call started");
      setConnected(true);
      addMessage("system", "Call connected");
    });
    vapi.on("call-end", () => {
      console.log("Call ended");
      setConnected(false);
      setAssistantIsSpeaking(false);
      setVolumeLevel(0);
      addMessage("system", "Call ended");
    });
    vapi.on("speech-start", () => {
      console.log("Assistant started speaking");
      setAssistantIsSpeaking(true);
    });
    vapi.on("speech-end", () => {
      console.log("Assistant stopped speaking");
      setAssistantIsSpeaking(false);
    });

    vapi.on("volume-level", (volume) => {
      setVolumeLevel(volume);
    });

    vapi.on("message", (message) => {
      console.log("Received message:", message);

      // Handle different message types
      if (message.type === "transcript") {
        if (message.transcriptType === "final") {
          if (message.role === "user") {
            addMessage("user", message.transcript);
          } else if (message.role === "assistant") {
            addMessage("assistant", message.transcript);
          }
        }
      } else if (message.type === "speech-update") {
        if (message.role === "user") {
          addMessage("user", message.transcript);
        } else if (message.role === "assistant") {
          addMessage("assistant", message.transcript);
        }
      } else if (message.type === "function-call") {
        addMessage("system", `Function called: ${message.functionCall.name}`);
      } else if (message.type === "hang") {
        addMessage("system", "Call ended by assistant");
      }
    });

    vapi.on("error", (error) => {
      console.error("Vapi error:", error);
      addMessage("system", `Error: ${error.message || error}`);
    });

    return () => {
      clearInterval(timer);
      vapi.stop();
    };
  }, [vapi]);

  const generateReport = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
      addMessage("system", "Report generation completed");
    }
  };

  const startCall = async () => {
    try {
      addMessage("system", "Starting call...");

      if (!vapi) return;

      await vapi.start({
        // Basic assistant configuration
        name: "AI Medical Doctor Voice Agent",
        firstMessage:
          "Hi there!. I'm your AI Medical Assistant. How can I help you today?",
        endCallMessage: "Thank you for the conversation. Goodbye!",
        endCallPhrases: ["goodbye", "bye", "end call", "hang up"],
        transcriber: {
          // provider: "assembly-ai",
          provider: "deepgram",
          language: "en",
        },
        voice: {
          provider: "deepgram",
          model: "aura-2",
          voiceId: (sessionDetails?.doctor?.voiceId as any) || "asteria",
        },
        model: {
          provider: "google",
          model: "gemini-2.0-flash",
          temperature: 0.7,
          messages: [
            {
              role: "system",
              content: sessionDetails?.doctor?.agentPrompt
                ? sessionDetails?.doctor?.agentPrompt + additionalPrompt
                : "You are a helpful AI medical voice assistant." +
                  additionalPrompt,
            },
          ],
        },
        // Silence timeout (in seconds)
        silenceTimeoutSeconds: 30,
        // Max call duration (in seconds) - 10 minutes
        maxDurationSeconds: 600,
      });
    } catch (error) {}
  };

  const endCall = async () => {
    if (!vapi) return;
    vapi.stop();
    setConnected(false);
    setAssistantIsSpeaking(false);
    setVolumeLevel(0);

    const data = await generateReport();
    if (!data) {
      toast.error("Failed to generate report");
      return;
    }

    router.replace("/dashboard");
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    vapi.setMuted(newMutedState);
    setIsMuted(newMutedState);
    addMessage(
      "system",
      newMutedState ? "Microphone muted" : "Microphone unmuted"
    );
  };

  const sendMessage = () => {
    // Example of sending a background message to the assistant
    vapi.send({
      type: "add-message",
      message: {
        role: "system",
        content: "The user has indicated they want to change topics.",
      },
    });
    addMessage("system", "Background message sent to assistant");
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={cn("size-4 rounded-full", {
              "text-green-500": connected,
              "text-red-500": !connected,
            })}
          />
          {connected ? "Connected" : "Not Connected"}
        </h2>
        <h3 className="font-bold text-xl text-gray-400">{currentTime}</h3>
      </div>

      {connected && (
        <div className="mt-10">
          <div className="flex gap-5 items-center">
            <div>
              <strong>Assistant:</strong>
              <span
                className={cn({
                  "text-yellow-500": assistantIsSpeaking,
                  "text-gray-500": !assistantIsSpeaking,
                })}
              >
                {assistantIsSpeaking ? "Speaking" : "Listening"}
              </span>
            </div>
            <div>
              <strong>Volume:</strong>
              <span className="ml-2">{Math.round(volumeLevel * 100)}%</span>
            </div>
            <div>
              <strong>Mic:</strong>
              <span
                className={cn("ml-2", {
                  "text-red-500": isMuted,
                  "text-green-500": !isMuted,
                })}
              >
                {isMuted ? "Muted" : "Active"}
              </span>
            </div>
          </div>
        </div>
      )}

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
          {messages.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center min-h-[300px] text-muted-foreground">
              No messages yet. Start a call to begin the conversation.
            </div>
          ) : (
            messages.slice(-4).map((message, index) => (
              <div
                key={index}
                className={cn("mb-3 p-2 rounded-lg w-full max-w-[500px]", {
                  "bg-blue-100": message.type === "user",
                  "bg-green-100": message.type === "assistant",
                  "bg-gray-100": message.type === "system",
                })}
              >
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={cn("font-bold", {
                      "text-blue-700": message.type === "user",
                      "text-green-700": message.type === "assistant",
                      "text-gray-500": message.type === "system",
                    })}
                  >
                    {message.type === "user"
                      ? "You"
                      : message.type === "assistant"
                      ? "Assistant"
                      : "System"}
                  </span>
                  <span className="text-xs text-gray-500">{message.time}</span>
                </div>
                <div className="text-gray-700">{message.content}</div>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-2 mt-20">
          {!connected ? (
            <Button onClick={startCall} disabled={connected || loading}>
              <PhoneCall className="size-5" /> Start Call{" "}
            </Button>
          ) : (
            <Button
              variant="destructive"
              disabled={!connected || loading}
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

          <Button
            onClick={toggleMute}
            disabled={!connected}
            variant={isMuted ? "destructive" : "default"}
          >
            {isMuted ? "Unmute" : "Mute"}
          </Button>

          <Button onClick={sendMessage} disabled={!connected}>
            Send Context
          </Button>
        </div>
      </div>
    </>
  );
};

export default SessionChatComponent;
