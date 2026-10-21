export default [
  'build/',
  'dist/',
  'node_modules/',
  '.git/',
  '.wrangler/',
  'coverage/',
  '.eslintcache',
  '*.config.js',
  '*.config.ts',
  'eslint.ignores.js',
  'scripts/',
  'pnpm-lock.yaml',
  'public/',
  'documentation/',
  'vite-plugin-*.ts', // Vite plugin files
  'supabase/functions/', // Deno Edge Functions (checked with deno lint / deno check)
];
