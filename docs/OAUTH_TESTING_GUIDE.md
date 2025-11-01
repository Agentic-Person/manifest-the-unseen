# OAuth Integration Testing Guide

## Prerequisites

Before testing the OAuth flow, ensure:

1. **Database Migration Applied**
   - Run the migration via Supabase Dashboard SQL Editor
   - See `docs/MIGRATION_INSTRUCTIONS.md` for details
   - Verify all tables exist using the verification script

2. **Environment Variables Set**
   - Check `.env.local` has all required Whop credentials:
     ```
     WHOP_CLIENT_ID=app_p2sU9MQCeFnT4o
     WHOP_CLIENT_SECRET=0u_46cKC_VSlKurR5yvKTiPBY_vfEkmmxKpS5-ztfkQ
     WHOP_API_KEY=0u_46cKC_VSlKurR5yvKTiPBY_vfEkmmxKpS5-ztfkQ
     NEXT_PUBLIC_BASE_URL=http://localhost:3000
     ```

3. **Whop OAuth App Configured**
   - Redirect URI set to: `http://localhost:3000/api/auth/callback/whop`
   - OAuth app must be approved and active

## Testing the OAuth Flow

### Test 1: Initial OAuth Redirect

**Objective:** Verify unauthenticated users are redirected to Whop OAuth

**Steps:**
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open browser (incognito mode recommended):
   ```
   http://localhost:3000/customer/test
   ```

3. **Expected Result:**
   - You should be redirected to: `https://whop.com/oauth?client_id=app_p2sU9MQCeFnT4o&redirect_uri=...`
   - Whop login page should appear

**If this fails:**
- Check `app/customer/[experienceId]/layout.tsx` auth logic
- Verify cookies are cleared (try incognito mode)
- Check browser console for errors

---

### Test 2: OAuth Callback and User Creation

**Objective:** Verify callback handler creates user profile in Supabase

**Steps:**
1. On the Whop OAuth page, click "Authorize" or "Allow Access"

2. **Expected Result:**
   - Redirected back to: `http://localhost:3000/customer/test`
   - No error messages displayed
   - Session cookies should be set

3. Verify in browser DevTools:
   - Open Application > Cookies > `http://localhost:3000`
   - Should see: `whop_access_token` and `whop_user_id`

4. Verify user created in Supabase:
   - Go to Supabase Dashboard > Table Editor > user_profiles
   - Should see a new row with your Whop user ID
   - Default values:
     - current_phase: 1
     - level: "Seeker"
     - signal_strength_score: 0
     - journal_streak: 0
     - badges: []

**If this fails:**
- Check browser console for errors
- Check server console for OAuth errors
- Verify redirect URI matches exactly in Whop app settings
- Check `app/api/auth/callback/whop/route.ts` for error logs

---

### Test 3: Session Persistence

**Objective:** Verify session persists across page refreshes

**Steps:**
1. After successful login, refresh the page: `http://localhost:3000/customer/test`

2. **Expected Result:**
   - No redirect to Whop OAuth
   - Page loads normally
   - Still authenticated

3. Open a new tab and navigate to:
   ```
   http://localhost:3000/customer/another-page
   ```

4. **Expected Result:**
   - Still authenticated
   - No login prompt

**If this fails:**
- Check cookie expiration (should be 7 days)
- Verify cookies are httpOnly and sameSite=lax
- Check `lib/auth.ts` session verification logic

---

### Test 4: Protected API Route

**Objective:** Verify `withAuth` middleware protects API routes

**Steps:**
1. **Test authenticated request:**
   ```bash
   curl http://localhost:3000/api/test/auth \
     -H "Cookie: whop_access_token=YOUR_TOKEN; whop_user_id=YOUR_USER_ID"
   ```

   **Expected Result:**
   ```json
   {
     "success": true,
     "message": "Authentication successful!",
     "user": {
       "whopUserId": "user_xxx",
       "username": "your_username",
       "email": "your_email@example.com"
     },
     "timestamp": "2025-10-31T..."
   }
   ```

2. **Test unauthenticated request:**
   ```bash
   curl http://localhost:3000/api/test/auth
   ```

   **Expected Result:**
   ```json
   {
     "error": "No valid session"
   }
   ```
   HTTP Status: 401 Unauthorized

