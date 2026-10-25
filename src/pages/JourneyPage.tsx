import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, MessageCircle, RefreshCw } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { dataService } from '../lib/data/DataService';
import { FLOW_STAGES, FLOW_LABELS, displayStage, workflowOf, whatsappJourneyUrl } from '../lib/journeyWorkflow';
import { getJourneyStatusSummary } from '../lib/journey';
import JourneyFinanceSummary from '../components/requests/JourneyFinanceSummary';
import '../components/requests/JourneyWorkflow.css';

export default function JourneyPage() {
  const { id } = useParams(); const rid = Number(id);
  const { user, socialSettings } = useApp();
  const uid = user?.isLoggedIn ? user.memberId || dataService.db.getCurrentUserId() : '';
  const [req, setReq] = useState<any>(null), [loading, setLoading] = useState(true), [error, setError] = useState('');
  const [busy, setBusy] = useState(false), [confirm, setConfirm] = useState(false), [reason, setReason] = useState('');
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
  const action = async (name: string) => {
    if (busy || !req) return;
    if (name === 'accept' && !confirm) { setError('أكد فهمك أن الموافقة مبدئية قبل المتابعة'); return; }
    setBusy(true); setError('');
    try { const res = await dataService.db.runRequestAction(rid, name, uid, { reason }); if (!res.ok) setError(res.error || 'تعذر حفظ القرار'); else { setConfirm(false); await load(); } }
    catch { setError('تعذر حفظ القرار؛ حاول مجدداً'); } finally { setBusy(false); }
  };
  const stage = req ? displayStage(req.journey_stage) : 'sent', w = req ? workflowOf(req) : null;
  const party = req?.sender_id === uid ? 'sender' : 'receiver';
  const whatsapp = whatsappJourneyUrl(socialSettings.whatsappNumber, rid);
  const summary = req ? getJourneyStatusSummary(req, uid) : null;
  return <main className="journey-workflow" dir="rtl"><div className="jw-wrap">
    <Link to="/requests" className="jw-button"><ArrowRight size={18} aria-hidden="true"/> طلباتي</Link>
    {!uid ? <section className="jw-card"><h1>سجّل الدخول لمتابعة طلبك</h1><Link to="/login" className="jw-button jw-button-primary">تسجيل الدخول</Link></section>
    : loading ? <p role="status">جارٍ تحميل الرحلة…</p> : !req ? <section className="jw-card"><h1>تعذر فتح الرحلة</h1><p>{error}</p></section> : <>
      <header className="jw-heading"><div><p className="jw-muted">طلب التوافق رقم {req.id} · {req.source_type === 'imported' ? 'ملف وساطة' : 'عضوان مسجّلان'}</p><h1>رحلة التوافق</h1><Link className="jw-link" to={'/member/' + (party === 'sender' ? req.receiver_id : req.sender_id)}>عرض ملف الطرف الآخر</Link></div><button className="jw-button" onClick={load}><RefreshCw size={18} aria-hidden="true"/> تحديث</button></header>
      <ol className="jw-steps" aria-label="مراحل رحلة التوافق">{FLOW_STAGES.map((s, i) => <li key={s} aria-current={s === stage ? 'step' : undefined}><b>{String(i + 1).padStart(2, '0')}</b>{FLOW_LABELS[s]}</li>)}</ol>
      {req.frozen && <p className="jw-alert" role="status">المتابعة معلقة مؤقتاً بقرار الإدارة. تواصل معها عبر واتساب.</p>}
      {error && <p className="jw-alert" role="alert">{error}</p>}
      <section className="jw-card"><span className="jw-tag">{summary?.actorLabel}</span><h2>{summary?.title}</h2><p>{summary?.description}</p><p className="jw-muted">{summary?.nextHint}</p>
        {stage === 'sent' && !req.frozen && (party === 'receiver' ? <>
          <label className="jw-check"><input type="checkbox" checked={confirm} onChange={e => setConfirm(e.target.checked)}/><span>أفهم أن القبول موافقة مبدئية، وأن رسوم الرحلة مستقلة عن العضوية، وأن المتابعة بعد القبول عبر واتساب الإدارة.</span></label>
          <label className="jw-field">سبب الاعتذار (اختياري)<input maxLength={500} value={reason} onChange={e => setReason(e.target.value)}/></label>
          <div className="jw-actions"><button disabled={busy || !confirm} className="jw-button jw-button-primary" onClick={() => action('accept')}>قبول مبدئي</button><button disabled={busy} className="jw-button jw-button-danger" onClick={() => action('decline')}>الاعتذار عن الطلب</button></div>
        </> : <div className="jw-actions"><button disabled={busy} className="jw-button jw-button-danger" onClick={() => { if (window.confirm('هل تريد إلغاء طلب التوافق الذي أرسلته؟')) action('cancel'); }}>إلغاء الطلب المرسل</button></div>)}
        {stage !== 'sent' && <div className="jw-actions">{whatsapp ? <a className="jw-button jw-button-primary" href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} aria-hidden="true"/>{stage === 'accepted' ? 'متابعة السداد عبر واتساب' : 'متابعة الرحلة عبر واتساب'}</a> : <Link to="/admin-chat" className="jw-button jw-button-primary">التواصل مع الإدارة</Link>}<Link to="/admin-chat" className="jw-button">دعم الإدارة</Link></div>}
      </section>
      <section className="jw-card"><h2>ملخص رسومك</h2><JourneyFinanceSummary request={req} party={party}/><p className="jw-muted">رسوم مستقلة على كل طرف، مسجّلاً أو مستورداً. فتح واتساب أو إرسال إيصال ليس تأكيداً للسداد؛ تعتمد الإدارة المبلغ بعد التحقق.</p><Link to="/terms" className="jw-link">الشروط والأحكام</Link></section>
      {w && <section className="jw-card"><h2>آخر مستجدات المتابعة</h2><div className="jw-grid"><p>الخطبة: <strong>{w.engagementConfirmed ? 'تم تأكيدها' : 'لم تُؤكَّد بعد'}</strong></p><p>تسليم المهر: <strong>{w.mahrConfirmed ? 'تم تأكيده' : 'لم يُؤكَّد بعد'}</strong></p><p>التواصل: <strong>{w.contactShared ? 'سجّلت الإدارة تنسيق مشاركة البيانات بالموافقات اللازمة' : 'تنسّقه الإدارة عبر واتساب'}</strong></p><p>النتيجة: <strong>{({ pending: 'بانتظار التأكيد', married: 'تم الزواج', not_completed: 'لم تكتمل الإجراءات', stopped: 'توقفت المتابعة', unconfirmed: 'تعذر تأكيد النتيجة' })[w.outcome]}</strong></p></div><p className="jw-muted">لا تُعرض أرقام أولياء الأمور هنا. مشاركة البيانات تتم عبر الإدارة وبالموافقة، ولا يثبت الزواج بمجرد سداد الرسوم.</p></section>}
      {directives.length > 0 && <section className="jw-card"><h2>توجيهات الإدارة</h2>{directives.map(m => <p className="jw-item" key={m.id}>{m.text}</p>)}</section>}
      <p className="jw-muted">آخر تحديث: {new Date(req.updated_at).toLocaleString('ar-SA')}</p>
    </>}
  </div></main>;
}
