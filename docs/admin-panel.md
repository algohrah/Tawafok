# لوحة الإدارة

> نطاق التحقق: قراءة ساكنة لمصادر GitHub عند Commit `f5cf1caf48cfa2240e4f41fb504aeec759f49802`. لم تُشغّل المنصة أو تُختبر حسابات أو مدفوعات حقيقية. «مؤكد من المصدر» لا يعني «مختبر في الموقع المنشور».

## الدخول والحدود الأمنية
/admin يعرض AdminLayout، الذي يحاول /api/whoami و/api/admin-auth ثم مسار مصادقة محلي عند عدم توفرهما. server.ts لا يعرّف هذين endpoint بل /api/health فقط وخادم Vite. وجود محاولة API ليس خدمة مصادقة منشورة. تحقق محلي عبر adminAuth، وجلسات وعلامات localStorage. authClient يسمح للبريد الإداري بتجاوز بحث الأعضاء؛ لا تعتبر هذه الطبقة وحدها تحقق كلمة مرور. لا ندرج كلمات مرور أو قيم hashes.

AppContext يعرّف super_admin وحسابات مشرفين وصلاحيات manage_members/manage_requests/manage_support/manage_content/view_sensitive_data. لا يوجد تدقيق إثبات تطبيق هذه الصلاحيات على كل إجراء أو حماية خادمية؛ لا تعِد بأن إخفاء الواجهة ضمان أمن.

## مراكز اللوحة
المسارات الرئيسية: /admin و/admin/overview، /admin/members (ومرادفه members-hub)، /admin/journeys، /admin/finance، /admin/trust، /admin/settings. اختيار الأقسام عبر ?tab=. المكونات Hub تجمع الصفحات ولا تعني صفحات مستقلة جديدة.

## ADM-01 — AdminDashboard

**الوجهة:** `/admin/overview`

**المصدر:** [`src/pages/admin/AdminDashboard.tsx`](../src/pages/admin/AdminDashboard.tsx)

**الدور:** نظرة وإحصاءات ونشاط وروابط سريعة ودخول بحساب عضو.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** مكوّن عرض/معالجات inline

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/admin/members?tab=members`, `/admin/journeys?tab=requests`, `/profile`

### الأقسام والعناوين وخيارات الواجهة الثابتة
- الأعضاء — `src/pages/admin/AdminDashboard.tsx:80`
- طلبات التوافق — `src/pages/admin/AdminDashboard.tsx:89`
- أعضاء موثّقون — `src/pages/admin/AdminDashboard.tsx:98`
- الإيرادات والاشتراكات — `src/pages/admin/AdminDashboard.tsx:107`
- استيراد وتصدير الأعضاء — `src/pages/admin/AdminDashboard.tsx:119`
- دليل الخطابات والمكاتب — `src/pages/admin/AdminDashboard.tsx:120`
- إدارة باقات الاشتراك — `src/pages/admin/AdminDashboard.tsx:121`
- بوابات وطرق الدفع — `src/pages/admin/AdminDashboard.tsx:122`
- رحلات توافق مكتملة — `src/pages/admin/AdminDashboard.tsx:127`
- اشتراكات مميّزة نشطة — `src/pages/admin/AdminDashboard.tsx:128`
- رحلات اهتمام نشطة — `src/pages/admin/AdminDashboard.tsx:129`
- رسوم جدية مدفوعة — `src/pages/admin/AdminDashboard.tsx:130`
- أوسمة الجدية النشطة — `src/pages/admin/AdminDashboard.tsx:131`
- إجمالي المعاملات المالية — `src/pages/admin/AdminDashboard.tsx:132`
- مرحبًا بك في لوحة التحكم 👋 — `src/pages/admin/AdminDashboard.tsx:142`
- بيانات حيّة من قاعدة بيانات توافق — `src/pages/admin/AdminDashboard.tsx:142`
- نظرة سريعة — `src/pages/admin/AdminDashboard.tsx:162`
- انقر على أي بطاقة للانتقال المباشر للقسم — `src/pages/admin/AdminDashboard.tsx:162`
- توزيع رحلات الاهتمام حسب المرحلة — `src/pages/admin/AdminDashboard.tsx:196`
- إجراءات سريعة — `src/pages/admin/AdminDashboard.tsx:227`
- إحصائيات المنصة التكميلية — `src/pages/admin/AdminDashboard.tsx:250`
- دخول سريع بحساب عضو — `src/pages/admin/AdminDashboard.tsx:284`
- آخر النشاطات (سجل المنصة والرحلات) — `src/pages/admin/AdminDashboard.tsx:332`
- مباشر — `src/pages/admin/AdminDashboard.tsx:332`

**التحقق:** قراءة مصدر؛ لا اختبار إداري فعلي أو تنفيذ إجراء حساس.

## ADM-02 — AdminAnalytics

**الوجهة:** `/admin/overview?tab=analytics`

**المصدر:** [`src/pages/admin/AdminAnalytics.tsx`](../src/pages/admin/AdminAnalytics.tsx)

**الدور:** نمو وإيراد آخر ستة أشهر وتوزيعات ومدن.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** مكوّن عرض/معالجات inline

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

### الأقسام والعناوين وخيارات الواجهة الثابتة
- إجمالي الأعضاء — `src/pages/admin/AdminAnalytics.tsx:110`
- الأعضاء الموثقون — `src/pages/admin/AdminAnalytics.tsx:111`
- طلبات التوافق — `src/pages/admin/AdminAnalytics.tsx:112`
- الإيرادات التقريرية — `src/pages/admin/AdminAnalytics.tsx:113`
- نمو الأعضاء (آخر 6 أشهر) — `src/pages/admin/AdminAnalytics.tsx:175`
- عدد الأعضاء الجدد المسجلين كل شهر — `src/pages/admin/AdminAnalytics.tsx:175`
- الإيرادات الشهرية (آخر 6 أشهر) — `src/pages/admin/AdminAnalytics.tsx:187`
- إجمالي المعاملات المكتملة بالريال السعودي — `src/pages/admin/AdminAnalytics.tsx:187`
- توزيع رحلات الاهتمام — `src/pages/admin/AdminAnalytics.tsx:202`
- أكثر المدن نشاطاً — `src/pages/admin/AdminAnalytics.tsx:226`
- توزيع الأعضاء حسب الجنس — `src/pages/admin/AdminAnalytics.tsx:250`
- التحليلات المتقدمة — `src/pages/admin/AdminAnalytics.tsx:156`
- إحصائيات وتقارير مفصلة عن أداء المنصة — `src/pages/admin/AdminAnalytics.tsx:156`

**التحقق:** قراءة مصدر؛ لا اختبار إداري فعلي أو تنفيذ إجراء حساس.

## ADM-03 — AdminMembers

**الوجهة:** `/admin/members?tab=members`

**المصدر:** [`src/pages/admin/AdminMembers.tsx`](../src/pages/admin/AdminMembers.tsx)

**الدور:** بحث وفلاتر وقوائم وتحديد جماعي وحالات وباقات وتوثيق وتثبيت ووسام وإشعارات وتعديل وحذف وانتحال.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `togglePin`, `handleUpdate`, `openEditModal`, `handleQuickAddRandom`, `handleQuickAddSubmit`, `toggleSelect`, `toggleSelectPage`, `toggleSelectAll`, `handleExport`, `handleImport`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/profile`, `/admin/members?tab=khataaba&panel=lists`, `/admin/members?tab=import`

