// Synthetic regression tests; does not start the platform or create accounts.
// Run: node scripts/test-request-quota-guard.mjs after npm install.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { transform } from 'esbuild';
const root=process.env.TAWAFOK_SOURCE_ROOT || process.cwd();
const source=p=>fs.readFileSync(path.join(root,p),'utf8');
const context=source('src/lib/AppContext.tsx');
const marker="const checkLimit = useCallback((action: 'message' | 'search' | 'contact') => {";
const begin=context.indexOf(marker);assert(begin>=0);
const finish=context.indexOf('  }, [user.profile.plan, user.memberId, plans, usage, interestRequests, serverQuota]);',begin);assert(finish>begin);
const body=context.slice(begin+marker.length,finish);
const code=(await transform(`function checkLimit(action) {${body}}`,{loader:'ts',target:'es2022'})).code;
const now=Date.now();const today=new Date(now).toISOString().slice(0,10);
const plans=[{id:'free',searchLimit:10,showContactLimit:0},{id:'featured',searchLimit:999,showContactLimit:0}];
const usage={searchesDone:1,contactsViewed:0};
function check({memberId,plan='free',quota=null,requests=[],action='message'}={}) {
 const deps={user:{memberId,profile:{plan}},plans,usage,interestRequests:requests,serverQuota:quota,
 dataService:{db:{getCurrentUserId:()=>memberId||'guest'}},
 requestDay:()=>({start:today+'T00:00:00Z',end:new Date(Date.parse(today)+86400000).toISOString()}),
 dailyRequestLimit:({plan})=>plan==='featured'?20:5,normalizePlan:p=>p};
 return new Function(...Object.keys(deps),code+';return checkLimit;')(...Object.values(deps))(action);
}
assert.deepEqual(check(),{allowed:true,current:0,max:5,error:undefined}); // guest + null quota
assert.equal(check({memberId:'test-a'}).max,5); // member while quota is loading
assert.equal(check({memberId:'test-a',plan:'featured'}).max,20);
const fresh={memberId:'test-a',used:5,limit:5,resetAt:new Date(now+3600000).toISOString()};
assert.equal(check({memberId:'test-a',quota:fresh}).allowed,false);
assert.equal(check({memberId:'test-b',quota:fresh}).current,0);
assert.equal(check({memberId:'test-a',quota:{...fresh,resetAt:new Date(now-1000).toISOString()}}).current,0);
assert.equal(check({memberId:'test-a',quota:{...fresh,resetAt:'invalid'}}).current,0);
assert.equal(check({quota:{used:5,limit:5,resetAt:fresh.resetAt}}).current,0); // absent member IDs must not match
const requests=Array.from({length:5},()=>({sender_id:'test-a',created_at:new Date(now).toISOString()}));
assert.equal(check({memberId:'test-a',requests}).allowed,false);
assert.equal(check({memberId:'test-a',requests,quota:{...fresh,used:3}}).current,5); // local usage is not undercounted
assert.equal(check({action:'search'}).current,1);
assert.equal(check({action:'contact'}).allowed,false);
assert(!source('src/pages/Home.tsx').includes('homePreview'));
assert(!source('src/components/MemberCard.tsx').includes('homePreview'));
assert(!source('src/pages/Home.css').includes('home-card-'));
assert(source('src/pages/Search.tsx').includes('<MemberCard'));
assert(source('src/components/MemberCard.tsx').includes('member-card-title'));
assert(source('src/components/MemberCard.css').includes('font-size: 12px'));
console.log('PASS: guest/null/loading quotas; member/plan limits; fresh/expired/invalid/wrong-member quotas; local usage; shared compact cards.');
