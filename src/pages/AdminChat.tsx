import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Headphones, Plus, Send, Clock, CheckCircle2, AlertCircle, ChevronLeft, Headphones as Support, ShieldCheck } from 'lucide-react';
import { useApp } from '../lib/AppContext';
import { Button } from '../components/ui/Button';
import Modal from '../components/ui/Modal';


const statusConfig = {
  open: { label: 'مفتوحة', color: 'text-sky-600 bg-sky-50', icon: Clock },
  in_progress: { label: 'قيد المعالجة', color: 'text-gold-600 bg-gold-300/15', icon: AlertCircle },
  resolved: { label: 'تم الحل', color: 'text-emerald-600 bg-emerald-50', icon: CheckCircle2 },
  closed: { label: 'مغلقة', color: 'text-navy-400 bg-cream-100', icon: CheckCircle2 },
};

const categories = ['استفسار عام', 'طلب ترقية', 'مشكلة تقنية', 'شكوى', 'اقتراح'] as const;

export default function AdminChat() {
  const {
    showToast,
    supportTickets,
    sendSupportMessage,
    createSupportTicket,
    user,
  } = useApp();

  const activeUserId = user?.isLoggedIn ? user.memberId || '' : '';
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [newTicketOpen, setNewTicketOpen] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<typeof categories[number]>('استفسار عام');
  const [newMessage, setNewMessage] = useState('');

  const activeTicket = supportTickets.find(t => t.id === activeTicketId && t.userId === activeUserId) || null;

  const sendMessage = () => {
    if (!activeUserId || !draft.trim() || !activeTicket) return;
    sendSupportMessage(activeTicket.id, draft, 'user');
    setDraft('');


  };

  const createTicket = () => {
    if (!activeUserId || !newSubject.trim() || !newMessage.trim()) return;
    const created = createSupportTicket(newSubject, newCategory, newMessage, activeUserId);
    setNewTicketOpen(false);
    setNewSubject('');
    setNewMessage('');
    showToast('تم إنشاء تذكرة الدعم بنجاح! 🎫', 'success');
    setActiveTicketId(created.id);
  };

  // Only show tickets relevant to the active user
  const userTickets = supportTickets.filter(t => t.userId === activeUserId);

  if (!activeUserId) return <div dir="rtl" className="max-w-3xl mx-auto p-8 text-center"><h1>الدعم والاستفسارات</h1><p>سجّل الدخول لمراجعة تذاكرك والتواصل مع الإدارة.</p><Link to="/login" className="underline">تسجيل الدخول</Link></div>;

  if (activeTicket) {
    const sc = statusConfig[activeTicket.status] || statusConfig.open;
    return (
      <div className="bg-cream-50 dark:bg-navy-950 min-h-[calc(100vh-5rem)] lg:min-h-screen" dir="rtl">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <button
            onClick={() => setActiveTicketId(null)}
            className="flex items-center gap-2 text-navy-600 dark:text-cream-200 hover:text-gold-700 font-cairo font-semibold text-sm mb-4 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" /> العودة إلى تذاكر الدعم
          </button>

          <div className="bg-white dark:bg-navy-900 rounded-3xl shadow-soft border border-cream-200/60 dark:border-navy-800 overflow-hidden flex flex-col h-[70vh]">
            {/* Header */}
            <div className="flex items-center gap-3 p-3 sm:p-4 border-b border-cream-200 dark:border-navy-800 bg-cream-50/40 dark:bg-navy-950/40">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-navy-gradient flex items-center justify-center flex-shrink-0">
                <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-gold-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-cairo font-bold text-navy-900 dark:text-cream-50 truncate text-sm sm:text-base">{activeTicket.subject}</h3>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.color} flex items-center gap-1`}>
                    <sc.icon className="w-3 h-3" /> {sc.label}
                  </span>
                  <span className="text-xs text-navy-400 dark:text-slate-400 font-tajawal">{activeTicket.category}</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-cream-50/20 dark:bg-navy-950/20">
              {activeTicket.messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className="flex gap-2 max-w-[90%] sm:max-w-[85%]">
                    {msg.sender === 'admin' && (
                      <div className="w-8 h-8 rounded-full bg-navy-gradient flex items-center justify-center flex-shrink-0 mt-1">
                        <Headphones className="w-4 h-4 text-gold-300" />
                      </div>
                    )}
                    <div>
                      <div className={`px-3.5 sm:px-4 py-2.5 rounded-2xl whitespace-pre-line ${
                        msg.sender === 'user'
                          ? 'bg-navy-900 text-white rounded-bl-md dark:bg-navy-700'
                          : 'bg-white dark:bg-navy-800 text-navy-900 dark:text-cream-50 rounded-br-md shadow-soft border border-cream-200/80 dark:border-navy-700 font-semibold'
                      }`}>
                        <p className="font-tajawal text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <span className="text-[10px] mt-1 block text-navy-400 dark:text-slate-400 px-1">
                        {msg.sender === 'admin' ? 'فريق الدعم' : 'أنت'} · {msg.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 sm:p-4 border-t border-cream-200 dark:border-navy-800 flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="اكتب رسالتك لفريق الدعم..."
                className="flex-1 min-w-0 px-3.5 sm:px-4 py-3 rounded-xl bg-cream-50 dark:bg-navy-950 border border-cream-200 dark:border-navy-800 focus:border-gold-400 focus:outline-none font-tajawal text-navy-950 dark:text-cream-50 text-sm sm:text-base"
              />
              <button
                onClick={sendMessage}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gold-gradient flex items-center justify-center text-navy-900 flex-shrink-0 shadow-soft cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                <Send className="w-5 h-5 -scale-x-100" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream-50 dark:bg-navy-950 min-h-screen pb-28 lg:pb-8" dir="rtl">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-5 sm:py-6 font-cairo">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-navy-gradient flex items-center justify-center shadow-md flex-shrink-0">
              <Headphones className="w-5 h-5 sm:w-6 sm:h-6 text-gold-300" />
            </div>
            <div>
              <h1 className="font-cairo font-extrabold text-xl sm:text-2xl text-navy-900 dark:text-cream-50">الدعم والاستفسارات</h1>
              <p className="text-navy-600 dark:text-slate-300 font-tajawal text-xs sm:text-sm text-right">تواصل مع الإدارة لحل مشكلة أو الإجابة عن استفسار</p>
            </div>
          </div>
            <button
              onClick={() => setNewTicketOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold-gradient text-navy-900 font-cairo font-bold text-sm shadow-soft hover:shadow-gold transition-all cursor-pointer self-start sm:self-auto w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" /> تذكرة جديدة
            </button>
        </div>

        {/* Info banner */}
        <div className="bg-navy-gradient rounded-2xl p-3.5 sm:p-4 mb-5 relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 pattern-arabesque opacity-30" />
          <div className="relative flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-gold-300 flex-shrink-0" />
            <p className="text-cream-200/90 font-tajawal text-xs sm:text-sm text-right leading-relaxed">
              <span className="text-gold-300 font-bold">فريق الدعم هنا لمساعدتك.</span> لا ترسل بيانات مالية أو بيانات هوية حساسة في رسالتك.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-cream-200 dark:border-navy-800 bg-white dark:bg-navy-900 p-4 mb-6 text-sm text-navy-700 dark:text-cream-100">
          هذه الصفحة للدعم والاستفسارات فقط. متابعة طلبات التوافق ومراحلها وتوجيهات الإدارة الخاصة بها موجودة في <Link to="/requests" className="underline font-bold">طلباتي</Link>.
        </div>
          <div className="space-y-3">
            {userTickets.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-navy-900 rounded-3xl border border-cream-200 dark:border-navy-800">
                <Support className="w-12 h-12 text-cream-400 dark:text-navy-600 mx-auto mb-2" />
                <p className="text-navy-500 dark:text-slate-400 font-tajawal">لم تفتح أي تذاكر محادثة حالياً.</p>
              </div>
            ) : (
              userTickets.map((ticket) => {
                const sc = statusConfig[ticket.status] || statusConfig.open;
                const lastMsg = ticket.messages[ticket.messages.length - 1];
                return (
                  <button
                    key={ticket.id}
                    onClick={() => setActiveTicketId(ticket.id)}
                    className="w-full flex items-start gap-3 p-3.5 sm:p-4 bg-white dark:bg-navy-900 rounded-2xl shadow-soft border border-cream-200/60 dark:border-navy-800 text-right hover:shadow-luxe hover:border-gold-300 transition-all cursor-pointer"
                  >
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cream-100 dark:bg-navy-800 flex items-center justify-center flex-shrink-0">
                      <Support className="w-5 h-5 text-navy-600 dark:text-cream-200" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                        <h3 className="font-cairo font-bold text-navy-900 dark:text-cream-50 truncate">{ticket.subject}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sc.color} flex items-center gap-1 flex-shrink-0`}>
                          <sc.icon className="w-3 h-3" /> {sc.label}
                        </span>
                      </div>
                      <p className="text-sm text-navy-500 dark:text-slate-400 font-tajawal truncate text-right">
                        {lastMsg ? lastMsg.text : 'لا توجد رسائل بعد'}
                      </p>
                      <p className="text-xs text-navy-400 dark:text-slate-500 font-tajawal mt-1 text-right">
                        {ticket.category} · {ticket.updatedAt}
                      </p>
                    </div>
                    <ChevronLeft className="w-5 h-5 text-navy-300 dark:text-slate-600 flex-shrink-0 mt-1" />
                  </button>
                );
              })
            )}
          </div>
      </div>

      {/* New ticket modal */}
      <Modal open={newTicketOpen} onClose={() => setNewTicketOpen(false)} title="تذكرة دعم واستفسار جديدة">
        <div className="space-y-4 font-cairo">
          <div>
            <label className="block text-sm font-semibold text-navy-800 dark:text-cream-100 mb-2 text-right">الموضوع</label>
            <input
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="موضوع الاستفسار أو المشكلة"
              className="w-full px-4 py-3 rounded-xl bg-cream-50 dark:bg-navy-950 border-2 border-cream-200 dark:border-navy-800 focus:border-gold-500 focus:outline-none font-tajawal text-navy-900 dark:text-cream-50 text-right"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-800 dark:text-cream-100 mb-2 text-right">التصنيف</label>
            <div className="flex flex-wrap gap-2 justify-start">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setNewCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    newCategory === cat
                      ? 'bg-navy-900 text-white dark:bg-gold-gradient dark:text-navy-950 shadow-soft'
                      : 'bg-cream-100 dark:bg-navy-800 text-navy-600 dark:text-cream-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-navy-800 dark:text-cream-100 mb-2 text-right">رسالتك</label>
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={4}
              placeholder="اشرح استفسارك بالتفصيل..."
              className="w-full px-4 py-3 rounded-xl bg-cream-50 dark:bg-navy-950 border-2 border-cream-200 dark:border-navy-800 focus:border-gold-500 focus:outline-none font-tajawal text-navy-900 dark:text-cream-50 text-right resize-none"
            />
          </div>
          <Button fullWidth size="lg" onClick={createTicket}>
            <Send className="w-5 h-5 -scale-x-100" /> إرسال التذكرة
          </Button>
        </div>
      </Modal>
    </div>
  );
}
