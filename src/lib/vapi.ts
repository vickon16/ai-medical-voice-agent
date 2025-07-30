import Vapi from "@vapi-ai/web";

const vapiClient = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);

export default vapiClient;
