import { isFeatured } from '../../shared/membership.js';
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, BadgeCheck, CalendarClock, CheckCircle2, ChevronDown,
  FileCheck, HeartHandshake, Search, Send, ShieldCheck, Users,
} from 'lucide-react';
import MemberCard from '../components/MemberCard';
import { MemberGridSkeleton } from '../components/ui/MemberCardSkeleton';
import { useApp } from '../lib/AppContext';
import { getMemberTimestamp } from '../lib/memberUtils';
import { dataService } from '../lib/data/DataService';
import { COUNTRIES, CITIES_BY_COUNTRY } from '../lib/constants';
import './Home.css';

const overviewSteps = [
  { icon: Search, title: 'ابحث واختر', description: 'تصفّح المعلومات ومواصفات الشريك قبل إرسال الطلب.' },
  { icon: Send, title: 'أرسل طلب توافق', description: 'ينتظر الطلب الموافقة المبدئية قبل متابعة الخطوات.' },
  { icon: HeartHandshake, title: 'تابع من حسابك', description: 'اعرف الإجراء التالي وتابع التنسيق وحالة طلبك.' },
];

const journeySteps = [
  { icon: Send, title: 'طلب التوافق', description: 'اختر الملف المناسب وأرسل طلبك.' },
  { icon: HeartHandshake, title: 'الموافقة المبدئية', description: 'يمكن للطرف الآخر قبول الطلب أو الاعتذار عنه.' },
  { icon: ShieldCheck, title: 'الاستفسار وتأكيد الجدية', description: 'استفسار اختياري بباقة مستقلة، ثم سداد رسوم الجدية المطلوبة للمتابعة.' },
  { icon: CalendarClock, title: 'تنسيق التواصل', description: 'تُحدّد الخطوات بحسب نوع الملف، وتُشارك وسائل التواصل بموافقة الأطراف.' },
  { icon: Users, title: 'النظرة وقرار الطرفين', description: 'يحدّد كل طرف رغبته في الاستمرار أو الاعتذار بعد النظرة الشرعية.' },
  { icon: CheckCircle2, title: 'استكمال الرحلة', description: 'عند اتفاق الطرفين، تُتابع الإجراءات والأتعاب المستحقة وفق الشروط.' },
];

const serviceOptions = [
  { number: '01', title: 'الحساب والبحث الأساسي', label: 'مجاني', description: 'أنشئ ملفك، وابحث بحسب الجنس والدولة والمدينة والعمر، وأرسل طلبات ضمن حدود الحساب.' },
  { number: '02', title: 'توافق مميز', label: 'عضوية اختيارية', description: 'فلاتر بحث إضافية، وحد أعلى للطلبات، وتمييز لملفك. لا تشمل العضوية رسائل الاستفسار أو رسوم الرحلة.' },
  { number: '03', title: 'رسائل الاستفسار', label: 'باقة مستقلة', description: 'تُشترى من داخل رحلة التوافق عند الرغبة في الاستفسار. رصيد الرسائل منفصل عن العضوية.' },
  { number: '04', title: 'رسوم رحلة التوافق', label: 'بحسب المرحلة', description: 'رسوم جدية وأتعاب لاحقة وفق شروط الرحلة. راجع المبلغ والضريبة وشروط الاسترداد قبل السداد.' },
];

