# Task 003 - Whop OAuth Integration

**Status:** [ ] Not Started - REQUIRES WHOP MCP SERVER

**Week/Phase:** Week 1

**Agent:** Agent 2 - Backend Lead

**MCP Servers Used:**
- [X] Whop MCP - **REQUIRED**
- [X] Supabase MCP - **REQUIRED**
- [ ] Pipedream MCP
- [ ] Puppeteer MCP

---

### Description

Implement Whop OAuth authentication flow so users can log in through Whop's platform. Create user profiles in Supabase when new users authenticate. Handle session management and protect API routes.

---

### Technical Approach

Use **Whop MCP Server** to configure OAuth application, set up redirect URIs, and test authentication flow. Integrate with Supabase to create/update user records on successful authentication.

---

### Implementation Steps

1. Use Whop MCP to create/configure OAuth application
2. Get Whop Client ID and Client Secret
3. Configure OAuth redirect URIs
4. Install `@whop/api` SDK
5. Create `/api/auth/whop/callback` route
6. Handle OAuth token exchange
7. Create middleware to verify Whop sessions
8. Create user profile in Supabase on first login
9. Set up session management
10. Protect all API routes with auth middleware
11. Test login/logout flow
12. Test multi-tenant user isolation

---

### Code/Files Created

**Files:**
- `app/api/auth/whop/route.ts` - OAuth initiation
- `app/api/auth/whop/callback/route.ts` - OAuth callback handler
- `lib/whop.ts` - Whop SDK utilities
- `middleware.ts` - Auth middleware for protecting routes
- `lib/auth.ts` - Session management utilities

**Key Functions:**

```typescript
// lib/whop.ts
import { WhopAPI } from '@whop/api';

export const whop = new WhopAPI({
  clientId: process.env.WHOP_CLIENT_ID!,
  clientSecret: process.env.WHOP_CLIENT_SECRET!
});

export async function getWhopUser(accessToken: string) {
  return await whop.users.me({ accessToken });
}
```

```typescript
// app/api/auth/whop/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { whop } from '@/lib/whop';
import { createSupabaseClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect('/error?message=No auth code');
  }

  try {
    // Exchange code for access token
    const tokenResponse = await whop.oauth.getAccessToken({ code });
    const { access_token } = tokenResponse;

    // Get user info from Whop
    const whopUser = await whop.users.me({ accessToken: access_token });

    // Create/update user in Supabase
    const supabase = createSupabaseClient();

    const { data: user, error: userError } = await supabase
      .from('users')
      .upsert({
        whop_user_id: whopUser.id,
        email: whopUser.email,
        last_active: new Date().toISOString()
      }, {
        onConflict: 'whop_user_id',
        returning: 'representation'
      })
      .select()
      .single();

    if (userError) throw userError;

    // Create user profile if first time
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: user.id,
        whop_user_id: whopUser.id
      })
      .onConflict('user_id')
      .ignore();

    if (profileError) throw profileError;

    // Set session cookie
    const response = NextResponse.redirect('/customer/dashboard');
    response.cookies.set('whop_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error('OAuth error:', error);
    return NextResponse.redirect('/error?message=Authentication failed');
  }
}
```

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getWhopUser } from '@/lib/whop';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('whop_token')?.value;

  // Protect customer routes
  if (request.nextUrl.pathname.startsWith('/customer')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify token is valid
      await getWhopUser(token);
      return NextResponse.next();
    } catch (error) {
      // Token invalid, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/customer/:path*', '/api/:path*']
};
```

---

### Testing Checklist

- [ ] Whop OAuth app configured via Whop MCP
- [ ] OAuth flow initiates correctly
- [ ] Callback receives authorization code
- [ ] Access token exchanged successfully
- [ ] User info retrieved from Whop
- [ ] User created in Supabase on first login
- [ ] User updated in Supabase on subsequent logins
- [ ] Session cookie set correctly
- [ ] Protected routes redirect to login when unauthenticated
- [ ] Authenticated users can access protected routes
- [ ] Logout clears session
- [ ] Multi-tenant users don't see each other's data

---

### Dependencies

**Blocked by:**
- Task 001 (Next.js initialization)
- Task 002 (Supabase database - needs users table)
- Whop MCP Server must be connected
- Supabase MCP Server must be connected

**Blocks:**
- All user-facing features
- All API routes requiring authentication
- Dashboard and workbook pages
- Journal and meditation features

**External Dependencies:**
- Whop developer account
- Whop MCP Server connection
- `@whop/api` package
- Environment variables: WHOP_CLIENT_ID, WHOP_CLIENT_SECRET

---

### Notes for Junior Developer

**What needs to be built:**
OAuth is how users prove they have access to your Whop product. Without this, there's no way to identify users or protect their data.

**Why Whop OAuth (not custom auth):**
- Users already have Whop accounts (no signup friction)
- Whop handles payment verification automatically
- Built-in subscription status checking
- No need to build login/signup UI
- Whop manages password resets, 2FA, etc.

**OAuth Flow Explained:**
1. User clicks "Login" → redirected to Whop
2. User authorizes app on Whop
3. Whop redirects back with authorization `code`
4. Our server exchanges `code` for `access_token`
5. We use `access_token` to get user info
6. We create/update user in our Supabase database
7. We set a session cookie
8. User is now authenticated

**Multi-Tenant Architecture:**
Each Whop product/community is a separate tenant. User IDs from different communities are isolated. The `whop_user_id` field ensures we can track users across our database while maintaining Whop's identity.

**Session Management:**
We use HTTP-only cookies (not localStorage) for security. Cookies are automatically sent with every request, making auth checking seamless.

**Common pitfalls:**
1. **Redirect URI mismatch:** Whop OAuth requires exact redirect URI match. `http://localhost:3000` ≠ `http://localhost:3000/`
2. **Missing error handling:** OAuth can fail for many reasons (user denies, network issues, invalid code). Always handle errors gracefully.
3. **Token expiration:** Whop tokens expire. Implement refresh token logic or re-auth when tokens expire.
4. **HTTPS in production:** OAuth requires HTTPS in production. localhost HTTP is fine for development.
5. **Cookie security:** Never store tokens in localStorage (XSS vulnerable). Use httpOnly cookies.

**Middleware Pattern:**
Next.js middleware runs on EVERY request before reaching the page/API. This is perfect for auth checking:
- Unauthenticated request to `/customer/workbook` → redirect to login
- Authenticated request → proceed normally

**User Profile Creation:**
On first login, we create a user profile with default values:
- Phase 1 (starting point)
- Level: "Seeker"
- Streaks: 0
- Empty badges array

**Future improvements:**
- Implement refresh token rotation
- Add "Remember me" option
- Log authentication events for security audit
- Add rate limiting to prevent brute force
- Implement OAuth state parameter for CSRF protection

**Resources:**
- [Whop OAuth Docs](https://dev.whop.com/api-reference/oauth)
- [Next.js Middleware Docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [OAuth 2.0 Spec](https://oauth.net/2/)

---

### Completion Notes

**Date Completed:** [Waiting for Whop MCP Server]

**Time Spent:** [To be tracked]

**Final Status:** Not Started - Waiting for MCP Server connection

**Handoff Notes:**
⚠️ **CRITICAL:** This task REQUIRES Whop MCP Server to be connected. Do not attempt manual OAuth setup.

Once Whop MCP is connected:
1. Use MCP to create OAuth application
2. Configure redirect URIs (development and production)
3. Get client credentials
4. Test OAuth flow in development
5. Verify user creation in Supabase
6. Test session persistence across page refreshes
7. Test logout flow

This blocks ALL user-facing features. Prioritize this task.
