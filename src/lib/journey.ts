// ============================================================
//  رحلة طلب التوافق v2 — نظام مبسّط (4 محطات رئيسية)
//  sent → accepted → coordinating → closed
//  مسارات جانبية: declined, cancelled
// ============================================================

import {
  Send, HeartHandshake, CalendarClock,
  CheckCircle2, XCircle, Ban, type LucideIcon,
} from 'lucide-react';

// ===== المراحل الرئيسية الأربع =====
export type JourneyStageV2 =
  | 'sent'          // ① مُرسَل — وصل الطلب للطرف الآخر بانتظار رده
  | 'accepted'      // ② مقبول — تم القبول، يُسدَّد العربون 500 ريال
  | 'coordinating'  // ③ تنسيق — بعد سداد الطرفين، تبادل التواصل
  | 'closed';       // ④ مُنهى — تمّ الزواج أو انتهت الرحلة

// ===== المساران الجانبيان =====
export type JourneyTerminal = 'declined' | 'cancelled';
export type JourneyState = JourneyStageV2 | JourneyTerminal;

// ===== ترتيب المراحل =====
export const JOURNEY_STAGES: JourneyStageV2[] = ['sent', 'accepted', 'coordinating', 'closed'];
export const STAGE_INDEX: Record<JourneyStageV2, number> = {
  sent: 0, accepted: 1, coordinating: 2, closed: 3,
};

// ===== حالة الإيداع (500 ريال) =====
export type DepositStatus = 'not_paid' | 'pending_review' | 'confirmed' | 'exempted';

// ===== حالة الرسوم النهائية (2000 ريال) =====
export type FinalFeeStatus = 'not_due' | 'due' | 'pending_review' | 'paid' | 'exempted';

// ===== سبب الإغلاق =====
export type CloseReason =
  | 'match'              // تم الزواج بفضل الله
  | 'no_match'           // لم يكتب النصيب
  | 'withdrawn_sender'   // انسحب المرسِل
  | 'withdrawn_receiver' // انسحب المستقبِل
  | 'timeout'            // انتهت المهلة
  | 'admin_closed';      // أغلقتها الإدارة

// ===== بيانات الطلب v2 =====
export interface JourneyRequestV2 {
  id: string;
  sender_id: string;
  receiver_id: string;
  journey_stage: JourneyState;
  created_at: string;
  updated_at?: string;

  // رسوم العربون (500 ريال) — تُدفع مرة واحدة لكل شخص
  sender_deposit_status?: DepositStatus;
  receiver_deposit_status?: DepositStatus;
  sender_deposit_amount_paid?: number;
  receiver_deposit_amount_paid?: number;

  // رسوم الخاتمة (2000 ريال) — تستحق بعد تسليم المهر
  sender_final_fee_status?: FinalFeeStatus;
  receiver_final_fee_status?: FinalFeeStatus;
  sender_final_fee_amount_paid?: number;
  receiver_final_fee_amount_paid?: number;

  // بيانات الإغلاق
  close_reason?: CloseReason;
  close_note?: string;

  // واتساب (يُسجَّل الوقت فقط، لا يغير المرحلة)
  whatsapp_contacted_at?: string;

  // معلومات التنسيق
  contact_info?: string | null;
  guardian_phone?: string | null;
  male_phone?: string | null;

  // أسباب الرفض/الإلغاء
  decline_reason?: string | null;
  cancel_reason?: string | null;

  // للتوافق مع البيانات القديمة
  sender_paid?: boolean;
  receiver_paid?: boolean;
  sender_paid_at?: string;
  receiver_paid_at?: string;
}

// ===== تعريف كل مرحلة =====
export interface StageMeta {
  key: JourneyState;
  step: number;
  title: string;
  badge: string;
  icon: LucideIcon;
  accent: string;
  whereYouAre: string;
  whatToDo: string;
  whatsNext: string;
}

