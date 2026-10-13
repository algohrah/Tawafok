# صفحات الأعضاء والصلاحيات

> نطاق التحقق: قراءة ساكنة لمصادر GitHub عند Commit `f5cf1caf48cfa2240e4f41fb504aeec759f49802`. لم تُشغّل المنصة أو تُختبر حسابات أو مدفوعات حقيقية. «مؤكد من المصدر» لا يعني «مختبر في الموقع المنشور».

## حدود الوصول المهمة
هذه صفحات مرتبطة بالحساب وظيفياً، لكن App.tsx لا يلفّها بـ ProtectedRoute. المكوّن ProtectedRoute موجود ويحوّل إلى /login مع from، ولكنه غير مستخدم في هذه الصفحات. لا تصف جميع مسارات العضوية بأنها محمية مركزياً. JourneyPage يفحص هوية الطرف في الطلب؛ MemberProfile يتحقق من الدخول عند إجراءات الطلب/البلاغ. دقة حماية بقية العمليات يجب مراجعتها في AppContext وlocalStore، لا استنتاجها من اسم الصفحة.

## مصفوفة الاستخدام
| الوظيفة | زائر | عضو | ملاحظة |
|---|---|---|---|
| عرض العام/البحث/الملف العام | واجهة متاحة | متاحة | البيانات والإعدادات تغيّر النتائج |
| إنشاء طلب توافق | توجيه للتسجيل/الدخول | إجراء مرتبط بهوية وحدود الطلب | راجع AppContext وcreateRequest |
| فلاتر الجنس والدولة والعمر والمدينة | مجانية في الواجهة | مجانية | باقي الفلاتر توافق مميز |
| بيانات حساب ومحفوظات واشتراك | ليست وظيفة زائر مقصودة | بيانات الحساب الحالي | غياب الحارس المركزي لا يعني تصريحاً آمناً |
| تفاصيل رحلة | لا هوية صالحة | طرف الطلب فقط في فحص الصفحة | ليس تدقيق حماية خادم |
| بيانات التواصل | لا عرض تلقائي لرقم الحساب في الرحلة | يكتبها الطرف ويؤكد مشاركتها | الخصوصية على مستوى واجهة/منطق محلي |

المصدر الأساسي للعضوية: shared/membership.d.ts وsrc/lib/memberUtils.ts وAppContext.tsx؛ مصدر الإجراءات: DataService → LocalStorageAdapter → localStore.

## MEM-01 — EditProfile

**المسارات:** `/edit-profile`

**المصدر:** [`src/pages/EditProfile.tsx`](../src/pages/EditProfile.tsx)

