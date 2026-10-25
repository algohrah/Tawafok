// Isolated source tests only: no app server, login, network, real member or payment.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { build, transform } from 'esbuild';
const source = p => fs.readFileSync(path.resolve(p), 'utf8');
const workflowSource = source('src/lib/journeyWorkflow.ts');
const compiled = await transform(workflowSource, { loader: 'ts', format: 'cjs', target: 'es2022' });
const pureModule = { exports: {} }; new Function('module', 'exports', compiled.code)(pureModule, pureModule.exports);
const { createWorkflow, workflowOf, partyBalance, applyAdminJourneyCommand, displayStage, whatsappJourneyUrl } = pureModule.exports;
const base = () => ({ id: 1, sender_id: 'a', receiver_id: 'b', journey_stage: 'accepted', sender_paid: false, receiver_paid: false, workflow: createWorkflow(), created_at: '2026-01-01T00:00:00Z', updated_at: '2026-01-01T00:00:00Z' });
let serial = 0;
function cmd(req, action, payload = {}) { return applyAdminJourneyCommand(req, action, { note: 'تأكيد اصطناعي للاختبار', ...payload }, 'test-admin', '2026-10-20T10:00:00Z', 'test-' + ++serial); }
let r = base(); const original = JSON.stringify(r);
assert.equal(cmd(r, 'admin_record_payment', { party: 'sender', amount: -2, reference: 'negative' }).ok, false);
assert.equal(cmd(r, 'admin_record_payment', { party: 'sender', amount: NaN, reference: 'nan' }).ok, false);
assert.equal(cmd(r, 'admin_record_payment', { party: 'sender', amount: 300.001, reference: 'precision' }).ok, false);
assert.equal(JSON.stringify(r), original, 'failed commands never mutate the original');
r = cmd(r, 'admin_record_payment', { party: 'sender', amount: 300, reference: 'bank-1' }).data;
assert.equal(partyBalance(r, 'sender').remaining, 2200); assert.equal(partyBalance(r, 'receiver').remaining, 2500);
assert.equal(r.journey_stage, 'accepted', 'partial or full payments do not advance the stage');
assert.equal(cmd(r, 'admin_record_payment', { party: 'sender', amount: 300, reference: 'BANK-1' }).ok, false);
assert.equal(cmd(r, 'admin_record_payment', { party: 'sender', amount: 2201, reference: 'over' }).ok, false);
const paymentId = r.workflow.payments[0].id;
r = cmd(r, 'admin_correct_payment', { paymentId, amount: 250 }).data;
assert.equal(partyBalance(r, 'sender').remaining, 2250); assert.equal(r.workflow.payments.length, 2); assert.equal(r.workflow.payments[0].amount, 300);
r = cmd(r, 'admin_correct_payment', { paymentId, amount: 300 }).data;
assert.equal(partyBalance(r, 'sender').remaining, 2200);
r = cmd(r, 'set_stage', { stage: 'coordination' }).data;
assert.equal(r.workflow.contactShared, false); assert.equal(r.workflow.consents.sender, false);
assert.equal(cmd(r, 'admin_update_workflow', { fields: { contactShared: true } }).ok, false);
r = cmd(r, 'admin_update_workflow', { fields: { consents: { sender: true, receiver: true }, contactRecipient: 'الجهات المصرح لها - بيانات اصطناعية', contactShared: true, contactSharedAt: '2026-10-20' } }).data;
assert.equal(r.workflow.contactShared, true);
r = cmd(r, 'admin_update_workflow', { fields: { consents: { sender: false, receiver: true } } }).data;
assert.equal(r.workflow.consents.sender, false, 'consent withdrawal is possible without erasing the audit');
r = cmd(r, 'set_stage', { stage: 'sent' }).data;
assert.equal(partyBalance(r, 'sender').paid, 300, 'moving backwards preserves payments');
r = cmd(r, 'set_stage', { stage: 'engagement' }).data;
assert.equal(r.workflow.mahrConfirmed, false); assert.equal(r.workflow.outcome, 'pending');
assert.equal(cmd(r, 'admin_update_workflow', { fields: { mahrConfirmed: true } }).ok, false);
r = cmd(r, 'admin_update_workflow', { fields: { engagementConfirmed: true, mahrConfirmed: true, mahrConfirmedAt: '2026-10-20' } }).data;
r = cmd(r, 'admin_record_payment', { party: 'sender', amount: 2200, reference: 'balance-1' }).data;
r = cmd(r, 'admin_record_payment', { party: 'receiver', amount: 2500, reference: 'balance-2' }).data;
assert.equal(partyBalance(r, 'sender').remaining, 0); assert.equal(partyBalance(r, 'receiver').remaining, 0);
assert.equal(r.journey_stage, 'engagement'); assert.equal(r.workflow.outcome, 'pending', 'paid does not mean married');
r = cmd(r, 'set_stage', { stage: 'completed' }).data;
assert.equal(r.workflow.outcome, 'pending', 'stage does not fabricate marriage');
r = cmd(r, 'admin_update_workflow', { fields: { outcome: 'married' } }).data;
assert.equal(r.workflow.outcome, 'married'); assert(r.workflow.audit.length >= 10);
assert.equal(cmd(r, 'admin_update_workflow', { fields: { totalFee: -1 } }).ok, false);
assert.equal(applyAdminJourneyCommand(r, 'set_stage', { stage: 'sent', note: '' }, 'admin', '2026-10-20', 'x').ok, false);
const replay = r.workflow.audit.at(-1).id;
assert.equal(applyAdminJourneyCommand(r, 'set_stage', { stage: 'sent', note: 'retry' }, 'admin', '2026-10-20', replay).duplicate, true);
assert.equal(displayStage('seriousness'), 'accepted'); assert.equal(displayStage('sharia_viewing'), 'engagement');
assert.equal(whatsappJourneyUrl('', 1), null); assert.equal(whatsappJourneyUrl('123', 1), null);
const url = whatsappJourneyUrl('+966 500 000 000', 12); assert(url.includes('wa.me/966500000000')); assert(decodeURIComponent(url).includes('12')); assert(!decodeURIComponent(url).includes('guardian'));
assert.equal(workflowOf({ sender_paid: true }).payments.length, 0, 'old data must not be migrated');