### الأقسام والعناوين وخيارات الواجهة الثابتة
- الكل — `src/pages/admin/AdminMembers.tsx:170`
- نشط — `src/pages/admin/AdminMembers.tsx:174`
- قيد المراجعة — `src/pages/admin/AdminMembers.tsx:175`
- موقوف — `src/pages/admin/AdminMembers.tsx:176`
- محظور نهائياً — `src/pages/admin/AdminMembers.tsx:177`
- غير نشط — `src/pages/admin/AdminMembers.tsx:178`
- مرفوض — `src/pages/admin/AdminMembers.tsx:179`
- مُحذوف — `src/pages/admin/AdminMembers.tsx:180`
- مجاني — `src/pages/admin/AdminMembers.tsx:183`
- توافق مميز — `src/pages/admin/AdminMembers.tsx:184`
- الحالة الاجتماعية — `src/pages/admin/AdminMembers.tsx:347`
- العمر — `src/pages/admin/AdminMembers.tsx:348`
- الجنسية — `src/pages/admin/AdminMembers.tsx:349`
- الدولة — `src/pages/admin/AdminMembers.tsx:350`
- المدينة — `src/pages/admin/AdminMembers.tsx:351`
- لون البشرة — `src/pages/admin/AdminMembers.tsx:352`
- الوظيفة — `src/pages/admin/AdminMembers.tsx:353`
- عرض التفاصيل والبيانات — `src/pages/admin/AdminMembers.tsx:1107`
- تعديل بيانات الحساب — `src/pages/admin/AdminMembers.tsx:1112`
- تسجيل الدخول بالحساب — `src/pages/admin/AdminMembers.tsx:1117`
- إسناد / إدارة القوائم المخصصة — `src/pages/admin/AdminMembers.tsx:1122`
- إرسال إشعار خَاص — `src/pages/admin/AdminMembers.tsx:1146`
- حظر نهائي — `src/pages/admin/AdminMembers.tsx:1165`
- حذف العضو نهائياً — `src/pages/admin/AdminMembers.tsx:1174`
- مركز إدارة الأعضاء — `src/pages/admin/AdminMembers.tsx:1337`
- ابحث، راجع، صنّف، ونفذ الإجراءات من مساحة عمل واحدة واضحة. — `src/pages/admin/AdminMembers.tsx:1337`
- الإجمالي — `src/pages/admin/AdminMembers.tsx:1388`
- مسجلون — `src/pages/admin/AdminMembers.tsx:1389`
- مستوردون — `src/pages/admin/AdminMembers.tsx:1390`
- مراجعة — `src/pages/admin/AdminMembers.tsx:1392`
- موثق — `src/pages/admin/AdminMembers.tsx:1393`
- مميّز — `src/pages/admin/AdminMembers.tsx:1394`
- معلّم — `src/pages/admin/AdminMembers.tsx:1395`
- كل الأعضاء — `src/pages/admin/AdminMembers.tsx:1450`
- ذكر 👨 — `src/pages/admin/AdminMembers.tsx:1626`
- أنثى 👩 — `src/pages/admin/AdminMembers.tsx:1627`
- أعزب / عزباء — `src/pages/admin/AdminMembers.tsx:1678`
- مطلق / مطلقة — `src/pages/admin/AdminMembers.tsx:1679`
- أرمل / أرملة — `src/pages/admin/AdminMembers.tsx:1680`
- متزوج / متزوجة — `src/pages/admin/AdminMembers.tsx:1681`
- زواج معلن (يشمل من يقبل كلاهما) — `src/pages/admin/AdminMembers.tsx:1692`
- زواج مسيار (يشمل من يقبل كلاهما) — `src/pages/admin/AdminMembers.tsx:1693`
- يقبل المعلن والمسيار معاً — `src/pages/admin/AdminMembers.tsx:1694`
- قبول أجنبي (لا يهم / جنسية أخرى / دول متعددة) — `src/pages/admin/AdminMembers.tsx:1941`
- يقبل الجميع (لا يهم / أي حالة) — `src/pages/admin/AdminMembers.tsx:1954`
- يقبل أعزب / عزباء (يشمل من يقبل الجميع) — `src/pages/admin/AdminMembers.tsx:1955`
- يقبل مطلق / مطلقة (يشمل من يقبل الجميع) — `src/pages/admin/AdminMembers.tsx:1956`
- يقبل أرمل / أرملة (يشمل من يقبل الجميع) — `src/pages/admin/AdminMembers.tsx:1957`
- يقبل متزوج / معدد (يشمل من يقبل الجميع) — `src/pages/admin/AdminMembers.tsx:1958`
- لا (يفضل بدون أطفال) — `src/pages/admin/AdminMembers.tsx:1969`
- نعم (يقبل وجود أطفال) — `src/pages/admin/AdminMembers.tsx:1970`
- لا يهم (يقبل الجميع) — `src/pages/admin/AdminMembers.tsx:1971`
- بشرط ألا يعيشوا معنا / بشروط — `src/pages/admin/AdminMembers.tsx:1972`
- توثيق الأعضاء — `src/pages/admin/AdminMembers.tsx:2075`
- تثبيت الأعضاء في الصدارة — `src/pages/admin/AdminMembers.tsx:2079`
- إلغاء تثبيت الأعضاء — `src/pages/admin/AdminMembers.tsx:2083`
- منح توافق مميز — `src/pages/admin/AdminMembers.tsx:2113`
- إلغاء باقات الاشتراك (Free) — `src/pages/admin/AdminMembers.tsx:2123`
- منح وسام الجدية — `src/pages/admin/AdminMembers.tsx:2134`
- سحب وسام الجدية — `src/pages/admin/AdminMembers.tsx:2144`
- تفعيل الأعضاء — `src/pages/admin/AdminMembers.tsx:2155`
- إيقاف — `src/pages/admin/AdminMembers.tsx:2159`
- حذف نهائي — `src/pages/admin/AdminMembers.tsx:2167`
- غير مكتمل — `src/pages/admin/AdminMembers.tsx:3517`
- نوع الزواج المطلوب — `src/pages/admin/AdminMembers.tsx:3599`
- القبيلة / النسب — `src/pages/admin/AdminMembers.tsx:3600`
- الجنس — `src/pages/admin/AdminMembers.tsx:3601`
- المنطقة / الحي — `src/pages/admin/AdminMembers.tsx:3606`
- المذهب — `src/pages/admin/AdminMembers.tsx:3608`
- عدد الأبناء — `src/pages/admin/AdminMembers.tsx:3609`
- الطول — `src/pages/admin/AdminMembers.tsx:3610`
- الوزن — `src/pages/admin/AdminMembers.tsx:3611`
- العرق — `src/pages/admin/AdminMembers.tsx:3613`
- الحالة الصحية — `src/pages/admin/AdminMembers.tsx:3614`
- التدخين — `src/pages/admin/AdminMembers.tsx:3615`
- التعليم — `src/pages/admin/AdminMembers.tsx:3616`
- طبيعة السكن — `src/pages/admin/AdminMembers.tsx:3617`
- جهة العمل — `src/pages/admin/AdminMembers.tsx:3618`
- المسمى الوظيفي — `src/pages/admin/AdminMembers.tsx:3619`
- بلد إقامة الشريك — `src/pages/admin/AdminMembers.tsx:3662`
- مدينة إقامة الشريك — `src/pages/admin/AdminMembers.tsx:3663`
- جنسية الشريك — `src/pages/admin/AdminMembers.tsx:3664`
- العمر المطلوب — `src/pages/admin/AdminMembers.tsx:3665`
- الحالة الاجتماعية المقبولة — `src/pages/admin/AdminMembers.tsx:3666`
- قبول أطفال لدى الشريك — `src/pages/admin/AdminMembers.tsx:3667`
- الاسم الحقيقي — `src/pages/admin/AdminMembers.tsx:3711`
- البريد — `src/pages/admin/AdminMembers.tsx:3712`
- رقم الواتساب — `src/pages/admin/AdminMembers.tsx:3713`
- الهوية — `src/pages/admin/AdminMembers.tsx:3714`
- تعطيل الحساب مؤقتاً (Suspend) — `src/pages/admin/AdminMembers.tsx:3913`
- يخفي الملف من البحث والموقع ويمنع العضو من تسجيل الدخول، مع الاحتفاظ ببياناته وإمكانية تفعيله مجدداً لاحقاً. — `src/pages/admin/AdminMembers.tsx:3913`
- حذف العضو نهائياً (Hard Delete) — `src/pages/admin/AdminMembers.tsx:3936`
- يمسح العضو تماماً من قاعدة البيانات بما في ذلك كافة سجلاته ومعاملاته وإشعاراته، مما يتيح له إعادة التسجيل بنفس الهاتف أو البريد. — `src/pages/admin/AdminMembers.tsx:3936`
- إنشاء وتصنيف قوائم خاصة (مثل: أعضاء طرف أم زيد، معلمون، vip...) — `src/pages/admin/AdminMembers.tsx:4261`
- لا توجد قوائم مخصصة منشأة بعد. قم بإنشاء أول قائمة أعلاه. — `src/pages/admin/AdminMembers.tsx:4361`
- تحديث لعرض آخر تعديلات الأعضاء — `src/pages/admin/AdminMembers.tsx:1353`
- إدارة القوائم والتصنيفات المخصصة للأعضاء — `src/pages/admin/AdminMembers.tsx:1360`
- ابحث بالاسم المستعار، الحقيقي، البريد، الهاتف، أو الهوية... — `src/pages/admin/AdminMembers.tsx:1422`
- الحالة: — `src/pages/admin/AdminMembers.tsx:1428`
- الباقة: — `src/pages/admin/AdminMembers.tsx:1437`
- النوع: — `src/pages/admin/AdminMembers.tsx:1446`
- إظهار / إخفاء شريط القوائم المخصصة — `src/pages/admin/AdminMembers.tsx:1463`
- عرض قائمة مختصرة (جدول) — `src/pages/admin/AdminMembers.tsx:1497`
- عرض شبكة بطاقات (نفس الصفحة الرئيسية) — `src/pages/admin/AdminMembers.tsx:1508`
- إنشاء قائمة جديدة أو تعديل وتخصيص القوائم — `src/pages/admin/AdminMembers.tsx:1576`
- الكل (ذكور وإناث) — `src/pages/admin/AdminMembers.tsx:1631`
- كل الدول — `src/pages/admin/AdminMembers.tsx:1640`
- كل المدن — `src/pages/admin/AdminMembers.tsx:1650`
- كل الجنسيات — `src/pages/admin/AdminMembers.tsx:1660`
- كل المذاهب — `src/pages/admin/AdminMembers.tsx:1670`
- كل الحالات الاجتماعية — `src/pages/admin/AdminMembers.tsx:1685`
- نوع الزواج المفضل — `src/pages/admin/AdminMembers.tsx:1690`
- كل أنواع الزواج — `src/pages/admin/AdminMembers.tsx:1698`
- القائمة المخصصة — `src/pages/admin/AdminMembers.tsx:1703`
- كل القوائم المخصصة — `src/pages/admin/AdminMembers.tsx:1710`
- اسم القبيلة... — `src/pages/admin/AdminMembers.tsx:1721`
- المستوى التعليمي — `src/pages/admin/AdminMembers.tsx:1728`
- كل المستويات التعليمية — `src/pages/admin/AdminMembers.tsx:1732`
- قطاع العمل / الوظيفة — `src/pages/admin/AdminMembers.tsx:1738`
- كل القطاعات — `src/pages/admin/AdminMembers.tsx:1742`
- كل الحالات الصحية — `src/pages/admin/AdminMembers.tsx:1752`
- كل خيارات التدخين — `src/pages/admin/AdminMembers.tsx:1762`
- من 16 — `src/pages/admin/AdminMembers.tsx:1830`
- إلى 80 — `src/pages/admin/AdminMembers.tsx:1838`
- من — `src/pages/admin/AdminMembers.tsx:1852`
- إلى — `src/pages/admin/AdminMembers.tsx:1860`
- مكتب الخطابة — `src/pages/admin/AdminMembers.tsx:1891`
- كل الخطابات — `src/pages/admin/AdminMembers.tsx:1895`
- رقم الدفعة — `src/pages/admin/AdminMembers.tsx:1902`
- كل الدفعات — `src/pages/admin/AdminMembers.tsx:1906`
- تاريخ الاستيراد — `src/pages/admin/AdminMembers.tsx:1913`
- كل التواريخ — `src/pages/admin/AdminMembers.tsx:1917`
- جنسية الشريك المطلوبة — `src/pages/admin/AdminMembers.tsx:1939`
- كل الجنسيات المطلوبة — `src/pages/admin/AdminMembers.tsx:1946`
- حالة الشريك الاجتماعية المقبولة — `src/pages/admin/AdminMembers.tsx:1952`
- كل الحالات المقبولة — `src/pages/admin/AdminMembers.tsx:1962`
- كل خيارات الأطفال — `src/pages/admin/AdminMembers.tsx:1976`
- مدينة الشريك المطلوبة — `src/pages/admin/AdminMembers.tsx:1982`
- الحد الأدنى — `src/pages/admin/AdminMembers.tsx:2005`
- الحد الأقصى — `src/pages/admin/AdminMembers.tsx:2013`
- تحديد أول 10 أعضاء مطابقة — `src/pages/admin/AdminMembers.tsx:2057`
- تحديد جميع الأعضاء المطابقين بالفلاتر — `src/pages/admin/AdminMembers.tsx:2067`
- تحديد العضو — `src/pages/admin/AdminMembers.tsx:2206`
- معرف العضو — `src/pages/admin/AdminMembers.tsx:2208`
- عرض التفاصيل الإدارية — `src/pages/admin/AdminMembers.tsx:2245`
- تعديل العضو — `src/pages/admin/AdminMembers.tsx:2252`
- تحديد الصفحة المعروضة — `src/pages/admin/AdminMembers.tsx:2284`
- مثال: الواثق بالله — `src/pages/admin/AdminMembers.tsx:2817`
- الاسم الثلاثي للتثبت الإداري — `src/pages/admin/AdminMembers.tsx:2827`
- مثال: الملقا — `src/pages/admin/AdminMembers.tsx:2909`
- مثل: قبيلي، عتيبي، مطيري... — `src/pages/admin/AdminMembers.tsx:2919`
- مثال: لا يوجد أو ٢ — `src/pages/admin/AdminMembers.tsx:2989`
- مثال: مهندس برمجيات، معلّمة... — `src/pages/admin/AdminMembers.tsx:3064`
- اكتب الحالة الصحية (مثل: سليم ولله الحمد، سكر وضغط...) — `src/pages/admin/AdminMembers.tsx:3088`
- اكتب بضعة أسطر عن شخصيتك واهتماماتك... — `src/pages/admin/AdminMembers.tsx:3132`
- اكتب مواصفات شريك الحياة المطلوب... — `src/pages/admin/AdminMembers.tsx:3141`
- مثال: 0500000000 — `src/pages/admin/AdminMembers.tsx:3172`
- سبب الإيقاف الظاهر للعضو... — `src/pages/admin/AdminMembers.tsx:3259`
- مثال: سعودية، كويتية... — `src/pages/admin/AdminMembers.tsx:3363`
- فارغ (أي عمر) — `src/pages/admin/AdminMembers.tsx:3382`
- مثال: يفضل سكن مستقل بالرياض، لديه قدرة على تحمل المسؤولية... — `src/pages/admin/AdminMembers.tsx:3445`
- نسخ — `src/pages/admin/AdminMembers.tsx:3757`
- اكتب ملاحظة... — `src/pages/admin/AdminMembers.tsx:3791`
- حذف أو تعطيل الحساب — `src/pages/admin/AdminMembers.tsx:3890`
- تأكيد إجراء جماعي — `src/pages/admin/AdminMembers.tsx:3955`
- سبب الإجراء (اختياري — يظهر في ملف العضو)... — `src/pages/admin/AdminMembers.tsx:3979`
- تغيير حالة الحساب — `src/pages/admin/AdminMembers.tsx:4007`
- مثال: مخالفة شروط الاستخدام، بلاغات متكررة... — `src/pages/admin/AdminMembers.tsx:4035`
- إرسال إشعار للعضو — `src/pages/admin/AdminMembers.tsx:4060`
- نص الإشعار... — `src/pages/admin/AdminMembers.tsx:4070`
- إضافة عضو جديد مباشرة — `src/pages/admin/AdminMembers.tsx:4101`
- مثال: نورة العتيبي — `src/pages/admin/AdminMembers.tsx:4122`
- الرياض — `src/pages/admin/AdminMembers.tsx:4154`
- استيراد الأعضاء — `src/pages/admin/AdminMembers.tsx:4232`
- إدارة القوائم المخصصة للأعضاء — `src/pages/admin/AdminMembers.tsx:4258`
- مثال: أعضاء طرف أم زيد، قطاع التعليم... — `src/pages/admin/AdminMembers.tsx:4282`
- ملاحظات توضيحية لهذه الفئة... — `src/pages/admin/AdminMembers.tsx:4311`
- تعديل — `src/pages/admin/AdminMembers.tsx:4407`
- حذف — `src/pages/admin/AdminMembers.tsx:4421`

