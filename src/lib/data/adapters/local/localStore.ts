import { createWorkflow, workflowOf, partyBalance, applyAdminJourneyCommand, displayStage } from '../../../journeyWorkflow';
import type { JourneyWorkflow } from '../../../journeyWorkflow';
import { memberPlan, dailyRequestLimit, requestDay } from '../../../../../shared/membership.js';
import { DEMO_ADMIN_PASSWORD } from '../../../constants';
// ============================================================
//  مخزن بيانات محلي — يحاكي قاعدة البيانات بالكامل (للتجربة فقط)
//  كل شيء في localStorage — لا اتصال بأي خادم أو قاعدة البيانات المحلية
//  عند الانتهاء من التصميم سنستبدل هذا الملف بطبقة API حقيقية
// ============================================================

import { MEMBERS } from '../../../members';
import type { Member } from '../../../members';
import { normalizeNationality } from '../../optionNormalizer';

const memoryStorage = new Map<string, string>();

const getLocalSetting = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    try {
      const val = window.localStorage.getItem(key);
      if (val !== null) return val;
    } catch {}
  }
  return memoryStorage.get(key) ?? null;
};
const setLocalSetting = (key: string, value: string): void => {
  memoryStorage.set(key, value);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(key, value);
    } catch {}
  }
};
const removeLocalSetting = (key: string): void => {
  memoryStorage.delete(key);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(key);
    } catch {}
  }
};

// الحساب الافتراضي عند عدم وجود انتحال هوية
export const DEFAULT_USER_ID = 'm2';

// ===== مصدر الأعضاء الموحّد =====
// يقرأ تعديلات الإدارة المحفوظة في saved_members_list (يضبطها AppContext
// عند adminUpdateMember / الموافقة / التعديل) ثم يسقط إلى القائمة الأصلية.
// هكذا تظهر تعديلات الإدارة فوراً للطرف الآخر في صفحة الطلبات والرحلة.
export function getLiveMembers(includeInactiveAndDeleted: boolean = false): Member[] {
  let list: Member[] = [];
  if (typeof window !== 'undefined') {
    try {
      const savedAdmin = getLocalSetting('saved_admin_members_list');
      const savedPublic = getLocalSetting('saved_members_list');
      const savedTwafok = getLocalSetting('twafok_members');
      const raw = includeInactiveAndDeleted 
        ? (savedAdmin || savedPublic || savedTwafok)
        : (savedPublic || savedAdmin || savedTwafok);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) list = parsed as Member[];
      }
    } catch { /* تجاهل */ }
  }

  const isPurged = typeof window !== 'undefined' && getLocalSetting('members_purged') === 'true';
  const hasSavedList = typeof window !== 'undefined' && (getLocalSetting('saved_members_list') !== null || getLocalSetting('saved_admin_members_list') !== null);

  if (list.length === 0 && !isPurged && !hasSavedList) {
    list = [...MEMBERS];
  }

  // ضمان إدراج أي أعضاء مضافين في MEMBERS لم ينزلوا في القائمة المحفوظة مسبقاً في localStorage
  const existingIds = new Set(list.map((m) => m.id));
  const adminMetaForMerge = typeof window !== 'undefined' ? readAdminMeta() : {};
  MEMBERS.forEach((m) => {
    if (!existingIds.has(m.id) && !adminMetaForMerge[m.id]?.deleted) {
      list.push(m);
      existingIds.add(m.id);
    } else if (existingIds.has(m.id)) {
      const idx = list.findIndex((item) => item.id === m.id);
      if (idx !== -1) {
        // الدمج ذكي: نحتفظ بالتعديلات المخزنة مع ضمان تعبئة أي حقول ناقصة من التعريف الرئيسي م
        const item = list[idx];
        const isSingle = ['single', 'أعزب', 'عزباء'].includes(item.maritalStatus || m.maritalStatus);
        list[idx] = {
          ...m,
          ...item,
          nationality: normalizeNationality(item.nationality || m.nationality),
          country: normalizeNationality(item.country || m.country),
          tribe: item.tribe || m.tribe,
          ethnicity: item.ethnicity || m.ethnicity,
          district: item.district || m.district,
          sect: item.sect || m.sect,
          wifeCount: isSingle ? '' : (item.wifeCount || (m as any).wifeCount),
          seekingWife: isSingle ? '' : (item.seekingWife || (m as any).seekingWife),
          acceptPolygamy: item.acceptPolygamy || (m as any).acceptPolygamy,
          acceptDivorced: item.acceptDivorced || (m as any).acceptDivorced,
          acceptWithChildren: item.acceptWithChildren || (m as any).acceptWithChildren,
          childrenLiveWith: isSingle && !item.hasChildren ? '' : (item.childrenLiveWith || (m as any).childrenLiveWith),
          childrenCount: isSingle && !item.hasChildren ? '' : (item.childrenCount || (m as any).childrenCount),
          health: item.health || m.health,
          smoking: item.smoking || m.smoking,
          jobTitle: item.jobTitle || m.jobTitle,
          housing: item.housing || m.housing,
          pMaritalStatus: item.pMaritalStatus === 'أعزب أو مطلق بدون أبناء' ? 'أعزب، مطلق' : (item.pMaritalStatus || (m as any).pMaritalStatus),
        };
      }
    }
  });

  // دمج بيانات adminMeta (مثل الحذف والحظر) على كافة كائنات الأعضاء
  if (typeof window !== 'undefined') {
    try {
      const adminMeta = readAdminMeta();
      list = list.map((m) => {
        const meta = adminMeta[m.id];
        if (meta) {
          return {
            ...m,
            status: meta.deleted ? 'deleted' : (meta.status || m.status),
            deleted: !!meta.deleted,
          };
        }
        return m;
      });
    } catch { /* تجاهل */ }
  }

  // فلترة الأعضاء غير النشطين أو المحذوفين (إلا إذا طُلبوا صراحةً)
  if (typeof window !== 'undefined' && !includeInactiveAndDeleted) {
    list = list.filter((m) => {
      if (m.deleted) return false;
      if (m.status && m.status !== 'active') return false;
      return true;
    });
  }

  // دمج حالة سداد رسوم الجدية مع وسام الجدية بشكل ديناميكي
  try {
    const raw = typeof window !== 'undefined' ? getLocalSetting(STORAGE_KEY) : null;
    if (raw) {
      const parsedDB = JSON.parse(raw);
      if (parsedDB && Array.isArray(parsedDB.requests)) {
        const paidUsers = new Set<string>();
        parsedDB.requests.forEach((r: any) => {
          if (r.sender_paid && r.sender_paid_at) paidUsers.add(r.sender_id);
          if (r.receiver_paid && r.receiver_paid_at) paidUsers.add(r.receiver_id);
        });
        return list.map((m) => {
          if (m.sourceType === 'imported') {
            return m;
          }
          if (paidUsers.has(m.id)) {
            return { ...m, hasSeriousnessBadge: true };
          }
          return m;
        });
      }
    }
  } catch {}

  return list;
}

export function getLiveMemberById(id: string): Member | undefined {
  return getLiveMembers(true).find((m) => m.id === id);
}

// ===== الهوية النشطة (تتغيّر عند الدخول لحساب من لوحة التحكم) =====
// تُقرأ من active_member_id الذي يضبطه impersonateUser في AppContext
export function getCurrentUserId(): string {
  if (typeof window !== 'undefined') {
    try {
      const active = getLocalSetting('active_member_id');
      if (active && active.trim()) return active.trim();

      const authUserRaw = getLocalSetting('auth_user');
      if (authUserRaw) {
        const authUser = JSON.parse(authUserRaw);
        if (authUser?.isLoggedIn && authUser?.memberId && String(authUser.memberId).trim()) {
          return String(authUser.memberId).trim();
        }
      }
    } catch { /* تجاهل */ }
  }
  return '';
}

export function setCurrentUserId(id: string) {
  if (typeof window !== 'undefined') {
    try { setLocalSetting('active_member_id', id); } catch { /* تجاهل */ }
  }
}

// للتوافق الرجعي مع الكود القديم — لكن يُفضّل استخدام getCurrentUserId()
export const CURRENT_USER_ID = DEFAULT_USER_ID;

// ===== تتبّع "غير المقروء" — متى آخر مرة شاهد المستخدم كل طلب =====
const SEEN_KEY = 'requests_last_seen';

function readSeenMap(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try { return JSON.parse(getLocalSetting(SEEN_KEY) || '{}'); } catch { return {}; }
}

// هل الطلب يحمل تحديثاً لم يره المستخدم بعد؟
export function isRequestUnseen(requestId: number, updatedAt?: string | null): boolean {
  if (!updatedAt) return false;
  const map = readSeenMap();
  const seen = map[String(requestId)];
  if (!seen) return true;                 // لم يُشاهد قط
  return new Date(updatedAt).getTime() > new Date(seen).getTime();
}

// تعليم طلب كمقروء (عند فتح رحلته)
export function markRequestSeen(requestId: number) {
  if (typeof window === 'undefined') return;
  try {
    const map = readSeenMap();
    map[String(requestId)] = new Date().toISOString();
    setLocalSetting(SEEN_KEY, JSON.stringify(map));
  } catch { /* تجاهل */ }
}

export function markRequestNotificationsRead(requestId: number, userId?: string) {
  const d = load();
  (d.notifications || []).forEach((n) => {
    if (n.request_id === requestId && (!userId || n.user_id === userId)) n.read = true;
  });
  save();
}

