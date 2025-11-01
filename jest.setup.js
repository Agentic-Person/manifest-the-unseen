import '@testing-library/jest-dom'

// Mock environment variables for tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'
process.env.WHOP_API_KEY = 'test-whop-api-key'
process.env.WHOP_CLIENT_ID = 'test-client-id'
process.env.WHOP_CLIENT_SECRET = 'test-client-secret'
process.env.ANTHROPIC_API_KEY = 'test-anthropic-key'
process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000'
