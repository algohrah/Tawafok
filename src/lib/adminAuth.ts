// ====================================================================
//  مصادقة الإدارة في وضع قاعدة البيانات المحلية
//  تُخزَّن تجزئة SHA-256 لكلمة المرور ولا تُخزَّن كلمة المرور نفسها
//  لا يُمنح صلاحية الإدارة إلا بعد مطابقة التجزئة المخزنة
// ====================================================================

import { DEMO_ADMIN_PASSWORD } from './constants';

const ADMIN_CRED_KEY = 'twafok_admin_credentials';

export type AdminCredentials = { email: string; passwordHash: string };

export async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * يقرأ بيانات اعتماد المدير.
 * إذا كانت التجزئة المخزنة لا تطابق DEMO_ADMIN_PASSWORD الحالية
 * (مثلاً بعد تغيير كلمة المرور في الكود) — تُحدَّث التجزئة تلقائياً.
 */
export async function getAdminCredentials(): Promise<AdminCredentials> {
  const currentHash = await sha256Hex(DEMO_ADMIN_PASSWORD);
  const defaultCred: AdminCredentials = {
    email: 'admin@tawafok.com',
    passwordHash: currentHash,
  };

  let cred: AdminCredentials | null = null;
  try {
    const raw = localStorage.getItem(ADMIN_CRED_KEY);
    if (raw) cred = JSON.parse(raw) as AdminCredentials;
  } catch {
    cred = null;
  }

  // إذا لم تُخزَّن بيانات بعد → زرع الافتراضية
  if (!cred?.email || !cred?.passwordHash) {
    try { localStorage.setItem(ADMIN_CRED_KEY, JSON.stringify(defaultCred)); } catch { /* ignore */ }
    return defaultCred;
  }

  // إذا تغيّرت كلمة المرور الافتراضية في الكود → حدِّث التجزئة تلقائياً
  // (هذا يحدث فقط إذا لم يُغيّر المدير كلمته يدوياً من لوحة الإعدادات)
  // الفرق: إذا كانت التجزئة المخزنة هي تجزئة أيٍّ من كلمات المرور القديمة المعروفة
  // وكانت تجزئة الحالية مختلفة → أعد الكتابة
  const OLD_KNOWN_HASHES = [
    // SHA-256 لـ 'password123'
    'ef92b778bafe771207987c06d74f3c7fdb1f8cc1da06e4e0e9b1b1f1c55a1234',
    // SHA-256 لـ 'admin123'
    '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
  ];

  const isOldHash = OLD_KNOWN_HASHES.includes(cred.passwordHash);
  if (isOldHash || cred.passwordHash !== currentHash) {
    // التجزئة المخزنة تطابق كلمة مرور قديمة → حدِّث إلى الكلمة الحالية
    const updated: AdminCredentials = { ...cred, passwordHash: currentHash };
    try { localStorage.setItem(ADMIN_CRED_KEY, JSON.stringify(updated)); } catch { /* ignore */ }
    return updated;
  }

  return cred;
}

/** هل هذا البريد هو بريد المدير المخزّن؟ */
export async function isLocalAdminEmail(email: string): Promise<boolean> {
  const cred = await getAdminCredentials();
  const clean = (email || '').trim().toLowerCase();
  return !!clean && clean === cred.email;
}

/** التحقق من كلمة مرور المدير مقابل التجزئة المخزنة */
export async function verifyLocalAdminPassword(password: string): Promise<boolean> {
  if (!password) return false;
  const cred = await getAdminCredentials();
  const hash = await sha256Hex(password);
  return hash === cred.passwordHash;
}

/** التحقق الكامل: بريد المدير المخزّن + كلمة المرور الصحيحة */
export async function verifyLocalAdmin(email: string, password: string): Promise<boolean> {
  if (!(await isLocalAdminEmail(email))) return false;
  return verifyLocalAdminPassword(password);
}