// ===== الأنواع =====
export interface LocalRequest {
  workflow?: JourneyWorkflow;
  id: number;
  request_number?: number;          // الرقم التسلسلي المخصص للفئة (يبدأ من 1 للمسجلين ومن 1 للمستوردين تصاعدياً)
  source_type?: 'registered' | 'imported'; // نوع مصدر الطلب: أعضاء مسجلين أو وساطة مستوردين
  sender_id: string;
  receiver_id: string;
  journey_stage: string;
  message: string;
  sender_paid: boolean;
  receiver_paid: boolean;
  sender_paid_at?: string | null;
  receiver_paid_at?: string | null;
  sender_final_paid?: boolean;
  receiver_final_paid?: boolean;
  sender_final_paid_at?: string | null;
  receiver_final_paid_at?: string | null;
  sender_stage_confirmed?: boolean;
  receiver_stage_confirmed?: boolean;
  paid_at?: string | null;
  meeting_date?: string | null;
  meeting_notes?: string | null;
  decline_reason?: string | null;
  cancel_reason?: string | null;
  evaluation_result?: string | null;
  evaluation_note?: string | null;
  sender_viewing_result?: 'success' | 'failed' | null;
  receiver_viewing_result?: 'success' | 'failed' | null;
  sender_viewing_note?: string | null;
  receiver_viewing_note?: string | null;
  admin_notes?: string | null;
  // ===== معلومات التواصل (تُدخلها الأنثى، يراها الذكر بعد القَسَم) =====
  contact_info?: string | null;   // (قديم) — يُترك للتوافق الرجعي
  contact_by?: string | null;     // معرّف من أدخل معلومات التواصل
  guardian_phone?: string | null; // 📱 رقم ولي الأمر (أساسي للأنثى)
  guardian_name?: string | null;  // 👤 اسم ولي الأمر
  guardian_relation?: string | null; // صلة القرابة (الأب/الأخ/العم...)
  contact_time?: string | null;   // ⏰ الوقت المناسب للاتصال
  contact_note?: string | null;   // 📝 ملاحظة اختيارية
  male_pledged?: boolean;         // هل أقسم الذكر بعدم النشر قبل رؤية المعلومات
  // ===== معلومات تواصل الذكر وتعهّد الأنثى =====
  female_pledged?: boolean;       // هل أقسمت الأنثى قبل رؤية معلومات الذكر
  male_phone?: string | null;     // 📱 هاتف التواصل المباشر للذكر
  male_name?: string | null;      // 👤 اسم شخص التواصل للذكر
  male_relation?: string | null;  // صلة القرابة لشخص التواصل للذكر
  male_contact_time?: string | null; // ⏰ وقت الاتصال المناسب للذكر
  male_contact_note?: string | null; // 📝 ملاحظة من الطرف الذكر
  defer_date?: string | null;     // تاريخ تأجيل سداد رسوم الجدية
  defer_by?: string | null;       // من الذي طلب تأجيل السداد
  deadline_date?: string | null;  // مهلة سداد رسوم الجدية (١٥ يوم من القبول)
  frozen?: boolean;               // تجميد مؤقت من الإدارة — يظهر للعضو كـ"بانتظار تنسيق الإدارة"
  frozen_reason?: string | null;  // سبب التجميد
  frozen_at?: string | null;      // متى تم التجميد
  created_at: string;
  updated_at: string;
}

export interface LocalEvent {
  id: number;
  request_id: number;
  actor_id: string;
  type: string;
  note: string;
  created_at: string;
}

export interface LocalInquiryMessage {
  id: number;
  request_id: number;
  sender_id: string;   // 'admin' = الوسيطة
  text: string;
  charged_to: string | null;
  created_at: string;
  approved?: boolean;          // افتراضي false — لا تظهر للطرف المستقبِل إلا بعد موافقة الإدارة
  rejected?: boolean;          // true = رُفضت وحُجبت
  moderated_by?: string | null; // اسم المشرف الذي راجعها
  moderated_at?: string | null; // وقت المراجعة
}

export interface LocalInquiryPackage {
  id: number;
  request_id: number;
  owner_id: string;
  credits_total: number;
  credits_used: number;
  price: number;
  active: boolean;
  created_at: string;
}

export interface LocalNotification {
  id: number;
  user_id: string;      // المستلم المعني بالإشعار
  request_id: number;   // الطلب المرتبط (للانتقال للرحلة)
  type: string;         // نوع الحدث
  text: string;
  title?: string;       // عنوان الإشعار الاختياري
  read: boolean;
  created_at: string;
}

interface DB {
  requests: LocalRequest[];
  events: LocalEvent[];
  inquiryMessages: LocalInquiryMessage[];
  inquiryPackages: LocalInquiryPackage[];
  notifications: LocalNotification[];
  seq: number;
}

const STORAGE_KEY = 'twafok_local_db_v4';

// ===== بيانات البذرة (طلبات بمراحل مختلفة) =====
function seedDB(): DB {
  return { requests: [], events: [], inquiryMessages: [], inquiryPackages: [], notifications: [], seq: 100 };
}

const JOURNEY_RESET_KEY = 'tawafok_journey_clean_start_v3';
/** User-authorized deletion. Runs once per browser, before AppContext reads settings. No backups are created. */
export function initializeCleanJourneyWorkflow(): void {
  if (typeof window === 'undefined') return;
  const storage = window.localStorage;
  const completedBefore = storage.getItem(JOURNEY_RESET_KEY) === 'done';
  let current: any = null;
  try { current = JSON.parse(storage.getItem(STORAGE_KEY) || 'null'); } catch {}
  // Also catch old snapshots restored after the first release's pre-hydration marker.
  if (completedBefore && Array.isArray(current?.requests) && current.requests.every((r: any) => r?.workflow?.version === 3)) return;
  const keepUnrelatedTransactions = (key: string) => {
    const parsed = JSON.parse(storage.getItem(key) || '[]');
    if (!Array.isArray(parsed)) return;
    const kept = parsed.filter((t: any) => t.type === 'subscription' || (!['deposit', 'final', 'inquiry', 'journey'].includes(t.type) && !t.request_id && !t.requestId && !['deposit', 'final_fee', 'inquiry'].includes(t.metadata?.paymentStage)));
    storage.setItem(key, JSON.stringify(kept)); memoryStorage.set(key, JSON.stringify(kept));
  };
  // If parsing/writing fails, do not mark complete and do not permit new writes on top of an incomplete reset.
  const oldRaw = storage.getItem(STORAGE_KEY);
  let unrelatedNotifications: any[] = [];
  try { unrelatedNotifications = (JSON.parse(oldRaw || '{}').notifications || []).filter((n: any) => !n.request_id && !['request', 'match', 'inquiry'].includes(n.type)); } catch {}
  const clean = seedDB(); clean.notifications = unrelatedNotifications;
  if (completedBefore && current) {
    // A stale/old backup cannot revive legacy journeys, nor should it delete valid new records in a mixed snapshot.
    clean.requests = (current.requests || []).filter((r: any) => r?.workflow?.version === 3);
    const keep = new Set(clean.requests.map(r => r.id));
    clean.events = (current.events || []).filter((e: any) => keep.has(e.request_id));
    clean.inquiryMessages = (current.inquiryMessages || []).filter((m: any) => keep.has(m.request_id) && m.sender_id === 'admin');
    clean.notifications = [...unrelatedNotifications, ...(current.notifications || []).filter((n: any) => keep.has(n.request_id) && n.type !== 'inquiry')];
    clean.seq = Math.max(100, Number(current.seq) || 0);
  }
  storage.setItem(STORAGE_KEY, JSON.stringify(clean)); memoryStorage.set(STORAGE_KEY, JSON.stringify(clean)); db = clean;
  keepUnrelatedTransactions('twafok_transactions_v1'); keepUnrelatedTransactions('twafok_transactions');
  for (const key of ['twafok_local_db_v3', 'twafok_local_db_v2', 'twafok_local_db', 'twafok_requests', 'saved_interest_requests', 'saved_exempt_requests', 'user_deposit_quota', 'requests_last_seen', 'journey_settings', 'inquiry_settings', 'pending_requests_expiry_days']) {
    storage.removeItem(key); memoryStorage.delete(key);
  }
  const adminNotices = JSON.parse(storage.getItem('saved_admin_notifications') || '[]');
  if (Array.isArray(adminNotices)) {
    const kept = adminNotices.filter((n: any) => !n.requestId && !n.request_id && !['request', 'journey', 'inquiry', 'match'].includes(n.type) && !String(n.link || n.href || '').includes('/journey/'));
    storage.setItem('saved_admin_notifications', JSON.stringify(kept));
  }
  let payment: any = {};
  try { payment = JSON.parse(storage.getItem('payment_settings') || '{}'); } catch {}
  payment = { ...payment, journeyTotalFee: 2500, journeyDepositAmount: 500 };
  storage.setItem('payment_settings', JSON.stringify(payment)); memoryStorage.set('payment_settings', JSON.stringify(payment));
  storage.setItem(JOURNEY_RESET_KEY, 'done');
}

// ===== تحميل/حفظ =====
let db: DB | null = null;
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('storage', (event: StorageEvent) => { if (event.key === STORAGE_KEY) db = null; });
}

// Workflow v3: no automatic advancement/cancellation based on old flags or deadlines.
function syncGlobalPayments(_d: DB) {}
function autoProcessDeadlines(_d: DB): boolean { return false; }

export function isImportedRequestOrMember(senderId: string, receiverId: string, explicitSourceType?: string): boolean {
  if (explicitSourceType === 'imported') return true;
  if (explicitSourceType === 'registered') return false;
  const liveMembers = getLiveMembers(true);
  const sender = liveMembers.find((m) => m.id === senderId);
  const receiver = liveMembers.find((m) => m.id === receiverId);
  if (sender && (sender.sourceType === 'imported' || (sender as any).importBatchId || (sender as any).importOfficeName)) return true;
  if (receiver && (receiver.sourceType === 'imported' || (receiver as any).importBatchId || (receiver as any).importOfficeName)) return true;
  return false;
}

export function getNextRequestNumber(d: DB, sourceType: 'registered' | 'imported'): number {
  if (!d.requests || d.requests.length === 0) return 1;
  const categoryReqs = d.requests.filter((r) => (r.source_type || 'registered') === sourceType);
  if (categoryReqs.length === 0) return 1;
  const maxNum = categoryReqs.reduce((max, r) => Math.max(max, Number(r.request_number) || 0), 0);
  return maxNum + 1;
}

function normalizeRequestNumbers(d: DB): boolean {
  if (!d.requests || d.requests.length === 0) return false;
  let changed = false;
  const liveMembers = getLiveMembers(true);

  // تصنيف الطلبات بين مسجلين ومستوردين
  const registeredList: LocalRequest[] = [];
  const importedList: LocalRequest[] = [];

  // فرز الطلبات بحسب تاريخ الإنشاء تصاعدياً لتوزيع الأرقام من 1 فصاعداً
  const sorted = [...d.requests].sort((a, b) => {
    const timeA = new Date(a.created_at || 0).getTime();
    const timeB = new Date(b.created_at || 0).getTime();
    if (timeA !== timeB) return timeA - timeB;
    return (Number(a.id) || 0) - (Number(b.id) || 0);
  });

  sorted.forEach((r) => {
    const sender = liveMembers.find((m) => m.id === r.sender_id);
    const receiver = liveMembers.find((m) => m.id === r.receiver_id);
    const isImported = (r.source_type === 'imported') ||
      r.sender_id?.startsWith('imp_') || r.receiver_id?.startsWith('imp_') ||
      (sender && (sender.sourceType === 'imported' || (sender as any).importBatchId || (sender as any).importOfficeName || (sender as any).khataabaName)) ||
      (receiver && (receiver.sourceType === 'imported' || (receiver as any).importBatchId || (receiver as any).importOfficeName || (receiver as any).khataabaName));

    const targetSourceType: 'registered' | 'imported' = isImported ? 'imported' : 'registered';
    if (r.source_type !== targetSourceType) {
      r.source_type = targetSourceType;
      changed = true;
    }

    if (targetSourceType === 'imported') {
      importedList.push(r);
    } else {
      registeredList.push(r);
    }
  });

  registeredList.forEach((r, idx) => {
    const expectedNum = idx + 1;
    if (r.request_number !== expectedNum) {
      r.request_number = expectedNum;
      changed = true;
    }
  });

  importedList.forEach((r, idx) => {
    const expectedNum = idx + 1;
    if (r.request_number !== expectedNum) {
      r.request_number = expectedNum;
      changed = true;
    }
  });

  return changed;
}