**التحقق:** قراءة مصدر؛ لا اختبار إداري فعلي أو تنفيذ إجراء حساس.

## ADM-04 — AdminVerifications

**الوجهة:** `/admin/members?tab=verifications`

**المصدر:** [`src/pages/admin/AdminVerifications.tsx`](../src/pages/admin/AdminVerifications.tsx)

**الدور:** طلبات الهوية وصور إثبات وحالة واعتماد ورفض.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `saveVerifStatus`, `handleVerify`, `toggleSelect`, `toggleSelectAll`, `handleExportCSV`, `handleExportExcel`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

### الأقسام والعناوين وخيارات الواجهة الثابتة
- موثق — `src/pages/admin/AdminVerifications.tsx:331`
- بانتظار المراجعة — `src/pages/admin/AdminVerifications.tsx:332`
- مرفوض — `src/pages/admin/AdminVerifications.tsx:333`
- إجمالي الطلبات — `src/pages/admin/AdminVerifications.tsx:365`
- موثقون — `src/pages/admin/AdminVerifications.tsx:366`
- مرفوضون — `src/pages/admin/AdminVerifications.tsx:368`
- كل الحالات — `src/pages/admin/AdminVerifications.tsx:402`
- قبول جماعي — `src/pages/admin/AdminVerifications.tsx:427`
- رفض جماعي — `src/pages/admin/AdminVerifications.tsx:433`
- حذف جماعي — `src/pages/admin/AdminVerifications.tsx:451`
- معلومات العضو — `src/pages/admin/AdminVerifications.tsx:712`
- البريد: — `src/pages/admin/AdminVerifications.tsx:712`
- المستندات المرفقة — `src/pages/admin/AdminVerifications.tsx:727`
- طلبات التوثيق — `src/pages/admin/AdminVerifications.tsx:340`
- مراجعة طلبات توثيق الأعضاء والمستندات — مع تحديد جماعي وتصدير — `src/pages/admin/AdminVerifications.tsx:341`
- تصدير CSV — `src/pages/admin/AdminVerifications.tsx:346`
- تصدير Excel — `src/pages/admin/AdminVerifications.tsx:353`
- ابحث بالاسم أو البريد... — `src/pages/admin/AdminVerifications.tsx:392`
- الحالة: — `src/pages/admin/AdminVerifications.tsx:398`
- تحديد الكل — `src/pages/admin/AdminVerifications.tsx:478`
- عرض المستندات — `src/pages/admin/AdminVerifications.tsx:528`
- قبول التوثيق — `src/pages/admin/AdminVerifications.tsx:536`
- إلغاء التوثيق — `src/pages/admin/AdminVerifications.tsx:544`
- تأكيد الإجراء الجماعي — `src/pages/admin/AdminVerifications.tsx:646`
- مراجعة مستندات التوثيق — `src/pages/admin/AdminVerifications.tsx:693`

**التحقق:** قراءة مصدر؛ لا اختبار إداري فعلي أو تنفيذ إجراء حساس.

## ADM-05 — AdminKhataabaDirectory

**الوجهة:** `/admin/members?tab=khataaba`

**المصدر:** [`src/pages/admin/AdminKhataabaDirectory.tsx`](../src/pages/admin/AdminKhataabaDirectory.tsx)