export const STAGE_META: Record<JourneyState, StageMeta> = {
  sent: {
    key: 'sent', step: 1, title: 'بانتظار القبول', badge: 'بانتظار الرد',
    icon: Send, accent: 'gold',
    whereYouAre: 'تم إرسال طلبك بنجاح! الطرف الآخر يستلم إشعاراً وبانتظار قبوله.',
    whatToDo: 'لا تحتاج لفعل أي شيء حالياً — سنُخطرك فوراً عندما يقرر الطرف الآخر الرد.',
    whatsNext: 'إذا وافق الطرف الآخر، ينتقل الطلب إلى مرحلة سداد العربون.',
  },
  accepted: {
    key: 'accepted', step: 2, title: 'تم القبول بفضل الله', badge: 'خطوتك التالية',
    icon: HeartHandshake, accent: 'emerald',
    whereYouAre: 'تم قبول طلب التوافق بفضل الله. يسدّد كل طرف عربون الجدية 500 ريال.',
    whatToDo: 'أكمل سداد عربونك عبر تحويل للحساب البنكي، ثم أرسل إيصال السداد عبر واتساب.',
    whatsNext: 'بعد تأكيد الإدارة لسداد الطرفين، تبدأ مرحلة التنسيق.',
  },
  coordinating: {
    key: 'coordinating', step: 3, title: 'مرحلة التنسيق', badge: 'بقرارك أنت',
    icon: CalendarClock, accent: 'blue',
    whereYouAre: 'تم سداد العربون من الطرفين. يمكن لكل طرف مشاركة معلومات التواصل التي يختارها.',
    whatToDo: 'تواصل بالطريقة التي يناسبك، بعد انتهاء التنسيق يُبلّغ كل طرف الإدارة بالنتيجة.',
    whatsNext: 'إذا تم الاتفاق، تُسجَّل عملية تسليم المهر ثم تستحق رسوم الخاتمة (2000 ريال).',
  },
  closed: {
    key: 'closed', step: 4, title: 'مُنهاة', badge: 'اكتملت أو انتهت',
    icon: CheckCircle2, accent: 'emerald',
    whereYouAre: 'أُنهيت هذه الرحلة.',
    whatToDo: 'الرحلة مكتملة. بارك الله لكما وبارك عليكما وجمع بينكما في خير.',
    whatsNext: 'تم توثيق رحلتكما في المنصة.',
  },
  declined: {
    key: 'declined', step: -1, title: 'تم الاعتذار', badge: 'منتهٍ',
    icon: XCircle, accent: 'rose',
    whereYouAre: 'انتهت هذه الرحلة باعتذار لطيف. الزواج قسمة ونصيب.',
    whatToDo: 'لا تيأس! تصفّح أعضاء جدد وأرسل طلبات توافق جديدة.',
    whatsNext: 'يمكنك بدء رحلة جديدة مع عضو آخر في أي وقت.',
  },
  cancelled: {
    key: 'cancelled', step: -1, title: 'ملغى', badge: 'مؤرشف',
    icon: Ban, accent: 'slate',
    whereYouAre: 'تم إلغاء هذا الطلب.',
    whatToDo: 'يمكنك إرسال طلب توافق جديد لعضو آخر في أي وقت.',
    whatsNext: 'لا يلزمك أي إجراء. ابدأ بحثاً جديداً.',
  },
};

// ===== ألوان الـ accent =====
export const ACCENT_CLASSES: Record<string, {
  text: string; bg: string; bgSoft: string; border: string; ring: string; dot: string; line: string;
}> = {
  gold:    { text: 'text-amber-700',   bg: 'bg-amber-500',   bgSoft: 'bg-amber-50',   border: 'border-amber-200',   ring: 'ring-amber-200',   dot: 'bg-amber-500',   line: 'bg-amber-400' },
  emerald: { text: 'text-emerald-700', bg: 'bg-emerald-500', bgSoft: 'bg-emerald-50', border: 'border-emerald-200', ring: 'ring-emerald-200', dot: 'bg-emerald-500', line: 'bg-emerald-400' },
  blue:    { text: 'text-blue-700',    bg: 'bg-blue-500',    bgSoft: 'bg-blue-50',    border: 'border-blue-200',    ring: 'ring-blue-200',    dot: 'bg-blue-500',    line: 'bg-blue-400' },
  rose:    { text: 'text-rose-700',    bg: 'bg-rose-500',    bgSoft: 'bg-rose-50',    border: 'border-rose-200',    ring: 'ring-rose-200',    dot: 'bg-rose-500',    line: 'bg-rose-400' },
  slate:   { text: 'text-slate-600',   bg: 'bg-slate-500',   bgSoft: 'bg-slate-50',   border: 'border-slate-200',   ring: 'ring-slate-200',   dot: 'bg-slate-400',   line: 'bg-slate-300' },
  amber:   { text: 'text-amber-700',   bg: 'bg-amber-500',   bgSoft: 'bg-amber-50',   border: 'border-amber-200',   ring: 'ring-amber-200',   dot: 'bg-amber-500',   line: 'bg-amber-400' },
  indigo:  { text: 'text-indigo-700',  bg: 'bg-indigo-500',  bgSoft: 'bg-indigo-50',  border: 'border-indigo-200',  ring: 'ring-indigo-200',  dot: 'bg-indigo-500',  line: 'bg-indigo-400' },
};

