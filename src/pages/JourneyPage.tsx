import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, HeartHandshake, Clock, CheckCircle,
  XCircle, ChevronRight, ArrowRight, MessageCircle,
  AlertCircle, RefreshCw, User, CreditCard,
  CheckSquare, Ban, ChevronDown, ChevronUp,
  ExternalLink, Loader2,
} from 'lucide-react';
import { useApp } from '../lib/AppContext';
import {
  fetchRequest, fetchRequestEvents, fetchMembers,
  runActionStandalone, getCurrentUserId,
} from '../lib/useInterestRequests';
import type { ApiRequest, RequestEvent } from '../lib/useInterestRequests';
import {
  STAGE_META, ACCENT_CLASSES, DECLINE_REASONS, CANCEL_REASONS,
  DEPOSIT_STATUS_LABELS, FINAL_FEE_STATUS_LABELS,
  CLOSE_REASON_LABELS, DEPOSIT_AMOUNT, FINAL_FEE_AMOUNT,
  legacyToJourneyV2, isTerminal, getJourneyStageV2,
  type JourneyState, type DepositStatus, type FinalFeeStatus, type CloseReason,
} from '../lib/journey';
import { ADMIN_WHATSAPP_NUMBER } from '../lib/constants';

// ======================================================
//  صفحة رحلة التوافق v2 — واجهة مبسّطة وواضحة
// ======================================================

type Member = { id: string; nickname: string; gender: 'male' | 'female'; age?: number; city?: string; country?: string; verified?: boolean };

function buildWhatsappUrl(requestNumber: number | string, memberNickname: string): string {
  const msg = encodeURIComponent(`السلام عليكم، أرغب بمتابعة طلب التوافق رقم [طلب #${requestNumber}]، وقد تم قبوله مبدئيًا. أرجو توضيح الخطوة التالية والتحقق من حالة رسوم بدء الخدمة.`);
  return `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${msg}`;
}

// حالة السبات لكل طرف
function getDepositStatus(req: ApiRequest, isSender: boolean): DepositStatus {
  const paidField = isSender ? req.sender_paid : req.receiver_paid;
  const dsField = isSender ? (req as any).sender_deposit_status : (req as any).receiver_deposit_status;
  if (dsField) return dsField as DepositStatus;
  // توافق رجعي
  if (paidField) return 'confirmed';
  return 'not_paid';
}

function getFinalFeeStatus(req: ApiRequest, isSender: boolean): FinalFeeStatus {
  const fsField = isSender ? (req as any).sender_final_fee_status : (req as any).receiver_final_fee_status;
  if (fsField) return fsField as FinalFeeStatus;
  const finalPaid = isSender ? req.sender_final_paid : req.receiver_final_paid;
  if (finalPaid) return 'paid';
  const stage = getJourneyStageV2(req.journey_stage);
  if (stage === 'closed' && (req as any).close_reason === 'match') return 'due';
  return 'not_due';
}

