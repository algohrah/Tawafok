import type { Plan, Notification, SupportTicket } from './types';
import { MEMBERS, getMemberById } from './members';

// إعادة تصدير الأعضاء والدوال للتوافق مع باقي الصفحات
export { MEMBERS, getMemberById };
export type { Member } from './members';

export const PLANS: Plan[] = [
  { id: 'free', name: 'مجاني', price: 0, period: 'للأبد',
    description: 'ابدأ بالبحث الأساسي وأرسل طلبات التوافق عبر المنصة.',
    features: ['5 طلبات توافق يوميًا', 'فلاتر الجنس والدولة والعمر والمدينة', 'المفضلة واستقبال الطلبات والإشعارات'],
    color: 'navy', messagesLimit: 0, requestsLimit: 5, searchLimit: 999,
    showContactLimit: 0, durationDays: 30, advancedFilters: false },
  { id: 'featured', name: 'توافق مميز', price: 99, period: '30 يومًا',
    description: 'فلاتر كاملة وطلبات أكثر وتمييز واضح لملفك.',
    features: ['20 طلب توافق يوميًا', 'جميع فلاتر البحث، بما فيها البحث بالرمز أو الاسم', 'شارة توافق مميز وقسم الأعضاء المميزون', 'أولوية ظهور بين الملفات المتقاربة في التوافق'],
    popular: true, color: 'gold', messagesLimit: 0, requestsLimit: 20, searchLimit: 999,
    showContactLimit: 0, durationDays: 30, advancedFilters: true },
];

// ===== تذاكر الدعم (التواصل مع الإدارة) =====
export const SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 't1',
    subject: 'استفسار عن توافق مميز',
    category: 'طلب ترقية',
    status: 'resolved',
    priority: 'normal',
    updatedAt: 'قبل ساعتين',
    messages: [
      { id: '1', sender: 'user', text: 'السلام عليكم، أود الاستفسار عن مزايا توافق مميز بالتفصيل', time: '10:00 ص' },
      { id: '2', sender: 'admin', text: 'وعليكم السلام، أهلًا بك. توافق مميز يمنحك 20 طلب توافق يوميًا وفلاتر متقدمة وشارة مميزة وأولوية ظهور تراعي التوافق. رسوم الرحلة مستقلة عن العضوية. هل ترغب بالترقية الآن؟', time: '10:15 ص' },
      { id: '3', sender: 'user', text: 'شكرًا لكم على الشرح الوافي 🌹', time: '10:20 ص' },
    ],
  },
  {
    id: 't2',
    subject: 'تعديل بيانات الملف الشخصي',
    category: 'استفسار عام',
    status: 'in_progress',
    priority: 'low',
    updatedAt: 'أمس',
    messages: [
      { id: '1', sender: 'user', text: 'أحتاج تعديل مدينتي في الملف الشخصي', time: 'أمس 2:00 م' },
      { id: '2', sender: 'admin', text: 'أهلًا بك، يمكنك تعديل مدينتك من صفحة «حسابي» ثم «تعديل الملف الشخصي». هل تحتاج مساعدة إضافية؟', time: 'أمس 2:30 م' },
    ],
  },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'match', text: 'تم إيجاد 3 ملفات جديدة متوافقة معك', time: 'قبل 5 دقائق', read: false },
  { id: 'n2', type: 'request', text: 'تم قبول طلب الاهتمام الخاص بك من الإدارة', time: 'قبل 20 دقيقة', read: false },
  { id: 'n3', type: 'admin', text: 'رسالة جديدة من فريق الدعم حول تذكرتك', time: 'قبل ساعة', read: false },
  { id: 'n4', type: 'verification', text: 'تهانينا! تم توثيق حسابك بنجاح ✓', time: 'قبل 3 ساعات', read: true },
  { id: 'n5', type: 'system', text: 'تم تحديث سياسة الخصوصية، يرجى الاطلاع', time: 'منذ يومين', read: true },
];

export const TESTIMONIALS = [
  {
    name: 'أحمد و سارة',
    city: 'الرياض',
    story: 'التقينا عبر توافق قبل عام، وكانت أفضل قرار اتخذته. نظام الوساطة المهنية أعطاني ثقة كبيرة. شكراً لكم.',
    duration: 'متزوجان منذ 8 أشهر',
  },
  {
    name: 'محمد و فاطمة',
    city: 'جدة',
    story: 'كنت متردداً في البداية، لكن النظام الموثوق والتحقق من الحسابات طمأنني. اليوم أنا أسعد رجل.',
    duration: 'متزوجان منذ سنة',
  },
  {
    name: 'عبدالرحمن و ريم',
    city: 'الدمام',
    story: 'البحث المتقدم ساعدني في العثور على شريكة تشاركني القيم والاهتمامات. تجربة استثنائية وراقية.',
    duration: 'متزوجان منذ 6 أشهر',
  },
];

export const STATS = [
  { label: 'عضو موثّق', value: '+150 ألف' },
  { label: 'قصة زواج ناجح', value: '+12 ألف' },
  { label: 'زيارات يومية', value: '+25 ألف' },
  { label: 'دعم على مدار الساعة', value: '24/7' },
];

