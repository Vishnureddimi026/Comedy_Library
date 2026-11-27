/* ===== Anime full-body rig: views, poses, backgrounds, groups ===== */
(function(){
const A=window.ANIME;
const sh=(hex,a)=>{const n=parseInt(String(hex||"#888888").slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(a<0?v*(1+a):v+(255-v)*a)));return "#"+[f(r),f(g),f(b)].map(v=>v.toString(16).padStart(2,"0")).join("")};
const R=Math.PI/180,pt=(x,y,len,a)=>[x+Math.sin(a*R)*len,y+Math.cos(a*R)*len];
const VIEWS=["front","three","side","back","side2","threeback"];
const VIEWN={front:"Front · 0°",three:"Three-quarter · 45°",side:"Side · 90°",back:"Back · 180°",side2:"Other side · 270°",threeback:"Three-quarter back"};
/* pose: front angles (deg, 0=down, + toward viewer's right) for left arm (la1 upper, la2 forearm), right arm, left leg, right leg;
   side angles (s): near arm a1/a2, far arm b1/b2, near leg l1/l2, far leg m1/m2 (+ = forward); y offset; sit; props */
const POSES={
 stand:{n:"Standing",la:[-8,-3],ra:[8,3],ll:[-3,-1],rl:[3,1],s:{a:[-4,4],b:[4,8],l:[2,0],m:[-2,-2]}},
 walk:{n:"Walking",la:[-12,-6],ra:[12,20],ll:[-6,-2],rl:[8,-4],lift:"r",s:{a:[-24,-8],b:[24,40],l:[22,-2],m:[-18,-30]},best:"side"},
 run:{n:"Running",la:[-30,40],ra:[30,-40],ll:[-10,-4],rl:[14,-30],lift:"r",y:-10,s:{a:[-45,40],b:[45,110],l:[50,-5],m:[-30,-70]},lean:8,best:"side",fx:"speed"},
 sit:{n:"Sitting",la:[-10,30],ra:[10,-30],ll:[-6,-2],rl:[6,2],sit:true,s:{a:[10,60],b:[14,70],l:[90,0],m:[88,-4]},best:"three"},
 study:{n:"Studying",la:[-4,60],ra:[4,-60],ll:[-6,-2],rl:[6,2],sit:true,prop:"book",s:{a:[20,110],b:[24,116],l:[90,0],m:[88,-4]},best:"three"},
 talk:{n:"Talking",la:[-8,-3],ra:[40,140],ll:[-4,-1],rl:[5,2],fx:"talk",s:{a:[30,120],b:[4,8],l:[3,0],m:[-3,-2]}},
 laugh:{n:"Laughing",la:[-6,70],ra:[6,-70],ll:[-5,-2],rl:[5,2],lean:-6,s:{a:[10,80],b:[14,86],l:[4,0],m:[-4,-2]}},
 fight:{n:"Fighting",la:[-28,170],ra:[34,-165],ll:[-20,-12],rl:[20,12],fx:"fight",s:{a:[60,150],b:[40,160],l:[24,6],m:[-26,-10]},best:"three"},
 jump:{n:"Jumping",la:[-140,-160],ra:[140,160],ll:[-24,30],rl:[24,-30],y:-40,s:{a:[150,170],b:[140,160],l:[50,-40],m:[30,-60]},fx:"jump"},
 think:{n:"Thinking",la:[-4,70],ra:[-18,-168],ll:[-3,-1],rl:[4,1],fx:"think",s:{a:[10,175],b:[20,90],l:[2,0],m:[-2,-2]}},
 lookback:{n:"Looking backwards",la:[-8,-3],ra:[8,3],ll:[-3,-1],rl:[3,1],look:true,s:{a:[-4,4],b:[4,8],l:[2,0],m:[-2,-2]},best:"back"},
 pockets:{n:"Hands in pockets",la:[-14,18],ra:[14,-18],ll:[-6,-2],rl:[6,2],pockets:true,s:{a:[-8,16],b:[-6,18],l:[4,0],m:[-6,-4]}},
 relaxed:{n:"Relaxed (hand behind head)",la:[-14,18],ra:[150,-120],ll:[-4,-1],rl:[8,14],pockets:"l",s:{a:[160,-60],b:[-6,18],l:[4,0],m:[-6,-4]},best:"three"}
};
const BGS={none:"No background",plain:"Plain colour",campus:"College campus",classroom:"Classroom",corridor:"College corridor",canteen:"Canteen",bedroom:"Bedroom",home:"Home (living room)",street:"Street",park:"Park",city:"City at night",village:"Village",fantasy:"Fantasy"};
function bgArt(k,W,H,base){const sky=(a,b)=>`<defs><linearGradient id="bgs${k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#bgs${k})"/>`;const gy=H*.78;
 const win=(x,y,w,h,c)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${c||"#cfe8f7"}" stroke="#8a7a6a" stroke-width="4"/><path d="M${x+w/2} ${y} V${y+h} M${x} ${y+h/2} H${x+w}" stroke="#8a7a6a" stroke-width="3"/>`;
 switch(k){
 case "none":return `<rect width="${W}" height="${H}" fill="#ffffff"/>`;
 case "plain":return sky(sh(base||"#dfe5f5",.3),sh(base||"#dfe5f5",-.06));
 case "campus":return sky("#9fd3f5","#e4f4fb")+`<circle cx="${W*.82}" cy="${H*.14}" r="34" fill="#fff3b0"/><rect x="${W*.08}" y="${H*.28}" width="${W*.84}" height="${H*.5}" fill="#e9dcc4" stroke="#b9a37f" stroke-width="5"/><path d="M${W*.04} ${H*.3} L${W*.5} ${H*.16} L${W*.96} ${H*.3}Z" fill="#b5523b" stroke="#7a3424" stroke-width="5"/>${[.16,.34,.58,.76].map(f=>win(W*f,H*.36,W*.12,H*.12)).join("")}<rect x="${W*.44}" y="${H*.54}" width="${W*.12}" height="${H*.24}" fill="#7a5a3a" stroke="#4a3420" stroke-width="4"/><text x="${W*.5}" y="${H*.33}" text-anchor="middle" font-family="Arial Black,Arial" font-size="${W*.04}" fill="#7a3424">COLLEGE</text><rect y="${gy}" width="${W}" height="${H-gy}" fill="#8fc46a"/><path d="M0 ${gy} H${W}" stroke="#6a9c4a" stroke-width="5"/>`+tree(W*.06,gy,1)+tree(W*.94,gy,.9);
 case "classroom":return sky("#f3ead6","#e9dcc0")+`<rect x="${W*.1}" y="${H*.12}" width="${W*.8}" height="${H*.3}" rx="6" fill="#2f5a46" stroke="#7a5a3a" stroke-width="10"/><text x="${W*.18}" y="${H*.22}" font-family="Comic Sans MS,Arial" font-size="${W*.04}" fill="#e8f3ec">x² + 2x + 1 = 0</text><path d="M${W*.6} ${H*.32} q20 -30 40 0 t40 0" stroke="#e8f3ec" stroke-width="3" fill="none"/><rect y="${gy}" width="${W}" height="${H-gy}" fill="#c9a77a"/>${[.12,.5,.86].map(f=>`<rect x="${W*f-46}" y="${gy-46}" width="92" height="16" fill="#8a5a2b" stroke="#5a3a1a" stroke-width="3"/><rect x="${W*f-40}" y="${gy-30}" width="8" height="30" fill="#5a3a1a"/><rect x="${W*f+32}" y="${gy-30}" width="8" height="30" fill="#5a3a1a"/>`).join("")}`;
 case "corridor":return sky("#efe7d8","#ddd2bd")+`<path d="M0 ${H*.1} L${W*.36} ${H*.36} L${W*.64} ${H*.36} L${W} ${H*.1}" fill="none" stroke="#b9a37f" stroke-width="5"/><path d="M0 ${gy} L${W*.36} ${H*.62} L${W*.64} ${H*.62} L${W} ${gy}Z" fill="#c9b48f"/><rect x="${W*.36}" y="${H*.36}" width="${W*.28}" height="${H*.26}" fill="#f7f2e6" stroke="#b9a37f" stroke-width="4"/>${[0,1,2].map(i=>`<rect x="${W*(.04+i*.1)}" y="${H*(.3+i*.03)}" width="${W*.07}" height="${H*(.36-i*.05)}" fill="#7a5a3a" opacity=".85"/>`).join("")}${[0,1,2].map(i=>`<rect x="${W*(.89-i*.1)}" y="${H*(.3+i*.03)}" width="${W*.07}" height="${H*(.36-i*.05)}" fill="#3b82c4" opacity=".6"/>`).join("")}<rect y="${gy}" width="${W}" height="${H-gy}" fill="#b9a37f"/>`;
 case "canteen":return sky("#fbe7c8","#f1d3a6")+`<rect x="${W*.06}" y="${H*.14}" width="${W*.5}" height="${H*.14}" rx="8" fill="#b5523b"/><text x="${W*.31}" y="${H*.23}" text-anchor="middle" font-family="Arial Black,Arial" font-size="${W*.045}" fill="#fff4c9">CANTEEN · టీ ₹10</text><rect x="${W*.62}" y="${H*.12}" width="${W*.3}" height="${H*.3}" rx="8" fill="#fff" stroke="#c8902a" stroke-width="5"/><text x="${W*.77}" y="${H*.2}" text-anchor="middle" font-family="Arial" font-weight="700" font-size="${W*.032}" fill="#7a3424">MENU</text><text x="${W*.77}" y="${H*.27}" text-anchor="middle" font-family="Arial" font-size="${W*.028}" fill="#5a3a1a">Samosa · Biryani</text><rect y="${gy}" width="${W}" height="${H-gy}" fill="#d9b98a"/><rect x="${W*.05}" y="${gy-70}" width="${W*.9}" height="20" fill="#8a5a2b"/>${[.15,.45,.75].map(f=>`<circle cx="${W*f}" cy="${gy-80}" r="10" fill="#fff" stroke="#999" stroke-width="2"/>`).join("")}`;
 case "bedroom":return sky("#e7def5","#d6c9ec")+win(W*.62,H*.12,W*.26,H*.24,"#2b3a6b")+`<circle cx="${W*.72}" cy="${H*.2}" r="12" fill="#fff6c9"/><rect x="${W*.06}" y="${H*.16}" width="${W*.2}" height="${H*.14}" fill="#fff" stroke="#c2417a" stroke-width="4"/><text x="${W*.16}" y="${H*.25}" text-anchor="middle" font-family="Arial Black" font-size="${W*.04}" fill="#c2417a">DJ</text><rect y="${gy}" width="${W}" height="${H-gy}" fill="#b08968"/><rect x="${W*.02}" y="${gy-60}" width="${W*.44}" height="60" rx="10" fill="#6b3fa0"/><rect x="${W*.02}" y="${gy-80}" width="${W*.12}" height="30" rx="10" fill="#fff"/>`;
 case "home":return sky("#f6ecd8","#ead9b8")+win(W*.08,H*.12,W*.22,H*.22)+`<rect x="${W*.4}" y="${H*.1}" width="${W*.2}" height="${H*.14}" fill="#fff" stroke="#c8902a" stroke-width="5"/><circle cx="${W*.5}" cy="${H*.17}" r="${W*.04}" fill="#f2c94c"/><rect x="${W*.68}" y="${H*.16}" width="${W*.26}" height="${H*.18}" rx="4" fill="#1d1d24" stroke="#555" stroke-width="5"/><rect y="${gy}" width="${W}" height="${H-gy}" fill="#c9a77a"/><path d="M${W*.06} ${gy} q${W*.2} -90 ${W*.42} 0" fill="#b5523b" opacity=".9"/>`;
 case "street":return sky("#a6d8f5","#e9f6fb")+[.02,.22,.46,.7].map((f,i)=>`<rect x="${W*f}" y="${H*(.18+i%2*.06)}" width="${W*.2}" height="${H*(.6-i%2*.06)}" fill="${["#e8c99a","#c9d6e8","#f2c4b0","#d6e8c9"][i]}" stroke="#8a7a6a" stroke-width="4"/>${win(W*f+W*.04,H*(.26+i%2*.06),W*.12,H*.1)}`).join("")+`<rect y="${gy}" width="${W}" height="${H-gy}" fill="#6b6b74"/><path d="M0 ${gy+(H-gy)/2} H${W}" stroke="#f2f2f2" stroke-width="6" stroke-dasharray="30 22"/><rect x="${W*.9}" y="${H*.3}" width="8" height="${gy-H*.3}" fill="#444"/><circle cx="${W*.9+4}" cy="${H*.3}" r="14" fill="#f2c94c"/>`;
 case "park":return sky("#9fd3f5","#e4f4fb")+`<circle cx="${W*.15}" cy="${H*.14}" r="30" fill="#fff3b0"/><path d="M0 ${H*.6} Q${W*.3} ${H*.46} ${W*.6} ${H*.58} T${W} ${H*.54} V${gy} H0Z" fill="#a8d88a"/><rect y="${gy}" width="${W}" height="${H-gy}" fill="#7fb85a"/>`+tree(W*.18,gy,1.2)+tree(W*.82,gy,1)+`<rect x="${W*.52}" y="${gy-40}" width="${W*.3}" height="12" fill="#8a5a2b"/><rect x="${W*.54}" y="${gy-28}" width="8" height="28" fill="#5a3a1a"/><rect x="${W*.78}" y="${gy-28}" width="8" height="28" fill="#5a3a1a"/>`;
 case "city":return sky("#1f2438","#3b3f66")+`<circle cx="${W*.8}" cy="${H*.12}" r="26" fill="#f4efd0"/>`+[0,1,2,3,4,5].map(i=>{const x=W*i/6,h=H*(.3+((i*37)%5)*.06);return `<rect x="${x}" y="${gy-h}" width="${W/6-6}" height="${h}" fill="${["#2c3150","#343a5e","#272b46"][i%3]}"/>`+[0,1,2,3,4].map(j=>`<rect x="${x+10+(j%2)*24}" y="${gy-h+16+j*30}" width="14" height="14" fill="${(i+j)%3?"#f2c94c":"#444a70"}"/>`).join("")}).join("")+`<rect y="${gy}" width="${W}" height="${H-gy}" fill="#2a2a33"/>`;
 case "village":return sky("#ffd8a8","#fff1d6")+`<circle cx="${W*.5}" cy="${H*.3}" r="40" fill="#ffb347" opacity=".9"/><path d="M0 ${H*.56} Q${W*.25} ${H*.44} ${W*.5} ${H*.56} T${W} ${H*.52} V${gy} H0Z" fill="#9cc97a"/><rect y="${gy}" width="${W}" height="${H-gy}" fill="#c99a6a"/><rect x="${W*.06}" y="${H*.46}" width="${W*.26}" height="${gy-H*.46}" fill="#e9d2a8" stroke="#8a6a3a" stroke-width="4"/><path d="M${W*.02} ${H*.48} L${W*.19} ${H*.34} L${W*.36} ${H*.48}Z" fill="#a8823a" stroke="#6a4a1a" stroke-width="4"/>`+tree(W*.88,gy,1.1).replace(/#3f8a4a/g,"#2f7a3a");
 case "fantasy":return sky("#3b2b6b","#c07ad8")+[...Array(14)].map((_,i)=>`<circle cx="${(i*73)%W}" cy="${(i*41)%(H*.5)}" r="${2+i%3}" fill="#fff" opacity=".8"/>`).join("")+`<path d="M${W*.1} ${gy} L${W*.22} ${H*.3} L${W*.34} ${gy}Z M${W*.62} ${gy} L${W*.78} ${H*.22} L${W*.94} ${gy}Z" fill="#5a3a8a" stroke="#2b1a4a" stroke-width="5"/><circle cx="${W*.5}" cy="${H*.22}" r="30" fill="#f7e9ff" opacity=".9"/><rect y="${gy}" width="${W}" height="${H-gy}" fill="#4a2b6b"/>`;
 }return sky("#dfe5f5","#eef2fb")}
function tree(x,gy,s){return `<rect x="${x-8*s}" y="${gy-90*s}" width="${16*s}" height="${90*s}" fill="#7a5a3a"/><circle cx="${x}" cy="${gy-110*s}" r="${46*s}" fill="#3f8a4a"/><circle cx="${x-30*s}" cy="${gy-90*s}" r="${30*s}" fill="#4f9a5a"/><circle cx="${x+30*s}" cy="${gy-92*s}" r="${30*s}" fill="#4f9a5a"/>`}

/* side-view head (facing right), in the same 400x500 space as the front head */
function headSide(p,ex){const S=p.skin,Sd=sh(S,-.16),Sdd=sh(S,-.3),H=p.hairColor,Hd=sh(H,-.35),Hl=sh(H,.25),has=x=>(p.extras||[]).includes(x);const bald=p.hair==="bald";
 let o="";
 const back={long:`M150 120 Q90 200 120 380 L210 380 Q190 300 200 230Z`,ponytail:`M150 130 Q90 150 96 260 Q100 320 130 350 Q118 270 160 200Z`,bun:`M130 110 m-34 0 a34 30 0 1 0 68 0 a34 30 0 1 0 -68 0`,curly:`M120 210 Q90 190 104 160 Q90 120 128 108Z`}[p.hair]||"";
 if(back&&!bald)o+=`<path d="${back}" fill="${H}" stroke="${Hd}" stroke-width="3"/>`;
 // head base
 o+=`<path d="M200 90 Q282 92 286 160 L288 184 L304 220 Q300 226 290 228 L292 242 Q284 246 290 254 Q286 262 280 268 Q270 300 236 304 Q200 300 186 270 Q142 250 128 200 Q118 120 200 90Z" fill="${S}" stroke="${Sdd}" stroke-width="3" stroke-linejoin="round"/>`;
 o+=`<ellipse cx="188" cy="206" rx="15" ry="22" fill="${S}" stroke="${Sdd}" stroke-width="2.5"/><path d="M184 196 Q194 206 186 218" fill="none" stroke="${Sd}" stroke-width="3"/>`;
 if(has("earrings"))o+=`<circle cx="188" cy="232" r="6" fill="#f2c94c" stroke="#a8801f" stroke-width="2"/>`;
 // eye
 const em=ex.e;
 if(em==="closed"||em==="sleep")o+=`<path d="M252 202 Q264 ${em==="closed"?192:210} 276 202" fill="none" stroke="#1d1416" stroke-width="5" stroke-linecap="round"/>`;
 else o+=`<path d="M258 186 Q276 190 276 204 Q274 222 260 222 Q254 206 258 186Z" fill="#fff" stroke="#2a1d1f" stroke-width="2"/><ellipse cx="${em==="shock"?268:266}" cy="206" rx="${em==="shock"?4:7}" ry="${em==="shock"?6:13}" fill="${p.eyeColor}"/><ellipse cx="268" cy="198" rx="3" ry="4" fill="#fff"/><path d="M252 ${em==="half"?194:184} Q270 178 282 194" fill="none" stroke="#1d1416" stroke-width="6" stroke-linecap="round"/>`;
 const by={angry:178,serious:176,raised:156,worried:166,up:160}[ex.b]||168;
 o+=`<path d="M248 ${by} Q264 ${by-6} 280 ${by+ (ex.b==="angry"?8:0)}" fill="none" stroke="${bald?"#8a8a8a":Hd}" stroke-width="6" stroke-linecap="round"/>`;
 // mouth
 const m=ex.m;o+=({smile:`<path d="M272 256 Q282 262 288 254" fill="none" stroke="#5a2a2a" stroke-width="3.5" stroke-linecap="round"/>`,grin:`<path d="M270 254 Q282 266 290 252" fill="#fff" stroke="#4a1418" stroke-width="3"/>`,laugh:`<path d="M268 250 L292 250 Q290 272 276 272 Q268 266 268 250Z" fill="#7a2230" stroke="#4a1418" stroke-width="3"/>`,shout:`<path d="M268 248 L292 248 L288 270 L272 270Z" fill="#7a2230" stroke="#4a1418" stroke-width="3"/>`,o:`<ellipse cx="282" cy="258" rx="6" ry="9" fill="#7a2230" stroke="#4a1418" stroke-width="2.5"/>`,evil:`<path d="M266 252 Q282 262 292 248 Q288 268 276 268Z" fill="#fff" stroke="#4a1418" stroke-width="3"/>`,cry:`<path d="M270 262 Q280 250 290 262Z" fill="#7a2230" stroke="#4a1418" stroke-width="3"/>`,frown:`<path d="M272 262 Q280 254 288 262" fill="none" stroke="#5a2a2a" stroke-width="3.5" stroke-linecap="round"/>`}[m])||`<path d="M274 258 L288 256" stroke="#5a2a2a" stroke-width="3.5" stroke-linecap="round"/>`;
 if(has("mustache"))o+=`<path d="M266 240 Q282 234 296 242 Q284 248 266 246Z" fill="${bald?"#7d7d7d":Hd}"/>`;
 if(has("beard"))o+=`<path d="M200 250 Q214 300 246 304 Q276 300 284 270 Q262 286 238 286 Q214 280 200 250Z" fill="${bald?"#7d7d7d":Hd}"/>`;
 if(has("bindi"))o+=`<circle cx="284" cy="166" r="4" fill="#d8202f"/>`;
 if(ex.fx.includes("blush")||has("blush"))o+=`<ellipse cx="256" cy="236" rx="14" ry="7" fill="#ff7a8a" opacity=".4"/>`;
 if(ex.fx.includes("tears")||ex.fx.includes("tear"))o+=`<path d="M266 222 Q262 250 268 290 L276 290 Q270 250 272 222Z" fill="#8fd3ff" stroke="#3a8fc4" stroke-width="2"/>`;
 if(ex.fx.includes("sweat")||ex.fx.includes("sweat2"))o+=`<path d="M232 140 Q244 160 240 170 Q232 180 224 170 Q220 160 232 140Z" fill="#8fd3ff" stroke="#3a8fc4" stroke-width="2.5"/>`;
 // hair (side)
 const hs={spiky:`M120 210 L96 190 L118 172 L92 140 L126 136 L118 100 L156 108 L162 70 L196 92 L222 64 L234 98 L270 86 L262 118 L292 128 L270 150 L282 170 L258 160 Q220 130 180 150 Q160 180 168 212 Z`,
  side:`M122 214 Q100 120 170 92 Q250 74 290 130 Q296 160 280 176 Q260 140 230 136 Q200 150 176 170 Q160 200 168 222Z`,
  messy:`M120 212 L98 186 L114 170 L100 136 L132 130 L132 98 L168 104 L184 72 L212 94 L246 78 L252 110 L286 112 L276 140 L290 160 L262 150 Q220 136 186 154 Q164 186 170 214Z`,
  short:`M128 212 Q108 120 180 94 Q252 80 286 136 Q270 130 250 132 Q220 128 196 144 Q170 170 172 214Z`,
  long:`M124 220 Q100 110 186 92 Q262 82 288 140 Q272 132 252 136 Q234 160 214 150 Q186 160 178 220Z`,
  ponytail:`M126 214 Q106 116 186 94 Q256 84 286 138 Q266 132 246 134 Q216 136 194 152 Q174 176 174 214Z`,
  bun:`M126 214 Q106 116 186 96 Q256 86 286 138 Q266 132 246 134 Q216 136 194 152 Q174 176 174 214Z`,
  curly:`M118 214 Q98 186 112 160 Q100 126 132 116 Q138 84 172 88 Q196 64 226 80 Q262 72 274 104 Q300 118 286 148 Q264 140 240 146 Q206 150 186 172 Q168 196 174 216Z`,
  mohawk:`M150 130 Q200 120 262 132 L256 148 Q200 140 156 148Z M176 132 L168 50 L200 74 L214 40 L232 80 L250 60 L246 132Z`}[p.hair];
 if(bald)o+=`<path d="M130 200 Q128 170 140 150" fill="none" stroke="#9a9a9a" stroke-width="12" stroke-linecap="round"/><ellipse cx="224" cy="104" rx="26" ry="8" fill="#fff" opacity=".45" transform="rotate(10 224 104)"/>`;
 else if(hs)o+=`<path d="${hs}" fill="${H}" stroke="${Hd}" stroke-width="3" stroke-linejoin="round"/><path d="M170 112 Q206 100 238 106" fill="none" stroke="${Hl}" stroke-width="5" opacity=".5" stroke-linecap="round"/>`;
 if(has("headphones"))o+=`<path d="M190 200 Q170 80 260 70" fill="none" stroke="#1d1d24" stroke-width="12" stroke-linecap="round"/><rect x="172" y="180" width="32" height="50" rx="12" fill="${p.accent}" stroke="#1d1d24" stroke-width="4"/>`;
 if(has("cap"))o+=`<path d="M124 150 Q130 76 210 76 Q280 84 284 140 Q200 128 124 150Z" fill="${p.accent}" stroke="${sh(p.accent,-.4)}" stroke-width="3"/><path d="M270 136 Q310 140 330 152 Q300 156 268 150Z" fill="${sh(p.accent,-.25)}"/>`;
 if(has("sunglasses"))o+=`<path d="M246 186 L292 186 L290 206 Q282 220 262 218 Q248 212 246 196Z" fill="#14141c"/><path d="M246 190 L196 196" stroke="#05050a" stroke-width="4"/>`;
 if(has("glasses"))o+=`<rect x="248" y="182" width="40" height="36" rx="10" fill="#fff" fill-opacity=".12" stroke="#2a2a2a" stroke-width="4"/><path d="M248 196 L198 200" stroke="#2a2a2a" stroke-width="4"/>`;
 return `<g transform="translate(200 200) scale(1.14) translate(-200 -200)">${o}</g>`}
function headBack(p,turn){const H=p.hairColor,Hd=sh(H,-.35),Hl=sh(H,.25),S=p.skin,Sdd=sh(S,-.3),has=x=>(p.extras||[]).includes(x);const bald=p.hair==="bald";
 let o=`<ellipse cx="${121+(turn||0)}" cy="196" rx="13" ry="20" fill="${S}" stroke="${Sdd}" stroke-width="2.5"/><ellipse cx="${279+(turn||0)}" cy="196" rx="13" ry="20" fill="${S}" stroke="${Sdd}" stroke-width="2.5"/>`;
 o+=`<path d="M122 190 Q118 92 200 86 Q282 92 278 190 Q276 260 236 290 Q200 300 164 290 Q124 260 122 190Z" fill="${S}" stroke="${Sdd}" stroke-width="3"/>`;
 if(bald)o+=`<path d="M126 200 Q128 230 160 270 Q200 280 240 270 Q272 230 274 200 Q240 240 200 240 Q160 240 126 200Z" fill="#9a9a9a"/><ellipse cx="190" cy="120" rx="30" ry="10" fill="#fff" opacity=".4"/>`;
 else{const base={spiky:`M112 230 L92 190 L112 176 L92 130 L128 124 L124 80 L164 92 L196 48 L228 90 L268 70 L270 116 L306 126 L286 168 L308 192 L288 232 Q200 260 112 230Z`,long:`M110 210 Q96 100 200 84 Q304 100 290 210 Q300 300 316 384 L84 384 Q100 300 110 210Z`,curly:`M110 240 Q88 200 106 170 Q90 130 120 110 Q126 70 170 72 Q200 46 232 70 Q276 70 282 110 Q310 130 294 170 Q312 204 290 240 Q200 270 110 240Z`,mohawk:`M150 236 Q140 160 150 60 L170 40 L200 60 L230 40 L250 60 Q260 160 250 236Z`}[p.hair]||`M112 236 Q100 110 200 86 Q300 110 288 236 Q200 262 112 236Z`;
  o+=`<path d="${base}" fill="${H}" stroke="${Hd}" stroke-width="3" stroke-linejoin="round"/><path d="M160 110 Q200 96 236 108" fill="none" stroke="${Hl}" stroke-width="6" opacity=".45" stroke-linecap="round"/>`;
  if(p.hair==="ponytail")o+=`<path d="M186 220 Q170 300 200 360 Q230 300 214 220Z" fill="${H}" stroke="${Hd}" stroke-width="3"/><rect x="188" y="210" width="24" height="12" rx="5" fill="${p.accent}"/>`;
  if(p.hair==="bun")o+=`<circle cx="200" cy="128" r="40" fill="${H}" stroke="${Hd}" stroke-width="3"/><path d="M170 120 Q200 100 230 122" fill="none" stroke="${Hl}" stroke-width="4" opacity=".5"/>`}
 if(has("headphones"))o+=`<path d="M108 196 Q104 70 200 64 Q296 70 292 196" fill="none" stroke="#1d1d24" stroke-width="12" stroke-linecap="round"/>`;
 if(has("cap"))o+=`<path d="M112 150 Q114 74 200 70 Q286 74 288 150 Q200 128 112 150Z" fill="${p.accent}" stroke="${sh(p.accent,-.4)}" stroke-width="3"/>`;
 return `<g transform="translate(200 200) scale(1.14) translate(-200 -200)">${o}</g>`}

/* body: returns svg group drawn in a 400x800 frame, feet near y=760 */
function body(p,view,poseK,expr){const P=POSES[poseK]||POSES.stand,ex=A.EXDEF(expr||p.expr);
 const fem=p.gender==="girl"||p.gender==="woman",old=p.age==="old";const FL=p.style==="flat",OLc="#3b2b22";
 const bt=p.build||"average",wide={slim:.88,average:1,broad:1.14,chubby:1.2}[bt]||1,tall=({short:.9,average:1,tall:1.08}[p.height]||1)*(p.age==="teen"?.78:1);
 const S=p.skin,Sdd=sh(S,-.3),O=p.outfitColor,Od=sh(O,-.3),Ol=sh(O,.18),Ac=p.accent,Bt=p.bottomColor||(p.outfit==="kurta"?"#efeadc":"#2e3a5c"),Btd=sh(Bt,-.3),Sh=p.shoeColor||"#1d1d24";
 const longSleeve=["shirt","hoodie","jacket","kurta","uniform"].includes(p.outfit),dress=p.outfit==="saree";
 const side=view==="side"||view==="side2",back=view==="back"||view==="threeback",three=view==="three"||view==="threeback";
 let y0=(P.y||0)+(P.sit?110:0)+(p.age==="teen"&&!P.sit?Math.round(252*(1-tall/(({short:.9,average:1,tall:1.08}[p.height]||1)))):0);const cx=200;
 const neckY=228,shY=250+y0*0,lean=P.lean||0;
 let o="";
 const lw={arm:FL?(fem?26:30):(fem?20:24),leg:FL?(fem?30:34):(fem?26:30)}; lw.arm*=wide;lw.leg*=wide;
 const limb=(x,y,a1,a2,l1,l2,cu,cl,w,end)=>{const [ex1,ey1]=pt(x,y,l1,a1),[ex2,ey2]=pt(ex1,ey1,l2,a2);
  let g=`<path d="M${x} ${y} L${ex1} ${ey1}" stroke="${FL?OLc:sh(cu,-.35)}" stroke-width="${w+(FL?9:5)}" stroke-linecap="round"/><path d="M${ex1} ${ey1} L${ex2} ${ey2}" stroke="${FL?OLc:sh(cl,-.35)}" stroke-width="${w+(FL?9:3)}" stroke-linecap="round"/><path d="M${x} ${y} L${ex1} ${ey1}" stroke="${cu}" stroke-width="${w}" stroke-linecap="round"/><path d="M${ex1} ${ey1} L${ex2} ${ey2}" stroke="${cl}" stroke-width="${w-2}" stroke-linecap="round"/>`;
  if(end==="hand")g+=`<circle cx="${ex2}" cy="${ey2}" r="${w*.62}" fill="${S}" stroke="${FL?OLc:Sdd}" stroke-width="${FL?4.5:2.5}"/>`;
  if(end==="fist")g+=`<circle cx="${ex2}" cy="${ey2}" r="${w*.72}" fill="${S}" stroke="${Sdd}" stroke-width="3"/><path d="M${ex2-6} ${ey2-4} h12 M${ex2-6} ${ey2+2} h12" stroke="${Sdd}" stroke-width="2"/>`;
  if(end==="shoe")g+=`<ellipse cx="${ex2+(side?10:0)}" cy="${ey2+6}" rx="${w*.8+(side?8:0)}" ry="${w*.42}" fill="${Sh}" stroke="${FL?OLc:sh(Sh,-.4)}" stroke-width="${FL?4:2.5}"/><path d="M${ex2-w*.6} ${ey2+6} h${w*1.2}" stroke="#fff" stroke-width="2" opacity=".5"/>`;
  return {g,end:[ex2,ey2]}};
 const X=v=>three?cx+(v-cx)*.8+(view==="threeback"?-8:8):v;
 const armC=[longSleeve?O:O,longSleeve?O:S],legLen=[128*tall,124*tall],armLen=[86,80];
 const shW=(fem?58:72)*wide,hpW=(fem?42:38)*wide,hipY=420+y0;
 const sitBench=P.sit?`<rect x="${side?150:90}" y="${hipY+6}" width="${side?140:220}" height="22" rx="6" fill="#8a5a2b" stroke="#5a3a1a" stroke-width="3"/><rect x="${side?160:100}" y="${hipY+28}" width="12" height="${760-hipY-28}" fill="#5a3a1a"/><rect x="${side?268:288}" y="${hipY+28}" width="12" height="${760-hipY-28}" fill="#5a3a1a"/>`:"";
 if(!side){
  const sL=[X(cx-shW),shY+y0],sR=[X(cx+shW),shY+y0],hL=[X(cx-hpW),hipY],hR=[X(cx+hpW),hipY];
  o+=sitBench;
  // legs
  const legs=[["ll",hL,-1],["rl",hR,1]].map(([k,h,sg])=>{let a=P[k];let l1=legLen[0],l2=legLen[1];
   if(P.sit){l1*=.42}
   return limb(h[0],h[1],a[0],a[1],l1,l2,dress?S:Bt,dress?S:Bt,lw.leg,"shoe")});
  if(!dress)legs.forEach(l=>o+=l.g);
  // torso
  const wY=hipY-70,ww=shW*.78;
  const torso=`M${sL[0]} ${sL[1]} Q${X(cx)} ${shY+y0-18} ${sR[0]} ${sR[1]} Q${sR[0]+6} ${wY-60} ${X(cx+ww)} ${wY} L${hR[0]+8} ${hipY+(p.outfit==="kurta"?80:14)} L${hL[0]-8} ${hipY+(p.outfit==="kurta"?80:14)} L${X(cx-ww)} ${wY} Q${sL[0]-6} ${wY-60} ${sL[0]} ${sL[1]}Z`;
  if(dress){o+=`<path d="M${X(cx-ww)} ${wY} L${X(cx+ww)} ${wY} L${X(cx+ww*1.5)} ${P.sit?hipY+90:745} L${X(cx-ww*1.5)} ${P.sit?hipY+90:745}Z" fill="${O}" stroke="${Od}" stroke-width="3"/><path d="M${X(cx-10)} ${wY+10} L${X(cx-26)} ${P.sit?hipY+90:745} M${X(cx+6)} ${wY+10} L${X(cx+2)} ${P.sit?hipY+90:745} M${X(cx+20)} ${wY+10} L${X(cx+30)} ${P.sit?hipY+90:745}" stroke="${Od}" stroke-width="2.5"/><path d="M${X(cx-ww*1.5)} ${(P.sit?hipY+90:745)-10} L${X(cx+ww*1.5)} ${(P.sit?hipY+90:745)-10}" stroke="${Ac}" stroke-width="10"/>`;legs.forEach(l=>{o+=`<ellipse cx="${l.end[0]}" cy="${l.end[1]+6}" rx="16" ry="8" fill="${Sh}"/>`})}
  if(FL){const tid="tc"+Math.random().toString(36).slice(2,7);o+=`<defs><clipPath id="${tid}"><path d="${torso}"/></clipPath></defs><path d="${torso}" fill="${O}"/><g clip-path="url(#${tid})"><rect x="${X(cx)+14}" y="${shY+y0-40}" width="200" height="400" fill="${sh(O,-.16)}"/></g><path d="${torso}" fill="none" stroke="${OLc}" stroke-width="5" stroke-linejoin="round"/>`}
  else o+=`<path d="${torso}" fill="${O}" stroke="${Od}" stroke-width="3" stroke-linejoin="round"/>`;
  if(!back&&(!FL||p.outfit==="saree"||p.outfit==="shirt"||p.outfit==="uniform"))o+=outfitFront(p,X,cx,shY+y0,wY,hipY,ww,O,Od,Ol,Ac);
  else o+=`<path d="M${X(cx)} ${shY+y0+20} L${X(cx)} ${hipY}" stroke="${Od}" stroke-width="2" opacity=".5"/>`+(p.outfit==="hoodie"?`<path d="M${X(cx-40)} ${shY+y0-6} Q${X(cx)} ${shY+y0+60} ${X(cx+40)} ${shY+y0-6}" fill="${Od}" stroke="${sh(O,-.45)}" stroke-width="3"/>`:"")+(dress?`<path d="M${sR[0]} ${sR[1]} Q${X(cx+20)} ${wY} ${X(cx-30)} ${hipY+40}" stroke="${Ac}" stroke-width="30" fill="none" opacity=".9"/>`:"");
  if(p.extras&&p.extras.includes("goldChain")&&!back)o+=`<path d="M${X(cx-22)} ${neckY+12+y0} Q${X(cx)} ${neckY+62+y0} ${X(cx+22)} ${neckY+12+y0}" fill="none" stroke="#e6b83a" stroke-width="4" stroke-dasharray="6 3"/><circle cx="${X(cx)}" cy="${neckY+56+y0}" r="7" fill="#f2c94c" stroke="#a8801f" stroke-width="2"/>`;
  if(p.extras&&p.extras.includes("towel"))o+=`<path d="M${sL[0]+4} ${sL[1]-6} Q${sL[0]-10} ${sL[1]+60} ${sL[0]} ${sL[1]+130} L${sL[0]+26} ${sL[1]+130} Q${sL[0]+20} ${sL[1]+60} ${sL[0]+30} ${sL[1]-2}Z" fill="#fff" stroke="#c9c9c9" stroke-width="2"/>`;
  // arms
  [["la",sL],["ra",sR]].forEach(([k,s])=>{let a=P[k];const fistPose=P.fx==="fight";let end=P.pockets===true||(P.pockets==="l"&&k==="la")?"none":fistPose?"fist":"hand";
   const L=limb(s[0],s[1],a[0]*(back?-1:1)*(back?-1:1),a[1],armLen[0],armLen[1],armC[0],armC[1],lw.arm,end);o+=L.g;
   if(P.prop==="book"&&k==="ra")o+=`<g transform="translate(${X(cx)} ${L.end[1]-10})"><path d="M-46 -6 L0 4 L46 -6 L46 34 L0 44 L-46 34Z" fill="#fff" stroke="#3b3b4a" stroke-width="3"/><path d="M0 4 L0 44" stroke="#3b3b4a" stroke-width="3"/><path d="M-38 6 h28 M-38 14 h28 M10 6 h28 M10 14 h28" stroke="#9aa" stroke-width="2"/><rect x="-50" y="34" width="100" height="10" fill="${Ac}"/></g>`;
   if(P.fx==="talk"&&k==="ra")o+=`<g><path d="M${L.end[0]+20} ${L.end[1]-120} h120 a16 16 0 0 1 16 16 v40 a16 16 0 0 1 -16 16 h-80 l-24 20 l4 -20 h-20 a16 16 0 0 1 -16 -16 v-40 a16 16 0 0 1 16 -16z" fill="#fff" stroke="#1d1d24" stroke-width="3" transform="translate(-110 0)"/><text x="${L.end[0]-20}" y="${L.end[1]-82}" font-family="Arial Black" font-size="24" text-anchor="middle" fill="#1d1d24">…!</text></g>`});
 }else{
  // side view (facing right; side2 mirrored by caller)
  const s=P.s,sx=cx-(back?0:4),sY=shY+y0,hX=cx-2;
  o+=sitBench;
  const farLeg=limb(hX-6,hipY,s.m[0]*-1,s.m[1]*-1,P.sit?legLen[0]*.95:legLen[0],legLen[1],dress?S:sh(Bt,-.15),dress?S:sh(Bt,-.15),lw.leg,"shoe");
  const nearLeg=limb(hX+6,hipY,s.l[0]*-1,s.l[1]*-1,P.sit?legLen[0]*.95:legLen[0],legLen[1],dress?S:Bt,dress?S:Bt,lw.leg,"shoe");
  // in side view positive = forward (+x): convert angle (0 down, + right) -> forward means negative rotation sign in pt? pt uses sin(a): + => +x, so forward = +a
  const fl=limb(hX-6,hipY,s.m[0],s.m[1],P.sit?legLen[0]*.95:legLen[0],legLen[1],dress?S:sh(Bt,-.15),dress?S:sh(Bt,-.15),lw.leg,"shoe"),nl=limb(hX+6,hipY,s.l[0],s.l[1],P.sit?legLen[0]*.95:legLen[0],legLen[1],dress?S:Bt,dress?S:Bt,lw.leg,"shoe");
  const farArm=limb(sx-4,sY+6,s.b[0],s.b[1],armLen[0],armLen[1],sh(armC[0],-.15),sh(armC[1],-.12),lw.arm,P.fx==="fight"?"fist":P.pockets?"none":"hand");
  o+=farArm.g;
  if(!dress){o+=fl.g;o+=nl.g}
  const tw=(fem?44:52)*wide;
  o+=`<path d="M${sx-tw*.55} ${sY} Q${sx} ${sY-16} ${sx+tw*.6} ${sY+4} Q${sx+tw*.72} ${sY+80} ${sx+tw*.5} ${hipY-60} L${sx+tw*.55} ${hipY+(p.outfit==="kurta"?80:14)} L${sx-tw*.6} ${hipY+(p.outfit==="kurta"?80:14)} L${sx-tw*.5} ${hipY-60} Q${sx-tw*.72} ${sY+60} ${sx-tw*.55} ${sY}Z" fill="${O}" stroke="${FL?OLc:Od}" stroke-width="${FL?5:3}" transform="rotate(${lean} ${sx} ${hipY})"/>`;
  if(dress){o+=`<path d="M${sx-tw*.6} ${hipY-60} L${sx+tw*.55} ${hipY-60} L${sx+tw*1.1} ${P.sit?hipY+90:745} L${sx-tw} ${P.sit?hipY+90:745}Z" fill="${O}" stroke="${Od}" stroke-width="3"/><path d="M${sx-tw} ${(P.sit?hipY+90:745)-10} L${sx+tw*1.1} ${(P.sit?hipY+90:745)-10}" stroke="${Ac}" stroke-width="10"/>`+[fl,nl].map(l=>`<ellipse cx="${l.end[0]+8}" cy="${l.end[1]+6}" rx="18" ry="8" fill="${Sh}"/>`).join("")}
  if(p.outfit==="hoodie")o+=`<path d="M${sx-tw*.7} ${sY-4} Q${sx-tw*.9} ${sY+40} ${sx-tw*.4} ${sY+44} Q${sx-tw*.2} ${sY+10} ${sx-tw*.3} ${sY-8}Z" fill="${Od}"/>`;
  if(p.outfit==="jacket"||p.outfit==="shirt"||p.outfit==="uniform")o+=`<path d="M${sx+tw*.5} ${sY+4} L${sx+tw*.66} ${sY+40}" stroke="${Ol}" stroke-width="8"/>`;
  const nearArm=limb(sx+4,sY+8,s.a[0],s.a[1],armLen[0],armLen[1],armC[0],armC[1],lw.arm,P.fx==="fight"?"fist":P.pockets===true?"none":"hand");
  o+=nearArm.g;
  if(P.prop==="book")o+=`<rect x="${nearArm.end[0]-6}" y="${nearArm.end[1]-40}" width="12" height="54" fill="#fff" stroke="#3b3b4a" stroke-width="3" transform="rotate(-20 ${nearArm.end[0]} ${nearArm.end[1]})"/>`;
 }
 // neck
 const nx=side?cx+8:X(cx);
 o=`<path d="M${nx-16} ${neckY-20+y0} L${nx-16} ${shY+y0} Q${nx} ${shY+y0+10} ${nx+16} ${shY+y0} L${nx+16} ${neckY-20+y0}Z" fill="${FL?sh(S,-.13):S}" stroke="${FL?OLc:Sdd}" stroke-width="${FL?4.5:2.5}"/>`+o;
 return {g:o,y0,headX:side?cx+8:X(cx),turn:three?(view==="threeback"?-24:24):0}}
function outfitFront(p,X,cx,shY,wY,hipY,ww,O,Od,Ol,Ac){const c=X(cx);
 switch(p.outfit){
 case "tshirt":return `<path d="M${c-22} ${shY-8} Q${c} ${shY+18} ${c+22} ${shY-8}" fill="none" stroke="${Ac}" stroke-width="4"/><rect x="${c-26}" y="${shY+50}" width="52" height="40" rx="6" fill="${Ac}"/><text x="${c}" y="${shY+80}" text-anchor="middle" font-family="Arial Black" font-size="22" fill="${O}">DJ</text>`;
 case "shirt":return `<path d="M${c-22} ${shY-10} L${c} ${shY+20} L${c+22} ${shY-10} L${c+30} ${shY} L${c+8} ${shY+28} L${c} ${shY+20} L${c-8} ${shY+28} L${c-30} ${shY}Z" fill="${Ol}" stroke="${Od}" stroke-width="2.5"/><path d="M${c} ${shY+20} L${c} ${hipY+14}" stroke="${Od}" stroke-width="3"/>${[50,90,130].map(d=>`<circle cx="${c+6}" cy="${shY+d}" r="3.5" fill="${Ac}"/>`).join("")}<rect x="${c-ww+14}" y="${hipY+2}" width="${ww*2-28}" height="12" fill="#3a2a1a"/>`;
 case "hoodie":return `<path d="M${c-44} ${shY-4} Q${c} ${shY-30} ${c+44} ${shY-4} Q${c+30} ${shY+20} ${c} ${shY+22} Q${c-30} ${shY+20} ${c-44} ${shY-4}Z" fill="${Od}"/><path d="M${c-10} ${shY+20} L${c-12} ${shY+70} M${c+10} ${shY+20} L${c+12} ${shY+70}" stroke="${Ac}" stroke-width="4" stroke-linecap="round"/><path d="M${c-40} ${wY+10} Q${c} ${wY} ${c+40} ${wY+10} L${c+40} ${wY+50} L${c-40} ${wY+50}Z" fill="${Od}" opacity=".6"/>`;
 case "jacket":return `<path d="M${c-20} ${shY-6} L${c} ${shY+40} L${c+20} ${shY-6} L${c+14} ${hipY+14} L${c-14} ${hipY+14}Z" fill="${Ac}"/><path d="M${c-20} ${shY-6} L${c-36} ${shY+30} L${c-12} ${shY+50} M${c+20} ${shY-6} L${c+36} ${shY+30} L${c+12} ${shY+50}" fill="none" stroke="${Ol}" stroke-width="6"/><path d="M${c-14} ${shY+40} L${c-14} ${hipY+14} M${c+14} ${shY+40} L${c+14} ${hipY+14}" stroke="${Od}" stroke-width="4"/>`;
 case "kurta":return `<path d="M${c-16} ${shY-6} Q${c} ${shY+2} ${c+16} ${shY-6}" stroke="${Ac}" stroke-width="7" fill="none"/><path d="M${c} ${shY} L${c} ${shY+80}" stroke="${Ac}" stroke-width="5"/>${[20,40,60].map(d=>`<circle cx="${c}" cy="${shY+d}" r="3" fill="${Od}"/>`).join("")}<path d="M${c-ww-6} ${hipY+60} Q${c} ${hipY+50} ${c+ww+6} ${hipY+60}" stroke="${Ac}" stroke-width="4" stroke-dasharray="8 5" fill="none"/>`;
 case "saree":return `<path d="M${c+30} ${shY-8} Q${c+10} ${wY-20} ${c-40} ${wY+30} L${c-20} ${wY+44} Q${c+30} ${wY} ${c+46} ${shY}Z" fill="${Ac}"/>`;
 case "vest":return `<path d="M${c-22} ${shY-6} Q${c} ${shY+20} ${c+22} ${shY-6} L${c+20} ${hipY} L${c-20} ${hipY}Z" fill="#f2efe8"/><path d="M${c-22} ${shY-6} L${c-4} ${hipY} M${c+22} ${shY-6} L${c+4} ${hipY}" stroke="${Od}" stroke-width="10"/>`;
 case "uniform":return `<path d="M${c-22} ${shY-10} L${c} ${shY+18} L${c+22} ${shY-10} L${c+30} ${shY} L${c+8} ${shY+26} L${c} ${shY+18} L${c-8} ${shY+26} L${c-30} ${shY}Z" fill="#f4f4f4" stroke="#bdbdbd" stroke-width="2"/><path d="M${c-6} ${shY+18} L${c+6} ${shY+18} L${c+10} ${shY+100} L${c} ${shY+112} L${c-10} ${shY+100}Z" fill="${Ac}"/><rect x="${c-ww+14}" y="${hipY+2}" width="${ww*2-28}" height="12" fill="#2a2a2a"/>`;
 }return ""}
function addFx(P,hx){if(P.fx==="speed")return `<g stroke="#9aa" stroke-width="5" stroke-linecap="round" opacity=".7"><path d="M40 330 h70 M24 400 h90 M50 470 h60"/></g>`;
 if(P.fx==="jump")return `<ellipse cx="200" cy="770" rx="70" ry="12" fill="#000" opacity=".15"/><g stroke="#c8902a" stroke-width="4" stroke-linecap="round"><path d="M120 740 l-20 20 M280 740 l20 20 M200 748 v24"/></g>`;
 if(P.fx==="think")return `<text x="${hx+90}" y="90" font-family="Arial Black" font-size="64" fill="#3b82c4" stroke="#fff" stroke-width="3" paint-order="stroke">?</text>`;
 if(P.fx==="fight")return `<g fill="#f2c94c" stroke="#c8902a" stroke-width="2"><path d="M60 300 l10 24 l24 6 l-24 6 l-10 24 l-10 -24 l-24 -6 l24 -6Z"/><path d="M340 280 l8 18 l18 5 l-18 5 l-8 18 l-8 -18 l-18 -5 l18 -5Z"/></g>`;return ""}
/* full character in a W x H frame */
function full(p0,o){o=o||{};const p=Object.assign({},A.DEF,p0||{});const view=o.view||"front",poseK=o.pose||"stand",P=POSES[poseK]||POSES.stand,exK=o.expr||p.expr;
 let v=view;if(P.look&&view==="front")v="back";
 const b=body(p,v==="side2"?"side":v,poseK,exK),ex=A.EXDEF(exK);
 const side=v==="side"||v==="side2",back=v==="back"||v==="threeback";
 // head
 const FL=p.style==="flat"&&A.FLAT,HS=FL?A.FLAT.headSide:headSide,HB=FL?(q=>A.FLAT.headBack(q)):headBack;
 let head;if(P.look&&back)head=`<g transform="translate(-14 0)">${HS(p,ex)}</g>`;else if(side)head=HS(p,ex);else if(back)head=HB(p,b.turn?-14:0);else head=A.draw(p,exK,{headOnly:true,turn:b.turn});
 const defs=(head.match(/<defs>[\s\S]*?<\/defs>/)||[""])[0];head=head.replace(defs,"");
 const hs=FL?(p.age==="teen"?.74:.62):.56,hx=b.headX,hy=0+b.y0+(P.sit?0:0);
 const headG=`<g transform="translate(${hx-200*hs} ${hy+(FL?(p.age==="teen"?-10:8):22)}) scale(${hs})">${head}</g>`;
 // back hair for front: long hair behind body handled inside head (drawn first) - fine
 let inner=`${defs}<g transform="rotate(${(P.lean||0)*(side?1:0)} 200 ${420+b.y0})">${back?headG+b.g:b.g+headG}</g>`;
 if(back&&!(P.look))inner=`${defs}${b.g}${headG}`;
 inner+=addFx(P,hx);
 if(v==="side2")inner=`<g transform="translate(400 0) scale(-1 1)">${inner}</g>`;
 return inner}
function frame(inner,o){o=o||{};const W=o.w||400,H=o.h||800;const bg=A.bgArt(o.bg||"plain",W,H,o.base);
 const label=o.label?`<rect x="0" y="${H-46}" width="${W}" height="46" fill="rgba(20,22,40,.72)"/><text x="${W/2}" y="${H-15}" font-family="Arial,sans-serif" font-size="24" font-weight="700" text-anchor="middle" fill="#fff">${String(o.label).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}</text>`:"";
 const fg=o.bg==="dining"&&A.DINING_FG?A.DINING_FG(W,H,o.fgN||1):"";
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}">${bg}${inner}${fg}${label}</svg>`}
function drawFull(p,o){o=o||{};return frame(`<g transform="translate(0 10)">${full(p,o)}</g>`,Object.assign({bg:o.bg||(p&&p.bgScene)||"plain",base:p&&p.bg},o))}
function group(chars,o){o=o||{};const n=chars.length,W=Math.max(800,n*330),H=800;let inner="";
 chars.forEach((c,i)=>{const x=(W/(n+1))*(i+1)-200*.95;inner+=`<g transform="translate(${x} 30) scale(.95)">${full(c.p,{view:c.view||(c.p.style==="flat"&&o.bg==="dining"?"front":"three"),pose:c.pose||"stand",expr:c.expr})}</g>`});
 return frame(inner,{w:W,h:H,bg:o.bg||"campus",label:o.label,fgN:n})}
Object.assign(A,{VIEWS,VIEWN,POSES,BGS,drawFull,group,bgArt});
})();