function normalizeRequestIds(d: DB): boolean {
  if (!d.requests || d.requests.length === 0) return false;
  const hasHighIds = d.requests.some((r) => Number(r.id) >= 50 || isNaN(Number(r.id)));
  if (!hasHighIds) return false;

  const idMap = new Map<any, number>();
  d.requests.forEach((r, idx) => {
    const oldId = r.id;
    const newId = idx + 1;
    idMap.set(oldId, newId);
    idMap.set(String(oldId), newId);
    idMap.set(Number(oldId), newId);
    r.id = newId;
  });

  if (d.events) {
    d.events.forEach((e) => {
      if (idMap.has(e.request_id)) {
        e.request_id = idMap.get(e.request_id)!;
      }
    });
  }

  if (d.inquiryMessages) {
    d.inquiryMessages.forEach((m) => {
      if (idMap.has(m.request_id)) {
        m.request_id = idMap.get(m.request_id)!;
      }
    });
  }

  if (d.inquiryPackages) {
    d.inquiryPackages.forEach((p) => {
      if (idMap.has(p.request_id)) {
        p.request_id = idMap.get(p.request_id)!;
      }
    });
  }

  if (d.notifications) {
    d.notifications.forEach((n) => {
      if (n.request_id && idMap.has(n.request_id)) {
        const oldReqId = n.request_id;
        const newReqId = idMap.get(oldReqId)!;
        n.request_id = newReqId;
        n.text = n.text.replace(new RegExp(`#${oldReqId}\\b`, 'g'), `#${newReqId}`);
      }
    });
  }

  d.seq = d.requests.length;
  return true;
}

function load(): DB {
  initializeCleanJourneyWorkflow();
  if (db) return db;
  if (typeof window !== 'undefined') {
    try {
      // تنظيف الإصدارات القديمة لضمان بداية نظيفة لجميع الحسابات
      removeLocalSetting('twafok_local_db_v3');
      removeLocalSetting('twafok_local_db_v2');
      removeLocalSetting('twafok_local_db');
      const raw = getLocalSetting(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed) {
          db = parsed as DB;
          const validRequests = (Array.isArray(db.requests) ? db.requests : []).filter(r => r?.workflow?.version === 3);
          const ids = new Set(validRequests.map(r => r.id));
          db.requests = validRequests;
          db.events = (db.events || []).filter(e => ids.has(e.request_id));
          db.inquiryMessages = (db.inquiryMessages || []).filter(m => ids.has(m.request_id) && m.sender_id === 'admin');
          db.inquiryPackages = [];
          // ترقية: ضمان وجود المصفوفات لجميع الحقول لتجنب أي انهيار أو كراش
          if (!db.notifications) db.notifications = [];
          if (!db.inquiryMessages) db.inquiryMessages = [];
          if (!db.inquiryPackages) db.inquiryPackages = [];
          if (!db.events) db.events = [];
          
          syncGlobalPayments(db);
          const normalized = normalizeRequestIds(db);
          const numbersNormalized = normalizeRequestNumbers(db);
          const changed = autoProcessDeadlines(db);
          if (normalized || numbersNormalized || changed) {
            save();
          }
          return db;
        }
      }
    } catch { /* تجاهل */ }
  }
  if (!db) {
    db = seedDB();
    save();
  }
  return db;
}

function getNextRequestId(d: DB): number {
  if (!d.requests || d.requests.length === 0) return 1;
  const maxReqId = d.requests.reduce((max, r) => Math.max(max, Number(r.id) || 0), 0);
  return maxReqId + 1;
}

function save(): boolean {
  if (!db || typeof window === 'undefined') return false;
  try {
    const encoded = JSON.stringify(db);
    window.localStorage.setItem(STORAGE_KEY, encoded);
    memoryStorage.set(STORAGE_KEY, encoded);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('twafok_notification_update'));
    return true;
  } catch { return false; }
}

function nextId(): number {
  const d = load();
  d.seq = (d.seq || 100) + 1;
  return d.seq;
}

// إعادة ضبط قاعدة البيانات المحلية (للتجربة)
export function resetLocalDB() {
  db = seedDB();
  save();
}

// التحقق مما إذا كان المستخدم قد دفع رسوم الجدية في أي طلب سابق (لإثبات الجدية بشكل دائم)
export function hasUserPaidDepositAnywhere(userId: string): boolean {
  const d = load();
  return d.requests.some(
    (r) =>
      (r.sender_id === userId && r.sender_paid && r.sender_paid_at) ||
      (r.receiver_id === userId && r.receiver_paid && r.receiver_paid_at)
  );
}

// محاكاة تأخير شبكة بسيط (اختياري)
const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));

// ===== الأعضاء =====
export async function getMembers() {
  await delay(60);
  // يقرأ من تعديلات الإدارة الحيّة كي تظهر للطرف الآخر فور حفظها
  // لكنه يستبعد المحظورين والمجمّدين والموقوفين والمحذوفين من العرض العام
  return getLiveMembers(false).map((m) => ({
    id: m.id, nickname: m.nickname, gender: m.gender, age: m.age,
    country: m.country, city: m.city, verified: m.verified, premium: m.premium,
    isProfileIncomplete: !!(m as any).isProfileIncomplete,
  }));
}

// ===== الطلبات =====
// This remains a local adapter, not a substitute for server authorization.
function canManageJourneyLocally(): boolean {
  if (getLocalSetting('twafok_demo_admin') !== 'true') return false;
  try {
    const admin = JSON.parse(getLocalSetting('twafok_current_admin_user') || 'null');
    return !admin || (admin.status !== 'suspended' && (admin.role === 'super_admin' || admin.permissions?.manage_requests === true));
  } catch { return false; }
}
function memberRequestView(r: LocalRequest): LocalRequest {
  const copy = JSON.parse(JSON.stringify(r));
  for (const key of ['admin_notes', 'meeting_notes', 'contact_info', 'contact_by', 'guardian_phone', 'guardian_name', 'guardian_relation', 'contact_note', 'contact_time', 'male_phone', 'male_name', 'male_relation', 'male_contact_time', 'male_contact_note']) delete copy[key];
  if (copy.workflow) {
    copy.workflow.audit = []; copy.workflow.adminNotes = ''; copy.workflow.decisionSource = '';
    copy.workflow.assignedTo = ''; copy.workflow.nextAction = ''; copy.workflow.nextDueAt = '';
    copy.workflow.contactRecipient = '';
    copy.workflow.payments = copy.workflow.payments.map((p: any) => ({ ...p, reference: '', by: '', reason: '' }));
  }
  return copy;
}
export async function getRequests(userId?: string): Promise<LocalRequest[]> {
  await delay();
  const sorted = [...load().requests].sort((a, b) => b.created_at.localeCompare(a.created_at));
  if (!userId || !userId.trim()) return sorted; // internal AppContext compatibility
  const uid = userId.trim();
  return sorted.filter(r => r.sender_id === uid || r.receiver_id === uid).map(memberRequestView);
}
export async function getRequest(id: number): Promise<LocalRequest | null> {
  await delay(60);
  const r = load().requests.find(r => r.id === id);
  if (!r) return null;
  const uid = getCurrentUserId();
  if (r.sender_id !== uid && r.receiver_id !== uid && !canManageJourneyLocally()) return null;
  return memberRequestView(r);
}

export async function createRequest(senderId: string, receiverId: string, message: string, explicitSourceType?: 'registered' | 'imported') {
  await delay();
  if (getCurrentUserId() !== senderId && !canManageJourneyLocally()) return { ok: false, error: 'غير مصرح بإرسال طلب باسم عضو آخر' };
  if (senderId === receiverId) {
    return { ok: false, error: 'لا يمكنك إرسال طلب توافق لنفسك' };
  }
  const d = load();
  // منع التكرار: أي طلب غير منتهٍ بالرفض/الإلغاء يُعتبر قائماً.
  // المراحل المنتهية التي تسمح بطلب جديد: declined (مرفوض) و cancelled (ملغى).
  const blocking = d.requests.find((r) =>
    (
      (r.sender_id === senderId && r.receiver_id === receiverId) ||
      (r.sender_id === receiverId && r.receiver_id === senderId)
    ) &&
    r.journey_stage !== 'declined' && r.journey_stage !== 'cancelled',
  );
  if (blocking) {
    // رسالة دقيقة حسب الحالة
    if (blocking.journey_stage === 'sent') {
      return { ok: false, error: 'يوجد طلب توافق قائم بينكما بالفعل. افتح طلباتك لمتابعته.' };
    }
    if (blocking.journey_stage === 'completed') {
      return { ok: false, error: 'لديك رحلة مكتملة مع هذا العضو بالفعل.' };
    }
    return { ok: false, error: 'لديك طلب توافق نشط مع هذا العضو بالفعل.' };
  }

  const liveMembers = getLiveMembers(true);
  const sender = liveMembers.find((m) => m.id === senderId);
  const quotaDay = requestDay();
  const sentToday = d.requests.filter(r => r.sender_id === senderId && Date.parse(r.created_at) >= Date.parse(quotaDay.start) && Date.parse(r.created_at) < Date.parse(quotaDay.end)).length;
  const quotaLimit = dailyRequestLimit(sender);
  if (sentToday >= quotaLimit) return { ok: false, error: `وصلت إلى الحد اليومي (${quotaLimit} طلبات توافق). يتجدد عند منتصف الليل.`, code: 'DAILY_REQUEST_LIMIT', upgradeAvailable: quotaLimit === 5 };

  const receiver = liveMembers.find((m) => m.id === receiverId);
  const isImported = (explicitSourceType === 'imported') ||
    (sender && (sender.sourceType === 'imported' || (sender as any).importBatchId || (sender as any).importOfficeName)) ||
    (receiver && (receiver.sourceType === 'imported' || (receiver as any).importBatchId || (receiver as any).importOfficeName));

  const sourceType: 'registered' | 'imported' = isImported ? 'imported' : 'registered';
  const requestNumber = getNextRequestNumber(d, sourceType);
  const nextUniqueId = getNextRequestId(d);

  const now = new Date().toISOString();
  let financial = { journeyTotalFee: 2500, journeyDepositAmount: 500 };
  try { financial = { ...financial, ...JSON.parse(getLocalSetting('payment_settings') || '{}') }; } catch {}
  const req: LocalRequest = {
    workflow: createWorkflow(Number(financial.journeyTotalFee), Number(financial.journeyDepositAmount)),
    id: nextUniqueId,
    request_number: requestNumber,
    source_type: sourceType,
    sender_id: senderId,
    receiver_id: receiverId,
    journey_stage: 'sent',
    message: 'طلب توافق جديد عبر المنصة',
    sender_paid: false,
    receiver_paid: false,
    sender_paid_at: null,
    receiver_paid_at: null,
    created_at: now,
    updated_at: now,
  };
  d.requests.unshift(req);
  addEvent(d, req.id, senderId, 'sent', 'تم إرسال طلب الاهتمام');
  addNotification(d, receiverId, req.id, 'request', 'وصلك طلب توافق جديد بانتظار قرارك');
  if (!save()) { d.requests = d.requests.filter(r => r.id !== req.id); d.events = d.events.filter(e => e.request_id !== req.id); d.notifications = d.notifications.filter(n => n.request_id !== req.id); return { ok: false, error: 'تعذر حفظ الطلب؛ تحقق من مساحة التخزين' }; }
  return { ok: true, data: req };
}

