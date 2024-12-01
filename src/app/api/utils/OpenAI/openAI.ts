import OpenAI from "openai";
import { OPEN_API_KEY } from "../../constants/OpenApiKey";

export const openai = new OpenAI({apiKey: OPEN_API_KEY});