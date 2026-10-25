import { displayStage, workflowOf, partyBalance, type JourneyWorkflow } from './journeyWorkflow';
// ============================================================
//  رحلة طلب التوافق — نظام موحّد (Single Source of Truth)
//  يستبدل: RequestStatus + MediationStage + coordinationStep
//  مقياس واحد للتقدّم = journeyStage
// ============================================================

import {
  Send, HeartHandshake, ShieldCheck, CalendarClock,
  Users, PartyPopper, XCircle, Ban, Eye, Gem, type LucideIcon,
} from 'lucide-react';

// ===== مراحل الرحلة (المسار الرئيسي) =====
export type JourneyStage =
  | 'sent'           // ① مُرسَل — وصل الطلب للطرف الآخر بانتظار رده
  | 'accepted'       // ② مقبول — رسوم الجدية
  | 'seriousness'    // ③ العربون — سداد ٥٠٠ ريال من كل طرف
  | 'coordination'   // ④ التواصل — يشارك كل طرف بياناته باختياره
  | 'sharia_viewing' // ⑤ نتيجة النظرة الشرعية — قرار مستقل من كل طرف
  | 'engagement'     // ⑥ تسليم المهر — سداد المتبقي من كل طرف
  | 'completed';     // ⑦ مكتمل — النتيجة النهائية

// ===== المساران الجانبيان =====
export type JourneyTerminal = 'declined' | 'cancelled';

export type JourneyState = JourneyStage | JourneyTerminal;

// ===== ترتيب المراحل الرئيسية =====
export const JOURNEY_STAGES: JourneyStage[] = [
  'sent', 'accepted', 'coordination', 'engagement', 'completed',
];

export const STAGE_INDEX: Record<JourneyStage, number> = {
  sent: 0, accepted: 1, seriousness: 1, coordination: 2, sharia_viewing: 3, engagement: 3, completed: 4,
};

// ===== تعريف كل مرحلة (عنوان + وصف + أيقونة + لون + إجراء + شرح منبثق) =====
export interface StageMeta {
  key: JourneyState;
  step: number;            // رقم الخطوة (1..6) أو -1 للمسارات الجانبية
  title: string;           // العنوان المختصر للـ Stepper
  badge: string;           // نص الشارة
  icon: LucideIcon;
  accent: string;          // لون مميّز (tailwind text/bg base)
  // محتوى البطاقة المنبثقة:
  whereYouAre: string;     // أين أنت الآن
  whatToDo: string;        // ماذا تفعل الآن
  whatsNext: string;       // ما المرحلة التالية
}

