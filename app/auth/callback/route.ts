import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token = searchParams.get('token')
  const type = searchParams.get('type') as EmailOtpType | null
  const email = searchParams.get('email')
  const next = searchParams.get('next') ?? '/dashboard'

  const supabase = await createClient()

  // Case 1: Standard PKCE Code Exchange
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return handleRedirect(request, origin, next)
    }
  }

  // Case 2: Custom Token-based verification (for Resend/Custom links)
  const tokenHash = searchParams.get('token_hash') || searchParams.get('token')
  
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    })
    if (!error) {
      return handleRedirect(request, origin, next)
    }
  }

  // Fallback: Redirect to an error page
  return NextResponse.redirect(`${origin}/signin?error=Verification failed`)
}

function handleRedirect(request: Request, origin: string, next: string) {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'

  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${next}`)
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`)
  } else {
    return NextResponse.redirect(`${origin}${next}`)
  }
}