// ===== الدور في الطلب =====
export type RequestRole = 'sender' | 'receiver';

// ===== دالة الحصول على المرحلة الفعلية =====
export function getJourneyStage(req: { journey_stage: string; sender_id: string }, currentUserId: string): JourneyState {
  const valid: JourneyState[] = ['sent', 'accepted', 'coordinating', 'closed', 'declined', 'cancelled'];
  if (valid.includes(req.journey_stage as JourneyState)) return req.journey_stage as JourneyState;
  return legacyToJourneyV2(req.journey_stage);
}

// ===== التوافق الرجعي مع البيانات القديمة =====
export function legacyToJourneyV2(status: string): JourneyState {
  switch (status) {
    case 'pending': return 'sent';
    case 'accepted':
    case 'accepted_pending_admin':
    case 'accepted_pending_payment': return 'accepted';
    case 'paid':
    case 'seriousness': return 'accepted';
    case 'in_mediation':
    case 'coordination':
    case 'sharia_viewing':
    case 'engagement': return 'coordinating';
    case 'completed': return 'closed';
    case 'declined': return 'declined';
    case 'cancelled': return 'cancelled';
    default: return 'sent';
  }
}

// للتوافق مع الكود القديم
export const legacyToJourney = legacyToJourneyV2;

export function isTerminal(stage: JourneyState): stage is JourneyTerminal {
  return stage === 'declined' || stage === 'cancelled';
}

// ===== ملخص الحالة للواجهة =====
export interface JourneyRequestLike {
  journey_stage: string;
  sender_id: string;
  receiver_id: string;
  sender_paid?: boolean;
  receiver_paid?: boolean;
  sender_deposit_status?: DepositStatus;
  receiver_deposit_status?: DepositStatus;
  decline_reason?: string | null;
  cancel_reason?: string | null;
  close_reason?: CloseReason;
  close_note?: string;
  guardian_phone?: string | null;
  contact_info?: string | null;
  male_phone?: string | null;
  male_pledged?: boolean;
  female_pledged?: boolean;
  sender_viewing_result?: 'success' | 'failed' | null;
  receiver_viewing_result?: 'success' | 'failed' | null;
}

export type TurnActor = 'me' | 'other' | 'both' | 'system' | 'none';
export type StatusTone = 'urgent' | 'waiting' | 'success' | 'neutral' | 'danger';

export interface JourneyStatusSummary {
  actor: TurnActor;
  actorLabel: string;
  tone: StatusTone;
  title: string;
  description: string;
  nextHint: string;
}

