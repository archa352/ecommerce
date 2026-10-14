/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AUTH_IDLE_TIMEOUT_MINUTES?: string;
  readonly VITE_API_ORIGIN?: string;
  readonly VITE_STOREFRONT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
