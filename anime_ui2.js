/* ===== Anime Character Studio ===== */
(function(){
const A=window.ANIME,$=q=>document.querySelector(q),$$=q=>[...document.querySelectorAll(q)];
const E=t=>String(t==null?"":t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const isHex=v=>/^#[0-9a-f]{6}$/i.test(v||"");
const LOOK=["gender","age","face","skin","eyes","eyeColor","hair","hairColor"],IDX=["mustache","beard","mole","scar","bindi","blush","earrings","glasses"],OUTK=["outfit","outfitColor","accent","bottomColor","shoeColor"],OUTX=["sunglasses","goldChain","headphones","cap","towel","pen","flowers"];
const LAB={gender:"Gender / body",age:"Age group",face:"Face shape",skin:"Skin tone",eyes:"Eye shape",eyeColor:"Eye colour",hair:"Hairstyle",hairColor:"Hair colour",outfit:"Outfit type",outfitColor:"Outfit colour",accent:"Accent colour",bottomColor:"Trousers / bottom colour",shoeColor:"Shoe colour",bg:"Background colour"};
const NICE={gender:{boy:"Boy",girl:"Girl",man:"Man",woman:"Woman"},age:{teen:"Teen (school)",young:"Young (college)",adult:"Adult (parent)",old:"Old"},face:{oval:"Oval",round:"Round",sharp:"Sharp / pointed",square:"Square / strong"},eyes:{big:"Big anime",sharp:"Sharp cool",sleepy:"Sleepy / half",round:"Round innocent"},hair:{spiky:"Spiky",side:"Side-swept",messy:"Messy",short:"Short neat",long:"Long",ponytail:"Ponytail",bun:"Bun",bald:"Bald (sides only)",curly:"Curly",mohawk:"Mohawk"},outfit:{tshirt:"T-shirt (casual)",shirt:"Shirt (college)",hoodie:"Hoodie (casual / winter)",jacket:"Open jacket (cool / action)",kurta:"Kurta (traditional)",saree:"Saree (traditional)",vest:"Vest over shirt (formal)",uniform:"Uniform with tie (school / office)"}};
const XN={sunglasses:"Sunglasses",glasses:"Glasses",goldChain:"Gold chain",headphones:"Headphones",mustache:"Mustache",beard:"Beard",bindi:"Bindi",earrings:"Earrings",cap:"Cap",blush:"Always blushing",mole:"Mole",scar:"Scar",pen:"Pen in pocket",towel:"Towel on shoulder",flowers:"Flowers in hair"};
const EXN={neutral:"Neutral",happy:"Happy",smiling:"Smiling",laugh:"Laughing",angry:"Angry",sad:"Sad",crying:"Crying",surprised:"Surprised",shock:"Shocked",scared:"Scared",confident:"Confident",confused:"Confused",shy:"Shy",serious:"Serious",evil:"Evil smile",cool:"Cool",panic:"Panic",smirk:"Smirk",worried:"Worried",love:"In love",sleepy:"Sleepy"};
const ROLE=["College student","School student","Hero","Villain","Comedian / sidekick","Parent","Teacher / lecturer","Shopkeeper","DJ / musician","Other"];
const SEC=[["profile","1 · Profile"],["look","2 · Appearance"],["outfits","3 · Outfits"],["views","4 · Views"],["expr","5 · Expressions"],["poses","6 · Poses"],["scene","7 · Scene & group"],["sheet","8 · Reference sheet"],["art","9 · Real AI art (free)"]];
const K="cfl-anime";let LIST=[],DEL=[];try{LIST=JSON.parse(localStorage.getItem(K)||"[]")||[];DEL=JSON.parse(localStorage.getItem(K+"-del")||"[]")||[]}catch(e){}
const uid=()=>"c"+Date.now()+Math.random().toString(36).slice(2,5);
function blank(){return {id:null,name:"New character",profile:{ageNum:"",height:"average",heightCm:"",build:"average",role:"College student",personality:"",background:"",special:"",customOutfit:""},look:{gender:"boy",age:"young",face:"oval",skin:"#dfab84",eyes:"big",eyeColor:"#3b2a20",hair:"spiky",hairColor:"#1b1b1f",extras:[]},outfits:[{id:"o1",name:"College outfit",outfit:"shirt",outfitColor:"#2f3863",accent:"#c8902a",bottomColor:"#2e3a5c",shoeColor:"#1d1d24",extras:[]}],oi:0,expr:"neutral",bg:"#dfe5f5",bgScene:"plain",locked:false,versions:[],images:[],notes:"",t:0}}
function migrate(c){if(c.look)return c;const n=blank();n.id=c.id||uid();n.name=c.name||"Character";LOOK.forEach(k=>{if(c[k])n.look[k]=c[k]});n.look.extras=(c.extras||[]).filter(x=>IDX.includes(x));
 n.outfits=[{id:"o1",name:"Main outfit",outfit:c.outfit||"tshirt",outfitColor:c.outfitColor||"#2f3863",accent:c.accent||"#c8902a",bottomColor:"#2e3a5c",shoeColor:"#1d1d24",extras:(c.extras||[]).filter(x=>OUTX.includes(x))}];n.expr=c.expr||"neutral";n.bg=c.bg||"#dfe5f5";n.notes=c.notes||"";n.t=c.t||Date.now();return n}
LIST=LIST.map(migrate);
let cur=LIST[0]?JSON.parse(JSON.stringify(LIST[0])):blank(),sec="profile",cloud=null,assets=null,view="front",pose="stand",photo=null,cmpV=null;
const outfit=(c)=>c.outfits[c.oi]||c.outfits[0];
function flat(c,over){const o=outfit(c)||{};return Object.assign({},A.DEF,c.look,{outfit:o.outfit,outfitColor:o.outfitColor,accent:o.accent,bottomColor:o.bottomColor,shoeColor:o.shoeColor},{extras:(c.look.extras||[]).concat(o.extras||[]),expr:c.expr,bg:c.bg,bgScene:c.bgScene,build:c.profile.build,height:c.profile.height,name:c.name},over||{})}
const msg=t=>{const m=$("#asMsg");if(m)m.textContent=t};
function saveLocal(){try{localStorage.setItem(K,JSON.stringify(LIST));localStorage.setItem(K+"-del",JSON.stringify(DEL.slice(-300)))}catch(e){msg("This device's storage is full — delete old versions or characters.")}}
function pushCloud(){if(!cloud)return;clearTimeout(pushCloud.t);pushCloud.t=setTimeout(async()=>{try{await cloud.set({list:LIST,del:DEL.slice(-300),t:Date.now(),v:2})}catch(e){msg("Saved on this device; couldn't sync to your account just now.")}},900)}
function save(silent){cur.name=(cur.name||"").trim()||"New character";if(!cur.id)cur.id=uid();cur.t=Date.now();const i=LIST.findIndex(v=>v.id===cur.id);
 if(i>=0){const old=LIST[i];if(JSON.stringify(old.look)!==JSON.stringify(cur.look)){cur.versions=[{t:old.t||Date.now(),look:old.look,label:"Before "+new Date().toLocaleString()}].concat(cur.versions||[]).slice(0,12)}LIST[i]=JSON.parse(JSON.stringify(cur))}else LIST.unshift(JSON.parse(JSON.stringify(cur)));
 saveLocal();pushCloud();drawGallery();if(!silent)msg(`Saved ${cur.name}.`)}
/* ---------- rendering of the studio ---------- */
function sw(k,obj,vals,dis){return `<div class="ancol"><span>${LAB[k]}</span><div class="sw">${vals.map(v=>`<button type="button" class="swb${obj[k]===v?" on":""}" data-sw="${k}" data-v="${v}" style="background:${v}" aria-label="${v}" ${dis?"disabled":""}></button>`).join("")}<input type="color" data-col="${k}" value="${isHex(obj[k])?obj[k]:"#888888"}" ${dis?"disabled":""} aria-label="Custom ${LAB[k]}"></div></div>`}
function selF(k,obj,vals,dis,attr){return `<label class="ansel"><span>${LAB[k]}</span><select class="cin" ${attr||`data-lk="${k}"`} ${dis?"disabled":""}>${vals.map(v=>`<option value="${v}"${obj[k]===v?" selected":""}>${(NICE[k]&&NICE[k][v])||v}</option>`).join("")}</select></label>`}
function preview(){const p=flat(cur);$("#asPrev").innerHTML=A.drawFull(p,{view,pose,bg:cur.bgScene||"plain",base:cur.bg});$("#asHead").innerHTML=A.draw(p,null,{plain:true});
 $("#asBadge").innerHTML=cur.locked?`<span class="lockb">🔒 Identity locked</span>`:`<span class="lockb off">Draft</span>`;$("#asTitle").textContent=cur.name+(cur.profile.ageNum?` · ${cur.profile.ageNum}`:"")}
function drawSec(){$("#asTabs").innerHTML=SEC.map(s=>`<button type="button" class="chip" data-sec="${s[0]}" aria-pressed="${sec===s[0]}">${s[1]}</button>`).join("");
 const L=cur.locked,O=outfit(cur),P=cur.profile,box=$("#asBody");let h="";
 if(sec==="profile"){h=`<div class="angrid2"><label class="ansel"><span>Character name</span><input class="cin" data-pf="name" value="${E(cur.name)}"></label>
 <label class="ansel"><span>Age</span><input class="cin" data-pr="ageNum" value="${E(P.ageNum)}" placeholder="e.g. 20"></label>
 ${selF("gender",cur.look,A.OPT.gender,L)}${selF("age",cur.look,A.OPT.age,L)}
 <label class="ansel"><span>Height</span><select class="cin" data-pr="height">${["short","average","tall"].map(v=>`<option${P.height===v?" selected":""}>${v}</option>`).join("")}</select></label>
 <label class="ansel"><span>Height (cm, optional)</span><input class="cin" data-pr="heightCm" value="${E(P.heightCm)}" placeholder="e.g. 175"></label>
 <label class="ansel"><span>Body type</span><select class="cin" data-pr="build" ${L?"disabled":""}>${["slim","average","broad","chubby"].map(v=>`<option${P.build===v?" selected":""}>${v}</option>`).join("")}</select></label>
 <label class="ansel"><span>Character role</span><input class="cin" data-pr="role" list="asRoles" value="${E(P.role)}"><datalist id="asRoles">${ROLE.map(r=>`<option value="${r}">`).join("")}</datalist></label></div>
 <label class="ansel"><span>Personality</span><textarea class="cta" rows="2" data-pr="personality" placeholder="e.g. calm show-off, never admits a mistake, talks in English tags">${E(P.personality)}</textarea></label>
 <label class="ansel"><span>Background</span><textarea class="cta" rows="2" data-pr="background" placeholder="e.g. Hyderabad local DJ, lives with parents, best friend Golu">${E(P.background)}</textarea></label>
 <label class="ansel"><span>Special characteristics</span><textarea class="cta" rows="2" data-pr="special" placeholder="e.g. always wears sunglasses, scar on eyebrow, gold chain">${E(P.special)}</textarea></label>
 <div class="anpanel"><h4>✨ Design the look with Claude</h4><p class="row">Claude reads the profile above (and a library character, if you pick one) and chooses the face, eyes, hair, skin, outfit, colours and accessories.</p>
 <label class="ansel"><span>Use a character from the library (optional)</span><select class="cin" id="asWho"></select></label>
 <label class="ansel"><span>Extra description (optional)</span><textarea class="cta" rows="2" id="asDesc" placeholder="Anything about the look you want"></textarea></label>
 <div class="acts"><button class="btn" type="button" data-ai="all">✨ Design whole character</button><button class="btn ghost" type="button" id="asRandom">🎲 Random look</button></div></div>
 <div class="anpanel"><h4>📷 Start from a reference picture</h4><p class="row">Upload a photo or drawing. Claude looks at it and makes an <b>original</b> anime character — only the features you tick are taken from the picture.</p>
 <input type="file" accept="image/*" id="asPhoto" class="cin">${photo?`<img src="${photo.url}" alt="Reference" class="anref">`:""}
 <div class="chips" style="margin:6px 0">${[["hair","Hairstyle"],["hairColor","Hair colour"],["face","Face shape"],["skin","Skin tone"],["eyes","Eyes"],["facial","Beard / mustache / glasses"],["outfit","Outfit"],["colours","Outfit colours"]].map(([k,n])=>`<button type="button" class="chip" data-keep="${k}" aria-pressed="${(photo&&photo.keep||["hair","hairColor","face","skin"]).includes(k)}">${n}</button>`).join("")}</div>
 <div class="acts"><button class="btn" type="button" data-ai="photo" ${photo?"":"disabled"}>Analyse picture and design</button></div></div>`}
 if(sec==="look"){h=`${L?`<p class="lockmsg">🔒 Identity locked — face, eyes, hair, skin and body stay fixed. Outfits, expressions, poses and backgrounds can still change. <button class="btn ghost sm" type="button" id="asUnlock">Unlock to edit</button></p>`:""}
 <div class="angrid2">${selF("face",cur.look,A.OPT.face,L)}${selF("eyes",cur.look,A.OPT.eyes,L)}${selF("hair",cur.look,A.OPT.hair,L)}</div>
 ${sw("skin",cur.look,A.OPT.skin,L)}${sw("eyeColor",cur.look,A.OPT.eyeColor,L)}${sw("hairColor",cur.look,A.OPT.hairColor,L)}
 <div class="ancol"><span>Distinctive features</span><div class="chips">${IDX.map(x=>`<button type="button" class="chip" data-ix="${x}" aria-pressed="${cur.look.extras.includes(x)}" ${L?"disabled":""}>${XN[x]}</button>`).join("")}</div></div>
 ${sw("bg",cur,A.OPT.bg,false)}
 <div class="anpanel"><h4>Regenerate with Claude — only the part you choose</h4><p class="row">Everything else stays exactly as it is.</p><label class="ansel"><span>What to change (optional)</span><input class="cin" id="asReDesc" placeholder="e.g. make him look older and stricter"></label>
 <div class="acts"><button class="btn sm" type="button" data-ai="all" ${L?"disabled":""}>Whole character</button><button class="btn ghost sm" type="button" data-ai="face" ${L?"disabled":""}>Only the face</button><button class="btn ghost sm" type="button" data-ai="hair" ${L?"disabled":""}>Only the hair</button><button class="btn ghost sm" type="button" data-ai="colours">Only the colours</button></div></div>
 <div class="anpanel"><h4>Versions</h4>${(cur.versions||[]).length?`<p class="row">Earlier looks of this character (saved when you saved a changed look). Tap Restore to bring one back.</p><div class="anvers">${cur.versions.map((v,i)=>`<div>${A.draw(Object.assign(flat(cur),v.look,{extras:(v.look.extras||[]).concat(outfit(cur).extras||[])}),null,{plain:true})}<span class="mt">${E(v.label)}</span><button class="btn ghost sm" type="button" data-restore="${i}" ${L?"disabled":""}>Restore</button></div>`).join("")}</div>`:`<p class="row">No earlier versions yet. Each time you save a changed look, the previous one is kept here.</p>`}</div>`}
 if(sec==="outfits"){h=`<div class="chips">${cur.outfits.map((o,i)=>`<button type="button" class="chip" data-oi="${i}" aria-pressed="${i===cur.oi}">${E(o.name)}</button>`).join("")}<button type="button" class="chip" id="asOAdd">➕ New outfit</button><button type="button" class="chip" id="asODup">Duplicate this outfit</button>${cur.outfits.length>1?`<button type="button" class="chip" id="asODel">Delete this outfit</button>`:""}</div>
 <label class="ansel"><span>Outfit name</span><input class="cin" data-on="name" value="${E(O.name)}"></label>
 <div class="angrid2">${selF("outfit",O,A.OPT.outfit,false,`data-ok="outfit"`)}</div>
 ${["outfitColor","accent","bottomColor","shoeColor"].map(k=>sw(k,O,k==="bottomColor"?["#2e3a5c","#1d1d24","#3b5a8a","#efeadc","#7a5a3a","#5a5a62","#2f6b4f"]:k==="shoeColor"?["#1d1d24","#ffffff","#7a4a2a","#b5523b","#3b82c4","#c8902a"]:A.OPT[k==="outfitColor"?"outfitColor":"accent"]).replace(/data-sw=/g,"data-osw=").replace(/data-col=/g,"data-ocol=")).join("")}
 <div class="ancol"><span>Accessories with this outfit</span><div class="chips">${OUTX.map(x=>`<button type="button" class="chip" data-ox="${x}" aria-pressed="${(O.extras||[]).includes(x)}">${XN[x]}</button>`).join("")}</div></div>
 <div class="anpanel"><h4>✨ Design an outfit with Claude</h4><p class="row">College, casual, traditional, action, seasonal — or describe your own. The face and body stay the same.</p>
 <div class="chips">${["College outfit","Casual outfit","Traditional festival outfit","Action / fight outfit","Winter outfit","Summer outfit","Wedding outfit"].map(t=>`<button type="button" class="chip" data-otype="${t}">${t}</button>`).join("")}</div>
 <label class="ansel"><span>Or describe it</span><input class="cin" id="asODesc" placeholder="e.g. white kurta with gold border for Sankranti" value="${E(cur.profile.customOutfit||"")}"></label><div class="acts"><button class="btn sm" type="button" data-ai="outfit">Design this outfit (adds a new one)</button></div></div>
 <h4 style="margin:14px 0 6px">Compare outfits</h4><div class="angal4">${cur.outfits.map((o,i)=>`<div>${A.drawFull(flat(Object.assign({},cur,{oi:i})),{view:"front",bg:"plain",base:cur.bg,label:o.name})}</div>`).join("")}</div>`}
 if(sec==="views"){h=`<p class="row">The same character from 6 directions — face, hair, body, clothes and colours stay identical.</p><div class="chips">${Object.keys(A.POSES).map(k=>`<button type="button" class="chip" data-vpose="${k}" aria-pressed="${pose===k}">${A.POSES[k].n}</button>`).join("")}</div>
 <div class="angal6">${A.VIEWS.map(v=>`<div>${A.drawFull(flat(cur),{view:v,pose,bg:"plain",base:cur.bg,label:A.VIEWN[v]})}</div>`).join("")}</div><div class="acts"><button class="btn sm" type="button" data-png="views">Download turnaround (PNG)</button></div>`}
 if(sec==="expr"){h=`<p class="row">Tap one to make it this character's default expression.</p><div class="angal4 head">${A.EXPR.map(x=>`<button type="button" class="anpick${cur.expr===x?" on":""}" data-dex="${x}">${A.draw(flat(cur),x,{label:EXN[x]})}</button>`).join("")}</div><div class="acts"><button class="btn sm" type="button" data-png="expr">Download expression sheet (PNG)</button></div>`}
 if(sec==="poses"){h=`<p class="row">Each pose is shown from its clearest angle. Tap one to show it in the big preview.</p><div class="angal6">${Object.keys(A.POSES).map(k=>`<button type="button" class="anpick${pose===k?" on":""}" data-pp="${k}">${A.drawFull(flat(cur),{view:A.POSES[k].best||"front",pose:k,bg:"plain",base:cur.bg,label:A.POSES[k].n})}</button>`).join("")}</div>
 <div class="acts"><button class="btn sm" type="button" data-png="poses">Download all poses (PNG)</button></div>
 <div class="anpanel"><h4>Custom pose</h4><p class="row">Describe a moment. Claude picks the closest pose, angle, expression and background from the studio (it can't invent brand-new body positions).</p><input class="cin" id="asPDesc" placeholder="e.g. shocked when the principal walks into the bathroom"><div class="acts"><button class="btn sm" type="button" data-ai="pose">Find the pose</button></div></div>`}
 if(sec==="scene"){h=`<div class="angrid2"><label class="ansel"><span>Background</span><select class="cin" id="asBg">${Object.keys(A.BGS).map(k=>`<option value="${k}"${cur.bgScene===k?" selected":""}>${A.BGS[k]}</option>`).join("")}</select></label>
 <label class="ansel"><span>Angle</span><select class="cin" id="asView">${A.VIEWS.map(v=>`<option value="${v}"${view===v?" selected":""}>${A.VIEWN[v]}</option>`).join("")}</select></label>
 <label class="ansel"><span>Pose</span><select class="cin" id="asPose">${Object.keys(A.POSES).map(k=>`<option value="${k}"${pose===k?" selected":""}>${A.POSES[k].n}</option>`).join("")}</select></label>
 <label class="ansel"><span>Expression</span><select class="cin" id="asExpr">${A.EXPR.map(x=>`<option value="${x}"${cur.expr===x?" selected":""}>${EXN[x]}</option>`).join("")}</select></label></div>
 <div class="acts"><button class="btn sm" type="button" data-png="one">Download this picture (PNG)</button></div>
 <div class="anpanel"><h4>Characters together</h4><p class="row">Pick 2–4 saved characters. Each keeps its own locked look.</p><div class="chips" id="asGroupPick">${LIST.map(c=>`<button type="button" class="chip" data-gp="${c.id}" aria-pressed="${(window.__asG||[]).includes(c.id)}">${E(c.name)}</button>`).join("")||`<span class="row">Save at least two characters first.</span>`}</div>
 <div class="acts"><button class="btn sm" type="button" id="asGroup">Make group picture</button></div><div id="asGroupOut"></div></div>`}
 if(sec==="sheet"){h=`<p class="row">A complete character reference sheet: name and age, front, three-quarter, side and back views, expressions, poses, outfit details and colour palette.</p><div class="acts"><button class="btn" type="button" id="asSheet">Generate Character Reference Sheet</button></div><div id="asSheetOut"></div>`}
 if(sec==="art"){h=`<div class="anpanel"><h4>Get real painted anime art — free</h4><ol class="row"><li>Download the reference sheet (section 8) or the front view.</li><li>Open a free AI image app — for example the Gemini app (it gives free users a few image generations a day) or ChatGPT.</li><li>Attach the picture and paste the prompt below. Ask for one view or pose at a time.</li><li>Upload the result here — it is saved in this character's gallery.</li></ol>
 <textarea class="cta" rows="9" id="asPrompt" readonly>${E(artPrompt())}</textarea><div class="acts"><button class="btn sm" type="button" id="asCopyP">Copy prompt</button><button class="btn ghost sm" type="button" data-png="one">Download front view (PNG)</button></div></div>
 <div class="anpanel"><h4>This character's saved artwork</h4><input type="file" accept="image/*" id="asArtUp" class="cin"><label class="ansel"><span>Label</span><input class="cin" id="asArtLab" placeholder="e.g. Front view — Gemini"></label>
 <div class="angal4">${(cur.images||[]).map((im,i)=>`<div class="anart"><img src="/_blob/${E(im.id)}" alt="${E(im.label)}"><span class="mt">${E(im.label)}</span><button class="btn ghost sm" type="button" data-artdel="${i}">Remove</button></div>`).join("")||`<p class="row">No uploaded artwork yet.</p>`}</div></div>`}
 box.innerHTML=h;if(sec==="profile")drawWho();preview()}
function artPrompt(){const p=flat(cur),P=cur.profile,O=outfit(cur);return `Create a high-quality 2D Japanese anime character illustration, full body from head to toe (do not crop head, hands or feet), clean line art, cel shading, professional colours, plain light background. Use the attached picture ONLY as the design reference for this ORIGINAL character — keep the same face, hairstyle, colours and outfit; do not copy any existing anime character.
Name: ${cur.name}${P.ageNum?`, age ${P.ageNum}`:""}. ${NICE.gender[p.gender]}, ${NICE.age[p.age]}, ${P.height} height${P.heightCm?` (${P.heightCm} cm)`:""}, ${P.build} build. Role: ${P.role}.
Personality: ${P.personality||"—"}. ${P.special?`Special features: ${P.special}.`:""}
Face: ${NICE.face[p.face]} face, ${NICE.eyes[p.eyes]} eyes (colour ${p.eyeColor}), skin tone ${p.skin}. Hair: ${NICE.hair[p.hair]}, colour ${p.hairColor}.${(cur.look.extras||[]).length?` Features: ${cur.look.extras.map(x=>XN[x]).join(", ")}.`:""}
Outfit "${O.name}": ${NICE.outfit[O.outfit]} in ${O.outfitColor} with ${O.accent} accents, ${O.bottomColor} trousers/bottom, ${O.shoeColor} shoes${(O.extras||[]).length?`, ${O.extras.map(x=>XN[x]).join(", ")}`:""}.
Pose: ${A.POSES[pose].n}. View: ${A.VIEWN[view]}. Expression: ${EXN[cur.expr]}. Indian (Telugu) setting.`}
function drawGallery(){const g=$("#asGal");if(!g)return;g.innerHTML=(LIST.length?LIST.map(c=>`<button type="button" class="ancard${cur.id===c.id?" on":""}" data-open="${c.id}">${A.draw(flat(c),null,{plain:true})}<b>${E(c.name)}</b>${c.locked?`<span class="mt">🔒 approved</span>`:""}</button>`).join(""):`<p class="row">No saved characters yet.</p>`)+`<button type="button" class="ancard add" id="asNew"><span style="font-size:42px">＋</span><b>New character</b></button>`}
function drawWho(){const ai=window.CFL_AI,s=$("#asWho");if(!s||!ai)return;const fam=window.CFL_FAM&&window.CFL_FAM.list?window.CFL_FAM.list():[];
 s.innerHTML=`<option value="">— none —</option><optgroup label="Main characters">${ai.ROLES.filter(r=>r[3]>=0).map(r=>`<option value="${E(r[0])}">${E(r[1])} · ${E(r[2])}</option>`).join("")}</optgroup>${fam.length?`<optgroup label="Family details">${fam.map(f=>`<option value="fam:${E(f[0])}">${E(f[1])} · ${E(f[2])}</option>`).join("")}</optgroup>`:""}`}
function profileOf(key){const ai=window.CFL_AI;if(!ai||!key)return "";if(key.startsWith("fam:"))return window.CFL_FAM?window.CFL_FAM.text(key.slice(4)):"";const r=ai.ROLES.find(x=>x[0]===key);if(!r)return "";const lib=window.SLANGLIB_GET?window.SLANGLIB_GET(r):"";const pr=ai.rpProfile(r);return pr+(lib&&lib!==pr?"\n"+lib.slice(0,2500):"")}
/* ---------- Claude ---------- */
function schema(){const O=A.OPT;return `gender: ${O.gender.join(", ")}
age: ${O.age.join(", ")} (college = young; parents = adult or old)
face: ${O.face.join(", ")}
skin: any hex (light #f6d7bf … dark #7f5236; Indian tones)
eyes: ${O.eyes.join(", ")}
eyeColor, hairColor: any hex
hair: ${O.hair.join(", ")}
idExtras (permanent features, 0–3): ${IDX.join(", ")}
outfit: ${O.outfit.join(", ")}
outfitColor, accent, bottomColor, shoeColor, bg: any hex
outfitExtras (0–3): ${OUTX.join(", ")}
expr (typical expression): ${O.expr.join(", ")}
build: slim, average, broad, chubby · height: short, average, tall`}
function pickJSON(j){const L={},O={};LOOK.forEach(k=>{const v=j[k];if(v==null)return;if(["skin","eyeColor","hairColor"].includes(k)){if(isHex(v))L[k]=v.toLowerCase()}else if(A.OPT[k].includes(v))L[k]=v});
 if(Array.isArray(j.idExtras))L.extras=j.idExtras.filter(x=>IDX.includes(x));
 if(A.OPT.outfit.includes(j.outfit))O.outfit=j.outfit;["outfitColor","accent","bottomColor","shoeColor"].forEach(k=>{if(isHex(j[k]))O[k]=j[k].toLowerCase()});if(Array.isArray(j.outfitExtras))O.extras=j.outfitExtras.filter(x=>OUTX.includes(x));return {L,O}}
function charText(){const P=cur.profile;return `Name: ${cur.name}; age ${P.ageNum||"?"}; role ${P.role}; height ${P.height}${P.heightCm?" ("+P.heightCm+" cm)":""}; build ${P.build}.
Personality: ${P.personality||"—"}
Background: ${P.background||"—"}
Special characteristics: ${P.special||"—"}`}
async function runAI(kind,btn){const ai=window.CFL_AI;if(!ai||!ai.ready()){msg("Claude isn't available in this view. Open the library in claude.ai.");return}if(ai.isBusy()){msg("Claude is busy with another job. Try again in a moment.");return}
 const cur0=JSON.stringify({look:cur.look,outfit:outfit(cur)});let prompt="",imgs=null;
 const base=`You design ORIGINAL 2D anime characters for a Telugu comedy/anime series. A drawing program draws the character from the settings you choose. Make the person look Indian (Telugu) in anime style with a fitting skin tone. Never copy a known anime, cartoon or film character's design.\n`;
 if(kind==="all"||kind==="face"||kind==="hair"||kind==="colours"){const who=$("#asWho")?$("#asWho").value:"",desc=($("#asDesc")&&$("#asDesc").value||"")+" "+($("#asReDesc")&&$("#asReDesc").value||"");
  prompt=base+`CHARACTER PROFILE:\n${charText()}\n${who?`LIBRARY PROFILE:\n${profileOf(who)}\n`:""}${desc.trim()?`USER'S REQUEST: ${desc.trim()}\n`:""}${kind!=="all"?`CURRENT DESIGN (keep everything; you are only redesigning the ${kind==="colours"?"colours (skin stays)":kind}): ${cur0}\n`:""}
Choose values:\n${schema()}\nAlso "name" (only if the profile has none) and "notes" (2 sentences: why these choices fit the personality).
Return ONLY JSON with these keys: {"gender":"","age":"","face":"","skin":"","eyes":"","eyeColor":"","hair":"","hairColor":"","idExtras":[],"outfit":"","outfitColor":"","accent":"","bottomColor":"","shoeColor":"","bg":"","outfitExtras":[],"expr":"","build":"","height":"","name":"","notes":""}`}
 if(kind==="outfit"){const d=($("#asODesc").value||"").trim()||btn.dataset.otype||"a new outfit";prompt=base+`CHARACTER PROFILE:\n${charText()}\nCURRENT LOOK (do not change): ${JSON.stringify(cur.look)}\nDesign this outfit: ${d}.\nChoose: outfit (${A.OPT.outfit.join(", ")}), outfitColor, accent, bottomColor, shoeColor (hex), outfitExtras (0–3 of ${OUTX.join(", ")}), and "outfitName" (short).\nReturn ONLY JSON: {"outfitName":"","outfit":"","outfitColor":"","accent":"","bottomColor":"","shoeColor":"","outfitExtras":[]}`}
 if(kind==="pose"){const d=($("#asPDesc").value||"").trim();if(!d){msg("Describe the pose first.");return}prompt=`Pick the closest match for this moment for an anime character: "${d}".\nPoses: ${Object.keys(A.POSES).map(k=>`${k} (${A.POSES[k].n})`).join(", ")}\nViews: ${A.VIEWS.join(", ")}\nExpressions: ${A.OPT.expr.join(", ")}\nBackgrounds: ${Object.keys(A.BGS).join(", ")}\nReturn ONLY JSON: {"pose":"","view":"","expr":"","bg":"","note":"one short sentence"}`}
 if(kind==="photo"){if(!photo){msg("Upload a picture first.");return}const keep=photo.keep||["hair","hairColor","face","skin"];
  prompt=base+`Look at the attached reference picture. Describe the visible appearance and turn it into settings for an ORIGINAL anime character (not a copy of the person).\nThe user wants to keep ONLY these features from the picture: ${keep.join(", ")}. Other settings should fit the profile instead.\nCHARACTER PROFILE:\n${charText()}\nChoose values:\n${schema()}\nAlso "seen" (one sentence describing what you see) and "notes".\nReturn ONLY JSON: {"seen":"","gender":"","age":"","face":"","skin":"","eyes":"","eyeColor":"","hair":"","hairColor":"","idExtras":[],"outfit":"","outfitColor":"","accent":"","bottomColor":"","shoeColor":"","outfitExtras":[],"notes":""}`;imgs=[photo.blob]}
 const t0=Date.now();if(btn)btn.disabled=true;const tk=setInterval(()=>msg(`Claude is working… ${Math.round((Date.now()-t0)/1000)}s`),1000);
 try{const res=imgs?await ai.vision(prompt,imgs):await ai.ask(prompt);const j=ai.parse(res.text);clearInterval(tk);const {L,O}=pickJSON(j);
  if(kind==="all"){Object.assign(cur.look,L);Object.assign(outfit(cur),O);if(isHex(j.bg))cur.bg=j.bg;if(A.OPT.expr.includes(j.expr))cur.expr=j.expr;if(["slim","average","broad","chubby"].includes(j.build))cur.profile.build=j.build;if(["short","average","tall"].includes(j.height))cur.profile.height=j.height;if(j.name&&(!cur.name||cur.name==="New character"))cur.name=String(j.name).slice(0,60);cur.notes=String(j.notes||"");msg(`Designed. ${cur.notes} Tap Save when you like it.`)}
  if(kind==="face"){["face","eyes","eyeColor"].forEach(k=>{if(L[k])cur.look[k]=L[k]});msg("New face — hair, skin, body and outfit unchanged.")}
  if(kind==="hair"){["hair","hairColor"].forEach(k=>{if(L[k])cur.look[k]=L[k]});msg("New hair — everything else unchanged.")}
  if(kind==="colours"){["eyeColor","hairColor"].forEach(k=>{if(L[k])cur.look[k]=L[k]});["outfitColor","accent","bottomColor","shoeColor"].forEach(k=>{if(O[k])outfit(cur)[k]=O[k]});if(isHex(j.bg))cur.bg=j.bg;msg("New colours — shapes unchanged.")}
  if(kind==="outfit"){const nO=Object.assign({id:"o"+Date.now(),name:String(j.outfitName||btn&&btn.dataset.otype||"New outfit").slice(0,40),outfit:"tshirt",outfitColor:"#2f3863",accent:"#c8902a",bottomColor:"#2e3a5c",shoeColor:"#1d1d24",extras:[]},O);cur.outfits.push(nO);cur.oi=cur.outfits.length-1;msg(`Added outfit “${nO.name}”. Face and body unchanged.`)}
  if(kind==="pose"){if(A.POSES[j.pose])pose=j.pose;if(A.VIEWS.includes(j.view))view=j.view;if(A.OPT.expr.includes(j.expr))cur.expr=j.expr;if(A.BGS[j.bg])cur.bgScene=j.bg;msg(`Closest match: ${A.POSES[pose].n}, ${A.VIEWN[view]}, ${EXN[cur.expr]}. ${j.note||""}`);sec="scene"}
  if(kind==="photo"){const keep=photo.keep||[];const map={hair:["hair"],hairColor:["hairColor"],face:["face"],skin:["skin"],eyes:["eyes","eyeColor"]};
   Object.entries(map).forEach(([g,ks])=>{if(keep.includes(g))ks.forEach(k=>{if(L[k])cur.look[k]=L[k]})});
   if(keep.includes("facial")&&L.extras)cur.look.extras=[...new Set(cur.look.extras.filter(x=>!["beard","mustache","glasses"].includes(x)).concat(L.extras.filter(x=>["beard","mustache","glasses"].includes(x))))];
   if(keep.includes("outfit")&&O.outfit)outfit(cur).outfit=O.outfit;if(keep.includes("colours"))["outfitColor","accent","bottomColor","shoeColor"].forEach(k=>{if(O[k])outfit(cur)[k]=O[k]});
   cur.notes=String(j.notes||"");msg(`Claude saw: ${j.seen||"—"} Only the ticked features were used.`)}
  drawSec()}
 catch(err){clearInterval(tk);msg(err&&err.code?ai.errText(err):(err&&err.message)||"Something went wrong. Try again.")}
 if(btn)btn.disabled=false}
/* ---------- export ---------- */
const fn=(x)=>`${(cur.name||"character").replace(/[^\wఀ-౿ -]+/g,"").trim().replace(/\s+/g,"-")||"character"}-${x}.png`;
let dl=null;async function getDl(){if(dl)return dl;try{for(let i=0;i<50&&!window.claude&&window.parent!==window;i++)await new Promise(r=>setTimeout(r,100));dl=window.claude&&window.parent!==window?await window.claude.use("downloads"):null}catch(e){dl=null}return dl}
async function saveBlob(blob,name){const d=await getDl();try{if(d&&d.save){await d.save({filename:name,data:blob});msg("Saved: "+name)}else{const u=URL.createObjectURL(blob);const a=document.createElement("a");a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);msg("Downloaded: "+name)}}catch(e){msg(e&&e.code==="declined"?"Download cancelled.":"The download was blocked here.")}}
async function svgToPng(svg,w,h,name){msg("Preparing the picture…");const sc=Math.min(2,4000/Math.max(w,h));const cv=document.createElement("canvas");cv.width=Math.round(w*sc);cv.height=Math.round(h*sc);const g=cv.getContext("2d");g.fillStyle="#fff";g.fillRect(0,0,cv.width,cv.height);
 const img=new Image();const u=URL.createObjectURL(new Blob([svg.replace("<svg ",`<svg width="${cv.width}" height="${cv.height}" `)],{type:"image/svg+xml"}));
 try{await new Promise((ok,no)=>{img.onload=ok;img.onerror=no;img.src=u});g.drawImage(img,0,0,cv.width,cv.height)}catch(e){msg("Couldn't draw the picture.");return}finally{URL.revokeObjectURL(u)}
 const blob=await new Promise(r=>cv.toBlob(r,"image/png"));await saveBlob(blob,name)}
const nest=(svg,x,y,w,h)=>svg.replace("<svg ",`<svg x="${x}" y="${y}" width="${w}" height="${h}" `);
function gridSvg(cells,cols,cw,ch,title){const rows=Math.ceil(cells.length/cols),top=title?70:0,W=cols*cw,H=rows*ch+top;let o=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#fff"/>${title?`<text x="24" y="48" font-family="Arial" font-size="34" font-weight="700" fill="#1d1d24">${E(title)}</text>`:""}`;cells.forEach((c,i)=>o+=nest(c,(i%cols)*cw,top+Math.floor(i/cols)*ch,cw-8,ch-8));return [o+"</svg>",W,H]}
function sheetSvg(){const p=flat(cur),P=cur.profile,O=outfit(cur),W=2400,H=2000;let o=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#f7f6f2"/><rect x="0" y="0" width="${W}" height="120" fill="#2f3863"/><text x="40" y="80" font-family="Arial" font-size="56" font-weight="800" fill="#fff">${E(cur.name)}</text><text x="${W-40}" y="80" text-anchor="end" font-family="Arial" font-size="34" fill="#dfe5f5">${E([P.ageNum?`Age ${P.ageNum}`:"",P.role,P.height+" height",P.build+" build"].filter(Boolean).join(" · "))} · CHARACTER REFERENCE SHEET</text>`;
 ["front","three","side","back"].forEach((v,i)=>o+=nest(A.drawFull(p,{view:v,bg:"plain",base:cur.bg,label:A.VIEWN[v]}),40+i*370,150,350,700));
 o+=`<text x="1540" y="190" font-family="Arial" font-size="32" font-weight="700" fill="#1d1d24">Expressions</text>`;["happy","laugh","angry","sad","shock","confident","shy","serious","evil"].forEach((x,i)=>o+=nest(A.draw(p,x,{label:EXN[x]}),1540+(i%3)*280,210+Math.floor(i/3)*300,270,290));
 o+=`<text x="40" y="910" font-family="Arial" font-size="32" font-weight="700" fill="#1d1d24">Poses</text>`;["walk","sit","talk","fight","think","pockets"].forEach((k,i)=>o+=nest(A.drawFull(p,{view:A.POSES[k].best||"front",pose:k,bg:"plain",base:cur.bg,label:A.POSES[k].n}),40+i*250,930,240,480));
 const pal=[["Skin",p.skin],["Hair",p.hairColor],["Eyes",p.eyeColor],["Outfit",O.outfitColor],["Accent",O.accent],["Bottom",O.bottomColor],["Shoes",O.shoeColor]];
 o+=`<text x="1540" y="1150" font-family="Arial" font-size="32" font-weight="700" fill="#1d1d24">Colour palette</text>`+pal.map((c,i)=>`<rect x="${1540+(i%4)*210}" y="${1170+Math.floor(i/4)*120}" width="90" height="90" rx="12" fill="${c[1]}" stroke="#999" stroke-width="2"/><text x="${1640+(i%4)*210}" y="${1210+Math.floor(i/4)*120}" font-family="Arial" font-size="24" fill="#333">${c[0]}</text><text x="${1640+(i%4)*210}" y="${1240+Math.floor(i/4)*120}" font-family="Arial" font-size="20" fill="#777">${c[1]}</text>`).join("");
 const lines=[`Outfit: ${O.name} — ${NICE.outfit[O.outfit]}`,`Accessories: ${(p.extras||[]).map(x=>XN[x]).join(", ")||"none"}`,`Face: ${NICE.face[p.face]} · Eyes: ${NICE.eyes[p.eyes]} · Hair: ${NICE.hair[p.hair]}`,`Personality: ${P.personality||"—"}`,`Special: ${P.special||"—"}`];
 o+=`<text x="1540" y="1460" font-family="Arial" font-size="32" font-weight="700" fill="#1d1d24">Design notes</text>`+lines.map((t,i)=>`<text x="1540" y="${1510+i*46}" font-family="Arial" font-size="26" fill="#333">${E(t.length>60?t.slice(0,58)+"…":t)}</text>`).join("");
 o+=`<text x="${W-40}" y="${H-30}" text-anchor="end" font-family="Arial" font-size="22" fill="#999">${new Date().toLocaleDateString()} · ${cur.locked?"Approved design (identity locked)":"Draft design"}</text></svg>`;return [o,W,H]}
/* ---------- events ---------- */
function inStudio(t){return t.closest&&t.closest("#v-anime")}
document.addEventListener("input",e=>{const t=e.target;if(!inStudio(t))return;
 if(t.dataset.pf==="name"){cur.name=t.value;preview()}else if(t.dataset.pr){cur.profile[t.dataset.pr]=t.value;if(["height","build"].includes(t.dataset.pr))preview()}else if(t.dataset.on){outfit(cur).name=t.value}});
document.addEventListener("change",async e=>{const t=e.target;if(!inStudio(t))return;
 if(t.dataset.lk){cur.look[t.dataset.lk]=t.value;preview()}
 if(t.dataset.ok){outfit(cur)[t.dataset.ok]=t.value;drawSec()}
 if(t.dataset.col){if(t.dataset.col==="bg")cur.bg=t.value;else cur.look[t.dataset.col]=t.value;drawSec()}
 if(t.dataset.ocol){outfit(cur)[t.dataset.ocol]=t.value;drawSec()}
 if(t.id==="asBg"){cur.bgScene=t.value;preview()}if(t.id==="asView"){view=t.value;preview()}if(t.id==="asPose"){pose=t.value;preview()}if(t.id==="asExpr"){cur.expr=t.value;preview()}
 if(t.id==="asPhoto"&&t.files[0]){const f=t.files[0];const blob=await shrink(f,1024);photo={blob,url:URL.createObjectURL(blob),keep:["hair","hairColor","face","skin"]};drawSec();msg("Picture ready. Tick the features to keep, then tap Analyse.")}
 if(t.id==="asArtUp"&&t.files[0]){await uploadArt(t.files[0])}});
async function shrink(file,max){const img=new Image();const u=URL.createObjectURL(file);await new Promise((ok,no)=>{img.onload=ok;img.onerror=no;img.src=u});const s=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement("canvas");c.width=Math.round(img.width*s);c.height=Math.round(img.height*s);c.getContext("2d").drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);return await new Promise(r=>c.toBlob(r,"image/jpeg",.88))}
async function uploadArt(file){if(!assets){msg("Uploading artwork works in the library on claude.ai (it needs your account's file storage).");return}if(!cur.id)save(true);msg("Uploading…");
 try{const blob=await shrink(file,2048);const r=await assets.upload(blob);cur.images=(cur.images||[]).concat({id:r.id,label:($("#asArtLab").value||"").trim()||"Artwork "+new Date().toLocaleDateString(),t:Date.now()});save(true);drawSec();msg("Artwork saved to this character.")}catch(e){msg("Upload failed: "+((e&&e.message)||"try again"))}}
document.addEventListener("click",async e=>{const t=e.target;if(!inStudio(t))return;const c=k=>t.closest(k);let b;
 if(b=c("[data-sec]")){sec=b.dataset.sec;drawSec();return}
 if(b=c("[data-open]")){const x=LIST.find(v=>v.id===b.dataset.open);if(x){cur=JSON.parse(JSON.stringify(x));view="front";pose="stand";drawSec();drawGallery();msg(`Opened ${x.name}.`);$("#asStudio").scrollIntoView({behavior:"smooth",block:"start"})}return}
 if(t.closest("#asNew")){cur=blank();sec="profile";drawSec();drawGallery();msg("New character. Fill in the profile, then design it.");return}
 if(b=c("[data-sw]")){if(b.dataset.sw==="bg")cur.bg=b.dataset.v;else cur.look[b.dataset.sw]=b.dataset.v;drawSec();return}
 if(b=c("[data-osw]")){outfit(cur)[b.dataset.osw]=b.dataset.v;drawSec();return}
 if(b=c("[data-ix]")){const k=b.dataset.ix,x=cur.look.extras;cur.look.extras=x.includes(k)?x.filter(v=>v!==k):x.concat(k);drawSec();return}
 if(b=c("[data-ox]")){const k=b.dataset.ox,O=outfit(cur),x=O.extras||[];O.extras=x.includes(k)?x.filter(v=>v!==k):x.concat(k);drawSec();return}
 if(b=c("[data-oi]")){cur.oi=+b.dataset.oi;drawSec();return}
 if(t.id==="asOAdd"){cur.outfits.push({id:"o"+Date.now(),name:"Outfit "+(cur.outfits.length+1),outfit:"tshirt",outfitColor:"#2f3863",accent:"#c8902a",bottomColor:"#2e3a5c",shoeColor:"#1d1d24",extras:[]});cur.oi=cur.outfits.length-1;drawSec();return}
 if(t.id==="asODup"){const o=JSON.parse(JSON.stringify(outfit(cur)));o.id="o"+Date.now();o.name+=" (copy)";cur.outfits.push(o);cur.oi=cur.outfits.length-1;drawSec();return}
 if(t.id==="asODel"&&cur.outfits.length>1){cur.outfits.splice(cur.oi,1);cur.oi=0;drawSec();return}
 if(b=c("[data-otype]")){$("#asODesc").value=b.dataset.otype;return}
 if(b=c("[data-ai]")){await runAI(b.dataset.ai,b);return}
 if(b=c("[data-keep]")){photo=photo||{keep:["hair","hairColor","face","skin"]};const k=b.dataset.keep;photo.keep=(photo.keep||[]).includes(k)?photo.keep.filter(v=>v!==k):(photo.keep||[]).concat(k);b.setAttribute("aria-pressed",photo.keep.includes(k));return}
 if(t.id==="asRandom"){const r=k=>A.OPT[k][Math.floor(Math.random()*A.OPT[k].length)];Object.assign(cur.look,{gender:r("gender"),age:r("age"),face:r("face"),skin:r("skin"),eyes:r("eyes"),eyeColor:r("eyeColor"),hair:r("hair"),hairColor:r("hairColor")});Object.assign(outfit(cur),{outfit:r("outfit"),outfitColor:r("outfitColor"),accent:r("accent")});drawSec();return}
 if(b=c("[data-restore]")){const v=cur.versions[+b.dataset.restore];if(v){cur.look=JSON.parse(JSON.stringify(v.look));drawSec();msg("Restored that version. Tap Save to keep it.")}return}
 if(b=c("[data-vpose]")){pose=b.dataset.vpose;drawSec();return}
 if(b=c("[data-dex]")){cur.expr=b.dataset.dex;drawSec();return}
 if(b=c("[data-pp]")){pose=b.dataset.pp;view=A.POSES[pose].best||"front";drawSec();return}
 if(b=c("[data-gp]")){const g=window.__asG=window.__asG||[];const id=b.dataset.gp;window.__asG=g.includes(id)?g.filter(v=>v!==id):g.concat(id).slice(-4);b.setAttribute("aria-pressed",window.__asG.includes(id));return}
 if(t.id==="asGroup"){const ids=window.__asG||[];if(ids.length<2){msg("Pick at least two characters.");return}const cs=ids.map(id=>LIST.find(v=>v.id===id)).filter(Boolean);const svg=A.group(cs.map(x=>({p:flat(x),view:"three",pose:"stand",expr:x.expr})),{bg:cur.bgScene&&cur.bgScene!=="none"&&cur.bgScene!=="plain"?cur.bgScene:"campus"});$("#asGroupOut").innerHTML=`<div class="angroup">${svg}</div><div class="acts"><button class="btn sm" type="button" id="asGroupPng">Download group picture (PNG)</button></div>`;window.__asGS=svg;return}
 if(t.id==="asGroupPng"&&window.__asGS){const m=window.__asGS.match(/viewBox="0 0 (\d+) (\d+)"/);await svgToPng(window.__asGS,+m[1],+m[2],fn("group"));return}
 if(t.id==="asSheet"){const [s,W,H]=sheetSvg();$("#asSheetOut").innerHTML=`<div class="ansheetbig">${s}</div><div class="acts"><button class="btn" type="button" id="asSheetPng">Download reference sheet (PNG)</button></div>`;window.__asSheet=[s,W,H];return}
 if(t.id==="asSheetPng"&&window.__asSheet){const [s,W,H]=window.__asSheet;await svgToPng(s,W,H,fn("reference-sheet"));return}
 if(b=c("[data-png]")){const k=b.dataset.png,p=flat(cur);
  if(k==="one"){await svgToPng(A.drawFull(p,{view,pose,bg:cur.bgScene||"plain",base:cur.bg,label:cur.name}),400,800,fn(`${pose}-${view}`))}
  if(k==="views"){const [s,W,H]=gridSvg(A.VIEWS.map(v=>A.drawFull(p,{view:v,pose,bg:"plain",base:cur.bg,label:A.VIEWN[v]})),6,400,800,`${cur.name} — turnaround`);await svgToPng(s,W,H,fn("turnaround"))}
  if(k==="expr"){const [s,W,H]=gridSvg(A.EXPR.map(x=>A.draw(p,x,{label:EXN[x]})),7,400,500,`${cur.name} — expressions`);await svgToPng(s,W,H,fn("expressions"))}
  if(k==="poses"){const ks=Object.keys(A.POSES);const [s,W,H]=gridSvg(ks.map(x=>A.drawFull(p,{view:A.POSES[x].best||"front",pose:x,bg:"plain",base:cur.bg,label:A.POSES[x].n})),7,400,800,`${cur.name} — poses`);await svgToPng(s,W,H,fn("poses"))}
  return}
 if(t.id==="asCopyP"){try{await (window.copyAny||navigator.clipboard.writeText.bind(navigator.clipboard))($("#asPrompt").value);msg("Prompt copied.")}catch(_){$("#asPrompt").select();msg("Select the prompt and copy it.")}return}
 if(b=c("[data-artdel]")){cur.images.splice(+b.dataset.artdel,1);save(true);drawSec();msg("Removed from this character (the file stays in your storage).");return}
 if(t.id==="asSave"){save();drawSec();return}
 if(t.id==="asLock"){if(!cur.locked){cur.locked=true;save(true);drawSec();msg(`${cur.name} approved — identity locked. New outfits, poses, expressions and backgrounds keep this exact face, hair, skin and body.`)}else{msg("Already approved. Use Unlock in Appearance to edit the face.")}return}
 if(t.id==="asUnlock"){cur.locked=false;drawSec();msg("Unlocked. Your changes are saved as a new version when you tap Save.");return}
 if(t.id==="asDup"){const d=JSON.parse(JSON.stringify(cur));d.id=uid();d.name=(cur.name||"Character")+" (copy)";d.locked=false;cur=d;save(true);drawSec();msg("Duplicated. You're now editing the copy.");return}
 if(t.id==="asDel"){if(!cur.id){msg("This character isn't saved yet.");return}if(!t.dataset.sure){t.dataset.sure="1";t.textContent="Tap again to delete";setTimeout(()=>{t.dataset.sure="";t.textContent="Delete"},3000);return}DEL.push(cur.id);LIST=LIST.filter(v=>v.id!==cur.id);saveLocal();pushCloud();cur=LIST[0]?JSON.parse(JSON.stringify(LIST[0])):blank();drawSec();drawGallery();msg("Deleted.");return}
});
function init(){if(!$("#v-anime"))return;drawSec();drawGallery();const nav=document.querySelector('nav a[data-v="anime"]');if(nav)nav.addEventListener("click",()=>setTimeout(()=>{if(sec==="profile")drawWho()},60))}
init();
(async()=>{if(window.parent===window)return;try{for(let i=0;i<50&&!window.claude;i++)await new Promise(r=>setTimeout(r,100));if(!window.claude)return;
 try{assets=await window.claude.use("assets")}catch(e){assets=null}
 const db=await window.claude.use("db"),u=await window.claude.use("user"),id=u?await u.id():null;if(!db||!id)return;
 cloud=db.collection("data/users/"+id).doc("anime");const d=await cloud.get();const r=d&&d.exists!==false&&(typeof d.data==="function"?d.data():d)||null;
 const RD=(r&&r.del)||[];DEL=[...new Set(DEL.concat(RD))];const R=((r&&r.list)||[]).map(migrate).filter(c=>!DEL.includes(c.id));const before=JSON.stringify(LIST.map(c=>c.id));LIST=LIST.filter(c=>!DEL.includes(c.id));
 const map=new Map(LIST.map(c=>[c.id,c]));let mine=false;R.forEach(c=>{const a=map.get(c.id);if(!a||(c.t||0)>(a.t||0))map.set(c.id,c)});LIST.forEach(c=>{const b=R.find(x=>x.id===c.id);if(!b||(c.t||0)>(b.t||0))mine=true});
 LIST=[...map.values()].sort((a,b)=>(b.t||0)-(a.t||0));saveLocal();if(JSON.stringify(LIST.map(c=>c.id))!==before){if(!cur.id&&LIST[0])cur=JSON.parse(JSON.stringify(LIST[0]));drawGallery();drawSec()}if(mine||R.length!==LIST.length||!(r&&r.v===2))pushCloud()}catch(e){}})();
})();