export function getJourneyStatusSummary(
  req: JourneyRequestLike,
  currentUserId: string,
  otherName = 'الطرف الآخر',
): JourneyStatusSummary {
  const stage = getJourneyStage(req, currentUserId);
  const isSender = req.sender_id === currentUserId;
  const role: RequestRole = isSender ? 'sender' : 'receiver';

  const myDepositStatus = isSender ? req.sender_deposit_status : req.receiver_deposit_status;
  const otherDepositStatus = isSender ? req.receiver_deposit_status : req.sender_deposit_status;
  const selfPaid = myDepositStatus === 'confirmed' || myDepositStatus === 'exempted'
    || (isSender ? !!req.sender_paid : !!req.receiver_paid);
  const otherPaid = otherDepositStatus === 'confirmed' || otherDepositStatus === 'exempted'
    || (isSender ? !!req.receiver_paid : !!req.sender_paid);

  if (stage === 'declined') {
    return {
      actor: 'none', actorLabel: 'منتهٍ', tone: 'danger',
      title: 'تم الاعتذار عن هذا الطلب',
      description: req.decline_reason ? `السبب: ${req.decline_reason}` : 'انتهت الرحلة باعتذار لطيف. الزواج قسمة ونصيب.',
      nextHint: 'لا تيأس — تصفّح أعضاء جدد وأرسل طلبات جديدة.',
    };
  }

  if (stage === 'cancelled') {
    return {
      actor: 'none', actorLabel: 'مؤرشف', tone: 'neutral',
      title: 'تم إلغاء هذا الطلب',
      description: req.cancel_reason ? `السبب: ${req.cancel_reason}` : 'أُلغي الطلب. يمكنك بدء طلب جديد متى شئت.',
      nextHint: 'ابدأ رحلة توافق جديدة في أي وقت.',
    };
  }

  if (stage === 'closed') {
    const isMatch = req.close_reason === 'match';
    return {
      actor: 'none', actorLabel: isMatch ? 'مكتمل ✅' : 'منتهٍ', tone: isMatch ? 'success' : 'neutral',
      title: isMatch ? '🎉 تم الزواج بفضل الله!' : 'انتهت الرحلة',
      description: req.close_note || (isMatch ? 'بارك الله لكما وبارك عليكما وجمع بينكما في خير.' : 'انتهت رحلة التوافق.'),
      nextHint: isMatch ? 'نسأل الله لكما التوفيق والسعادة الدائمة.' : 'يمكنك بدء رحلة جديدة في أي وقت.',
    };
  }

  if (stage === 'sent') {
    if (role === 'receiver') {
      return {
        actor: 'me', actorLabel: '🔔 الدور عليك الآن', tone: 'urgent',
        title: `وصلك طلب توافق من ${otherName}`,
        description: 'راجع الملف الشخصي، ثم اختر قبول الطلب أو الاعتذار باحترام.',
        nextHint: 'عند القبول تبدأ خطوة سداد العربون للطرفين.',
      };
    }
    return {
      actor: 'other', actorLabel: '⏳ بانتظار الطرف الآخر', tone: 'waiting',
      title: 'تم إرسال طلبك بنجاح',
      description: `بانتظار رد ${otherName}. لا يوجد إجراء مطلوب منك الآن.`,
      nextHint: 'سنرسل لك إشعاراً فور الرد.',
    };
  }

  if (stage === 'accepted') {
    if (!selfPaid) {
      return {
        actor: 'me', actorLabel: '💳 الدور عليك', tone: 'urgent',
        title: 'سداد العربون (500 ريال)',
        description: otherPaid
          ? `أكمل ${otherName} السداد. سدّد عربونك للانتقال إلى مرحلة التنسيق.`
          : 'حوّل 500 ريال للحساب البنكي ثم أرسل الإيصال للإدارة عبر واتساب.',
        nextHint: 'بعد تأكيد الإدارة لسداد الطرفين، تبدأ مرحلة التنسيق.',
      };
    }
    if (!otherPaid) {
      return {
        actor: 'other', actorLabel: '⏳ بانتظار الطرف الآخر', tone: 'waiting',
        title: '✅ تم استلام سدادك بنجاح!',
        description: `بانتظار ${otherName} ليسدّد عربونه. سنُخطرك فور التأكيد.`,
        nextHint: 'بعد سداد الطرفين تبدأ مرحلة التنسيق.',
      };
    }
    return {
      actor: 'system', actorLabel: '🔄 جارٍ المعالجة', tone: 'waiting',
      title: 'تم سداد الطرفين — بانتظار تأكيد الإدارة',
      description: 'ستتصل بك الإدارة قريباً للتأكيد والانتقال إلى مرحلة التنسيق.',
      nextHint: 'في انتظار تأكيد الإدارة.',
    };
  }

  if (stage === 'coordinating') {
    return {
      actor: 'both', actorLabel: 'مرحلة التنسيق', tone: 'urgent',
      title: 'تنسيق التواصل',
      description: 'تواصل مع الطرف الآخر بالطريقة التي تناسبك، ثم أبلغ الإدارة بالنتيجة.',
      nextHint: 'إذا تم الاتفاق، تُسجَّل عملية المهر وتستحق رسوم الخاتمة (2000 ريال).',
    };
  }

  return {
    actor: 'system', actorLabel: 'متابعة', tone: 'neutral',
    title: STAGE_META[stage].title,
    description: STAGE_META[stage].whereYouAre,
    nextHint: STAGE_META[stage].whatsNext,
  };
}

