/** WhatsApp-administered journeys. Pure calculations; no payment processing or network calls. */
export type Party = 'sender' | 'receiver';
export type JourneyOutcome = 'pending' | 'married' | 'not_completed' | 'stopped' | 'unconfirmed';
export interface JourneyPayment {
  id: string; party: Party; amount: number; at: string; recordedAt: string;
  reference: string; by: string; reason: string; kind: 'payment' | 'correction'; correctionOf?: string;
}
export interface JourneyAudit {
  id: string; at: string; by: string; action: string; reason: string;
  before: string; after: string;
}
export interface JourneyWorkflow {
  version: 3; totalFee: number; initialTarget: number;
  payments: JourneyPayment[];
  consents: Record<Party, boolean>; contactShared: boolean; contactSharedAt: string;
  contactRecipient: string; decisionSource: string; engagementConfirmed: boolean;
  mahrConfirmed: boolean; mahrConfirmedAt: string; outcome: JourneyOutcome;
  assignedTo: string; nextAction: string; nextDueAt: string; adminNotes: string;
  audit: JourneyAudit[];
}
export const FLOW_STAGES = ['sent', 'accepted', 'coordination', 'engagement', 'completed'] as const;
export const FLOW_LABELS: Record<string, string> = {
  sent: 'طلب التوافق', accepted: 'الموافقة المبدئية والسداد', seriousness: 'الموافقة المبدئية والسداد',
  coordination: 'التنسيق وتبادل بيانات أولياء الأمور', sharia_viewing: 'الخطبة والمهر',
  engagement: 'الخطبة والمهر', completed: 'نتيجة الزواج', declined: 'تم الاعتذار', cancelled: 'ملغى',
};
export function displayStage(stage: string): string {
  return stage === 'seriousness' ? 'accepted' : stage === 'sharia_viewing' ? 'engagement' : (FLOW_LABELS[stage] ? stage : 'sent');
}
export const money = (n: number) => Math.round(n * 100) / 100;
const validAmount = (v: unknown, fallback: number) => typeof v === 'number' && Number.isFinite(v) && v >= 0 ? money(v) : fallback;
export function createWorkflow(total = 2500, initial = 500): JourneyWorkflow {
  total = validAmount(total, 2500); initial = Math.min(total, validAmount(initial, 500));
  return { version: 3, totalFee: total, initialTarget: initial, payments: [],
    consents: { sender: false, receiver: false }, contactShared: false, contactSharedAt: '', contactRecipient: '',
    decisionSource: '', engagementConfirmed: false, mahrConfirmed: false, mahrConfirmedAt: '', outcome: 'pending',
    assignedTo: '', nextAction: '', nextDueAt: '', adminNotes: '', audit: [] };
}
/** Old journeys are deliberately not migrated after the authorized clean start. */
export function workflowOf(req: any): JourneyWorkflow {
  return req.workflow?.version === 3 ? req.workflow : createWorkflow();
}
export function partyBalance(req: any, party: Party) {
  const w = workflowOf(req);
  const paid = money(w.payments.filter(p => p.party === party).reduce((sum, p) => sum + p.amount, 0));
  return { total: w.totalFee, initial: w.initialTarget, paid, remaining: money(Math.max(0, w.totalFee - paid)),
    excess: money(Math.max(0, paid - w.totalFee)), review: false };
}
export function whatsappJourneyUrl(number: string, id: number): string | null {
  const digits = String(number || '').replace(/[^0-9]/g, '');
  if (!/^[1-9][0-9]{6,14}$/.test(digits) || !Number.isSafeInteger(id) || id < 1) return null;
  return 'https://wa.me/' + digits + '?text=' + encodeURIComponent('مرحباً، أود متابعة السداد والتنسيق لطلب التوافق رقم ' + id);
}
/** Validates an admin command on a detached copy; failed commands never mutate stored data. */
export function applyAdminJourneyCommand(original: any, action: string, payload: any, by: string, now: string, token: string) {
  const req = JSON.parse(JSON.stringify(original));
  const w = req.workflow = JSON.parse(JSON.stringify(workflowOf(req))) as JourneyWorkflow;
  const reason = String(payload.note || '').trim();
  const fail = (error: string) => ({ ok: false as const, error });
  if (!reason) return fail('سبب التعديل أو مصدر التأكيد مطلوب');
  const before = JSON.stringify({ stage: req.journey_stage, frozen: !!req.frozen, workflow: { ...w, audit: [] }, meeting_date: req.meeting_date, meeting_notes: req.meeting_notes });
  if (w.audit.some(a => a.id === token)) return { ok: true as const, data: original, duplicate: true };
  if (action === 'set_stage' || action === 'reactivate') {
    if (!FLOW_LABELS[payload.stage]) return fail('مرحلة غير صالحة');
    req.journey_stage = displayStage(payload.stage);
    if (['sent', 'accepted', 'declined', 'cancelled'].includes(req.journey_stage) || payload.decisionSource) w.decisionSource = String(payload.decisionSource || w.decisionSource || reason);
    if (action === 'reactivate') req.frozen = false;
    if (payload.stage === 'declined') req.decline_reason = reason;
    if (payload.stage === 'cancelled') req.cancel_reason = reason;
    // Stage override intentionally does NOT create payments, mahr, consent or a marriage outcome.
  } else if (action === 'freeze_request' || action === 'unfreeze_request') {
    req.frozen = action === 'freeze_request'; req.frozen_reason = reason; req.frozen_at = now;
  } else if (action === 'admin_record_payment') {
    const party: Party = payload.party;
    if (party !== 'sender' && party !== 'receiver') return fail('الطرف غير صالح');
    const amount = Number(payload.amount), reference = String(payload.reference || '').trim();
    if (!Number.isFinite(amount) || amount <= 0 || money(amount) !== amount) return fail('أدخل مبلغاً موجباً بدقة هللتين كحد أقصى');
    if (!reference) return fail('مرجع التحويل مطلوب لمنع تكرار تسجيل الدفعة');
    if (w.payments.some(p => p.reference.toLowerCase() === reference.toLowerCase())) return fail('مرجع التحويل مسجل لهذا الطلب بالفعل');
    if (amount > partyBalance(req, party).remaining) return fail('المبلغ أكبر من المتبقي؛ راجع المبلغ قبل التسجيل');
    const at = String(payload.at || now);
    if (!Number.isFinite(Date.parse(at)) || Date.parse(at) > Date.parse(now) + 86400000) return fail('تاريخ الدفعة غير صالح');
    w.payments.push({ id: token, party, amount, at, recordedAt: now, reference, by, reason, kind: 'payment' });
  } else if (action === 'admin_correct_payment') {
    const entry = w.payments.find(p => p.id === payload.paymentId && p.kind !== 'correction');
    if (!entry) return fail('الدفعة غير موجودة');
    const current = money(entry.amount + w.payments.filter(p => p.correctionOf === entry.id).reduce((s, p) => s + p.amount, 0));
    const desired = Number(payload.amount);
    if (!Number.isFinite(desired) || desired < 0 || money(desired) !== desired) return fail('مبلغ التصحيح غير صالح');
    const delta = money(desired - current);
    if (!delta) return fail('لم يتغير مبلغ الدفعة');
    const newPaid = money(partyBalance(req, entry.party).paid + delta);
    if (newPaid < 0 || newPaid > w.totalFee) return fail('التصحيح يتجاوز إجمالي الرسوم أو يجعل المدفوع سالباً');
    w.payments.push({ id: token, party: entry.party, amount: delta, at: now, recordedAt: now, reference: 'تصحيح-' + token, by, reason, kind: 'correction', correctionOf: entry.id });
  } else if (action === 'admin_update_workflow') {
    const fields = payload.fields || {};
    for (const key of ['assignedTo', 'nextAction', 'nextDueAt', 'adminNotes', 'decisionSource', 'contactRecipient', 'contactSharedAt', 'mahrConfirmedAt'] as const) {
      if (fields[key] !== undefined) w[key] = String(fields[key]);
    }
    for (const key of ['engagementConfirmed', 'mahrConfirmed', 'contactShared'] as const) {
      if (fields[key] !== undefined) w[key] = !!fields[key];
    }
    if (fields.consents !== undefined) w.consents = { sender: !!fields.consents.sender, receiver: !!fields.consents.receiver };
    if (fields.outcome !== undefined) {
      if (!['pending', 'married', 'not_completed', 'stopped', 'unconfirmed'].includes(fields.outcome)) return fail('نتيجة غير صالحة');
      w.outcome = fields.outcome;
    }
    if (((fields.contactShared === true && !workflowOf(original).contactShared) || (w.contactShared && fields.contactRecipient !== undefined && fields.contactRecipient !== workflowOf(original).contactRecipient)) && (!w.consents.sender || !w.consents.receiver || !w.contactRecipient || !w.contactSharedAt)) return fail('وثّق موافقة الطرفين والجهة المستلمة وتاريخ المشاركة أولاً');
    if (w.mahrConfirmed && !w.mahrConfirmedAt) return fail('تاريخ تأكيد تسليم المهر مطلوب');
    for (const field of ['nextDueAt', 'contactSharedAt', 'mahrConfirmedAt'] as const) {
      if (w[field] && !Number.isFinite(Date.parse(w[field]))) return fail('تاريخ المتابعة أو التأكيد غير صالح');
    }
    if (fields.totalFee !== undefined || fields.initialTarget !== undefined) {
      const total = Number(fields.totalFee ?? w.totalFee), initial = Number(fields.initialTarget ?? w.initialTarget);
      if (!Number.isFinite(total) || !Number.isFinite(initial) || total < 0 || initial < 0 || initial > total || money(total) !== total || money(initial) !== initial) return fail('إعداد الرسوم غير صالح');
      w.totalFee = total; w.initialTarget = initial;
    }
    if (payload.meetingDate !== undefined) req.meeting_date = String(payload.meetingDate);
    if (payload.meetingNotes !== undefined) req.meeting_notes = String(payload.meetingNotes);
  } else return fail('هذا الإجراء القديم لم يعد متاحاً؛ استخدم إدارة الرحلة الموحدة');
  // Compatibility flags reflect money only, never drive an automatic stage transition.
  for (const party of ['sender', 'receiver'] as Party[]) {
    const balance = partyBalance(req, party);
    req[party + '_paid'] = !balance.review && balance.paid > 0;
    req[party + '_final_paid'] = !balance.review && balance.remaining === 0;
  }
  req.updated_at = now;
  const after = JSON.stringify({ stage: req.journey_stage, frozen: !!req.frozen, workflow: { ...w, audit: [] }, meeting_date: req.meeting_date, meeting_notes: req.meeting_notes });
  w.audit.push({ id: token, at: now, by, action, reason, before, after });
  return { ok: true as const, data: req };
}
