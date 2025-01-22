import { GoogleGenerativeAI } from "@google/generative-ai";
import { sendAnalysisEmail } from "../../utils/emailService";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function cleanJsonResponse(text) {
  if (!text) {
    console.error('Received empty text in cleanJsonResponse');
    return null;
  }

  try {
    // Remove markdown code block syntax and any extra whitespace
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    
    // Validate the parsed data has required fields
    if (!parsed.overallScore || !parsed.categoryScores) {
      console.error('Parsed data missing required fields');
      return null;
    }
    
    return parsed;
  } catch (e) {
    console.error('JSON parsing error:', e);
    console.error('Raw text that failed to parse:', text);
    return null;
  }
}

const fallbackVisualData = {
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

async function generateSectionContent(model, section, idea) {
  const sectionPrompt = `Analyze the following business idea and provide a detailed analysis ONLY for the ${section} section. Be thorough and specific in your analysis.

Important formatting instructions:
- Use bullet points (•) instead of numbers for listing items
- Do not use heading tags (# or ##) within the section content
- Keep the text format clean and consistent
- For Implementation Challenges specifically, list each challenge with a bullet point

Here's the idea to analyze:

${idea}`;

  try {
    const result = await model.generateContent(sectionPrompt);
    let content = result.response.text();
    
    // Clean up the content formatting
    content = content
      // Remove any heading markers
      .replace(/^#+ /gm, '')
      // Convert numbered lists to bullet points
      .replace(/^\d+\.\s+/gm, '• ')
      // Ensure consistent bullet point format
      .replace(/^[-*]\s+/gm, '• ')
      // Remove duplicate section titles
      .replace(new RegExp(`^${section}\\s*$`, 'gm'), '')
      // Remove extra newlines
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return content;
  } catch (error) {
    console.error(`Error generating ${section}:`, error);
    throw new Error(`Failed to generate ${section}: ${error.message}`);
  }
}

export async function POST(request) {
  console.log('Starting POST request handler');
  try {
    // Validate request body
    const body = await request.json().catch(error => {
      console.error('Failed to parse request body:', error);
      throw new Error('Invalid request format');
    });

    if (!body) {
      console.error('Empty request body received');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Request body is required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { email, idea } = body;
    console.log('Received request with email:', email?.substring(0, 5) + '...');
    
    // Validate required fields
    if (!email || !idea) {
      console.error('Missing required fields:', { hasEmail: !!email, hasIdea: !!idea });
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Email and idea are required fields'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not configured');
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'API configuration error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log('Starting analysis with Gemini API');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Add timeout to the entire operation
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout after 50 seconds')), 50000);
    });

    const analysisPromise = (async () => {
      try {
        console.log('Generating content with Gemini API');
        
        // Generate sections in parallel
        const sections = [
          "Project Overview",
          "Technical Requirements",
          "Market Analysis",
          "Financial Analysis",
          "Implementation Challenges",
          "Marketing Strategy",
          "Growth & Scaling Strategy",
          "Overall Score"
        ];

        console.log('Generating sections in parallel');
        const sectionResults = await Promise.all(
          sections.map((section, index) => 
            generateSectionContent(model, section, idea)
              .then(content => ({ section: `${index + 1}. ${section}`, content }))
              .catch(error => {
                console.error(`Section generation error (${section}):`, error);
                return { 
                  section: `${index + 1}. ${section}`, 
                  content: `Unable to generate ${section} analysis. Please try again.` 
                };
              })
          )
        );

        // Generate visual data separately
        const visualDataResult = await model.generateContent(visualDataPrompt + idea)
          .catch(error => {
            console.error('Visual data generation error:', error);
            throw new Error(`Failed to generate visual data: ${error.message}`);
          });

        console.log('Content generation completed');

        // Combine all sections into one analysis
        const analysis = sectionResults
          .map(({ section, content }) => `# ${section}\n\n${content}\n\n`)
          .join('---\n\n');

        console.log('Analysis response length:', analysis.length);
        
        // Modified section validation
        const requiredSections = [
          ["Project Overview", "1. Project Overview"],
          ["Technical", "2. Technical Requirements", "Technical Requirements"],
          ["Market Analysis", "3. Market Analysis"],
          ["Financial", "4. Financial Analysis", "Financial Analysis"],
          ["Implementation", "5. Implementation Challenges", "Implementation Challenges"],
          ["Marketing", "6. Marketing Strategy", "Marketing Strategy"],
          ["Growth", "Scaling", "7. Growth & Scaling Strategy"],
          ["Score", "Overall Score", "8. Overall Score"]
        ];

        const missingSections = requiredSections.filter(sectionVariants => 
          !sectionVariants.some(variant => analysis.includes(variant))
        );

        if (missingSections.length > 0) {
          console.warn('Missing sections detected:', missingSections.map(s => s[0]).join(', '));
          // Instead of throwing an error, we'll log it and continue
          console.log('Proceeding with available sections');
        }

        if (!visualDataResult?.response) {
          console.error('Invalid visual data result:', visualDataResult);
          throw new Error('Invalid visual data result from Gemini API');
        }
        
        const visualDataText = visualDataResult.response.text();
        console.log('Visual data response length:', visualDataText.length);
        
        // Parse visual data with fallback
        const parsedVisualData = cleanJsonResponse(visualDataText);
        const visualData = parsedVisualData || fallbackVisualData;

        console.log('Starting email send process');
        try {
          await sendAnalysisEmail(email, analysis, visualData);
          console.log('Email sent successfully');
          
          return new Response(JSON.stringify({ 
            success: true, 
            message: 'Analysis complete! Check your email for the detailed report.',
            emailStatus: 'sent',
            warnings: missingSections.length > 0 ? 'Some sections may be incomplete' : undefined
          }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (emailError) {
          console.error('Email send error:', emailError);
          throw new Error(`Failed to send email: ${emailError.message}`);
        }
      } catch (error) {
        console.error('Analysis process error:', error);
        throw error;
      }
    })();

    console.log('Waiting for analysis completion or timeout');
    return await Promise.race([analysisPromise, timeoutPromise]);

  } catch (error) {
    console.error('API error:', error);
    
    let errorMessage = 'An error occurred while processing your request.';
    let statusCode = 500;
    let errorDetails = error.message;

    if (error.message.includes('timeout')) {
      errorMessage = 'The request took too long to process. Please try again.';
      statusCode = 504;
    } else if (error.message.includes('required fields')) {
      errorMessage = error.message;
      statusCode = 400;
    } else if (error.message.includes('Failed to generate')) {
      errorMessage = 'Failed to generate analysis. Please try again.';
      statusCode = 500;
    } else if (error.message.includes('Failed to send email')) {
      errorMessage = 'Failed to send email. Please try again.';
      statusCode = 500;
    } else if (error.message.includes('Invalid request format')) {
      errorMessage = 'Invalid request format. Please try again.';
      statusCode = 400;
    }

    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage,
      details: errorDetails
    }), {
      status: statusCode,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Analysis prompt template
const analysisPrompt = `Provide an extremely detailed and comprehensive evaluation of the following business/project idea. Your analysis should be thorough, specific, and actionable. Format your response in markdown, ensuring each section is complete and detailed.

1. Project Overview
   - Detailed explanation of the core concept and unique value proposition
   - Comprehensive breakdown of key features, functionalities, and objectives
   - In-depth analysis of target market impact and potential societal benefits
   - Unique selling points and competitive advantages
   - Long-term vision and potential for innovation

2. Technical Requirements
   - Detailed technology stack recommendations with specific tools and frameworks
   - Comprehensive infrastructure requirements and architecture design
   - Specific security measures and compliance requirements
   - Detailed scalability considerations and technical challenges
   - Development timeline with specific milestones and phases
   - Required technical expertise and team composition
   - Integration requirements and third-party dependencies
   - Testing and quality assurance strategy

3. Market Analysis
   - Detailed target audience segmentation with demographics and psychographics
   - Comprehensive competitor analysis with specific companies and their strengths/weaknesses
   - Market size calculations with TAM, SAM, and SOM estimates
   - Detailed growth potential analysis with specific growth drivers
   - Market trends and future projections
   - Regulatory environment and compliance requirements
   - Entry barriers and competitive advantages
   - Geographic market considerations and expansion opportunities
   - Customer pain points and solution fit analysis

4. Financial Analysis
   - Detailed setup costs breakdown (infrastructure, development, marketing, etc.)
   - Comprehensive operational cost analysis
   - Specific revenue model with pricing strategy and revenue streams
   - Detailed break-even analysis with timeline
   - 5-year financial projections with specific metrics:
     * Revenue growth projections
     * Cost structure evolution
     * Profit margins
     * Cash flow forecasts
   - Funding requirements and investment stages
   - ROI calculations and financial metrics
   - Risk assessment and mitigation strategies
   - Potential exit strategies and valuation projections

5. Implementation Challenges
   - Detailed technical risks and mitigation strategies
   - Specific operational challenges and solutions
   - Market entry barriers and overcome strategies
   - Resource allocation challenges
   - Scaling challenges and solutions
   - Regulatory and compliance challenges
   - Competition response strategies
   - Timeline risks and contingency plans

6. Marketing Strategy
   - Detailed brand positioning and messaging strategy
   - Comprehensive marketing channel analysis with specific platforms
   - Customer acquisition strategy with CAC estimates
   - Content marketing and social media strategy
   - PR and communication plan
   - Partnership and collaboration opportunities
   - Customer retention strategy with specific tactics
   - Marketing budget allocation
   - KPIs and success metrics
   - Growth hacking opportunities

7. Growth & Scaling Strategy
   - Detailed short-term goals (6-12 months) with specific metrics
   - Comprehensive medium-term plans (1-2 years) with expansion strategies
   - Long-term vision (3-5 years) with market leadership goals
   - Geographic expansion strategy
   - Product/service line expansion opportunities
   - Partnership and acquisition strategies
   - Team scaling plan
   - Infrastructure scaling strategy
   - Market penetration tactics
   - Customer base growth projections

8. Overall Score (1-10)
   - Detailed category scores with specific justifications:
     * Market Potential
     * Technical Feasibility
     * Financial Viability
     * Competitive Advantage
     * Innovation Level
     * Scalability
     * Risk Level
   - Comprehensive analysis of key strengths with specific examples
   - Detailed areas for improvement with actionable recommendations
   - Final recommendation with specific next steps and timeline
   - Critical success factors and key milestones
   - Risk-reward assessment
   - Alternative approaches and pivot possibilities

Provide extremely detailed insights and actionable recommendations for each section. Use specific examples, metrics, and industry benchmarks where applicable. Your analysis should help the entrepreneur make informed decisions and understand both opportunities and challenges clearly.

Analyze this idea: `;

// Visual data prompt template
const visualDataPrompt = `You are a data analysis tool. Your task is to analyze the following business idea and provide detailed numerical data for visualization. Your analysis should be thorough and based on comprehensive market research and industry standards.

IMPORTANT: Your response must be ONLY valid JSON data. Do not include any explanatory text, markdown formatting, or code blocks. The response should start with { and end with }.

Provide detailed metrics for the following aspects (replace example values with appropriate values based on thorough analysis of the idea):
{
  "overallScore": 8.5,
  "categoryScores": {
    "marketPotential": 8.5,
    "technicalFeasibility": 7.8,
    "financialViability": 8.2,
    "scalability": 7.9,
    "competitiveAdvantage": 8.1,
    "innovationLevel": 8.3,
    "riskLevel": 6.8
  },
  "marketAnalysis": {
    "currentMarketSize": 85,
    "projectedGrowth": 95,
    "competitionLevel": 65,
    "marketSaturation": 45,
    "entryBarriers": 70,
    "regulatoryComplexity": 60
  },
  "implementationTimeline": {
    "planning": 20,
    "development": 40,
    "testing": 20,
    "launch": 20,
    "marketEntry": 25,
    "scaling": 35
  },
  "costBreakdown": {
    "development": 35,
    "marketing": 25,
    "operations": 20,
    "legal": 10,
    "infrastructure": 15,
    "staffing": 30,
    "other": 10
  },
  "revenueProjection": {
    "year1": 100,
    "year2": 250,
    "year3": 500,
    "year4": 800,
    "year5": 1200
  },
  "riskAssessment": {
    "technical": 65,
    "market": 55,
    "financial": 60,
    "operational": 50,
    "regulatory": 45
  },
  "successMetrics": {
    "customerAcquisition": 80,
    "marketPenetration": 70,
    "brandAwareness": 75,
    "userRetention": 85,
    "profitMargin": 65
  }
}

Analyze this idea and provide detailed metrics: `; 