export const TEAM = [
  { name: 'د. منى السالم', role: 'مستشار العلاقات', gender: 'female' as const },
  { name: 'أ. خالد المنصور', role: 'مدير المنتج', gender: 'male' as const },
  { name: 'د. سعاد الحربي', role: 'مستشار أسري', gender: 'female' as const },
];

export function getMemberByIdLocal(id: string) {
  return MEMBERS.find((m) => m.id === id);
}

export function getNotificationMember(notif: Notification) {
  return notif.memberId ? getMemberById(notif.memberId) : undefined;
}

// طلبات التوافق (تُرسل عبر الإدارة)
// ===== حالات الطلب الموسّعة (7 مراحل) =====
export type RequestStatus =
  | 'pending'                    // ⏱️ الطلب مرسل، في انتظار رد الطرف الآخر
  | 'accepted_pending_admin'     // ⏳ تم القبول من الطرف الآخر، بانتظار موافقة الإدارة والتحقق
  | 'accepted_pending_payment'   // 💳 تم القبول والموافقة، بانتظار سداد رسوم تأكيد الجدية من الطرفين
  | 'paid'                       // ✅ تم السداد من الطرفين، الطلب جاهز للوساطة
  | 'in_mediation'               // 🤝 الوساطة جارية
  | 'completed'                  // 🎉 تم اللقاء/الاتصال
  | 'declined'                   // ❌ تم الرفض من الطرف الآخر
  | 'cancelled';                 // ⬜ تم الإلغاء لعدم السداد أو لعدم التوافق

// ===== مراحل الوساطة الأربعة =====
export type MediationStage =
  | 'scheduling'     // تنسيق موعد
  | 'confirming'     // تأكيد الموعد
  | 'exchanging'     // إرسال الأرقام للتواصل
  | 'evaluating';    // تقييم النتيجة

export interface PreExchangeMessage {
  senderId: string;
  text: string;
  time: string;
}

export interface InterestRequest {
  id: string;
  requestNumber?: number;         // الرقم التسلسلي بحسب الفئة (مسجلين / مستوردين)
  sourceType?: 'registered' | 'imported'; // نوع المصدر
  senderId: string;    // من مرسل الطلب
  receiverId: string;  // من مستلم الطلب
  status: RequestStatus;
  message: string;
  time: string;
  adminNotes?: string;   // ملاحظات خاصة بالإدارة
  meetingDate?: string;  // موعد التواصل الشرعي أو التنسيقي
  meetingNotes?: string; // إرشادات وملاحظات موعد اللقاء أو الاتصال
  declineReason?: string; // سبب الرفض
  paymentStatus?: 'waiting_for_payment' | 'paid'; // حالة سداد رسوم الجدية (500 ريال)
  senderPaid?: boolean;           // هل دفع مرسل الطلب رسوم الجدية
  receiverPaid?: boolean;         // هل دفع مستقبل الطلب رسوم الجدية
  senderPaidAmount?: number;      // المبلغ المدفوع من المرسل
  receiverPaidAmount?: number;    // المبلغ المدفوع من المستقبل
  senderPaidAt?: string;          // وقت سداد المرسل
  receiverPaidAt?: string;        // وقت سداد المستقبل
  // ===== حقول النظام الموسّع =====
  paymentDeadline?: string;       // موعد انتهاء فترة السداد (30 يوم)
  paidAt?: string;                // تاريخ السداد الفعلي
  mediationStage?: MediationStage; // المرحلة الحالية للوساطة
  evaluationResult?: 'success' | 'failed' | null; // نتيجة التقييم بعد اللقاء
  evaluationNote?: string;        // ملاحظة التقييم
  cancelReason?: string;          // سبب الإلغاء
  refundPercentage?: number;      // نسبة الاسترداد (50% قبل اللقاء، 0% بعد اللقاء)
  attemptsCount?: number;         // عدد محاولات التواصل المتبقية قبل طلب رسوم جدية جديدة
  supportTicketId?: string;       // رقم تذكرة الدعم المرتبطة
  createdAt?: number;             // طابع زمني للإنشاء
  // ===== حقول الاستفسار المبكر والشات الثنائي =====
  preExchangeChoice?: 'chat' | 'direct_deposit' | null;
  senderChatUnlocked?: boolean;
  receiverChatUnlocked?: boolean;
  senderChatCredits?: number;
  receiverChatCredits?: number;
  senderNoMoney?: boolean;
  receiverNoMoney?: boolean;
  chatMessages?: PreExchangeMessage[];
  senderExemptionStatus?: 'pending' | 'approved' | 'rejected' | null;
  receiverExemptionStatus?: 'pending' | 'approved' | 'rejected' | null;
  senderExemptionReason?: string;
  receiverExemptionReason?: string;
  senderExempted?: boolean;
  receiverExempted?: boolean;
}

// ===== إعدادات رسوم السعي والتنسيق =====
export const FEE_CONFIG = { depositAmount: 500, finalFeeAmount: 2000 };

// Clean journey workflow: no seeded or historical requests.
export const INTEREST_REQUESTS: InterestRequest[] = [];
