import { partyBalance, type Party } from '../../lib/journeyWorkflow';
export default function JourneyFinanceSummary({ request, party }: { request: any; party: Party }) {
  const b = partyBalance(request, party);
  return <div>
    <dl className="jw-stats"><div><dt>إجمالي رسومك</dt><dd>{b.total.toLocaleString('ar-SA')} <small>ريال</small></dd></div><div><dt>{b.review ? 'رصيد سابق للمراجعة' : 'المدفوع المؤكد'}</dt><dd>{b.paid.toLocaleString('ar-SA')}</dd></div><div><dt>المتبقي عند تسليم المهر</dt><dd>{b.review ? 'قيد المراجعة' : b.remaining.toLocaleString('ar-SA')}</dd></div></dl>
    <p className="jw-muted">الدفعة الأولى المستهدفة: {b.initial.toLocaleString('ar-SA')} ريال. تستطيع الإدارة اعتماد مبلغ جزئي؛ المتبقي يساوي الإجمالي ناقص الدفعات الفعلية المؤكدة.</p>
    {b.review && <p className="jw-notice">السجل السابق يحتاج مراجعة الإدارة؛ الأرقام المستنتجة ليست مطالبة جديدة ولا إثبات تحويل. لا تسدّد مجدداً قبل مراجعتها.</p>}
    {b.excess > 0 && <p className="jw-alert">يوجد مبلغ زائد {b.excess} ريال يحتاج تسوية مع الإدارة؛ لا يُسترد تلقائياً.</p>}
  </div>;
}
