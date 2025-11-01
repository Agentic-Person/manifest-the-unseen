module.exports = {
  testTimeout: 30000,
  launch: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  },
  server: {
    command: 'pnpm dev',
    port: 3000,
    launchTimeout: 10000,
  },
}