function addEvent(d: DB, requestId: number, actorId: string, type: string, note: string) {
  d.events.push({
    id: nextId(), request_id: requestId, actor_id: actorId || 'system',
    type, note, created_at: new Date().toISOString(),
  });
}

// #9 توليد إشعار حقيقي يقود مباشرة لصفحة الرحلة
function addNotification(d: DB, userId: string, requestId: number, type: string, text: string, title?: string) {
  if (!d.notifications) d.notifications = [];
  d.notifications.push({
    id: nextId(), user_id: userId, request_id: requestId, type, text,
    read: false, created_at: new Date().toISOString(),
    title,
  });
}

// إشعار الطرف الآخر بتغيّر المرحلة (المتلقّي = الطرف غير الفاعل)
function notifyOther(d: DB, req: LocalRequest, actorId: string, type: string, text: string) {
  const otherId = actorId === req.sender_id ? req.receiver_id : req.sender_id;
  addNotification(d, otherId, req.id, type, text);
}

// ===== تنفيذ إجراءات الرحلة =====
const STAGE_TITLES: Record<string, string> = {
  sent: 'طلب مُرسَل', accepted: 'تم القبول', seriousness: 'تأكيد الجدية',
  coordination: 'تبادل التواصل', sharia_viewing: 'النظرة الشرعية',
  engagement: 'الملكة', completed: 'مكتمل', declined: 'تم الاعتذار', cancelled: 'ملغى',
};
function stageTitle(s: string): string { return STAGE_TITLES[s] || s; }

export async function runRequestAction(
  requestId: number, action: string, actorId: string, payload: Record<string, any> = {},
): Promise<{ ok: boolean; data?: LocalRequest; error?: string }> {
  await delay();
  const d = load();
  const index = d.requests.findIndex(r => r.id === requestId);
  if (index < 0) return { ok: false, error: 'الطلب غير موجود' };
  const original = d.requests[index];
  if (payload.expectedUpdatedAt && payload.expectedUpdatedAt !== original.updated_at) return { ok: false, error: 'تغير الطلب منذ فتحه. حدّث السجل قبل التعديل.' };
  const now = new Date().toISOString();
  const token = String(payload.commandId || ('cmd-' + Date.now() + '-' + Math.random().toString(36).slice(2)));
  const snapshot = JSON.stringify(d);
  let updated: LocalRequest;
  let publicNote: string;
  if (actorId === 'admin') {
    if (!canManageJourneyLocally()) return { ok: false, error: 'صلاحية إدارة الرحلات مطلوبة' };
    let adminName = String(payload.adminName || 'الإدارة');
    try { const a = JSON.parse(getLocalSetting('twafok_current_admin_user') || 'null'); if (a?.name) adminName = a.name; } catch {}
    // Administrative acceptance/decline are structured, auditable decisions too.
    const command = action === 'accept' || action === 'decline' || action === 'cancel' ? 'set_stage' : action;
    const commandPayload = action === 'accept' || action === 'decline' || action === 'cancel'
      ? { ...payload, stage: action === 'accept' ? 'accepted' : action === 'decline' ? 'declined' : 'cancelled', note: payload.note || payload.reason || 'قرار إداري موثق عبر المتابعة' } : payload;
    const result = applyAdminJourneyCommand(original, command, commandPayload, adminName, now, token);
    if (!result.ok) return result;
    if (result.duplicate) return { ok: true, data: original };
    updated = result.data;
    publicNote = action.includes('payment') || action === 'admin_reconcile_legacy' ? 'حدّثت الإدارة سجل رسوم الرحلة؛ راجع ملخصك المالي' : 'حدّثت الإدارة حالة متابعة الرحلة';
  } else {
    const uid = getCurrentUserId();
    if (!uid || uid !== actorId || (original.sender_id !== uid && original.receiver_id !== uid)) return { ok: false, error: 'غير مصرح بهذا الإجراء' };
    if (original.frozen) return { ok: false, error: 'الرحلة معلقة؛ تواصل مع الإدارة' };
    if (!['accept', 'decline', 'cancel'].includes(action)) return { ok: false, error: 'السداد والتنسيق وتحديث النتائج عبر واتساب الإدارة فقط' };
    if (original.journey_stage !== 'sent') return { ok: false, error: 'بعد القرار المبدئي تتم متابعة التعديلات مع الإدارة عبر واتساب' };
    if (action !== 'cancel' && uid !== original.receiver_id) return { ok: false, error: 'الرد على الطلب للطرف المستقبِل فقط' };
    if (action === 'cancel' && uid !== original.sender_id) return { ok: false, error: 'إلغاء الطلب المرسل لصاحبه فقط' };
    const actor = getLiveMemberById(uid);
    const other = getLiveMemberById(uid === original.sender_id ? original.receiver_id : original.sender_id);
    if (actor?.sourceType === 'imported') return { ok: false, error: 'قرار الملف المستورد تسجله الإدارة بعد متابعة الخطّابة وصاحب البيانات' };
    if (!actor || !other || [actor.status, other.status].some(st => ['banned', 'suspended', 'deleted'].includes(String(st)))) return { ok: false, error: 'أحد الحسابين غير متاح؛ تواصل مع الإدارة' };
    updated = JSON.parse(JSON.stringify(original));
    const memberWorkflow = JSON.parse(JSON.stringify(workflowOf(updated))) as JourneyWorkflow;
    updated.workflow = memberWorkflow;
    updated.journey_stage = action === 'accept' ? 'accepted' : action === 'decline' ? 'declined' : 'cancelled';
    const reason = String(payload.reason || (action === 'accept' ? 'موافقة مبدئية من الحساب' : 'اعتذار عن المتابعة')).slice(0, 500);
    if (action === 'decline') updated.decline_reason = reason;
    if (action === 'cancel') updated.cancel_reason = reason;
    memberWorkflow.decisionSource = 'قرار صاحب الحساب: ' + uid;
    updated.updated_at = now;
    memberWorkflow.audit.push({ id: token, at: now, by: uid, action, reason,
      before: JSON.stringify({ stage: original.journey_stage }), after: JSON.stringify({ stage: updated.journey_stage }) });
    publicNote = action === 'accept' ? 'تمت الموافقة المبدئية؛ تابع السداد والتنسيق عبر واتساب الإدارة' : 'انتهى الطلب باعتذار أو إلغاء';
  }
  d.requests[index] = updated;
  addEvent(d, requestId, actorId, action, publicNote);
  addNotification(d, updated.sender_id, requestId, 'request', publicNote);
  addNotification(d, updated.receiver_id, requestId, 'request', publicNote);
  if (!save()) { db = JSON.parse(snapshot); return { ok: false, error: 'تعذر حفظ التعديل؛ تحقق من مساحة التخزين. لم يُعتمد الإجراء.' }; }
  return { ok: true, data: actorId === 'admin' ? updated : memberRequestView(updated) };
}

