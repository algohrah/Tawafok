// ============================================================
//  رحلة طلب التوافق v2 — نظام مبسّط (4 محطات)
//  sent → accepted → coordinating → closed
// ============================================================

import {
  Send, HeartHandshake, Clock, CheckCircle,
  XCircle, Ban, type LucideIcon,
} from 'lucide-react';

// ===== مراحل الرحلة الجديدة =====
export type JourneyStage =
  | 'sent'          // ① مُرسَل — بانتظار قرار الطرف الآخر
  | 'accepted'      // ② مقبول — التواصل مع الإدارة + تأكيد 500 ريال
  | 'coordinating'  // ③ قيد التنسيق — الإدارة تتابع الطرفين
  | 'closed';       // ④ منتهٍ — نتيجة + حالة الرسوم

export type JourneyTerminal = 'declined' | 'cancelled';
export type JourneyState = JourneyStage | JourneyTerminal;

export const JOURNEY_STAGES: JourneyStage[] = [
  'sent', 'accepted', 'coordinating', 'closed',
];

export const STAGE_INDEX: Record<JourneyStage, number> = {
  sent: 0, accepted: 1, coordinating: 2, closed: 3,
};

// ===== حالة رسوم 500 ريال لكل طرف =====
export type DepositStatus =
  | 'not_paid'       // لم يُدفع بعد
  | 'pending_review' // إيصال مرفوع وتحت المراجعة
  | 'confirmed'      // مؤكد من الإدارة
  | 'exempted';      // معفى بقرار من الإدارة

// ===== حالة رسوم 2000 ريال المتبقية =====
export type FinalFeeStatus =
  | 'not_due'        // غير مستحق بعد (قبل تسليم المهر)
  | 'due'            // مستحق بعد تسليم المهر
  | 'pending_review' // إيصال مرفوع تحت المراجعة
  | 'paid'           // مدفوع ومؤكد
  | 'exempted';      // معفى

// ===== نتيجة إغلاق الرحلة =====
export type CloseReason =
  | 'match'               // توافق وزواج
  | 'no_match'            // لم يتوافقا
  | 'withdrawn_sender'    // انسحب المرسِل
  | 'withdrawn_receiver'  // انسحب المستقبِل
  | 'timeout'             // انتهى الوقت بدون متابعة
  | 'admin_closed';       // أغلقتها الإدارة لسبب آخر

// ===== معلومات كل مرحلة =====
export interface StageMeta {
  key: JourneyState;
  step: number;
  title: string;
  badge: string;
  icon: LucideIcon;
  accent: string;
  memberTitle: string;
  memberDesc: string;
  memberAction: string;
  memberWait: string;
}

