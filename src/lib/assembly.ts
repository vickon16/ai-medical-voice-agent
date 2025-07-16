import { AssemblyAI, type TranscribeParams } from "assemblyai";

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLY_API_KEY!,
});

// const audioFile = "./local_file.mp3";
const audioFile = "https://assembly.ai/wildfires.mp3";

const params: TranscribeParams = {
  audio: audioFile,
  speech_model: "universal",
};

const run = async () => {
  const transcript = await client.transcripts.transcribe(params);

  console.log(transcript.text);
};

run();
// 95e1fdf1838c4bf1a23625d70692afc0
