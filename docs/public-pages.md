# الصفحات العامة والزوار

> نطاق التحقق: قراءة ساكنة لمصادر GitHub عند Commit `f5cf1caf48cfa2240e4f41fb504aeec759f49802`. لم تُشغّل المنصة أو تُختبر حسابات أو مدفوعات حقيقية. «مؤكد من المصدر» لا يعني «مختبر في الموقع المنشور».

هذه الصفحات مسجلة في Layout العام. ما يتاح فعلياً يتأثر بالإعدادات والبيانات وحالة الدخول، وليس بمسمى الملف فقط.

## العناصر المشتركة
الترويسة والتنقل للجوال والتذييل والتنبيهات وشريط انتحال العضو. التذييل مخفي في البحث والدفع والطلبات ومحادثة الإدارة والإشعارات والملف؛ زر واتساب مشروط showWhatsapp ورقم صالح.

### src/components/ui/Header.tsx
- الرئيسية — `src/components/ui/Header.tsx:20`
- البحث — `src/components/ui/Header.tsx:21`
- الباقات — `src/components/ui/Header.tsx:22`
- من نحن — `src/components/ui/Header.tsx:23`
- طلباتي — `src/components/ui/Header.tsx:130`
- اتصل بنا — `src/components/ui/Header.tsx:427`
- لوحة الإدارة — `src/components/ui/Header.tsx:428`
- القائمة — `src/components/ui/Header.tsx:125`
- الإشعارات — `src/components/ui/Header.tsx:172`
- إغلاق — `src/components/ui/Header.tsx:219`
- حذف — `src/components/ui/Header.tsx:273`
- الحساب — `src/components/ui/Header.tsx:304`
**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `onFocus`, `onVisible`, `handleClick`, `handleLogout`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/`, `/notifications`, `/profile`, `/complete-profile`, `/plans`, `/login`, `/register`, `/contact`

### src/components/layout/MobileNav.tsx
- الرئيسية — `src/components/layout/MobileNav.tsx:10`
- البحث — `src/components/layout/MobileNav.tsx:11`
- طلباتي — `src/components/layout/MobileNav.tsx:12`
- الدعم — `src/components/layout/MobileNav.tsx:13`
- حسابي — `src/components/layout/MobileNav.tsx:14`
- دخول — `src/components/layout/MobileNav.tsx:21`
- سجّل — `src/components/layout/MobileNav.tsx:22`
**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `onFocus`, `onVisible`, `openTickets`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

### src/components/layout/Footer.tsx
- من نحن — `src/components/layout/Footer.tsx:10`
- الباقات — `src/components/layout/Footer.tsx:11`
- اتصل بنا — `src/components/layout/Footer.tsx:12`
- سياسة الخصوصية — `src/components/layout/Footer.tsx:13`
- الشروط والأحكام — `src/components/layout/Footer.tsx:14`
- واتساب — `src/components/layout/Footer.tsx:59`
- تويتر — `src/components/layout/Footer.tsx:70`
- إنستغرام — `src/components/layout/Footer.tsx:81`
- فيسبوك — `src/components/layout/Footer.tsx:92`
**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** مكوّن عرض/معالجات inline

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

### src/components/MemberCard.tsx
- العمر — `src/components/MemberCard.tsx:113`
- الحالة — `src/components/MemberCard.tsx:114`
- العمل — `src/components/MemberCard.tsx:115`
- ملف مرفوع من قبل الإدارة — `src/components/MemberCard.tsx:79`
- موثّق — `src/components/MemberCard.tsx:84`
- وسام الجدية المعتمد — `src/components/MemberCard.tsx:91`
- حفظ الملف — `src/components/MemberCard.tsx:161`
**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleOpenModal`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/login`

### src/components/MemberProfileModal.tsx
- ملف وساطة مرفوع من قبل الإدارة — `src/components/MemberProfileModal.tsx:372`
- إبلاغ الإدارة عن العضو — `src/components/MemberProfileModal.tsx:929`
- عرض الصفحة الكاملة — `src/components/MemberProfileModal.tsx:275`
- الانتقال إلى الصفحة الكاملة — `src/components/MemberProfileModal.tsx:276`
- إغلاق النافذة — `src/components/MemberProfileModal.tsx:286`
- إغلاق نافذة ملف العضو — `src/components/MemberProfileModal.tsx:287`
- حساب موثّق — `src/components/MemberProfileModal.tsx:310`
- ملف مرفوع من قبل الإدارة — `src/components/MemberProfileModal.tsx:333`
- العمر — `src/components/MemberProfileModal.tsx:356`
- الجنسية — `src/components/MemberProfileModal.tsx:357`
- المدينة — `src/components/MemberProfileModal.tsx:358`
- الحالة — `src/components/MemberProfileModal.tsx:359`
- التعليم — `src/components/MemberProfileModal.tsx:360`
- العمل — `src/components/MemberProfileModal.tsx:361`
- المعلومات الشخصية — `src/components/MemberProfileModal.tsx:385`
- الجنس — `src/components/MemberProfileModal.tsx:391`
- الدولة — `src/components/MemberProfileModal.tsx:393`
- الحي / المنطقة — `src/components/MemberProfileModal.tsx:395`
- المذهب — `src/components/MemberProfileModal.tsx:397`
- القبيلة / النسب — `src/components/MemberProfileModal.tsx:399`
- العرق / الأصل — `src/components/MemberProfileModal.tsx:402`
- الحالة الاجتماعية والسكن والأبناء — `src/components/MemberProfileModal.tsx:410`
- الحالة الاجتماعية — `src/components/MemberProfileModal.tsx:416`
- نوع الزواج — `src/components/MemberProfileModal.tsx:418`
- عدد الزوجات الحالي — `src/components/MemberProfileModal.tsx:421`
- التعدد / رغبة الزواج — `src/components/MemberProfileModal.tsx:424`
- وجود أبناء — `src/components/MemberProfileModal.tsx:429`
- عدد الأبناء — `src/components/MemberProfileModal.tsx:437`
- إقامة الأبناء — `src/components/MemberProfileModal.tsx:440`
- نوع السكن — `src/components/MemberProfileModal.tsx:443`
- التعليم والعمل — `src/components/MemberProfileModal.tsx:452`
- المؤهل العلمي — `src/components/MemberProfileModal.tsx:458`
- جهة العمل — `src/components/MemberProfileModal.tsx:459`
- المسمى الوظيفي — `src/components/MemberProfileModal.tsx:460`
- المواصفات الجسدية والصحية — `src/components/MemberProfileModal.tsx:469`
- الطول — `src/components/MemberProfileModal.tsx:475`
- الوزن — `src/components/MemberProfileModal.tsx:476`
- لون البشرة — `src/components/MemberProfileModal.tsx:477`
- الحالة الصحية — `src/components/MemberProfileModal.tsx:478`
- التدخين — `src/components/MemberProfileModal.tsx:479`
- مراسلة إدارة الموقع عبر واتساب — `src/components/MemberProfileModal.tsx:614`
- خيارات إضافية — `src/components/MemberProfileModal.tsx:648`
- أو اكتب تفاصيل البلاغ هنا... — `src/components/MemberProfileModal.tsx:965`
**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleEscape`, `toggleSection`, `handleCopyMemberData`, `handleCopyLink`, `handleShareWhatsApp`, `handleViewFullPage`, `handleSendInterest`, `handleReportSubmit`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/member/${member.id}`, `/journey/${res.data.id}`, `/register`, `/journey/${latestRequest.id}`, `/login`

## PUB-01 — Home

**المسارات:** `/`

**المصدر:** [`src/pages/Home.tsx`](../src/pages/Home.tsx)

**وظائف مؤكدة من المصدر:** واجهة تعريف وتسويق؛ بحث سريع ينقل الفلاتر إلى البحث المتقدم؛ أعضاء مميزون وأحدث الأعضاء؛ الثقة والميزات ومراحل التوافق والإشراف والتجارب ودعوات التسجيل والباقات.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleQuickSearch`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/search?${params.toString()}`, `/search`, `/profile`, `/register`, `/plans`

### جرد الأقسام والعناوين وخيارات الواجهة الثابتة
- تنسيق وتعاون مع الخطابات — `src/pages/Home.tsx:25`
- متابعة وتصفية مستمرة — `src/pages/Home.tsx:32`
- خصوصية وسرية تامة — `src/pages/Home.tsx:39`
- بيئة للزواج الجاد — `src/pages/Home.tsx:46`
- شبكة واسعة من الخطابات — `src/pages/Home.tsx:54`
- خصوصية وحماية البيانات — `src/pages/Home.tsx:55`
- بحث وفلاتر دقيقة — `src/pages/Home.tsx:56`
- إشراف ومتابعة إدارية — `src/pages/Home.tsx:57`
- أرسل طلب توافق — `src/pages/Home.tsx:61`
- الموافقة المبدئية — `src/pages/Home.tsx:62`
- تأكيد الجدية — `src/pages/Home.tsx:63`
- التنسيق والوساطة — `src/pages/Home.tsx:64`
- النظرة والتواصل الشرعي — `src/pages/Home.tsx:65`
- إتمام التوافق — `src/pages/Home.tsx:66`
- ابدأ رحلة العمر مع — `src/pages/Home.tsx:163`
- شريك الحياة المناسب — `src/pages/Home.tsx:163`
- بحث سريع عن شريك — `src/pages/Home.tsx:221`
- اختر المواصفات الأساسية وانتقل للبحث المتقدم — `src/pages/Home.tsx:221`
- عروس (امرأة) — `src/pages/Home.tsx:238`
- عريس (رجل) — `src/pages/Home.tsx:239`
- الجميع — `src/pages/Home.tsx:240`
- الأعضاء المميزون — `src/pages/Home.tsx:327`
- أعضاء توافق مميز — اختر الملف الأنسب لك وابدأ طلب توافق. — `src/pages/Home.tsx:327`
- أحدث الأعضاء — `src/pages/Home.tsx:344`
- الباحثين عن شريك الحياة — `src/pages/Home.tsx:344`
- لماذا يثق الباحثون والخطابات في منصة توافق؟ — `src/pages/Home.tsx:407`
- منصة تُبنى على — `src/pages/Home.tsx:438`
- الثقة والوضوح والجدية — `src/pages/Home.tsx:438`
- مسار منظم ومباشر — `src/pages/Home.tsx:478`
- من الطلب حتى الزواج — `src/pages/Home.tsx:478`
- بيئة نقية — `src/pages/Home.tsx:527`
- بإشراف ومتابعة مستمرة — `src/pages/Home.tsx:527`
- إشراف وتنسيق مباشر — `src/pages/Home.tsx:588`
- متابعة دورية لحذف الحسابات غير المتفاعلة أو غير الجادة، مع توفير خيار توثيق الهوية الرسمي بشارة معتمدة. — `src/pages/Home.tsx:588`
- تشفير كامل — `src/pages/Home.tsx:596`
- متابعة دورية — `src/pages/Home.tsx:597`
- بيانات محمية — `src/pages/Home.tsx:598`
- تجارب مباركة — `src/pages/Home.tsx:616`
- نحو بناء أسرة — `src/pages/Home.tsx:616`
- نحن ننسق مع نخبة من الخطابات ونراجع البيانات باستمرار مع حفظ الخصوصية التامة لنسهل لك الوصول إلى شريك الحياة. — `src/pages/Home.tsx:441`
- خطوات واضحة تبدأ باختيار الشريك وإرسال طلب التوافق وتنتهي بالتنسيق الشرعي والمبارك تحت إشراف الإدارة. — `src/pages/Home.tsx:481`
- نحرص على تصفية الحسابات غير الجادة دورياً، وحماية بيانات التواصل وعدم مشاركتها إلا بموافقة صريحة. — `src/pages/Home.tsx:532`
- تجارب وتطلعات مباركة نحو بناء أسرة مستقرة على هدي وسنة. — `src/pages/Home.tsx:619`
- السابق — `src/pages/Home.tsx:662`
- التالي — `src/pages/Home.tsx:684`

**حالة التحقق:** المصدر فقط؛ العرض الفعلي، جميع الفروع الشرطية، التحقق من الحقول والأثر النهائي تحتاج اختباراً موجهاً قبل إعلان نجاح الوظيفة.

## PUB-02 — Search

**المسارات:** `/search`

**المصدر:** [`src/pages/Search.tsx`](../src/pages/Search.tsx)

**وظائف مؤكدة من المصدر:** بحث مجاني بالجنس والدولة والمدينة والعمر؛ البحث بالرمز/الاسم وبقية الفلاتر مرتبطة بتوافق مميز. نتائج وبطاقات أعضاء، إعادة ضبط، تحميل وخطأ وفراغ. عند اختيار الجميع تُختزل خيارات الفلترة.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleGenderChange`, `handleSearch`

