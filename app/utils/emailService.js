import nodemailer from 'nodemailer';
import QuickChart from 'quickchart-js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD // This is an App Password, not your regular Gmail password
  }
});

function formatAnalysis(analysis) {
  // First, clean up any extra whitespace and normalize line endings
  let formatted = analysis
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')  // Replace multiple newlines with double newlines
    .replace(/^#+\s*$/gm, '')    // Remove standalone hashtags
    .replace(/(?:^|\n)#(?!\s)/g, '\n# '); // Ensure space after hashtags

  // Replace markdown with styled HTML
  formatted = formatted
    // Headers with proper spacing and styling
    .replace(/# (.*?)(?:\n|$)/g, '<h1 style="color: #2C3E50; font-size: 24px; margin-top: 24px; margin-bottom: 16px; border-bottom: 2px solid #ECF0F1; padding-bottom: 8px;">$1</h1>')
    .replace(/## (.*?)(?:\n|$)/g, '<h2 style="color: #2C3E50; font-size: 20px; margin-top: 20px; margin-bottom: 12px;">$1</h2>')
    .replace(/### (.*?)(?:\n|$)/g, '<h3 style="color: #2C3E50; font-size: 18px; margin-top: 16px; margin-bottom: 10px;">$1</h3>')
    
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #2C3E50;">$1</strong>')
    
    // List items with proper indentation and styling
    .replace(/^\s*- (.*?)(?:\n|$)/gm, '<li style="margin: 8px 0; line-height: 1.5;">$1</li>')
    
    // Bullet points with proper indentation
    .replace(/^\s*\* (.*?)(?:\n|$)/gm, '<li style="margin: 8px 0; line-height: 1.5;">$1</li>')
    
    // Paragraphs with proper spacing
    .replace(/([^\n])\n{2,}([^\n])/g, '$1</p><p style="margin: 16px 0; line-height: 1.6;">$2')
    
    // Add paragraph tags to text blocks
    .replace(/([^\n>])\n([^\n<])/g, '$1<br>$2');

  // Wrap lists in ul tags with proper styling
  formatted = formatted.replace(
    /<li.*?<\/li>(\s*<li.*?<\/li>)*/g,
    match => `<ul style="margin: 12px 0; padding-left: 20px; list-style-type: disc;">${match}</ul>`
  );

  // Wrap content in paragraphs if not already wrapped
  if (!formatted.startsWith('<')) {
    formatted = `<p style="margin: 16px 0; line-height: 1.6;">${formatted}</p>`;
  }

  // Clean up any remaining unnecessary newlines or spaces
  formatted = formatted
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/> </g, '><')
    .trim();

  return formatted;
}

function generateCharts(visualData) {
  console.log('Generating charts with visual data:', visualData);
  const charts = [];
  
  try {
    // Category Scores Radar Chart
    const categoryScoresChart = new QuickChart();
    categoryScoresChart.setConfig({
      type: 'radar',
      data: {
        labels: Object.keys(visualData.categoryScores).map(key => 
          key.replace(/([A-Z])/g, ' $1').trim() // Add spaces before capital letters
        ),
        datasets: [{
          label: 'Category Scores',
          data: Object.values(visualData.categoryScores),
          backgroundColor: 'rgba(26, 188, 156, 0.2)',
          borderColor: 'rgba(26, 188, 156, 1)',
          pointBackgroundColor: 'rgba(26, 188, 156, 1)'
        }]
      },
      options: {
        scale: {
          ticks: { beginAtZero: true, max: 10 }
        },
        plugins: {
          title: {
            display: true,
            text: 'Category Performance Analysis'
          }
        }
      }
    });

    // Market Analysis Bar Chart
    const marketAnalysisChart = new QuickChart();
    marketAnalysisChart.setConfig({
      type: 'bar',
      data: {
        labels: ['Current Market Size', 'Projected Growth', 'Competition Level'],
        datasets: [{
          label: 'Market Analysis',
          data: Object.values(visualData.marketAnalysis),
          backgroundColor: 'rgba(26, 188, 156, 0.6)'
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true, max: 100 }
        },
        plugins: {
          title: {
            display: true,
            text: 'Market Analysis Overview'
          }
        }
      }
    });

    // Implementation Timeline Doughnut Chart
    const timelineChart = new QuickChart();
    timelineChart.setConfig({
      type: 'doughnut',
      data: {
        labels: Object.keys(visualData.implementationTimeline).map(key => 
          key.charAt(0).toUpperCase() + key.slice(1)
        ),
        datasets: [{
          data: Object.values(visualData.implementationTimeline),
          backgroundColor: [
            'rgba(26, 188, 156, 0.8)',
            'rgba(46, 204, 113, 0.8)',
            'rgba(52, 152, 219, 0.8)',
            'rgba(155, 89, 182, 0.8)'
          ]
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Implementation Timeline'
          }
        }
      }
    });

    // Revenue Projection Line Chart
    const revenueChart = new QuickChart();
    revenueChart.setConfig({
      type: 'line',
      data: {
        labels: Object.keys(visualData.revenueProjection).map(year => year.replace('year', 'Year ')),
        datasets: [{
          label: 'Projected Revenue',
          data: Object.values(visualData.revenueProjection),
          borderColor: 'rgba(26, 188, 156, 1)',
          backgroundColor: 'rgba(26, 188, 156, 0.1)',
          fill: true
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        },
        plugins: {
          title: {
            display: true,
            text: '5-Year Revenue Projection'
          }
        }
      }
    });

    // Set width and height for all charts
    [categoryScoresChart, marketAnalysisChart, timelineChart, revenueChart].forEach(chart => {
      chart.setWidth(400);
      chart.setHeight(300);
      chart.setBackgroundColor('white');
    });

    const chartUrls = {
      categoryScores: categoryScoresChart.getUrl(),
      marketAnalysis: marketAnalysisChart.getUrl(),
      timeline: timelineChart.getUrl(),
      revenue: revenueChart.getUrl()
    };

    console.log('Generated chart URLs:', chartUrls);
    return chartUrls;

  } catch (error) {
    console.error('Error generating charts:', error);
    throw new Error('Failed to generate charts: ' + error.message);
  }
}

export async function sendAnalysisEmail(email, analysis, visualData) {
  try {
    console.log('Starting email send process...'); 
    console.log('Email recipient:', email);
    console.log('Visual data for charts:', visualData);

    const charts = generateCharts(visualData);
    console.log('Charts generated successfully');

    // Create sections with embedded charts
    const analysisWithCharts = analysis
      // Add Category Performance chart after Project Overview
      .replace(
        /# 1\. Project Overview([\s\S]*?)(?=# 2\.)/,
        `# 1. Project Overview$1

## Category Performance Overview
<div style="margin: 20px 0;">
  <img src="${charts.categoryScores}" alt="Category Scores" style="max-width: 100%; height: auto; margin: 15px 0;">
  <p style="color: #666; font-size: 14px;">Radar chart showing performance across different evaluation categories</p>
</div>
`
      )
      // Add Market Analysis chart in the Market Analysis section
      .replace(
        /# 3\. Market Analysis([\s\S]*?)(?=# 4\.)/,
        `# 3. Market Analysis

## Market Overview
<div style="margin: 20px 0;">
  <img src="${charts.marketAnalysis}" alt="Market Analysis" style="max-width: 100%; height: auto; margin: 15px 0;">
  <p style="color: #666; font-size: 14px;">Bar chart comparing current market size, projected growth, and competition level</p>
</div>

$1`
      )
      // Add Implementation Timeline chart in the Implementation Challenges section
      .replace(
        /# 5\. Implementation Challenges([\s\S]*?)(?=# 6\.)/,
        `# 5. Implementation Challenges

## Implementation Timeline
<div style="margin: 20px 0;">
  <img src="${charts.timeline}" alt="Implementation Timeline" style="max-width: 100%; height: auto; margin: 15px 0;">
  <p style="color: #666; font-size: 14px;">Breakdown of the implementation phases and their relative durations</p>
</div>

$1`
      )
      // Add Revenue Projection chart in the Financial Analysis section
      .replace(
        /# 4\. Financial Analysis([\s\S]*?)(?=# 5\.)/,
        `# 4. Financial Analysis

## Revenue Projection
<div style="margin: 20px 0;">
  <img src="${charts.revenue}" alt="Revenue Projection" style="max-width: 100%; height: auto; margin: 15px 0;">
  <p style="color: #666; font-size: 14px;">5-year revenue projection trend</p>
</div>

$1`
      );

    console.log('Analysis with charts prepared');

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: email,
      subject: 'Your Idea Evaluation Results',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <h1 style="color: #2C3E50; font-size: 28px; margin-bottom: 24px; text-align: center;">Your Idea Evaluation Results</h1>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            ${formatAnalysis(analysisWithCharts)}
          </div>

          <div style="margin-top: 24px; padding: 16px; background-color: #e9ecef; border-radius: 6px; text-align: center;">
            <p style="color: #666; margin: 0;">
              This analysis was generated by AI. Please use it as a starting point for your research.
            </p>
          </div>
        </div>
      `
    };

    console.log('Attempting to send email with charts...');
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully with charts');
    return result;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
}

export async function sendContactEmail(senderEmail, message) {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: 'mohdhabeeburrahman11@gmail.com',
      subject: 'New Contact Message from Idea Evaluator',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2C3E50;">New Contact Message</h1>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
            <p><strong>From:</strong> ${senderEmail}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Contact email sent successfully');
    return result;
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw error;
  }
} 