const meta = (key: JourneyState, step: number, title: string, icon: LucideIcon, accent: string, whereYouAre: string, whatToDo: string, whatsNext: string): StageMeta => ({ key, step, title, badge: title, icon, accent, whereYouAre, whatToDo, whatsNext });
export const STAGE_META: Record<JourneyState, StageMeta> = {
  sent: meta('sent', 1, 'طلب التوافق', Send, 'gold', 'الطلب بانتظار القبول أو الاعتذار.', 'يرد صاحب الحساب، وللملف المستورد تتابع الإدارة القرار مع الخطّابة وصاحب البيانات.', 'الموافقة المبدئية والسداد.'),
  accepted: meta('accepted', 2, 'الموافقة المبدئية والسداد', HeartHandshake, 'emerald', 'تمت الموافقة المبدئية بين الطرفين.', 'تواصل مع الإدارة عبر واتساب لسداد الدفعة الأولى. تسجّل الإدارة المبلغ المستلم فعلياً، ولو كان جزئياً.', 'تبدأ الإدارة التنسيق بعد مراجعة وضع الطرفين.'),
  seriousness: meta('seriousness', 2, 'الموافقة المبدئية والسداد', ShieldCheck, 'amber', 'متابعة الدفعة الأولى عبر الإدارة.', 'تواصل عبر واتساب؛ لا يعتمد الإيصال وحده دون التحقق من وصول المبلغ.', 'التنسيق بقرار إداري، وليس تلقائياً بمجرد الدفع.'),
  coordination: meta('coordination', 3, 'التنسيق وتبادل بيانات أولياء الأمور', CalendarClock, 'blue', 'جارٍ التنسيق وتبادل معلومات التواصل مع أولياء الأمور عبر الإدارة.', 'تابع عبر واتساب الإدارة. لا تُشارك بيانات التواصل إلا بالموافقات اللازمة.', 'متابعة الخطبة والمهر.'),
  sharia_viewing: meta('sharia_viewing', 4, 'الخطبة والمهر', Users, 'indigo', 'متابعة نتيجة التعارف والخطبة عبر الإدارة.', 'أبلغ الإدارة بالمستجدات عبر واتساب.', 'تأكيد تسليم المهر واستكمال المتبقي.'),
  engagement: meta('engagement', 4, 'الخطبة والمهر', Gem, 'gold', 'تتابع الإدارة الخطبة وتسليم المهر عبر واتساب.', 'عند تأكيد تسليم المهر يستحق المتبقي: إجمالي الرسوم ناقص الدفعات المؤكدة.', 'تسجيل نتيجة الزواج بصورة مستقلة عن السداد.'),
  completed: meta('completed', 5, 'نتيجة الزواج', PartyPopper, 'emerald', 'تابع النتيجة التي أكّدتها الإدارة.', 'تسجيل اكتمال المرحلة لا يثبت الزواج دون تأكيد مستقل.', 'تبقى المستحقات والسجلات محفوظة.'),
  declined: meta('declined', -1, 'تم الاعتذار', XCircle, 'rose', 'انتهى الطلب باعتذار.', 'تواصل مع الإدارة لأي متابعة مالية أو تصحيح.', 'يمكنك بدء طلب آخر.'),
  cancelled: meta('cancelled', -1, 'ملغى', Ban, 'slate', 'توقفت إجراءات هذا الطلب.', 'المبالغ والسجل لا تُحذف عند الإغلاق.', 'يمكن للإدارة إعادة فتح الطلب مع توثيق السبب.'),
};

// ===== ألوان كل accent (للـ Tailwind — صريحة كي لا يُحذفها الـ purge) =====
export const ACCENT_CLASSES: Record<string, {
  text: string; bg: string; bgSoft: string; border: string; ring: string; dot: string; line: string;
}> = {
  gold:    { text: 'text-amber-700',  bg: 'bg-amber-500',   bgSoft: 'bg-amber-50',   border: 'border-amber-200',   ring: 'ring-amber-200',   dot: 'bg-amber-500',   line: 'bg-amber-400' },
  emerald: { text: 'text-emerald-700', bg: 'bg-emerald-500', bgSoft: 'bg-emerald-50', border: 'border-emerald-200', ring: 'ring-emerald-200', dot: 'bg-emerald-500', line: 'bg-emerald-400' },
  amber:   { text: 'text-amber-700',  bg: 'bg-amber-500',   bgSoft: 'bg-amber-50',   border: 'border-amber-200',   ring: 'ring-amber-200',   dot: 'bg-amber-500',   line: 'bg-amber-400' },
  blue:    { text: 'text-blue-700',    bg: 'bg-blue-500',    bgSoft: 'bg-blue-50',    border: 'border-blue-200',    ring: 'ring-blue-200',    dot: 'bg-blue-500',    line: 'bg-blue-400' },
  indigo:  { text: 'text-indigo-700',  bg: 'bg-indigo-500',  bgSoft: 'bg-indigo-50',  border: 'border-indigo-200',  ring: 'ring-indigo-200',  dot: 'bg-indigo-500',  line: 'bg-indigo-400' },
  rose:    { text: 'text-rose-700',    bg: 'bg-rose-500',    bgSoft: 'bg-rose-50',    border: 'border-rose-200',    ring: 'ring-rose-200',    dot: 'bg-rose-500',    line: 'bg-rose-400' },
  slate:   { text: 'text-slate-600',   bg: 'bg-slate-500',   bgSoft: 'bg-slate-50',   border: 'border-slate-200',   ring: 'ring-slate-200',   dot: 'bg-slate-400',   line: 'bg-slate-300' },
};