**حقول معنونة إضافية:** الدولة؛ المدينة؛ عدد الأبناء؛ المذهب؛ الجنسية؛ التعليم؛ نوع العمل

**وجهات ظاهرة في المصدر:** `/plans`

### جرد الأقسام والعناوين وخيارات الواجهة الثابتة
- البحث المتقدم — `src/pages/Search.tsx:324`
- خصّص بحثك بدقة للعثور على شريك الحياة المناسب — `src/pages/Search.tsx:324`
- ابحث بكود العضو (مثل m1)، أو المسمى الوظيفي، أو الاسم المستعار... — `src/pages/Search.tsx:345`
- أبحث عن — `src/pages/Search.tsx:359`
- الجميع — `src/pages/Search.tsx:363`
- رجال — `src/pages/Search.tsx:367`
- نساء — `src/pages/Search.tsx:371`
- الدولة والمدينة — `src/pages/Search.tsx:383`
- الدولة — `src/pages/Search.tsx:385`
- كل الدول — `src/pages/Search.tsx:386`
- المدينة — `src/pages/Search.tsx:387`
- الفئة العمرية — `src/pages/Search.tsx:394`
- عدد الأبناء — `src/pages/Search.tsx:510`
- اختر العدد — `src/pages/Search.tsx:511`
- المذهب — `src/pages/Search.tsx:596`
- كل المذاهب — `src/pages/Search.tsx:597`
- الجنسية — `src/pages/Search.tsx:600`
- كل الجنسيات — `src/pages/Search.tsx:601`
- التعليم — `src/pages/Search.tsx:605`
- الكل — `src/pages/Search.tsx:606`
- نوع العمل — `src/pages/Search.tsx:607`

