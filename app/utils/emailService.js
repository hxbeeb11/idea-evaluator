import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Add your verified email here
const VERIFIED_EMAIL = 'mohdhabeeburrahman11@gmail.com';

export async function sendAnalysisEmail(email, analysis) {
  try {
    console.log('Starting email send process...'); 
    console.log('Email recipient:', email);
    console.log('API Key present:', !!process.env.RESEND_API_KEY);
    console.log('API Key first chars:', process.env.RESEND_API_KEY?.substring(0, 5));

    if (!process.env.RESEND_API_KEY) {
      throw new Error('Missing Resend API key');
    }

    // In testing mode, we can only send to the verified email
    const emailData = {
      from: 'onboarding@resend.dev',
      to: VERIFIED_EMAIL, // Always send to your verified email
      replyTo: email, // Store the user's email here
      subject: 'Your Idea Evaluation Results',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2C3E50;">Your Idea Evaluation Results</h1>
          ${email !== VERIFIED_EMAIL ? 
            `<p style="color: #666;">Original requester: ${email}</p>` : ''
          }
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px;">
            ${analysis.replace(/\n/g, '<br>')}
          </div>
          <p style="margin-top: 20px; color: #666;">
            This analysis was generated by AI. Please use it as a starting point for your research.
          </p>
        </div>
      `,
    };

    console.log('Attempting to send email...');
    const result = await resend.emails.send(emailData);
    console.log('Email send result:', result);
    return result;
  } catch (error) {
    console.error('Email send error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    });
    throw error;
  }
} 