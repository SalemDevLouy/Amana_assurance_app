import apiValidation from "@/app/utils/apiValidation";
import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API || "");
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
  tools: [
    {
      codeExecution: {},
    },
  ],
});


/**
 * API route for generating content using Gemini AI model.
 */
export async function POST(req: Request): Promise<Response> {
  apiValidation();
  /**
   * Get the prompt from the request body.
   */
  const data = await req.json();
  const prompt = `
  You are an expert in business innovation and strategy, specializing in the Business
   Model Canvas (BMC). I have a project with the following details: name: ${data.projectName},
    description: ${data.projectDescription}, and sector: ${data.projectSecteur}. Additionally, I have
     user-provided answers to BMC-related questions as follows:
  ${data.answers}
  
  Your task is:
  1. **Organize**: Summarize the responses for each BMC field into a concise list of key points (3–6 items per field, max between 30 and 40 words per item). 
  Ignore project details in the output.
2. **Improve**: Ensure clarity, conciseness, and a professional business tone. Correct grammar and remove redundancy.
3. **Output**: Return a JSON object with each field mapped to an array of strings.
  
  Deliverables:
  
  - The organized BMC in a clear, structured format (json format) in English.
  - Each BMC section should be clearly labeled.
  - Please no return any additional text or explanations outside the JSON object.
  - Output Json object with the following structure:
  {
    "CustomerSegments": [aianswer1, aianswer2, ...],
    "ValuePropositions": [aianswer1, aianswer2, ...],
    "Channels": [aianswer1, aianswer2, ...],
    "CustomerRelationships":[aianswer1, aianswer2, ...],
    "RevenueStreams": [aianswer1, aianswer2, ...],
    "KeyResources": [aianswer1, aianswer2, ...],
    "KeyActivities": [aianswer1, aianswer2, ...],
    "KeyPartners": [aianswer1, aianswer2, ...],
    "CostStructure": [aianswer1, aianswer2, ...],
    }
  Please provide the output in French.
  `;
  
  // - The aianswer should be generated based on the provided answers (users answers) with same improvement.
  /**
   * Use the Gemini AI model to generate content from the prompt.
   */
  const result = await model.generateContent(prompt);

  /**
   * Return the generated content as a JSON response.
   */
  return new Response(
    JSON.stringify({
      summary: result.response.text(),
    }),
  );
}

// 3. Suggest innovative ideas or improvements for the business model based on the provided information.
// - Notes on how the answers were categorized into BMC sections.
  // - Suggested improvements for the business model with a brief explanation for each.