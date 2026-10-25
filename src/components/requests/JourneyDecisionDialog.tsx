import { Link } from 'react-router-dom';
import { useEffect, useId, useRef, useState } from 'react';
import { X, HeartHandshake, AlertCircle } from 'lucide-react';
import { partyBalance } from '../../lib/journeyWorkflow';
export default function JourneyDecisionDialog({ request, decision, busy, error, onClose, onConfirm }: { request: any; decision: 'accept' | 'decline' | 'cancel'; busy: boolean; error: string; onClose: () => void; onConfirm: (reason: string) => void }) {
  const ref = useRef<HTMLDialogElement>(null), titleId = useId();
  const [agree, setAgree] = useState(false), [reason, setReason] = useState('');
  const balance = partyBalance(request, 'receiver');
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => { if (dialog?.open) dialog.close(); }; }, []);
  const title = decision === 'accept' ? 'الموافقة المبدئية على الطلب' : decision === 'decline' ? 'الاعتذار عن الطلب' : 'إلغاء الطلب المرسل';
  return <dialog ref={ref} className="jr-dialog journey-workflow" dir="rtl" aria-labelledby={titleId} onCancel={e => { e.preventDefault(); if (!busy) onClose(); }} onClick={e => { if (e.target === ref.current && !busy) onClose(); }}>
    <header className="jr-dialog-heading"><h2 id={titleId}>{title}</h2><button className="jr-icon-button" aria-label="إغلاق نافذة القرار" disabled={busy} onClick={onClose}><X size={20}/></button></header>
    <div className="jr-dialog-body">{decision === 'accept' ? <><div className="jr-dialog-symbol"><HeartHandshake size={28}/></div><p>قبولك بداية للتنسيق، وليس اتفاقاً نهائياً على الخطبة أو الزواج.</p><div className="jw-notice">رسوم الرحلة لكل طرف: <strong>{balance.total} ريال</strong>. الدفعة الأولى المستهدفة: <strong>{balance.initial} ريال</strong>، والمتبقي عند تأكيد تسليم المهر بعد خصم الدفعات الفعلية.</div><label className="jw-check"><input autoFocus type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)}/><span>فهمت الرسوم وأن متابعة السداد والتنسيق بعد الموافقة تكون عبر واتساب الإدارة.</span></label><Link to="/terms" className="jw-link">الشروط والأحكام</Link></> : <><p>هل تريد {decision === 'decline' ? 'الاعتذار عن متابعة هذا الطلب' : 'إلغاء الطلب الذي أرسلته'}؟ لن يُحذف سجل الطلب بهذا الإجراء.</p><label className="jw-field">السبب (اختياري)<textarea autoFocus maxLength={500} value={reason} onChange={e => setReason(e.target.value)} placeholder="يمكنك ترك السبب فارغاً"/></label></>}
    {error && <p className="jw-alert" role="alert"><AlertCircle size={18} aria-hidden="true"/> {error}</p>}
    <div className="jw-actions"><button className={'jw-button ' + (decision === 'accept' ? 'jw-button-primary' : 'jw-button-danger')} disabled={busy || (decision === 'accept' && !agree)} onClick={() => onConfirm(reason)}>{busy ? 'جارٍ حفظ القرار…' : decision === 'accept' ? 'تأكيد الموافقة المبدئية' : 'تأكيد ' + (decision === 'decline' ? 'الاعتذار' : 'الإلغاء')}</button><button className="jw-button" disabled={busy} onClick={onClose}>العودة دون تغيير</button></div></div>
  </dialog>;
}