**الدور:** خطابات ومكاتب وقروبات وحظر وتحذير وتعديل وقوائم وأعضاء وإجراءات جماعية.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleUpdate`, `handleSaveKhataaba`, `handleEditKhataaba`, `handleQuickStatusChange`, `handleAddOffice`, `handleDeleteOfficeEntry`, `toggleSelectMember`, `toggleSelectAllMembers`, `handleBulkDeleteSelected`, `handleBulkBlockSelected`, `handleBulkFreezeSelected`, `handleBulkActivateSelected`, `handleBulkVerifySelected`, `handleBulkVIPSelected`, `handleBulkSeriousnessSelected`, `handleBulkStandardSelected`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

### الأقسام والعناوين وخيارات الواجهة الثابتة
- دليل المكاتب والخطابات والحظر — `src/pages/admin/AdminKhataabaDirectory.tsx:520`
- لم يتم العثور على خطابات مسجلة — `src/pages/admin/AdminKhataabaDirectory.tsx:704`
- يمكنك إضافة خطابة جديدة يدويًا أو سيتم تسجيل أي خطابة تلقائياً عند استيراد الأعضاء بها. — `src/pages/admin/AdminKhataabaDirectory.tsx:704`
- رقم برقم الهاتف — `src/pages/admin/AdminKhataabaDirectory.tsx:741`
- لم يتم العثور على مكاتب أو قروبات — `src/pages/admin/AdminKhataabaDirectory.tsx:910`
- يمكنك إضافة مكتب جديد أو تغيير كلمة البحث. — `src/pages/admin/AdminKhataabaDirectory.tsx:910`
- مكتب / قروب استيراد مسجل — `src/pages/admin/AdminKhataabaDirectory.tsx:928`
- إضافة اسم مكتب/قروب جديد — `src/pages/admin/AdminKhataabaDirectory.tsx:1211`
- اسم المكتب أو القروب — `src/pages/admin/AdminKhataabaDirectory.tsx:1211`
- تأكيد الحذف الجماعي لأعضاء الجهة — `src/pages/admin/AdminKhataabaDirectory.tsx:1556`
- إجراء دائم وغير قابل للاسترجاع — `src/pages/admin/AdminKhataabaDirectory.tsx:1556`
- ابحث باسم الخطابة، رقم الواتساب، الملاحظات... — `src/pages/admin/AdminKhataabaDirectory.tsx:640`
- استعراض أعضاء هذه الخطابة — `src/pages/admin/AdminKhataabaDirectory.tsx:825`
- تعديل بيانات أو حالة الخطابة — `src/pages/admin/AdminKhataabaDirectory.tsx:834`
- حذف كافة أعضاء هذه الخطابة بنقرة واحدة — `src/pages/admin/AdminKhataabaDirectory.tsx:850`
- ابحث باسم المكتب أو القروب... — `src/pages/admin/AdminKhataabaDirectory.tsx:876`
- مسح اسم القروب من السجل — `src/pages/admin/AdminKhataabaDirectory.tsx:937`
- حذف جميع أعضاء هذا القروب بنقرة واحدة — `src/pages/admin/AdminKhataabaDirectory.tsx:996`
- مثال: أم عبدالله - وسيطة الرياض — `src/pages/admin/AdminKhataabaDirectory.tsx:1127`
- مثال: 0501234567 — `src/pages/admin/AdminKhataabaDirectory.tsx:1139`
- مثال: قروب النخبة 1 — `src/pages/admin/AdminKhataabaDirectory.tsx:1165`
- أدخل أي ملاحظات حول جدية الخطابة، التعامل، الأسباب... — `src/pages/admin/AdminKhataabaDirectory.tsx:1176`
- مثال: قروب وسيطات جدة 2 — `src/pages/admin/AdminKhataabaDirectory.tsx:1219`
- عرض التفاصيل والملف الكامل — `src/pages/admin/AdminKhataabaDirectory.tsx:1396`
- تعديل بيانات العضو — `src/pages/admin/AdminKhataabaDirectory.tsx:1407`
- حذف المحددين نهائياً — `src/pages/admin/AdminKhataabaDirectory.tsx:1447`
- حظر حسابات المحددين — `src/pages/admin/AdminKhataabaDirectory.tsx:1456`
- تجميد/إيقاف حسابات المحددين — `src/pages/admin/AdminKhataabaDirectory.tsx:1465`
- تنشيط حسابات المحددين — `src/pages/admin/AdminKhataabaDirectory.tsx:1474`
- توثيق شارة الهوية — `src/pages/admin/AdminKhataabaDirectory.tsx:1483`
- تحويل لمميز VIP — `src/pages/admin/AdminKhataabaDirectory.tsx:1492`
- منح وسام الجدية — `src/pages/admin/AdminKhataabaDirectory.tsx:1501`
- إلغاء التميز — `src/pages/admin/AdminKhataabaDirectory.tsx:1510`

**التحقق:** قراءة مصدر؛ لا اختبار إداري فعلي أو تنفيذ إجراء حساس.

## ADM-06 — AdminImportMembers

**الوجهة:** `/admin/members?tab=import`

**المصدر:** [`src/pages/admin/AdminImportMembers.tsx`](../src/pages/admin/AdminImportMembers.tsx)

**الدور:** إعداد/رفع/معاينة/تحقق/نتيجة ودفعات وتصدير؛ مطابقة أعمدة وخصوصية أرقام واقتراحات جغرافية.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleAddBlankRow`, `handleDeleteRow`, `handleStartEditRow`, `handleSaveEditRow`, `handleFileUpload`, `handleDragOver`, `handleDragLeave`, `handleDrop`, `handlePasteParse`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/admin/settings?tab=backup&section=platform-import`, `/admin/cities`, `/admin/members`

### الأقسام والعناوين وخيارات الواجهة الثابتة
- إعدادات الاستيراد — `src/pages/admin/AdminImportMembers.tsx:811`
- رفع البيانات — `src/pages/admin/AdminImportMembers.tsx:812`
- معاينة — `src/pages/admin/AdminImportMembers.tsx:813`
- التحقق — `src/pages/admin/AdminImportMembers.tsx:814`
- النتيجة — `src/pages/admin/AdminImportMembers.tsx:815`
- إعداد بيانات الخطابة والدفعة الإدارية — `src/pages/admin/AdminImportMembers.tsx:967`
- توجيهات استيراد ملفات الخطابات والمكاتب والبيانات الخارجية — `src/pages/admin/AdminImportMembers.tsx:1218`
- مطابقة وتوجيه أعمدة الملف المستورد إلى حقول المنصة: — `src/pages/admin/AdminImportMembers.tsx:1417`
- ملخص الاستيراد والتحقق — `src/pages/admin/AdminImportMembers.tsx:1616`
- تم الاستيراد بنجاح! — `src/pages/admin/AdminImportMembers.tsx:1744`
- سجل الدفعات السابقة — `src/pages/admin/AdminImportMembers.tsx:1853`
- تخصيص وفلترة التصدير — `src/pages/admin/AdminImportMembers.tsx:1922`
- استيراد وتصدير الأعضاء — `src/pages/admin/AdminImportMembers.tsx:825`
- إدارة استيراد دفعات الأعضاء أو تصدير بيانات الأعضاء إلى ملفات Excel وCSV الشاملة — `src/pages/admin/AdminImportMembers.tsx:826`
- توجيه وأوامر الذكاء الاصطناعي — `src/pages/admin/AdminImportMembers.tsx:832`
- تحميل النموذج المبسط — `src/pages/admin/AdminImportMembers.tsx:839`
- إعادة تعيين الاستيراد — `src/pages/admin/AdminImportMembers.tsx:847`
- اسم الخطابة أو المكتب... — `src/pages/admin/AdminImportMembers.tsx:1065`
- اسم القائمة الجديدة (مثال: أعضاء طرف أم زيد)... — `src/pages/admin/AdminImportMembers.tsx:1112`
- مثال: IMP-001 أو دفعة-خاصة — `src/pages/admin/AdminImportMembers.tsx:1144`
- ملاحظات إضافية حول هذه الدفعة... — `src/pages/admin/AdminImportMembers.tsx:1160`
- لصق البيانات هنا... التنسيق: العناوين في الصف الأول، البيانات في الصفوف التالية الفاصل: Tab أو comma يدعم أيضاً JSON أو نصوص واتساب/استمارات خام وسيحاول النظام استخراج ملفات الأعضاء تلقائياً. مثال: real_name,nickname,gender,age,country,city,marital_status,whatsapp,bio,p_notes عبدالله أحمد,أبو عبدالله,ذكر,32,السعودية,الرياض,أعزب,0501234567,جاد ومستقر,يبحث عن زوجة صالحة أو ألصق نص واتساب مثل: [19/11/2025, 6:54 م] الاسم: سارة، العمر: 28، عزباء، جدة، الواتساب: 0559876543، الشروط: رجل جاد ومستقر — `src/pages/admin/AdminImportMembers.tsx:1302`
- تعديل هذا العضو — `src/pages/admin/AdminImportMembers.tsx:1557`
- حذف هذا الصف — `src/pages/admin/AdminImportMembers.tsx:1564`
- مثال: 28 — `src/pages/admin/AdminImportMembers.tsx:2158`
- أعزب / مطلقة / أرمة... — `src/pages/admin/AdminImportMembers.tsx:2168`
- السعودية — `src/pages/admin/AdminImportMembers.tsx:2178`
- الرياض / جدة... — `src/pages/admin/AdminImportMembers.tsx:2188`
- سعودي / أردني... — `src/pages/admin/AdminImportMembers.tsx:2198`
- مثال: السعودية / أي جنسية... — `src/pages/admin/AdminImportMembers.tsx:2230`
- مثال: الرياض، جدة، كافة المناطق... — `src/pages/admin/AdminImportMembers.tsx:2240`
- من: 22 — `src/pages/admin/AdminImportMembers.tsx:2251`
- إلى: 35 — `src/pages/admin/AdminImportMembers.tsx:2259`
- المواصفات الشخصية والشروط... — `src/pages/admin/AdminImportMembers.tsx:2284`
- مواصفات الشريك والالتزامات المالية كالمهر والمصروف... — `src/pages/admin/AdminImportMembers.tsx:2295`
- أرقام أولياء الأمور، العمولات، الملاحظات الداخلية... — `src/pages/admin/AdminImportMembers.tsx:2306`
- توجيه وأوامر الذكاء الاصطناعي (AI Prompt) لاستيراد استمارات ومحادثات الواتساب — `src/pages/admin/AdminImportMembers.tsx:2329`

**التحقق:** قراءة مصدر؛ لا اختبار إداري فعلي أو تنفيذ إجراء حساس.

## ADM-07 — AdminRequests

**الوجهة:** `/admin/journeys?tab=requests`

**المصدر:** [`src/pages/admin/AdminRequests.tsx`](../src/pages/admin/AdminRequests.tsx)

**الدور:** طلبات مباشرة وتفاصيل مراحل وأطراف ومدفوعات واستفسارات وإجراءات إدارية.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleAcceptRequest`, `toggleAdminSelectAll`, `toggleAdminSelectReq`, `handleBulkAdminDelete`, `handleBulkAdminFreeze`, `openDetail`, `sender`, `approved`, `rejected`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/requests`

### الأقسام والعناوين وخيارات الواجهة الثابتة
- الرحلات — `src/pages/admin/AdminRequests.tsx:100`
- مراجعة الرسائل — `src/pages/admin/AdminRequests.tsx:101`
- الأرشيف — `src/pages/admin/AdminRequests.tsx:102`
- كل الطلبات — `src/pages/admin/AdminRequests.tsx:452`
- بانتظار الرد — `src/pages/admin/AdminRequests.tsx:453`
- رحلات نشطة — `src/pages/admin/AdminRequests.tsx:454`
- مكتملة — `src/pages/admin/AdminRequests.tsx:455`
- رسوم مدفوعة — `src/pages/admin/AdminRequests.tsx:456`
- الدخول كـ المرسِل — `src/pages/admin/AdminRequests.tsx:784`
- الدخول كـ المستقبِل — `src/pages/admin/AdminRequests.tsx:791`
- تبديل طرف بالطلب — `src/pages/admin/AdminRequests.tsx:798`
- تقديم للمرحلة التالية (طرف/طرفين) — `src/pages/admin/AdminRequests.tsx:812`
- نقل لأي مرحلة (طرف/طرفين) — `src/pages/admin/AdminRequests.tsx:823`
- تأخير مرحلة (رجوع خطوة) — `src/pages/admin/AdminRequests.tsx:835`
- تحديد موعد التنسيق — `src/pages/admin/AdminRequests.tsx:860`
- تعديل سداد رسوم الجدية للطرفين — `src/pages/admin/AdminRequests.tsx:874`
- تعديل تعهدات الجدية والعهد — `src/pages/admin/AdminRequests.tsx:883`
- تعديل بيانات التواصل مباشرة — `src/pages/admin/AdminRequests.tsx:892`
- تعديل نتيجة النظرة الشرعية — `src/pages/admin/AdminRequests.tsx:904`
- قبول وتفعيل الطلب (بالنيابة) — `src/pages/admin/AdminRequests.tsx:916`
- إعادة تفعيل طلب منتهٍ — `src/pages/admin/AdminRequests.tsx:923`
- رفض/اعتذار عن الطلب (بالنيابة) — `src/pages/admin/AdminRequests.tsx:933`
- إلغاء الطلب نهائياً — `src/pages/admin/AdminRequests.tsx:943`
- حذف نهائي — `src/pages/admin/AdminRequests.tsx:950`
- سجل الأحداث والتنقلات — `src/pages/admin/AdminRequests.tsx:1104`
- لا توجد أحداث مسجّلة بعد — `src/pages/admin/AdminRequests.tsx:1104`
- تفاصيل المدفوعات المسجلة — `src/pages/admin/AdminRequests.tsx:1139`
- 📱 أرقام وهواتف التواصل المتاحة للطلب — `src/pages/admin/AdminRequests.tsx:1187`
- بيانات التواصل للطرف الذكر (الخاطب) — `src/pages/admin/AdminRequests.tsx:1876`
- اسم الخاطب — `src/pages/admin/AdminRequests.tsx:1876`
- بيانات التواصل للطرف الأنثى (المخطوبة) — `src/pages/admin/AdminRequests.tsx:1896`
- اسم ولي الأمر — `src/pages/admin/AdminRequests.tsx:1896`
- تفاصيل إضافية / عامة — `src/pages/admin/AdminRequests.tsx:1916`
- معلومات الاتصال المباشرة البديلة — `src/pages/admin/AdminRequests.tsx:1916`
- الكل — `src/pages/admin/AdminRequests.tsx:2122`
- بانتظار المراجعة — `src/pages/admin/AdminRequests.tsx:2123`
- المقبولة — `src/pages/admin/AdminRequests.tsx:2124`
- المرفوضة — `src/pages/admin/AdminRequests.tsx:2125`
- رحلات التوافق للزواج — `src/pages/admin/AdminRequests.tsx:448`
- إدارة رحلات التوافق للزواج من الطلب حتى الإتمام — `src/pages/admin/AdminRequests.tsx:448`
- ابحث برقم الطلب #ID، الأسماء، أو رقم الهاتف... — `src/pages/admin/AdminRequests.tsx:500`
- المرحلة: — `src/pages/admin/AdminRequests.tsx:558`
- قبول وتفعيل الطلب — `src/pages/admin/AdminRequests.tsx:759`
- رفض الطلب — `src/pages/admin/AdminRequests.tsx:769`
- حذف الطلب — `src/pages/admin/AdminRequests.tsx:1234`
- مثال: 2026-07-10 الساعة 8 مساءً — `src/pages/admin/AdminRequests.tsx:1264`
- تفاصيل التنسيق... — `src/pages/admin/AdminRequests.tsx:1274`
- تأكيد إلغاء الطلب — `src/pages/admin/AdminRequests.tsx:1293`
- تأكيد رفض واعتذار عن الطلب — `src/pages/admin/AdminRequests.tsx:1322`
- مثال: عدم ملاءمة الشروط، رغبة الطرف الثاني... — `src/pages/admin/AdminRequests.tsx:1337`
- تقديم الطلب للمرحلة التالية — `src/pages/admin/AdminRequests.tsx:1361`
- مثال: استيفاء الشروط تلفونياً، موافقة شفهية... — `src/pages/admin/AdminRequests.tsx:1384`
- نقل الطلب لمرحلة محددة — `src/pages/admin/AdminRequests.tsx:1418`
- مثال: خطأ في المرحلة، طلب العضو، تعديل إداري... — `src/pages/admin/AdminRequests.tsx:1448`
- تأخير المرحلة (رجوع خطوة) — `src/pages/admin/AdminRequests.tsx:1478`
- مثال: يحتاج الطرف لوقت إضافي، طلب مراجعة... — `src/pages/admin/AdminRequests.tsx:1500`
- تجميد الطلب مؤقتاً — `src/pages/admin/AdminRequests.tsx:1530`
- مثال: مراجعة المستندات، نزاع بين الطرفين، تحقق من البيانات... — `src/pages/admin/AdminRequests.tsx:1552`
- مثال: إلغاء بالخطأ، طلب استثنائي من الطرفين... — `src/pages/admin/AdminRequests.tsx:1609`
- تبديل طرف في الطلب — `src/pages/admin/AdminRequests.tsx:1632`
- مثال: خطأ في إرسال الطلب، تبديل بأمر الإدارة... — `src/pages/admin/AdminRequests.tsx:1679`
- تحديث حالة سداد رسوم الجدية — `src/pages/admin/AdminRequests.tsx:1702`
- تحديث التعهدات وإقرارات الجدية — `src/pages/admin/AdminRequests.tsx:1755`
- تحديث نتائج النظرة الشرعية — `src/pages/admin/AdminRequests.tsx:1808`
- تحديث بيانات التواصل المباشرة — `src/pages/admin/AdminRequests.tsx:1865`
- ملاحظات التواصل أو طريقة التنسيق البديلة... — `src/pages/admin/AdminRequests.tsx:1924`
- تفريغ التحديد — `src/pages/admin/AdminRequests.tsx:1990`
- حذف طلبات الرحلات المحددة نهائياً — `src/pages/admin/AdminRequests.tsx:2000`

**التحقق:** قراءة مصدر؛ لا اختبار إداري فعلي أو تنفيذ إجراء حساس.

## ADM-08 — AdminImportedCoordination

**الوجهة:** `/admin/journeys?tab=imported`

**المصدر:** [`src/pages/admin/AdminImportedCoordination.tsx`](../src/pages/admin/AdminImportedCoordination.tsx)

**الدور:** تنسيق مستوردين وخطابات؛ مراحل ودفعات يدوية وتوجيه للمسجل وملاحظات سرية وموعد.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `sender`, `handleOpenRequestModal`, `handleCloseRequestModal`, `handleOpenMemberDetail`, `handleNotifyKhataaba`, `handleCopyKhataabaText`, `handleSendMessage`, `handleDeleteMessage`, `handleSaveEditedMessage`, `handleApplyRequestChanges`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

### الأقسام والعناوين وخيارات الواجهة الثابتة
- طلب جديد معلق (Sent) — `src/pages/admin/AdminImportedCoordination.tsx:29`
- قبول مبدئي (Accepted) — `src/pages/admin/AdminImportedCoordination.tsx:30`
- بانتظار سداد العربون (Seriousness) — `src/pages/admin/AdminImportedCoordination.tsx:31`
- قيد الوساطة والتنسيق (Coordination) — `src/pages/admin/AdminImportedCoordination.tsx:32`
- النظرة الشرعية والتواصل (Viewing) — `src/pages/admin/AdminImportedCoordination.tsx:33`
- عقد القران / الملكة (Engagement) — `src/pages/admin/AdminImportedCoordination.tsx:34`
- تم الزواج والتوافق بنجاح 💍 (Completed) — `src/pages/admin/AdminImportedCoordination.tsx:35`
- مرفوض / تم الاعتذار ❌ (Declined) — `src/pages/admin/AdminImportedCoordination.tsx:36`
- ملغي إدارياً 🚫 (Cancelled) — `src/pages/admin/AdminImportedCoordination.tsx:37`
- تنسيق ووساطة الملفات المستوردة — `src/pages/admin/AdminImportedCoordination.tsx:556`
- لا توجد طلبات تطابق هذا الفلتر — `src/pages/admin/AdminImportedCoordination.tsx:717`
- جرب تغيير خيار التصفية أو مسح عبارة البحث أعلاه. — `src/pages/admin/AdminImportedCoordination.tsx:717`
- سجل الملاحظات الإدارية وموعد اللقاء — `src/pages/admin/AdminImportedCoordination.tsx:1242`
- ابحث باسم المتقدم، اسم الملف المستورد، المعرّف (ID)، أو اسم الخطابة/المكتب... — `src/pages/admin/AdminImportedCoordination.tsx:693`
- اكتب سبب الرفض أو الاعتذار ليتم حفظه في سجل الطلب... — `src/pages/admin/AdminImportedCoordination.tsx:945`
- تعديل بيانات العضو — `src/pages/admin/AdminImportedCoordination.tsx:1009`
- تعديل بيانات الملف — `src/pages/admin/AdminImportedCoordination.tsx:1053`
- نسخ نص التنسيق — `src/pages/admin/AdminImportedCoordination.tsx:1074`
- تعديل الرسالة — `src/pages/admin/AdminImportedCoordination.tsx:1136`
- حذف الرسالة نهائياً — `src/pages/admin/AdminImportedCoordination.tsx:1151`
- ملاحظات سرية حول اهتمام الطرفين... — `src/pages/admin/AdminImportedCoordination.tsx:1255`
- رابط الاتصال، إرشادات اللقاء... — `src/pages/admin/AdminImportedCoordination.tsx:1281`

**التحقق:** قراءة مصدر؛ لا اختبار إداري فعلي أو تنفيذ إجراء حساس.

## ADM-09 — AdminTransactions

**الوجهة:** `/admin/finance?tab=transactions`

**المصدر:** [`src/pages/admin/AdminTransactions.tsx`](../src/pages/admin/AdminTransactions.tsx)

**الدور:** معاملات وفلاتر وتفاصيل وإثبات واعتماد/رفض وآثار تفعيل.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleReview`, `handleExport`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