export function requiresMyAction(
  stage: JourneyState,
  role: RequestRole,
  ctx: { selfPaid?: boolean } = {},
): boolean {
  switch (stage) {
    case 'sent': return role === 'receiver';
    case 'accepted': return !ctx.selfPaid;
    case 'coordinating': return true;
    default: return false;
  }
}

export function actionUrgency(
  stage: JourneyState,
  role: RequestRole,
  ctx: { selfPaid?: boolean } = {},
): 'pay' | 'respond' | 'continue' | null {
  if (!requiresMyAction(stage, role, ctx)) return null;
  if (stage === 'sent' && role === 'receiver') return 'respond';
  if (stage === 'accepted' && !ctx.selfPaid) return 'pay';
  return 'continue';
}

// ===== إجراء الحالة الأساسي =====
export interface PrimaryAction {
  type: 'accept_decline' | 'open_journey' | 'pay_deposit' | 'view_coordination' | 'record_result' | 'none';
  label: string;
  hint: string;
}

export function getPrimaryAction(
  stage: JourneyState,
  role: RequestRole,
  ctx: { selfPaid?: boolean; otherPaid?: boolean } = {},
): PrimaryAction {
  switch (stage) {
    case 'sent':
      return role === 'receiver'
        ? { type: 'accept_decline', label: 'الرد على الطلب', hint: 'اقبل الطلب أو اعتذر بلطف' }
        : { type: 'none', label: 'بانتظار الرد', hint: 'سنُشعرك فور رد الطرف الآخر' };
    case 'accepted':
      if (ctx.selfPaid) return { type: 'none', label: 'بانتظار سداد الطرف الآخر', hint: 'أكملت السداد ✓' };
      return { type: 'pay_deposit', label: 'سداد العربون (500 ريال)', hint: 'حوّل المبلغ وأرسل الإيصال' };
    case 'coordinating':
      return { type: 'view_coordination', label: 'متابعة التنسيق', hint: 'تواصل وأبلغ الإدارة بالنتيجة' };
    case 'closed':
      return { type: 'none', label: 'اكتملت الرحلة', hint: 'نسأل الله التوفيق' };
    default:
      return { type: 'none', label: '', hint: '' };
  }
}

// ===== الثوابت المالية =====
export const DEPOSIT_AMOUNT = 500;
export const FINAL_FEE_AMOUNT = 2000;
export const INQUIRY_PACKAGE_PRICE = 100;
export const INQUIRY_PACKAGE_CREDITS = 20;
export const INQUIRY_LOW_CREDITS = 3;

// ===== أسباب الاعتذار =====
export const DECLINE_REASONS = [
  'عدم توافق في المواصفات الأساسية المطلوبة.',
  'الفارق في العمر كبير جداً.',
  'الحالة الاجتماعية غير مناسبة.',
  'عدم توافق في الأهداف وتطلعات شريك الحياة.',
  'المسافة الجغرافية بين المدن كبيرة.',
  'سبب آخر.',
];

// ===== أسباب الإلغاء =====
export const CANCEL_REASONS = [
  'لم يعد لدي رغبة في إكمال هذا الطلب.',
  'تبيّن عدم التوافق بعد الاستفسار.',
  'ظروف خاصة طرأت.',
  'سبب آخر.',
];

// ===== أسباب الإغلاق الإداري =====
export const CLOSE_REASON_LABELS: Record<CloseReason, string> = {
  match: '🎉 تم الزواج بفضل الله',
  no_match: 'لم يكتب النصيب',
  withdrawn_sender: 'انسحب المرسِل',
  withdrawn_receiver: 'انسحب المستقبِل',
  timeout: 'انتهت المهلة',
  admin_closed: 'إغلاق إداري',
};