**وظائف مؤكدة من المصدر:** تعديل المعلومات الأساسية والحالة الاجتماعية والأبناء والزواج والمظهر والصحة والتعليم والعمل والنبذة ومواصفات الشريك؛ حفظ وإلغاء والعودة للملف. بعض الحقول مقيدة بالإدارة.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleTogglePartnerMarital`, `handleAddCity`, `handleAddCountry`, `handleAddNationality`, `handleBirthDateChange`, `handleSave`

**حقول معنونة إضافية:** نوع الزواج المطلوب؛ عدد الأبناء؛ هل لديك أبناء؟؛ كم عدد الأبناء؟

**وجهات ظاهرة في المصدر:** `/profile`

### جرد الأقسام والعناوين وخيارات الواجهة الثابتة
- المعلومات الأساسية — `src/pages/EditProfile.tsx:276`
- الحالة الاجتماعية — `src/pages/EditProfile.tsx:367`
- معلن — `src/pages/EditProfile.tsx:382`
- مسيار — `src/pages/EditProfile.tsx:383`
- لا مانع / معلن او مسيار — `src/pages/EditProfile.tsx:384`
- معلومات الأبناء — `src/pages/EditProfile.tsx:393`
- تفاصيل الزواج — `src/pages/EditProfile.tsx:413`
- المواصفات الشخصية — `src/pages/EditProfile.tsx:436`
- التعليم والعمل — `src/pages/EditProfile.tsx:499`
- نبذة عني — `src/pages/EditProfile.tsx:526`
- أقبل — `src/pages/EditProfile.tsx:943`
- لا (أفضل بدون أطفال) — `src/pages/EditProfile.tsx:944`
- بشرط ألا يعيشوا معنا — `src/pages/EditProfile.tsx:945`
- تعديل الملف الشخصي — `src/pages/EditProfile.tsx:987`
- حدّث جميع معلوماتك الشخصية — `src/pages/EditProfile.tsx:987`
- الجنس — `src/pages/EditProfile.tsx:280`
- الاسم المستعار — `src/pages/EditProfile.tsx:294`
- مثال: أبو عبدالله، باحثة عن الستر — `src/pages/EditProfile.tsx:295`
- تاريخ الميلاد — `src/pages/EditProfile.tsx:297`
- العمر (محسوب تلقائيًا) — `src/pages/EditProfile.tsx:300`
- الدولة — `src/pages/EditProfile.tsx:308`
- ابحث واختر الدولة — `src/pages/EditProfile.tsx:313`
- المدينة — `src/pages/EditProfile.tsx:322`
- المنطقة / الحي — `src/pages/EditProfile.tsx:336`
- حي العليا... — `src/pages/EditProfile.tsx:337`
- الجنسية — `src/pages/EditProfile.tsx:340`
- ابحث عن الجنسية — `src/pages/EditProfile.tsx:345`
- المذهب — `src/pages/EditProfile.tsx:353`
- اختر المذهب — `src/pages/EditProfile.tsx:360`
- نوع الزواج المطلوب — `src/pages/EditProfile.tsx:379`
- عدد الأبناء — `src/pages/EditProfile.tsx:401`
- اختر — `src/pages/EditProfile.tsx:402`
- عدد الزوجات الحالي — `src/pages/EditProfile.tsx:416`
- هل لديك أبناء؟ — `src/pages/EditProfile.tsx:419`
- كم عدد الأبناء؟ — `src/pages/EditProfile.tsx:423`
- هل تبحث عن زوجة أخرى؟ — `src/pages/EditProfile.tsx:427`
- الطول (كتابة) — `src/pages/EditProfile.tsx:441`
- 80 - 300 سم — `src/pages/EditProfile.tsx:449`
- الوزن (كتابة) — `src/pages/EditProfile.tsx:455`
- 20 - 300 كجم — `src/pages/EditProfile.tsx:463`
- لون البشرة — `src/pages/EditProfile.tsx:471`
- اختر لون البشرة — `src/pages/EditProfile.tsx:476`
- العرق — `src/pages/EditProfile.tsx:480`
- اكتب العرق... — `src/pages/EditProfile.tsx:481`
- القبيلة / النسب — `src/pages/EditProfile.tsx:484`
- اسم القبيلة أو النسب... — `src/pages/EditProfile.tsx:485`
- الحالة الصحية — `src/pages/EditProfile.tsx:488`
- اكتب حالتك الصحية... — `src/pages/EditProfile.tsx:489`
- المؤهل الدراسي — `src/pages/EditProfile.tsx:503`
- اختر المؤهل — `src/pages/EditProfile.tsx:504`
- نوع جهة العمل — `src/pages/EditProfile.tsx:506`
- المسمى الوظيفي — `src/pages/EditProfile.tsx:515`
- نوع السكن — `src/pages/EditProfile.tsx:519`
- اكتب نبذة قصيرة عنك — `src/pages/EditProfile.tsx:529`
- اكتب نبذة عن شخصيتك وأهدافك... — `src/pages/EditProfile.tsx:530`
- الدول المطلوبة (يمكنك اختيار دولة واحدة أو عدة دول) — `src/pages/EditProfile.tsx:596`
- ابحث واختر الدول المطلوبة... — `src/pages/EditProfile.tsx:603`
- المدن المطلوبة (يمكنك اختيار مدينة واحدة أو عدة مدن) — `src/pages/EditProfile.tsx:677`
- ابحث واختر المدن المطلوبة... — `src/pages/EditProfile.tsx:684`
- تحديد جنسيات معينة (يمكنك اختيار جنسية واحدة أو عدة جنسيات) — `src/pages/EditProfile.tsx:793`
- ابحث واختر الجنسيات المطلوبة... — `src/pages/EditProfile.tsx:800`
- مثال: 20 — `src/pages/EditProfile.tsx:852`
- مثال: 45 — `src/pages/EditProfile.tsx:867`

**حالة التحقق:** المصدر فقط؛ العرض الفعلي، جميع الفروع الشرطية، التحقق من الحقول والأثر النهائي تحتاج اختباراً موجهاً قبل إعلان نجاح الوظيفة.

## MEM-02 — CompleteProfile

**المسارات:** `/complete-profile`

**المصدر:** [`src/pages/CompleteProfile.tsx`](../src/pages/CompleteProfile.tsx)

**وظائف مؤكدة من المصدر:** احتساب النواقص وعرض الحقول المطلوبة غير المعبأة فقط حسب الأقسام؛ نسبة اكتمال وحالة مكتمل؛ حفظ ثم العودة للملف. بعض حقول النسب والحي والملاحظات تعامل اختيارية.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleSave`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/profile`

### جرد الأقسام والعناوين وخيارات الواجهة الثابتة
- نوع الزواج المطلوب — `src/pages/CompleteProfile.tsx:28`
- القبيلة / النسب — `src/pages/CompleteProfile.tsx:29`
- المدينة — `src/pages/CompleteProfile.tsx:30`
- المنطقة / الحي — `src/pages/CompleteProfile.tsx:31`
- المذهب — `src/pages/CompleteProfile.tsx:32`
- الجنسية — `src/pages/CompleteProfile.tsx:33`
- الطول — `src/pages/CompleteProfile.tsx:35`
- الوزن — `src/pages/CompleteProfile.tsx:36`
- لون البشرة — `src/pages/CompleteProfile.tsx:37`
- العرق — `src/pages/CompleteProfile.tsx:38`
- الحالة الصحية — `src/pages/CompleteProfile.tsx:39`
- التدخين — `src/pages/CompleteProfile.tsx:40`
- المؤهل الدراسي — `src/pages/CompleteProfile.tsx:41`
- نوع جهة العمل — `src/pages/CompleteProfile.tsx:42`
- المسمى الوظيفي — `src/pages/CompleteProfile.tsx:43`
- نوع السكن — `src/pages/CompleteProfile.tsx:44`
- نبذة عني — `src/pages/CompleteProfile.tsx:45`
- دولة الشريك المطلوب — `src/pages/CompleteProfile.tsx:47`
- جنسية الشريك — `src/pages/CompleteProfile.tsx:48`
- الحالة الاجتماعية المقبولة — `src/pages/CompleteProfile.tsx:49`
- قبول الأطفال — `src/pages/CompleteProfile.tsx:50`
- ملاحظات إضافية عن الشريك — `src/pages/CompleteProfile.tsx:51`
- أكمل ملفك الشخصي — `src/pages/CompleteProfile.tsx:110`
- املأ الحقول الناقصة لزيادة فرص التوافق — `src/pages/CompleteProfile.tsx:110`
- ملفك مكتمل! 🎉 — `src/pages/CompleteProfile.tsx:150`
- لقد عبأت جميع الحقول المطلوبة. ملفك الآن جاهز لزيادة فرص التوافق. — `src/pages/CompleteProfile.tsx:150`
- معلن — `src/pages/CompleteProfile.tsx:329`
- مسيار — `src/pages/CompleteProfile.tsx:330`
- لا مانع / معلن او مسيار — `src/pages/CompleteProfile.tsx:331`
- نعم (أقبل) — `src/pages/CompleteProfile.tsx:334`
- لا (أفضل بدون أطفال) — `src/pages/CompleteProfile.tsx:335`
- لا يهم — `src/pages/CompleteProfile.tsx:336`
- بشرط ألا يعيشوا معنا — `src/pages/CompleteProfile.tsx:337`
- اختر... — `src/pages/CompleteProfile.tsx:288`
- اختر الطول — `src/pages/CompleteProfile.tsx:305`
- اختر الوزن — `src/pages/CompleteProfile.tsx:320`
- اكتب هنا... — `src/pages/CompleteProfile.tsx:382`

**حالة التحقق:** المصدر فقط؛ العرض الفعلي، جميع الفروع الشرطية، التحقق من الحقول والأثر النهائي تحتاج اختباراً موجهاً قبل إعلان نجاح الوظيفة.

## MEM-03 — Checkout

**المسارات:** `/checkout/:planId`

**المصدر:** [`src/pages/Checkout.tsx`](../src/pages/Checkout.tsx)

**وظائف مؤكدة من المصدر:** اختيار طريقة دفع بحسب الإعدادات؛ PayPal/بطاقة وتحويل رقمي وبنكي؛ ملخص فاتورة وضريبة وإثبات تحويل ونجاح أو انتظار مراجعة ثم الملف. تحويل free أو خطة بلا سعر إلى الباقات. يحتوي مسار تأكيد تجريبي؛ لا يثبت تسوية دفع حقيقية.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handlePay`, `handleFileChange`, `handleOfflinePay`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/plans`, `/profile`, `/terms`

### جرد الأقسام والعناوين وخيارات الواجهة الثابتة
- باي بال والبطاقات — `src/pages/Checkout.tsx:270`
- العملات الرقمية (Crypto) — `src/pages/Checkout.tsx:272`
- حوالة بنكية محلية — `src/pages/Checkout.tsx:274`
- ترقية الحساب والاشتراك — `src/pages/Checkout.tsx:299`
- اختر بوابة الدفع المفضلة لديك وأكمل عملية الترقية بأمان 100%. — `src/pages/Checkout.tsx:299`
- طرق الدفع المتوفرة — `src/pages/Checkout.tsx:305`
- الدفع الذكي عبر PayPal — `src/pages/Checkout.tsx:332`
- الدفع بالعملات الرقمية (USDT) — `src/pages/Checkout.tsx:470`
- تعليمات التحويل والرفع: — `src/pages/Checkout.tsx:470`
- تحويل بنكي محلّي (الراجحي / الأهلي) — `src/pages/Checkout.tsx:545`
- تحويل آمن لشركائنا البنكيين في المملكة العربية السعودية: — `src/pages/Checkout.tsx:545`
- تشفير آمن SSL 256-bit — `src/pages/Checkout.tsx:612`
- معالجة مشفرة بالكامل — `src/pages/Checkout.tsx:613`
- تحديث فوري للباقة — `src/pages/Checkout.tsx:614`
- ملخص الفاتورة والحدود — `src/pages/Checkout.tsx:626`
- أدخل هاش أو رقم TxID هنا لمطابقة دفعتك... — `src/pages/Checkout.tsx:505`
- أدخل اسمك كما بالهوية... — `src/pages/Checkout.tsx:564`
- مثال: مصرف الراجحي، الأهلي... — `src/pages/Checkout.tsx:573`

**حالة التحقق:** المصدر فقط؛ العرض الفعلي، جميع الفروع الشرطية، التحقق من الحقول والأثر النهائي تحتاج اختباراً موجهاً قبل إعلان نجاح الوظيفة.

## MEM-04 — JourneyPage

**المسارات:** `/journey`, `/journey/:id`

**المصدر:** [`src/pages/JourneyPage.tsx`](../src/pages/JourneyPage.tsx)

**وظائف مؤكدة من المصدر:** تحميل طلب بمعرف وفحص انتماء المستخدم؛ رحلة بمراحل وتوجيه الإدارة وسجل وإلغاء؛ استفسارات مدفوعة ومراجعة رسائل وعربون وتأجيل؛ مشاركة تواصل اختيارية؛ تأكيد تقدم من الطرفين ونتيجة نظرة وأتعاب نهائية وإتمام أو اعتذار.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleUpdate`, `openPayment`, `submit`, `handleBuy`, `handleSend`, `handleDefer`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/requests`, `/member/${other.id}`, `/search`

### جرد الأقسام والعناوين وخيارات الواجهة الثابتة
- 💚 زواج مبارك ميمون! — `src/pages/JourneyPage.tsx:488`
- وثيقة توثيق عقد قران وتوافق جاد — `src/pages/JourneyPage.tsx:488`
- قدّر الله وما شاء فعل 🕊️ — `src/pages/JourneyPage.tsx:516`
- انتهت رحلة طلب الاهتمام هذه دون حدوث نصيب. الزواج قسمة ونصيب، ونسأل الله العلي القدير أن يكتب لك الخير والتوفيق ويبدلك شريكاً صالحاً قريباً جداً. — `src/pages/JourneyPage.tsx:516`
- المتبقي من أتعاب المنصة لكل طرف — `src/pages/JourneyPage.tsx:573`
- يستحق بعد نتيجة النظرة الشرعية وتسليم المهر. — `src/pages/JourneyPage.tsx:573`
- المرحلة — `src/pages/JourneyPage.tsx:618`
- المبلغ — `src/pages/JourneyPage.tsx:619`
- معلومات التواصل التي سأشاركها — `src/pages/JourneyPage.tsx:716`
- معلومات الطرف الآخر — `src/pages/JourneyPage.tsx:791`
- ما هي خطوتك التالية؟ — `src/pages/JourneyPage.tsx:888`
- باقة الاستفسار والتوافق للزواج — `src/pages/JourneyPage.tsx:1058`
- عدد الرسائل — `src/pages/JourneyPage.tsx:1134`
- صالحة مع — `src/pages/JourneyPage.tsx:1135`
- نوع الرسوم — `src/pages/JourneyPage.tsx:1693`
- السداد — `src/pages/JourneyPage.tsx:1694`
- أين أنت الآن — `src/pages/JourneyPage.tsx:1979`
- ماذا تفعل — `src/pages/JourneyPage.tsx:1980`
- المرحلة التالية — `src/pages/JourneyPage.tsx:1981`
- تواصل مع الوسيطة — `src/pages/JourneyPage.tsx:207`
- دفعت أنت — `src/pages/JourneyPage.tsx:582`
- دفع الطرف الآخر — `src/pages/JourneyPage.tsx:583`
- المتبقي من أتعاب رحلة التوافق — `src/pages/JourneyPage.tsx:615`
- اكتب الرقم الذي اخترت مشاركته — `src/pages/JourneyPage.tsx:748`
- الاسم الذي تريد إظهاره — `src/pages/JourneyPage.tsx:755`
- مثال: ولي الأمر، صاحب الرقم — `src/pages/JourneyPage.tsx:760`
- مثال: من ٥ إلى ٩ مساءً — `src/pages/JourneyPage.tsx:766`
- اكتب تعليمات قصيرة وواضحة للتواصل — `src/pages/JourneyPage.tsx:771`
- إبلاغ إدارة الموقع — `src/pages/JourneyPage.tsx:823`
- باقة رسائل الاستفسار والتوافق للزواج — `src/pages/JourneyPage.tsx:1131`
- تعديل الرسالة — `src/pages/JourneyPage.tsx:1194`
- حذف الرسالة — `src/pages/JourneyPage.tsx:1209`
- اكتب استفسارك... — `src/pages/JourneyPage.tsx:1330`
- تأجيل سداد العربون — `src/pages/JourneyPage.tsx:1576`
- التواصل مع إدارة المنصة للـدعم — `src/pages/JourneyPage.tsx:1643`
- العربون — `src/pages/JourneyPage.tsx:1690`
- نتيجة النظرة الشرعية — `src/pages/JourneyPage.tsx:1732`
- الاعتذار عن الطلب — `src/pages/JourneyPage.tsx:1810`
- اكتب التفاصيل... — `src/pages/JourneyPage.tsx:1835`

**حالة التحقق:** المصدر فقط؛ العرض الفعلي، جميع الفروع الشرطية، التحقق من الحقول والأثر النهائي تحتاج اختباراً موجهاً قبل إعلان نجاح الوظيفة.

## MEM-05 — Notifications

**المسارات:** `/notifications`

**المصدر:** [`src/pages/Notifications.tsx`](../src/pages/Notifications.tsx)

**وظائف مؤكدة من المصدر:** إشعارات مرتبطة بالحساب والرحلات؛ تعليم الكل كمقروء وحذف فردي/الكل وحالة فراغ وروابط تنقل.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `removeNotif`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/search`