// ===== الإجراء الأساسي الوحيد لكل مرحلة (Primary CTA) =====
// role: دور المستخدم الحالي في الطلب — مرسِل أو مستقبِل
export type RequestRole = 'sender' | 'receiver';

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
  if (stage === 'sent') return role === 'receiver'
    ? { type: 'accept_decline', label: 'الرد على الطلب', hint: 'قبول أو اعتذار' }
    : { type: 'none', label: 'بانتظار الرد', hint: 'تابع طلبك من الرحلة' };
  if (isTerminal(stage)) return { type: 'none', label: 'انتهى الطلب', hint: 'المتابعة مع الإدارة' };
  return { type: 'open_journey', label: 'متابعة الرحلة', hint: 'السداد والتنسيق عبر واتساب الإدارة' };
}

// ===== هل يتطلّب هذا الطلب إجراءً فورياً من المستخدم الحالي؟ =====
// يُستخدم لتمييز البطاقات بصرياً وترتيبها أولاً + لوحة الإحصائيات
export function requiresMyAction(
  stage: JourneyState,
  role: RequestRole,
  ctx: { selfPaid?: boolean; otherPaid?: boolean } = {},
): boolean {
  if (stage === 'sent') return role === 'receiver';
  return (stage === 'accepted' || stage === 'seriousness') && !ctx.selfPaid;
}

// تصنيف نوع الإجراء المطلوب (للون الشريط الجانبي والشارة)
export function actionUrgency(
  stage: JourneyState,
  role: RequestRole,
  ctx: { selfPaid?: boolean; otherPaid?: boolean } = {},
): 'pay' | 'respond' | 'continue' | null {
  if (!requiresMyAction(stage, role, ctx)) return null;
  if (stage === 'sent' && role === 'receiver') return 'respond';
  if (stage === 'seriousness' && !ctx.selfPaid) return 'pay';
  if (stage === 'accepted') return 'respond';
  return 'continue';
}

// ===== ربط الحالة القديمة بالمرحلة الجديدة (توافق رجعي مع البيانات القديمة) =====
export function legacyToJourney(status: string, mediationStage?: string): JourneyState {
  switch (status) {
    case 'pending': return 'sent';
    case 'accepted':
    case 'accepted_pending_admin':
    case 'accepted_pending_payment': return 'accepted';
    case 'paid': return 'seriousness';
    case 'in_mediation':
      if (mediationStage === 'evaluating') return 'sharia_viewing';
      if (mediationStage === 'exchanging') return 'coordination';
      return 'coordination';
    case 'introduction': return 'sharia_viewing';
    case 'sharia_viewing': return 'sharia_viewing';
    case 'engagement': return 'engagement';
    case 'completed': return 'completed';
    case 'declined': return 'declined';
    case 'cancelled': return 'cancelled';
    default: return 'sent';
  }
}

export function isTerminal(stage: JourneyState): stage is JourneyTerminal {
  return stage === 'declined' || stage === 'cancelled';
}

