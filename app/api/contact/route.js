import { sendContactEmail } from "../../utils/emailService";

export async function POST(request) {
  try {
    const { email, message } = await request.json();

    await sendContactEmail(email, message);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 