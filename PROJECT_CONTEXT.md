# سياق مشروع توافق — نقطة البداية

> نطاق التحقق: قراءة ساكنة لمصادر GitHub عند Commit `f5cf1caf48cfa2240e4f41fb504aeec759f49802`. لم تُشغّل المنصة أو تُختبر حسابات أو مدفوعات حقيقية. «مؤكد من المصدر» لا يعني «مختبر في الموقع المنشور».

## اقرأ حسب المهمة، لا تقرأ المشروع كله
| المهمة | المرجع |
|---|---|
| صفحة عامة، بحث، تسجيل، دخول، ملف عام | [public-pages](docs/public-pages.md) |
| حساب، محفوظات، اشتراك، إشعارات، طلبات | [member-pages](docs/member-pages.md) |
| لوحة الإدارة وأقسامها وتحويلاتها | [admin-panel](docs/admin-panel.md) |
| انتقالات ومراحل وتوافق ومدفوعات ودعم واستيراد | [user-journeys](docs/user-journeys.md) |

## المشروع وحالة المعلومات
المستودع algohrah/Tawafok؛ فرع التوثيق main؛ الموقع https://algohrah.github.io/Tawafok/. هدف الواجهة وساطة زواج عربية مع أعضاء وملفات مستوردة وإشراف إداري. المرجع أعلاه هو Commit الكود السابق لإضافة التوثيق، لا تاريخ النسخة المنشورة. لا تعتمد على تقارير المحادثة عند مخالفتها للمصدر.

## التقنية والتشغيل المؤكدان من المصدر
React 19 وTypeScript وVite 7 وTailwind 4 وReact Router 7 وFramer Motion وsql.js وxlsx، وفق package.json. build يبني Vite ثم server.cjs عبر esbuild. server.ts خادم Express/Vite مع /api/health فقط في المصدر المقروء؛ لا backend مشترك للأعضاء مثبت.

App.tsx يستخدم BrowserRouter. vite.config.ts يحوله إلى HashRouter عند GITHUB_ACTIONS=true. base الأصلي في هذا الوضع /tawasul-marriage-platform/؛ pages.yml يستبدله بـ /Tawafok/ أثناء البناء. workflow على كل push main، يبني local، يحذف ملفات server من الناتج وينشر gh-pages. إضافة التوثيق قد تشغّل workflow الموجود تلقائياً؛ لم يعدّل هذا التوثيق workflow أو ينشئ فرعاً بنفسه.

DataService يختار LocalStorageAdapter دائماً؛ config يتيح local فقط؛ sqliteDb يستخدم SQLite مع IndexedDB، بينما localStore وAppContext وauthClient تستخدم مخازن متصفح وlocalStorage. cloudSyncEnabled=false. لا تضمن بيانات مشتركة عبر أجهزة؛ تغيير الاستضافة لا يربط قاعدة بيانات تلقائياً. GitHub Pages يستطيع تقديم واجهة تتصل بخدمة خارجية إذا بُرمجت، لكنه لا يشغّل backend المشروع؛ القول السابق بأنه يستحيل ربطه بقاعدة حية غير دقيق.

## خريطة الملفات المشتركة
- src/App.tsx: المسارات والتحويلات والتحميل الكسول/prefetch ومعالجة فشل chunk.
- src/lib/AppContext.tsx: جلسة وحساب وإعدادات وصلاحيات ومزامنة حالة واجهة محلية.
- src/lib/data/DataService.ts، LocalStorageAdapter.ts، interfaces.ts: واجهة البيانات.
- src/lib/data/adapters/local/localStore.ts: الطلبات ومراحلها ورسائل/أرصدة ومدفوعات وإجراءات إدارية.
- src/lib/sqliteDb.ts: تهيئة وحفظ SQLite؛ authClient.ts وadminAuth.ts: مصادقة محلية.
- src/lib/journey.ts: مراحل وشرح وإجراءات وقيم مرجعية؛ shared/membership.d.ts: العضويات.
- src/components/layout وui/Header.tsx: عناصر عامة؛ components/admin/AdminLayout.tsx: دخول وتنقل إدارة.
- src/components/payments/PaymentGateway.tsx: واجهة دفع مشتركة؛ systemBackup.ts وimportBatches.ts وgeoStore.ts وverificationStore.ts: خدمات مجالات.

