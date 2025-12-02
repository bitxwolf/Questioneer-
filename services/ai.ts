import { QuestionFormData, StructuredPaperData } from '../types';

// Array of API Keys for Round-Robin/Fallback rotation
// IMPORTANT: Replace the placeholder below with your actual OpenRouter API Key(s)
const API_KEYS = [
  'YOUR_OPENROUTER_API_KEY_HERE',
  // Add more keys here if you want to use round-robin rotation
];

// Switched to the specific model requested by the user
const MODEL_NAME = "tngtech/deepseek-r1t2-chimera:free";

// Keep track of the current key index in memory
let currentKeyIndex = 0;

/**
 * Rotates to the next API key and returns it.
 */
const getNextKey = () => {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return API_KEYS[currentKeyIndex];
};

/**
 * Main generation function
 */
export const generateQuestionPaper = async (formData: QuestionFormData): Promise<{ content: StructuredPaperData, meta: { date: string } }> => {
  
  // Optimization: Added "Minimize internal thinking" to save time on hidden tokens
  // Optimization: Removed answer key requirement to reduce generation token count
  const systemPrompt = `You are a strict JSON generator for school exams.
1. Output ONLY valid JSON.
2. NO conversational text.
3. NO markdown code blocks.
4. Minimize internal thinking/reasoning steps to speed up generation.
5. Structure must match the schema provided exactly.
6. Do NOT include answers or explanations in the JSON output, only questions.
7. You MUST estimate time in minutes for each question based on difficulty.`;

  const userPrompt = `Create a ${formData.subject} Class ${formData.classLevel} Exam.
School: ${formData.schoolName}
Type: ${formData.examType}
Topics: ${formData.chapters}
Difficulty: ${formData.difficulty}
Total Questions: ${formData.questionCount}
Instructions: ${formData.otherInstructions}
Side Note: ${formData.userPromptOptional || ''}

REQUIRED JSON STRUCTURE:
{
  "header": {
    "school_name": "string",
    "basic_formal_box": { 
      "exam_type": "string", "class": "string", "section": "string", 
      "subject": "string", "date": "string", "duration": "string", "total_marks": "string" 
    },
    "other_specific_details_box": { 
      "sections_in_exam": "string", "basic_instructions": "string", 
      "marks_distribution": "string", "total_questions": "string" 
    },
    "user_prompt_box_optional": "string"
  },
  "sections": [
    {
      "section_name": "A",
      "type": "MCQ/Short/Long",
      "questions": [
        { 
          "q_id": "1", "q_text": "string", "q_type": "string", 
          "marks_allocated": 1,
          "estimated_time_mins": 2
        }
      ]
    }
  ],
  "metadata": {
    "generator_version": "DeepSeek-R1",
    "school_style_applied": "Standard"
  }
}`;

  let attempts = 0;
  const maxAttempts = API_KEYS.length; // Try every key once if needed

  while (attempts < maxAttempts) {
    const apiKey = API_KEYS[currentKeyIndex];
    
    // Check if user has replaced the placeholder
    if (apiKey === 'YOUR_OPENROUTER_API_KEY_HERE') {
      throw new Error("API Key not configured. Please add your OpenRouter API Key in services/ai.ts");
    }
    
    try {
      console.log(`Using API Key index: ${currentKeyIndex} (Model: ${MODEL_NAME})`);

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": "https://questioneer.app", // Required by OpenRouter
          "X-Title": "Questioneer", // Required by OpenRouter
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          // Optimization: Lower temperature for faster, more deterministic output
          temperature: 0.6, 
          top_p: 0.9,
          // Optimization: OpenRouter specific routing to prefer speed over price (since it's free)
          provider: {
            sort: "throughput"
          }
        })
      });

      if (!response.ok) {
        // If 429 (Rate Limit) or 502/503 (Server Error), throw to trigger catch block and rotation
        if (response.status === 429 || response.status >= 500) {
          throw new Error(`API Error ${response.status}`);
        }
        // For other errors (e.g. 401), reject immediately
        const errText = await response.text();
        throw new Error(`OpenRouter Error: ${errText}`);
      }

      const data = await response.json();
      let content = data.choices?.[0]?.message?.content || "";

      if (!content) throw new Error("Empty response from AI");

      // CLEANUP: Remove <think> tags specific to R1 models
      content = content.replace(/<think>[\s\S]*?<\/think>/g, '');
      
      // CLEANUP: Remove Markdown ```json ... ``` wrappers
      content = content.replace(/```json/g, '').replace(/```/g, '');

      // EXTRACTION: Find the actual JSON object
      const firstOpen = content.indexOf('{');
      const lastClose = content.lastIndexOf('}');

      if (firstOpen !== -1 && lastClose !== -1) {
        content = content.substring(firstOpen, lastClose + 1);
      } else {
        throw new Error("Could not find valid JSON in response");
      }

      let parsedData;
      try {
        parsedData = JSON.parse(content);
      } catch (e) {
        throw new Error("Failed to parse JSON response");
      }

      // VALIDATION: Ensure critical fields exist
      if (!parsedData.header || !parsedData.sections) {
        throw new Error("Incomplete JSON structure received: missing header or sections");
      }

      // Success! Return data.
      return {
        content: parsedData,
        meta: { date: new Date().toLocaleDateString() }
      };

    } catch (error: any) {
      console.warn(`Attempt ${attempts + 1} failed with key index ${currentKeyIndex}:`, error.message);
      
      attempts++;
      getNextKey(); // Rotate key for next loop iteration
      
      if (attempts >= maxAttempts) {
        throw new Error("All API keys exhausted or service unavailable. Please check your network or try again later.");
      }
    }
  }
  
  throw new Error("Unexpected generation failure.");
};