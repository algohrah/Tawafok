import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Inbox, ArrowUpLeft, ArrowDownLeft, Search, RefreshCw, Clock3, CheckCircle2, UserRound, ChevronLeft, Sparkles, CircleAlert } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { useInterestRequests, isRequestUnseen } from '../lib/useInterestRequests';
import { displayStage, workflowOf, FLOW_LABELS } from '../lib/journeyWorkflow';
import { getJourneyStatusSummary } from '../lib/journey';
import { JOURNEY_GUIDE } from '../components/requests/JourneyStepper';
import JourneyDecisionDialog from '../components/requests/JourneyDecisionDialog';
import '../components/requests/JourneyWorkflow.css';

type Tab = 'action' | 'active' | 'closed';
export default function InterestRequests() {
  const { user } = useApp(); const uid = user?.isLoggedIn ? user.memberId || '' : '';
  const { requests, loading, error, refresh, getMember, runAction, actionLoading } = useInterestRequests(uid);
  const [query, setQuery] = useState(''), [direction, setDirection] = useState('all'), [tab, setTab] = useState<Tab>('active');
  const [decision, setDecision] = useState<{ request: any; action: 'accept' | 'decline' } | null>(null), [decisionError, setDecisionError] = useState('');
  const [notice, setNotice] = useState('');
  const mapped = useMemo(() => requests.map(r => {
    const stage = displayStage(r.journey_stage), w = workflowOf(r);
    const closed = stage === 'declined' || stage === 'cancelled' || (stage === 'completed' && w.outcome !== 'pending');
    const other = getMember(r.sender_id === uid ? r.receiver_id : r.sender_id);
    const summary = getJourneyStatusSummary(r, uid, other?.nickname);
    return { r, stage, closed, other, summary, actionable: !r.frozen && !closed && summary.actor === 'me' };
  }).sort((a, b) => Number(b.actionable) - Number(a.actionable) || Date.parse(b.r.updated_at) - Date.parse(a.r.updated_at)), [requests, uid, getMember]);
  const counts = { action: mapped.filter(m => m.actionable).length, active: mapped.filter(m => !m.closed).length, closed: mapped.filter(m => m.closed).length };
  const filtered = mapped.filter(m => {
    if ((tab === 'action' && !m.actionable) || (tab === 'active' && m.closed) || (tab === 'closed' && !m.closed)) return false;
    if ((direction === 'sent' && m.r.sender_id !== uid) || (direction === 'received' && m.r.receiver_id !== uid)) return false;
    return [m.r.id, m.other?.nickname, m.other?.city].join(' ').toLowerCase().includes(query.trim().toLowerCase());
  });
  const decide = async (reason: string) => {
    if (!decision || actionLoading !== null) return;
    try { const result = await runAction(decision.request.id, decision.action, { reason }); if (!result.ok) setDecisionError(result.error || 'تعذر حفظ القرار'); else { setNotice(decision.action === 'accept' ? 'تمت الموافقة المبدئية. افتح الرحلة لمتابعة السداد والتنسيق مع الإدارة.' : 'تم تسجيل الاعتذار عن الطلب.'); setDecision(null); } }
    catch { setDecisionError('تعذر حفظ القرار؛ حاول مجدداً.'); }
  };
  return <main className="journey-workflow requests-page" dir="rtl"><div className="jw-wrap">
    <header className="rq-page-heading"><div className="rq-heading-symbol"><HeartHandshake size={28} aria-hidden="true"/></div><div><p className="jr-eyebrow">مساحة متابعة التوافق</p><h1>طلباتي</h1><p className="jw-muted">كل طلب، وخطوته التالية، في مكان واحد.</p></div><button className="jr-icon-button" aria-label="تحديث قائمة الطلبات" onClick={refresh}><RefreshCw size={20}/></button></header>
    {!uid ? <section className="jr-empty"><Inbox size={38} aria-hidden="true"/><h2>طلباتك تبدأ من حسابك</h2><p>سجّل الدخول لمراجعة الطلبات الواردة والصادرة ومتابعة رحلتك.</p><Link className="jw-button jw-button-primary" to="/login">تسجيل الدخول</Link></section> : <>
      <div className="rq-stats" aria-label="ملخص طلباتك">{([{ key: 'action', title: 'تحتاج إجراء', icon: CircleAlert }, { key: 'active', title: 'قيد المتابعة', icon: Clock3 }, { key: 'closed', title: 'منتهية', icon: CheckCircle2 }] as const).map(item => <button key={item.key} className={'rq-stat rq-stat-' + item.key} onClick={() => setTab(item.key)} aria-pressed={tab === item.key}><item.icon size={20} aria-hidden="true"/><strong>{counts[item.key].toLocaleString('ar-SA')}</strong><span>{item.title}</span></button>)}</div>
      <section className="rq-workspace" aria-label="قائمة الطلبات"><div className="rq-tabs" role="group" aria-label="تصفية حالة الطلب">{([{ key: 'action', title: 'تحتاج إجراء' }, { key: 'active', title: 'قيد المتابعة' }, { key: 'closed', title: 'المنتهية' }] as const).map(t => <button key={t.key} aria-pressed={tab === t.key} onClick={() => setTab(t.key)}>{t.title}<span>{counts[t.key]}</span></button>)}</div>
      <div className="rq-toolbar"><label className="rq-search"><Search size={19} aria-hidden="true"/><span className="jr-sr-only">البحث بالاسم أو المدينة أو رقم الطلب</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث بالاسم أو رقم الطلب…"/></label><div className="rq-direction" role="group" aria-label="اتجاه الطلب">{[{ key: 'all', label: 'الكل' }, { key: 'received', label: 'الواردة' }, { key: 'sent', label: 'الصادرة' }].map(d => <button key={d.key} aria-pressed={direction === d.key} onClick={() => setDirection(d.key)}>{d.label}</button>)}</div></div>
      {notice && <div className="rq-notice" role="status"><CheckCircle2 size={19} aria-hidden="true"/><p>{notice}</p><button className="jr-icon-button" aria-label="إخفاء التنبيه" onClick={() => setNotice('')}>×</button></div>}
      {error && <p className="jw-alert" role="alert">{error}</p>}
      {loading ? <div className="rq-card-grid" aria-busy="true" aria-label="جارٍ تحميل الطلبات">{[1,2,3,4].map(i => <div key={i} className="rq-skeleton"/>)}</div> : <div className="rq-card-grid">{filtered.map(({ r, stage, closed, other, summary, actionable }) => {
        const isSender = r.sender_id === uid, idx = JOURNEY_GUIDE.findIndex(s => s.key === stage), waitingReply = stage === 'sent' && !isSender && !r.frozen;
        return <article key={r.id} className={'rq-card ' + (actionable ? 'rq-card-action' : '')}>
          <header className="rq-member"><div className={'jr-avatar ' + (other?.gender === 'female' ? 'is-female' : '')}><UserRound size={25} aria-hidden="true"/></div><div className="rq-member-text"><h2>{other?.nickname || 'ملف غير متاح حالياً'}</h2><p>{other?.city || 'الموقع غير محدد'}{r.source_type === 'imported' ? ' · ملف وساطة' : ''}</p></div><span className={'rq-direction-tag ' + (isSender ? 'is-sent' : '')}>{isSender ? <ArrowUpLeft size={16} aria-hidden="true"/> : <ArrowDownLeft size={16} aria-hidden="true"/>}{isSender ? 'صادر' : 'وارد'}</span></header>
          <div className="rq-meta"><span>طلب #{r.id}</span><span>{new Date(r.created_at).toLocaleDateString('ar-SA', { day: 'numeric', month: 'short' })}</span>{isRequestUnseen(r.id, r.updated_at) && <span className="rq-unread">تحديث جديد</span>}</div>
          <div className={'rq-status rq-status-' + (r.frozen ? 'waiting' : actionable ? 'action' : closed ? 'closed' : 'waiting')}><span className="rq-status-label">{r.frozen ? 'المتابعة معلقة' : summary.actorLabel}</span><h3>{r.frozen ? 'بانتظار استئناف المتابعة من الإدارة' : summary.title}</h3><p>{r.frozen ? 'تواصل مع الإدارة لأي استفسار؛ سجلاتك ودفعاتك محفوظة.' : summary.description}</p></div>
          {!closed && idx >= 0 && <div className="rq-progress"><div><span>{FLOW_LABELS[stage]}</span><span>{idx + 1} من ٥</span></div><div className="rq-progress-track" aria-hidden="true"><span style={{ width: ((idx + 1) * 20) + '%' }}/></div></div>}
          <footer className="rq-card-footer">{waitingReply ? <><button className="jw-button jw-button-primary" onClick={() => { setDecisionError(''); setDecision({ request: r, action: 'accept' }); }}><HeartHandshake size={17} aria-hidden="true"/> قبول مبدئي</button><button className="jw-button" onClick={() => { setDecisionError(''); setDecision({ request: r, action: 'decline' }); }}>اعتذار</button><Link className="rq-card-link" to={'/journey/' + r.id}>تفاصيل الطلب <ChevronLeft size={16} aria-hidden="true"/></Link></> : <><Link className="jw-button jw-button-primary" to={'/journey/' + r.id}>{closed ? 'عرض ملخص الرحلة' : 'متابعة الرحلة'}<ChevronLeft size={17} aria-hidden="true"/></Link>{other && <Link className="jw-button" to={'/member/' + other.id}>عرض الملف</Link>}</>}</footer>
        </article>;
      })}{filtered.length === 0 && <div className="jr-empty"><Inbox size={38} aria-hidden="true"/><h2>{query ? 'لا توجد نتائج مطابقة' : tab === 'action' ? 'لا يوجد إجراء مطلوب منك الآن' : tab === 'closed' ? 'لا توجد طلبات منتهية' : 'لا توجد طلبات في هذه القائمة'}</h2><p>{query ? 'جرّب اسماً آخر أو رقم الطلب، أو غيّر خيارات التصفية.' : 'ستجد طلباتك هنا مع حالتها والخطوة التالية لكل طلب.'}</p><Link className="jw-button" to="/search">تصفّح الملفات</Link></div>}</div>}
      </section><div className="rq-help"><Sparkles size={20} aria-hidden="true"/><p><strong>بعد الموافقة، الإدارة معك خطوة بخطوة.</strong><br/>السداد والتنسيق عبر واتساب، وتحديثات الرحلة ودفعاتك تظهر داخل حسابك.</p></div>
    </>}
    {decision && <JourneyDecisionDialog request={decision.request} decision={decision.action} busy={actionLoading !== null} error={decisionError} onClose={() => { if (actionLoading === null) setDecision(null); }} onConfirm={decide}/>}
  </div></main>;
}