**حالة التحقق:** المصدر فقط؛ العرض الفعلي، جميع الفروع الشرطية، التحقق من الحقول والأثر النهائي تحتاج اختباراً موجهاً قبل إعلان نجاح الوظيفة.

## PUB-03 — MemberProfile

**المسارات:** `/member/:id`, `/u/:username`

**المصدر:** [`src/pages/MemberProfile.tsx`](../src/pages/MemberProfile.tsx)

**وظائف مؤكدة من المصدر:** ملف عام بالمعرف أو اسم المستخدم: بيانات العضو ومواصفاته وشريكه وشاراته، مشاركة ونسخ ورابط واتساب الإدارة، طلب توافق وبلاغ. الزائر يوجّه للتسجيل/الدخول عند الإجراءات؛ عضو يشاهد حسابه يُعرض له رابط التعديل. الملف المستورد له تنبيه وساطة ومسار إداري.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `onScroll`, `handleCopyLink`, `handleCopyMemberData`, `handleShareWhatsApp`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/search`, `/register`, `/journey/${latestRequest.id}`, `/login`, `/edit-profile`, `/journey/${res.data.id}`, `/plans`

### جرد الأقسام والعناوين وخيارات الواجهة الثابتة
- العضو غير موجود — `src/pages/MemberProfile.tsx:184`
- قد يكون الحساب محذوفاً أو غير متاح — `src/pages/MemberProfile.tsx:184`
- ملف وساطة مرفوع من قبل الإدارة — `src/pages/MemberProfile.tsx:564`
- وساطة احترافية وسرية تامة — `src/pages/MemberProfile.tsx:690`
- التواصل يتم حصريًا عبر فريق الإدارة لضمان الخصوصية والجدية. عند إرسال طلب توافق، ستتولى الإدارة التنسيق والربط بين الطرفين وفق ضوابط التوافق الشرعي. — `src/pages/MemberProfile.tsx:690`
- حالة العضو — `src/pages/MemberProfile.tsx:707`
- التوثيق — `src/pages/MemberProfile.tsx:712`
- العضوية — `src/pages/MemberProfile.tsx:716`
- الجنس — `src/pages/MemberProfile.tsx:720`
- المذهب — `src/pages/MemberProfile.tsx:721`
- خصوصية تامة — `src/pages/MemberProfile.tsx:739`
- لا تظهر معلومات التواصل للأعضاء. عبر — `src/pages/MemberProfile.tsx:739`
- مشاركة ونسخ الملف — `src/pages/MemberProfile.tsx:754`
- رجوع — `src/pages/MemberProfile.tsx:296`
- مراسلة إدارة الموقع عبر واتساب — `src/pages/MemberProfile.tsx:300`
- نسخ الرابط — `src/pages/MemberProfile.tsx:303`
- ملف مرفوع من قبل الإدارة — `src/pages/MemberProfile.tsx:347`
- خيارات إضافية — `src/pages/MemberProfile.tsx:471`
- المعلومات الأساسية والشخصية — `src/pages/MemberProfile.tsx:578`
- العمر — `src/pages/MemberProfile.tsx:581`
- الدولة — `src/pages/MemberProfile.tsx:582`
- المدينة — `src/pages/MemberProfile.tsx:583`
- الحي / المنطقة — `src/pages/MemberProfile.tsx:584`
- الجنسية — `src/pages/MemberProfile.tsx:585`
- القبيلة / النسب — `src/pages/MemberProfile.tsx:588`
- العرق / الأصل — `src/pages/MemberProfile.tsx:591`
- الحالة الاجتماعية والسكن والأبناء والتعدد — `src/pages/MemberProfile.tsx:597`
- الحالة الاجتماعية — `src/pages/MemberProfile.tsx:599`
- نوع الزواج — `src/pages/MemberProfile.tsx:601`
- عدد الزوجات الحالي — `src/pages/MemberProfile.tsx:604`
- التعدد / رغبة الزواج — `src/pages/MemberProfile.tsx:607`
- وجود أبناء — `src/pages/MemberProfile.tsx:612`
- عدد الأبناء — `src/pages/MemberProfile.tsx:620`
- إقامة الأبناء — `src/pages/MemberProfile.tsx:623`
- نوع السكن — `src/pages/MemberProfile.tsx:626`
- التعليم والعمل — `src/pages/MemberProfile.tsx:632`
- المؤهل العلمي — `src/pages/MemberProfile.tsx:634`
- جهة العمل / القطاع — `src/pages/MemberProfile.tsx:635`
- المسمى الوظيفي — `src/pages/MemberProfile.tsx:636`
- المواصفات الجسدية والصحية — `src/pages/MemberProfile.tsx:641`
- الطول — `src/pages/MemberProfile.tsx:643`
- الوزن — `src/pages/MemberProfile.tsx:644`
- لون البشرة — `src/pages/MemberProfile.tsx:645`
- الحالة الصحية — `src/pages/MemberProfile.tsx:646`
- التدخين — `src/pages/MemberProfile.tsx:647`
- نبذة عني (عن نفسي) — `src/pages/MemberProfile.tsx:652`
- أبحث عن (مواصفات الشريك المطلوب) — `src/pages/MemberProfile.tsx:659`
- طلب التنسيق المباشر ودفع رسوم المنصة — `src/pages/MemberProfile.tsx:977`
- اكتب رسالة اهتمام مخصصة أو اختر من القوالب أعلاه... — `src/pages/MemberProfile.tsx:1045`
- ⚠️ إرسال بلاغ — `src/pages/MemberProfile.tsx:1085`
- اكتب تفاصيل البلاغ بوضوح... — `src/pages/MemberProfile.tsx:1099`

**حالة التحقق:** المصدر فقط؛ العرض الفعلي، جميع الفروع الشرطية، التحقق من الحقول والأثر النهائي تحتاج اختباراً موجهاً قبل إعلان نجاح الوظيفة.

## PUB-04 — About

**المسارات:** `/about`

**المصدر:** [`src/pages/About.tsx`](../src/pages/About.tsx)

**وظائف مؤكدة من المصدر:** القصة والرسالة والرؤية والمبادئ والفريق وقسم الدعم ورابط واتساب. النصوص التعريفية ليست تدقيقاً مستقلاً للخدمات أو الأمن.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** مكوّن عرض/معالجات inline

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

### جرد الأقسام والعناوين وخيارات الواجهة الثابتة
- الأمان — `src/pages/About.tsx:11`
- الجدية — `src/pages/About.tsx:12`
- المجتمع — `src/pages/About.tsx:13`
- الجودة — `src/pages/About.tsx:14`
- من نحن — `src/pages/About.tsx:28`
- توافق هي منصة زواج عربية عصرية وُلدت من إيمان عميق بأن لكل شخص شريكًا ينتظره. نحن نربط القلوب بثقة وخصوصية تامة. — `src/pages/About.tsx:28`
- رسالتنا — `src/pages/About.tsx:55`
- تسهيل رحلة البحث عن شريك الحياة في بيئة آمنة وموثوقة تحترم القيم العربية والإسلامية، باستخدام أحدث الفلاتر المتقدمة والربط المباشر الميسر وبإشراف بشري كامل. — `src/pages/About.tsx:55`
- رؤيتنا — `src/pages/About.tsx:64`
- أن نكون المنصة العربية الأولى للزواج الموثوق، ومرجعًا موثوقًا في بناء العلاقات الجادة التي تنتهي بزواج سعيد وناجح. — `src/pages/About.tsx:64`
- مبادئ — `src/pages/About.tsx:75`
- نلتزم بها — `src/pages/About.tsx:75`
- الناس — `src/pages/About.tsx:93`
- خلف توافق — `src/pages/About.tsx:93`
- الدعم الفني وخدمة العملاء — `src/pages/About.tsx:112`
- يسعد فريقنا المؤهل الرد على استفساراتكم بخصوص باقات الاشتراكات والمطابقة والمساعدة الفنية على مدار الساعة. — `src/pages/About.tsx:112`
- فريق من الخبراء المتفانين في خدمتك. — `src/pages/About.tsx:93`
- تويتر — `src/pages/About.tsx:138`
- إنستغرام — `src/pages/About.tsx:149`
- فيسبوك — `src/pages/About.tsx:160`

**حالة التحقق:** المصدر فقط؛ العرض الفعلي، جميع الفروع الشرطية، التحقق من الحقول والأثر النهائي تحتاج اختباراً موجهاً قبل إعلان نجاح الوظيفة.

## PUB-05 — Contact

**المسارات:** `/contact`

**المصدر:** [`src/pages/Contact.tsx`](../src/pages/Contact.tsx)

**وظائف مؤكدة من المصدر:** معلومات اتصال وساعات وعنوان؛ نموذج الاسم والبريد والموضوع والرسالة وحالة نجاح؛ user_id للزائر visitor. لا يثبت نجاح النموذج وصول رسالة بريد خارجية.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleSubmit`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