// ===== أدوات موحّدة لحساب المرحلة، الدور الحالي، والنص الواضح للواجهة =====
export interface JourneyRequestLike {
  workflow?: JourneyWorkflow;
  created_at?: string;
  sender_final_paid?: boolean;
  receiver_final_paid?: boolean;
  journey_stage: string;
  sender_id: string;
  receiver_id: string;
  sender_paid?: boolean;
  receiver_paid?: boolean;
  sender_viewing_result?: 'success' | 'failed' | null;
  receiver_viewing_result?: 'success' | 'failed' | null;
  guardian_phone?: string | null;
  contact_info?: string | null;
  male_phone?: string | null;
  male_pledged?: boolean;
  female_pledged?: boolean;
  decline_reason?: string | null;
  cancel_reason?: string | null;
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

const VALID_STAGES: JourneyState[] = ['sent', 'accepted', 'seriousness', 'coordination', 'sharia_viewing', 'engagement', 'completed', 'declined', 'cancelled'];

export function getJourneyStage(req: JourneyRequestLike, currentUserId: string): JourneyState {
  const baseStage = VALID_STAGES.includes(req.journey_stage as JourneyState)
    ? (req.journey_stage as JourneyState)
    : legacyToJourney(req.journey_stage);

  return displayStage(baseStage) as JourneyState;
}

export function getJourneyStatusSummary(
  req: JourneyRequestLike,
  currentUserId: string,
  otherName = 'الطرف الآخر',
): JourneyStatusSummary {
  const stage = getJourneyStage(req, currentUserId);
  const w = workflowOf(req);
  const party = req.sender_id === currentUserId ? 'sender' : 'receiver';
  const b = partyBalance(req, party);
  const result: JourneyStatusSummary = { actor: 'system', actorLabel: 'المتابعة عبر الإدارة', tone: 'waiting', title: STAGE_META[stage].title, description: STAGE_META[stage].whereYouAre, nextHint: STAGE_META[stage].whatsNext };
  if (stage === 'sent') return { ...result, actor: party === 'receiver' ? 'me' : 'other', actorLabel: party === 'receiver' ? 'بانتظار قرارك' : 'بانتظار الرد', tone: party === 'receiver' ? 'urgent' : 'waiting', title: party === 'receiver' ? `وصلك طلب توافق من ${otherName}` : 'تم إرسال طلبك', description: 'القبول مبدئي ولا يضمن الخطبة أو الزواج.' };
  if (stage === 'accepted') return { ...result, title: 'تمت الموافقة المبدئية بين الطرفين', description: b.review ? 'تراجع الإدارة الرصيد السابق قبل تحديد المطلوب منك. تواصل معها عبر واتساب.' : b.paid > 0 ? 'تم تسجيل دفعتك؛ تتابع الإدارة وضع الطرفين لبدء التنسيق.' : 'تواصل مع الإدارة عبر واتساب لسداد الدفعة الأولى واستكمال تنسيق التواصل.', nextHint: 'الانتقال إلى التنسيق باعتماد الإدارة.' };
  if (stage === 'engagement') return { ...result, title: w.mahrConfirmed ? 'تم تأكيد تسليم المهر' : w.engagementConfirmed ? 'تمت الخطبة — بانتظار تأكيد تسليم المهر' : 'جارٍ متابعة الخطبة والمهر', description: w.mahrConfirmed && !b.review ? `المتبقي من رسوم المنصة: ${b.remaining} ريال. المتابعة والسداد عبر واتساب الإدارة.` : 'تتابع الإدارة المستجدات عبر واتساب وتوثّقها هنا.' };
  if (stage === 'completed') return { ...result, tone: w.outcome === 'married' ? 'success' : 'neutral', title: ({ pending: 'بانتظار تأكيد نتيجة الزواج', married: 'تم تأكيد الزواج — بارك الله لكما', not_completed: 'لم تكتمل إجراءات الزواج', stopped: 'توقفت المتابعة', unconfirmed: 'تعذّر تأكيد النتيجة' })[w.outcome], description: 'نتيجة الزواج مستقلة عن اكتمال سداد رسوم المنصة.' };
  return result;
}

// ===== رسوم السعي =====
export const DEPOSIT_AMOUNT = 500;
export const FINAL_FEE_AMOUNT = 2000;

// ===== أسباب الاعتذار الجاهزة =====
export const DECLINE_REASONS = [
  'عدم توافق في المواصفات الأساسية المطلوبة.',
  'الفارق في العمر كبير جداً.',
  'الحالة الاجتماعية غير مناسبة.',
  'عدم توافق في الأهداف وتطلعات شريك الحياة.',
  'المسافة الجغرافية بين المدن كبيرة.',
  'سبب آخر.',
];

// ===== أسباب إلغاء الطلب الجاهزة =====
export const CANCEL_REASONS = [
  'لم يعد لدي رغبة في إكمال هذا الطلب.',
  'تبيّن عدم التوافق بعد مراجعة التفاصيل.',
  'ظروف خاصة طرأت.',
  'سبب آخر.',
];