export const STAGE_META: Record<JourneyState, StageMeta> = {
  sent: {
    key: 'sent', step: 1,
    title: 'بانتظار القبول', badge: 'بانتظار الرد',
    icon: Send, accent: 'amber',
    memberTitle: 'أرسلت طلب توافق',
    memberDesc: 'بانتظار رد الطرف الآخر. لا يوجد إجراء مطلوب منك الآن.',
    memberAction: 'وصلك طلب توافق — راجع الملف وقرر القبول أو الاعتذار.',
    memberWait: 'سنُشعرك فور رد الطرف الآخر.',
  },
  accepted: {
    key: 'accepted', step: 2,
    title: 'تم القبول', badge: 'تواصل مع الإدارة',
    icon: HeartHandshake, accent: 'emerald',
    memberTitle: 'تم قبول طلب التوافق',
    memberDesc: 'الخطوة التالية: التواصل مع إدارة توافق للمتابعة والتحقق من رسوم بدء الخدمة.',
    memberAction: 'تواصل مع الإدارة عبر واتساب لإكمال إجراءات رحلة التوافق.',
    memberWait: 'بانتظار استكمال متطلبات الطرف الآخر.',
  },
  coordinating: {
    key: 'coordinating', step: 3,
    title: 'قيد التنسيق', badge: 'تنسيق الإدارة',
    icon: Clock, accent: 'blue',
    memberTitle: 'الطلب قيد المتابعة مع الإدارة',
    memberDesc: 'الإدارة تتابع متطلبات الطرفين وتنسّق الخطوات التالية.',
    memberAction: 'تواصل مع الإدارة لأي استفسار أو تحديث.',
    memberWait: 'بانتظار استكمال متطلبات الطرف الآخر.',
  },
  closed: {
    key: 'closed', step: 4,
    title: 'منتهية', badge: 'النتيجة',
    icon: CheckCircle, accent: 'slate',
    memberTitle: 'انتهت رحلة التوافق',
    memberDesc: 'تم إغلاق هذه الرحلة.',
    memberAction: '',
    memberWait: '',
  },
  declined: {
    key: 'declined', step: -1,
    title: 'تم الاعتذار', badge: 'منتهٍ',
    icon: XCircle, accent: 'rose',
    memberTitle: 'انتهت الرحلة باعتذار',
    memberDesc: 'الزواج قسمة ونصيب. يمكنك التصفّح وإرسال طلبات جديدة.',
    memberAction: '',
    memberWait: '',
  },
  cancelled: {
    key: 'cancelled', step: -1,
    title: 'ملغى', badge: 'مؤرشف',
    icon: Ban, accent: 'slate',
    memberTitle: 'تم إلغاء هذا الطلب',
    memberDesc: 'يمكنك إرسال طلب توافق جديد في أي وقت.',
    memberAction: '',
    memberWait: '',
  },
};

export const CLOSE_REASON_LABELS: Record<CloseReason, string> = {
  match: '🎉 تم التوافق بفضل الله',
  no_match: 'لم يحصل توافق',
  withdrawn_sender: 'انسحب مُرسِل الطلب',
  withdrawn_receiver: 'انسحب مستقبِل الطلب',
  timeout: 'انتهى وقت المتابعة',
  admin_closed: 'أغلقتها الإدارة',
};

export const DEPOSIT_STATUS_LABELS: Record<DepositStatus, { label: string; color: string }> = {
  not_paid:       { label: 'غير مدفوعة', color: 'text-rose-600' },
  pending_review: { label: 'تحت المراجعة', color: 'text-amber-600' },
  confirmed:      { label: 'مؤكدة ✓', color: 'text-emerald-600' },
  exempted:       { label: 'معفى', color: 'text-blue-600' },
};

export const FINAL_FEE_STATUS_LABELS: Record<FinalFeeStatus, { label: string; color: string }> = {
  not_due:        { label: 'غير مستحقة بعد', color: 'text-slate-500' },
  due:            { label: 'مستحقة — بانتظار تسليم المهر', color: 'text-amber-600' },
  pending_review: { label: 'إيصال تحت المراجعة', color: 'text-amber-600' },
  paid:           { label: 'مدفوعة ✓', color: 'text-emerald-600' },
  exempted:       { label: 'معفى', color: 'text-blue-600' },
};

export const ACCENT_CLASSES: Record<string, {
  text: string; bg: string; bgSoft: string; border: string; ring: string;
}> = {
  amber:   { text: 'text-amber-700',   bg: 'bg-amber-500',   bgSoft: 'bg-amber-50',   border: 'border-amber-200',   ring: 'ring-amber-200' },
  emerald: { text: 'text-emerald-700', bg: 'bg-emerald-500', bgSoft: 'bg-emerald-50', border: 'border-emerald-200', ring: 'ring-emerald-200' },
  blue:    { text: 'text-blue-700',    bg: 'bg-blue-500',    bgSoft: 'bg-blue-50',    border: 'border-blue-200',    ring: 'ring-blue-200' },
  slate:   { text: 'text-slate-600',   bg: 'bg-slate-500',   bgSoft: 'bg-slate-50',   border: 'border-slate-200',   ring: 'ring-slate-200' },
  rose:    { text: 'text-rose-700',    bg: 'bg-rose-500',    bgSoft: 'bg-rose-50',    border: 'border-rose-200',    ring: 'ring-rose-200' },
};