### جرد الأقسام والعناوين وخيارات الواجهة الثابتة
- اتصل بنا — `src/pages/Contact.tsx:49`
- نحن هنا لمساعدتك. تواصل معنا في أي وقت وسنرد عليك بأسرع ما يمكن. — `src/pages/Contact.tsx:49`
- البريد الإلكتروني — `src/pages/Contact.tsx:59`
- الهاتف — `src/pages/Contact.tsx:60`
- العنوان — `src/pages/Contact.tsx:61`
- ساعات العمل — `src/pages/Contact.tsx:62`
- أرسل لنا رسالة — `src/pages/Contact.tsx:79`
- سنرد عليك في أقرب وقت ممكن. — `src/pages/Contact.tsx:79`
- تم إرسال رسالتك! — `src/pages/Contact.tsx:87`
- شكراً لتواصلك معنا. سنرد عليك قريبًا. — `src/pages/Contact.tsx:87`
- اسمك — `src/pages/Contact.tsx:95`
- موضوع رسالتك — `src/pages/Contact.tsx:104`
- اكتب رسالتك هنا... — `src/pages/Contact.tsx:108`

**حالة التحقق:** المصدر فقط؛ العرض الفعلي، جميع الفروع الشرطية، التحقق من الحقول والأثر النهائي تحتاج اختباراً موجهاً قبل إعلان نجاح الوظيفة.

