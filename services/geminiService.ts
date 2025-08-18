import { GoogleGenAI, Type } from "@google/genai";
import type { Stage, StageContent, Language } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const curriculumSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: 'A compelling title for the startup methodology stage.'
      },
      description: {
        type: Type.STRING,
        description: 'A concise one-sentence description of what this stage covers.'
      }
    },
    required: ["title", "description"]
  }
};

const structuredContentBlock = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A clear, engaging title for this content block.' },
        sections: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    subtitle: { type: Type.STRING, description: 'A subtitle for a specific section within the content block.' },
                    text: { type: Type.STRING, description: 'The detailed paragraph/text for this section. Use newlines for paragraph breaks.' }
                },
                required: ["subtitle", "text"]
            },
            description: 'A list of sections that make up the content block.'
        }
    },
    required: ["title", "sections"]
};


const stageContentSchema = {
    type: Type.OBJECT,
    properties: {
        theory: structuredContentBlock,
        caseStudy: structuredContentBlock,
        practicalExercise: structuredContentBlock,
        assignment: {
            type: Type.STRING,
            description: "A specific, graded assignment prompt that requires the founder to apply the stage's concepts directly to their startup idea. The prompt should ask for a clear deliverable. Formatted in Markdown."
        }
    },
    required: ["theory", "caseStudy", "practicalExercise", "assignment"]
};

const gradingSchema = {
    type: Type.OBJECT,
    properties: {
        score: {
            type: Type.NUMBER,
            description: "A numerical score from 0 to 100 for the assignment submission."
        },
        feedback: {
            type: Type.STRING,
            description: "Constructive, actionable feedback for the student, formatted in Markdown. It should explain the score, highlight strengths, and suggest specific areas for improvement."
        }
    },
    required: ["score", "feedback"]
};


const getLanguageInstruction = (lang: Language) => {
    return lang === 'zh' ? 'Respond in Chinese (Simplified).' : 'Respond in English.';
}

export const generateCurriculum = async (idea: string, lang: Language): Promise<Omit<Stage, 'id' | 'isLocked' | 'isCompleted'>[]> => {
    try {
        const prompt = `You are an expert in startup methodologies, combining Y Combinator's principles with the Lean Startup methodology. Create a new, comprehensive startup methodology called 'WarrenT'. 
        Outline this methodology into 10 distinct, sequential stages for an online course.
        The course should guide a founder from idea to scale (0 to 1, and 1 to 10).
        The first few stages should cover the '0 to 1' phase: Ideation, Customer Discovery, MVP building, and finding Product-Market Fit.
        The later stages should cover the '1 to 10' phase: Growth, Scaling, Fundraising, and building a company culture.
        Crucially, tailor the title and description of each stage to be highly relevant for a founder working on this specific startup idea: "${idea}".
        For each stage, provide a compelling title and a one-sentence description.
        ${getLanguageInstruction(lang)}`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: curriculumSchema,
                temperature: 0.7,
            },
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        return parsed as Omit<Stage, 'id' | 'isLocked' | 'isCompleted'>[];
    } catch (error) {
        console.error("Error generating curriculum:", error);
        throw new Error("Failed to communicate with the AI model for curriculum generation.");
    }
};

