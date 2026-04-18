import i18n from 'i18next';

/**
 * Supabase error code -> i18n key mappings
 *
 * Auth codes (Supabase Auth):
 *   invalid_credentials           -> auth.invalidCredentials
 *   email_not_confirmed           -> auth.emailNotConfirmed
 *   user_already_exists           -> auth.emailAlreadyExists
 *   weak_password                 -> auth.weakPassword
 *   over_email_send_rate_limit    -> auth.tooManyAttempts
 *   email_address_invalid         -> auth.invalidEmail
 *   same_password                 -> auth.samePassword
 *   session_expired               -> common.sessionExpired
 *
 * PostgREST codes:
 *   PGRST116 (no rows found)      -> common.notFound
 *   PGRST301 (JWT expired)        -> common.sessionExpired
 *   PGRST204 (column not found)   -> common.serverError
 *
 * Postgres error codes:
 *   23505 (unique violation)      -> common.duplicateEntry
 *   23503 (FK violation)          -> common.invalidReference
 *   42501 (RLS denied)            -> common.permissionDenied
 *
 * Storage HTTP status codes:
 *   413 (file too large)          -> storage.fileTooLarge
 *   415 (unsupported type)        -> storage.unsupportedType
 *
 * Fallback:                       -> common.error
 */
const ERROR_MAP: Record<string, string> = {
  // Legacy codes
  INVALID_CREDENTIALS: 'auth.invalidCredentials',
  EMAIL_ALREADY_EXISTS: 'auth.emailAlreadyExists',
  SESSION_EXPIRED: 'common.sessionExpired',
  NETWORK_ERROR: 'common.networkError',
  NOT_FOUND: 'common.notFound',
  VALIDATION_ERROR: 'common.validationError',
  SERVER_ERROR: 'common.serverError',
  // Supabase Auth error codes
  invalid_credentials: 'auth.invalidCredentials',
  email_not_confirmed: 'auth.emailNotConfirmed',
  user_already_exists: 'auth.emailAlreadyExists',
  weak_password: 'auth.weakPassword',
  over_email_send_rate_limit: 'auth.tooManyAttempts',
  email_address_invalid: 'auth.invalidEmail',
  same_password: 'auth.samePassword',
  session_expired: 'common.sessionExpired',
  // Supabase PostgREST error codes
  PGRST116: 'common.notFound',
  PGRST301: 'common.sessionExpired',
  // Postgres error codes
  '23505': 'common.duplicateEntry',
  '23503': 'common.invalidReference',
  '42501': 'common.permissionDenied',
  PGRST204: 'common.serverError',
  // Storage error codes
  '413': 'storage.fileTooLarge',
  '415': 'storage.unsupportedType',
};

const FALLBACK_KEY = 'common.error';

export function mapSupabaseError(error: unknown): Error {
  const code = extractSupabaseErrorCode(error);
  const i18nKey = ERROR_MAP[code] ?? FALLBACK_KEY;
  const mapped = new Error(i18nKey);
  (mapped as Error & { code: string }).code = code;
  return mapped;
}

export function mapErrorToMessage(error: unknown): string {
  const code = extractErrorCode(error);
  const key = ERROR_MAP[code] ?? FALLBACK_KEY;
  return i18n.t(key);
}

export function mapErrorToKey(error: unknown): string {
  const code = extractErrorCode(error);
  return ERROR_MAP[code] ?? FALLBACK_KEY;
}

function extractSupabaseErrorCode(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    const e = error as Record<string, unknown>;
    if (typeof e['code'] === 'string') return e['code'];
    if (typeof e['error_code'] === 'string') return e['error_code'];
    if (typeof e['status'] === 'number') return String(e['status']);
    if (typeof e['message'] === 'string') return e['message'];
  }
  return extractErrorCode(error);
}

function extractErrorCode(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (isErrorWithCode(error)) return error.code;
  return '';
}

function isErrorWithCode(error: unknown): error is { code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  );
}
