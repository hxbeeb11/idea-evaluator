import { GoogleGenerativeAI } from "@google/generative-ai";
import { sendAnalysisEmail } from "../../utils/emailService";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { email, idea } = await request.json();
    console.log('API received request:', { email, idea });  // Debug log

    const prompt = `Thoroughly evaluate the following business/project idea. Provide analysis in the following structure:
    1. Project Overview
    2. Technical Requirements
    3. Market Analysis
       - Target audience
       - Competition
       - Market size
    4. Cost Analysis
       - Initial setup costs
       - Monthly maintenance costs
       - Potential revenue streams
    5. Implementation Challenges
    6. Marketing Strategy
       - Key channels
       - USP (Unique Selling Proposition)
    7. Overall Score (1-10) with justification

    Idea: ${idea}`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    console.log('Generated analysis:', analysis);  // Debug log

    try {
      const emailResult = await sendAnalysisEmail(email, analysis);
      console.log('Email send attempt completed:', emailResult);
      
      return new Response(JSON.stringify({ 
        success: true, 
        analysis,
        emailStatus: 'sent',
        emailResult 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (emailError) {
      console.error('Detailed email error in API:', emailError);
      return new Response(JSON.stringify({ 
        success: true, 
        analysis,
        emailStatus: 'failed',
        emailError: {
          message: emailError.message,
          name: emailError.name,
          details: emailError.toString(),
          code: emailError.code,
          statusCode: emailError.statusCode
        }
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('API error:', error);  // Debug log
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 