## مستوى الاكتمال وحدود الثقة
- مؤكد ساكناً: جميع مسارات App.tsx، جميع ملفات صفحات src/pages، المراكز والتبويبات والعناوين الثابتة والوجهات ومعالجات التفاعل وجوانب من طبقات البيانات/المصادقة/النشر.
- جرد العناوين لا يساوي إثبات ظهور جميع الأقسام في جميع حالات الحساب؛ العناوين المبنية ديناميكياً موثقة عبر الملخص ومصدر الصفحة، وأرقام الأسطر تخص المرجع فقط.
- غير متحقق تشغيلـياً: تسجيل دخول حقيقي، تسوية مدفوعات، بريد، صلاحيات خادمية، بيانات إنتاج، تطابق الموقع المنشور ونجاح workflow، كل فرع شرطي والتحقق من كل حقل، تكاملات Google/بوابات الدفع الفعلية.
- ProtectedRoute موجود لكنه غير مستخدم في صفحات العضو المسجلة؛ الإدارة محلية مع محاولات API غير معرّفة في server.ts. لا تعتمد على ادعاءات الأمن والتشفير في نصوص الواجهة كتدقيق.
- استعادة البريد تعيد نجاحاً محلياً دون إرسال؛ صفحة AdminLogin باقية في الكود لكن /admin-login يحوّل إلى /admin. هذه معلومات المصدر وليست إصلاحات جديدة.

## بروتوكول المساعد القادم
1. اقرأ هذا الفهرس ثم ملف المجال المرتبط بالمهمة فقط.
2. قارن HEAD بالمرجع: إن تغير، راجع الفروق والملفات التابعة ذات الصلة. إذا لم تتوفر أداة مقارنة اطلب تفاصيل commits/ملفات مستهدفة أو استخدم قراءة GitHub مصرحاً بها؛ لا تدّع وجود أداة غير متاحة.
3. اقرأ النسخة الحالية لأي ملف قبل تعديله، حتى إن لم يتغير المرجع. لا حاجة لقراءة lockfiles/assets لمهمة واجهة عادية.
4. التعديل يحتاج إذن؛ العمل على GitHub، لا تشغيل نسخة محلية ولا فروع/نسخ احتياطية إلا بتصريح. أدوات محلية للتحليل أو تجربة الموقع ليست إذناً لاستنساخ وتشغيل المنصة.
5. اختبر نطاق الوظيفة وتبعياتها؛ المصادقة/بيانات/توجيه تحتاج تحققاً أوسع. افصل حفظ commit وبناء ونشر واختبار.
6. لا توثّق كلمات مرور/أسرار ولا تفاصيل حسابات أو معاملات حقيقية.

## تحديث التوثيق دون تكرار
صفحة عامة في public-pages مرة واحدة؛ اختلاف حالة الدخول يذكر فيها. صفحة حساب خاصة في member-pages. إجراء إدارة في admin-panel. الرحلة تربط المجالات ولا تعيد جرد حقولها. بعد تغيير سلوك حدّث المقطع المتأثر ورحلاته، ثم سجّل Commit الكود المرجعي في الملف المتأثر؛ لا تقدّم مرجع الفهرس كفحص شامل جديد إن لم تُراجع جميع المجالات. عند مراجعة شاملة لاحقة يمكن تحديث المرجع المشترك. أسماء PUB/MEM/ADM/FLOW ثابتة ولا تعاد أرقامها بعد الحذف.

