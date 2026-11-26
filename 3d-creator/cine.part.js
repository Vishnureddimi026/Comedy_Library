/* ============================================================ CINEMATIC VIDEO */
const CINE=(()=>{
const W=1280,H=720;
const LOC={campus:"College campus",classroom:"Classroom",corridor:"College corridor",canteen:"Canteen",bedroom:"Bedroom",house:"House (living room)",kitchen:"Kitchen",street:"Street",market:"Market",park:"Park",village:"Village",office:"Office",stage:"Stage / function hall",beach:"Beach"};
const INDOOR={classroom:1,corridor:1,canteen:1,bedroom:1,house:1,kitchen:1,office:1,stage:1};
const TIME={day:"Day",evening:"Evening",night:"Night"};
const CAMS={ews:"Extreme wide",ws:"Wide",full:"Full body",ms:"Medium",mcu:"Medium close-up",cu:"Close-up",ecu:"Extreme close-up",ots:"Over the shoulder",low:"Low angle",high:"High angle",bird:"Bird's-eye",side:"Side view",front:"Front view"};
const MOVES={static:"Still",pan:"Pan",tilt:"Tilt",dollyin:"Dolly in",dollyout:"Dolly out",track:"Tracking",orbit:"Orbit (dynamic)",crane:"Crane down",shake:"Handheld shake"};
const ACTS={stand:"Stand",talk:"Talk with hands",walkinL:"Walk in from left",walkinR:"Walk in from right",walkoutL:"Walk out to left",walkoutR:"Walk out to right",run:"Run across",sit:"Sit",wave:"Wave",point:"Point",cheer:"Cheer",laugh:"Laugh (belly)",facepalm:"Facepalm",shrug:"Shrug",think:"Think",cross:"Arms crossed",hips:"Hands on hips",bow:"Bow",dance:"Dance",jump:"Jump",namaste:"Namaste",turnaway:"Turn away"};
const ACTPOSE={stand:"idle",talk:"idle",walkinL:"idle",walkinR:"idle",walkoutL:"idle",walkoutR:"idle",run:"run",sit:"sit",wave:"wave",point:"point",cheer:"cheer",laugh:"laugh",facepalm:"facepalm",shrug:"shrug",think:"think",cross:"cross",hips:"hips",bow:"bow",dance:"dance",jump:"jump",namaste:"namaste",turnaway:"idle"};
const POS={fl:["Far left",-2.7,0],l:["Left",-1.35,0],c:["Centre",0,0],r:["Right",1.35,0],fr:["Far right",2.7,0],bl:["Back left",-1.4,-1.8],br:["Back right",1.4,-1.8]};
const SFX={none:"None",boing:"Boing",badum:"Ba-dum-tss",whoosh:"Whoosh",pop:"Pop",ding:"Ding",crash:"Crash",dramatic:"Dramatic hit",heartbeat:"Heartbeat"};
const TRANS={cut:"Cut",fade:"Fade",flash:"Flash"};
const MUSIC={auto:"Auto (match the scene)",comedy:"Comedy bounce",emotional:"Emotional",action:"Action",calm:"Calm",file:"My music file",none:"No music"};
const EXP=Object.assign({"":"Normal"},Object.fromEntries(Object.entries(EXPR).map(([k,[n]])=>[k,n])));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,u)=>a+(b-a)*u,ease=u=>u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2,uid=()=>Math.random().toString(36).slice(2,10);
const opt=(o,v)=>Object.entries(o).map(([k,n])=>`<option value="${E(k)}"${k===v?" selected":""}>${E(n)}</option>`).join("");
/* ---------------- storage (IndexedDB) */
let dbp=null;function idb(){if(!dbp)dbp=new Promise((res,rej)=>{try{const r=indexedDB.open("cc3d-cine",1);r.onupgradeneeded=()=>{const d=r.result;d.createObjectStore("kv");d.createObjectStore("blobs")};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)}catch(e){rej(e)}});return dbp}
async function dget(st,k){try{const d=await idb();return await new Promise((res,rej)=>{const q=d.transaction(st).objectStore(st).get(k);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})}catch(e){return undefined}}
async function dput(st,k,v){try{const d=await idb();await new Promise((res,rej)=>{const tx=d.transaction(st,"readwrite");tx.objectStore(st).put(v,k);tx.oncomplete=res;tx.onerror=()=>rej(tx.error)});return true}catch(e){return false}}
async function ddel(st,k){try{const d=await idb();await new Promise((res)=>{const tx=d.transaction(st,"readwrite");tx.objectStore(st).delete(k);tx.oncomplete=res;tx.onerror=res})}catch(e){}}
const ST8={scenes:[],cur:null,view:"write",edit:null,busy:"",set:{music:"auto",vol:.35,sfx:true,subs:true,title:true,trans:"plan",q:"hd"},locThumbs:{}};
let saveT=0;function persist(){clearTimeout(saveT);saveT=setTimeout(async()=>{const ok=await dput("kv","state",{scenes:ST8.scenes,cur:ST8.cur,set:ST8.set,locThumbs:ST8.locThumbs});if(!ok)toast("Couldn't save — browser storage is blocked or full")},400)}
const scene=()=>ST8.scenes.find(s=>s.id===ST8.cur)||null;
function newScene(prev){const s={id:uid(),title:prev?"Scene "+(ST8.scenes.length+1):"Scene 1",text:"",parts:"",cast:prev?prev.cast.slice():[],genre:"auto",prevId:prev?prev.id:null,shots:[],memory:null,planner:"",created:Date.now(),videos:[]};ST8.scenes.push(s);ST8.cur=s.id;ST8.view="write";persist();return s}
/* ---------------- characters */
function confByName(n){const s=LIST.find(c=>c.name===n)||Object.values(PRESETS).find(p=>p.name===n);const o=JSON.parse(JSON.stringify(Object.assign({},BASE,s||{name:n})));delete o.thumb;return o}
function castCards(){const seen=new Set(),out=[];LIST.forEach(c=>{if(!seen.has(c.name)){seen.add(c.name);out.push({name:c.name,thumb:c.thumb||"",mine:true})}});Object.values(PRESETS).forEach(p=>{if(!seen.has(p.name)){seen.add(p.name);out.push({name:p.name,thumb:"",mine:false})}});return out}
function describe(n){const c=confByName(n);return `${n} — ${c.gender}, ${c.build} build, ${OPT.hair[c.hair]||c.hair} hair, ${OPT.top[c.top]||c.top}, ${OPT.bottom[c.bottom]||c.bottom}${c.acc.length?", "+c.acc.join("/"):""}`}
/* ---------------- quick planner (works without AI) */
const LOCW=[["classroom",/class ?room|classroom|lecture|తరగతి|క్లాస్|class lo|bench/i],["corridor",/corridor|hallway|veranda|verandah|కారిడార్/i],["canteen",/canteen|cafeteria|tea stall|mess hall|క్యాంటీన్|టీ కొట్టు|chai (kottu|stall)/i],["bedroom",/bed ?room|bedroom|on the bed|పడక|బెడ్/i],["kitchen",/kitchen|vantagadi|వంటగది|cooking/i],["house",/living room|\bhouse\b|\bhome\b|\billu\b|intlo|ఇల్లు|ఇంట్లో|hall lo/i],["street",/street|\broad\b|galli|రోడ్డు|వీధి|bus stop/i],["market",/market|bazaar|santha|మార్కెట్|సంత/i],["park",/\bpark\b|garden|పార్క్/i],["village",/village|palle|\booru\b|grama|గ్రామ|పల్లె|ఊరు/i],["office",/office|ఆఫీస్|cabin/i],["stage",/\bstage\b|function|party hall|auditorium|స్టేజ్|ఫంక్షన్/i],["beach",/beach|sea shore|samudram|బీచ్|సముద్ర/i],["campus",/college|campus|university|కాలేజ్|కాలేజీ/i]];
const detectLoc=s=>{for(const [k,r] of LOCW)if(r.test(s))return k;return null};
const detectTime=s=>/\bnight\b|raatri|రాత్రి|midnight/i.test(s)?"night":/evening|saayantram|సాయంత్రం|sunset/i.test(s)?"evening":/morning|\bday\b|udayam|ఉదయం|afternoon/i.test(s)?"day":null;
const detectGenre=s=>/\bcry|tears|sad\b|emotional|edupu|ఏడు|miss you|sorry amma/i.test(s)?"emotional":/fight|chase|punch|kick|gun|goondas?|గొడవ|fight scene/i.test(s)?"action":"comedy";
const EMOW=[["laugh",/laugh|haha|hehe|😂|🤣|navv|నవ్వ|giggl/i],["angry",/angry|shout|yell|kopam|కోపం|furious|scold|tittu|తిట్ట/i],["sad",/\bsad\b|cr(y|ies)|tears|edupu|ఏడ|upset|heartbroken/i],["shocked",/shock|surpris|gasp|what\?!|\?!|aascharya|ఆశ్చర్య|stunned|scared|bhayam|భయ/i],["love",/love|blush|crush|prema|ప్రేమ|romantic/i],["sleepy",/sleep|yawn|nidra|నిద్ర|tired/i],["cool",/cool|smirk|attitude|style ga|swag/i],["silly",/silly|wink|tongue|joke|prank/i],["serious",/serious|stern|strict|calm/i]];
const detectEmo=s=>{for(const [k,r] of EMOW)if(r.test(s))return k;return null};
const ACTW=[["run",/\brun|runs|running|chase|parige|పరిగె|rush/i],["walkoutR",/leaves|exits|walks (out|away)|goes out|velli?poyadu|వెళ్లిపో|walks off/i],["walkinL",/enters|walks in|comes in|arrives|vastadu|vachadu|వస్తాడు|వచ్చాడు|వస్తుంది|entry/i],["sit",/\bsits?\b|sitting|kurchun|కూర్చు|sat down/i],["wave",/wave|waves|hi cheppu/i],["point",/point/i],["dance",/dance|dances|step(s)? vest|డ్యాన్స్/i],["jump",/jump|egir|ఎగిరి/i],["facepalm",/facepalm|hits (his|her) head|tala kottu|తల కొట్టు/i],["shrug",/shrug/i],["think",/think|alochi|ఆలోచి|wonders/i],["namaste",/namaste|namaskaram|నమస్కా|నమస్తే/i],["cross",/folds (his|her) arms|arms crossed|crosses arms/i],["hips",/hands on (his|her) hips/i],["bow",/bows?\b|touch(es)? feet/i],["laugh",/laugh|navv|నవ్వ/i],["cheer",/cheer|celebrat|yay|hurray/i],["turnaway",/turns away|turns back/i]];
const detectAct=s=>{for(const [k,r] of ACTW)if(r.test(s))return k;return null};
const tokens=n=>n.toLowerCase().split(/[\s._-]+/).filter(t=>t.length>=3&&!["the","dj","mr","mrs","sir"].includes(t));
const mentions=(s,n)=>{const l=s.toLowerCase();return l.includes(n.toLowerCase())||tokens(n).some(t=>new RegExp("(^|[^a-z])"+t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"([^a-z]|$)").test(l))};
const matchName=(s,cast)=>{s=s.trim().replace(/^[*_"“]+|[*_"”]+$/g,"");if(!s)return null;return cast.find(n=>n.toLowerCase()===s.toLowerCase())||cast.find(n=>mentions(s,n))||null};
function slots(n){return [["c"],["l","r"],["l","c","r"],["fl","l","r","fr"],["fl","l","c","r","fr"],["fl","l","c","r","fr","bl"]][Math.min(5,Math.max(0,n-1))]}
function planQuick(sc,prev){const cast=sc.cast.slice(0,6),full=sc.text+"\n"+sc.parts;
 const src=(sc.parts.trim()?sc.parts:sc.text).trim();let beats=src.split(/\n\s*\n|\n/).map(s=>s.trim()).filter(Boolean);
 if(beats.length<3)beats=src.split(/(?<=[.!?।])\s+(?=[A-Z"“ఀ-౿])/).map(s=>s.trim()).filter(Boolean);
 const pe=prev&&prev.memory&&prev.memory.ending;let loc=(pe&&pe.loc)||detectLoc(full)||"campus",time=detectTime(beats[0]||"")||(pe&&pe.time)||detectTime(full)||"day";
 if(!pe){const l=detectLoc(beats[0]||"");if(l)loc=l}
 const genre=sc.genre==="auto"?detectGenre(full):sc.genre;const sl=slots(cast.length),pos={};cast.forEach((n,i)=>pos[n]=(pe&&pe.pos&&pe.pos[n])||sl[i]);
 let present=new Set(pe?(pe.chars||[]).filter(n=>cast.includes(n)):[]);const stance={},shots=[];let lastLoc=null,lastSpk=null,sinceWide=0,ci=0;
 const base=()=>({id:uid(),loc,time,cam:"ms",move:"static",trans:"cut",dur:3,chars:[...present],pos:Object.assign({},pos),act:{},expr:{},focus:"",speaker:"",say:"",sfx:"none",note:"",ok:false,thumb:""});
 const push=o=>{const s=Object.assign(base(),o);s.chars=s.chars.filter(n=>cast.includes(n));s.chars.forEach(n=>{if(!s.act[n])s.act[n]=stance[n]||"stand"});if(s.cam==="ws"||s.cam==="ews")sinceWide=0;else sinceWide++;shots.push(s);return s};
 const est=()=>{push({cam:shots.length?"ews":"ews",move:["pan","crane","dollyin"][shots.length%3],trans:"fade",dur:3,note:"Establishing shot: "+LOC[loc]+(time!=="day"?" ("+time+")":"")});lastLoc=loc};
 const CYC=["ms","ots","mcu","front","ms","cu","side","ots"];
 for(const b of beats){const l2=detectLoc(b),t2=detectTime(b);if(l2&&l2!==loc){loc=l2;if(t2)time=t2;if(shots.length){present=new Set();for(const k in stance)delete stance[k]}}else if(t2&&t2!==time&&shots.length)time=t2;if(lastLoc!==loc)est();
  let spk=null,say="";const dm=b.match(/^([^:：\-–—"“]{1,32}?)\s*[:：–—-]\s*(.+)$/);if(dm){spk=matchName(dm[1],cast);if(spk)say=dm[2].trim()}
  if(!spk){const q=b.match(/["“]([^"”]{2,})["”]/);if(q){say=q[1];spk=cast.find(n=>mentions(b.slice(0,b.indexOf(q[0])),n))||cast.find(n=>mentions(b,n))||[...present].find(n=>n!==lastSpk)||cast[0]}}
  say=say.replace(/^["“'‘]+|["”'’]+$/g,"").trim();
  const ment=cast.filter(n=>mentions(dm&&spk?b.slice(dm[1].length):b,n)),act=detectAct(b),emo=detectEmo(b);
  const entered=[];const firstBeat=beats.indexOf(b)===0;for(const n of (spk?[spk]:[]).concat(ment)){if(!present.has(n)){present.add(n);entered.push(n);const x=POS[pos[n]][1];const arrive=act==="run"?"run":/^walkin/.test(act||"")||!firstBeat?(x<=0?"walkinL":"walkinR"):(act&&!/^walk/.test(act)?act:"stand");if(["sit","cross","hips"].includes(arrive))stance[n]=arrive;
   push({cam:"full",move:"dollyin",focus:n,act:{[n]:arrive},expr:{[n]:emo&&!spk?emo:""},dur:3.2,note:firstBeat&&!/^walkin|run/.test(arrive)?b.slice(0,90):n+" enters"})}}
  if(spk&&say){const words=say.split(/\s+/).length,dur=Math.round(clamp(1.4+words*.42,2.2,9)*10)/10;let cam,move="static";
   if(emo==="shocked"){cam="ecu";move="dollyin"}else if(emo==="angry"){cam=ci%2?"low":"cu";move="dollyin"}else if(emo==="sad"){cam="high";move="dollyin"}else if(emo==="love"){cam="cu";move="orbit"}
   else{cam=present.size<2?["ms","mcu","front","cu"][ci%4]:CYC[ci%CYC.length];move=cam==="cu"||cam==="mcu"?"dollyin":ci%3===2?"orbit":"static"}ci++;
   const a=act&&!/^walk|run/.test(act)?act:"talk";if(["sit","cross","hips"].includes(a))stance[spk]=a;
   if(sinceWide>=4&&present.size>1)push({cam:"ws",move:"track",dur:2,note:"Two-shot to show everyone"});
   push({cam,move,focus:spk,speaker:spk,say,act:{[spk]:a},expr:{[spk]:emo||""},dur,note:emo?emo+" line":""});
   const others=[...present].filter(n=>n!==spk);if(others.length&&(/[!?]\s*$|!\s|haha|😂/.test(say)||emo==="shocked"||emo==="laugh")){const r=others[0],rx=genre==="comedy"?(/\?/.test(say)?"shocked":"laugh"):genre==="emotional"?"sad":"shocked";
    push({cam:["cu","mcu","cu"][ci%3],move:"dollyin",focus:r,act:{[r]:rx==="laugh"&&stance[r]!=="sit"?"laugh":stance[r]||"stand"},expr:{[r]:rx},dur:1.7,sfx:genre==="comedy"?(rx==="laugh"?"badum":"boing"):genre==="emotional"?"none":"dramatic",note:"Reaction: "+r})}
   lastSpk=spk}
  else if(act||ment.length){const who=ment[0]||[...present][0];if(!who)continue;if(entered.includes(who)&&!/^walkout/.test(act||""))continue;let cam="full",move="static";
   if(act==="run"){cam="ws";move="track"}else if(/^walkout/.test(act||"")){cam="ws";move="pan"}else if(act==="sit"){cam="full";move="dollyin"}else if(act==="dance"||act==="jump"||act==="cheer"){cam="full";move="orbit"}else if(emo==="sad"){cam="high"}else if(emo==="angry"){cam="low";move="dollyin"}
   let a=act||"stand";if(/^walkout/.test(a))a=POS[pos[who]][1]<0?"walkoutL":"walkoutR";if(["sit","cross","hips"].includes(a))stance[who]=a;else if(a==="stand")delete stance[who];
   push({cam,move,focus:who,act:{[who]:a},expr:{[who]:emo||""},dur:a==="run"?2.6:3,note:b.slice(0,90)});if(/^walkout/.test(a)){present.delete(who)}}
  else push({cam:"ws",move:"pan",dur:2.6,note:b.slice(0,90)})}
 if(!shots.length)est();
 push({cam:"ws",move:genre==="emotional"?"crane":"dollyout",trans:"fade",dur:3,expr:Object.fromEntries([...present].map(n=>[n,genre==="comedy"?"laugh":genre==="emotional"?"sad":""])),act:Object.fromEntries([...present].map(n=>[n,genre==="comedy"&&stance[n]!=="sit"?"laugh":stance[n]||"stand"])),note:"Final shot"});
 return {genre,shots}}
/* ---------------- AI planner */
let AIOFF=false;const AIW=new Map();
window.addEventListener("message",e=>{const d=e.data;if(!d||d.type!=="cc3d-ai-r"||!AIW.has(d.id))return;const w=AIW.get(d.id);AIW.delete(d.id);d.error?w.rej(d.error):w.res(d.text||"")});
async function askAI(input){if(AIOFF)throw {code:"off"};
 if(window.parent!==window){const id=uid();return await new Promise((res,rej)=>{AIW.set(id,{res,rej});window.parent.postMessage({type:"cc3d-ai",id,input},location.origin);setTimeout(()=>{if(AIW.has(id)){AIW.delete(id);rej({code:"timeout"})}},180000)})}
 let s=null;try{s=window.claude&&window.claude.use?await window.claude.use("sample"):null}catch(e){}if(!s)throw {code:"not_granted"};const r=await s(input,{modelTier:"default"});return r.text||""}
function enumList(o){return Object.entries(o).map(([k,n])=>k+"="+n).join(", ")}
function aiPrompt(sc,prev,extra){const pe=prev&&prev.memory;
 return `You are a film director and storyboard artist for a Telugu comedy web series made with clay / toy 3D characters. Read the SCENE (it may be Telugu script, English or Tenglish) and break it into cinematic shots.
Return ONLY one JSON object, no other text:
{"genre":"comedy|emotional|action","summary":"one-line story summary","shots":[{"loc":"","time":"","cam":"","move":"","trans":"","dur":3,"chars":["Name"],"pos":{"Name":"l"},"act":{"Name":"talk"},"expr":{"Name":"happy"},"focus":"Name","speaker":"Name or empty","say":"dialogue, copied exactly in its original language","sfx":"none","note":"what happens in this moment (short, English)"}]}
Allowed values (use the key on the left):
loc: ${enumList(LOC)}
time: ${enumList(TIME)}
cam: ${enumList(CAMS)}
move: ${enumList(MOVES)}
trans: ${enumList(TRANS)}
pos: ${Object.entries(POS).map(([k,v])=>k+"="+v[0]).join(", ")}
act: ${enumList(ACTS)}
expr: ${Object.keys(EXPR).join(", ")} (or "" for the character's normal face)
sfx: ${enumList(SFX)}
Rules:
- Understand the whole story first: who is where, what each person wants, how each line leads to the next, and where the jokes or emotional beats land.
- Start every new location with an establishing shot (ews or ws). Use the same loc key whenever a place repeats. Pick the closest loc key for places not in the list.
- Introduce characters with a full-body shot when they first appear (walk-in actions if they arrive).
- Conversations: mix ms, ots, mcu and front/side; close-ups (cu/ecu) for strong emotion; low angle for power or anger; high angle for sad or small moments; bird for a funny overview; tracking for walking/running.
- One dialogue line per shot, said by "speaker". Put the line in "say" exactly as written. A shot without dialogue has speaker "" and say "".
- Comedy: after a punchline add a short reaction shot (1.2–2 s) of the listener with a funny expression and a fitting sfx (boing, badum, pop). Leave comic pauses.
- Emotional: slower shots, dolly-in close-ups, fade transitions. Action: tracking, shake, orbit, quick cuts.
- Do not repeat the same cam twice in a row unless it really helps.
- dur: about 1 second plus 0.42 seconds per word of dialogue; 2.5–4 seconds for silent shots.
- "chars" lists everyone visible in the frame (only names from CAST). Keep each person in the same pos slot across shots unless they move. Every visible character needs an act.
- The number of shots must follow the scene: short scenes get few shots, long scenes get many (max 45).
- End with a final cinematic shot (ws with dollyout or crane, trans fade).
${sc.parts.trim()?"- SCENE PARTS are given: treat each part as one beat, in the same order, and give each part one or more shots.\n":""}CAST (only these names): ${sc.cast.map(describe).join("; ")}
${pe?`PREVIOUS SCENE (continue from its ending, keep outfits and places the same): ${pe.summary||""}. It ended in ${LOC[pe.ending.loc]} (${pe.ending.time}) with ${pe.ending.chars.join(", ")||"nobody"} at ${Object.entries(pe.ending.pos||{}).map(([n,p])=>n+"="+p).join(", ")}.`:""}
Genre wanted: ${sc.genre==="auto"?"decide from the scene":sc.genre}
SCENE:
"""${sc.text.slice(0,9000)}"""
${sc.parts.trim()?`SCENE PARTS:\n"""${sc.parts.slice(0,5000)}"""`:""}${extra||""}`}
function parseJSON(t){const a=t.indexOf("{"),b=t.lastIndexOf("}");if(a<0||b<a)throw new Error("no json");return JSON.parse(t.slice(a,b+1))}
function clean(sh,sc,prevShot){const cast=sc.cast,o={id:uid(),ok:false,thumb:""};o.loc=LOC[sh.loc]?sh.loc:(prevShot?prevShot.loc:"campus");o.time=TIME[sh.time]?sh.time:(prevShot?prevShot.time:"day");
 o.cam=CAMS[sh.cam]?sh.cam:"ms";o.move=MOVES[sh.move]?sh.move:"static";o.trans=TRANS[sh.trans]?sh.trans:"cut";o.dur=clamp(+sh.dur||3,1,14);
 const fix=n=>matchName(String(n||""),cast);o.chars=[...new Set((Array.isArray(sh.chars)?sh.chars:[]).map(fix).filter(Boolean))];
 o.speaker=fix(sh.speaker)||"";if(o.speaker&&!o.chars.includes(o.speaker))o.chars.push(o.speaker);o.focus=fix(sh.focus)||o.speaker||o.chars[0]||"";if(o.focus&&!o.chars.includes(o.focus))o.chars.push(o.focus);
 const sl=slots(cast.length);o.pos={};o.act={};o.expr={};cast.forEach((n,i)=>{const p=sh.pos&&sh.pos[Object.keys(sh.pos).find(k=>fix(k)===n)];o.pos[n]=POS[p]?p:(prevShot&&prevShot.pos[n])||sl[i]});
 o.chars.forEach(n=>{const k=Object.keys(sh.act||{}).find(k=>fix(k)===n),ke=Object.keys(sh.expr||{}).find(k=>fix(k)===n);o.act[n]=ACTS[k&&sh.act[k]]?sh.act[k]:(n===o.speaker?"talk":"stand");const ex=ke!=null?sh.expr[ke]:"";o.expr[n]=EXPR[ex]?ex:""});
 o.say=o.speaker?String(sh.say||"").slice(0,300):"";o.sfx=SFX[sh.sfx]?sh.sfx:"none";o.note=String(sh.note||"").slice(0,140);return o}
async function plan(sc,useAI){const prev=sc.prevId?ST8.scenes.find(s=>s.id===sc.prevId):null;
 if(!sc.cast.length){toast("Pick at least one character");return}if(!sc.text.trim()&&!sc.parts.trim()){toast("Write the scene first");return}
 ST8.busy=useAI?"🧠 Reading your scene and planning the shots…":"Planning shots…";panel();let res=null;
 if(useAI){try{const t=await askAI(aiPrompt(sc,prev));const j=parseJSON(t);let ps=null;const shots=(j.shots||[]).slice(0,45).map(s=>{const c=clean(s,sc,ps);ps=c;return c});if(shots.length){res={genre:["comedy","emotional","action"].includes(j.genre)?j.genre:"comedy",shots,summary:String(j.summary||"").slice(0,300)};sc.planner="ai"}}
  catch(e){if(e&&(e.code==="not_granted"||e.code==="off"))AIOFF=true;toast(e&&e.code==="rate_limited"?"AI is busy — used the quick planner":"AI not available here — used the quick planner")}}
 if(!res){res=planQuick(sc,prev);sc.planner="quick"}
 sc.shots=res.shots;sc.genreUsed=res.genre;sc.summary=res.summary||sc.text.replace(/\s+/g," ").slice(0,200);sc.memory=null;ST8.busy="";ST8.view="board";ST8.edit=null;persist();panel();await thumbs(sc)}
async function regen(sc,i){const sh=sc.shots[i];if(!sh)return;let done=false;
 if(!AIOFF){ST8.busy="🔄 Re-thinking shot "+(i+1)+"…";panel();try{const prev=sc.prevId?ST8.scenes.find(s=>s.id===sc.prevId):null;
  const t=await askAI(aiPrompt(sc,prev,`\n\nCURRENT STORYBOARD (JSON): ${JSON.stringify(sc.shots.map(s=>({loc:s.loc,cam:s.cam,move:s.move,chars:s.chars,speaker:s.speaker,say:s.say,note:s.note})))}\nRewrite ONLY shot number ${i+1} in a fresh way (a different camera angle or movement, better acting) that still fits between its neighbours. Keep its speaker and dialogue. Return {"shots":[ONE shot object]}.`));
  const j=parseJSON(t);const s=(j.shots||[])[0];if(s){const c=clean(s,sc,sc.shots[i-1]);c.say=sh.say;c.speaker=sh.speaker&&c.chars.includes(sh.speaker)?sh.speaker:c.speaker;c.voice=sh.voice;c.voiceDur=sh.voiceDur;c.id=sh.id;sc.shots[i]=c;done=true}}catch(e){if(e&&(e.code==="not_granted"||e.code==="off"))AIOFF=true}}
 if(!done){const order=["ms","mcu","cu","ots","front","side","low","high","full","ws","bird","ecu"],mv=["static","dollyin","orbit","pan","dollyout","track","crane"];let c=order[(order.indexOf(sh.cam)+1+Math.floor(Math.random()*3))%order.length];if(!sh.chars.length&&!["ews","ws","bird"].includes(c))c="ws";
  sh.cam=c;sh.move=mv[Math.floor(Math.random()*mv.length)];sh.ok=false}
 sc.shots[i].ok=false;sc.shots[i].thumb="";ST8.busy="";persist();panel();await thumbs(sc,[sc.shots[i].id])}
/* ---------------- locations */
const LC={};
const sky=t=>t==="night"?"#141a33":t==="evening"?"#f4b28a":"#bfe3f7";
function sign(txt,w,h,bg,fg){const c=document.createElement("canvas");c.width=512;c.height=Math.round(512*h/w);const x=c.getContext("2d");x.fillStyle=bg;x.fillRect(0,0,c.width,c.height);x.fillStyle=fg;x.textAlign="center";x.textBaseline="middle";const ls=txt.split("\n");let fs=Math.round(c.height*.78/ls.length);x.font=`800 ${fs}px system-ui,'Noto Sans Telugu',sans-serif`;while(fs>10&&Math.max(...ls.map(l=>x.measureText(l).width))>c.width*.92){fs-=2;x.font=`800 ${fs}px system-ui,'Noto Sans Telugu',sans-serif`}ls.forEach((l,i)=>x.fillText(l,256,c.height*(i+.5)/ls.length));const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:t,toneMapped:false}))}
const lb=(w,h,d,c)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),mat(c));m.castShadow=true;m.receiveShadow=true;return m};
const lc=(a,b,h,c,n)=>{const m=new T.Mesh(new T.CylinderGeometry(a,b,h,n||20),mat(c));m.castShadow=true;m.receiveShadow=true;return m};
const ls=(r,c)=>{const m=new T.Mesh(new T.SphereGeometry(r,20,14),mat(c));m.castShadow=true;return m};
const glow=c=>new T.MeshBasicMaterial({color:c,toneMapped:false});
function P3(g,o,x,y,z,ry){o.position.set(x,y,z);if(ry)o.rotation.y=ry;g.add(o);return o}
function room(g,floorC,wallC,depth){const f=lb(18,.2,depth||22,floorC);f.position.set(0,-.1,(depth||22)/2-6);f.receiveShadow=true;g.add(f);P3(g,lb(18,7,.3,wallC),0,3.5,-6);P3(g,lb(.3,7,depth||22,wallC),-9,3.5,(depth||22)/2-6);P3(g,lb(.3,7,depth||22,wallC),9,3.5,(depth||22)/2-6);P3(g,lb(18,.25,.35,dk(wallC)),0,.12,-5.8)}
function win(g,x,y,z,ry,t,w,h){const fr=lb(w||2.2,h||1.8,.12,"#f4f4f4");const gl=new T.Mesh(new T.PlaneGeometry((w||2.2)-.25,(h||1.8)-.25),glow(t==="night"?"#2a3a6a":t==="evening"?"#ffc28a":"#bfe6ff"));gl.position.z=.07;fr.add(gl);fr.add(P3(new T.Group(),lb(.08,(h||1.8)-.2,.05,"#f4f4f4"),0,0,.09));fr.position.set(x,y,z);fr.rotation.y=ry||0;g.add(fr);return fr}
function desk(g,x,z,c){const d=new T.Group();d.add(P3(new T.Group(),lb(1.3,.08,.65,c||"#b88a5a"),0,.78,0));[[-.58,-.27],[.58,-.27],[-.58,.27],[.58,.27]].forEach(([a,b])=>d.add(P3(new T.Group(),lb(.07,.78,.07,"#555"),a,.39,b)));d.position.set(x,0,z);g.add(d);return d}
function chair(g,x,z,ry,c){const d=new T.Group();d.add(P3(new T.Group(),lb(.5,.07,.5,c||"#7a5232"),0,.48,0));d.add(P3(new T.Group(),lb(.5,.55,.07,c||"#7a5232"),0,.78,-.22));[[-.2,-.2],[.2,-.2],[-.2,.2],[.2,.2]].forEach(([a,b])=>d.add(P3(new T.Group(),lb(.05,.48,.05,"#444"),a,.24,b)));d.position.set(x,0,z);d.rotation.y=ry||0;g.add(d)}
function treeL(g,x,z,s,palm){const t=new T.Group();if(palm){for(let i=0;i<6;i++){const seg=lc(.13,.15,.7,"#9a6b3f",8);seg.position.set(Math.sin(i*.35)*.25*i*.3,.35+i*.65,0);seg.rotation.z=-.08*i;t.add(seg)}for(let i=0;i<7;i++){const l=lb(1.6,.06,.35,"#3f9e4a");l.position.set(.4+Math.cos(i*.9)*.6,4.2,Math.sin(i*.9)*.6);l.rotation.y=-i*.9;l.rotation.z=-.35;t.add(l)}}
 else{t.add(P3(new T.Group(),lc(.15,.22,1.4,"#7a5234",10),0,.7,0));t.add(P3(new T.Group(),ls(1,"#4f9e48"),0,2,0));t.add(P3(new T.Group(),ls(.7,"#5fb256"),.45,2.6,.25));t.add(P3(new T.Group(),ls(.6,"#47913f"),-.5,2.4,-.2))}t.position.set(x,0,z);t.scale.setScalar(s||1);g.add(t)}
function ground(g,c,r){const m=new T.Mesh(new T.CircleGeometry(r||60,48),mat(c));m.rotation.x=-Math.PI/2;m.receiveShadow=true;g.add(m)}
function lamp(g,x,z,t){g.add(P3(new T.Group(),lc(.06,.08,4,"#3a3f4a",8),x,2,z));const h=P3(new T.Group(),lb(.7,.12,.25,"#3a3f4a"),x+.3,4,z);const b=new T.Mesh(new T.SphereGeometry(.12,12,8),glow(t==="night"?"#ffe7a0":"#f4f4f4"));b.position.set(.25,-.1,0);h.add(b);if(t==="night"){const pl=new T.PointLight("#ffd58a",1.1,9,1.6);pl.position.set(x+.5,3.7,z);g.add(pl)}}
function locBuild(k,t){const g=new T.Group();
 if(k==="classroom"){room(g,"#c8a27a","#f3e6c8");const bd=P3(g,lb(5,2.2,.12,"#6b4a2e"),0,2.5,-5.78);const sb=sign("Physics — Unit 3\nF = m × a",4.7,1.95,"#2f5d46","#e8f5e0");sb.position.z=.07;bd.add(sb);
  desk(g,-3.4,-3.6,"#b5835a");chair(g,-3.4,-4.3);[-5.5,-3.5,-1.5].forEach((z,r)=>[-6.6,-4.8,4.8,6.6].forEach(x=>{desk(g,x,z+r*.2+1.2);chair(g,x,z+r*.2+1.85,Math.PI)}));
  [-2,1,4].forEach(z=>win(g,-8.84,3,z,Math.PI/2,t));const ck=P3(g,lc(.4,.4,.08,"#f4f4f4",24),3.6,4.6,-5.8);ck.rotation.x=Math.PI/2;P3(g,sign("Study hard!",1.8,.7,"#ffd36e","#241816"),5.6,3,-5.83)}
 if(k==="corridor"){const f=lb(9,.2,40,"#d8d2c4");f.position.set(0,-.1,0);g.add(f);P3(g,lb(.3,6,40,"#e8dcc0"),-4.4,3,0);P3(g,lb(.3,6,40,"#e8dcc0"),4.4,3,0);P3(g,lb(9,6,.3,"#e8dcc0"),0,3,-20);win(g,0,3,-19.8,0,t,3,2.2);
  for(let z=-18;z<16;z+=4){P3(g,lb(.12,2.4,1.2,"#7b5a3a"),-4.22,1.2,z);for(let i=0;i<3;i++)P3(g,lb(.1,1.9,.45,["#3b82c4","#2f7a45","#e8a33d"][i]),4.24,.95,z+1.2+i*.5);P3(g,new T.Mesh(new T.BoxGeometry(1.6,.08,.4),glow("#fff8e0")),0,5.9,z)}
  P3(g,sign("CLASS 2B",1.1,.4,"#2a3f6e","#fff"),-4.18,2.75,-2,Math.PI/2);P3(g,sign("NOTICE BOARD\nExams Monday!",1.8,1,"#c8902a","#241816"),4.18,2.6,-6,-Math.PI/2)}
 if(k==="canteen"){room(g,"#e5d3b0","#ffd98a");P3(g,lb(7,1.1,1,"#c0553f"),0,.55,-4.9);P3(g,lb(7.2,.1,1.2,"#f4f4f4"),0,1.12,-4.9);P3(g,sign("MENU\nChai ₹10 · Samosa ₹15 · Biryani ₹90",6,1.6,"#241816","#ffd36e"),0,3.5,-5.83);
  for(let i=0;i<6;i++){const gl=new T.Mesh(new T.CylinderGeometry(.07,.06,.16,12),new T.MeshPhysicalMaterial({color:"#c98a4a",transparent:true,opacity:.85,roughness:.2}));gl.position.set(-2.5+i*.4,1.25,-4.7);g.add(gl)}P3(g,lc(.45,.4,.7,"#9aa0a8"),2.6,1.5,-4.9);
  [[-5.6,-1],[5.6,-1],[-5.6,3],[5.6,3]].forEach(([x,z])=>{P3(g,lc(.9,.9,.08,"#f4f4f4",28),x,.8,z);P3(g,lc(.08,.12,.8,"#555",10),x,.4,z);[0,1,2,3].forEach(a=>P3(g,lc(.25,.25,.5,"#e8a33d",14),x+Math.cos(a*1.57)*1.3,.25,z+Math.sin(a*1.57)*1.3))})}
 if(k==="bedroom"){room(g,"#b98b62","#cfe1f5");const bed=new T.Group();bed.add(P3(new T.Group(),lb(2.4,.5,4,"#7a5232"),0,.25,0));bed.add(P3(new T.Group(),lb(2.3,.3,3.9,"#f4f4f4"),0,.65,0));bed.add(P3(new T.Group(),lb(2.32,.32,2.4,"#7a5cff"),0,.68,.7));bed.add(P3(new T.Group(),lb(1.6,.25,.6,"#fff4d6"),0,.92,-1.5));bed.add(P3(new T.Group(),lb(2.4,1.4,.15,"#7a5232"),0,.7,-2));bed.position.set(5.2,0,-3.4);g.add(bed);
  win(g,-3.2,3.1,-5.82,0,t,2.6,2);[-4.7,-1.7].forEach(x=>P3(g,lb(.5,2.6,.1,"#ff6fa8"),x,3.1,-5.7));desk(g,-6.4,-4.6,"#e8d4a8");P3(g,lc(.12,.2,.08,"#333",12),-6.6,.86,-4.6);P3(g,lc(.03,.03,.6,"#333",8),-6.6,1.15,-4.6);P3(g,new T.Mesh(new T.ConeGeometry(.25,.3,16,1,true),glow("#ffe7a0")),-6.6,1.5,-4.6);
  P3(g,sign("ROCK STAR",1.4,1.9,"#1d1d24","#ffd36e"),1.8,3.6,-5.83);const rug=new T.Mesh(new T.CircleGeometry(2.2,36),mat("#e8a33d"));rug.rotation.x=-Math.PI/2;rug.position.set(0,.01,.3);g.add(rug)}
 if(k==="house"){room(g,"#c9a27d","#f2d7c0");const so=new T.Group();so.add(P3(new T.Group(),lb(3.6,.55,1.2,"#2f6db5"),0,.45,0));so.add(P3(new T.Group(),lb(3.6,1,.35,"#2f6db5"),0,1,-.45));[-1.9,1.9].forEach(x=>so.add(P3(new T.Group(),lb(.3,.8,1.2,"#2a5d9e"),x,.6,0)));so.position.set(-3.6,0,-4.5);g.add(so);
  P3(g,lb(2.8,.8,.7,"#7a5232"),4.6,.4,-5.4);P3(g,lb(2.4,1.4,.1,"#15151b"),4.6,1.6,-5.6);P3(g,new T.Mesh(new T.PlaneGeometry(2.2,1.2),glow(t==="night"?"#6fa8ff":"#5a7aa8")),4.6,1.6,-5.54);
  P3(g,lc(.35,.28,.6,"#c0553f"),7.6,.3,-4.6);P3(g,ls(.6,"#3f9e4a"),7.6,1.1,-4.6);[-5.2,-3.6,-2].forEach((x,i)=>P3(g,sign(["❤","Family","☺"][i],1.1,.85,["#ffd36e","#cfe3f0","#ff9db8"][i],"#241816"),x,3.4,-5.83));
  const rug=new T.Mesh(new T.PlaneGeometry(6,3.6),mat("#c0392b"));rug.rotation.x=-Math.PI/2;rug.position.set(0,.01,-.6);g.add(rug);P3(g,lb(1.4,2.8,.1,"#7b5a3a"),-8.84,1.4,1.5,Math.PI/2)}
 if(k==="kitchen"){room(g,"#d8d2c4","#d7efe0");P3(g,lb(11,1,1.1,"#f4f4f4"),0,.5,-5.3);P3(g,lb(11.2,.08,1.2,"#8a8a96"),0,1.04,-5.3);[-4.2,-1.4].forEach(x=>P3(g,lc(.3,.3,.06,"#1d1d24"),x,1.12,-5.3));P3(g,lc(.3,.28,.5,"#b0b4bc"),-4.2,1.4,-5.3);P3(g,ls(.18,"#3a3a40"),-4.2,1.72,-5.3);
  for(let i=0;i<3;i++)P3(g,lb(10,.08,.5,"#b88a5a"),0,2.6+i*.8,-5.6);for(let i=0;i<14;i++)P3(g,lc(.13,.13,.35,["#e8a33d","#c0392b","#2f7a45","#facc15"][i%4],12),-4.5+i*.7,2.85+(i%3)*.8,-5.55);P3(g,lb(1.4,3,1.2,"#e8e8ee"),7,1.5,-4.8);win(g,2.8,3,-5.82,0,t,2,1.2)}
 if(k==="office"){room(g,"#5a6478","#e8edf3");for(let i=0;i<3;i++)win(g,-4+i*4,3.2,-5.82,0,t,3.2,2.6);[[-5.6,-2],[5.6,-2],[-5.6,2.2],[5.6,2.2]].forEach(([x,z])=>{desk(g,x,z,"#f4f4f4");P3(g,lb(.9,.55,.05,"#15151b"),x,1.15,z-.2);P3(g,new T.Mesh(new T.PlaneGeometry(.8,.45),glow("#7ab8ff")),x,1.15,z-.17);chair(g,x,z+.7,Math.PI,"#2a3f6e")});
  P3(g,lc(.3,.3,1.2,"#cfe8ff"),7.6,.6,-4.8);P3(g,lc(.35,.28,.6,"#e8e8ee"),-7.6,.3,-4.6);P3(g,ls(.6,"#3f9e4a"),-7.6,1.1,-4.6);P3(g,sign("WORK HARD · DREAM BIG",4,.6,"#7a5cff","#fff"),0,5.4,-5.83)}
 if(k==="stage"){const f=lb(16,.6,10,"#7a4a2a");f.position.set(0,-.3,0);g.add(f);P3(g,lb(40,.2,40,"#2a1a2a"),0,-.7,0);for(const s of [-1,1])for(let i=0;i<6;i++)P3(g,lc(.3,.32,8,"#8a1c2b",12),s*(5+i*.5),4,-4.5);P3(g,lb(16,8,.3,"#2a1630"),0,4,-5.2);P3(g,sign("ANNUAL DAY 2026",6,1,"#c8902a","#2a1630"),0,6.2,-5);
  const sp=new T.SpotLight("#fff1d0",1.3,24,.5,.6);sp.position.set(0,9,5);g.add(sp);g.add(sp.target);for(let i=0;i<16;i++)P3(g,ls(.18,"#3a2a3a"),-7+i*.95,-.2,6.5+(i%2)*.6)}
 if(k==="campus"){ground(g,t==="night"?"#2f4a2f":"#7cc35a");const p=new T.Mesh(new T.PlaneGeometry(4,40),mat("#d8c8a8"));p.rotation.x=-Math.PI/2;p.position.set(0,.01,0);g.add(p);
  const b=new T.Group();b.add(P3(new T.Group(),lb(22,7,3,"#efe1c6"),0,3.5,0));for(let f=0;f<2;f++)for(let i=0;i<9;i++)if(i!==4)win(b,-9.2+i*2.3,2.1+f*3,1.56,0,t,1.4,1.5);b.add(P3(new T.Group(),lb(3,3.4,.3,"#7b5a3a"),0,1.7,1.5));
  [-1.2,1.2].forEach(x=>b.add(P3(new T.Group(),lc(.25,.25,4.5,"#f4f4f4"),x,2.25,2.2)));b.add(P3(new T.Group(),lb(4.2,.4,1.6,"#e8d4a8"),0,4.6,2.2));b.add(P3(new T.Group(),sign("SRI SAI COLLEGE",4,.7,"#2a3f6e","#ffd36e"),0,5.5,1.58));b.position.set(0,0,-12);g.add(b);
  [[-6,-6],[6,-6],[-8,0],[8,1],[-7,6],[7,7]].forEach(([x,z])=>treeL(g,x,z,1.1));for(let i=0;i<5;i++){const bk=P3(g,lb(.08,.9,1.4,"#2f7a45"),-4.6,.45,-3+i*.5)}lamp(g,3.2,-2,t);lamp(g,-3.2,3,t)}
 if(k==="street"||k==="market"){ground(g,"#b9b0a0");const rd=new T.Mesh(new T.PlaneGeometry(80,7),mat("#4a4d55"));rd.rotation.x=-Math.PI/2;rd.position.set(0,.02,6);g.add(rd);for(let i=-10;i<10;i++){const ln=new T.Mesh(new T.PlaneGeometry(1.4,.15),glow("#f4f4f4"));ln.rotation.x=-Math.PI/2;ln.position.set(i*3,.03,6);g.add(ln)}
  const shops=k==="street"?["TEA STALL","MEDICAL","TIFFINS","MOBILES","BAKERY","XEROX"]:["FRUITS","VEGGIES","FLOWERS","BANGLES","SWEETS","SPICES"];const cols=["#c0553f","#2f7a45","#e8a33d","#3b82c4","#ff6fa8","#7a5cff"];
  shops.forEach((s,i)=>{const x=-15+i*6,sh=new T.Group();sh.add(P3(new T.Group(),lb(5.6,4.4,3,["#f2d7c0","#efe1c6","#d7efe0","#cfe1f5"][i%4]),0,2.2,0));sh.add(P3(new T.Group(),new T.Mesh(new T.BoxGeometry(3.4,2.4,.1),glow(t==="night"?"#ffd58a":"#3a3a40")),0,1.2,1.5));
   const aw=lb(5.4,.12,1.6,cols[i]);aw.position.set(0,2.7,2.2);aw.rotation.x=.3;sh.add(aw);sh.add(P3(new T.Group(),sign(s,3.6,.8,cols[i],"#fff"),0,3.6,1.52));sh.position.set(x,0,-6.5);g.add(sh);
   if(k==="market"){const st=new T.Group();st.add(P3(new T.Group(),lb(2.2,.8,1.2,"#b88a5a"),0,.4,0));for(let j=0;j<8;j++)st.add(P3(new T.Group(),ls(.16,["#e74c3c","#f39c12","#27ae60","#f1c40f"][(i+j)%4]),-.8+(j%4)*.5,.95,-.3+Math.floor(j/4)*.5));st.add(P3(new T.Group(),lc(.03,.03,2.4,"#555",6),0,1.2,0));const um=new T.Mesh(new T.ConeGeometry(1.5,.6,8,1,true),new T.MeshPhysicalMaterial({color:cols[(i+2)%6],side:T.DoubleSide,roughness:.6}));um.position.y=2.6;st.add(um);st.position.set(x+2.5,0,-3.2);g.add(st)}});
  for(let i=-3;i<=3;i++)lamp(g,i*6+2,2.2,t);if(k==="street"){const sc=new T.Group();sc.add(P3(new T.Group(),lb(1.4,.5,.4,"#c0392b"),0,.6,0));[-.55,.55].forEach(x=>{const w=lc(.28,.28,.12,"#1d1d24",16);w.rotation.x=Math.PI/2;w.position.set(x,.28,0);sc.add(w)});sc.add(P3(new T.Group(),lb(.5,.15,.35,"#1d1d24"),-.1,.95,0));sc.position.set(5.5,0,1.6);g.add(sc)}}
 if(k==="park"){ground(g,"#7cc35a");const p=new T.Mesh(new T.RingGeometry(5,6.4,48),mat("#d8c8a8"));p.rotation.x=-Math.PI/2;p.position.y=.01;g.add(p);[[-5,-5],[5,-5],[-8,0],[8,0],[-6,6],[6.5,6.5],[0,-9]].forEach(([x,z])=>treeL(g,x,z,1.2));
  const bn=new T.Group();bn.add(P3(new T.Group(),lb(2.2,.12,.55,"#a0522d"),0,.55,0));bn.add(P3(new T.Group(),lb(2.2,.5,.08,"#a0522d"),0,.9,-.25));[-.9,.9].forEach(x=>bn.add(P3(new T.Group(),lb(.1,.55,.45,"#555"),x,.27,0)));bn.position.set(3.6,0,-2.6);g.add(bn);
  for(let i=0;i<24;i++)P3(g,ls(.1,["#ff6fa8","#ffd25a","#c06fff","#ff8a3d"][i%4]),-7+((i*37)%14),.15,-4+((i*53)%8)*.3);lamp(g,-3.5,-3,t)}
 if(k==="village"){ground(g,"#c9a66b");[[-7,-6],[0,-8],[7,-6]].forEach(([x,z],i)=>{const h=new T.Group();h.add(P3(new T.Group(),lc(1.7,1.8,2.2,"#e8d4a8"),0,1.1,0));h.add(P3(new T.Group(),new T.Mesh(new T.ConeGeometry(2.3,1.8,18),mat("#b08a3e")),0,3.1,0));h.add(P3(new T.Group(),lb(.8,1.4,.1,"#7b5a3a"),0,.7,1.72));h.position.set(x,0,z);g.add(h)});
  [[-9,0],[9,1],[-4,-11],[5,-12],[10,-4]].forEach(([x,z])=>treeL(g,x,z,1,true));P3(g,lc(.8,.8,.9,"#9a8f80"),-4.5,.45,-2.4);P3(g,new T.Mesh(new T.CircleGeometry(.7,20),mat("#2a4a6a")),-4.5,.91,-2.4).rotation.x=-Math.PI/2;
  const cot=new T.Group();cot.add(P3(new T.Group(),lb(2,.12,1,"#d9b46a"),0,.55,0));[[-.9,-.4],[.9,-.4],[-.9,.4],[.9,.4]].forEach(([a,b])=>cot.add(P3(new T.Group(),lb(.08,.55,.08,"#7a5234"),a,.27,b)));cot.position.set(4.6,0,-2.6);g.add(cot);P3(g,new T.Mesh(new T.ConeGeometry(1.2,1.6,14),mat("#e3c26a")),7.6,.8,-1.5);
  for(let i=0;i<5;i++){const hl=new T.Mesh(new T.SphereGeometry(8,24,12),mat("#6aa85a"));hl.scale.set(1.6,.45,1);hl.position.set(-30+i*15,-1,-30);g.add(hl)}}
 if(k==="beach"){ground(g,"#ecd9a8");const sea=new T.Mesh(new T.PlaneGeometry(120,40),new T.MeshPhysicalMaterial({color:t==="night"?"#1a2a55":"#3fa7d6",roughness:.25,clearcoat:1}));sea.rotation.x=-Math.PI/2;sea.position.set(0,.03,-26);g.add(sea);
  [[-7,-3],[8,-2],[-10,4]].forEach(([x,z])=>treeL(g,x,z,1.1,true));const um=new T.Group();um.add(P3(new T.Group(),lc(.04,.04,2.6,"#f4f4f4",8),0,1.3,0));const top=new T.Mesh(new T.ConeGeometry(1.6,.6,12,1,true),new T.MeshPhysicalMaterial({color:"#ff6fa8",side:T.DoubleSide}));top.position.y=2.6;um.add(top);um.position.set(4.2,0,-3);g.add(um);P3(g,lb(1.2,.06,2,"#3b82c4"),4.2,.05,-1.6)}
 if(!INDOOR[k]&&t==="night"){for(let i=0;i<60;i++){const s=new T.Mesh(new T.SphereGeometry(.08,6,4),glow("#fff"));const a=(i*137.5)*Math.PI/180;s.position.set(Math.cos(a)*45,10+((i*29)%20),Math.sin(a)*45-10);g.add(s)}const mo=new T.Mesh(new T.SphereGeometry(1.6,20,14),glow("#fff4cf"));mo.position.set(-14,18,-40);g.add(mo)}
 if(INDOOR[k]){const pl=new T.PointLight(t==="night"?"#ffd9a0":"#fff6e6",t==="night"?.6:.3,26,1.4);pl.position.set(0,5.5,2);g.add(pl)}
 return g}
function setLoc(k,t){const key=k+"|"+t;if(!LC[key])LC[key]=locBuild(k,t);BG.clear();BG.add(LC[key]);const ind=INDOOR[k];
 const bgc=ind?(k==="stage"?"#120a14":t==="night"?"#1a1f30":"#e8dcc8"):sky(t);S.background=new T.Color(bgc);S.fog=new T.Fog(bgc,ind?30:28,ind?70:80);
 hemi.color.set(t==="night"?"#8fa2d8":t==="evening"?"#ffd2b0":"#fff6ec");hemi.intensity=t==="night"?(ind?.5:.38):k==="stage"?.45:ind?.55:.8;sun.color.set(t==="evening"?"#ffb27a":t==="night"?"#9fb4ff":"#fff1e0");sun.intensity=t==="night"?(ind?.5:.32):k==="stage"?.5:ind?.95:t==="evening"?1.1:1.35;
 fill.intensity=t==="night"?.3:.55;rim.intensity=.7}
/* ---------------- stage (actors) */
let STG=null;var head=new T.Vector3(),tmp=new T.Vector3();
function stage(sc){unstage(true);const g=new T.Group();S.add(g);const actors={};const need={};
 sc.shots.forEach(sh=>sh.chars.forEach(n=>{(need[n]=need[n]||new Set()).add(sh.expr[n]||"")}));
 Object.entries(need).forEach(([n,set],ai)=>{const conf=confByName(n),vars={};set.add("");set.forEach(e=>{const c=Object.assign({},conf,e&&EXPR[e]?EXPR[e][1]:{},{say:"",pose:"idle",anim:true});const b=buildChar(c);b.g.visible=false;b.g.traverse(o=>{o.frustumCulled=false});g.add(b.g);vars[e]=b});actors[n]={vars,seed:ai*1.7,cur:null}});
 if(CH)CH.visible=false;GB.forEach(b=>b.g.visible=false);if(bubbleSp)bubbleSp.visible=false;STG={g,actors,sc};return STG}
function unstage(keep){if(!STG)return;S.remove(STG.g);STG=null;if(!keep){if(CH)CH.visible=true;GB.forEach(b=>b.g.visible=true);if(bubbleSp)bubbleSp.visible=true;buildBG()}}
function talkLen(sh){const w=(sh.say||"").trim()?sh.say.trim().split(/\s+/).length:0;return sh.voiceDur?sh.voiceDur:w?Math.min(sh.dur-.25,.5+w*.36):0}
function poseShot(sh,t,amp){const u=clamp(t/sh.dur,0,1);setLoc(sh.loc,sh.time);Object.values(STG.actors).forEach(A=>Object.values(A.vars).forEach(b=>b.g.visible=false));
 const xs={};sh.chars.forEach(n=>{xs[n]=(POS[sh.pos[n]]||POS.c)[1]});const spX=sh.speaker&&xs[sh.speaker]!=null?xs[sh.speaker]:null;const tl=talkLen(sh);
 sh.chars.forEach((n,i)=>{const A=STG.actors[n];if(!A)return;const b=A.vars[sh.expr[n]||""]||A.vars[""];b.g.visible=true;A.cur=b;const sl=POS[sh.pos[n]]||POS.c;let x=sl[1],z=sl[2];const a=sh.act[n]||"stand";let pose=ACTPOSE[a]||"idle";
  const others=sh.chars.filter(m=>m!==n).map(m=>xs[m]);const look=n===sh.speaker?(others.length?others.reduce((p,q)=>p+q,0)/others.length:x):spX!=null?spX:0;let ry=clamp((look-x)*.32,-.75,.75);
  if(a==="walkinL"||a==="walkinR"){const k=ease(clamp(u/.65,0,1)),s=a==="walkinL"?-1:1;x+=s*6.5*(1-k);if(k<1){pose="walk";ry=-s*Math.PI/2}}
  if(a==="walkoutL"||a==="walkoutR"){const k=clamp((u-.2)/.8,0,1),s=a==="walkoutL"?-1:1;x+=s*7.5*k*k;if(k>0){pose="walk";ry=s*Math.PI/2}}
  if(a==="run"){x=lerp(x-7,x+7,u);ry=Math.PI/2}if(a==="turnaway")ry=Math.PI;
  b.g.position.set(x,0,z);b.g.rotation.y=ry;b.c.pose=pose;b.c.anim=true;applyPoseTo(b.rig,b.c,t+i*.37+A.seed);const r=b.rig;
  const talking=n===sh.speaker&&t>.12&&t<.12+tl;
  if(talking&&(a==="talk"||a==="stand")){const s1=Math.sin(t*3.1+i),s2=Math.sin(t*2.3+1),s3=Math.sin(t*4.4);setArm(r,1,[.22+.1*s1,-.35-.18*s2,.15,-1.05-.35*s3]);if(Math.sin(t*1.3)>0)setArm(r,0,[.18,-.25-.12*s3,.1,-.6-.3*s1])}
  if(pose!=="walk"&&pose!=="run"&&a!=="turnaway"){const hx=talking?(look-x)*.08:spX!=null&&n!==sh.speaker?(spX-x)*.12:0;r.head.rotation.y=clamp(hx-ry*.35,-.6,.6)}
  if(talking){r.head.rotation.x+=Math.sin(t*9.5)*.035;r.head.rotation.z+=Math.sin(t*3.3)*.04}
  const hd=r.head.userData;if(hd.talk){if(talking){let o=amp!=null&&sh.voice?clamp(amp*7,0,1):(Math.max(0,Math.sin(t*15.7))*.7+.3)*(Math.sin(t*4.1)>-.7?1:.15);hd.talk.visible=o>.06;hd.talk.scale.y=.12+o*.9}else hd.talk.visible=false}
  if(hd.eyes){const bp=(t+A.seed*2.3)%3.4,bl=bp<.13;hd.eyes.forEach(e=>e.scale.y=bl?.1:1)}})}
function camShot(sh,t,i){const u=clamp(t/sh.dur,0,1),e=ease(u);STG.g.updateMatrixWorld(true);
 const vis=sh.chars.map(n=>STG.actors[n]&&STG.actors[n].cur).filter(Boolean);const subj=STG.actors[sh.focus||sh.speaker||sh.chars[0]];const sb=subj&&subj.cur;
 if(sb)sb.rig.head.getWorldPosition(head);else head.set(0,2.4,0);const xs=vis.map(b=>b.g.position.x);const cx=xs.length?(Math.min(...xs)+Math.max(...xs))/2:0,spread=xs.length?Math.max(...xs)-Math.min(...xs):0;
 const Hh=head.y,L=new T.Vector3(head.x,Hh-.4,head.z);let d=3.4,cy=Hh-.1,yaw=(i%2?.3:-.24);let fov=34;
 switch(sh.cam){case "ews":L.set(cx,1.4,0);d=Math.max(15,spread*2+13);cy=6;yaw*=.6;break;case "ws":L.set(cx,1.5,0);d=spread*1.15+8.5;cy=2.7;break;case "full":L.set(head.x,1.45,head.z);d=6.2;cy=1.8;break;
  case "ms":d=3.3;break;case "mcu":L.y=Hh-.2;d=2.3;break;case "cu":L.y=Hh-.02;d=1.9;fov=32;break;case "ecu":L.y=Hh+.04;d=1.45;fov=28;break;case "low":L.y=Hh-.35;d=3.8;cy=.45;break;case "high":L.set(head.x,1.3,head.z);d=4.4;cy=Hh+3.6;break;
  case "bird":L.set(cx,0,0);break;case "side":yaw=(head.x>cx?1:-1)*1.3;d=4;L.y=Hh-.45;break;case "front":yaw=0;d=3.5;break;case "ots":break}
 let pos=new T.Vector3();
 if(sh.cam==="ots"){const ln=sh.chars.find(n=>n!==(sh.focus||sh.speaker));const lb2=ln&&STG.actors[ln]&&STG.actors[ln].cur;if(lb2){lb2.rig.head.getWorldPosition(tmp);const dx=tmp.x-head.x,s=dx>=0?1:-1;pos.set(tmp.x+s*.75,tmp.y+.15,tmp.z+1.25);L.set(head.x,Hh-.15,head.z)}else{pos.set(head.x+1.2,Hh,head.z+2.6)}}
 if(sh.cam!=="ots"){let dd=d,yy=yaw,cyy=cy;if(sh.move==="dollyin")dd*=lerp(1.5,.92,e);if(sh.move==="dollyout")dd*=lerp(.92,1.6,e);if(sh.move==="orbit")yy+=lerp(-.7,.7,e);if(sh.move==="crane"){cyy+=lerp(3.2,0,e);dd*=lerp(1.25,1,e)}if(sh.move==="static")yy+=Math.sin(t*.35)*.025;
  if(sh.cam==="bird")pos.set(cx+.01,lerp(9,7,sh.move==="dollyin"?e:0)+spread*.4,.6);else pos.set(L.x+Math.sin(yy)*dd,cyy,L.z+Math.cos(yy)*dd)}
 else{if(sh.move==="dollyin")pos.lerp(L,lerp(0,.3,e));if(sh.move==="dollyout")pos.lerp(L,lerp(.25,-.2,e))}
 const Lf=L.clone();if(sh.move==="pan")Lf.x+=lerp(-1.6,1.6,e);if(sh.move==="tilt")Lf.y=lerp(.5,L.y+.25,e);if(sh.move==="track"){const o=lerp(-1.4,1.4,e);pos.x+=o;Lf.x+=o}
 if(sh.move==="shake"){const k=.035*Math.sqrt(pos.distanceTo(Lf));pos.x+=Math.sin(t*23)*k;pos.y+=Math.sin(t*31+1)*k;Lf.x+=Math.sin(t*17)*k}
 if(INDOOR[sh.loc]){if(sh.loc==="corridor")pos.x=clamp(pos.x,-3.9,3.9);else pos.x=clamp(pos.x,-8.4,8.4);pos.z=Math.min(pos.z,sh.loc==="corridor"?18:15);pos.y=Math.min(pos.y,sh.cam==="bird"?13:6.4)}
 pos.y=Math.max(.25,pos.y);Cam.position.copy(pos);Cam.up.set(0,1,0);if(sh.cam==="bird")Cam.up.set(0,0,-1);Cam.lookAt(Lf);if(Cam.fov!==fov){Cam.fov=fov;Cam.updateProjectionMatrix()}}
/* ---------------- output canvas + overlays */
let comp=null,cx2=null,stopB=null,saved=null;var ACT=false;
function enter(q){if(ACT)return;ACT=true;CINEACT=true;const w=q==="sd"?960:W,h=q==="sd"?540:H;saved={pr:R.getPixelRatio()};R.setPixelRatio(1);R.setSize(w,h,false);Cam.aspect=16/9;Cam.fov=34;Cam.updateProjectionMatrix();
 if(!comp){comp=document.createElement("canvas");comp.className="cinecv";cx2=comp.getContext("2d");stopB=document.createElement("button");stopB.type="button";stopB.className="cinestop";stopB.textContent="⏹ Stop";stopB.addEventListener("click",()=>stopPlay(true))}
 comp.width=w;comp.height=h;wrap.appendChild(comp);wrap.parentNode.appendChild(stopB);R.domElement.style.visibility="hidden";document.body.classList.add("cine")}
function exit(){if(!ACT)return;ACT=false;CINEACT=false;comp.remove();stopB.remove();R.domElement.style.visibility="";document.body.classList.remove("cine");R.setPixelRatio(saved.pr);Cam.up.set(0,1,0);Cam.fov=35;unstage();resize();if(typeof setAuto==="function")setAuto(false)}
function wrapLines(ctx,txt,maxW){const words=txt.split(/\s+/),out=[];let l="";for(const w of words){const tt=l?l+" "+w:w;if(ctx.measureText(tt).width>maxW&&l){out.push(l);l=w}else l=tt}if(l)out.push(l);return out.slice(0,3)}
const NAMEC=["#ffd36e","#7ad0ff","#ff9db8","#9af0a8","#c9a8ff","#ffb27a"];
function overlay(sh,t,fadeA,flashA,titleTxt){const c=cx2,w=comp.width,h=comp.height,s=w/1280;
 if(titleTxt!=null){c.fillStyle="#0b0810";c.fillRect(0,0,w,h);c.fillStyle="#ffd36e";c.font=`900 ${64*s}px system-ui,'Noto Sans Telugu',sans-serif`;c.textAlign="center";c.textBaseline="middle";c.fillText(titleTxt,w/2,h/2-10*s);c.fillStyle="#cfc4dc";c.font=`600 ${24*s}px system-ui`;c.fillText("A Clay 3D Film",w/2,h/2+50*s);c.globalAlpha=1;return}
 if(sh&&ST8.set.subs&&sh.speaker&&sh.say&&t>.08&&t<Math.max(talkLen(sh)+.6,Math.min(sh.dur-.05,talkLen(sh)+1.2))){c.font=`700 ${42*s}px system-ui,'Noto Sans Telugu',sans-serif`;c.textAlign="center";c.textBaseline="alphabetic";const ls2=wrapLines(c,sh.say,w*.84);const nm=sh.speaker,ci=Math.max(0,STG.sc.cast.indexOf(nm));
  const y0=h-34*s-(ls2.length-1)*50*s;c.lineJoin="round";c.font=`800 ${28*s}px system-ui`;c.lineWidth=7*s;c.strokeStyle="rgba(0,0,0,.85)";c.strokeText(nm,w/2,y0-50*s);c.fillStyle=NAMEC[ci%6];c.fillText(nm,w/2,y0-50*s);
  c.font=`700 ${42*s}px system-ui,'Noto Sans Telugu',sans-serif`;ls2.forEach((l,i)=>{c.lineWidth=8*s;c.strokeText(l,w/2,y0+i*42*s);c.fillStyle="#fff";c.fillText(l,w/2,y0+i*42*s)})}
 if(fadeA>0){c.fillStyle=`rgba(0,0,0,${clamp(fadeA,0,1)})`;c.fillRect(0,0,w,h)}if(flashA>0){c.fillStyle=`rgba(255,255,255,${clamp(flashA,0,1)})`;c.fillRect(0,0,w,h)}}
/* ---------------- audio */
let AC=null,MASTER=null,MDEST=null,NOISE=null;const VB={},ANS=new Map();
function actx(){if(!AC){const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;AC=new A();MASTER=AC.createGain();MASTER.gain.value=.9;MASTER.connect(AC.destination);try{MDEST=AC.createMediaStreamDestination();MASTER.connect(MDEST)}catch(e){MDEST=null}
 NOISE=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=NOISE.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}if(AC.state==="suspended")AC.resume();return AC}
function tone(out,type,f,t0,dur,vol,f2,att){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t0);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t0+dur);g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(vol,t0+(att||.008));g.gain.exponentialRampToValueAtTime(.0005,t0+dur);o.connect(g);g.connect(out);o.start(t0);o.stop(t0+dur+.05);return o}
function noise(out,t0,dur,vol,fq,type,f2){const s=AC.createBufferSource();s.buffer=NOISE;const f=AC.createBiquadFilter();f.type=type||"highpass";f.frequency.setValueAtTime(fq||6000,t0);if(f2)f.frequency.exponentialRampToValueAtTime(f2,t0+dur);const g=AC.createGain();g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.0005,t0+dur);s.connect(f);f.connect(g);g.connect(out);s.start(t0);s.stop(t0+dur+.05)}
function sfx(k,t0){if(!AC||k==="none")return;const o=MASTER;
 if(k==="boing"){const os=AC.createOscillator(),g=AC.createGain(),lf=AC.createOscillator(),lg=AC.createGain();os.type="triangle";os.frequency.setValueAtTime(180,t0);os.frequency.exponentialRampToValueAtTime(520,t0+.45);lf.frequency.value=18;lg.gain.value=40;lf.connect(lg);lg.connect(os.frequency);g.gain.setValueAtTime(.5,t0);g.gain.exponentialRampToValueAtTime(.001,t0+.6);os.connect(g);g.connect(o);os.start(t0);lf.start(t0);os.stop(t0+.65);lf.stop(t0+.65)}
 if(k==="badum"){tone(o,"sine",180,t0,.18,.6,90);tone(o,"sine",120,t0+.2,.25,.7,60);noise(o,t0+.45,.7,.35,7000)}
 if(k==="whoosh")noise(o,t0,.6,.5,300,"bandpass",4000);if(k==="pop")tone(o,"sine",900,t0,.08,.5,300);if(k==="ding"){tone(o,"sine",1320,t0,1.2,.35);tone(o,"sine",2640,t0,.6,.12)}
 if(k==="crash"){noise(o,t0,1.1,.7,2000,"highpass");tone(o,"square",90,t0,.3,.3,40)}if(k==="dramatic"){tone(o,"sawtooth",55,t0,1.4,.45,40);noise(o,t0,.8,.3,200,"lowpass")}
 if(k==="heartbeat")for(let i=0;i<3;i++){tone(o,"sine",60,t0+i*.8,.18,.8,40);tone(o,"sine",55,t0+i*.8+.22,.2,.6,38)}}
const NOTE=n=>440*Math.pow(2,(n-69)/12);
function music(style,T0,dur,vol,nodes){const out=AC.createGain();out.gain.value=vol;out.connect(MASTER);nodes.push(out);if(style==="none")return out;
 if(style==="file"&&VB.music){const s=AC.createBufferSource();s.buffer=VB.music;s.loop=true;s.connect(out);s.start(T0);s.stop(T0+dur);nodes.push(s);out.gain.setValueAtTime(vol,T0+Math.max(0,dur-1.5));out.gain.linearRampToValueAtTime(0,T0+dur);return out}
 const S2={comedy:{bpm:128,ch:[[60,64,67],[65,69,72],[67,71,74],[60,64,67]],scale:[72,74,76,79,81]},emotional:{bpm:72,ch:[[57,60,64],[53,57,60],[60,64,67],[55,59,62]],scale:[69,71,72,76,79]},action:{bpm:150,ch:[[57,60,64],[57,60,64],[53,57,60],[55,59,62]],scale:[69,72,74,76]},calm:{bpm:92,ch:[[60,64,67,71],[65,69,72,76]],scale:[72,76,79,83]}}[style]||null;if(!S2)return out;
 const b=60/S2.bpm;let i=0;for(let t=0;t<dur-.3;t+=b,i++){const tt=T0+t,bar=Math.floor(i/4),ch=S2.ch[bar%S2.ch.length],beat=i%4;
  if(style==="comedy"){tone(out,"triangle",NOTE(ch[0]-24+(beat%2?7:0)),tt,b*.45,.32);if(beat%2===1)noise(out,tt,.05,.08,8000);if((i*7)%5<2)tone(out,"square",NOTE(S2.scale[(i*3+bar)%S2.scale.length]),tt+b/2,b*.3,.05)}
  if(style==="emotional"){if(beat===0)ch.forEach(n=>tone(out,"sine",NOTE(n),tt,b*4,.06,0,.6));tone(out,"triangle",NOTE(ch[beat%ch.length]+12),tt,b*1.6,.07)}
  if(style==="action"){tone(out,"sine",110,tt,.18,.6,45);if(beat%2===1)noise(out,tt,.16,.25,1500);tone(out,"sawtooth",NOTE(ch[0]-24),tt,b*.4,.12);tone(out,"sawtooth",NOTE(ch[0]-24),tt+b/2,b*.4,.1);if(beat===3)tone(out,"square",NOTE(S2.scale[bar%S2.scale.length]),tt,b*.8,.05)}
  if(style==="calm"){tone(out,"triangle",NOTE(ch[(i)%ch.length]+12),tt,b*1.8,.06);if(beat===0)tone(out,"sine",NOTE(ch[0]-12),tt,b*4,.09,0,.3)}}
 out.gain.setValueAtTime(vol,T0+Math.max(0,dur-1.5));out.gain.linearRampToValueAtTime(0,T0+dur);return out}
async function loadVoices(sc){for(const sh of sc.shots){if(sh.voice&&!VB[sh.id]){const bl=await dget("blobs","voice:"+sh.id);if(bl){try{VB[sh.id]=await AC.decodeAudioData(await bl.arrayBuffer())}catch(e){}}}}
 if(ST8.set.music==="file"&&!VB.music){const bl=await dget("blobs","music:file");if(bl)try{VB.music=await AC.decodeAudioData(await bl.arrayBuffer())}catch(e){}}}
/* ---------------- playback */
let CP=null;
async function play(sc,opts){if(CP||!sc.shots.length)return;opts=opts||{};const list=opts.only!=null?[sc.shots[opts.only]]:sc.shots;const ac=actx();if(ac)await loadVoices(sc);
 stage(sc);enter(opts.record?ST8.set.q:"sd");const title=opts.only==null&&ST8.set.title&&!opts.thumbs?1.8:0;const total=title+list.reduce((a,s)=>a+s.dur,0)+.4;
 const nodes=[];let T0=ac?ac.currentTime+.15:0;const g=sc.genreUsed||"comedy";const ms=ST8.set.music==="auto"?(g==="emotional"?"emotional":g==="action"?"action":"comedy"):ST8.set.music;
 if(ac){music(ms,T0,total,ST8.set.vol*(opts.only!=null?.6:1),nodes);let acc=title;list.forEach(sh=>{if(ST8.set.sfx&&sh.sfx&&sh.sfx!=="none")sfx(sh.sfx,T0+acc+(sh.sfx==="badum"||sh.sfx==="boing"?Math.min(sh.dur*.35,.5):.05));
  if(ST8.set.sfx&&(sh.move==="orbit"||sh.trans==="flash"))sfx("whoosh",T0+acc);if(sh.voice&&VB[sh.id]){const s=AC.createBufferSource();s.buffer=VB[sh.id];const an=AC.createAnalyser();an.fftSize=512;s.connect(an);an.connect(MASTER);s.start(T0+acc+.12);nodes.push(s);ANS.set(sh.id,an)}else ANS.delete(sh.id);acc+=sh.dur})}
 const buf=new Float32Array(512);
 CP={sc,list,i:-1,t:0,title,start:performance.now(),nodes,opts,last:performance.now(),
  frame(){const now=performance.now(),el=(now-this.start)/1000;if(el<this.title){overlay(null,0,0,0,sc.title||"My scene");return}
   let e2=el-this.title,i=0;while(i<list.length&&e2>=list[i].dur){e2-=list[i].dur;i++}
   if(i>=list.length){cx2.fillStyle="#000";cx2.fillRect(0,0,comp.width,comp.height);if(e2>.35)finish(false);return}
   const sh=list[i];if(i!==this.i){this.i=i;if(opts.onShot)opts.onShot(i)}let amp=null;const an=ANS.get(sh.id);if(an){an.getFloatTimeDomainData(buf);let s=0;for(const v of buf)s+=v*v;amp=Math.sqrt(s/buf.length)}
   poseShot(sh,e2,amp);camShot(sh,e2,sc.shots.indexOf(sh));R.render(S,Cam);cx2.drawImage(R.domElement,0,0,comp.width,comp.height);
   const tr=k=>ST8.set.trans==="plan"?k:ST8.set.trans;let fa=0,fl=0;const next=list[i+1];if(tr(sh.trans)==="fade"&&e2<.4)fa=1-e2/.4;if(next&&tr(next.trans)==="fade"&&e2>sh.dur-.4)fa=Math.max(fa,(e2-(sh.dur-.4))/.4);if(tr(sh.trans)==="flash"&&e2<.25)fl=1-e2/.25;if(!next&&e2>sh.dur-.6)fa=Math.max(fa,(e2-(sh.dur-.6))/.6);if(i===0&&!this.title&&e2<.3)fa=Math.max(fa,1-e2/.3);
   overlay(sh,e2,fa,fl,null)}};
 if(opts.record){const types=["video/mp4;codecs=avc1.42E01E,mp4a.40.2","video/mp4;codecs=avc1,opus","video/mp4","video/webm;codecs=vp9,opus","video/webm;codecs=vp8,opus","video/webm"];const mt=types.find(t=>window.MediaRecorder&&MediaRecorder.isTypeSupported(t))||"";
  const vs=comp.captureStream(30);const tracks=[...vs.getVideoTracks()];if(MDEST)tracks.push(...MDEST.stream.getAudioTracks());const rec=new MediaRecorder(new MediaStream(tracks),mt?{mimeType:mt,videoBitsPerSecond:ST8.set.q==="sd"?4e6:8e6}:undefined),ch=[];
  rec.ondataavailable=e=>{if(e.data.size)ch.push(e.data)};CP.rec=rec;CP.chunks=ch;CP.mt=mt;CP.vs=vs;rec.start(250)}}
function stopPlay(user){if(CP)finish(!!user)}
function finish(cancel){const p=CP;if(!p)return;CP=null;p.nodes.forEach(n=>{try{n.stop?n.stop():n.disconnect()}catch(e){}});
 const done=async()=>{exit();if(p.rec&&!cancel){const type=(p.mt||"video/webm").split(";")[0];const blob=new Blob(p.chunks,{type});const vid=uid();const ok=await dput("blobs","vid:"+vid,blob);
   p.sc.videos=p.sc.videos||[];p.sc.videos.unshift({id:vid,date:Date.now(),size:blob.size,type,dur:Math.round(p.list.reduce((a,s)=>a+s.dur,0)+p.title),stored:ok});if(!ok)LASTV[vid]=blob;p.sc.memory=memoryOf(p.sc);persist();ST8.view="video";toast("🎬 Video ready — saved in your library");panel()}
  else if(p.opts.onEnd)p.opts.onEnd();else panel()};
 if(p.rec&&p.rec.state==="recording"){p.rec.onstop=()=>{p.vs.getTracks().forEach(t=>t.stop());done()};p.rec.stop()}else done()}
const LASTV={};
function memoryOf(sc){const l=sc.shots[sc.shots.length-1];return l?{summary:sc.summary||sc.text.replace(/\s+/g," ").slice(0,300),ending:{loc:l.loc,time:l.time,chars:l.chars.slice(),pos:Object.assign({},l.pos)}}:null}
/* ---------------- thumbnails */
let thRun=false;const thQ=new Set();
async function thumbs(sc,ids){const full=!ids;(ids||sc.shots.filter(s=>!s.thumb).map(s=>s.id)).forEach(id=>thQ.add(id));if(thRun||CP||!thQ.size)return;thRun=true;
 stage(sc);enter("sd");if(full){ST8.busy="🖼 Drawing storyboard frames…";panel()}const tc=document.createElement("canvas");tc.width=320;tc.height=180;const tx=tc.getContext("2d");
 while(thQ.size){const id=thQ.values().next().value;thQ.delete(id);const sh=sc.shots.find(s=>s.id===id);if(!sh)continue;const i=sc.shots.indexOf(sh);
  if(sh.chars.some(n=>!STG.actors[n]||!STG.actors[n].vars[sh.expr[n]||""]))stage(sc);
  const t=sh.dur*.55;poseShot(sh,t,null);camShot(sh,t,i);R.render(S,Cam);cx2.drawImage(R.domElement,0,0,comp.width,comp.height);overlay(sh,t,0,0,null);tx.drawImage(comp,0,0,320,180);sh.thumb=tc.toDataURL("image/jpeg",.72);
  const lk=sh.loc+"|"+sh.time;if(!ST8.locThumbs[lk]){const e={...sh,chars:[],cam:"ews",move:"static"};poseShot(e,0,null);camShot(e,0,0);R.render(S,Cam);tx.drawImage(R.domElement,0,0,320,180);ST8.locThumbs[lk]=tc.toDataURL("image/jpeg",.72)}
  const im=document.querySelector(`[data-kthumb="${sh.id}"]`);if(im)im.src=sh.thumb;await new Promise(r=>requestAnimationFrame(()=>setTimeout(r,0)))}
 exit();thRun=false;persist();if(full){ST8.busy="";panel()}}
/* ---------------- voice */
let MREC=null;
async function recVoice(sh,btn){if(MREC){MREC.stop();return}try{const ms=await navigator.mediaDevices.getUserMedia({audio:true});const r=new MediaRecorder(ms),ch=[];r.ondataavailable=e=>{if(e.data.size)ch.push(e.data)};
 r.onstop=async()=>{ms.getTracks().forEach(t=>t.stop());MREC=null;await setVoice(sh,new Blob(ch,{type:r.mimeType||"audio/webm"}))};MREC=r;r.start();btn.textContent="⏹ Stop recording";toast("Recording your voice… tap Stop when done")}
 catch(e){toast("Microphone isn't allowed here — use Upload instead")}}
async function setVoice(sh,blob){const ac=actx();let dur=0;try{const b=await ac.decodeAudioData(await blob.arrayBuffer());VB[sh.id]=b;dur=b.duration}catch(e){toast("That audio couldn't be read");return}
 if(!(await dput("blobs","voice:"+sh.id,blob)))toast("Voice kept for this session only (storage blocked)");sh.voice=true;sh.voiceDur=Math.round(dur*10)/10;if(sh.dur<dur+.5)sh.dur=Math.round((dur+.6)*10)/10;sh.ok=false;persist();panel();toast("Voice added to shot")}
/* ---------------- UI */
function summary(sh){return sh.chars.map(n=>`${E(n)} <span class="mute">(${E(POS[sh.pos[n]]?POS[sh.pos[n]][0].toLowerCase():"centre")}, ${E((ACTS[sh.act[n]]||"stand").toLowerCase())}${sh.expr[n]?", "+E(EXP[sh.expr[n]].replace(/^\S+\s/,"").toLowerCase()):""})</span>`).join(" · ")||'<span class="mute">No characters — just the place</span>'}
function editor(sc,sh,i){const cast=sc.cast;return `<div class="ked">
 <div class="kg"><label>Location<select data-kf="loc">${opt(LOC,sh.loc)}</select></label><label>Time<select data-kf="time">${opt(TIME,sh.time)}</select></label>
 <label>Camera angle<select data-kf="cam">${opt(CAMS,sh.cam)}</select></label><label>Camera movement<select data-kf="move">${opt(MOVES,sh.move)}</select></label>
 <label>Transition in<select data-kf="trans">${opt(TRANS,sh.trans)}</select></label><label>Duration (s)<input type="number" min="1" max="14" step=".1" value="${sh.dur}" data-kf="dur"></label>
 <label>Camera looks at<select data-kf="focus">${opt(Object.assign({"":"(auto)"},Object.fromEntries(sh.chars.map(n=>[n,n]))),sh.focus)}</select></label><label>Sound effect<select data-kf="sfx">${opt(SFX,sh.sfx)}</select></label></div>
 <b class="kl">Characters in this shot</b>${cast.map(n=>{const on=sh.chars.includes(n);return `<div class="kc"><label class="ck"><input type="checkbox" data-kchar="${E(n)}" ${on?"checked":""}> ${E(n)}</label>${on?`<div class="kg3"><select data-kpos="${E(n)}" aria-label="Position">${opt(Object.fromEntries(Object.entries(POS).map(([k,v])=>[k,v[0]])),sh.pos[n])}</select><select data-kact="${E(n)}" aria-label="Action">${opt(ACTS,sh.act[n]||"stand")}</select><select data-kexp="${E(n)}" aria-label="Expression">${opt(EXP,sh.expr[n]||"")}</select></div>`:""}</div>`}).join("")}
 <label class="kfull">Who speaks<select data-kf="speaker">${opt(Object.assign({"":"Nobody (silent shot)"},Object.fromEntries(sh.chars.map(n=>[n,n]))),sh.speaker)}</select></label>
 <label class="kfull">Dialogue<textarea class="txt" rows="2" data-kf="say" maxlength="300">${E(sh.say)}</textarea></label>
 <label class="kfull">Note<input class="txt" data-kf="note" maxlength="140" value="${E(sh.note)}"></label>
 <div class="kvo"><b class="kl">🎙 Voice</b>${sh.voice?`<span class="mute">Voice added (${sh.voiceDur||"?"} s)</span><button type="button" class="btn ghost" data-kb="vdel" data-ki="${i}">Remove</button>`:`<button type="button" class="btn ghost" data-kb="vrec" data-ki="${i}">🎙 Record</button><label class="btn ghost">⬆ Upload<input type="file" accept="audio/*" data-kvoice="${i}" hidden></label>`}</div>
 <div class="acts"><button type="button" class="btn" data-kb="edone" data-ki="${i}">Done</button></div></div>`}
function shotCard(sc,sh,i){const ed=ST8.edit===sh.id;return `<div class="kshot${sh.ok?" ok":""}" id="ks-${sh.id}"><div class="kst"><button type="button" class="kth" data-kb="pshot" data-ki="${i}" aria-label="Play shot ${i+1}">${sh.thumb?`<img data-kthumb="${sh.id}" src="${sh.thumb}" alt="">`:`<img data-kthumb="${sh.id}" alt="">`}<span class="kpl">▶</span></button>
 <div class="kin"><b>Shot ${i+1}</b> <span class="kbadge">${E(CAMS[sh.cam])}</span> <span class="kbadge">${E(MOVES[sh.move])}</span> <span class="mute">${sh.dur}s</span><div class="mute">📍 ${E(LOC[sh.loc])}${sh.time!=="day"?" · "+E(TIME[sh.time]):""}${sh.trans!=="cut"?" · "+E(TRANS[sh.trans]):""}${sh.sfx!=="none"?" · 🔊 "+E(SFX[sh.sfx]):""}${sh.voice?" · 🎙":""}</div></div></div>
 <div class="kdesc">${summary(sh)}</div>${sh.say?`<div class="ksay"><b>${E(sh.speaker)}:</b> ${E(sh.say)}</div>`:""}${sh.note?`<div class="mute kno">${E(sh.note)}</div>`:""}
 <div class="kbtns"><button type="button" data-kb="edit" data-ki="${i}">✏ Edit</button><button type="button" data-kb="regen" data-ki="${i}">🔄 Redo</button><button type="button" data-kb="up" data-ki="${i}" aria-label="Move up">↑</button><button type="button" data-kb="down" data-ki="${i}" aria-label="Move down">↓</button><button type="button" data-kb="del" data-ki="${i}" aria-label="Delete shot">✕</button><button type="button" class="kok" data-kb="ok" data-ki="${i}" aria-pressed="${sh.ok}">${sh.ok?"✓ Approved":"Approve"}</button></div>
 ${ed?editor(sc,sh,i):""}</div>`}
function viewPanel(){const sc=scene();const nav=[["write","✍ Scene"],["board","🎞 Storyboard"],["video","🎬 Video"],["lib","📚 Library"]];
 let h=`<div class="knav">${nav.map(([k,n])=>`<button type="button" class="tab" data-kview="${k}" aria-pressed="${ST8.view===k}">${n}</button>`).join("")}</div>`;
 if(ST8.busy)h+=`<div class="kbusy">${E(ST8.busy)}</div>`;
 if(!sc&&ST8.view!=="lib"){return h+`<h3>🎬 Create Cinematic Video</h3><p class="mute">Write a scene, pick your saved Clay 3D characters, and get a storyboard of cinematic shots. After you approve it, the video is rendered with your exact characters.</p><div class="acts"><button type="button" class="btn" data-kb="new">➕ Start a new scene</button></div>`}
 if(ST8.view==="write"){const prev=sc.prevId&&ST8.scenes.find(s=>s.id===sc.prevId);const cards=castCards();
  h+=`<div class="kg"><label>Scene<select data-kscene="1">${ST8.scenes.map(s=>`<option value="${s.id}"${s.id===sc.id?" selected":""}>${E(s.title)}</option>`).join("")}</select></label><label>Title<input class="txt" data-ks="title" maxlength="60" value="${E(sc.title)}"></label></div>
  <div class="acts"><button type="button" class="btn ghost" data-kb="new">➕ New scene</button><button type="button" class="btn ghost" data-kb="next">➡ Next scene (continue)</button></div>
  ${prev?`<p class="kmem">🔗 Continues from <b>${E(prev.title)}</b>${prev.memory?` — it ended in ${E(LOC[prev.memory.ending.loc])} with ${E(prev.memory.ending.chars.join(", ")||"nobody")}.`:"."}</p>`:""}
  <h3>📝 1. Write the full scene</h3><textarea class="txt kbig" data-ks="text" rows="11" placeholder="Write or paste the complete scene — story, places, who does what, and dialogues.&#10;&#10;Example:&#10;College canteen, afternoon. Golu sits with a plate of samosas. Vicky walks in.&#10;Vicky: Ra Golu, chai taagudama?&#10;Golu: Chai aa? Naaku biryani kaavali!&#10;Vicky facepalms.">${E(sc.text)}</textarea>
  <h3>✂ 2. Scene parts (optional)</h3><p class="mute">Break the scene into parts — one part per line. Each part becomes one or more shots, in order.</p><textarea class="txt" data-ks="parts" rows="5" placeholder="Part 1: Golu eating samosas alone&#10;Part 2: Vicky arrives and asks for chai&#10;Part 3: Golu wants biryani — Vicky facepalms">${E(sc.parts)}</textarea>
  <h3>🎭 3. Characters in this scene</h3><p class="mute">Your saved characters (★) keep their exact face, hair, colours and outfit in every shot.</p>
  <div class="kcast">${cards.map(c=>`<button type="button" class="kcard" data-kcast="${E(c.name)}" aria-pressed="${sc.cast.includes(c.name)}">${c.thumb?`<img src="${c.thumb}" alt="">`:`<span class="ph">🧸</span>`}<span>${E(c.name)}${c.mine?" ★":""}</span></button>`).join("")}</div>
  <div class="kg"><label>Mood<select data-ks="genre">${opt({auto:"Auto-detect",comedy:"Comedy",emotional:"Emotional",action:"Action"},sc.genre)}</select></label></div>
  <div class="acts"><button type="button" class="btn" data-kb="plan" ${ST8.busy?"disabled":""}>🧠 Understand scene & make storyboard</button><button type="button" class="btn ghost" data-kb="quick" ${ST8.busy?"disabled":""}>⚡ Quick plan (no AI)</button></div>`}
 if(ST8.view==="board"){if(!sc.shots.length)return h+`<p class="mute">No storyboard yet. Write the scene and tap “Understand scene & make storyboard”.</p><div class="acts"><button type="button" class="btn" data-kview="write">✍ Go to scene</button></div>`;
  const tot=sc.shots.reduce((a,s)=>a+s.dur,0),okN=sc.shots.filter(s=>s.ok).length,locs=[...new Set(sc.shots.map(s=>LOC[s.loc]))];
  h+=`<div class="ksum"><b>${E(sc.title)}</b> · ${sc.shots.length} shots · ${Math.round(tot)} s · ${E(sc.genreUsed||"")}<br><span class="mute">📍 ${E(locs.join(", "))} · planned by ${sc.planner==="ai"?"AI":"quick planner"} · ${okN}/${sc.shots.length} approved</span></div>
  <div class="acts"><button type="button" class="btn ghost" data-kb="pall">▶ Play storyboard</button><button type="button" class="btn ghost" data-kb="okall">✓ Approve all</button><button type="button" class="btn ghost" data-kb="add">➕ Add shot</button><button type="button" class="btn ghost" data-kb="replan">🔄 Re-plan all</button></div>
  <div class="kshots">${sc.shots.map((s,i)=>shotCard(sc,s,i)).join("")}</div>
  <div class="kgen">${okN===sc.shots.length?`<button type="button" class="btn big" data-kb="gen">🎬 Generate Cinematic Video</button><p class="mute">Renders in real time (about ${Math.round(tot+2)} s). Keep this tab open.</p>`:`<p class="mute">Approve every shot to unlock <b>Generate Cinematic Video</b> (${okN}/${sc.shots.length}).</p>`}</div>`}
 if(ST8.view==="video"){const s=ST8.set,v=(sc.videos||[])[0];
  h+=`<h3>🎵 Sound & finishing</h3><div class="kg"><label>Background music<select data-kset="music">${opt(MUSIC,s.music)}</select></label><label>Music volume<input type="range" min="0" max="1" step=".05" value="${s.vol}" data-kset="vol"></label>
  <label>Transitions<select data-kset="trans">${opt({plan:"As planned per shot",cut:"All cuts",fade:"All fades"},s.trans)}</select></label><label>Quality<select data-kset="q">${opt({hd:"HD 720p",sd:"Fast 540p"},s.q)}</select></label></div>
  ${s.music==="file"?`<div class="acts"><label class="btn ghost">⬆ Upload music file<input type="file" accept="audio/*" data-kmusic="1" hidden></label><span class="mute">${VB.music?"Loaded":""}</span></div>`:""}
  <label class="ck"><input type="checkbox" data-kset="subs" ${s.subs?"checked":""}> Subtitles</label><label class="ck"><input type="checkbox" data-kset="sfx" ${s.sfx?"checked":""}> Sound effects</label><label class="ck"><input type="checkbox" data-kset="title" ${s.title?"checked":""}> Title card at start</label>
  <p class="mute">Voices: open a shot in 🎞 Storyboard → ✏ Edit → 🎙 Voice. Timing: change shot durations there.</p>
  <div class="acts">${sc.shots.length&&sc.shots.every(x=>x.ok)?`<button type="button" class="btn" data-kb="gen">🎬 ${v?"Re-generate":"Generate"} Cinematic Video</button>`:`<button type="button" class="btn ghost" data-kview="board">Approve the storyboard first</button>`}<button type="button" class="btn ghost" data-kb="pall">▶ Live preview</button></div>
  ${v?`<h3>Latest video</h3><video class="kvid" id="kvid" controls playsinline></video><div class="acts"><button type="button" class="btn" data-kb="export" data-kvid="${v.id}">⬇ Export video</button></div><h3>Review shots</h3><div class="kmini">${sc.shots.map((x,i)=>`<button type="button" data-kb="pshot" data-ki="${i}"><img src="${x.thumb||""}" alt=""><span>${i+1}</span></button>`).join("")}</div>`:""}`}
 if(ST8.view==="lib"){const allV=[];ST8.scenes.forEach(s=>(s.videos||[]).forEach(v=>allV.push([s,v])));
  h+=`<h3>🎬 Scenes (${ST8.scenes.length})</h3><div class="acts"><button type="button" class="btn ghost" data-kb="new">➕ New scene</button></div>${ST8.scenes.map(s=>`<div class="klib"><button type="button" class="chip" data-kopen="${s.id}">${E(s.title)}</button><span class="mute">${s.shots.length} shots · ${s.shots.length&&s.shots.every(x=>x.ok)?"approved":"draft"} · ${(s.videos||[]).length} video</span><button type="button" class="x" data-kdel="${s.id}" aria-label="Delete scene ${E(s.title)}">✕</button></div>`).join("")||'<p class="mute">No scenes yet.</p>'}
  <h3>🎞 Videos (${allV.length})</h3>${allV.map(([s,v])=>`<div class="klib"><span>${E(s.title)} <span class="mute">${new Date(v.date).toLocaleString()} · ${v.dur}s · ${(v.size/1048576).toFixed(1)} MB</span></span><button type="button" class="chip" data-kb="export" data-kvid="${v.id}">⬇</button><button type="button" class="x" data-kvdel="${v.id}" data-ksc="${s.id}" aria-label="Delete video">✕</button></div>`).join("")||'<p class="mute">Generated videos appear here.</p>'}
  <h3>🏞 Backgrounds made (${Object.keys(ST8.locThumbs).length})</h3><div class="kmini">${Object.entries(ST8.locThumbs).map(([k,src])=>{const [l,t]=k.split("|");return `<div class="kloc"><img src="${src}" alt=""><span>${E(LOC[l]||l)}${t!=="day"?" · "+E(TIME[t]||t):""}</span></div>`}).join("")||'<p class="mute">Backgrounds appear when a storyboard is drawn.</p>'}</div>
  <p class="mute">Everything here is saved in this browser on this device.</p>`}
 return h}
async function showVid(){const el=document.getElementById("kvid");const sc=scene();if(!el||!sc||!sc.videos||!sc.videos[0])return;const v=sc.videos[0];const b=LASTV[v.id]||await dget("blobs","vid:"+v.id);if(b){if(el.dataset.v===v.id)return;el.dataset.v=v.id;el.src=URL.createObjectURL(b)}}
function panelHtml(){setTimeout(showVid,0);return viewPanel()}
function markDirty(sh){sh.ok=false;sh.thumb="";const sc=scene();sc.memory=null;persist()}
async function click(t){const sc=scene();
 if(t.dataset.kview){ST8.view=t.dataset.kview;ST8.edit=null;panel();return true}
 if(t.dataset.kcast&&sc){const n=t.dataset.kcast;sc.cast=sc.cast.includes(n)?sc.cast.filter(x=>x!==n):sc.cast.concat(n).slice(0,6);persist();panel();return true}
 if(t.dataset.kopen){ST8.cur=t.dataset.kopen;ST8.view="board";persist();panel();return true}
 if(t.dataset.kdel){if(!t.dataset.sure){t.dataset.sure="1";t.textContent="Delete?";setTimeout(()=>{if(t.isConnected){delete t.dataset.sure;t.textContent="✕"}},2500);return true}const s=ST8.scenes.find(x=>x.id===t.dataset.kdel);if(s){for(const v of s.videos||[])ddel("blobs","vid:"+v.id);ST8.scenes=ST8.scenes.filter(x=>x!==s);ST8.scenes.forEach(x=>{if(x.prevId===s.id)x.prevId=null});if(ST8.cur===s.id)ST8.cur=ST8.scenes.length?ST8.scenes[0].id:null}persist();panel();return true}
 if(t.dataset.kvdel){if(!t.dataset.sure){t.dataset.sure="1";t.textContent="Delete?";setTimeout(()=>{if(t.isConnected){delete t.dataset.sure;t.textContent="✕"}},2500);return true}const s=ST8.scenes.find(x=>x.id===t.dataset.ksc);if(s)s.videos=(s.videos||[]).filter(v=>v.id!==t.dataset.kvdel);ddel("blobs","vid:"+t.dataset.kvdel);persist();panel();return true}
 const b=t.dataset.kb;if(!b)return false;if((CP||ST8.busy||thRun)&&b!=="export"&&b!=="edit"&&b!=="edone"){toast("Please wait — still working");return true}const i=t.dataset.ki!=null?+t.dataset.ki:-1,sh=sc&&sc.shots[i];
 if(b==="new"){newScene(null);panel();return true}
 if(b==="next"){if(!sc)return true;if(!sc.memory)sc.memory=memoryOf(sc);const n=newScene(sc);n.cast=sc.cast.slice();panel();toast("New scene continues from “"+sc.title+"”");return true}
 if(b==="plan"||b==="quick"){if(MREC)return true;await plan(sc,b==="plan");return true}
 if(b==="replan"){if(!confirmSure(t,"Re-plan? Replaces all shots"))return true;await plan(sc,!AIOFF);return true}
 if(b==="edit"){ST8.edit=ST8.edit===sh.id?null:sh.id;panel();return true}
 if(b==="edone"){ST8.edit=null;panel();thumbs(sc,[sh.id]);return true}
 if(b==="regen"){await regen(sc,i);return true}
 if(b==="up"&&i>0){[sc.shots[i-1],sc.shots[i]]=[sc.shots[i],sc.shots[i-1]];sc.memory=null;persist();panel();return true}
 if(b==="down"&&i<sc.shots.length-1){[sc.shots[i+1],sc.shots[i]]=[sc.shots[i],sc.shots[i+1]];sc.memory=null;persist();panel();return true}
 if(b==="del"){if(!confirmSure(t,"Delete?"))return true;sc.shots.splice(i,1);sc.memory=null;persist();panel();return true}
 if(b==="ok"){sh.ok=!sh.ok;if(sc.shots.every(s=>s.ok))sc.memory=memoryOf(sc);persist();panel();return true}
 if(b==="okall"){sc.shots.forEach(s=>s.ok=true);sc.memory=memoryOf(sc);persist();panel();return true}
 if(b==="add"){const l=sc.shots[sc.shots.length-1];const n=l?Object.assign(JSON.parse(JSON.stringify(l)),{id:uid(),say:"",speaker:"",ok:false,thumb:"",voice:false,voiceDur:0,sfx:"none",note:"New shot",cam:"ws",move:"static"}):{id:uid(),loc:"campus",time:"day",cam:"ws",move:"static",trans:"cut",dur:3,chars:sc.cast.slice(0,4),pos:Object.fromEntries(sc.cast.map((n,j)=>[n,slots(sc.cast.length)[j]])),act:{},expr:{},focus:"",speaker:"",say:"",sfx:"none",note:"New shot",ok:false,thumb:""};
  n.chars.forEach(c=>{n.act[c]=n.act[c]||"stand"});sc.shots.push(n);ST8.edit=n.id;persist();panel();thumbs(sc,[n.id]);return true}
 if(b==="pshot"){if(!sh)return true;await play(sc,{only:i});return true}
 if(b==="pall"){await play(sc,{});return true}
 if(b==="gen"){if(!sc.shots.every(s=>s.ok)){toast("Approve every shot first");return true}if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream){toast("This browser can't record video");return true}toast("🎬 Rendering your film…");await play(sc,{record:true});return true}
 if(b==="export"){const id=t.dataset.kvid;const s=ST8.scenes.find(x=>(x.videos||[]).some(v=>v.id===id));const v=s&&s.videos.find(v=>v.id===id);const blob=LASTV[id]||await dget("blobs","vid:"+id);if(!blob){toast("Video not found");return true}
  await saveFile(blob,((s&&s.title)||"scene").replace(/[^\w-]+/g,"-")+"-cinematic"+(blob.type.includes("mp4")?".mp4":".webm"));return true}
 if(b==="vrec"){await recVoice(sh,t);return true}
 if(b==="vdel"){sh.voice=false;sh.voiceDur=0;delete VB[sh.id];ddel("blobs","voice:"+sh.id);markDirty(sh);panel();return true}
 return false}
