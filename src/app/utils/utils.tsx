interface AISummary {
  project: { organized: string; suggestions: string[] };
  fields: { [key: string]: { organized: string; suggestions: string[] } };
}

function extractBMCJson(aiSummary?: AISummary): { [key: string]: string[] } | null {
  try {
    // Type guard to check if aiSummary and its properties exist
    if (!aiSummary || !aiSummary.project || typeof aiSummary.project.organized !== 'string') {
      console.error('Invalid or missing aiSummary.project.organized');
      return null;
    }

    const dataString = aiSummary.project.organized;
    // Extract JSON string by finding content between { and }
    const jsonStart = dataString.indexOf('{');
    const jsonEnd = dataString.lastIndexOf('}') + 1;
    if (jsonStart === -1 || jsonEnd === -1) {
      console.error('No JSON content found in the response');
      return null;
    }

    const jsonString = dataString.slice(jsonStart, jsonEnd);
    // Parse JSON
    const parsedJson = JSON.parse(jsonString);

    // Validate parsed JSON structure
    if (!isValidBMCJson(parsedJson)) {
      console.error('Parsed JSON does not match expected structure');
      return null;
    }

    return parsedJson;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
}

// Helper function to validate parsed JSON structure
function isValidBMCJson(data: unknown): data is { [key: string]: string[] } {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  return Object.values(data).every(
    (value) => Array.isArray(value) && value.every((item) => typeof item === 'string')
  );
}

export { extractBMCJson };