### الأقسام والعناوين وخيارات الواجهة الثابتة
- ناجح — `src/pages/admin/AdminTransactions.tsx:41`
- معلق — `src/pages/admin/AdminTransactions.tsx:42`
- فاشل — `src/pages/admin/AdminTransactions.tsx:43`
- مسترد — `src/pages/admin/AdminTransactions.tsx:44`
- اشتراك — `src/pages/admin/AdminTransactions.tsx:55`
- رسوم جدية — `src/pages/admin/AdminTransactions.tsx:56`
- باقة استفسار — `src/pages/admin/AdminTransactions.tsx:57`
- رسوم سعي — `src/pages/admin/AdminTransactions.tsx:58`
- إعفاء/وسام — `src/pages/admin/AdminTransactions.tsx:59`
- كوبون — `src/pages/admin/AdminTransactions.tsx:60`
- إجمالي الإيرادات — `src/pages/admin/AdminTransactions.tsx:160`
- عدد المعاملات — `src/pages/admin/AdminTransactions.tsx:161`
- رسوم جدية مدفوعة — `src/pages/admin/AdminTransactions.tsx:162`
- إعفاءات/أوسمة — `src/pages/admin/AdminTransactions.tsx:163`
- كل الأنواع — `src/pages/admin/AdminTransactions.tsx:193`
- كل الحالات — `src/pages/admin/AdminTransactions.tsx:202`
- كل الطرق — `src/pages/admin/AdminTransactions.tsx:211`
- المعاملات المالية — `src/pages/admin/AdminTransactions.tsx:144`
- سجل كافة المدفوعات والاشتراكات والإعفاءات — بيانات حقيقية — `src/pages/admin/AdminTransactions.tsx:145`
- تصدير المعاملات — `src/pages/admin/AdminTransactions.tsx:149`
- ابحث بالعضو أو الوصف... — `src/pages/admin/AdminTransactions.tsx:183`
- النوع: — `src/pages/admin/AdminTransactions.tsx:189`
- الحالة: — `src/pages/admin/AdminTransactions.tsx:198`
- الطريقة: — `src/pages/admin/AdminTransactions.tsx:207`
- اعتماد المعاملة — `src/pages/admin/AdminTransactions.tsx:270`
- رفض المعاملة — `src/pages/admin/AdminTransactions.tsx:278`

**التحقق:** قراءة مصدر؛ لا اختبار إداري فعلي أو تنفيذ إجراء حساس.

## ADM-10 — AdminPlans

**الوجهة:** `/admin/finance?tab=plans`

**المصدر:** [`src/pages/admin/AdminPlans.tsx`](../src/pages/admin/AdminPlans.tsx)

**الدور:** عرض عضويات وباقات رسائل بنموذج تجريبي ثابت مجاني وتوافق مميز؛ لا تفترض وجود محرر أسعار أو كوبونات بهذه الصفحة.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** مكوّن عرض/معالجات inline

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

### الأقسام والعناوين وخيارات الواجهة الثابتة
- لا تمنح العضوية رصيد رسائل ولا إعفاءً أو خصمًا من رسوم رحلة التوافق. — `src/pages/admin/AdminPlans.tsx:10`
- التحكم بباقات رسائل الاستفسار والتواصل الإضافية — `src/pages/admin/AdminPlans.tsx:18`
- يمكنك تعديل أسعار وحدود رسائل الاستفسار الإضافية التي يشتريها الأعضاء بشكل مستقل عن العضوية. — `src/pages/admin/AdminPlans.tsx:18`
- العضويات وباقات الرسائل — `src/pages/admin/AdminPlans.tsx:8`
- نموذج تجريبي ثابت: مجاني وتوافق مميز. الرسائل ورسوم الرحلة مستقلة. — `src/pages/admin/AdminPlans.tsx:8`

**التحقق:** قراءة مصدر؛ لا اختبار إداري فعلي أو تنفيذ إجراء حساس.

## ADM-11 — AdminExemptions

**الوجهة:** `/admin/finance?tab=exemptions`

**المصدر:** [`src/pages/admin/AdminExemptions.tsx`](../src/pages/admin/AdminExemptions.tsx)