// ===== سجل الأحداث =====
export async function getEvents(requestId: number): Promise<LocalEvent[]> {
  await delay(60);
  const d = load(), r = d.requests.find(r => r.id === requestId), uid = getCurrentUserId();
  if (!r || (r.sender_id !== uid && r.receiver_id !== uid && !canManageJourneyLocally())) return [];
  return d.events.filter(e => e.request_id === requestId && e.type !== 'inquiry_buy')
    .map(e => ({ ...e, note: e.actor_id === 'admin' || e.type === 'coordination' ? 'تحديث في متابعة الرحلة من الإدارة' : 'تحديث حالة طلب التوافق' }))
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

// ===== توجيهات الإدارة فقط؛ مخطط الاستفسارات القديم محفوظ للتوافق والأرشفة =====
export interface InquiryStateLocal {
  package: LocalInquiryPackage | null;
  remaining: number;
  messages: LocalInquiryMessage[];
  inquiry_started_by?: string | null;
}
const MEMBER_MESSAGING_REMOVED = 'المراسلة بين الأعضاء غير متاحة. تواصل مع الإدارة للمساعدة.';

// قراءة الرصيد التاريخي لا تمنح حق شراء أو استهلاك جديد.
export function getUserInquiryBalance(userId: string): number {
  return load().inquiryPackages.filter(p => p.owner_id === userId && p.active)
    .reduce((sum, p) => sum + Math.max(0, p.credits_total - p.credits_used), 0);
}
export function consumeUserInquiryMessage(_userId: string): boolean { return false; }

function inquiryState(d: DB, requestId: number): InquiryStateLocal {
  const messages = d.inquiryMessages
    .filter(m => m.request_id === requestId && m.sender_id === 'admin')
    // لا نعيد نشر الترحيب الآلي القديم الذي يعلن الباقات الملغاة.
    .filter(m => !m.text.startsWith('مرحباً بكما في غرفة الاستفسار'))
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
  return { package: null, remaining: 0, messages, inquiry_started_by: null };
}
export async function getInquiry(requestId: number): Promise<InquiryStateLocal> {
  return inquiryState(load(), requestId);
}
export async function initializeInquiry(_requestId: number, _userId: string): Promise<{ ok: boolean; state?: InquiryStateLocal; error?: string }> {
  return { ok: false, error: MEMBER_MESSAGING_REMOVED };
}
export async function buyInquiry(_requestId: number, _ownerId: string): Promise<{ ok: boolean; state?: InquiryStateLocal; error?: string }> {
  return { ok: false, error: MEMBER_MESSAGING_REMOVED };
}
export async function buyMessagePackageCustom(_userId: string, _credits: number, _price: number): Promise<{ ok: boolean; balance?: number; error?: string }> {
  return { ok: false, error: MEMBER_MESSAGING_REMOVED };
}
export async function sendInquiry(requestId: number, senderId: string, text: string): Promise<{ ok: boolean; state?: InquiryStateLocal; error?: string }> {
  if (senderId !== 'admin') return { ok: false, error: MEMBER_MESSAGING_REMOVED };
  const d = load();
  if (!text?.trim()) return { ok: false, error: 'النص فارغ' };
  const req = d.requests.find(r => r.id === requestId);
  if (!req) return { ok: false, error: 'الطلب غير موجود' };
  if (senderId === 'admin') {
    const msgId = nextId();
    d.inquiryMessages.push({
      id: msgId,
      request_id: requestId,
      sender_id: 'admin',
      text: text.trim(),
      charged_to: null,
      created_at: new Date().toISOString(),
      approved: true,
    });

    // إرسال إشعار مباشر في حسابات الأطراف
    addNotification(d, req.sender_id, requestId, 'admin', `🛡️ توجيه من إدارة المنصة بخصوص الطلب #${requestId}: ${text.trim()}`, 'توجيه من إدارة المنصة');
    if (req.receiver_id !== req.sender_id) {
      addNotification(d, req.receiver_id, requestId, 'admin', `🛡️ توجيه من إدارة المنصة بخصوص الطلب #${requestId}: ${text.trim()}`, 'توجيه من إدارة المنصة');
    }
    addEvent(d, requestId, 'admin', 'admin_guidance', `توجيه من الإدارة: ${text.trim()}`);
    save();
    return { ok: true, state: inquiryState(d, requestId) };
  }

  return { ok: false, error: MEMBER_MESSAGING_REMOVED };
}
export async function simulateReply(_requestId: number, _replierId: string, _text: string): Promise<{ ok: boolean; state?: InquiryStateLocal; error?: string }> {
  return { ok: false, error: MEMBER_MESSAGING_REMOVED };
}
// نقاط التوافق القديمة غير تشغيلية؛ لا تعدل أو تحذف الأرشيف عند استدعائها.
export function getAllInquiryMessages(): (LocalInquiryMessage & { request_id: number })[] { return []; }
export function moderateInquiryMessage(_messageId: number, _action: 'approve' | 'reject', _moderatorName: string): boolean { return false; }
export function updateInquiryMessage(messageId: number, newText: string): boolean {
  const msg = load().inquiryMessages.find(m => m.id === messageId && m.sender_id === 'admin');
  if (!msg || !newText.trim()) return false;
  msg.text = newText.trim();
  save();
  return true;
}
export function deleteInquiryMessage(messageId: number): boolean {
  const d = load();
  const index = d.inquiryMessages.findIndex(m => m.id === messageId && m.sender_id === 'admin');
  if (index < 0) return false;
  d.inquiryMessages.splice(index, 1);
  save();
  return true;
}

// ===== #9 إشعارات الرحلة =====
export async function getJourneyNotifications(userId: string): Promise<LocalNotification[]> {
  await delay(100);
  const d = load();
  if (!d.notifications) return [];
  return d.notifications
    .filter((n) => n.type !== 'inquiry' && (n.user_id === userId || n.user_id === 'all'))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export function markNotificationRead(id: number) {
  const d = load();
  const n = d.notifications?.find((x) => x.id === id);
  if (n) { n.read = true; save(); }
}

export function markAllNotificationsRead(userId: string) {
  const d = load();
  (d.notifications || []).forEach((n) => { if (n.user_id === userId || n.user_id === 'all') n.read = true; });
  save();
}

export function getUnreadNotificationsCount(userId: string): number {
  const d = load();
  return (d.notifications || []).filter((n) => n.type !== 'inquiry' && (n.user_id === userId || n.user_id === 'all') && !n.read).length;
}

export async function getActionableRequestsCount(userId: string): Promise<number> {
  await delay(40);
  const d = load();
  return d.requests.filter((r) => {
    if (r.sender_id !== userId && r.receiver_id !== userId) return false;
    if (r.journey_stage === 'declined' || r.journey_stage === 'cancelled' || r.journey_stage === 'completed') return false;
    if (r.frozen) return false;
    const isSender = r.sender_id === userId;
    const balance = partyBalance(r, isSender ? 'sender' : 'receiver');
    const stage = displayStage(r.journey_stage);
    if (stage === 'sent') return !isSender;
    if (stage === 'accepted') return balance.paid === 0 && balance.initial > 0 && balance.remaining > 0;
    if (stage === 'engagement') return !!workflowOf(r).mahrConfirmed && balance.remaining > 0;
    return false;
  }).length;
}

export function deleteNotification(id: number) {
  const d = load();
  if (d.notifications) { d.notifications = d.notifications.filter((n) => n.id !== id); save(); }
}

// ============================================================
//  ===== لوحة الإدارة (محلية بالكامل) =====
//  تقرأ نفس قاعدة بيانات الطلبات المحلية، فيرتبط ما يفعله
//  الأعضاء (قبول/رفض/دفع) مباشرةً بما تراه الإدارة، والعكس.
// ============================================================

// حالات الحساب: نشط / قيد المراجعة / موقوف / محظور نهائياً
export type MemberStatus = 'active' | 'pending' | 'suspended' | 'banned';

interface AdminMemberMeta {
  status: MemberStatus;
  plan: 'free' | 'featured';
  realName: string;
  email: string;
  phone: string;
  nationalId: string;
  password: string;             // كلمة سر الحساب (لعرضها للإدارة)
  joinedAt: string;
  verifiedOverride?: boolean;   // تجاوز إداري لحالة التوثيق
  premiumOverride?: boolean;    // تجاوز إداري للاشتراك المميّز
  adminNote?: string;           // ملاحظة إدارية خاصة
  flagged?: boolean;            // معلّم للمتابعة
  deleted?: boolean;            // محذوف نهائياً (إداري)
  statusReason?: string;        // سبب الحظر/التجميد/الإيقاف
  statusChangedAt?: string;     // وقت آخر تغيير للحالة
  statusChangedBy?: string;     // المشرف الذي غيّر الحالة
  isProfileIncomplete?: boolean; // هل الملف الشخصي غير مكتمل؟
  pinned?: boolean;             // هل العضو مثبت من الإدارة؟
}

const ADMIN_META_KEY = 'twafok_admin_meta_v1';

function readAdminMeta(): Record<string, AdminMemberMeta> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = getLocalSetting(ADMIN_META_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* تجاهل */ }
  return {};
}

function writeAdminMeta(meta: Record<string, AdminMemberMeta>) {
  if (typeof window === 'undefined') return;
  try { setLocalSetting(ADMIN_META_KEY, JSON.stringify(meta)); } catch { /* تجاهل */ }
}

function defaultMeta(m: Member): AdminMemberMeta {
  const plan: AdminMemberMeta['plan'] = memberPlan(m);
  const num = parseInt(m.id.replace(/\D/g, '') || '0', 10);
  const phoneTail = String(1000000 + (num * 13579) % 8999999);
  const pwSeed = String(100000 + (num * 246813) % 899999);
  return {
    status: (m as any).status || 'active',
    plan,
    realName: (m as any).realName || m.nickname,
    email: (m as any).email || `${m.id}@twafok.sa`,
    phone: (m as any).phone || `+9665${phoneTail}`.slice(0, 13),
    nationalId: (m as any).nationalId || `10${String(20000000 + (num * 7654321) % 79999999)}`,
    password: (m as any).password || `Twafok@${pwSeed}`,
    joinedAt: (m as any).joinedAt || '2025-01-15',
  };
}

function getMeta(m: Member): AdminMemberMeta {
  const all = readAdminMeta();
  if (!all[m.id]) {
    let foundAdmin: any = null;
    if (typeof window !== 'undefined') {
      try {
        const savedAdminRaw = getLocalSetting('saved_admin_members_list');
        if (savedAdminRaw) {
          const parsed = JSON.parse(savedAdminRaw);
          if (Array.isArray(parsed)) {
            foundAdmin = parsed.find((am: any) => am.id === m.id);
          }
        }
      } catch {}
    }

    if (foundAdmin) {
      all[m.id] = {
        status: foundAdmin.status || (m as any).status || 'active',
        plan: foundAdmin.plan || (m as any).plan || 'free',
        realName: foundAdmin.realName || (m as any).realName || m.nickname,
        email: foundAdmin.email || (m as any).email || `${m.id}@twafok.sa`,
        phone: foundAdmin.phone || (m as any).phone || '',
        nationalId: foundAdmin.nationalId || (m as any).nationalId || `10${String(20000000 + (parseInt(m.id.replace(/\D/g, '') || '0') * 7654321) % 79999999)}`,
        password: foundAdmin.password || (m as any).password || DEMO_ADMIN_PASSWORD,
        joinedAt: foundAdmin.joinedAt || (m as any).joinedAt || new Date().toLocaleDateString('ar-SA'),
      };
    } else {
      all[m.id] = defaultMeta(m);
    }
    writeAdminMeta(all);
  }
  return all[m.id];
}

export interface AdminMemberRowLocal {
  id: string;
  nickname: string;
  username?: string;
  gender: 'male' | 'female';
  age: number;
  country: string;
  city: string;
  verified: boolean;
  premium: boolean;
  realName: string;
  email: string;
  phone: string;
  nationalId: string;
  password: string;
  status: MemberStatus;
  plan: 'free' | 'featured';
  pinned?: boolean;
  joinedAt: string;
  requestsCount: number;
  district: string;
  education: string;
  workType: string;
  adminNote: string;
  flagged: boolean;
  statusReason: string;
  statusChangedAt: string;
  statusChangedBy: string;
  // ===== حقول الاستيراد =====
  sourceType?: 'registered' | 'imported';
  importBatchId?: string;
  importOfficeName?: string;
  importDate?: string;
  importNotes?: string;
  isProfileIncomplete?: boolean;
  maritalStatus?: string;
  birthDate?: string;
  skinColor?: string;
  height?: number;
  weight?: number;
  bio?: string;
  nationality?: string;
  sect?: string;
  tribe?: string;
  childrenCount?: string;
  ethnicity?: string;
  health?: string;
  smoking?: string;
  housing?: string;
  jobTitle?: string;
  pCountry?: string;
  pCity?: string;
  pNationality?: string;
  pSect?: string;
  pAgeMin?: number;
  pAgeMax?: number;
  pMaritalStatus?: string;
  pAcceptChildren?: string;
  pSkinColor?: string;
  pEducation?: string;
  pWorkType?: string;
  pHousing?: string;
  pNotes?: string;
}

export async function adminGetMembers(): Promise<AdminMemberRowLocal[]> {
  await delay(80);
  const d = load();
  return getLiveMembers(true).map((m) => {
    const meta = getMeta(m);
    const requestsCount = d.requests.filter(
      (r) => r.sender_id === m.id || r.receiver_id === m.id,
    ).length;
    const verified = meta.verifiedOverride !== undefined ? meta.verifiedOverride : m.verified;
    const premium = meta.premiumOverride !== undefined ? meta.premiumOverride : m.premium;
    const pinned = meta.pinned !== undefined ? meta.pinned : !!m.pinned;
    return {
      id: m.id, nickname: m.nickname, username: m.username, gender: m.gender, age: m.age,
      country: m.country, city: m.city, verified, premium,
      realName: meta.realName, email: meta.email, phone: meta.phone,
      nationalId: meta.nationalId, password: meta.password || 'Twafok@000000',
      status: meta.status, plan: meta.plan, pinned,
      joinedAt: meta.joinedAt, requestsCount,
      district: m.district, education: m.education, workType: m.workType,
      adminNote: meta.adminNote || '', flagged: !!meta.flagged,
      statusReason: meta.statusReason || '',
      statusChangedAt: meta.statusChangedAt || '',
      statusChangedBy: meta.statusChangedBy || '',
      // حقول الاستيراد
      sourceType: (m as any).sourceType || 'registered',
      importBatchId: (m as any).importBatchId || undefined,
      importOfficeName: (m as any).importOfficeName || undefined,
      importDate: (m as any).importDate || undefined,
      importNotes: (m as any).importNotes || undefined,
      isProfileIncomplete: !!(m as any).isProfileIncomplete,
      // حقول البيانات والصفات الشخصية الإضافية
      maritalStatus: m.maritalStatus,
      marriageType: (m as any).marriageType || (m as any).marriage_type || 'announced',
      marriageTypeLabel: (m as any).marriageTypeLabel || (
        ((m as any).marriageType || (m as any).marriage_type) === 'misyar' ? 'مسيار' :
        ((m as any).marriageType || (m as any).marriage_type) === 'both' ? 'معلن أو مسيار' : 'معلن'
      ),
      birthDate: (m as any).birthDate,
      skinColor: (m as any).skinColor,
      height: m.height,
      weight: (m as any).weight,
      bio: m.bio,
      nationality: m.nationality,
      sect: (m as any).sect,
      tribe: (m as any).tribe || m.tribe || '',
      childrenCount: (m as any).childrenCount,
      ethnicity: m.ethnicity,
      health: (m as any).health,
      smoking: (m as any).smoking,
      housing: (m as any).housing,
      jobTitle: (m as any).jobTitle,
      pCountry: (m as any).pCountry,
      pCity: (m as any).pCity,
      pNationality: (m as any).pNationality,
      pSect: (m as any).pSect,
      pAgeMin: (m as any).pAgeMin,
      pAgeMax: (m as any).pAgeMax,
      pMaritalStatus: (m as any).pMaritalStatus,
      pAcceptChildren: (m as any).pAcceptChildren,
      pSkinColor: (m as any).pSkinColor,
      pEducation: (m as any).pEducation,
      pWorkType: (m as any).pWorkType,
      pHousing: (m as any).pHousing,
      pNotes: (m as any).pNotes || m.aboutPartner,
    };
  }).filter((row) => {
    const all = readAdminMeta();
    return !all[row.id]?.deleted;
  });
}

export async function adminUpdateMember(
  id: string,
  fields: any,
): Promise<boolean> {
  await delay(60);
  const all = readAdminMeta();
  const m = getLiveMemberById(id);
  if (!m) return false;
  if (!all[id]) all[id] = defaultMeta(m);
  if (fields.status) {
    all[id].status = fields.status as MemberStatus;
    all[id].statusChangedAt = new Date().toISOString();
    all[id].statusChangedBy = fields.statusChangedBy || 'الإدارة';
    // مسح السبب عند العودة لحالة نشط
    all[id].statusReason = fields.status === 'active' ? '' : (fields.statusReason ?? all[id].statusReason ?? '');
  }
  if (fields.statusReason !== undefined && !fields.status) all[id].statusReason = fields.statusReason;
  if (fields.plan) all[id].plan = fields.plan as AdminMemberMeta['plan'];
  if (fields.pinned !== undefined) all[id].pinned = fields.pinned;
  if (fields.verified !== undefined) all[id].verifiedOverride = fields.verified;
  if (fields.premium !== undefined) all[id].premiumOverride = fields.premium;
  if (fields.adminNote !== undefined) all[id].adminNote = fields.adminNote;
  if (fields.flagged !== undefined) all[id].flagged = fields.flagged;
  writeAdminMeta(all);

  // تحديث كائن العضو الفعلي في saved_members_list و saved_admin_members_list في localStorage
  if (typeof window !== 'undefined') {
    try {
      // 1. تحديث saved_members_list
      let list: Member[] = [];
      const saved = getLocalSetting('saved_members_list');
      if (saved) {
        list = JSON.parse(saved);
      }
      if (list.length === 0) {
        list = [...MEMBERS];
      }
      const idx = list.findIndex(item => item.id === id);

      // حساب العمر من تاريخ الميلاد إن وُجد
      let calculatedAge = fields.age;
      if (fields.birthDate || fields.birth_date) {
        const bd = fields.birthDate || fields.birth_date;
        const parts = typeof bd === 'string' ? bd.split('-') : [];
        if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
          const birth = new Date(bd);
          const today = new Date();
          let age = today.getFullYear() - birth.getFullYear();
          const monthDiff = today.getMonth() - birth.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
          if (age > 0) calculatedAge = age;
        }
      }

      const mergedPayload: any = {
        ...fields,
        ...(calculatedAge ? { age: calculatedAge } : {}),
      };

      if (fields.verified !== undefined) mergedPayload.verified = fields.verified;
      if (fields.premium !== undefined) mergedPayload.premium = fields.premium;
      if (fields.status) mergedPayload.status = fields.status;
      if (fields.plan !== undefined) {
        mergedPayload.plan = fields.plan;
        mergedPayload.premium = fields.plan === 'featured';
      }
      if (fields.pinned !== undefined) {
        mergedPayload.pinned = fields.pinned;
      }

      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          ...mergedPayload,
          details: {
            ...(list[idx].details || {}),
            ...(fields.details || {}),
            ...mergedPayload,
          },
        };
      } else {
        list.push({
          id,
          ...mergedPayload,
        } as any);
      }
      setLocalSetting('saved_members_list', JSON.stringify(list));

      // 2. تحديث saved_admin_members_list أيضاً لضمان تطابق كامل
      try {
        const savedAdmin = getLocalSetting('saved_admin_members_list');
        if (savedAdmin) {
          const adminList = JSON.parse(savedAdmin);
          if (Array.isArray(adminList)) {
            const aIdx = adminList.findIndex((item: any) => item.id === id);
            if (aIdx !== -1) {
              adminList[aIdx] = {
                ...adminList[aIdx],
                ...mergedPayload,
                details: { ...(adminList[aIdx].details || {}), ...mergedPayload },
              };
              setLocalSetting('saved_admin_members_list', JSON.stringify(adminList));
            }
          }
        }
      } catch {}

      // 3. تحديث twafok_members في المستودع العام
      try {
        const rawRepo = getLocalSetting('twafok_members');
        if (rawRepo) {
          const repoList = JSON.parse(rawRepo);
          if (Array.isArray(repoList)) {
            const rIdx = repoList.findIndex((item: any) => item.id === id);
            if (rIdx !== -1) {
              repoList[rIdx] = { ...repoList[rIdx], ...mergedPayload };
              setLocalSetting('twafok_members', JSON.stringify(repoList));
            }
          }
        }
      } catch {}

      // 4. إذا كان العضو المعدّل هو نفس المستخدم المسجل حالياً، نحدث auth_user و user_profile_data
      const currentUserId = getCurrentUserId();
      if (currentUserId === id) {
        const rawUser = getLocalSetting('auth_user');
        if (rawUser) {
          try {
            const userObj = JSON.parse(rawUser);
            if (userObj && (userObj.memberId === id || userObj.id === id)) {
              userObj.name = fields.nickname || fields.realName || userObj.name;
              userObj.profile = {
                ...(userObj.profile || {}),
                ...mergedPayload,
              };
              setLocalSetting('auth_user', JSON.stringify(userObj));
            }
          } catch {}
        }
        const rawProfileData = getLocalSetting('user_profile_data');
        if (rawProfileData) {
          try {
            const pd = JSON.parse(rawProfileData);
            setLocalSetting('user_profile_data', JSON.stringify({ ...pd, ...mergedPayload }));
          } catch {}
        }
      }

      // 5. إطلاق حدث محلي لتحديث الواجهات التفاعلية فوراً
      window.dispatchEvent(new CustomEvent('twafok_member_updated', { detail: { id, fields: mergedPayload } }));
      window.dispatchEvent(new CustomEvent('twafok_members_changed'));
    } catch { /* تجاهل */ }
  }

  return true;
}

