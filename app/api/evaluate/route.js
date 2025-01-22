import { GoogleGenerativeAI } from "@google/generative-ai";
import { sendAnalysisEmail } from "../../utils/emailService";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function cleanJsonResponse(text) {
  // Remove markdown code block syntax and any extra whitespace
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('JSON parsing error:', e);
    throw new Error('Failed to parse visualization data: ' + e.message);
  }
}

export async function POST(request) {
  try {
    // Add timeout to the entire operation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout after 50 seconds')), 50000);
    });

    const analysisPromise = (async () => {
      try {
        const { email, idea } = await request.json();
        if (!email || !idea) {
          throw new Error('Email and idea are required fields');
        }

        console.log('API received request:', { email, idea: idea.substring(0, 100) + '...' });

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        // Run analysis and visualization requests in parallel
        const [analysisResult, visualDataResult] = await Promise.all([
          model.generateContent(analysisPrompt + idea),
          model.generateContent(visualDataPrompt + idea)
        ]);

        const analysis = analysisResult.response.text();
        console.log('Analysis response length:', analysis.length);
        console.log('Analysis response end:', analysis.slice(-200));
        
        // Validate that all sections are present
        const requiredSections = [
          "1. Project Overview",
          "2. Technical Requirements",
          "3. Market Analysis",
          "4. Financial Analysis",
          "5. Implementation Challenges",
          "6. Marketing Strategy",
          "7. Growth & Scaling Strategy",
          "8. Overall Score"
        ];

        const missingSection = requiredSections.find(section => !analysis.includes(section));
        if (missingSection) {
          console.warn(`Missing section detected: ${missingSection}`);
          throw new Error('Incomplete analysis generated. Please try again.');
        }
        
        const visualDataText = visualDataResult.response.text();
        
        console.log('Analysis and visual data generated successfully');
        
        let visualData;
        try {
          console.log('Raw visual data response:', visualDataText);
          visualData = cleanJsonResponse(visualDataText);
          console.log('Parsed visual data:', visualData);
        } catch (error) {
          console.error('Failed to parse visual data. Raw response:', visualDataText);
          console.error('Parse error:', error);
          // Provide fallback data if parsing fails
          visualData = {
            overallScore: 7.5,
            categoryScores: {
              marketPotential: 7.5,
              technicalFeasibility: 7.5,
              financialViability: 7.5,
              scalability: 7.5,
              competitiveAdvantage: 7.5
            },
            marketAnalysis: {
              currentMarketSize: 75,
              projectedGrowth: 80,
              competitionLevel: 70
            },
            implementationTimeline: {
              planning: 25,
              development: 35,
              testing: 20,
              launch: 20
            },
            costBreakdown: {
              development: 30,
              marketing: 25,
              operations: 25,
              legal: 10,
              other: 10
            },
            revenueProjection: {
              year1: 100,
              year2: 200,
              year3: 300,
              year4: 400,
              year5: 500
            }
          };
        }

        try {
          const emailResult = await sendAnalysisEmail(email, analysis, visualData);
          console.log('Email sent successfully');
          
          return new Response(JSON.stringify({ 
            success: true, 
            message: 'Analysis complete! Check your email for the detailed report.',
            emailStatus: 'sent'
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (emailError) {
          console.error('Email send error:', emailError);
          return new Response(JSON.stringify({ 
            success: false, 
            error: 'Failed to send email. Please try again.',
            details: emailError.message
          }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      } catch (error) {
        console.error('Analysis error:', error);
        throw error;
      }
    })();

    // Race between timeout and analysis
    const result = await Promise.race([analysisPromise, timeoutPromise]);
    return result;

  } catch (error) {
    console.error('API error:', error);
    let errorMessage = 'An error occurred while processing your request.';
    let statusCode = 500;

    if (error.message.includes('timeout')) {
      errorMessage = 'The request took too long to process. Please try again.';
      statusCode = 504;
    } else if (error.message.includes('required fields')) {
      errorMessage = error.message;
      statusCode = 400;
    }

    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage,
      details: error.message
    }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Analysis prompt template
const analysisPrompt = `Provide a comprehensive evaluation of the following business/project idea. Format your response in markdown, ensuring each section is complete and concise.

1. Project Overview
   - Core concept and value proposition
   - Key features and objectives
   - Target market impact

2. Technical Requirements
   - Technology stack and infrastructure
   - Development timeline
   - Security and scalability needs

3. Market Analysis
   - Target audience and demographics
   - Competitor analysis
   - Market size and growth potential

4. Financial Analysis
   - Setup and operational costs
   - Revenue model and pricing
   - Break-even analysis
   - 5-year projections

5. Implementation Challenges
   - Technical and operational risks
   - Market entry barriers
   - Risk mitigation strategies

6. Marketing Strategy
   - Brand positioning
   - Marketing channels
   - Customer acquisition plan
   - Retention strategy

7. Growth & Scaling Strategy
   - Short-term goals (6-12 months)
   - Medium-term plans (1-2 years)
   - Long-term vision (3-5 years)

8. Overall Score (1-10)
   - Category scores
   - Key strengths
   - Areas for improvement
   - Final recommendation

Analyze this idea: `;

// Visual data prompt template
const visualDataPrompt = `You are a data analysis tool. Your task is to analyze the following business idea and provide numerical data for visualization. 

IMPORTANT: Your response must be ONLY valid JSON data. Do not include any explanatory text, markdown formatting, or code blocks. The response should start with { and end with }.

Here is the exact format required (replace the example values with appropriate values based on the idea):
{
  "overallScore": 8.5,
  "categoryScores": {
    "marketPotential": 8.5,
    "technicalFeasibility": 7.8,
    "financialViability": 8.2,
    "scalability": 7.9,
    "competitiveAdvantage": 8.1
  },
  "marketAnalysis": {
    "currentMarketSize": 85,
    "projectedGrowth": 95,
    "competitionLevel": 65
  },
  "implementationTimeline": {
    "planning": 20,
    "development": 40,
    "testing": 20,
    "launch": 20
  },
  "costBreakdown": {
    "development": 35,
    "marketing": 25,
    "operations": 20,
    "legal": 10,
    "other": 10
  },
  "revenueProjection": {
    "year1": 100,
    "year2": 250,
    "year3": 400,
    "year4": 600,
    "year5": 850
  }
}

Analyze this idea: `; 