import { Check, Send, HeartHandshake, Phone, Gem, PartyPopper } from 'lucide-react';
import { displayStage } from '../../lib/journeyWorkflow';
export const JOURNEY_GUIDE = [
  { key: 'sent', short: 'الطلب', title: 'إرسال الطلب والرد عليه', icon: Send, description: 'ترسل طلب توافق، ثم يراجع الطرف الآخر ملفك ويقبل أو يعتذر. إذا كان الملف مستورداً، تحصل الإدارة على قرار صاحبه عبر الخطّابة. لا تُطلب رسوم قبل الموافقة المبدئية.', next: 'بعد القبول: ترتيب الدفعة الأولى مع الإدارة.' },
  { key: 'accepted', short: 'الموافقة', title: 'الموافقة المبدئية والدفعة الأولى', icon: HeartHandshake, description: 'ظهرت الموافقة المبدئية بين الطرفين. تواصل مع الإدارة عبر واتساب لترتيب الدفعة الأولى؛ تُسجّل الإدارة ما استلمته فعلياً، ويمكنها اعتماد مبلغ جزئي. لا يبدأ التنسيق تلقائياً بمجرد إرسال إيصال.', next: 'تعتمد الإدارة بدء التنسيق بعد مراجعة وضع الطرفين.' },
  { key: 'coordination', short: 'التنسيق', title: 'تنسيق التواصل مع أولياء الأمور', icon: Phone, description: 'تتولى الإدارة التنسيق عبر واتساب، وتحصل على الموافقات اللازمة لمشاركة بيانات التواصل مع أولياء الأمور. لا تُنشر أرقام التواصل في صفحة الرحلة ولا تُرسل تلقائياً مقابل الدفع.', next: 'متابعة الخطبة والتأكيدات مع الإدارة.' },
  { key: 'engagement', short: 'الخطبة', title: 'متابعة الخطبة وتسليم المهر', icon: Gem, description: 'تتابع الإدارة المستجدات وتوثّق تأكيد الخطبة وتسليم المهر. بعد تأكيد تسليم المهر يستحق المتبقي من رسومك: إجمالي الرسوم ناقص كل ما سددته فعلياً. المهر ليس دفعة للمنصة.', next: 'توثيق نتيجة الزواج بصورة مستقلة عن الرسوم.' },
  { key: 'completed', short: 'النتيجة', title: 'تسجيل نتيجة الزواج', icon: PartyPopper, description: 'تسجّل الإدارة النتيجة بعد التأكد منها: تم الزواج، أو لم تكتمل الإجراءات، أو توقفت المتابعة، أو تعذّر تأكيد النتيجة. اكتمال السداد أو الوصول لهذه المرحلة لا يعني تلقائياً حصول الزواج.', next: 'تبقى النتيجة والدفعات وتاريخ المتابعة موثّقة.' },
];
export default function JourneyStepper({ stage, selected, onSelect }: { stage: string; selected?: string; onSelect?: (key: string) => void }) {
  const active = displayStage(stage), index = JOURNEY_GUIDE.findIndex(s => s.key === active);
  return <ol className="jr-stepper" aria-label="مراحل رحلة التوافق">{JOURNEY_GUIDE.map((step, i) => {
    const Icon = i < index ? Check : step.icon;
    return <li key={step.key} className={i < index ? 'is-past' : i === index ? 'is-current' : ''} aria-current={i === index ? 'step' : undefined}>
      <button type="button" className={selected === step.key ? 'is-selected' : ''} onClick={() => onSelect?.(step.key)} aria-label={'شرح المرحلة ' + (i + 1) + ': ' + step.title} aria-pressed={selected === step.key}><span className="jr-step-node"><Icon size={18} aria-hidden="true"/></span><span>{step.short}</span></button>
    </li>;
  })}</ol>;
}