export async function adminBulkDeleteMembers(ids: string[]): Promise<boolean> {
  await delay(80);
  const all = readAdminMeta();
  ids.forEach((id) => {
    if (!all[id]) {
      const m = getLiveMemberById(id);
      if (m) all[id] = defaultMeta(m);
    }
    if (all[id]) {
      all[id].deleted = true;
      all[id].status = 'deleted';
    }
  });
  writeAdminMeta(all);

  // حذفهم أيضاً من قائمة الأعضاء المحفوظة لئلا يتم استيرادهم مجدداً
  if (typeof window !== 'undefined') {
    try {
      const saved = getLocalSetting('saved_members_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const remaining = parsed.filter((member: any) => !ids.includes(member.id));
          setLocalSetting('saved_members_list', JSON.stringify(remaining));
          if (remaining.length === 0) {
            setLocalSetting('members_purged', 'true');
          }
        }
      } else {
        setLocalSetting('members_purged', 'true');
      }
      const savedAdmin = getLocalSetting('saved_admin_members_list');
      if (savedAdmin) {
        const parsedAdmin = JSON.parse(savedAdmin);
        if (Array.isArray(parsedAdmin)) {
          const remainingAdmin = parsedAdmin.filter((member: any) => !ids.includes(member.id));
          setLocalSetting('saved_admin_members_list', JSON.stringify(remainingAdmin));
          if (remainingAdmin.length === 0) {
            setLocalSetting('members_purged', 'true');
          }
        }
      }

      // تنظيف الطلبات والرحلات المحفوظة إذا لم يتبقَ أي أعضاء نشطين
      const activeMembers = getLiveMembers(false);
      if (activeMembers.length === 0) {
        setLocalSetting('members_purged', 'true');
        const rawStorage = getLocalSetting(STORAGE_KEY);
        if (rawStorage) {
          try {
            const parsedStorage = JSON.parse(rawStorage);
            if (parsedStorage && Array.isArray(parsedStorage.requests)) {
              parsedStorage.requests = [];
              setLocalSetting(STORAGE_KEY, JSON.stringify(parsedStorage));
            }
          } catch {}
        }
      }
    } catch { /* تجاهل */ }
  }

  return true;
}