## فهرس جميع الصفحات والمسارات
- Home: `/` → [التفاصيل](docs/public-pages.md)
- Search: `/search` → [التفاصيل](docs/public-pages.md)
- MemberProfile: `/member/:id`, `/u/:username` → [التفاصيل](docs/public-pages.md)
- About: `/about` → [التفاصيل](docs/public-pages.md)
- Contact: `/contact` → [التفاصيل](docs/public-pages.md)
- Plans: `/plans` → [التفاصيل](docs/public-pages.md)
- Register: `/register` → [التفاصيل](docs/public-pages.md)
- Login: `/login` → [التفاصيل](docs/public-pages.md)
- ForgotPassword: `/forgot-password` → [التفاصيل](docs/public-pages.md)
- ResetPassword: `/reset-password` → [التفاصيل](docs/public-pages.md)
- Legal: `/legal/privacy`, `/legal/terms` → [التفاصيل](docs/public-pages.md)
- NotFound: `*` → [التفاصيل](docs/public-pages.md)
- Profile: `/profile` → [التفاصيل](docs/public-pages.md)
- EditProfile: `/edit-profile` → [التفاصيل](docs/member-pages.md)
- CompleteProfile: `/complete-profile` → [التفاصيل](docs/member-pages.md)
- Checkout: `/checkout/:planId` → [التفاصيل](docs/member-pages.md)
- JourneyPage: `/journey`, `/journey/:id` → [التفاصيل](docs/member-pages.md)
- Notifications: `/notifications` → [التفاصيل](docs/member-pages.md)
- InterestRequests: `/requests` → [التفاصيل](docs/member-pages.md)
- AdminChat: `/admin-chat` → [التفاصيل](docs/member-pages.md)
- AdminDashboard: `/admin/overview` → [التفاصيل](docs/admin-panel.md)
- AdminAnalytics: `/admin/overview?tab=analytics` → [التفاصيل](docs/admin-panel.md)
- AdminMembers: `/admin/members?tab=members` → [التفاصيل](docs/admin-panel.md)
- AdminVerifications: `/admin/members?tab=verifications` → [التفاصيل](docs/admin-panel.md)
- AdminKhataabaDirectory: `/admin/members?tab=khataaba` → [التفاصيل](docs/admin-panel.md)
- AdminImportMembers: `/admin/members?tab=import` → [التفاصيل](docs/admin-panel.md)
- AdminRequests: `/admin/journeys?tab=requests` → [التفاصيل](docs/admin-panel.md)
- AdminImportedCoordination: `/admin/journeys?tab=imported` → [التفاصيل](docs/admin-panel.md)
- AdminTransactions: `/admin/finance?tab=transactions` → [التفاصيل](docs/admin-panel.md)
- AdminPlans: `/admin/finance?tab=plans` → [التفاصيل](docs/admin-panel.md)
- AdminExemptions: `/admin/finance?tab=exemptions` → [التفاصيل](docs/admin-panel.md)
- AdminMessages: `/admin/trust?tab=messages` → [التفاصيل](docs/admin-panel.md)
- AdminReports: `/admin/trust?tab=reports` → [التفاصيل](docs/admin-panel.md)
- AdminAuditLog: `/admin/trust?tab=audit` → [التفاصيل](docs/admin-panel.md)
- AdminPlatformSettings: `/admin/settings?tab=platform` → [التفاصيل](docs/admin-panel.md)
- AdminPaymentSettings: `/admin/settings?tab=payments` → [التفاصيل](docs/admin-panel.md)
- AdminFeatureSettings: `/admin/settings?tab=features` → [التفاصيل](docs/admin-panel.md)
- AdminSecuritySettings: `/admin/settings?tab=security` → [التفاصيل](docs/admin-panel.md)
- AdminCities: `/admin/settings?tab=cities` → [التفاصيل](docs/admin-panel.md)
- AdminNotifications: `/admin/settings?tab=notifications` → [التفاصيل](docs/admin-panel.md)
- AdminBackupRestore: `/admin/settings?tab=backup` → [التفاصيل](docs/admin-panel.md)

التحويلات القديمة وأسماء Hub والعناصر المساعدة موثقة في admin-panel/public-pages.

## تنبيه مصادقة إضافي
مصدر authClient.auth.updateUser يعيد نجاحاً دون تحديث؛ signInWithIdToken ينشئ جلسة google.local محلية. لا تعتبر ResetPassword أو Google OAuth وظائف إنتاج مكتملة.
