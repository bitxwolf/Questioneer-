import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Get API Key from Environment
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    return response.status(500).json({ error: 'Server configuration error: Missing API Key' });
  }

  try {
    const { 
      schoolName, 
      examType,
      classLevel, 
      section,
      subject, 
      date,
      duration,
      totalMarks,
      chapters, 
      questionType, 
      difficulty, 
      questionCount, 
      otherInstructions,
      userPromptOptional
    } = request.body;

    // 2. Optimized Prompt for Speed & JSON Reliability
    const systemPrompt = `You are a strict JSON generator for school exams.
1. Output ONLY valid JSON.
2. NO conversational text (e.g., "Here is the JSON").
3. NO <think> tags.
4. NO markdown code blocks (\`\`\`json).
5. Structure: header (school_name, details), sections (A, B, C...), questions.
6. Do NOT include answers or explanations.`;

    const userPrompt = `Create a ${subject} Class ${classLevel} Exam.
School: ${schoolName}
Type: ${examType}
Topics: ${chapters}
Difficulty: ${difficulty}
Total Questions: ${questionCount}

Required JSON Schema:
{
  "header": {
    "school_name": "${schoolName}",
    "basic_formal_box": { 
      "exam_type": "${examType}", 
      "class": "${classLevel}", 
      "section": "${section}", 
      "subject": "${subject}", 
      "date": "${date}", 
      "duration": "${duration}", 
      "total_marks": "${totalMarks}" 
    },
    "other_specific_details_box": { 
      "sections_in_exam": "string", 
      "basic_instructions": "${otherInstructions}", 
      "marks_distribution": "string", 
      "total_questions": "${questionCount}" 
    },
    "user_prompt_box_optional": "${userPromptOptional || ''}"
  },
  "sections": [
    {
      "section_name": "A",
      "type": "${questionType}",
      "questions": [
        { "q_id": "1", "q_text": "Question...", "marks_allocated": 1 }
      ]
    }
  ]
}`;

    // 3. Call OpenRouter - Switched to tngtech/deepseek-r1t2-chimera:free
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://questioneer.app',
        'X-Title': 'Questioneer'
      },
      body: JSON.stringify({
        model: "tngtech/deepseek-r1t2-chimera:free", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        stream: false,
        max_tokens: 2500,
        temperature: 0.6,
        top_p: 0.9
      })
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('OpenRouter API Error:', errorText);
      return response.status(502).json({ error: 'AI Service Busy. Please try again.', details: errorText });
    }

    const data = await openRouterResponse.json();
    let content = data.choices?.[0]?.message?.content || "";

    // 4. Aggressive Cleaning
    // Remove <think> blocks (DeepSeek R1 specific)
    content = content.replace(/<think>[\s\S]*?<\/think>/g, '');
    
    // Remove Markdown code blocks
    content = content.replace(/```json/g, '').replace(/```/g, '');

    // Extract JSON object
    const firstOpen = content.indexOf('{');
    const lastClose = content.lastIndexOf('}');

    if (firstOpen !== -1 && lastClose !== -1) {
      content = content.substring(firstOpen, lastClose + 1);
    } else {
      console.error("Raw Content received:", content);
      throw new Error("AI did not return valid JSON. It might be overloaded.");
    }

    const parsedData = JSON.parse(content);
    
    // 5. Validation
    if (!parsedData.header || !parsedData.sections) {
      throw new Error("Incomplete JSON structure received.");
    }

    return response.status(200).json({ 
      content: parsedData,
      meta: { date: new Date().toLocaleDateString() }
    });

  } catch (error: any) {
    console.error('Generation Logic Error:', error);
    return response.status(500).json({ 
      error: error.message || 'Internal Server Error', 
      details: error.toString() 
    });
  }
}