export async function adminBulkUpdateStatus(
  ids: string[],
  status: MemberStatus,
  reason?: string,
  by?: string,
): Promise<boolean> {
  await delay(80);
  const all = readAdminMeta();
  ids.forEach((id) => {
    if (!all[id]) {
      const m = getLiveMemberById(id);
      if (m) all[id] = defaultMeta(m);
    }
    if (all[id]) {
      all[id].status = status;
      all[id].statusChangedAt = new Date().toISOString();
      all[id].statusChangedBy = by || 'الإدارة (إجراء جماعي)';
      all[id].statusReason = reason || '';
    }
  });
  writeAdminMeta(all);
  return true;
}

export async function adminBulkSetVerified(ids: string[], value: boolean): Promise<boolean> {
  await delay(80);
  const all = readAdminMeta();
  ids.forEach((id) => {
    if (!all[id]) {
      const m = getLiveMemberById(id);
      if (m) all[id] = defaultMeta(m);
    }
    if (all[id]) all[id].verifiedOverride = value;
  });
  writeAdminMeta(all);
  return true;
}

export async function adminBulkSetPinned(ids: string[], value: boolean): Promise<boolean> {
  await delay(80);
  const all = readAdminMeta();
  ids.forEach((id) => {
    if (!all[id]) {
      const m = getLiveMemberById(id);
      if (m) all[id] = defaultMeta(m);
    }
    if (all[id]) all[id].pinned = value;
  });
  writeAdminMeta(all);

  if (typeof window !== 'undefined') {
    try {
      let list: Member[] = [];
      const saved = getLocalSetting('saved_members_list');
      if (saved) {
        list = JSON.parse(saved);
      }
      if (list.length === 0) {
        list = [...MEMBERS];
      }
      let changed = false;
      ids.forEach((id) => {
        const idx = list.findIndex(item => item.id === id);
        if (idx !== -1) {
          list[idx].pinned = value;
          changed = true;
        }
      });
      if (changed) {
        setLocalSetting('saved_members_list', JSON.stringify(list));
      }
    } catch { /* تجاهل */ }
  }
  return true;
}

export async function adminBulkSetPlan(ids: string[], plan: 'free' | 'featured'): Promise<boolean> {
  await delay(80);
  const all = readAdminMeta();
  ids.forEach((id) => {
    if (!all[id]) {
      const m = getLiveMemberById(id);
      if (m) all[id] = defaultMeta(m);
    }
    if (all[id]) {
      all[id].plan = plan;
      all[id].premiumOverride = plan !== 'free';
    }
  });
  writeAdminMeta(all);

  if (typeof window !== 'undefined') {
    try {
      let list: Member[] = [];
      const saved = getLocalSetting('saved_members_list');
      if (saved) {
        list = JSON.parse(saved);
      }
      if (list.length === 0) {
        list = [...MEMBERS];
      }
      let changed = false;
      ids.forEach((id) => {
        const idx = list.findIndex(item => item.id === id);
        if (idx !== -1) {
          list[idx].plan = plan;
          list[idx].premium = plan !== 'free';
          changed = true;
        }
      });
      if (changed) {
        setLocalSetting('saved_members_list', JSON.stringify(list));
      }
    } catch { /* تجاهل */ }
  }
  return true;
}

export async function adminBulkSetSeriousnessBadge(ids: string[], value: boolean): Promise<boolean> {
  await delay(80);
  if (typeof window !== 'undefined') {
    try {
      let list: Member[] = [];
      const saved = getLocalSetting('saved_members_list');
      if (saved) {
        list = JSON.parse(saved);
      }
      if (list.length === 0) {
        list = [...MEMBERS];
      }
      let changed = false;
      ids.forEach((id) => {
        const idx = list.findIndex(item => item.id === id);
        if (idx !== -1) {
          list[idx].hasSeriousnessBadge = value;
          changed = true;
        }
      });
      if (changed) {
        setLocalSetting('saved_members_list', JSON.stringify(list));
      }
    } catch { /* تجاهل */ }
  }
  return true;
}

export async function adminDeleteMember(id: string): Promise<boolean> {
  await delay(60);
  const all = readAdminMeta();
  if (!all[id]) {
    const m = getLiveMemberById(id);
    if (m) all[id] = defaultMeta(m);
  }
  if (all[id]) {
    all[id].deleted = true;
    all[id].status = 'deleted';
    writeAdminMeta(all);

    // الحذف من saved_members_list و saved_admin_members_list
    if (typeof window !== 'undefined') {
      try {
        const saved = getLocalSetting('saved_members_list');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const remaining = parsed.filter((member: any) => member.id !== id);
            setLocalSetting('saved_members_list', JSON.stringify(remaining));
            if (remaining.length === 0) setLocalSetting('members_purged', 'true');
          }
        }
        const savedAdmin = getLocalSetting('saved_admin_members_list');
        if (savedAdmin) {
          const parsedAdmin = JSON.parse(savedAdmin);
          if (Array.isArray(parsedAdmin)) {
            const remainingAdmin = parsedAdmin.filter((member: any) => member.id !== id);
            setLocalSetting('saved_admin_members_list', JSON.stringify(remainingAdmin));
            if (remainingAdmin.length === 0) setLocalSetting('members_purged', 'true');
          }
        }

        const activeMembers = getLiveMembers(false);
        if (activeMembers.length === 0) {
          setLocalSetting('members_purged', 'true');
          const rawStorage = getLocalSetting(STORAGE_KEY);
          if (rawStorage) {
            try {
              const parsedStorage = JSON.parse(rawStorage);
              if (parsedStorage && Array.isArray(parsedStorage.requests)) {
                parsedStorage.requests = [];
                setLocalSetting(STORAGE_KEY, JSON.stringify(parsedStorage));
              }
            } catch {}
          }
        }
      } catch { /* تجاهل */ }
    }

    return true;
  }
  return false;
}

export async function adminHardDeleteMember(id: string): Promise<boolean> {
  await delay(80);
  const all = readAdminMeta();
  if (all[id]) {
    delete all[id];
    writeAdminMeta(all);
  }

  if (typeof window !== 'undefined') {
    try {
      const saved = getLocalSetting('saved_members_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setLocalSetting('saved_members_list', JSON.stringify(parsed.filter((member: any) => member.id !== id)));
        }
      }
      const savedAdmin = getLocalSetting('saved_admin_members_list');
      if (savedAdmin) {
        const parsedAdmin = JSON.parse(savedAdmin);
        if (Array.isArray(parsedAdmin)) {
          setLocalSetting('saved_admin_members_list', JSON.stringify(parsedAdmin.filter((member: any) => member.id !== id)));
        }
      }

      // Cleanup notifications
      const rawDb = getLocalSetting('twafok_local_db_v4');
      if (rawDb) {
        const db = JSON.parse(rawDb);
        if (db) {
          if (Array.isArray(db.requests)) {
            db.requests = db.requests.filter((r: any) => r.sender_id !== id && r.receiver_id !== id);
          }
          if (Array.isArray(db.notifications)) {
            db.notifications = db.notifications.filter((n: any) => n.user_id !== id);
          }
          setLocalSetting('twafok_local_db_v4', JSON.stringify(db));
        }
      }

      // Cleanup interest requests
      const savedRequests = getLocalSetting('twafok_requests');
      if (savedRequests) {
        const parsedRequests = JSON.parse(savedRequests);
        if (Array.isArray(parsedRequests)) {
          setLocalSetting('twafok_requests', JSON.stringify(parsedRequests.filter((r: any) => r.senderId !== id && r.receiverId !== id)));
        }
      }
    } catch (err) {
      console.error('Error in hard delete cleanup:', err);
    }
  }
  return true;
}

export async function adminResetPassword(id: string): Promise<string> {
  await delay(60);
  const all = readAdminMeta();
  const m = getLiveMemberById(id);
  if (!m) return '';
  if (!all[id]) all[id] = defaultMeta(m);
  const newPw = 'Twafok@' + Math.floor(100000 + Math.random() * 900000);
  all[id].password = newPw;
  writeAdminMeta(all);
  return newPw;
}

export async function adminToggleVerified(id: string, value: boolean): Promise<boolean> {
  return adminUpdateMember(id, { verified: value });
}

export async function adminSetPremium(id: string, value: boolean): Promise<boolean> {
  return adminUpdateMember(id, { premium: value, plan: value ? 'featured' : 'free' });
}

export async function adminSetNote(id: string, note: string): Promise<boolean> {
  return adminUpdateMember(id, { adminNote: note });
}

export async function adminToggleFlag(id: string, value: boolean): Promise<boolean> {
  return adminUpdateMember(id, { flagged: value });
}

export async function adminSendNotification(id: string, text: string, title?: string): Promise<boolean> {
  await delay(40);
  const d = load();
  addNotification(d, id, 0, 'admin', text, title);
  save();
  return true;
}

export async function adminSendBulkNotifications(userIds: string[], text: string, title?: string): Promise<boolean> {
  await delay(40);
  const d = load();
  if (!d.notifications) d.notifications = [];
  const uniqueIds = Array.from(new Set(userIds));
  const now = new Date().toISOString();
  for (const uid of uniqueIds) {
    d.notifications.push({
      id: nextId(),
      user_id: uid,
      request_id: 0,
      type: 'admin',
      text,
      title: title || 'إشعار إداري',
      read: false,
      created_at: now,
    });
  }
  save();
  return true;
}

export async function adminDeleteRequest(requestId: number): Promise<boolean> {
  await delay(80);
  const d = load();
  const initialCount = d.requests.length;
  d.requests = d.requests.filter((r) => r.id !== requestId);
  d.events = d.events.filter((e) => e.request_id !== requestId);
  d.inquiryMessages = d.inquiryMessages.filter((m) => m.request_id !== requestId);
  d.inquiryPackages = d.inquiryPackages.filter((p) => p.request_id !== requestId);
  save();
  return d.requests.length < initialCount;
}

// منح وسام الجدية يدوياً من لوحة التحكم
export async function adminGrantSeriousnessBadge(id: string): Promise<boolean> {
  await delay(40);
  if (typeof window !== 'undefined') {
    try {
      let list: Member[] = [];
      const saved = getLocalSetting('saved_members_list');
      if (saved) {
        list = JSON.parse(saved);
      }
      if (list.length === 0) {
        list = [...MEMBERS];
      }
      const idx = list.findIndex(item => item.id === id);
      if (idx !== -1) {
        list[idx].hasSeriousnessBadge = true;
        setLocalSetting('saved_members_list', JSON.stringify(list));
        return true;
      }
    } catch { /* تجاهل */ }
  }
  return false;
}

