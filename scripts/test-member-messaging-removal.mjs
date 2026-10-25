// Isolated source tests with synthetic data only; does not start the platform.
// Run: node scripts/test-member-messaging-removal.mjs (after npm install).
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { transform } from 'esbuild';
const root = process.env.TAWAFOK_SOURCE_ROOT || process.cwd();
const source = p => fs.readFileSync(path.join(root, p), 'utf8');
const store = source('src/lib/data/adapters/local/localStore.ts');
const between = (text, first, next) => text.slice(text.indexOf(first), text.indexOf(next, text.indexOf(first)));
const messaging = between(store, '// ===== توجيهات الإدارة فقط', '// ===== #9 إشعارات الرحلة =====');
const creating = between(store, 'export async function createRequest(', '\nfunction addEvent(');
const actions = between(store, 'export async function runRequestAction(', '// ===== سجل الأحداث =====');
const notifications = between(store, 'export async function getJourneyNotifications(', 'export async function getActionableRequestsCount(');
const finance = between(store, 'export function recordTransaction(', 'export function validateCoupon(');
assert(messaging && creating && actions && notifications && finance);
const code = (await transform([messaging, creating, actions, notifications, finance].join('\n').replace(/^export /gm, ''), { loader: 'ts', target: 'es2022' })).code;
let saves = 0, sequence = 100;
const db = {
  requests: [{ id: 1, sender_id: 'test-a', receiver_id: 'test-b', journey_stage: 'sent', sender_paid: false, receiver_paid: false }],
  inquiryPackages: [{ id: 1, owner_id: 'test-a', active: true, credits_total: 20, credits_used: 3 }],
  inquiryMessages: [
    { id: 1, request_id: 1, sender_id: 'test-a', text: 'historical', created_at: '2026-01-01' },
    { id: 2, request_id: 1, sender_id: 'admin', text: 'guidance', created_at: '2026-01-02' },
    { id: 3, request_id: 1, sender_id: 'admin', text: 'مرحباً بكما في غرفة الاستفسار القديمة', created_at: '2026-01-03' },
  ],
  notifications: [{ id: 1, user_id: 'test-a', type: 'inquiry', read: false }, { id: 2, user_id: 'test-a', type: 'admin', read: false }],
  events: [],
};
const txs = [{ id: 'legacy', type: 'inquiry', status: 'pending' }];
const deps = {
  load: () => db, save: () => { saves++; }, delay: async () => {}, nextId: () => ++sequence,
  addEvent: (...args) => db.events.push(args.slice(1)),
  addNotification: (_db, user_id, request_id, type, text) => db.notifications.push({ user_id, request_id, type, text, read: false }),
  notifyOther: () => {}, getCurrentUserId: () => 'test-a', stageTitle: x => x,
  getLiveMemberById: id => ({ id, gender: id === 'test-b' ? 'female' : 'male', nickname: id }),
  getLiveMembers: () => [{ id: 'test-a' }, { id: 'test-c' }],
  requestDay: () => ({ start: '2026-01-01', end: '2026-01-02' }), dailyRequestLimit: () => 20,
  getNextRequestNumber: () => 2, getNextRequestId: () => 2,
  getTransactions: () => txs, setLocalSetting: () => { saves++; },
};
const names = ['buyInquiry','buyMessagePackageCustom','initializeInquiry','sendInquiry','simulateReply','consumeUserInquiryMessage','getUserInquiryBalance','getInquiry','getAllInquiryMessages','moderateInquiryMessage','updateInquiryMessage','deleteInquiryMessage','createRequest','runRequestAction','getJourneyNotifications','getUnreadNotificationsCount','recordTransaction','updateTransactionStatus'];
const api = new Function(...Object.keys(deps), code + '\nreturn {' + names.join(',') + '};')(...Object.values(deps));
const before = JSON.stringify(db);
for (const result of [await api.buyInquiry(1,'test-a'), await api.buyMessagePackageCustom('test-a',20,100), await api.initializeInquiry(1,'test-a'), await api.sendInquiry(1,'test-a','new'), await api.simulateReply(1,'test-b','reply')]) assert.equal(result.ok,false);
assert.equal(api.consumeUserInquiryMessage('test-a'),false);
assert.equal(api.moderateInquiryMessage(1,'approve','admin'),false);
assert.equal(api.updateInquiryMessage(1,'change archive'),false);
assert.equal(api.deleteInquiryMessage(1),false);
assert.deepEqual(api.getAllInquiryMessages(),[]);
assert.equal(api.getUserInquiryBalance('test-a'),17);
assert.equal(JSON.stringify(db),before,'disabled APIs must not alter any stored data');
assert.equal(saves,0);
const guidance = await api.getInquiry(1);
assert.deepEqual(guidance.messages.map(m=>m.id),[2]);
assert.equal(guidance.package,null); assert.equal(guidance.remaining,0);
assert.equal((await api.sendInquiry(1,'admin','new guidance')).ok,true);
assert.equal(db.inquiryMessages.at(-1).sender_id,'admin');
assert.equal(db.inquiryPackages[0].credits_used,3);
assert.equal(api.updateInquiryMessage(2,'updated guidance'),true);
assert.equal(api.deleteInquiryMessage(2),true);
assert.equal(db.inquiryMessages.find(m=>m.id===1).text,'historical');
assert.equal((await api.getJourneyNotifications('test-a')).some(n=>n.type==='inquiry'),false);
assert.equal(api.getUnreadNotificationsCount('test-a'),(await api.getJourneyNotifications('test-a')).filter(n=>!n.read).length);
const savesBefore=saves;
assert.equal(api.recordTransaction({type:'inquiry',amount:100}),false);
assert.equal(api.updateTransactionStatus('legacy','completed'),false);
assert.equal(txs.length,1);assert.equal(txs[0].status,'pending');assert.equal(saves,savesBefore);
const created=await api.createRequest('test-a','test-c','arbitrary peer text');
assert.equal(created.ok,true);assert.equal(created.data.message,'طلب توافق جديد عبر المنصة');
for(const [action,actor,stage] of [['accept','test-b','accepted'],['pay_deposit','test-a','seriousness'],['pay_deposit','test-b','coordination']]) {
 assert.equal((await api.runRequestAction(1,action,actor)).ok,true);
 assert.equal(db.requests.find(r=>r.id===1).journey_stage,stage);
}
assert.equal(db.inquiryPackages[0].credits_used,3);
const uiPaths=['src/pages/Home.tsx','src/pages/Plans.tsx','src/pages/Checkout.tsx','src/pages/Profile.tsx','src/pages/JourneyPage.tsx','src/pages/InterestRequests.tsx','src/pages/AdminChat.tsx','src/pages/MemberProfile.tsx','src/pages/admin/AdminPlans.tsx','src/pages/admin/AdminRequests.tsx','src/pages/admin/AdminMessages.tsx','src/components/AcceptedCelebrationModal.tsx','src/components/MemberProfileModal.tsx','src/lib/data.ts'];
for(const p of uiPaths) assert(!/tab=inquiry|رسائل الاستفسار|باقات الرسائل|استفسار أولاً|رسالة اهتمام مخصصة|onInquiry=|<InquiryRoom/.test(source(p)),p);
assert(!source('src/lib/AppContext.tsx').includes('sendPreExchangeChatMessage'));
assert(source('src/pages/JourneyPage.tsx').includes('<DepositInline req={req}'));
console.log('PASS: blocked member send/reply/buy/init/consume/moderation; preserved legacy data; admin guidance; hidden old notifications; blocked old purchases; structured requests; accepted -> deposit -> coordination; UI regression scan.');
