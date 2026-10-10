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

/** يقرأ بيانات اعتماد المدير، ويزرع الحساب الافتراضي عند أول تشغيل */
export async function getAdminCredentials(): Promise<AdminCredentials> {
  let cred: AdminCredentials | null = null;
  try {
    const raw = localStorage.getItem(ADMIN_CRED_KEY);
    if (raw) cred = JSON.parse(raw) as AdminCredentials;
  } catch {
    cred = null;
  }
  if (!cred?.email || !cred?.passwordHash) {
    cred = {
      email: 'admin@tawafok.com',
      passwordHash: await sha256Hex(DEMO_ADMIN_PASSWORD),
    };
    try {
      localStorage.setItem(ADMIN_CRED_KEY, JSON.stringify(cred));
    } catch { /* ignore */ }
  }
  return cred;
}

/** هل هذا البريد هو بريد المدير المخزّن؟ (بدون أي كشف عام لصيغة البريد) */
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