**الدور:** طلبات إعفاء وسبب وقبول/رفض وتفعيل إعفاء عربون أو وسام.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleAction`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

### الأقسام والعناوين وخيارات الواجهة الثابتة
- إعفاء من رسوم الجدية — `src/pages/admin/AdminExemptions.tsx:16`
- منح وسام الجدية — `src/pages/admin/AdminExemptions.tsx:17`
- إجمالي الطلبات — `src/pages/admin/AdminExemptions.tsx:101`
- معلقة — `src/pages/admin/AdminExemptions.tsx:102`
- مقبولة — `src/pages/admin/AdminExemptions.tsx:103`
- مرفوضة — `src/pages/admin/AdminExemptions.tsx:104`
- كل الحالات — `src/pages/admin/AdminExemptions.tsx:133`
- طلبات الإعفاء والتسهيلات — `src/pages/admin/AdminExemptions.tsx:95`
- مراجعة طلبات الإعفاء وتفعيل الأثر فعلياً (وسام الجدية) + إشعار العضو — `src/pages/admin/AdminExemptions.tsx:96`
- ابحث بالعضو أو سبب الإعفاء... — `src/pages/admin/AdminExemptions.tsx:123`
- الحالة: — `src/pages/admin/AdminExemptions.tsx:129`
- تفاصيل طلب الإعفاء — `src/pages/admin/AdminExemptions.tsx:234`

**التحقق:** قراءة مصدر؛ لا اختبار إداري فعلي أو تنفيذ إجراء حساس.

## ADM-12 — AdminMessages

**الوجهة:** `/admin/trust?tab=messages`

**المصدر:** [`src/pages/admin/AdminMessages.tsx`](../src/pages/admin/AdminMessages.tsx)

**الدور:** تذاكر دعم ومحادثات ومراجعة استفسارات وإجراءات رسائل.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `deleteInquiryMessage`, `handleModerateInquiry`, `handleDeleteInquiry`, `handleSendReply`, `handleUpdateStatus`, `handleSelectTicket`, `handleTransfer`, `senderInfo`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

### الأقسام والعناوين وخيارات الواجهة الثابتة
- مفتوحة — `src/pages/admin/AdminMessages.tsx:24`
- قيد المعالجة — `src/pages/admin/AdminMessages.tsx:25`
- تم الحل — `src/pages/admin/AdminMessages.tsx:26`
- مغلقة — `src/pages/admin/AdminMessages.tsx:27`
- ترحيب — `src/pages/admin/AdminMessages.tsx:34`
- تنسيق شرعي — `src/pages/admin/AdminMessages.tsx:35`
- طلب مستندات — `src/pages/admin/AdminMessages.tsx:36`
- اعتذار عن تأخير — `src/pages/admin/AdminMessages.tsx:37`
- إغلاق التذكرة — `src/pages/admin/AdminMessages.tsx:38`
- غير معروف — `src/pages/admin/AdminMessages.tsx:139`
- إجمالي التذاكر — `src/pages/admin/AdminMessages.tsx:254`
- تم حلها — `src/pages/admin/AdminMessages.tsx:257`
- غير مقروءة — `src/pages/admin/AdminMessages.tsx:258`
- كل الأولويات — `src/pages/admin/AdminMessages.tsx:307`
- عالية — `src/pages/admin/AdminMessages.tsx:308`
- عادية — `src/pages/admin/AdminMessages.tsx:309`
- منخفضة — `src/pages/admin/AdminMessages.tsx:310`
- بيانات الحساب الحساسة — `src/pages/admin/AdminMessages.tsx:661`
- الاسم الحقيقي — `src/pages/admin/AdminMessages.tsx:663`
- البريد الإلكتروني — `src/pages/admin/AdminMessages.tsx:664`
- رقم الجوال — `src/pages/admin/AdminMessages.tsx:665`
- كلمة المرور — `src/pages/admin/AdminMessages.tsx:666`
- المعلومات الأساسية — `src/pages/admin/AdminMessages.tsx:670`
- الاسم المستعار — `src/pages/admin/AdminMessages.tsx:672`
- الجنس — `src/pages/admin/AdminMessages.tsx:673`
- العمر — `src/pages/admin/AdminMessages.tsx:674`
- الدولة — `src/pages/admin/AdminMessages.tsx:675`
- المدينة — `src/pages/admin/AdminMessages.tsx:676`
- الحي — `src/pages/admin/AdminMessages.tsx:677`
- الصفات الشخصية — `src/pages/admin/AdminMessages.tsx:681`
- الطول — `src/pages/admin/AdminMessages.tsx:683`
- الوزن — `src/pages/admin/AdminMessages.tsx:684`
- لون البشرة — `src/pages/admin/AdminMessages.tsx:685`
- الحالة الصحية — `src/pages/admin/AdminMessages.tsx:686`
- التدخين — `src/pages/admin/AdminMessages.tsx:687`
- العمل والمؤهل — `src/pages/admin/AdminMessages.tsx:691`
- المؤهل — `src/pages/admin/AdminMessages.tsx:693`
- العمل — `src/pages/admin/AdminMessages.tsx:694`
- السكن — `src/pages/admin/AdminMessages.tsx:695`
- نبذة: — `src/pages/admin/AdminMessages.tsx:746`
- مواصفات الشريك: — `src/pages/admin/AdminMessages.tsx:746`
- إجمالي الرسائل — `src/pages/admin/AdminMessages.tsx:804`
- بانتظار المراجعة — `src/pages/admin/AdminMessages.tsx:805`
- موافق عليها — `src/pages/admin/AdminMessages.tsx:806`
- مرفوضة — `src/pages/admin/AdminMessages.tsx:807`
- كل الرسائل — `src/pages/admin/AdminMessages.tsx:839`
- الرسائل والدعم الفني — `src/pages/admin/AdminMessages.tsx:206`
- استلام تذاكر الدعم والتحكيم الشرعي من الخاطبين، التخاطب معهم وتنسيق الرؤية الشرعية — `src/pages/admin/AdminMessages.tsx:207`
- عرض تذاكر الدعم — `src/pages/admin/AdminMessages.tsx:212`
- مراجعة رسائل الاستفسار — `src/pages/admin/AdminMessages.tsx:219`
- ابحث بموضوع التذكرة أو محتواها... — `src/pages/admin/AdminMessages.tsx:281`
- الحالة: — `src/pages/admin/AdminMessages.tsx:288`
- التصنيف: — `src/pages/admin/AdminMessages.tsx:297`
- الأولوية: — `src/pages/admin/AdminMessages.tsx:303`
- اكتب ردك... — `src/pages/admin/AdminMessages.tsx:567`
- اعتراض وحذف رسالة — `src/pages/admin/AdminMessages.tsx:591`
- تفاصيل وبيانات العضو الحساسة — `src/pages/admin/AdminMessages.tsx:614`
- تحويل التذكرة لمسؤول آخر — `src/pages/admin/AdminMessages.tsx:619`
- ابحث في نص الرسائل... — `src/pages/admin/AdminMessages.tsx:826`
- اعتراض وحذف الرسالة نهائياً — `src/pages/admin/AdminMessages.tsx:937`

**التحقق:** قراءة مصدر؛ لا اختبار إداري فعلي أو تنفيذ إجراء حساس.

## ADM-13 — AdminReports

**الوجهة:** `/admin/trust?tab=reports`

**المصدر:** [`src/pages/admin/AdminReports.tsx`](../src/pages/admin/AdminReports.tsx)

**الدور:** بلاغات وشكاوى وتفاصيل ومعالجة.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleConfirmAction`, `handleSuspendUser`, `handleBanUser`, `confirmDeleteUser`, `handleResolve`, `handleExportReports`, `handleSaveNotes`, `handleAddAction`, `handleSetCategory`, `handleSetSeverity`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/member/${report.reportedId}`

### الأقسام والعناوين وخيارات الواجهة الثابتة
- حساب وهمي/مزعج — `src/pages/admin/AdminReports.tsx:18`
- مضايقة أو تحرش — `src/pages/admin/AdminReports.tsx:19`
- بيانات كاذبة — `src/pages/admin/AdminReports.tsx:20`
- سلوك غير لائق — `src/pages/admin/AdminReports.tsx:21`
- سبب آخر — `src/pages/admin/AdminReports.tsx:22`
- خطورة عالية — `src/pages/admin/AdminReports.tsx:26`
- خطورة متوسطة — `src/pages/admin/AdminReports.tsx:27`
- خطورة منخفضة — `src/pages/admin/AdminReports.tsx:28`
- كل البلاغات — `src/pages/admin/AdminReports.tsx:239`
- معلّقة — `src/pages/admin/AdminReports.tsx:240`
- تم حلها — `src/pages/admin/AdminReports.tsx:241`
- سجل الإجراءات — `src/pages/admin/AdminReports.tsx:549`
- إدارة بلاغات وشكاوى الأعضاء — `src/pages/admin/AdminReports.tsx:193`
- متابعة الشكاوى المقدمة من الأعضاء ضد الحسابات غير الجادة والمخالفة. — `src/pages/admin/AdminReports.tsx:194`
- تصدير البلاغات كملف CSV — `src/pages/admin/AdminReports.tsx:211`
- ابحث باسم المُبلِغ أو المخالف أو محتوى البلاغ... — `src/pages/admin/AdminReports.tsx:227`
- الحالة: — `src/pages/admin/AdminReports.tsx:235`
- النوع: — `src/pages/admin/AdminReports.tsx:245`
- الخطورة: — `src/pages/admin/AdminReports.tsx:254`
- حذف البلاغ — `src/pages/admin/AdminReports.tsx:326`
- عرض الملف — `src/pages/admin/AdminReports.tsx:381`
- عضو متكرر البلاغات — `src/pages/admin/AdminReports.tsx:386`
- تفاصيل البلاغ وسجل الإجراءات — `src/pages/admin/AdminReports.tsx:490`
- ملاحظات إدارية — `src/pages/admin/AdminReports.tsx:577`
- مثال: تم التواصل مع الطرفين، بانتظار التحقق... — `src/pages/admin/AdminReports.tsx:583`
- تأكيد حذف الحساب نهائياً — `src/pages/admin/AdminReports.tsx:598`
- إضافة إجراء للسجل — `src/pages/admin/AdminReports.tsx:621`
- مثال: تم تنبيه العضو، تم تجميد الحساب... — `src/pages/admin/AdminReports.tsx:627`
- تأكيد الإجراء — `src/pages/admin/AdminReports.tsx:641`

**التحقق:** قراءة مصدر؛ لا اختبار إداري فعلي أو تنفيذ إجراء حساس.

## ADM-14 — AdminAuditLog

**الوجهة:** `/admin/trust?tab=audit`

**المصدر:** [`src/pages/admin/AdminAuditLog.tsx`](../src/pages/admin/AdminAuditLog.tsx)

**الدور:** سجل موحد/قديم وتصنيف أحداث وبحث وتحديث.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** مكوّن عرض/معالجات inline

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

### الأقسام والعناوين وخيارات الواجهة الثابتة
- حذف عضو — `src/pages/admin/AdminAuditLog.tsx:9`
- تعديل عضو — `src/pages/admin/AdminAuditLog.tsx:10`
- استيراد جماعي — `src/pages/admin/AdminAuditLog.tsx:11`
- اعتماد معاملة — `src/pages/admin/AdminAuditLog.tsx:12`
- رفض معاملة — `src/pages/admin/AdminAuditLog.tsx:13`
- اعتماد توثيق — `src/pages/admin/AdminAuditLog.tsx:14`
- رفض توثيق — `src/pages/admin/AdminAuditLog.tsx:15`
- تعديل إعدادات — `src/pages/admin/AdminAuditLog.tsx:16`
- حذف إعداد — `src/pages/admin/AdminAuditLog.tsx:17`
- تعديل مشرف — `src/pages/admin/AdminAuditLog.tsx:18`
- إضافة مشرف — `src/pages/admin/AdminAuditLog.tsx:19`
- حذف مشرف — `src/pages/admin/AdminAuditLog.tsx:20`
- كوبون خصم — `src/pages/admin/AdminAuditLog.tsx:21`
- حذف كوبون — `src/pages/admin/AdminAuditLog.tsx:22`
- معالجة بلاغ — `src/pages/admin/AdminAuditLog.tsx:23`
- اعتماد إعفاء — `src/pages/admin/AdminAuditLog.tsx:24`
- رفض إعفاء — `src/pages/admin/AdminAuditLog.tsx:25`
- حذف طلب توافق — `src/pages/admin/AdminAuditLog.tsx:26`
- معالجة بلاغ (قديم) — `src/pages/admin/AdminAuditLog.tsx:27`
- إجراء إداري — `src/pages/admin/AdminAuditLog.tsx:28`
- كل الأنواع — `src/pages/admin/AdminAuditLog.tsx:144`
- إجراءات الأعضاء — `src/pages/admin/AdminAuditLog.tsx:145`
- رحلة التوافق — `src/pages/admin/AdminAuditLog.tsx:146`
- المعاملات المالية — `src/pages/admin/AdminAuditLog.tsx:147`
- البلاغات — `src/pages/admin/AdminAuditLog.tsx:148`
- بلاغات (سجل قديم) — `src/pages/admin/AdminAuditLog.tsx:149`
- سجل التدقيق — `src/pages/admin/AdminAuditLog.tsx:118`
- سجل حقيقي بجميع الإجراءات الإدارية على المنصة — `src/pages/admin/AdminAuditLog.tsx:119`
- تحديث السجل — `src/pages/admin/AdminAuditLog.tsx:121`
- ابحث بالإجراء أو المسؤول... — `src/pages/admin/AdminAuditLog.tsx:134`
- النوع: — `src/pages/admin/AdminAuditLog.tsx:140`

**التحقق:** قراءة مصدر؛ لا اختبار إداري فعلي أو تنفيذ إجراء حساس.

## ADM-15 — AdminPlatformSettings

**الوجهة:** `/admin/settings?tab=platform`

**المصدر:** [`src/pages/admin/AdminPlatformSettings.tsx`](../src/pages/admin/AdminPlatformSettings.tsx)

**الدور:** هوية المنصة والمحتوى وروابط التواصل والإعدادات العامة.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `savedSettings`, `handleSave`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

### الأقسام والعناوين وخيارات الواجهة الثابتة
- هوية المنصة — `src/pages/admin/AdminPlatformSettings.tsx:57`
- معلومات التواصل — `src/pages/admin/AdminPlatformSettings.tsx:90`
- التحكم في المنصة — `src/pages/admin/AdminPlatformSettings.tsx:174`
- السماح بالتسجيل الجديد — `src/pages/admin/AdminPlatformSettings.tsx:180`
- وضع الصيانة — `src/pages/admin/AdminPlatformSettings.tsx:186`
- إعدادات المنصة — `src/pages/admin/AdminPlatformSettings.tsx:40`
- تحكم في هوية المنصة ومعلومات التواصل الأساسية — `src/pages/admin/AdminPlatformSettings.tsx:41`
- حفظ إعدادات المنصة — `src/pages/admin/AdminPlatformSettings.tsx:45`
- مثال: 966500000000 — `src/pages/admin/AdminPlatformSettings.tsx:151`

**التحقق:** قراءة مصدر؛ لا اختبار إداري فعلي أو تنفيذ إجراء حساس.

## ADM-16 — AdminPaymentSettings

**الوجهة:** `/admin/settings?tab=payments`

**المصدر:** [`src/pages/admin/AdminPaymentSettings.tsx`](../src/pages/admin/AdminPaymentSettings.tsx)

**الدور:** طرق الدفع وتفعيل/إجبار طريقة وعناوين تحويل وإعدادات رسوم الرحلة.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleSave`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

