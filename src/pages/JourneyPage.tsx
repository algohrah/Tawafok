import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, MessageCircle, RefreshCw, ChevronLeft, UserRound, Clock3, ShieldCheck, HeartHandshake, CheckCircle2, Circle, Wallet, Info } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { dataService } from '../lib/data/DataService';
import { displayStage, workflowOf, partyBalance, whatsappJourneyUrl } from '../lib/journeyWorkflow';
import { getJourneyStatusSummary } from '../lib/journey';
import JourneyFinanceSummary from '../components/requests/JourneyFinanceSummary';
import JourneyStepper, { JOURNEY_GUIDE } from '../components/requests/JourneyStepper';
import JourneyDecisionDialog from '../components/requests/JourneyDecisionDialog';
import '../components/requests/JourneyWorkflow.css';

export default function JourneyPage() {
  const { id } = useParams(); const rid = Number(id);
  const { user, socialSettings, members } = useApp();
  const uid = user?.isLoggedIn ? user.memberId || dataService.db.getCurrentUserId() : '';
  const [req, setReq] = useState<any>(null), [loading, setLoading] = useState(true), [error, setError] = useState('');
  const [busy, setBusy] = useState(false), [decision, setDecision] = useState<'accept' | 'decline' | 'cancel' | null>(null), [decisionError, setDecisionError] = useState('');
  const [selectedStage, setSelectedStage] = useState(''), [notice, setNotice] = useState('');
  const [directives, setDirectives] = useState<any[]>([]);
  const load = useCallback(async () => {
    if (!uid || !Number.isSafeInteger(rid) || rid < 1) { setLoading(false); return; }
    try {
      const r = await dataService.db.getRequest(rid);
      if (!r || (r.sender_id !== uid && r.receiver_id !== uid)) { setReq(null); setError('الطلب غير موجود أو غير متاح لحسابك'); return; }
      setReq(r); setError('');
      const instructions = await dataService.db.getInquiry(rid);
      setDirectives((instructions?.messages || []).filter((m: any) => m.sender_id === 'admin'));
    } catch { setError('تعذر تحميل الرحلة. حاول التحديث.'); } finally { setLoading(false); }
  }, [rid, uid]);
  useEffect(() => { if (uid && Number.isSafeInteger(rid) && rid > 0) { dataService.db.markRequestSeen(rid); dataService.db.markRequestNotificationsRead(rid, uid); } }, [rid, uid]);
  useEffect(() => { load(); const refresh = () => load(); window.addEventListener('twafok_notification_update', refresh); return () => window.removeEventListener('twafok_notification_update', refresh); }, [load]);
  const action = async (reason: string) => {
    if (busy || !req || !decision) return;
    setBusy(true); setDecisionError('');
    try { const res = await dataService.db.runRequestAction(rid, decision, uid, { reason }); if (!res.ok) setDecisionError(res.error || 'تعذر حفظ القرار'); else { setNotice(decision === 'accept' ? 'تم تسجيل موافقتك المبدئية. راجع الخطوة الحالية لترتيب السداد والتنسيق.' : 'تم تسجيل قرارك وتحديث حالة الطلب.'); setDecision(null); await load(); } }
    catch { setDecisionError('تعذر حفظ القرار؛ حاول مجدداً'); } finally { setBusy(false); }
  };
  const stage = req ? displayStage(req.journey_stage) : 'sent', w = req ? workflowOf(req) : null;
  const party = req?.sender_id === uid ? 'sender' : 'receiver', otherId = party === 'sender' ? req?.receiver_id : req?.sender_id;
  const other = members?.find(m => m.id === otherId);
  const balance = req ? partyBalance(req, party) : null;
  const whatsapp = whatsappJourneyUrl(socialSettings.whatsappNumber, rid);
  const summary = req ? getJourneyStatusSummary(req, uid, other?.nickname) : null;
  const idx = JOURNEY_GUIDE.findIndex(s => s.key === stage), guide = JOURNEY_GUIDE.find(s => s.key === selectedStage) || JOURNEY_GUIDE[Math.max(0, idx)];
  const terminal = stage === 'declined' || stage === 'cancelled';
  const whatsappLabel = req?.frozen ? 'الاستفسار عن تعليق المتابعة' : stage === 'accepted' && summary?.actor === 'me' ? 'ترتيب الدفعة الأولى عبر واتساب' : stage === 'engagement' && summary?.actor === 'me' ? 'سداد المتبقي عبر واتساب' : 'متابعة مع الإدارة عبر واتساب';
  const openDecision = (value: 'accept' | 'decline' | 'cancel') => { setDecisionError(''); setDecision(value); };
  return <main className="journey-workflow member-journey" dir="rtl"><div className="jw-wrap">
    <nav className="jr-topbar" aria-label="التنقل في الطلبات"><Link to="/requests" className="jr-back"><ArrowRight size={18} aria-hidden="true"/> طلباتي</Link><button className="jr-icon-button" aria-label="تحديث رحلة التوافق" onClick={load}><RefreshCw size={19}/></button></nav>
    {!uid ? <section className="jr-empty"><UserRound size={36} aria-hidden="true"/><h1>سجّل الدخول لمتابعة طلبك</h1><Link to="/login" className="jw-button jw-button-primary">تسجيل الدخول</Link></section>
    : loading ? <div className="rq-skeleton" role="status">جارٍ تحميل الرحلة…</div> : !req ? <section className="jr-empty"><h1>تعذر فتح الرحلة</h1><p>{error}</p><Link to="/requests" className="jw-button">العودة إلى طلباتي</Link></section> : <>
      <header className="jr-page-heading"><div><p className="jr-eyebrow">طلب #{req.id} · {req.source_type === 'imported' ? 'ملف وساطة تتابعه الإدارة' : 'طلب بين عضوين مسجّلين'}</p><h1>رحلة التوافق</h1></div><Link className="jr-partner" to={'/member/' + otherId}><span className={'jr-avatar ' + (other?.gender === 'female' ? 'is-female' : '')}><UserRound size={23} aria-hidden="true"/></span><span><small>الطرف الآخر</small><strong>{other?.nickname || 'عرض الملف'}</strong></span><ChevronLeft size={18} aria-hidden="true"/></Link></header>
      {notice && <p className="rq-notice" role="status"><CheckCircle2 size={20} aria-hidden="true"/>{notice}</p>}
      {error && <p className="jw-alert" role="alert">{error}</p>}
      <section className="jr-roadmap" aria-label="مخطط الرحلة"><div className="jr-section-heading"><h2>رحلتك، خطوة بخطوة</h2><span className="jw-muted">{terminal ? 'طلب غير نشط' : `المرحلة ${idx + 1} من ٥`}</span></div><JourneyStepper stage={stage} selected={selectedStage} onSelect={setSelectedStage}/><p className="jr-step-help">اضغط على أي مرحلة لشرحها؛ عرض الشرح لا يغيّر حالة طلبك.</p>
        {selectedStage && <div className="jr-guide" role="status"><strong>{guide.title}</strong><p>{guide.description}</p><p className="jw-muted">{guide.next}</p><button className="jw-button" onClick={() => setSelectedStage('')}>إغلاق الشرح</button></div>}
      </section>
      <div className="jr-content-grid"><div className="jr-primary-column">
      <section className={'jr-current jr-tone-' + (req.frozen ? 'waiting' : summary?.tone)} aria-labelledby="current-stage-title"><div className="jr-current-label"><Clock3 size={18} aria-hidden="true"/><span>{summary?.actorLabel}</span><span>{req.frozen ? 'معلّق' : terminal ? 'منتهٍ' : 'حالة الطلب الآن'}</span></div><h2 id="current-stage-title">{summary?.title}</h2><p>{summary?.description}</p>
        <div className="jr-next"><ChevronLeft size={18} aria-hidden="true"/><p>{summary?.nextHint}</p></div>
        {stage === 'sent' && !req.frozen && <div className="jw-actions">{party === 'receiver' ? <><button className="jw-button jw-button-primary" disabled={busy} onClick={() => openDecision('accept')}><HeartHandshake size={18} aria-hidden="true"/> قبول مبدئي</button><button className="jw-button" disabled={busy} onClick={() => openDecision('decline')}>الاعتذار عن الطلب</button></> : <button className="jw-button" disabled={busy} onClick={() => openDecision('cancel')}>إلغاء الطلب المرسل</button>}<Link to={'/member/' + otherId} className="jw-button">مراجعة الملف</Link></div>}
        {(stage !== 'sent' || req.frozen) && <div className="jw-actions">{whatsapp ? <a className="jw-button jw-button-primary" href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true"/>{terminal ? 'استفسار لدى الإدارة' : whatsappLabel}</a> : <Link to="/admin-chat" className="jw-button jw-button-primary">التواصل مع الإدارة</Link>}{terminal && <Link to="/search" className="jw-button">استكشاف ملفات أخرى</Link>}</div>}
        {!terminal && stage !== 'sent' && <p className="jr-caption">فتح واتساب لا يغيّر المرحلة أو يثبت السداد. تعتمد الإدارة التحديث بعد التحقق.</p>}
      </section>
      <section className="jw-card jr-guidance"><h2>ماذا يحدث الآن؟</h2><div className="jr-responsibility"><span><UserRound size={21} aria-hidden="true"/></span><div><h3>دورك</h3><p>{req.frozen ? 'انتظر توجيه الإدارة قبل أي سداد أو إجراء جديد.' : stage === 'sent' ? party === 'receiver' ? 'راجع ملف المرسل، ثم سجّل قبولك المبدئي أو اعتذارك.' : 'انتظر قرار الطرف الآخر. يمكنك إلغاء الطلب قبل الرد.' : summary?.actor === 'me' ? 'تواصل مع الإدارة عبر زر واتساب أعلاه، وأرسل تأكيد التحويل عند السداد للتحقق منه.' : terminal ? 'لا إجراء مطلوب لهذا الطلب. تواصل مع الإدارة عند الحاجة إلى تصحيح أو تسوية.' : 'تابع التحديثات، وأبلغ الإدارة عبر واتساب بأي مستجد في التواصل أو الخطبة أو المهر.'}</p></div></div><div className="jr-responsibility"><span><ShieldCheck size={21} aria-hidden="true"/></span><div><h3>دور الإدارة</h3><p>{stage === 'sent' ? req.source_type === 'imported' ? 'تتابع قرار صاحب البيانات عبر الخطّابة وتوثّق القبول أو الرفض.' : 'تتابع الطلب عند الحاجة، وتظهر نتيجة رد الطرف الآخر هنا.' : 'تتحقق من الدفعات، وتنسّق الموافقات ومشاركة بيانات أولياء الأمور، وتحدّث المرحلة والنتيجة.'}</p></div></div></section>
      {directives.length > 0 && <section className="jw-card"><h2>توجيهات الإدارة لهذا الطلب</h2>{directives.map(m => <p className="jw-item" key={m.id}>{m.text}</p>)}</section>}
      </div><aside className="jr-secondary-column" aria-label="رسومك ومستجدات الرحلة">
      <section className="jw-card jr-finance"><div className="jr-section-heading"><h2><Wallet size={20} aria-hidden="true"/> رسومك في هذا الطلب</h2><span className="jw-tag">لكل طرف بشكل مستقل</span></div><JourneyFinanceSummary request={req} party={party}/><details><summary>كيف تُحسب الرسوم وتُعتمد؟</summary><p>المتبقي = إجمالي رسومك − دفعاتك الفعلية المؤكدة. تستطيع الإدارة اعتماد مبلغ أقل من الدفعة المستهدفة. يُسدّد المتبقي بعد تأكيد تسليم المهر، وهو منفصل عن قيمة المهر وعن اشتراك العضوية.</p><p>إرسال إيصال لا يثبت الدفع؛ تعتمد الإدارة المبلغ بعد التحقق. لا تنقل أي بيانات حساسة في وصفك العام.</p><Link to="/terms" className="jw-link">الشروط والأحكام</Link></details>{balance && balance.remaining === 0 && <p className="jr-paid"><CheckCircle2 size={18} aria-hidden="true"/> لا يوجد متبقٍ من رسومك</p>}</section>
      {w && <section className="jw-card jr-facts"><h2>ما الذي تم توثيقه؟</h2>{[{ title: 'تنسيق مشاركة بيانات التواصل', done: w.contactShared }, { title: 'تأكيد الخطبة', done: w.engagementConfirmed }, { title: 'تأكيد تسليم المهر', done: w.mahrConfirmed }].map(item => <div className="jr-fact" key={item.title}>{item.done ? <CheckCircle2 size={20} aria-hidden="true"/> : <Circle size={20} aria-hidden="true"/>}<span>{item.title}<small>{item.done ? 'مؤكّد لدى الإدارة' : 'لم يُؤكَّد بعد'}</small></span></div>)}<div className="jr-outcome"><small>نتيجة الزواج</small><strong>{({ pending: 'بانتظار التأكيد', married: 'تم الزواج', not_completed: 'لم تكتمل الإجراءات', stopped: 'توقفت المتابعة', unconfirmed: 'تعذّر تأكيد النتيجة' })[w.outcome]}</strong></div><p className="jr-caption">المراحل ترتيب للمتابعة، وليست إثباتاً للزواج أو اكتمال السداد.</p></section>}
      </aside></div>
      <div className="jr-privacy"><Info size={19} aria-hidden="true"/><p>بيانات أولياء الأمور لا تظهر هنا. مشاركتها تتم عبر الإدارة وبالموافقات اللازمة.</p></div><p className="jr-updated">آخر تحديث: {new Date(req.updated_at).toLocaleString('ar-SA')}</p>
      {decision && <JourneyDecisionDialog request={req} decision={decision} busy={busy} error={decisionError} onClose={() => { if (!busy) setDecision(null); }} onConfirm={action}/>}
    </>}
  </div></main>;
}