// ===== توافق رجعي مع المراحل القديمة =====
export function legacyToJourneyV2(stage: string): JourneyState {
  switch (stage) {
    case 'pending': case 'sent': return 'sent';
    case 'accepted': case 'accepted_pending_admin': case 'accepted_pending_payment': return 'accepted';
    case 'seriousness': case 'paid': return 'accepted';
    case 'coordination': case 'in_mediation': return 'coordinating';
    case 'sharia_viewing': case 'introduction': return 'coordinating';
    case 'engagement': return 'coordinating';
    case 'completed': return 'closed';
    case 'coordinating': return 'coordinating';
    case 'closed': return 'closed';
    case 'declined': return 'declined';
    case 'cancelled': return 'cancelled';
    default: return 'sent';
  }
}

// للتوافق الرجعي — يُصدَّر تحت الاسم القديم أيضاً
export const legacyToJourney = legacyToJourneyV2;

export type RequestRole = 'sender' | 'receiver';

export function isTerminal(stage: JourneyState): stage is JourneyTerminal {
  return stage === 'declined' || stage === 'cancelled';
}

export function getJourneyStageV2(journeyStage: string): JourneyState {
  const validStages: JourneyState[] = ['sent', 'accepted', 'coordinating', 'closed', 'declined', 'cancelled'];
  return validStages.includes(journeyStage as JourneyState)
    ? (journeyStage as JourneyState)
    : legacyToJourneyV2(journeyStage);
}

export const DECLINE_REASONS = [
  'عدم توافق في المواصفات الأساسية.',
  'الفارق في العمر كبير.',
  'الحالة الاجتماعية غير مناسبة.',
  'عدم توافق في الأهداف.',
  'المسافة الجغرافية كبيرة.',
  'سبب آخر.',
];

export const CANCEL_REASONS = [
  'لم أعد أرغب في إكمال هذا الطلب.',
  'تبيّن عدم التوافق.',
  'ظروف خاصة طرأت.',
  'سبب آخر.',
];

export const DEPOSIT_AMOUNT = 500;
export const FINAL_FEE_AMOUNT = 2000;
export const INQUIRY_PACKAGE_PRICE = 100;
export const INQUIRY_PACKAGE_CREDITS = 20;
export const INQUIRY_LOW_CREDITS = 3;

// ===== نوع بيانات طلب الرحلة المحدّثة (v2) =====
export interface JourneyRequestV2 {
  id: number;
  sender_id: string;
  receiver_id: string;
  journey_stage: string;
  message: string;
  created_at: string;
  updated_at: string;
  decline_reason?: string | null;
  cancel_reason?: string | null;
  admin_notes?: string | null;
  // رسوم 500 — مستقلة عن الطلب تُدار من الإدارة
  sender_deposit_status?: DepositStatus;
  receiver_deposit_status?: DepositStatus;
  sender_deposit_confirmed_at?: string | null;
  receiver_deposit_confirmed_at?: string | null;
  sender_deposit_confirmed_by?: string | null;
  receiver_deposit_confirmed_by?: string | null;
  sender_deposit_amount_paid?: number | null;  // مبلغ مدفوع فعلياً (جزئي أو كامل)
  receiver_deposit_amount_paid?: number | null;
  // رسوم 2000 — تستحق بعد تسليم المهر
  sender_final_fee_status?: FinalFeeStatus;
  receiver_final_fee_status?: FinalFeeStatus;
  sender_final_fee_paid_at?: string | null;
  receiver_final_fee_paid_at?: string | null;
  sender_final_fee_amount_paid?: number | null;  // مبلغ مدفوع فعلياً
  receiver_final_fee_amount_paid?: number | null;
  // نتيجة الإغلاق
  close_reason?: CloseReason | null;
  close_note?: string | null;
  closed_at?: string | null;
  closed_by?: string | null;
  // واتساب
  whatsapp_contacted_at?: string | null;
  // للتوافق الرجعي مع البيانات القديمة
  sender_paid?: boolean;
  receiver_paid?: boolean;
  sender_paid_at?: string | null;
  receiver_paid_at?: string | null;
  request_number?: number;
}
