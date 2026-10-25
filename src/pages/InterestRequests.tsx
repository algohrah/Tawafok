import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../lib/AppContext';
import { useInterestRequests } from '../lib/useInterestRequests';
import { displayStage, FLOW_LABELS } from '../lib/journeyWorkflow';
import { getJourneyStatusSummary } from '../lib/journey';
import '../components/requests/JourneyWorkflow.css';
export default function InterestRequests() {
  const { user } = useApp(); const uid = user?.isLoggedIn ? user.memberId || '' : '';
  const { requests, loading, error, refresh, getMember } = useInterestRequests(uid);
  const [query, setQuery] = useState(''), [scope, setScope] = useState('all'), [state, setState] = useState('active');
  const filtered = useMemo(() => requests.filter(r => {
    const stage = displayStage(r.journey_stage), closed = ['completed', 'declined', 'cancelled'].includes(stage);
    if ((state === 'active' && closed) || (state === 'closed' && !closed)) return false;
    if ((scope === 'sent' && r.sender_id !== uid) || (scope === 'received' && r.receiver_id !== uid)) return false;
    const other = getMember(r.sender_id === uid ? r.receiver_id : r.sender_id);
    return (String(r.id) + ' ' + (other?.nickname || '')).includes(query.trim());
  }), [requests, query, scope, state, uid, getMember]);
  return <main className="journey-workflow" dir="rtl"><div className="jw-wrap"><header className="jw-heading"><div><h1>طلبات التوافق</h1><p className="jw-muted">القرار المبدئي من الحساب، والسداد والتنسيق والمتابعة عبر واتساب الإدارة.</p></div><button onClick={refresh} className="jw-button">تحديث الطلبات</button></header>
    {!uid ? <section className="jw-card"><p>سجّل الدخول لعرض طلباتك.</p><Link className="jw-button jw-button-primary" to="/login">تسجيل الدخول</Link></section> : <>
      <div className="jw-filter"><label className="jw-field">البحث بالاسم أو رقم الطلب<input value={query} onChange={e => setQuery(e.target.value)}/></label><label className="jw-field">اتجاه الطلب<select value={scope} onChange={e => setScope(e.target.value)}><option value="all">الكل</option><option value="sent">أرسلتها</option><option value="received">استقبلتها</option></select></label><label className="jw-field">الحالة<select value={state} onChange={e => setState(e.target.value)}><option value="active">قيد المتابعة</option><option value="closed">المنتهية</option><option value="all">جميع الطلبات</option></select></label></div>
      {loading ? <p role="status">جارٍ تحميل الطلبات…</p> : error ? <p role="alert" className="jw-alert">{error}</p> : <div className="jw-list">{filtered.map(r => { const other = getMember(r.sender_id === uid ? r.receiver_id : r.sender_id); const summary = getJourneyStatusSummary(r, uid, other?.nickname); return <article key={r.id} className="jw-card"><header className="jw-heading"><div><span className="jw-muted">طلب رقم {r.id} · {r.sender_id === uid ? 'صادر' : 'وارد'}</span><h2>{other?.nickname || 'ملف غير متاح حالياً'}</h2></div><span className="jw-tag">{r.frozen ? 'متابعة معلقة' : FLOW_LABELS[displayStage(r.journey_stage)]}</span></header><p><strong>{summary.title}</strong></p><p className="jw-muted">{summary.description}</p><div className="jw-actions"><Link className="jw-button jw-button-primary" to={'/journey/' + r.id}>{r.journey_stage === 'sent' && r.receiver_id === uid ? 'مراجعة الطلب والرد' : 'متابعة الرحلة'}</Link>{other && <Link className="jw-button" to={'/member/' + other.id}>عرض الملف</Link>}</div></article>; })}{filtered.length === 0 && <section className="jw-card"><h2>لا توجد طلبات مطابقة</h2><Link className="jw-button" to="/search">تصفّح الملفات</Link></section>}</div>}
    </>}
  </div></main>;
}