## PUB-06 — Plans

**المسارات:** `/plans`

**المصدر:** [`src/pages/Plans.tsx`](../src/pages/Plans.tsx)

**وظائف مؤكدة من المصدر:** مجاني وتوافق مميز؛ واجهة العضوية تعرض 99 ريال/30 يوماً. رسائل الاستفسار ورسوم الرحلة مستقلة ولا يمنح الاشتراك رصيد رسائل. راجع إعدادات وخدمة العضوية عند تغيير الأسعار.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** مكوّن عرض/معالجات inline

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/search`

### جرد الأقسام والعناوين وخيارات الواجهة الثابتة
- مجاني أو توافق مميز — `src/pages/Plans.tsx:9`
- خياران واضحان، والرسائل ورسوم رحلة التوافق مستقلة عن العضوية. — `src/pages/Plans.tsx:9`
- ريال / 30 يومًا — `src/pages/Plans.tsx:16`
- السعر النهائي للعضوية: 99 ريال — `src/pages/Plans.tsx:16`
- الرسائل ليست ضمن العضوية — `src/pages/Plans.tsx:25`
- رسائل الاستفسار تُشترى من داخل غرفة التوافق. اشتراك توافق مميز لا يمنح رسائل مجانية ولا يغيّر رصيدك الحالي. — `src/pages/Plans.tsx:25`

**حالة التحقق:** المصدر فقط؛ العرض الفعلي، جميع الفروع الشرطية، التحقق من الحقول والأثر النهائي تحتاج اختباراً موجهاً قبل إعلان نجاح الوظيفة.

## PUB-07 — Register

**المسارات:** `/register`

**المصدر:** [`src/pages/Register.tsx`](../src/pages/Register.tsx)

**وظائف مؤكدة من المصدر:** معالج بخمس خطوات: الهوية والإقامة؛ المظهر والعمل والنبذة؛ مواصفات الشريك؛ بيانات الحساب والأمان؛ المراجعة والتأكيد. السابق/التالي ومراجعة وتعديل ثم إنشاء الحساب والانتقال إلى الملف. القوائم غير الرسمية قد ترسل للمراجعة الإدارية.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `confirmationHandled`, `handleBirthDateChange`, `handleTogglePartnerMarital`, `handleAddCity`, `handleAddCountry`, `handleAddNationality`, `handleNext`, `handleStepClick`, `handleSubmit`

**حقول معنونة إضافية:** هل لديك أبناء؟؛ كم عدد الأبناء؟ (من 1 إلى 20)

**وجهات ظاهرة في المصدر:** `/profile`, `/`, `/login`

### جرد الأقسام والعناوين وخيارات الواجهة الثابتة
- الهوية والإقامة — `src/pages/Register.tsx:125`
- المظهر والعمل والنبذة — `src/pages/Register.tsx:126`
- مواصفات الشريك — `src/pages/Register.tsx:127`
- بيانات الحساب والأمان — `src/pages/Register.tsx:128`
- المراجعة والتأكيد — `src/pages/Register.tsx:129`
- ضعيفة جدًا (اقل من 6 أحرف) — `src/pages/Register.tsx:260`
- مقبولة — `src/pages/Register.tsx:267`
- جيدة جداً — `src/pages/Register.tsx:268`
- قوية وآمنة — `src/pages/Register.tsx:269`
- إنشاء حساب جديد — `src/pages/Register.tsx:694`
- اختر الدولة اللتي تحمل جنسيتها — `src/pages/Register.tsx:864`
- معلن — `src/pages/Register.tsx:971`
- مسيار — `src/pages/Register.tsx:972`
- لا مانع / معلن او مسيار — `src/pages/Register.tsx:973`
- معلومات الأبناء — `src/pages/Register.tsx:984`
- تفاصيل الزواج الحالي — `src/pages/Register.tsx:1006`
- أقبل — `src/pages/Register.tsx:1575`
- لا (أفضل بدون أطفال) — `src/pages/Register.tsx:1576`
- بشرط ألا يعيشوا معنا — `src/pages/Register.tsx:1577`
- تعيين كلمة المرور — `src/pages/Register.tsx:1718`
- تعديل — `src/pages/Register.tsx:1886`
- الهوية الأساسية والإقامة — `src/pages/Register.tsx:729`
- الجنس — `src/pages/Register.tsx:732`
- ذكر — `src/pages/Register.tsx:747`
- أنثى — `src/pages/Register.tsx:762`
- تاريخ الميلاد — `src/pages/Register.tsx:794`
- العمر (محسوب تلقائيًا) — `src/pages/Register.tsx:797`
- دولة الإقامة الحالية — `src/pages/Register.tsx:811`
- ابحث واختر الدولة — `src/pages/Register.tsx:816`
- المدينة — `src/pages/Register.tsx:831`
- المنطقة / الحي — `src/pages/Register.tsx:853`
- مثال: حي العليا، الملقا... — `src/pages/Register.tsx:854`
- الجنسية — `src/pages/Register.tsx:859`
- اختر الدولة اللتي تحمل جنسيتها... — `src/pages/Register.tsx:890`
- أدخل اسم الدولة بالتفصيل (مثل: بريطانيا، إسبانيا، تركيا...) — `src/pages/Register.tsx:920`
- المذهب — `src/pages/Register.tsx:939`
- اكتب المذهب بالتفصيل... — `src/pages/Register.tsx:951`
- الحالة الاجتماعية — `src/pages/Register.tsx:959`
- نوع الزواج المطلوب — `src/pages/Register.tsx:968`
- عدد الأبناء (اختر من 1 إلى 20) — `src/pages/Register.tsx:992`
- اختر عدد الأبناء — `src/pages/Register.tsx:993`
- عدد الزوجات الحالي — `src/pages/Register.tsx:1009`
- هل لديك أبناء؟ — `src/pages/Register.tsx:1012`
- كم عدد الأبناء؟ (من 1 إلى 20) — `src/pages/Register.tsx:1016`
- هل تبحث عن زوجة أخرى؟ — `src/pages/Register.tsx:1020`
- المظهر والعمل والتعليم — `src/pages/Register.tsx:1031`
- الطول (كتابة) — `src/pages/Register.tsx:1034`
- اكتب الطول (80 - 300) — `src/pages/Register.tsx:1042`
- الوزن (كتابة) — `src/pages/Register.tsx:1048`
- اكتب الوزن (20 - 300) — `src/pages/Register.tsx:1056`
- لون البشرة — `src/pages/Register.tsx:1065`
- اختر لون البشرة — `src/pages/Register.tsx:1073`
- العرق / الأصل — `src/pages/Register.tsx:1077`
- اكتب الأصل/العرق (مثال: قبيلي أصل وفصل، خضيري، عربي...) — `src/pages/Register.tsx:1104`
- القبيلة / النسب — `src/pages/Register.tsx:1110`
- مثال: قبيلي، عتيبي، مطيري، قحطاني، خضيري... — `src/pages/Register.tsx:1111`
- الحالة الصحية — `src/pages/Register.tsx:1115`
- ممتازة، سليم الحمد لله... — `src/pages/Register.tsx:1116`
- اختر — `src/pages/Register.tsx:1119`
- المؤهل الدراسي — `src/pages/Register.tsx:1123`
- اختر المؤهل — `src/pages/Register.tsx:1124`
- نوع جهة العمل — `src/pages/Register.tsx:1127`
- المسمى الوظيفي — `src/pages/Register.tsx:1138`
- مثال: معلم، مهندس، موظف إداري... — `src/pages/Register.tsx:1139`
- نوع السكن — `src/pages/Register.tsx:1144`
- نبذة تعريفية عن نفسك — `src/pages/Register.tsx:1153`
- اكتب نبذة مختصرة عن شخصيتك، قيمك، وأهدافك المستقبليّة... — `src/pages/Register.tsx:1154`
- الدول المطلوبة (يمكنك اختيار دولة واحدة أو عدة دول) — `src/pages/Register.tsx:1221`
- ابحث واختر الدول المطلوبة... — `src/pages/Register.tsx:1228`
- المدن المطلوبة (يمكنك اختيار مدينة واحدة أو عدة مدن) — `src/pages/Register.tsx:1302`
- ابحث واختر المدن المطلوبة... — `src/pages/Register.tsx:1309`
- تحديد جنسيات معينة (يمكنك اختيار جنسية واحدة أو عدة جنسيات) — `src/pages/Register.tsx:1421`
- ابحث واختر الجنسيات المطلوبة... — `src/pages/Register.tsx:1428`
- مثال: 20 (أو اتركه فارغاً) — `src/pages/Register.tsx:1484`
- مثال: 45 (أو اتركه فارغاً) — `src/pages/Register.tsx:1499`
- أدخل اسمك الرباعي الحقيقي — `src/pages/Register.tsx:1631`
- البريد الإلكتروني — `src/pages/Register.tsx:1677`
- كلمة المرور — `src/pages/Register.tsx:1723`
- تأكيد كلمة المرور — `src/pages/Register.tsx:1739`

**حالة التحقق:** المصدر فقط؛ العرض الفعلي، جميع الفروع الشرطية، التحقق من الحقول والأثر النهائي تحتاج اختباراً موجهاً قبل إعلان نجاح الوظيفة.

## PUB-08 — Login

**المسارات:** `/login`

**المصدر:** [`src/pages/Login.tsx`](../src/pages/Login.tsx)

**وظائف مؤكدة من المصدر:** بريد وكلمة مرور وإظهار/إخفاء؛ استعادة كلمة المرور والتسجيل؛ تمييز دخول الإدارة والمشرفين عن الأعضاء؛ نجاح العضو يعود إلى المسار المطلوب أو الافتراضي، والإدارة إلى /admin.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleSubmit`, `savedUsers`, `savedMembers`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/admin`, `/`, `/forgot-password`, `/register`

### جرد الأقسام والعناوين وخيارات الواجهة الثابتة
- مرحبًا بعودتك إلى — `src/pages/Login.tsx:106`
- توافق — `src/pages/Login.tsx:106`
- تسجيل الدخول — `src/pages/Login.tsx:125`
- أدخل بياناتك للوصول إلى حسابك — `src/pages/Login.tsx:125`

**حالة التحقق:** المصدر فقط؛ العرض الفعلي، جميع الفروع الشرطية، التحقق من الحقول والأثر النهائي تحتاج اختباراً موجهاً قبل إعلان نجاح الوظيفة.

## PUB-09 — ForgotPassword

**المسارات:** `/forgot-password`

**المصدر:** [`src/pages/ForgotPassword.tsx`](../src/pages/ForgotPassword.tsx)

**وظائف مؤكدة من المصدر:** نموذج بريد وحالة نجاح ظاهرية. resetPasswordForEmail في authClient يعيد نجاحاً محلياً دون إرسال بريد؛ لا تعتبر استعادة بريد حقيقية منفذة.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleSubmit`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/login`

### جرد الأقسام والعناوين وخيارات الواجهة الثابتة
- تم إرسال الرابط! — `src/pages/ForgotPassword.tsx:50`
- تحقق من بريدك الإلكتروني — `src/pages/ForgotPassword.tsx:50`
- نسيت كلمة المرور؟ — `src/pages/ForgotPassword.tsx:60`
- أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور. — `src/pages/ForgotPassword.tsx:60`

**حالة التحقق:** المصدر فقط؛ العرض الفعلي، جميع الفروع الشرطية، التحقق من الحقول والأثر النهائي تحتاج اختباراً موجهاً قبل إعلان نجاح الوظيفة.

## PUB-10 — ResetPassword

**المسارات:** `/reset-password`

**المصدر:** [`src/pages/ResetPassword.tsx`](../src/pages/ResetPassword.tsx)

**وظائف مؤكدة من المصدر:** يفحص وجود جلسة؛ بدونها يعرض رابطاً غير صالح وطلب رابط جديد. نموذج كلمة وتأكيد (حد واجهة 6 أحرف) ثم updateUser. لا يثبت المصدر وجود خدمة إرسال روابط أو تحديث كلمة عضو في المخزن؛ يلزم اختبار مستقل.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleSubmit`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/login`, `/forgot-password`

### جرد الأقسام والعناوين وخيارات الواجهة الثابتة
- تم تحديث كلمة المرور! — `src/pages/ResetPassword.tsx:63`
- جارِ تحويلك لصفحة تسجيل الدخول... — `src/pages/ResetPassword.tsx:63`
- الرابط فير صالح أو منتهي — `src/pages/ResetPassword.tsx:71`
- يرجى طلب رابط إعادة تعيين جديد. — `src/pages/ResetPassword.tsx:71`
- تعيين كلمة مرور جديدة — `src/pages/ResetPassword.tsx:80`
- اختر كلمة مرور قوية وآمنة لحسابك. — `src/pages/ResetPassword.tsx:80`

**حالة التحقق:** المصدر فقط؛ العرض الفعلي، جميع الفروع الشرطية، التحقق من الحقول والأثر النهائي تحتاج اختباراً موجهاً قبل إعلان نجاح الوظيفة.

## PUB-11 — Legal

**المسارات:** `/legal/privacy`, `/legal/terms`

**المصدر:** [`src/pages/Legal.tsx`](../src/pages/Legal.tsx)

**وظائف مؤكدة من المصدر:** محتوى ثابت حسب type: خصوصية أو شروط؛ عناوين ومواد متعددة وآخر تحديث معروض. ادعاءات التشفير والامتثال وجمع IP نصوص واجهة وليست نتائج تحقق تقني/قانوني.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** مكوّن عرض/معالجات inline

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

### جرد الأقسام والعناوين وخيارات الواجهة الثابتة
- سياسة الخصوصية — `src/pages/Legal.tsx:10`
- 1. المعلومات التي نجمعها — `src/pages/Legal.tsx:14`
- 2. كيف نستخدم معلوماتك — `src/pages/Legal.tsx:15`
- 3. حماية البيانات — `src/pages/Legal.tsx:16`
- 4. مشاركة المعلومات — `src/pages/Legal.tsx:17`
- 5. التحكم في خصوصيتك — `src/pages/Legal.tsx:18`
- 6. ملفات تعريف الارتباط — `src/pages/Legal.tsx:19`
- 7. حقوقك — `src/pages/Legal.tsx:20`
- 8. التحديثات على السياسة — `src/pages/Legal.tsx:21`
- الشروط والأحكام — `src/pages/Legal.tsx:25`
- 1. قبول الشروط — `src/pages/Legal.tsx:29`
- 2. الأهلية — `src/pages/Legal.tsx:30`
- 3. استخدام المنصة — `src/pages/Legal.tsx:31`
- 4. حسابات الأعضاء — `src/pages/Legal.tsx:32`
- 5. المحتوى — `src/pages/Legal.tsx:33`
- 6. الاشتراكات والدفع — `src/pages/Legal.tsx:34`
- 7. التحقيق من الحسابات — `src/pages/Legal.tsx:35`
- 8. حدود المسؤولية — `src/pages/Legal.tsx:36`
- 9. التعديلات — `src/pages/Legal.tsx:37`
- 10. القانون المعمول به — `src/pages/Legal.tsx:38`
- آخر تحديث: 1 يناير 2025 — `src/pages/Legal.tsx:55`

**حالة التحقق:** المصدر فقط؛ العرض الفعلي، جميع الفروع الشرطية، التحقق من الحقول والأثر النهائي تحتاج اختباراً موجهاً قبل إعلان نجاح الوظيفة.

## PUB-12 — NotFound

**المسارات:** `*`

**المصدر:** [`src/pages/NotFound.tsx`](../src/pages/NotFound.tsx)

**وظائف مؤكدة من المصدر:** صفحة مسار غير معروف مع العودة للرئيسية والبحث.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** مكوّن عرض/معالجات inline

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/`, `/search`