const faqs = [
  { question: 'هل أحتاج إلى اشتراك لأبدأ؟', answer: 'لا. التسجيل والبحث الأساسي متاحان مجانًا، ويمكنك إرسال طلبات توافق ضمن حدود الحساب. توافق مميز عضوية اختيارية لمزايا إضافية، وليس شرطًا لبدء البحث.' },
  { question: 'هل العضوية المميزة تشمل الرسائل ورسوم الرحلة؟', answer: 'لا. العضوية المميزة ورسائل الاستفسار ورسوم رحلة التوافق خدمات مستقلة. راجع تفاصيل كل خدمة والمبلغ المعروض قبل الشراء أو السداد.' },
  { question: 'ما الفرق بين العضو المسجّل وملف الوساطة؟', answer: 'العضو المسجّل لديه حساب يتابع منه طلباته. أما ملف الوساطة فتضيفه الإدارة، وتتولى التنسيق بشأنه مع الخطابة أو الجهة المعنية؛ ولا يعني ظهوره أن صاحبه يستخدم حسابًا نشطًا على المنصة.' },
  { question: 'هل جميع الملفات موثّقة؟', answer: 'لا. شارة التوثيق منفصلة عن العضوية المميزة ووسام الجدية. وجود إحدى هذه الشارات لا يعني وجود الشارات الأخرى، ولا يضمن صحة كل معلومة أو نجاح التوافق.' },
  { question: 'ما المعلومات الظاهرة؟ ومتى تُشارك وسائل التواصل؟', answer: 'تُعرض معلومات الملف ومواصفات الشريك للمتصفحين. وفي رحلة الأعضاء المسجّلين يكتب كل طرف وسائل التواصل التي يختار مشاركتها ويؤكد إرسالها. أما ملفات الوساطة فيتولى الفريق التنسيق بشأنها. لا تضع أرقامًا أو بيانات حساسة في النبذة العامة.' },
  { question: 'هل قبول الطلب أو دفع الرسوم يضمن الزواج؟', answer: 'لا. الموافقة المبدئية ليست اتفاقًا نهائيًا، والرسوم لا تضمن إتمام الزواج. الاستمرار أو الاعتذار قرار للطرفين، وتخضع المدفوعات للشروط المعروضة عند السداد.' },
  { question: 'كيف أبلغ عن ملف أو أطلب مساعدة؟', answer: 'استخدم خيار الإبلاغ من ملف العضو عند وجود مخالفة. وللاستفسارات العامة افتح صفحة «اتصل بنا»، أو تواصل مع الإدارة من حسابك لمتابعة طلب قائم.' },
];

