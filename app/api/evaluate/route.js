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
        const visualDataText = visualDataResult.response.text();
        
        console.log('Analysis and visual data generated successfully');
        
        let visualData;
        try {
          visualData = cleanJsonResponse(visualDataText);
        } catch (error) {
          console.error('Failed to parse visual data:', error);
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
const analysisPrompt = `Provide an extensive and detailed evaluation of the following business/project idea. Your analysis should be thorough and insightful, covering all critical aspects as outlined in the sections below. Format your response in markdown.

1. Project Overview
   - Core concept and value proposition
   - Key features and functionalities
   - Primary objectives and goals
   - Potential impact in the market

2. Technical Requirements
   - Detailed technology stack needed
   - Infrastructure requirements
   - Development timeline estimation
   - Security considerations
   - Scalability requirements
   - Third-party integrations needed

3. Market Analysis
   - Target Audience
     * Detailed demographic breakdown
     * User personas
     * Pain points addressed
     * User acquisition challenges
   - Competition
     * Direct competitors analysis
     * Indirect competitors
     * Competitive advantages and disadvantages
     * Market positioning strategy
   - Market Size
     * Total Addressable Market (TAM)
     * Serviceable Addressable Market (SAM)
     * Market growth trends
     * Regional market opportunities

4. Financial Analysis
   - Initial Setup Costs
     * Development costs
     * Infrastructure setup
     * Legal and compliance
     * Marketing and branding
   - Operational Costs
     * Monthly running costs
     * Staff requirements
     * Marketing budget
     * Customer support
   - Revenue Streams
     * Primary revenue models
     * Pricing strategy analysis
     * Revenue projections
     * Break-even analysis
   - Funding Requirements
     * Initial capital needed
     * Potential funding sources
     * Investment timeline

5. Implementation Challenges
   - Technical challenges
   - Market entry barriers
   - Regulatory compliance issues
   - Operational challenges
   - Risk assessment and mitigation strategies

6. Marketing Strategy
   - Brand Positioning
     * Brand identity
     * Value proposition
     * Brand messaging
   - Marketing Channels
     * Digital marketing strategy
     * Content marketing approach
     * Social media strategy
     * PR and partnerships
   - Customer Acquisition
     * User acquisition strategy
     * Customer retention plans
     * Growth hacking opportunities
   - USP (Unique Selling Proposition)
     * Key differentiators
     * Competitive advantages
     * Market positioning

7. Growth & Scaling Strategy
   - Short-term goals (6-12 months)
   - Medium-term expansion (1-2 years)
   - Long-term vision (3-5 years)
   - International expansion possibilities
   - Potential pivots and adaptations

8. Overall Score (1-10) with Detailed Justification
   - Score breakdown by category
   - Key strengths
   - Areas for improvement
   - Final recommendation

Analyze this idea: `;

// Visual data prompt template
const visualDataPrompt = `Based on the following business idea, provide numerical data for visualization in JSON format. The response should be ONLY valid JSON, nothing else. Do not include markdown code block syntax or any other text.

Analyze this idea and return data in this exact format:
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