// سحب وسام الجدية يدوياً من لوحة التحكم
export async function adminRevokeSeriousnessBadge(id: string): Promise<boolean> {
  await delay(40);
  if (typeof window !== 'undefined') {
    try {
      let list: Member[] = [];
      const saved = getLocalSetting('saved_members_list');
      if (saved) {
        list = JSON.parse(saved);
      }
      if (list.length === 0) {
        list = [...MEMBERS];
      }
      const idx = list.findIndex(item => item.id === id);
      if (idx !== -1) {
        list[idx].hasSeriousnessBadge = false;
        setLocalSetting('saved_members_list', JSON.stringify(list));
        return true;
      }
    } catch { /* تجاهل */ }
  }
  return false;
}

export async function adminGetRequests(): Promise<any[]> {
  await delay(80);
  const d = load();
  return [...d.requests].map((r) => {
    const s = getLiveMemberById(r.sender_id);
    const rcv = getLiveMemberById(r.receiver_id);
    return {
      ...r,
      sender_nickname: s?.nickname || r.sender_id,
      sender_gender: s?.gender || 'male',
      receiver_nickname: rcv?.nickname || r.receiver_id,
      receiver_gender: rcv?.gender || 'female',
    };
  });
}

export async function adminGetStats(): Promise<any> {
  await delay(80);
  const d = load();
  const members = await adminGetMembers();
  const activeCount = members.filter((m) => m.status === 'active').length;
  const pendingCount = members.filter((m) => m.status === 'pending').length;
  const suspendedCount = members.filter((m) => m.status === 'suspended').length;
  const bannedCount = members.filter((m) => m.status === 'banned').length;

  const totalReq = d.requests.length;
  const completedCount = d.requests.filter((r) => r.journey_stage === 'completed').length;
  const declinedCount = d.requests.filter((r) => r.journey_stage === 'declined').length;
  const cancelledCount = d.requests.filter((r) => r.journey_stage === 'cancelled').length;

  const seriousCount = d.requests.filter(
    (r) => r.journey_stage === 'seriousness' || r.journey_stage === 'coordination' || r.journey_stage === 'sharia_viewing' || r.journey_stage === 'engagement',
  ).length;

  const maleCount = members.filter((m) => m.gender === 'male').length;
  const femaleCount = members.filter((m) => m.gender === 'female').length;

  const verifiedCount = members.filter((m) => m.verified).length;
  const premiumCount = members.filter((m) => m.premium).length;

  const pendingRequestsCount = d.requests.filter((r) => r.journey_stage === 'sent').length;
  const activeJourneysCount = d.requests.filter(
    (r) => !['sent', 'completed', 'declined', 'cancelled'].includes(r.journey_stage)
  ).length;

  let depositsPaid = 0;
  d.requests.forEach((r) => {
    if (r.sender_paid) depositsPaid++;
    if (r.receiver_paid) depositsPaid++;
  });
  const revenue = d.requests.reduce((sum, r) => sum + partyBalance(r, 'sender').paid + partyBalance(r, 'receiver').paid, 0);

  const transactions = getTransactions() || [];
  const txRevenue = transactions
    .filter((tx: any) => tx.status === 'completed' || tx.status === 'success')
    .reduce((sum: number, tx: any) => sum + (Number(tx.amount) || 0), 0);

  const totalTransactions = transactions.length + depositsPaid;
  const totalRevenue = revenue + txRevenue;

  const liveMembers = getLiveMembers(true);
  const seriousnessBadgesCount = liveMembers.filter((m) => m.hasSeriousnessBadge).length;

  const stageBreakdown: Record<string, number> = {};
  const stages = ['sent', 'accepted', 'seriousness', 'coordination', 'sharia_viewing', 'engagement', 'completed', 'declined', 'cancelled'];
  stages.forEach((st) => {
    stageBreakdown[st] = d.requests.filter((r) => r.journey_stage === st).length;
  });

  const recentEvents = (d.events || [])
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return {
    totalMembers: members.length,
    activeMembers: activeCount,
    pendingMembers: pendingCount,
    suspendedMembers: suspendedCount,
    bannedMembers: bannedCount,
    totalRequests: totalReq,
    completedRequests: completedCount,
    declinedRequests: declinedCount,
    cancelledRequests: cancelledCount,
    seriousRequests: seriousCount,
    maleCount,
    femaleCount,
    males: maleCount,
    females: femaleCount,

    pendingRequests: pendingRequestsCount,
    activeJourneys: activeJourneysCount,
    completed: completedCount,
    verified: verifiedCount,
    premium: premiumCount,
    revenue: revenue,
    depositsPaid: depositsPaid,
    seriousnessBadges: seriousnessBadgesCount,
    totalTransactions: totalTransactions,
    totalRevenue: totalRevenue,
    stageBreakdown,
    recentEvents,
  };
}

export async function adminGetRequestPayments(requestId: number): Promise<any[]> {
  await delay(40);
  const req = load().requests.find(r => r.id === requestId);
  if (!req) return [];
  return workflowOf(req).payments.map(p => ({ ...p, request_id: requestId,
    userId: p.party === 'sender' ? req.sender_id : req.receiver_id,
    userNickname: getLiveMemberById(p.party === 'sender' ? req.sender_id : req.receiver_id)?.nickname,
    status: 'success', paid_at: p.at }));
}

// ===== الكوبونات والمعاملات المالية =====
const COUPONS_KEY = 'twafok_coupons_v1';
const TRANSACTIONS_KEY = 'twafok_transactions_v1';

const SEED_COUPONS = [
  { code: 'JAD20', discount: 20, active: true, description: 'خصم ٢٠٪ بمناسبة تدشين المنصة' },
  { code: 'TAWAFOK50', discount: 50, active: true, description: 'خصم ٥٠٪ للأعضاء المميزين' },
];

export function getCoupons(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = getLocalSetting(COUPONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* تجاهل */ }
  // حفظ البذرة
  try { setLocalSetting(COUPONS_KEY, JSON.stringify(SEED_COUPONS)); } catch {}
  return SEED_COUPONS;
}

export function saveCoupon(coupon: any) {
  const coupons = getCoupons();
  const idx = coupons.findIndex((c) => c.code.toUpperCase() === coupon.code.toUpperCase());
  if (idx !== -1) {
    coupons[idx] = { ...coupons[idx], ...coupon };
  } else {
    coupons.push(coupon);
  }
  try { setLocalSetting(COUPONS_KEY, JSON.stringify(coupons)); } catch { /* تجاهل */ }
}

export function deleteCoupon(code: string) {
  const coupons = getCoupons().filter((c) => c.code.toUpperCase() !== code.toUpperCase());
  try { setLocalSetting(COUPONS_KEY, JSON.stringify(coupons)); } catch { /* تجاهل */ }
}

export function toggleCouponActive(code: string) {
  const coupons = getCoupons();
  const idx = coupons.findIndex((c) => c.code.toUpperCase() === code.toUpperCase());
  if (idx !== -1) {
    coupons[idx].active = !coupons[idx].active;
    try { setLocalSetting(COUPONS_KEY, JSON.stringify(coupons)); } catch { /* تجاهل */ }
  }
}

export function getTransactions(): any[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = getLocalSetting(TRANSACTIONS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* تجاهل */ }
  return [];
}

export function recordTransaction(tx: any) {
  if (['inquiry', 'deposit', 'final'].includes(tx.type)) return false; // خدمة ملغاة؛ لا معاملات جديدة لها
  const transactions = getTransactions();
  transactions.unshift({
    id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    created_at: new Date().toISOString(),
    ...tx,
  });
  try { setLocalSetting(TRANSACTIONS_KEY, JSON.stringify(transactions)); } catch { /* تجاهل */ }
}

export function updateTransactionStatus(id: string, status: string): boolean {
  const transactions = getTransactions();
  const idx = transactions.findIndex((t) => t.id === id || t.id?.toString() === id?.toString());
  if (idx !== -1) {
    if (['inquiry', 'deposit', 'final'].includes(transactions[idx].type) && status === 'completed') return false;
    transactions[idx].status = status;
    try { setLocalSetting(TRANSACTIONS_KEY, JSON.stringify(transactions)); } catch { /* تجاهل */ }
    return true;
  }
  return false;
}

export function validateCoupon(code: string, amount?: number): any {
  const norm = (code || '').trim().toUpperCase();
  const coupon = getCoupons().find((c) => c.code.toUpperCase() === norm && c.active);
  if (!coupon) return { valid: false, error: 'الكوبون غير صحيح أو منتهي الصلاحية' };

  let discount = coupon.discount;
  if (amount !== undefined && coupon.type === 'percent') {
    discount = Math.round((amount * coupon.discount) / 100);
  }

  return { valid: true, discount, coupon };
}

export function useCoupon(code: string): boolean {
  const validation = validateCoupon(code);
  return validation.valid;
}

export async function adminApplyExemption(memberId: string, type: 'deposit' | 'badge', value: number | boolean, memberName?: string): Promise<boolean> {
  await delay(50);
  const d = load();
  let exemptionApplied = false;

  if (type === 'deposit') {
    return false; // Record actual funds or a documented fee correction in the unified journey editor.
  } else if (type === 'badge') {
    return adminUpdateMember(memberId, { verified: !!value });
  }

  if (exemptionApplied) {
    save();
  }
  return exemptionApplied;
}

export interface AdminStatsLocal {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  suspendedMembers: number;
  bannedMembers: number;
  totalRequests: number;
  completedRequests: number;
  declinedRequests: number;
  cancelledRequests: number;
  seriousRequests: number;
  maleCount: number;
  femaleCount: number;
  males: number;
  females: number;

  pendingRequests: number;
  activeJourneys: number;
  completed: number;
  verified: number;
  premium: number;
  revenue: number;
  depositsPaid: number;
  seriousnessBadges: number;
  totalTransactions: number;
  totalRevenue: number;
  stageBreakdown: Record<string, number>;
  recentEvents: any[];
}

export interface RequestPaymentsSummary {
  requestId: number;
  sender_paid: boolean;
  receiver_paid: boolean;
  sender_paid_at?: string;
  receiver_paid_at?: string;
}

export interface LocalCoupon {
  id: string;
  code: string;
  discount: number;
  type: 'percent' | 'fixed';
  usageLimit: number;
  expiryDate: string;
  active: boolean;
  usedCount?: number;
  usageCount?: number;
  createdAt?: string;
  createdBy?: string;
}

export interface LocalTransaction {
  id: string;
  memberId: string;
  memberName?: string;
  amount: number;
  type: 'subscription' | 'inquiry' | 'deposit' | 'exemption';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  createdAt: string;
  description?: string;
  method?: string;
  date?: string;
  couponCode?: string;
}