### جرد الأقسام والعناوين وخيارات الواجهة الثابتة
- الإشعارات — `src/pages/Notifications.tsx:84`
- تحديثات حسابك ورحلاتك — `src/pages/Notifications.tsx:112`
- لا توجد إشعارات — `src/pages/Notifications.tsx:134`
- ستظهر هنا جميع التنبيهات والتحديثات الجديدة — `src/pages/Notifications.tsx:134`
- حذف الإشعار — `src/pages/Notifications.tsx:191`

**حالة التحقق:** المصدر فقط؛ العرض الفعلي، جميع الفروع الشرطية، التحقق من الحقول والأثر النهائي تحتاج اختباراً موجهاً قبل إعلان نجاح الوظيفة.

## MEM-06 — InterestRequests

**المسارات:** `/requests`

**المصدر:** [`src/pages/InterestRequests.tsx`](../src/pages/InterestRequests.tsx)

**وظائف مؤكدة من المصدر:** تبويبات تحتاج إجراء وقيد المتابعة والمنتهية؛ مرسل/مستقبل؛ قبول واعتذار وإلغاء ونتيجة؛ تحديد جماعي ومقروء وإلغاء وحذف؛ فتح تفاصيل الرحلة أو الاستفسار أو العربون، وحالات طرف محذوف/محظور/موقوف.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `onAccept`, `onDecline`, `onPay`, `onRecordResult`, `onAdvanceIntro`, `onCancel`, `toggleSelectAll`, `toggleSelectReq`, `handleBulkDelete`, `handleBulkCancel`, `handleBulkMarkSeen`, `handler`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/journey/${requestId}?tab=deposit`, `/journey/${r.id}?tab=inquiry`, `/journey/${r.id}`, `/journey/${r.id}?tab=deposit`, `/member/${other.id}`, `/journey/${req.id}`, `/journey/${requestId}`

### جرد الأقسام والعناوين وخيارات الواجهة الثابتة
- تحتاج إجراء منك — `src/pages/InterestRequests.tsx:247`
- قيد المتابعة — `src/pages/InterestRequests.tsx:248`
- المنتهية — `src/pages/InterestRequests.tsx:249`
- طلباتي — `src/pages/InterestRequests.tsx:267`
- الكل — `src/pages/InterestRequests.tsx:342`
- أرسلتها — `src/pages/InterestRequests.tsx:343`
- استقبلتها — `src/pages/InterestRequests.tsx:344`
- سدادك أنت لتأكيد الجدية — `src/pages/InterestRequests.tsx:1174`
- سداد الطرف الآخر لتأكيد الجدية — `src/pages/InterestRequests.tsx:1175`
- لا توجد طلبات قيد المتابعة — `src/pages/InterestRequests.tsx:1282`
- أنت على المسار الصحيح — `src/pages/InterestRequests.tsx:1288`
- السجل نظيف ولا توجد رحلات منتهية — `src/pages/InterestRequests.tsx:1294`
- تحتاج ردّك الفوري — `src/pages/InterestRequests.tsx:289`
- تحتاج سداد جدية — `src/pages/InterestRequests.tsx:295`
- رحلات نشطة جارية — `src/pages/InterestRequests.tsx:301`
- ابحث بالاسم أو المدينة... — `src/pages/InterestRequests.tsx:365`
- الاعتذار عن الطلب — `src/pages/InterestRequests.tsx:493`
- اكتب التفاصيل... — `src/pages/InterestRequests.tsx:507`
- إلغاء الطلب — `src/pages/InterestRequests.tsx:518`
- اكتب سبب الإلغاء... — `src/pages/InterestRequests.tsx:538`
- تأكيد الجدية — سداد الرسوم — `src/pages/InterestRequests.tsx:555`
- تنسيق التواصل — `src/pages/InterestRequests.tsx:580`
- نتيجة النظرة الشرعية — `src/pages/InterestRequests.tsx:613`
- ملاحظة (اختياري)... — `src/pages/InterestRequests.tsx:626`
- تعليم الرحلات المحددة كـ تمت مشاهدتها — `src/pages/InterestRequests.tsx:657`
- تفريغ التحديد — `src/pages/InterestRequests.tsx:682`
- حذف الرحلات المحددة نهائياً — `src/pages/InterestRequests.tsx:691`
- إلغاء الرحلات المحددة — `src/pages/InterestRequests.tsx:723`
- سبب الإلغاء الجماعي (مثال: عدم الرغبة بالمتابعة حالياً...) — `src/pages/InterestRequests.tsx:731`
- هوية موثقة رسمياً — `src/pages/InterestRequests.tsx:906`

**حالة التحقق:** المصدر فقط؛ العرض الفعلي، جميع الفروع الشرطية، التحقق من الحقول والأثر النهائي تحتاج اختباراً موجهاً قبل إعلان نجاح الوظيفة.

## MEM-07 — AdminChat

**المسارات:** `/admin-chat`

**المصدر:** [`src/pages/AdminChat.tsx`](../src/pages/AdminChat.tsx)

**وظائف مؤكدة من المصدر:** طلبات توافق وتوجيه الإدارة وتذاكر الدعم؛ قائمة/تفاصيل ورسائل وحالات تذكرة؛ فتح تذكرة بموضوع وتصنيف ورسالة؛ انتقال إلى رحلة الطلب والاستفسار.

**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleUpdate`, `sendMessage`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** `/search`, `/member/${otherPartyId}`, `/journey/${req.id}`, `/journey/${req.id}?tab=inquiry`