export default function Home() {
  const navigate = useNavigate();
  const { members, membersLoading, user, socialSettings } = useApp();
  const isLoggedIn = !!user?.isLoggedIn;
  const [quickGender, setQuickGender] = useState<'female' | 'male' | 'all'>('female');
  const [quickCountry, setQuickCountry] = useState('السعودية');
  const [quickCity, setQuickCity] = useState('');
  const [geoReady, setGeoReady] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.resolve(dataService.db.ensureGeoLoaded?.())
      .catch(() => undefined)
      .finally(() => { if (active) setGeoReady(true); });
    return () => { active = false; };
  }, []);

  const countryOptions = useMemo(() => {
    const names = dataService.db.getCountryNames?.() || [];
    return names.length ? names : COUNTRIES;
  }, [geoReady]);

  const cityOptions = useMemo(() => {
    if (!quickCountry) return [];
    const cities = dataService.db.getCities?.(quickCountry) || [];
    return cities.length ? cities : (CITIES_BY_COUNTRY[quickCountry] || []);
  }, [quickCountry, geoReady]);

  const { featuredMembers, recentMembers } = useMemo(() => {
    const seen = new Set<string>();
    const available = members.filter((member) => {
      if (!member || (member.status && member.status !== 'active')) return false;
      if (!(member.nickname || member.realName || member.id) || seen.has(member.id)) return false;
      seen.add(member.id);
      return true;
    }).sort((a, b) => getMemberTimestamp(b) - getMemberTimestamp(a));
    const featured = available.filter((member) => isFeatured(member)).slice(0, 4);
    const displayedIds = new Set(featured.map((member) => member.id));
    return {
      featuredMembers: featured,
      recentMembers: available.filter((member) => !displayedIds.has(member.id)).slice(0, 4),
    };
  }, [members]);

  const handleQuickSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (quickGender !== 'all') params.set('gender', quickGender);
    if (quickCountry) params.set('country', quickCountry);
    if (quickCity) params.set('city', quickCity);
    navigate(`/search?${params.toString()}`);
  };

  const whatsappNumber = socialSettings?.whatsappNumber?.replace(/[+\s-]/g, '') || '';
  const showWhatsapp = socialSettings?.showWhatsapp && /^\d{7,15}$/.test(whatsappNumber);

  return (
    <div className="home-page" dir="rtl">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-container home-hero-grid">
          <div>
            <p className="home-eyebrow home-eyebrow-light">توافق · بحث ووساطة للزواج</p>
            <h1 id="home-title">ابدأ البحث عن شريك حياة <span>بخطوات واضحة</span></h1>
            <p className="home-hero-description">تصفّح الملفات بحسب مواصفاتك، وأرسل طلب توافق، وتابع مراحل الطلب والتنسيق من حسابك. ولملفات الوساطة المضافة من الإدارة، يتولى الفريق التنسيق مع الجهة المعنية.</p>
            <div className="home-actions">
              <Link className="home-button home-button-gold" to={isLoggedIn ? '/search' : '/register'}>{isLoggedIn ? 'تصفّح الملفات' : 'أنشئ حسابًا مجانيًا'}<ArrowLeft aria-hidden="true" size={18} /></Link>
              <Link className="home-button home-button-light" to={isLoggedIn ? '/profile' : '/search'}>{isLoggedIn ? 'ملفي الشخصي' : 'تصفّح الملفات'}</Link>
            </div>
            <p className="home-free-note">التسجيل والبحث الأساسي مجانيان. العضوية المميزة ورسائل الاستفسار ورسوم رحلة التوافق منفصلة.</p>
            <a className="home-text-link home-link-light" href="#home-fees">ما هو مجاني وما هو مدفوع؟<ArrowLeft aria-hidden="true" size={16} /></a>
          </div>

          <form className="home-search" onSubmit={handleQuickSearch} aria-labelledby="home-search-title">
            <div className="home-search-heading"><Search aria-hidden="true" size={22} /><div><h2 id="home-search-title">ابدأ بحثك</h2><p>اختر الأساسيات، ثم استكشف التفاصيل.</p></div></div>
            <fieldset className="home-gender"><legend>أبحث عن</legend><div className="home-gender-options">{([
              ['female', 'عروس'], ['male', 'عريس'], ['all', 'الجميع'],
            ] as const).map(([value, label]) => <label key={value} className={quickGender === value ? 'is-selected' : ''}><input type="radio" name="home-gender" value={value} checked={quickGender === value} onChange={() => setQuickGender(value)} /><span>{label}</span></label>)}</div></fieldset>
            <div className="home-location-fields">
              <label htmlFor="home-country">الدولة<select id="home-country" value={quickCountry} onChange={(event) => { setQuickCountry(event.target.value); setQuickCity(''); }}><option value="">جميع الدول</option>{countryOptions.map((country) => <option key={country} value={country}>{country}</option>)}</select></label>
              <label htmlFor="home-city">المدينة<select id="home-city" value={quickCity} disabled={!quickCountry} onChange={(event) => setQuickCity(event.target.value)}><option value="">جميع المدن</option>{cityOptions.map((city) => <option key={city} value={city}>{city}</option>)}</select></label>
            </div>
            <button className="home-button home-button-gold home-search-submit" type="submit"><Search aria-hidden="true" size={18} />عرض الملفات</button>
            <p className="home-search-note">يمكنك استخدام البحث الأساسي قبل التسجيل.</p>
          </form>
        </div>
      </section>

      <section className="home-overview" aria-label="الخدمة في ثلاث خطوات">
        <div className="home-container home-overview-grid">{overviewSteps.map((step, index) => <div className="home-overview-item" key={step.title}><span className="home-step-icon"><step.icon aria-hidden="true" size={21} /></span><div><h2><span className="home-step-number">{index + 1}.</span> {step.title}</h2><p>{step.description}</p></div></div>)}</div>
        <div className="home-container"><a className="home-text-link home-overview-link" href="#home-journey">تعرّف على مراحل التوافق<ArrowLeft aria-hidden="true" size={16} /></a></div>
      </section>

      <section id="featured-members" className="home-section" aria-labelledby="featured-members-heading">
        <div className="home-container">
          <div className="home-section-heading"><div><p className="home-eyebrow">اكتشف الملفات</p><h2 id="featured-members-heading">الأعضاء المميزون</h2><p>ملفات تحمل عضوية «توافق مميز». التمييز منفصل عن توثيق الهوية.</p></div><Link className="home-text-link" to="/plans">مزايا توافق مميز<ArrowLeft aria-hidden="true" size={16} /></Link></div>
          <div className="home-member-grid" aria-busy={membersLoading}>{membersLoading && !featuredMembers.length ? <MemberGridSkeleton count={4} /> : featuredMembers.map((member) => <MemberCard key={`featured-${member.id}`} member={member} homePreview />)}</div>
          {!membersLoading && !featuredMembers.length && <div className="home-empty"><p>لا توجد ملفات مميزة متاحة حاليًا.</p><Link className="home-text-link" to="/search">تصفّح بقية الملفات<ArrowLeft aria-hidden="true" size={16} /></Link></div>}
        </div>
      </section>

      <section className="home-section home-section-soft" aria-labelledby="home-recent-title">
        <div className="home-container">
          <div className="home-section-heading"><div><h2 id="home-recent-title">أحدث الملفات</h2><p>اكتشف ملفات أخرى، واطّلع على التفاصيل قبل إرسال طلبك.</p></div><Link className="home-text-link" to="/search">عرض جميع الملفات<ArrowLeft aria-hidden="true" size={16} /></Link></div>
          <div className="home-member-grid" aria-busy={membersLoading}>{membersLoading && !recentMembers.length ? <MemberGridSkeleton count={4} /> : recentMembers.map((member) => <MemberCard key={`recent-${member.id}`} member={member} homePreview />)}</div>
          {!membersLoading && !recentMembers.length && <div className="home-empty"><p>لا توجد ملفات إضافية لعرضها هنا حاليًا.</p><Link className="home-text-link" to="/search">انتقل إلى البحث<ArrowLeft aria-hidden="true" size={16} /></Link></div>}
          <p className="home-section-note"><FileCheck aria-hidden="true" size={18} />بعض الملفات لأعضاء مسجّلين، وبعضها ملفات وساطة تديرها الإدارة. يظهر نوع الملف على بطاقته.</p>
        </div>
      </section>

      <section id="home-journey" className="home-section" aria-labelledby="home-journey-title">
        <div className="home-container">
          <div className="home-section-heading"><div><p className="home-eyebrow">من الطلب إلى القرار</p><h2 id="home-journey-title">كيف تسير رحلة التوافق؟</h2><p>هذه مراحل رحلة الأعضاء المسجّلين. أما ملفات الوساطة فيتولى الفريق التنسيق بشأنها مع الجهة المعنية.</p></div></div>
          <ol className="home-journey-grid">{journeySteps.map((step, index) => <li className="home-journey-step" key={step.title}><div className="home-journey-top"><span className="home-journey-number">{String(index + 1).padStart(2, '0')}</span><step.icon aria-hidden="true" size={23} /></div><h3>{step.title}</h3><p>{step.description}</p></li>)}</ol>
          <p className="home-notice">قبول الطلب أو سداد الرسوم لا يضمن إتمام الزواج؛ قرار الاستمرار للطرفين.</p>
        </div>
      </section>

      <section id="home-fees" className="home-section home-section-soft" aria-labelledby="home-fees-title">
        <div className="home-container">
          <div className="home-section-heading"><div><p className="home-eyebrow">وضوح قبل الالتزام</p><h2 id="home-fees-title">اعرف ما هو مجاني وما هو مدفوع</h2><p>أربع خدمات واضحة. الاشتراك في إحداها لا يعني شمول الخدمات الأخرى.</p></div></div>
          <div className="home-service-grid">{serviceOptions.map((option) => <article key={option.title} className="home-service"><div className="home-service-top"><span className="home-service-number">{option.number}</span><span className="home-service-label">{option.label}</span></div><h3>{option.title}</h3><p>{option.description}</p></article>)}</div>
          <div className="home-fees-footer"><p>تُراجع الأسعار والشروط في صفحة الخدمة وعند السداد، لا من ملخص الرئيسية.</p><Link className="home-text-link" to="/plans">تفاصيل العضوية<ArrowLeft aria-hidden="true" size={16} /></Link><Link className="home-text-link" to="/legal/terms">الشروط والأحكام<ArrowLeft aria-hidden="true" size={16} /></Link></div>
        </div>
      </section>

      <section className="home-section" aria-labelledby="home-privacy-title">
        <div className="home-container home-privacy-grid">
          <div><p className="home-eyebrow">اعرف ما تشاركه</p><h2 id="home-privacy-title">معلومات واضحة،<br />وقرار التواصل لك</h2><p className="home-privacy-description">اطّلع على تفاصيل الملف، وافهم معنى الشارات، وشارك ما تختاره من وسائل التواصل في المرحلة المناسبة.</p><Link className="home-text-link" to="/legal/privacy">اقرأ سياسة الخصوصية<ArrowLeft aria-hidden="true" size={16} /></Link></div>
          <div className="home-privacy-points">
            <div><FileCheck aria-hidden="true" size={23} /><div><h3>النبذة العامة ليست مكانًا للبيانات الحساسة</h3><p>لا تكتب رقم هاتفك أو بيانات هويتك أو معلوماتك المالية في وصف الملف.</p></div></div>
            <div><BadgeCheck aria-hidden="true" size={23} /><div><h3>لكل شارة معنى مختلف</h3><p>العضوية المميزة ليست توثيق هوية، والتوثيق أو وسام الجدية ليس ضمانًا لنجاح العلاقة.</p></div></div>
            <div><HeartHandshake aria-hidden="true" size={23} /><div><h3>مسار مختلف لملفات الوساطة</h3><p>تتولى الإدارة التنسيق مع الجهة المعنية؛ لا تفترض أن صاحب الملف يتابع الطلب بنفسه.</p></div></div>
          </div>
        </div>
      </section>

      <section id="home-faq" className="home-section home-section-soft" aria-labelledby="home-faq-title">
        <div className="home-container home-faq-layout">
          <div><p className="home-eyebrow">قبل أن تبدأ</p><h2 id="home-faq-title">أسئلة تهمك</h2><p className="home-privacy-description">إجابات مختصرة تساعدك على اختيار خطوتك التالية.</p><Link className="home-text-link" to={isLoggedIn ? '/admin-chat' : '/contact'}>تواصل مع الإدارة<ArrowLeft aria-hidden="true" size={16} /></Link>{showWhatsapp && <a className="home-text-link home-whatsapp" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">تواصل عبر واتساب<ArrowLeft aria-hidden="true" size={16} /></a>}</div>
          <div className="home-faq-list">{faqs.map((faq) => <details key={faq.question}><summary>{faq.question}<ChevronDown aria-hidden="true" size={20} /></summary><p>{faq.answer}</p></details>)}</div>
        </div>
      </section>

      <section className="home-section home-final" aria-labelledby="home-final-title">
        <div className="home-container"><div className="home-final-panel"><div><p className="home-eyebrow home-eyebrow-light">خطوتك التالية</p><h2 id="home-final-title">{isLoggedIn ? 'واصل البحث بخطوة واضحة' : 'ابدأ بملف يعبّر عنك بوضوح'}</h2><p>{isLoggedIn ? 'راجع ملفك ومواصفاتك، أو استكشف الملفات وأرسل طلب توافق.' : 'أنشئ حسابك، وأضف معلوماتك ومواصفات الشريك الذي تبحث عنه.'}</p></div><div className="home-actions"><Link className="home-button home-button-gold" to={isLoggedIn ? '/search' : '/register'}>{isLoggedIn ? 'تصفّح الملفات' : 'إنشاء حساب مجاني'}<ArrowLeft aria-hidden="true" size={18} /></Link><Link className="home-button home-button-light" to={isLoggedIn ? '/profile' : '/login'}>{isLoggedIn ? 'مراجعة ملفي' : 'لدي حساب'}</Link></div></div></div>
      </section>
    </div>
  );
}
