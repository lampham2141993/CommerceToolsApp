// Make sure to import the helper functions from the `ssr` entry point.
import { entryPointUriPathToPermissionKeys } from '@commercetools-frontend/application-shell/ssr';

const defaultEntryPointUriPath = 'starter-typescript-4e8eec';

declare global {
  interface Window {
    app?: {
      entryPointUriPath?: string;
    };
  }
}

/**
 * In production (Connect), ENTRY_POINT_URI_PATH is injected at build time.
 * In the browser, the application shell exposes it on `window.app`.
 */
export const entryPointUriPath =
  typeof window === 'undefined'
    ? process.env.ENTRY_POINT_URI_PATH || defaultEntryPointUriPath
    : window.app?.entryPointUriPath || defaultEntryPointUriPath;

export const PERMISSIONS = entryPointUriPathToPermissionKeys(entryPointUriPath);