// =====  شريط التقدم =====
function Stepper({ stage }: { stage: JourneyState }) {
  const steps = [
    { key: 'sent', label: 'الطلب' },
    { key: 'accepted', label: 'القبول' },
    { key: 'coordinating', label: 'التنسيق' },
    { key: 'closed', label: 'النتيجة' },
  ];
  const stageOrder: Record<string, number> = { sent: 0, accepted: 1, coordinating: 2, closed: 3 };
  const currentIdx = stageOrder[stage] ?? -1;
  const isTerminalStage = stage === 'declined' || stage === 'cancelled';

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, idx) => {
        const done = currentIdx > idx;
        const active = currentIdx === idx && !isTerminalStage;
        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${done ? 'bg-emerald-500 text-white' : active ? 'bg-navy-700 text-white ring-2 ring-navy-300' : isTerminalStage && idx === 0 ? 'bg-rose-400 text-white' : 'bg-slate-200 text-slate-400'}`}>
                {done ? <CheckCircle className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`text-[10px] font-cairo font-medium hidden sm:block
                ${active ? 'text-navy-700' : done ? 'text-emerald-600' : 'text-slate-400'}`}>
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`h-0.5 flex-1 mx-1 transition-all ${done ? 'bg-emerald-400' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ===== بطاقة حالة الرسوم =====
function FeeCard({
  depositStatus, depositAmountPaid,
  finalFeeStatus, finalFeeAmountPaid,
}: {
  depositStatus: DepositStatus;
  depositAmountPaid?: number | null;
  finalFeeStatus: FinalFeeStatus;
  finalFeeAmountPaid?: number | null;
}) {
  const [open, setOpen] = useState(false);
  const dInfo = DEPOSIT_STATUS_LABELS[depositStatus];
  const fInfo = FINAL_FEE_STATUS_LABELS[finalFeeStatus];

  const depositRemaining = DEPOSIT_AMOUNT - (depositAmountPaid || 0);
  const finalFeeRemaining = FINAL_FEE_AMOUNT - (finalFeeAmountPaid || 0);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-right"
      >
        <span className="font-cairo font-bold text-sm text-navy-800">رسوم خدمتك</span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-slate-100 pt-3">
              {/* 500 ريال */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-cairo font-semibold text-slate-700">500 ريال — رسوم بدء الخدمة</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">تُدفع مرة واحدة لكل شخص — لا تُطلب مجددًا إذا تم تأكيدها</p>
                  {depositAmountPaid != null && depositAmountPaid > 0 && depositAmountPaid < DEPOSIT_AMOUNT && (
                    <p className="text-[11px] text-amber-600 mt-0.5">مدفوع: {depositAmountPaid} ريال — المتبقي: {depositRemaining} ريال</p>
                  )}
                </div>
                <span className={`text-xs font-bold whitespace-nowrap ${dInfo.color}`}>{dInfo.label}</span>
              </div>
              {/* 2000 ريال */}
              <div className="flex items-start justify-between gap-3 pt-2 border-t border-slate-100">
                <div>
                  <p className="text-xs font-cairo font-semibold text-slate-700">2,000 ريال — الرسوم المتبقية</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">تُستحق بعد تسليم المهر فقط</p>
                  {finalFeeAmountPaid != null && finalFeeAmountPaid > 0 && finalFeeAmountPaid < FINAL_FEE_AMOUNT && (
                    <p className="text-[11px] text-amber-600 mt-0.5">مدفوع: {finalFeeAmountPaid} ريال — المتبقي: {finalFeeRemaining} ريال</p>
                  )}
                </div>
                <span className={`text-xs font-bold whitespace-nowrap ${fInfo.color}`}>{fInfo.label}</span>
              </div>
              <p className="text-[10px] text-slate-400 border-t border-slate-100 pt-2">
                رسوم بدء الخدمة تُدفع للشخص وليست للطلب. العضوية ورصيد الرسائل مستقلان عن رسوم رحلة التوافق.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ===== بطاقة الطرف الآخر المختصرة =====
function OtherPartyCard({ member, depositStatus }: { member?: Member; depositStatus: DepositStatus }) {
  const dInfo = DEPOSIT_STATUS_LABELS[depositStatus];
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
        <User className="w-5 h-5 text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-cairo font-bold text-sm text-navy-900 truncate">{member?.nickname || 'الطرف الآخر'}</p>
        {member?.city && <p className="text-xs text-slate-500">{member.city}</p>}
      </div>
      <div className="text-right">
        <p className="text-[10px] text-slate-400">رسوم 500 ريال</p>
        <p className={`text-xs font-bold ${dInfo.color}`}>{dInfo.label}</p>
      </div>
    </div>
  );
}

// ===== محتوى كل مرحلة =====
function StageContent({
  stage, isSender, req, otherMember, onAction, actionLoading,
}: {
  stage: JourneyState;
  isSender: boolean;
  req: ApiRequest;
  otherMember?: Member;
  onAction: (action: string, payload?: Record<string, any>) => Promise<void>;
  actionLoading: boolean;
}) {
  const [declining, setDeclining] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  const reqNum = (req as any).request_number || req.id;
  const whatsappUrl = buildWhatsappUrl(reqNum, otherMember?.nickname || '');

  const depositStatus = getDepositStatus(req, isSender);
  const finalFeeStatus = getFinalFeeStatus(req, isSender);
  const otherDepositStatus = getDepositStatus(req, !isSender);
  const depositAmountPaid = isSender ? (req as any).sender_deposit_amount_paid : (req as any).receiver_deposit_amount_paid;
  const finalFeeAmountPaid = isSender ? (req as any).sender_final_fee_amount_paid : (req as any).receiver_final_fee_amount_paid;

  // ① مُرسَل
  if (stage === 'sent') {
    if (!isSender) {
      // المستقبِل — لديه القرار
      return (
        <div className="space-y-5">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Send className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-cairo font-bold text-navy-900 mb-1">وصلك طلب توافق</h3>
                <p className="text-sm text-navy-600 font-tajawal leading-relaxed">
                  من <strong>{otherMember?.nickname || 'عضو'}</strong>.
                  راجع ملفه الشخصي جيدًا ثم اختر قبول الطلب أو الاعتذار باحترام.
                </p>
                <p className="text-xs text-amber-700 bg-amber-100 rounded-lg px-3 py-2 mt-3 font-tajawal">
                  ℹ️ القبول يعني الموافقة المبدئية على بدء إجراءات التوافق مع الإدارة، وليس التزامًا بالزواج.
                </p>
              </div>
            </div>
          </div>

          {!declining ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onAction('accept')}
                disabled={actionLoading}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-cairo font-bold py-3 rounded-2xl transition-all disabled:opacity-60"
              >
                {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <HeartHandshake className="w-5 h-5" />}
                قبول الطلب
              </button>
              <button
                onClick={() => setDeclining(true)}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-rose-200 text-rose-600 hover:bg-rose-50 font-cairo font-bold py-3 rounded-2xl transition-all"
              >
                <XCircle className="w-5 h-5" />
                اعتذار بلطف
              </button>
            </div>
          ) : (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-3">
              <p className="font-cairo font-bold text-rose-800">سبب الاعتذار (اختياري)</p>
              <div className="grid grid-cols-1 gap-2">
                {DECLINE_REASONS.map((r) => (
                  <button key={r} onClick={() => setDeclineReason(r)}
                    className={`text-right text-sm p-2.5 rounded-xl border transition-all font-tajawal
                      ${declineReason === r ? 'bg-rose-100 border-rose-400 text-rose-800 font-semibold' : 'border-rose-200 text-rose-700 hover:bg-rose-50'}`}>
                    {r}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button onClick={() => onAction('decline', { reason: declineReason || 'اعتذار لطيف' })}
                  disabled={actionLoading}
                  className="flex-1 bg-rose-500 text-white font-cairo font-bold py-2.5 rounded-xl hover:bg-rose-600 disabled:opacity-60 transition-all">
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'تأكيد الاعتذار'}
                </button>
                <button onClick={() => setDeclining(false)}
                  className="px-4 border border-rose-200 text-rose-600 rounded-xl font-cairo hover:bg-rose-50">
                  إلغاء
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
    // المرسِل — ينتظر
    return (
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-center">
        <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-7 h-7 text-amber-500" />
        </div>
        <h3 className="font-cairo font-bold text-navy-900 mb-2">تم إرسال طلبك بنجاح</h3>
        <p className="text-sm text-navy-600 font-tajawal">بانتظار رد {otherMember?.nickname || 'الطرف الآخر'}. سنُشعرك فوراً عند الرد.</p>
      </div>
    );
  }

  // ② مقبول
  if (stage === 'accepted') {
    return (
      <div className="space-y-5">
        {/* بطاقة الحدث */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <HeartHandshake className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-cairo font-bold text-emerald-800 mb-1">✅ تم قبول طلب التوافق</h3>
              <p className="text-sm text-emerald-700 font-tajawal leading-relaxed">
                الخطوة التالية: التواصل مع إدارة توافق لمراجعة الطلب والتحقق من رسوم بدء الخدمة.
              </p>
            </div>
          </div>
        </div>

        {/* زر واتساب الأساسي */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onAction('whatsapp_contacted')}
          className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#1fbc57] text-white font-cairo font-bold py-4 rounded-2xl transition-all shadow-md"
        >
          <MessageCircle className="w-6 h-6" />
          <span>التنسيق مع الإدارة عبر واتساب</span>
          <ExternalLink className="w-4 h-4 opacity-70" />
        </a>

        <p className="text-xs text-slate-400 text-center font-tajawal">
          الرسالة تحمل رقم طلبك #{reqNum} — لا تتضمّن بيانات شخصية للطرف الآخر
        </p>

        {/* حالة الرسوم */}
        <FeeCard
          depositStatus={depositStatus}
          depositAmountPaid={depositAmountPaid}
          finalFeeStatus={finalFeeStatus}
          finalFeeAmountPaid={finalFeeAmountPaid}
        />

        {/* حالة الطرف الآخر */}
        <OtherPartyCard member={otherMember} depositStatus={otherDepositStatus} />
      </div>
    );
  }

  // ③ قيد التنسيق
  if (stage === 'coordinating') {
    return (
      <div className="space-y-5">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-cairo font-bold text-blue-800 mb-1">طلبك قيد المتابعة مع الإدارة</h3>
              <p className="text-sm text-blue-700 font-tajawal leading-relaxed">
                الإدارة تتابع متطلبات الطرفين وتنسّق الخطوات التالية. ستتلقى إشعارًا عند أي تحديث.
              </p>
            </div>
          </div>
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-cairo font-bold py-3.5 rounded-2xl transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          <span>تواصل مع الإدارة لأي استفسار</span>
        </a>

        <FeeCard
          depositStatus={depositStatus}
          depositAmountPaid={depositAmountPaid}
          finalFeeStatus={finalFeeStatus}
          finalFeeAmountPaid={finalFeeAmountPaid}
        />
        <OtherPartyCard member={otherMember} depositStatus={otherDepositStatus} />
      </div>
    );
  }

  // ④ مغلقة
  if (stage === 'closed') {
    const closeReason = (req as any).close_reason as CloseReason | null;
    const closeNote = (req as any).close_note as string | null;
    const isMatch = closeReason === 'match';
    return (
      <div className="space-y-5">
        <div className={`rounded-2xl p-6 text-center border ${
          isMatch ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isMatch ? 'bg-emerald-100' : 'bg-slate-100'
          }`}>
            {isMatch ? <CheckCircle className="w-8 h-8 text-emerald-500" /> : <Ban className="w-8 h-8 text-slate-400" />}
          </div>
          <h3 className={`font-cairo font-bold text-lg mb-2 ${isMatch ? 'text-emerald-800' : 'text-slate-700'}`}>
            {closeReason ? CLOSE_REASON_LABELS[closeReason] : 'انتهت الرحلة'}
          </h3>
          {isMatch && <p className="text-emerald-600 font-tajawal text-sm">بارك الله لكما وبارك عليكما وجمع بينكما في خير 🤍</p>}
          {closeNote && <p className="text-sm text-slate-500 mt-2 font-tajawal">{closeNote}</p>}
        </div>
        <FeeCard
          depositStatus={depositStatus}
          depositAmountPaid={depositAmountPaid}
          finalFeeStatus={finalFeeStatus}
          finalFeeAmountPaid={finalFeeAmountPaid}
        />
      </div>
    );
  }

  // مرفوض
  if (stage === 'declined') {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
        <XCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
        <h3 className="font-cairo font-bold text-rose-800 mb-2">انتهت الرحلة باعتذار</h3>
        {req.decline_reason && <p className="text-sm text-rose-600 font-tajawal">{req.decline_reason}</p>}
        <p className="text-sm text-slate-500 mt-3 font-tajawal">الزواج قسمة ونصيب. تصفّح الأعضاء وابدأ رحلة جديدة.</p>
      </div>
    );
  }

  // ملغي
  if (stage === 'cancelled') {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
        <Ban className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="font-cairo font-bold text-slate-700 mb-2">تم إلغاء هذا الطلب</h3>
        {req.cancel_reason && <p className="text-sm text-slate-500 font-tajawal">{req.cancel_reason}</p>}
        <p className="text-sm text-slate-400 mt-2 font-tajawal">يمكنك إرسال طلب جديد في أي وقت.</p>
      </div>
    );
  }

  return null;
}

// ===== الصفحة الرئيسية =====
export default function JourneyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const [req, setReq] = useState<ApiRequest | null>(null);
  const [events, setEvents] = useState<RequestEvent[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const requestId = id ? parseInt(id) : 0;
  const userId = currentUser?.id || getCurrentUserId();

  const load = useCallback(async () => {
    if (!requestId) { setError('رقم الطلب غير صحيح'); setLoading(false); return; }
    try {
      setError(null);
      const [r, evs, mems] = await Promise.all([
        fetchRequest(requestId),
        fetchRequestEvents(requestId),
        fetchMembers(),
      ]);
      if (!r) { setError('لم يُعثر على الطلب'); return; }
      setReq(r);
      setEvents(evs);
      setMembers(mems as Member[]);
    } catch (e: any) {
      setError(e?.message || 'حدث خطأ أثناء التحميل');
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => { load(); }, [load]);

  const handleAction = useCallback(async (action: string, payload: Record<string, any> = {}) => {
    if (!req || !userId) return;
    setActionLoading(true);
    try {
      const res = await runActionStandalone(requestId, action, userId, payload);
      if (!res.ok) { alert(res.error || 'فشل الإجراء'); }
      else { await load(); }
    } finally {
      setActionLoading(false);
    }
  }, [req, userId, requestId, load]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-navy-500" />
    </div>
  );

  if (error || !req) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <AlertCircle className="w-12 h-12 text-rose-400" />
      <p className="font-cairo text-navy-700">{error || 'لم يُعثر على الطلب'}</p>
      <button onClick={() => navigate('/requests')} className="text-navy-600 font-cairo font-semibold hover:underline">العودة للطلبات</button>
    </div>
  );

  const isSender = req.sender_id === userId;
  const otherId = isSender ? req.receiver_id : req.sender_id;
  const otherMember = members.find((m) => m.id === otherId);
  const stage = getJourneyStageV2(req.journey_stage);
  const meta = STAGE_META[stage];
  const accent = ACCENT_CLASSES[meta.accent] || ACCENT_CLASSES.slate;
  const reqNum = (req as any).request_number || req.id;

  return (
    <div className="min-h-screen bg-cream-50" dir="rtl">
      <div className="max-w-lg mx-auto px-4 py-6">
        {/* رأس الصفحة */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/requests')} className="p-2 rounded-xl hover:bg-white transition-all">
            <ArrowRight className="w-5 h-5 text-navy-600" />
          </button>
          <div className="flex-1">
            <h1 className="font-cairo font-extrabold text-navy-900 text-lg">رحلة التوافق</h1>
            <p className="text-xs text-slate-400">طلب #{reqNum} • {otherMember?.nickname || 'الطرف الآخر'}</p>
          </div>
          <button onClick={load} className="p-2 rounded-xl hover:bg-white transition-all" title="تحديث">
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* شريط التقدم */}
        {!isTerminal(stage) && <Stepper stage={stage} />}

        {/* عنوان المرحلة */}
        <div className={`rounded-2xl p-4 mb-5 ${accent.bgSoft} ${accent.border} border`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent.bg}`}>
              <meta.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${accent.bgSoft} ${accent.text} border ${accent.border}`}>
                {meta.badge}
              </span>
              <h2 className={`font-cairo font-bold text-base mt-0.5 ${accent.text}`}>{meta.memberTitle}</h2>
            </div>
          </div>
          {meta.memberDesc && <p className="text-sm font-tajawal text-slate-600 mt-3 leading-relaxed">{meta.memberDesc}</p>}
        </div>

        {/* محتوى المرحلة */}
        <StageContent
          stage={stage}
          isSender={isSender}
          req={req}
          otherMember={otherMember}
          onAction={handleAction}
          actionLoading={actionLoading}
        />

        {/* سجل الأحداث */}
        {events.length > 0 && (
          <div className="mt-6">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="w-full flex items-center justify-between py-3 text-sm font-cairo font-semibold text-slate-500 hover:text-navy-700 transition-colors"
            >
              <span>سجل الرحلة ({events.length})</span>
              {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pb-4">
                    {events.slice().reverse().map((ev) => (
                      <div key={ev.id} className="flex gap-3 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2 flex-shrink-0" />
                        <div>
                          <p className="text-navy-700 font-tajawal">{ev.note || ev.type}</p>
                          <p className="text-[11px] text-slate-400">{new Date(ev.created_at).toLocaleDateString('ar-SA')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
