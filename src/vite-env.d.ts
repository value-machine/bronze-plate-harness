/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string; // Legacy: still supported for backward compatibility
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string; // Preferred: use publishable key from Supabase dashboard
  readonly VITE_APP_ENVIRONMENT?: string; // preview | staging | production (tags error logs and feedback)
  readonly VITE_APP_VERSION?: string; // Defaults to package.json version (vite.config.ts)
  readonly VITE_APP_ID?: string; // Feedback app label; defaults to "app"
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