### جرد الأقسام والعناوين وخيارات الواجهة الثابتة
- مفتوحة — `src/pages/AdminChat.tsx:19`
- قيد المعالجة — `src/pages/AdminChat.tsx:20`
- تم الحل — `src/pages/AdminChat.tsx:21`
- مغلقة — `src/pages/AdminChat.tsx:22`
- بانتظار الموافقة المبدئية — `src/pages/AdminChat.tsx:26`
- تم القبول - بانتظار سداد الجدية — `src/pages/AdminChat.tsx:27`
- سداد رسوم الجدية — `src/pages/AdminChat.tsx:28`
- تنسيق اللقاء الشرعي — `src/pages/AdminChat.tsx:29`
- الرؤية واللقاء الشرعي — `src/pages/AdminChat.tsx:30`
- مكتمل بتوافق مبارك 🌸 — `src/pages/AdminChat.tsx:31`
- تم الاعتذار بلطف — `src/pages/AdminChat.tsx:32`
- ملغي — `src/pages/AdminChat.tsx:33`
- إدارة التواصل وتنسيق التوافق — `src/pages/AdminChat.tsx:253`
- نتابع طلباتك ونوجهك خطوة بخطوة حتى التوفيق المبارك — `src/pages/AdminChat.tsx:253`
- لا توجد طلبات توافق نشطة حالياً — `src/pages/AdminChat.tsx:339`
- يمكنك استعراض الأعضاء المتوافقين معك وإرسال طلب توافق، وسيظهر هنا مسار التنسيق وتوجيهات الإدارة لطلبك. — `src/pages/AdminChat.tsx:339`
- اكتب رسالتك للإدارة والوسيط الشرعي... — `src/pages/AdminChat.tsx:227`
- غرفة الاستفسار والرسائل المباشرة — `src/pages/AdminChat.tsx:462`
- تذكرة دعم واستفسار جديدة — `src/pages/AdminChat.tsx:520`
- موضوع الاستفسار أو طلب التنسيق — `src/pages/AdminChat.tsx:527`
- اشرح استفسارك بالتفصيل... — `src/pages/AdminChat.tsx:555`

