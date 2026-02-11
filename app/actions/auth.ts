'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { resend } from '@/lib/resend';
import { redirect } from 'next/navigation';

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  const country = formData.get('country') as string;
  const referrer = formData.get('referrer') as string;

  // 1. Use Admin to generate link (creates user if not exists)
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'signup',
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        country,
        referrer,
      },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  const actionLink = data.properties?.action_link;
  if (!actionLink) {
    return { error: 'Failed to generate verification link' };
  }

  // Extract token from Supabase link to create our own local link
  const linkUrl = new URL(actionLink);
  const token = linkUrl.searchParams.get('token');
  const type = linkUrl.searchParams.get('type');
  
  if (!token || !type) {
    return { error: 'Invalid verification link generated' };
  }

  const localVerificationLink = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?token_hash=${token}&type=${type}`;

  // 2. Send custom verification email with Resend
  try {
    await resend.emails.send({
      from: 'AuraTrade <notifications@provestmarkets.com>',
      to: email,
      subject: 'Verify your AuraTrade account',
      html: `
        <div style="font-family: sans-serif; background: #020408; color: #fff; padding: 40px; border-radius: 20px;">
          <h1 style="color: #a3f0c1; margin-bottom: 20px;">AuraTrade</h1>
          <p style="font-size: 16px; margin-bottom: 20px;">Hello ${fullName},</p>
          <p style="font-size: 16px; margin-bottom: 30px; color: #cbd5e1;">
            Thank you for choosing AuraTrade for your institutional trading needs.
            Please verify your email to access your secure dashboard.
          </p>
          <a href="${localVerificationLink}" 
             style="background: #a3f0c1; color: #020408; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; display: inline-block;">
            Verify Email
          </a>
          <p style="margin-top: 40px; font-size: 12px; color: #64748B;">
            If you did not request this, please ignore this email.
          </p>
        </div>
      `,
    });
  } catch (emailError) {
    console.error('Resend Error:', emailError);
    // User is created, but email failed. Ideally we'd rollback or warn.
    return { error: 'Account created but failed to send verification email.' };
  }

  return { success: true };
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/');
}