### الأقسام والعناوين وخيارات الواجهة الثابتة
- رسوم رحلة التوافق لكل طرف — `src/pages/admin/AdminPaymentSettings.tsx:51`
- قنوات الدفع البديلة — `src/pages/admin/AdminPaymentSettings.tsx:212`
- باي بال — `src/pages/admin/AdminPaymentSettings.tsx:218`
- العملات الرقمية — `src/pages/admin/AdminPaymentSettings.tsx:219`
- التحويل البنكي — `src/pages/admin/AdminPaymentSettings.tsx:220`
- إعدادات الدفع — `src/pages/admin/AdminPaymentSettings.tsx:33`
- تحكم في بوابات الدفع وقنوات الاستلام — `src/pages/admin/AdminPaymentSettings.tsx:34`
- حفظ إعدادات الدفع — `src/pages/admin/AdminPaymentSettings.tsx:38`
- اسم البنك... الآيبان... — `src/pages/admin/AdminPaymentSettings.tsx:282`

**التحقق:** قراءة مصدر؛ لا اختبار إداري فعلي أو تنفيذ إجراء حساس.

## ADM-17 — AdminFeatureSettings

**الوجهة:** `/admin/settings?tab=features`

**المصدر:** [`src/pages/admin/AdminFeatureSettings.tsx`](../src/pages/admin/AdminFeatureSettings.tsx)

**الدور:** حدود علاقات ومدة طلبات وميزات حساب والوضع الداكن.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleSave`

**حقول معنونة إضافية:** اشتراط التوثيق بالهوية الوطنية؛ السماح بإخفاء الحساب مؤقتاً؛ ميزة تتبع الزيارات (من زار ملفي)؛ تمكين تعزيز الملف الشخصي

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

### الأقسام والعناوين وخيارات الواجهة الثابتة
- ضوابط ومحددات العلاقات — `src/pages/admin/AdminFeatureSettings.tsx:124`
- التحكم في جدية الأعضاء ومنع السلوك العشوائي — `src/pages/admin/AdminFeatureSettings.tsx:124`
- ميزات وخصائص الحسابات — `src/pages/admin/AdminFeatureSettings.tsx:191`
- إتاحة أو حجب الخصائص الاستباقية للمشتركين — `src/pages/admin/AdminFeatureSettings.tsx:191`
- الوضع الداكن (التبديل الليلي) — `src/pages/admin/AdminFeatureSettings.tsx:234`
- التحكم بظهور أداة تغيير مظهر المنصة للزوار والأعضاء — `src/pages/admin/AdminFeatureSettings.tsx:234`
- إعدادات الميزات والمحددات — `src/pages/admin/AdminFeatureSettings.tsx:90`
- التحكم في الميزات النشطة والقيود التشغيلية على مستوى المنصة — `src/pages/admin/AdminFeatureSettings.tsx:91`
- حفظ كافة الإعدادات — `src/pages/admin/AdminFeatureSettings.tsx:95`
- اشتراط التوثيق بالهوية الوطنية — `src/pages/admin/AdminFeatureSettings.tsx:131`
- السماح بإخفاء الحساب مؤقتاً — `src/pages/admin/AdminFeatureSettings.tsx:198`
- ميزة تتبع الزيارات (من زار ملفي) — `src/pages/admin/AdminFeatureSettings.tsx:207`
- تمكين تعزيز الملف الشخصي — `src/pages/admin/AdminFeatureSettings.tsx:216`

**التحقق:** قراءة مصدر؛ لا اختبار إداري فعلي أو تنفيذ إجراء حساس.

## ADM-18 — AdminSecuritySettings

**الوجهة:** `/admin/settings?tab=security`

**المصدر:** [`src/pages/admin/AdminSecuritySettings.tsx`](../src/pages/admin/AdminSecuritySettings.tsx)

**الدور:** إعدادات وسياسات دخول ومفاتيح 2FA وتصحيح وإشعارات بريد/SMS ونسخ دوري؛ ظهور المفتاح لا يثبت تنفيذ الخدمة.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `saveSettings`, `handleSave`

**حقول معنونة إضافية:** المصادقة الثنائية (2FA)؛ وضع التصحيح والمراقبة؛ إشعارات البريد الإلكتروني؛ إشعارات SMS الفورية؛ النسخ الاحتياطي التلقائي الدوري

**وجهات ظاهرة في المصدر:** `/admin/settings?tab=backup`

### الأقسام والعناوين وخيارات الواجهة الثابتة
- النسخ الاحتياطي واستعادة المنصة واستيراد الأعضاء — `src/pages/admin/AdminSecuritySettings.tsx:115`
- الأمان وسياسات الدخول — `src/pages/admin/AdminSecuritySettings.tsx:133`
- تنبيهات الأمان والإشعارات — `src/pages/admin/AdminSecuritySettings.tsx:155`
- النظام والتخزين المؤقت — `src/pages/admin/AdminSecuritySettings.tsx:177`
- إعدادات الأمان، المصادقة الثنائية، وسياسات حماية لوحة الإدارة — `src/pages/admin/AdminSecuritySettings.tsx:94`
- حفظ إعدادات الأمان — `src/pages/admin/AdminSecuritySettings.tsx:98`
- المصادقة الثنائية (2FA) — `src/pages/admin/AdminSecuritySettings.tsx:138`
- وضع التصحيح والمراقبة — `src/pages/admin/AdminSecuritySettings.tsx:145`
- إشعارات البريد الإلكتروني — `src/pages/admin/AdminSecuritySettings.tsx:160`
- إشعارات SMS الفورية — `src/pages/admin/AdminSecuritySettings.tsx:167`
- النسخ الاحتياطي التلقائي الدوري — `src/pages/admin/AdminSecuritySettings.tsx:182`

**التحقق:** قراءة مصدر؛ لا اختبار إداري فعلي أو تنفيذ إجراء حساس.

## ADM-19 — AdminCities

**الوجهة:** `/admin/settings?tab=cities`

**المصدر:** [`src/pages/admin/AdminCities.tsx`](../src/pages/admin/AdminCities.tsx)

**الدور:** دول ومدن وجنسيات وبشرة؛ قوائم رسمية وأخرى وترقية ودمج وتحديث ملفات واستيراد/تصدير.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `removeNationality`, `removeCountry`, `removeCityFromCountry`, `approvePendingGeo`, `rejectPendingGeo`, `deletePendingGeo`, `toggleSelectOfficialCountry`, `toggleSelectAllOfficialCountries`, `handleBulkMoveOfficialCountriesToOther`, `handleBulkDeleteOfficialCountries`, `handleBulkMergeOfficialCountries`, `toggleSelectOtherCountry`, `toggleSelectAllOtherCountries`, `handleBulkPromoteCountries`, `handleBulkMergeCountries`, `handleAddOfficial`, `handleRename`, `handlePromoteOtherToOfficial`, `handleMoveOfficialCountryToOther`, `handleMergeCountries`, `handleDeleteOtherCountry`, `toggleSelectOfficialCity`, `toggleSelectAllOfficialCities`, `handleBulkMoveOfficialCitiesToOther`, `handleBulkDeleteOfficialCities`, `handleBulkMergeOfficialCities`, `toggleSelectOtherCity`, `toggleSelectAllOtherCities`, `handleBulkPromoteCities`, `handleBulkMergeCities`, `handlePromoteOtherCity`, `handleMergeCities`, `handleDeleteOfficialCity`, `handleMoveOfficialToOther`, `handleDeleteOtherCity`, `toggleSelectOtherNationality`, `toggleSelectAllOtherNationalities`, `handleBulkPromoteNationalities`, `handleBulkMergeNationalities`, `handleSaveOfficialEdit`, `handlePromoteOtherNationality`, `handleRenameOtherNationality`, `handleMergeOtherNat`, `handleDeleteOfficial`, `handleDeleteOtherNationality`, `handleExport`, `handleFileSelect`, `removeCustomOfficial`, `handleRenameOfficial`, `handlePromoteOther`, `handleMergeOther`, `toggleSelectOther`, `toggleSelectAllOther`, `handleBulkPromote`, `handleBulkMerge`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

### الأقسام والعناوين وخيارات الواجهة الثابتة
- الدول — `src/pages/admin/AdminCities.tsx:97`
- المدن — `src/pages/admin/AdminCities.tsx:98`
- الجنسيات — `src/pages/admin/AdminCities.tsx:99`
- البشرة — `src/pages/admin/AdminCities.tsx:100`
- استيراد / تصدير — `src/pages/admin/AdminCities.tsx:101`
- إدارة الجغرافيا والجنسيات — `src/pages/admin/AdminCities.tsx:113`
- إدارة القوائم الرسمية، تصنيف خيارات «أخرى» المخصصة، وتحديث ملفات الأعضاء تلقائياً — `src/pages/admin/AdminCities.tsx:113`
- اختر الدولة الرسمية المستهدفة — `src/pages/admin/AdminCities.tsx:719`
- اختر الجنسية الرسمية المستهدفة للدمج — `src/pages/admin/AdminCities.tsx:2458`
- تصدير البيانات — `src/pages/admin/AdminCities.tsx:2685`
- نزّل نسخة JSON من الدول أو المدن للاحتفاظ بها أو نقلها — `src/pages/admin/AdminCities.tsx:2685`
- استيراد البيانات — `src/pages/admin/AdminCities.tsx:2708`
- ارفع ملف JSON لاستيراد دول أو مدن — `src/pages/admin/AdminCities.tsx:2708`
- الكل (دول + مدن) — `src/pages/admin/AdminCities.tsx:2716`
- دول فقط — `src/pages/admin/AdminCities.tsx:2717`
- مدن دولة معينة — `src/pages/admin/AdminCities.tsx:2718`
- دمج (إضافة للموجود) — `src/pages/admin/AdminCities.tsx:2738`
- استبدال (حذف الموجود) — `src/pages/admin/AdminCities.tsx:2739`
- لون البشرة — `src/pages/admin/AdminCities.tsx:152`
- مثال: تركيا — `src/pages/admin/AdminCities.tsx:501`
- اكتب اسم الدولة الجديدة للدمج... — `src/pages/admin/AdminCities.tsx:594`
- تحديد — `src/pages/admin/AdminCities.tsx:627`
- حفظ وتحديث ملفات الأعضاء — `src/pages/admin/AdminCities.tsx:648`
- تعديل الاسم (تحديث تلقائي) — `src/pages/admin/AdminCities.tsx:653`
- دمج مع دولة أخرى — `src/pages/admin/AdminCities.tsx:654`
- نقل الدولة إلى قسم «أخرى» — `src/pages/admin/AdminCities.tsx:655`
- حذف نهائي — `src/pages/admin/AdminCities.tsx:656`
- تعديل الاسم لتحديث ملفات الأعضاء — `src/pages/admin/AdminCities.tsx:804`
- حذف هذا الخيار — `src/pages/admin/AdminCities.tsx:819`
- اكتب اسم الدولة الجديدة... — `src/pages/admin/AdminCities.tsx:895`
- ابحث عن مدينة... — `src/pages/admin/AdminCities.tsx:1419`
- لا توجد مدن رسمية — `src/pages/admin/AdminCities.tsx:1446`
- اكتب اسم المدينة الجديدة للدمج... — `src/pages/admin/AdminCities.tsx:1542`
- دمج مع مدينة أو دولة أخرى — `src/pages/admin/AdminCities.tsx:1595`
- نقل المدينة إلى قسم «أخرى» — `src/pages/admin/AdminCities.tsx:1596`
- حذف المدينة — `src/pages/admin/AdminCities.tsx:1597`
- تعديل وتحديث الملفات — `src/pages/admin/AdminCities.tsx:1776`
- دمج مع مدينة رسمية — `src/pages/admin/AdminCities.tsx:1783`
- مثال: مكة المكرمة — `src/pages/admin/AdminCities.tsx:1856`
- مثال: الرياض — `src/pages/admin/AdminCities.tsx:1946`
- ابحث باسم الجنسية أو الدولة... — `src/pages/admin/AdminCities.tsx:2316`
- مثال: السعودية — `src/pages/admin/AdminCities.tsx:2322`
- تعديل الاسم (تحديث تلقائي لملفات الأعضاء) — `src/pages/admin/AdminCities.tsx:2368`
- دمج مع جنسية رسمية أخرى — `src/pages/admin/AdminCities.tsx:2371`
- حذف — `src/pages/admin/AdminCities.tsx:2376`
- ابحث في جنسيات أخرى... — `src/pages/admin/AdminCities.tsx:2407`
- تعديل الاسم لتحديث كل ملفات الأعضاء — `src/pages/admin/AdminCities.tsx:2541`
- دمج مع جنسية رسمية — `src/pages/admin/AdminCities.tsx:2549`
- تعديل المسمى — `src/pages/admin/AdminCities.tsx:3020`
- لا توجد خيارات رسمية — `src/pages/admin/AdminCities.tsx:3037`
- لا توجد خيارات «أخرى» جديدة — `src/pages/admin/AdminCities.tsx:3112`

**التحقق:** قراءة مصدر؛ لا اختبار إداري فعلي أو تنفيذ إجراء حساس.

## ADM-20 — AdminNotifications

**الوجهة:** `/admin/settings?tab=notifications`

**المصدر:** [`src/pages/admin/AdminNotifications.tsx`](../src/pages/admin/AdminNotifications.tsx)

**الدور:** إشعارات إدارية وإرسال وتاريخ.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleSend`, `toggleMember`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