### جرد الأقسام والعناوين وخيارات الواجهة الثابتة
- الصفحة غير موجودة — `src/pages/NotFound.tsx:8`
- عذرًا، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. — `src/pages/NotFound.tsx:8`

**حالة التحقق:** المصدر فقط؛ العرض الفعلي، جميع الفروع الشرطية، التحقق من الحقول والأثر النهائي تحتاج اختباراً موجهاً قبل إعلان نجاح الوظيفة.

## PUB-13 — Profile

**المسارات:** `/profile`

**المصدر:** [`src/pages/Profile.tsx`](../src/pages/Profile.tsx)

**وظائف مؤكدة من المصدر:** تبويبات الحساب والمحفوظات والاشتراك والطلبات؛ بيانات وإحصاءات وإجراءات سريعة وتوثيق؛ تعديل معلومات حساب وتغيير كلمة مرور وإخفاء حساب وتفضيلات إشعارات؛ عضوية وتمييز وحفظ وطلبات ودعم وخروج. بعض روابط الدعوة رسائل Toast وليست إثبات نظام إحالة.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `savedCount`, `handleLogout`, `handleToggle`, `handleChangePassword`, `handleSaveAccount`, `savedList`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/`, `/edit-profile`, `/notifications`, `/support`, `/complete-profile`, `/checkout/featured`, `/plans`, `/requests`, `/member/${member.id}`, `/search`

### جرد الأقسام والعناوين وخيارات الواجهة الثابتة
- الحساب — `src/pages/Profile.tsx:23`
- المحفوظات — `src/pages/Profile.tsx:24`
- الاشتراك — `src/pages/Profile.tsx:25`
- الطلبات — `src/pages/Profile.tsx:26`
- محفوظات — `src/pages/Profile.tsx:196`
- تذاكر — `src/pages/Profile.tsx:197`
- طلبات — `src/pages/Profile.tsx:198`
- تذاكر الدعم — `src/pages/Profile.tsx:263`
- طلبات معلّقة — `src/pages/Profile.tsx:264`
- إجراءات سريعة — `src/pages/Profile.tsx:410`
- تعديل الملف الشخصي — `src/pages/Profile.tsx:422`
- حدّث معلوماتك ونبذتك — `src/pages/Profile.tsx:422`
- التحقق من الحساب — `src/pages/Profile.tsx:454`
- ادعُ صديقًا — `src/pages/Profile.tsx:455`
- معلومات الحساب — `src/pages/Profile.tsx:465`
- إعدادات الإشعارات — `src/pages/Profile.tsx:601`
- المحفوظات والاهتمامات — `src/pages/Profile.tsx:605`
- رسائل الإدارة — `src/pages/Profile.tsx:606`
- روابط سريعة — `src/pages/Profile.tsx:622`
- الشروط والأحكام — `src/pages/Profile.tsx:626`
- الدعم الفني — `src/pages/Profile.tsx:627`
- تغيير كلمة المرور — `src/pages/Profile.tsx:665`
- تعديل معلومات الحساب — `src/pages/Profile.tsx:734`
- ميزة تمييز وتعزيز الملف — `src/pages/Profile.tsx:878`
- ضاعف ظهورك في أعلى نتائج البحث للحصول على توافق أسرع — `src/pages/Profile.tsx:878`
- معلّق — `src/pages/Profile.tsx:922`
- بانتظار موافقة الإدارة ⏳ — `src/pages/Profile.tsx:923`
- بانتظار الدفع — `src/pages/Profile.tsx:924`
- مدفوع — `src/pages/Profile.tsx:925`
- في الوساطة — `src/pages/Profile.tsx:926`
- مكتمل — `src/pages/Profile.tsx:927`
- مرفوض — `src/pages/Profile.tsx:928`
- ملغى — `src/pages/Profile.tsx:929`
- عرض جميع الطلبات والتتبع التفصيلي — `src/pages/Profile.tsx:945`
- صفحة الطلبات الكاملة مع الفلاتر والمتابعة — `src/pages/Profile.tsx:945`
- 6 أحرف على الأقل — `src/pages/Profile.tsx:694`
- الاسم الكامل — `src/pages/Profile.tsx:751`

**حالة التحقق:** المصدر فقط؛ العرض الفعلي، جميع الفروع الشرطية، التحقق من الحقول والأثر النهائي تحتاج اختباراً موجهاً قبل إعلان نجاح الوظيفة.

## تحويلات المسارات
`/terms` → `/legal/terms`؛ `/privacy` → `/legal/privacy`؛ `/support` → `/admin-chat`؛ `/admin-login` → `/admin`. ملف AdminLogin.tsx باقٍ في المصدر لكنه ليس نموذجاً مستقلاً مستخدماً بهذا المسار.