function confirmSure(t,msg){if(t.dataset.sure)return true;t.dataset.sure="1";const o=t.textContent;t.textContent=msg;setTimeout(()=>{if(t.isConnected){delete t.dataset.sure;t.textContent=o}},2500);return false}
function input(t){const sc=scene();if(!sc)return false;
 if(t.dataset.ks){const k=t.dataset.ks;sc[k]=k==="title"?t.value.slice(0,60):t.value.slice(0,20000);persist();return true}
 if(t.dataset.kf==="say"||t.dataset.kf==="note"){const sh=sc.shots.find(s=>s.id===ST8.edit);if(sh){sh[t.dataset.kf]=t.value;sh.ok=false;sc.memory=null;persist()}return true}
 if(t.dataset.kset==="vol"){ST8.set.vol=+t.value;persist();return true}return false}
async function change(t){const sc=scene();
 if(t.dataset.kscene){ST8.cur=t.value;persist();panel();return true}if(t.dataset.ks==="genre"&&sc){sc.genre=t.value;persist();return true}
 if(t.dataset.kset){const k=t.dataset.kset;ST8.set[k]=t.type==="checkbox"?t.checked:k==="vol"?+t.value:t.value;persist();panel();return true}
 if(t.dataset.kmusic&&t.files&&t.files[0]){const f=t.files[0];const ac=actx();try{VB.music=await ac.decodeAudioData(await f.arrayBuffer());await dput("blobs","music:file",f);toast("Music loaded")}catch(e){toast("That audio couldn't be read")}panel();return true}
 if(t.dataset.kvoice!=null&&t.files&&t.files[0]){const sh=sc.shots[+t.dataset.kvoice];if(sh)await setVoice(sh,t.files[0]);return true}
 const sh=sc&&sc.shots.find(s=>s.id===ST8.edit);if(!sh)return false;
 if(t.dataset.kf){const k=t.dataset.kf;if(k==="say"||k==="note")return true;sh[k]=k==="dur"?clamp(+t.value||3,1,14):t.value;if(k==="speaker"&&t.value&&!sh.act[t.value])sh.act[t.value]="talk";markDirty(sh);if(["loc","time","cam","move","dur","focus","speaker"].includes(k))panel();thumbs(sc,[sh.id]);return true}
 if(t.dataset.kchar){const n=t.dataset.kchar;if(t.checked){if(!sh.chars.includes(n))sh.chars.push(n);sh.act[n]=sh.act[n]||"stand";if(!sh.pos[n])sh.pos[n]=slots(sc.cast.length)[sc.cast.indexOf(n)]||"c"}else{sh.chars=sh.chars.filter(x=>x!==n);if(sh.speaker===n){sh.speaker="";sh.say=""}if(sh.focus===n)sh.focus=""}markDirty(sh);panel();thumbs(sc,[sh.id]);return true}
 if(t.dataset.kpos){sh.pos[t.dataset.kpos]=t.value;markDirty(sh);thumbs(sc,[sh.id]);return true}
 if(t.dataset.kact){sh.act[t.dataset.kact]=t.value;markDirty(sh);thumbs(sc,[sh.id]);return true}
 if(t.dataset.kexp){sh.expr[t.dataset.kexp]=t.value;markDirty(sh);thumbs(sc,[sh.id]);return true}
 return false}
async function init(){const s=await dget("kv","state");if(s&&Array.isArray(s.scenes)){ST8.scenes=s.scenes;ST8.cur=s.cur&&s.scenes.some(x=>x.id===s.cur)?s.cur:(s.scenes[0]||{}).id||null;Object.assign(ST8.set,s.set||{});ST8.locThumbs=s.locThumbs||{}}if(tab==="cine")panel()}
return {panel:panelHtml,click,input,change,init,frame(){if(CP)CP.frame()},active:()=>ACT,LOC,planQuick,_st:ST8}})();