### الأقسام والعناوين وخيارات الواجهة الثابتة
- جميع الأعضاء — `src/pages/admin/AdminNotifications.tsx:20`
- الأعضاء الموثقون — `src/pages/admin/AdminNotifications.tsx:21`
- الأعضاء المميّزون — `src/pages/admin/AdminNotifications.tsx:22`
- أعضاء محددون — `src/pages/admin/AdminNotifications.tsx:23`
- إنشاء إشعار جديد — `src/pages/admin/AdminNotifications.tsx:56`
- الإشعارات المُرسلة — `src/pages/admin/AdminNotifications.tsx:150`
- الآن — `src/pages/admin/AdminNotifications.tsx:201`
- الإشعارات والحملات — `src/pages/admin/AdminNotifications.tsx:52`
- أرسل إشعارات فورية للأعضاء أو لفئات محددة — `src/pages/admin/AdminNotifications.tsx:52`
- مثال: تحديث جديد في المنصة — `src/pages/admin/AdminNotifications.tsx:109`
- اكتب رسالتك هنا... — `src/pages/admin/AdminNotifications.tsx:125`
- معاينة الإشعار — `src/pages/admin/AdminNotifications.tsx:192`
- اختيار أعضاء محددين — `src/pages/admin/AdminNotifications.tsx:216`
- ابحث بالاسم... — `src/pages/admin/AdminNotifications.tsx:223`

**التحقق:** قراءة مصدر؛ لا اختبار إداري فعلي أو تنفيذ إجراء حساس.

## ADM-21 — AdminBackupRestore

**الوجهة:** `/admin/settings?tab=backup`

**المصدر:** [`src/pages/admin/AdminBackupRestore.tsx`](../src/pages/admin/AdminBackupRestore.tsx)

**الدور:** تصدير JSON شامل ومعاينة واستعادة واستيراد أعضاء منصة وتصدير Excel/CSV؛ لم ينفذ أي نسخ أو استعادة أثناء التوثيق.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleSectionChange`, `handleExportSystemBackup`, `handleSystemFileSelect`, `handleConfirmSystemRestore`, `handlePlatformFileUpload`, `handleExecutePlatformImport`, `handleResetPlatformImport`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

### الأقسام والعناوين وخيارات الواجهة الثابتة
- النسخة الاحتياطية الشاملة لكافة محتويات المنصة — `src/pages/admin/AdminBackupRestore.tsx:464`
- استعادة نسخة احتياطية سابقة (Full Restore) — `src/pages/admin/AdminBackupRestore.tsx:512`
- قم برفع ملف النسخة الاحتياطية الشاملة بصيغة — `src/pages/admin/AdminBackupRestore.tsx:512`
- خيارات التصدير السريع المخصص (Excel & CSV) — `src/pages/admin/AdminBackupRestore.tsx:589`
- استيراد أعضاء المنصة المصدّرين (Platform Export / Restore) — `src/pages/admin/AdminBackupRestore.tsx:641`
- إعدادات واستراتيجية استيراد أعضاء المنصة — `src/pages/admin/AdminBackupRestore.tsx:675`
- اضغط لرفع ملف أعضاء المنصة المصدّر — `src/pages/admin/AdminBackupRestore.tsx:826`
- الملف المرفوع: — `src/pages/admin/AdminBackupRestore.tsx:840`
- النسخ الاحتياطي واستعادة المنصة — `src/pages/admin/AdminBackupRestore.tsx:405`
- تصدير واستعادة النسخ الاحتياطية الشاملة لكافة بيانات النظام، واستيراد ملفات أعضاء المنصة المصدّرين بدقة تامة — `src/pages/admin/AdminBackupRestore.tsx:406`
- اسم القائمة المخصصة الجديدة... — `src/pages/admin/AdminBackupRestore.tsx:773`

**التحقق:** قراءة مصدر؛ لا اختبار إداري فعلي أو تنفيذ إجراء حساس.

## تركيب المراكز والتحويلات (المصدر App.tsx)
- `/admin/analytics` → `/admin/overview?tab=analytics`
- `/admin/khataaba-directory` → `/admin/members?tab=khataaba`
- `/admin/import-members` → `/admin/members?tab=import`
- `/admin/verifications` → `/admin/members?tab=verifications`
- `/admin/requests` → `/admin/journeys?tab=requests`
- `/admin/imported-coordination` → `/admin/journeys?tab=imported`
- `/admin/transactions` → `/admin/finance?tab=transactions`
- `/admin/plans` → `/admin/finance?tab=plans`
- `/admin/exemptions` → `/admin/finance?tab=exemptions`
- `/admin/support` → `/admin/trust?tab=messages`
- `/admin/messages` → `/admin/trust?tab=messages`
- `/admin/reports` → `/admin/trust?tab=reports`
- `/admin/audit-log` → `/admin/trust?tab=audit`
- `/admin/backup` → `/admin/settings?tab=backup`
- `/admin/settings/backup` → `/admin/settings?tab=backup`
- `/admin/settings/platform` → `/admin/settings?tab=platform`
- `/admin/settings/payments` → `/admin/settings?tab=payments`
- `/admin/settings/features` → `/admin/settings?tab=features`
- `/admin/settings/security` → `/admin/settings?tab=security`
- `/admin/cities` → `/admin/settings?tab=cities`
- `/admin/notifications` → `/admin/settings?tab=notifications`

### src/pages/admin/AdminFinanceHub.tsx
- المعاملات المالية والعمليات — `src/pages/admin/AdminFinanceHub.tsx:32`
- باقات الاشتراك والأسعار — `src/pages/admin/AdminFinanceHub.tsx:33`
- الإعفاءات والتسهيلات — `src/pages/admin/AdminFinanceHub.tsx:36`

### src/pages/admin/AdminJourneysHub.tsx
- طلبات التوافق المباشرة — `src/pages/admin/AdminJourneysHub.tsx:40`
- تنسيق وساطة الخطابات والمستوردين — `src/pages/admin/AdminJourneysHub.tsx:47`

### src/pages/admin/AdminMembersHub.tsx
- إدارة الأعضاء والقوائم — `src/pages/admin/AdminMembersHub.tsx:57`
- طلبات التوثيق — `src/pages/admin/AdminMembersHub.tsx:60`
- دليل الخطابات والمكاتب — `src/pages/admin/AdminMembersHub.tsx:65`
- استيراد وتصدير الأعضاء — `src/pages/admin/AdminMembersHub.tsx:66`

### src/pages/admin/AdminOverviewHub.tsx
- العناوين تُبنى ديناميكياً؛ راجع تركيب المكوّن والمعلومات الملخّصة أعلاه.

### src/pages/admin/AdminSettingsHub.tsx
- إعدادات المنصة والهوية — `src/pages/admin/AdminSettingsHub.tsx:27`
- بوابات وطرق الدفع — `src/pages/admin/AdminSettingsHub.tsx:28`
- التحكم بالميزات والذكاء الاصطناعي — `src/pages/admin/AdminSettingsHub.tsx:29`
- الأمان وسياسات الدخول — `src/pages/admin/AdminSettingsHub.tsx:30`
- النسخ الاحتياطي واستعادة المنصة — `src/pages/admin/AdminSettingsHub.tsx:31`
- الدول والمدن والجنسيات — `src/pages/admin/AdminSettingsHub.tsx:32`
- الإشعارات والحملات — `src/pages/admin/AdminSettingsHub.tsx:33`

### src/pages/admin/AdminTrustHub.tsx
- تذاكر ومحادثات الدعم — `src/pages/admin/AdminTrustHub.tsx:46`
- البلاغات والشكاوى — `src/pages/admin/AdminTrustHub.tsx:53`
- سجل التدقيق والعمليات — `src/pages/admin/AdminTrustHub.tsx:58`

## مكونات مساعدة
AdminMemberDetailModal: تفاصيل وتعديل بيانات العضو؛ CustomListsPanel: قوائم مخصصة؛ AdminQuickSearch: بحث سريع؛ ActionMenu/FilterDropdown/MultiSelectFilter: أدوات إجراءات وفلاتر؛ GeoSuggestionsPanel: اقتراحات جغرافية. لا تعد مسارات مستقلة.

## وظائف ثابتة مقابل إعدادات
AdminPlans يعلن نموذجاً تجريبياً ثابتاً؛ لا تصفه محرر باقات كامل. AdminSecuritySettings يعرض مفاتيح 2FA وSMS وبريد ونسخ دوري، ولا يثبت وجود خدمات تعمل بهذه المفاتيح. حسابات الإدارة وصلاحياتها موجودة في AppContext، وليس مجرد ظهور صفحة الأمان دليلاً على إدارة حسابات داخلها.

## جرد الملفات غير المستقلة
ستة ملفات Hub موثقة كتجميع تبويبات؛ AdminLogin باقٍ غير مستخدم كمسار مستقل؛ GeoSuggestionsPanel داخل مجال الجغرافيا. بذلك يشمل الجرد ملفات صفحات المصدر الـ49 بين صفحات مستقلة ومكونات تجميع/مساعدة، دون الادعاء بوجود 49 صفحة مستقلة.