export const generateStageContent = async (stageTitle: string, idea: string, lang: Language): Promise<StageContent> => {
    try {
        const prompt = `You are an expert curriculum designer for the 'WarrenT' startup methodology. Generate detailed learning content for the stage: "${stageTitle}".
        The content is for a founder building a startup with the idea: "${idea}".
        The content must be structured into four parts: 'Theory', 'Case Study', 'Practical Exercise', and 'Assignment'.
        
        For 'Theory', 'Case Study', and 'Practical Exercise', you MUST structure the output. Each must have a main 'title' and be broken down into multiple 'sections'. Each section requires a 'subtitle' and its corresponding 'text'. This structured format is crucial for readability and cannot be ignored.
        - The 'Assignment' should be a single, specific, graded task the founder must complete and submit. This task must directly relate to their startup idea ('${idea}') and the concepts of '${stageTitle}'. The prompt should be clear and ask for a specific deliverable (e.g., 'Write a 300-word value proposition...', 'Create a lean canvas...').
        
        ${getLanguageInstruction(lang)}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: stageContentSchema,
                temperature: 0.5,
            },
        });
        
        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        return parsed as StageContent;

    } catch (error) {
        console.error(`Error generating content for stage "${stageTitle}":`, error);
        throw new Error("Failed to communicate with the AI model for stage content generation.");
    }
};


export const gradeAssignment = async (stageTitle: string, assignment: string, submission: string, idea: string, lang: Language): Promise<{ score: number; feedback: string; }> => {
    try {
        const prompt = `You are an AI startup mentor and grader for the 'WarrenT Startup School'. Your task is to evaluate a student's assignment submission.
        - Student's Startup Idea: "${idea}"
        - Current Learning Stage: "${stageTitle}"
        - Assignment Prompt: "${assignment}"
        - Student's Submission: "${submission}"

        Your evaluation must be objective and constructive.
        1. Assess how well the submission answers the assignment prompt.
        2. Evaluate the submission's quality based on the principles of the '${stageTitle}' stage and the 'WarrenT' methodology (a blend of YC and Lean Startup).
        3. Provide a numerical score from 0 to 100. A score of 70 is passing. Be fair but critical.
        4. Write concise, actionable feedback. Start with what was done well, then suggest specific areas for improvement.

        Your response must be in JSON format.
        ${getLanguageInstruction(lang)}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: gradingSchema,
                temperature: 0.5,
            },
        });

        const jsonText = response.text.trim();
        const parsed = JSON.parse(jsonText);
        return parsed as { score: number; feedback: string; };

    } catch (error) {
        console.error(`Error grading assignment for stage "${stageTitle}":`, error);
        throw new Error("Failed to communicate with the AI model for assignment grading.");
    }
};

export const generateBusinessPlan = async (idea: string, stages: Stage[], lang: Language): Promise<string> => {
    try {
        const submissionsSummary = stages
            .filter(s => s.isCompleted && s.submission)
            .map(s => `Stage ${s.id}: ${s.title}\nStudent's Submission:\n${s.submission}\n---`)
            .join('\n\n');

        const prompt = `You are an expert startup consultant and business plan writer. Your task is to generate a comprehensive business plan for a startup idea based on the founder's work throughout a course.

        **Startup Idea:** "${idea}"

        **Founder's Coursework Summary:**
        The founder has completed a 10-stage 'WarrenT' startup course. Here is a summary of their assignment submissions for each stage:
        ${submissionsSummary}

        **Your Task:**
        Using the startup idea and all the assignment submissions as deep context, create a detailed and professional business plan. The plan should be well-structured and written in Markdown format. Be encouraging but realistic in your tone.

        **Business Plan Structure (Use these exact markdown headers):**
        - ## 1. Executive Summary
          - A compelling, concise overview of the entire business. Hook the reader.
        - ## 2. The Problem
          - Clearly define the pain point the startup is solving. Use the founder's initial insights.
        - ## 3. The Solution
          - Detail the product/service. Explain its core features and value proposition, referencing the founder's MVP and solution-related work.
        - ## 4. Target Market
          - Describe the ideal customer profile and the size of the market opportunity. Synthesize the founder's customer discovery work.
        - ## 5. Go-to-Market Strategy
          - Outline how the startup will acquire its first customers. Incorporate the founder's growth strategy submissions.
        - ## 6. Competitive Landscape
          - Analyze key competitors and explain the startup's unique competitive advantage.
        - ## 7. The Team
          - (Provide a placeholder section for the founder to fill in their team details, as you don't have this information.)
        - ## 8. Financial Projections
          - (Provide a high-level overview of the business model and suggest next steps for building a detailed financial model. Do not invent specific numbers.)
        - ## 9. Future Roadmap
          - Create a plausible 6, 12, and 18-month roadmap with key milestones based on the founder's progress and the natural evolution of the business.

        Ensure the content is deeply personalized, cohesive, and directly reflects the work and evolution of the founder's idea throughout the course.

        ${getLanguageInstruction(lang)}`;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.6,
            },
        });

        return response.text;

    } catch (error) {
        console.error("Error generating business plan:", error);
        throw new Error("Failed to communicate with the AI model for business plan generation.");
    }
};