// Bundle the actual local store against synthetic dependencies, not a running platform.
const mocks = `export const MEMBERS = [
 {id:'a',nickname:'Test A',gender:'male',status:'active',sourceType:'registered'},
 {id:'b',nickname:'Test B',gender:'female',status:'active',sourceType:'registered'},
 {id:'i',nickname:'Imported',gender:'female',status:'active',sourceType:'imported'}
]; export const DEMO_ADMIN_PASSWORD='synthetic-unused';
export const normalizeNationality=x=>x; export const memberPlan=()=> 'free'; export const dailyRequestLimit=()=>20;
export const requestDay=()=>({start:new Date().toISOString().slice(0,10)+'T00:00:00Z',end:new Date(Date.now()+86400000).toISOString().slice(0,10)+'T00:00:00Z'});`;
const result = await build({ stdin: { contents: source('src/lib/data/adapters/local/localStore.ts'), loader: 'ts', resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'cjs', write: false, plugins: [{ name: 'synthetic-dependencies', setup(b) {
  b.onResolve({ filter: /.*/ }, args => ({ path: args.path.includes('journeyWorkflow') ? 'workflow' : 'mock', namespace: 'isolated' }));
  b.onLoad({ filter: /.*/, namespace: 'isolated' }, args => ({ contents: args.path === 'workflow' ? workflowSource : mocks, loader: 'ts' }));
} }] });
const storage = new Map([
 ['twafok_local_db_v4', JSON.stringify({ requests: [{ id: 99, journey_stage: 'completed' }], events: [{ request_id: 99 }], inquiryMessages: [{ request_id: 99 }], inquiryPackages: [{}], notifications: [{ request_id: 99, type: 'request' }, { request_id: 0, type: 'admin', text: 'unrelated' }] })],
 ['payment_settings', JSON.stringify({ journeyTotalFee: 9000, journeyDepositAmount: 1000, bankDetails: 'synthetic-bank' })],
 ['saved_interest_requests', '[{"id":"old"}]'], ['saved_exempt_requests', '[{}]'], ['user_deposit_quota', '{}'],
 ['twafok_transactions_v1', JSON.stringify([{ id: 'membership', type: 'subscription', amount: 99 }, { id: 'old-deposit', type: 'deposit', amount: 500 }, { id: 'old-inquiry', type: 'inquiry' }])],
 ['saved_members_list', JSON.stringify([{ id: 'real-member-not-touched' }])], ['active_member_id', 'a'],
]);
let storageFailure = false;
const localStorage = { getItem: k => storage.get(k) ?? null, setItem: (k, v) => { if (storageFailure) throw new Error('synthetic quota'); storage.set(k, v); }, removeItem: k => storage.delete(k) };
const window = { localStorage, dispatchEvent: () => {}, location: { pathname: '/' } };
const storeModule = { exports: {} };
new Function('window', 'localStorage', 'Event', 'CustomEvent', 'module', 'exports', result.outputFiles[0].text)(window, localStorage, class {}, class {}, storeModule, storeModule.exports);
const api = storeModule.exports;
api.initializeCleanJourneyWorkflow();
assert.equal((await api.adminGetRequests()).length, 0);
const cleared = JSON.parse(storage.get('twafok_local_db_v4'));
for (const key of ['requests', 'events', 'inquiryMessages', 'inquiryPackages']) assert.deepEqual(cleared[key], []);
assert.equal(cleared.notifications.length, 1); assert.equal(cleared.notifications[0].text, 'unrelated');
assert.equal(storage.has('saved_interest_requests'), false); assert.equal(storage.has('saved_exempt_requests'), false);
assert.equal(storage.has('user_deposit_quota'), false);
assert.equal(JSON.parse(storage.get('payment_settings')).journeyTotalFee, 2500); assert.equal(JSON.parse(storage.get('payment_settings')).journeyDepositAmount, 500);
assert.equal(JSON.parse(storage.get('payment_settings')).bankDetails, 'synthetic-bank');
assert.equal(JSON.parse(storage.get('saved_members_list'))[0].id, 'real-member-not-touched');
assert.deepEqual(JSON.parse(storage.get('twafok_transactions_v1')).map(t => t.id), ['membership']);
// Remove the synthetic saved member override so the controlled fixture member list is used.
storage.delete('saved_members_list');
const created = await api.createRequest('a', 'b', 'arbitrary peer message');
assert.equal(created.ok, true); assert.equal(created.data.message, 'طلب توافق جديد عبر المنصة');
const id = created.data.id;
api.initializeCleanJourneyWorkflow(); assert.equal((await api.adminGetRequests()).length, 1, 'one-time cleanup must not delete new journeys');
assert.equal((await api.createRequest('b', 'a', 'duplicate')).ok, false);
assert.equal((await api.runRequestAction(id, 'accept', 'a')).ok, false);
api.setCurrentUserId('b'); assert.equal((await api.runRequestAction(id, 'accept', 'b')).ok, true);
assert.equal((await api.runRequestAction(id, 'pay_deposit', 'b')).ok, false);
assert.equal((await api.runRequestAction(id, 'pay_final_fee', 'b')).ok, false);
assert.equal((await api.runRequestAction(id, 'set_stage', 'b', { stage: 'completed' })).ok, false);
assert.equal((await api.runRequestAction(id, 'set_stage', 'admin', { stage: 'completed', note: 'test' })).ok, false);
localStorage.setItem('twafok_demo_admin', 'true');
localStorage.setItem('twafok_current_admin_user', JSON.stringify({ name: 'Synthetic Admin', role: 'super_admin', status: 'active' }));
let stored = (await api.adminGetRequests())[0];
assert.equal((await api.runRequestAction(id, 'admin_record_payment', 'admin', { party: 'sender', amount: 300, reference: 'test-bank-1', note: 'synthetic', expectedUpdatedAt: 'stale' })).ok, false);
assert.equal((await api.runRequestAction(id, 'admin_record_payment', 'admin', { party: 'sender', amount: 300, reference: 'test-bank-1', note: 'synthetic' })).ok, true);
stored = (await api.adminGetRequests())[0]; assert.equal(partyBalance(stored, 'sender').remaining, 2200); assert.equal(stored.journey_stage, 'accepted');
assert.equal((await api.runRequestAction(id, 'admin_set_payments', 'admin', { sender_paid: true, note: 'legacy' })).ok, false);
assert.equal((await api.runRequestAction(id, 'set_stage', 'admin', { stage: 'coordination', note: 'synthetic override' })).ok, true);
api.setCurrentUserId('a'); const visible = await api.getRequest(id); assert.equal(visible.workflow.audit.length, 0); assert.equal(visible.workflow.payments[0].reference, '');
const storedBefore = JSON.stringify((await api.adminGetRequests())[0]); storageFailure = true;
assert.equal((await api.runRequestAction(id, 'set_stage', 'admin', { stage: 'engagement', note: 'simulate failed storage' })).ok, false);
storageFailure = false; assert.equal(JSON.stringify((await api.adminGetRequests())[0]), storedBefore);
const imp = await api.createRequest('a', 'i', 'structured'); assert.equal(imp.ok, true); assert.equal(imp.data.receiver_paid, false); assert.equal(partyBalance(imp.data, 'receiver').remaining, 2500);
for (const result of [await api.buyInquiry(id, 'a'), await api.buyMessagePackageCustom('a', 20, 100), await api.initializeInquiry(id, 'a'), await api.sendInquiry(id, 'a', 'new'), await api.simulateReply(id, 'b', 'reply')]) assert.equal(result.ok, false);
assert.equal(api.consumeUserInquiryMessage('a'), false);
assert.equal(api.recordTransaction({ type: 'deposit', amount: 500 }), false);
assert.equal(api.recordTransaction({ type: 'inquiry', amount: 100 }), false);
console.log('PASS: clean-start deletion is scoped and one-time; no demo journeys; 300→2200; independent parties; immutable corrections; consent; stage overrides; mahr and marriage independent; local permissions; stale writes/storage failures; no member messaging or self-confirmed journey payment.');