**حالة التحقق:** المصدر فقط؛ العرض الفعلي، جميع الفروع الشرطية، التحقق من الحقول والأثر النهائي تحتاج اختباراً موجهاً قبل إعلان نجاح الوظيفة.

## مكوّن مشترك: src/components/VerificationUploadModal.tsx
- إثبات الهوية — `src/components/VerificationUploadModal.tsx:13`
- صورة شخصية حديثة — `src/components/VerificationUploadModal.tsx:14`
- التحقق من الحساب — رفع المستندات — `src/components/VerificationUploadModal.tsx:110`
**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleFileSelect`, `handleSubmit`, `handleClose`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

## مكوّن مشترك: src/components/payments/PaymentGateway.tsx
- باي بال والبطاقات — `src/components/payments/PaymentGateway.tsx:88`
- العملات الرقمية — `src/components/payments/PaymentGateway.tsx:90`
- حوالة بنكية — `src/components/payments/PaymentGateway.tsx:92`
- اختر طريقة الدفع المعتمدة — `src/components/payments/PaymentGateway.tsx:285`
- تشفير SSL 256-bit — `src/components/payments/PaymentGateway.tsx:362`
- معالجة آمنة — `src/components/payments/PaymentGateway.tsx:363`
- تفعيل فوري — `src/components/payments/PaymentGateway.tsx:364`
- رمز المعاملة (TXID / Hash) * — `src/components/payments/PaymentGateway.tsx:336`
- إرسال إثبات التحويل الرقمي — `src/components/payments/PaymentGateway.tsx:339`
- اسم المحوّل * — `src/components/payments/PaymentGateway.tsx:349`
- البنك المحوّل منه * — `src/components/payments/PaymentGateway.tsx:351`
- تأكيد الحوالة وإرسال الإيصال — `src/components/payments/PaymentGateway.tsx:355`
**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** `handleOfflinePay`

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

## مكوّن مشترك: src/components/requests/RequestStatusPanel.tsx
- العناوين تُبنى ديناميكياً؛ راجع تركيب المكوّن والمعلومات الملخّصة أعلاه.
**معالجات التفاعل (أسماء المصدر، وليست إثبات تنفيذ ناجح):** مكوّن عرض/معالجات inline

**حقول معنونة إضافية:** الحقول والعناوين موثقة في الجرد أدناه أو تُبنى من schema

**وجهات ظاهرة في المصدر:** لا وجهة ثابتة مستخرجة

## الدفع
بوابة PaymentGateway تقرأ الإعدادات وتضيف VAT افتراضياً 15%؛ requiresOfflineReview افتراضياً false، لذا مراجعة التحويلات ليست عامة لكل الاستخدامات. وجود PayPal/بطاقة أو حالة نجاح لا يثبت وجود معالجة مالية آمنة أو تسوية. يمنع إدراج بيانات بطاقات/أسرار في التوثيق.

## استعادة كلمة المرور
updateUser في authClient دالة نجاح صوري لا تحدث كلمة مرور؛ صفحة reset-password قد تعرض نجاحاً دون تغيير فعلي. تغيير كلمة الحساب في Profile مسار مختلف يقارن accProfile.password؛ يجب اختباره مستقلاً.
