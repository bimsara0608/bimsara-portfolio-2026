import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    // Initialize Resend inside the request handler to prevent build-time errors
    // if the environment variable is not yet set in Vercel.
    const resend = new Resend(process.env.RESEND_API_KEY || 'missing_key');
    // 1. Authenticate the request: Ensure only logged-in admins can send emails
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse the request body
    const body = await req.json();
    const { to, subject, message, replyToMessageId } = body;

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields (to, subject, message)' },
        { status: 400 }
      );
    }

    // 3. Send the email using Resend
    // We use a verified domain or resend.dev for testing if no domain is verified yet.
    // For a production app, the 'from' address should match the verified domain in Resend.
    // E.g., 'Bimsara <hello@yourdomain.com>'
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: [to],
      subject: subject,
      text: message, // Plain text version
      html: `<div style="font-family: sans-serif; white-space: pre-wrap;">${message}</div>`, // Simple HTML wrapper
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Optional: We could update the original message in Supabase to mark it as 'replied'
    // if we added a `replied_at` column, but for now we just return success.
    if (replyToMessageId) {
      await supabase
        .from('contact_messages')
        .update({ is_read: true }) // ensure it's marked as read when replied to
        .eq('id', replyToMessageId);
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while sending the email.' },
      { status: 500 }
    );
  }
}