**If this fails:**
- Check `lib/auth.ts` `withAuth` function
- Verify `requireAuth` logic
- Check Whop SDK `verifyWhopMembership` call

---

### Test 5: Logout Flow

**Objective:** Verify logout clears session and redirects

**Steps:**
1. While logged in, navigate to:
   ```
   http://localhost:3000/api/auth/logout
   ```

2. **Expected Result:**
   - Redirected to: `http://localhost:3000/`
   - Session cookies deleted

3. Verify cookies cleared:
   - Open DevTools > Application > Cookies
   - `whop_access_token` and `whop_user_id` should be gone

4. Try accessing protected route:
   ```
   http://localhost:3000/customer/test
   ```

5. **Expected Result:**
   - Redirected to Whop OAuth login again

**If this fails:**
- Check `app/api/auth/logout/route.ts`
- Verify cookies are being deleted properly
- Check cookie path settings

---

### Test 6: Multi-Tenant Isolation (RLS)

**Objective:** Verify users can't see each other's data

**Steps:**
1. Log in as User A
2. Note the `whop_user_id` from cookies
3. Create a journal entry via API or UI
4. Log out
5. Log in as User B (different Whop account)
6. Try to access User A's data via API

**Expected Result:**
- User B cannot see User A's journal entries
- Supabase RLS policies block cross-user access

**If this fails:**
- Check Supabase RLS policies are enabled
- Verify `current_setting('app.whop_user_id')` is being set correctly
- Check table policies in migration SQL

---

## Automated Testing Script

Run all tests automatically:

```bash
# Create test script
npm run test:oauth
```

This will:
1. Verify database connection
2. Check all tables exist
3. Verify environment variables
4. Test auth middleware functions
5. Generate test report

---

## Common Issues and Solutions

### Issue: "No authorization code provided"

**Cause:** OAuth callback didn't receive the `code` parameter

**Solution:**
- Check redirect URI matches exactly in Whop app settings
- Ensure no trailing slashes or mismatched protocols (http vs https)

### Issue: "Invalid or expired membership"

**Cause:** Whop user verification failed

**Solution:**
- Check `WHOP_API_KEY` is correct
- Verify user actually has access to the product
- Check Whop SDK configuration in `lib/whop.ts`

### Issue: "Could not find table 'user_profiles'"

**Cause:** Database migration not applied

**Solution:**
- Run the migration via Supabase Dashboard
- See `docs/MIGRATION_INSTRUCTIONS.md`

### Issue: Infinite redirect loop

**Cause:** OAuth callback fails but layout keeps redirecting

**Solution:**
- Check browser console for errors
- Verify cookies are being set in callback handler
- Check cookie sameSite and secure settings for localhost

### Issue: "Tenant or user not found"

**Cause:** Database connection string incorrect

**Solution:**
- Use Supabase Dashboard SQL Editor for migrations
- Don't rely on pooler connection string format

---

## Production Testing Checklist

Before deploying to production:

- [ ] Test OAuth flow on production domain
- [ ] Verify HTTPS redirect URI configured in Whop app
- [ ] Test with multiple real users
- [ ] Verify RLS policies work across different users
- [ ] Test session expiration and renewal
- [ ] Verify logout works properly
- [ ] Test error handling for failed OAuth
- [ ] Monitor Whop webhook delivery
- [ ] Test subscription status sync
- [ ] Verify rate limiting on auth endpoints

---

## Next Steps After OAuth Testing

Once OAuth is working:

1. **Implement Whop Webhooks** (Task 004)
   - Handle subscription changes
   - Sync membership status
   - Process payment events

2. **Build Dashboard UI** (Task 005)
   - Show user profile data
   - Display current phase and level
   - Show progress stats

3. **Implement Workbook** (Task 006)
   - Protect workbook routes with auth
   - Load user's progress from database
   - Save exercise completions

4. **Add AI Monk Mentor** (Task 007)
   - Use authenticated user context
   - Load conversation history
   - Save chat messages

---

## Support

If you encounter issues not covered in this guide:

1. Check server logs for detailed error messages
2. Review Whop OAuth documentation: https://dev.whop.com/api-reference/oauth
3. Check Supabase logs in Dashboard > Logs
4. Verify all environment variables are set correctly
5. Test with a fresh Whop account to rule out user-specific issues
