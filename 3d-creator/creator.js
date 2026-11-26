(function(){
"use strict";
THREE.ColorManagement.legacyMode=false;
const T=THREE,$=q=>document.querySelector(q),E=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
/* ------------------------------------------------------------ options */
const SKIN=["#fbe3cf","#f2d2b8","#e8bf9c","#e2b08a","#d39a72","#c98f67","#b07650","#93603f","#7a4c30","#5c3a24"];
const HAIRC=["#141418","#2a2a33","#3a2618","#5a3a22","#7a5232","#a87a4a","#d9b46a","#f0d98a","#c0392b","#e8e8ee","#5b3fa8","#2f6db5","#2fa57a","#ff6fa8"];
const CLOTH=["#1d1d24","#f4f4f4","#e8a33d","#c0392b","#2f7a45","#2a3f6e","#3b82c4","#7a5cff","#ff6fa8","#8a8a96","#7a5232","#e8d4a8","#14b8a6","#facc15"];
const EYEC=["#3b2a20","#6b4a2e","#1f5fa8","#2f8a5a","#7a7a8a","#8a3a8a","#c0392b","#111111"];
const OPT={
 gender:{boy:"Boy",girl:"Girl"},
 build:{slim:"Slim",average:"Average",chubby:"Chubby",muscular:"Muscular"},
 hair:{hero:"Spiky hero",messy:"Messy",crew:"Short crew",side:"Side part",curly:"Curly",afro:"Afro",long:"Long straight",ponytail:"Ponytail",bun:"Top bun",bob:"Bob",braids:"Two braids",mohawk:"Mohawk",bald:"Bald"},
 eyes:{anime:"Anime",smug:"Smug",happy:"Happy ^ ^",sleepy:"Sleepy",angry:"Angry",shock:"Shocked",wink:"Wink",heart:"Heart eyes"},
 brows:{normal:"Normal",angry:"Angry",worried:"Worried",raised:"One raised",thick:"Thick"},
 mouth:{smile:"Smile",smirk:"Smirk",grin:"Big laugh",o:"Shocked O",flat:"Flat",frown:"Frown",tongue:"Tongue out",teeth:"Teeth grin"},
 face_hair:{none:"None",mustache:"Mustache",beard:"Beard",stubble:"Stubble"},
 glasses:{none:"None",round:"Round glasses",square:"Square glasses",sunglasses:"Sunglasses",shades_up:"Shades on head"},
 top:{tshirt:"T-shirt",shirt:"Shirt",hoodie:"Hoodie",jacket:"Open jacket",kurta:"Kurta",sherwani:"Sherwani",uniform:"School uniform",police:"Police uniform",doctor:"Doctor coat",cricket:"Cricket jersey",tank:"Tank top",dress:"Dress",saree:"Saree",suit:"Suit & tie"},
 bottom:{jeans:"Jeans / pants",shorts:"Shorts",skirt:"Skirt",dhoti:"Dhoti / pyjama",lungi:"Lungi",trackpants:"Track pants"},
 shoes:{sneakers:"Sneakers",boots:"Boots",sandals:"Sandals",formal:"Formal shoes",barefoot:"Barefoot"},
 acc:{headphones:"Headphones",chain:"Gold chain",cap:"Cap",beanie:"Beanie",scarf:"Scarf",earrings:"Earrings",watch:"Watch",backpack:"Backpack",bindi:"Bindi",flower:"Flower in hair",tilak:"Tilak",mic:"Microphone",turban:"Turban / pagdi"},
 faceShape:{round:"Round",oval:"Oval",long:"Long",square:"Square jaw",chubby:"Chubby cheeks"},
 nose:{small:"Small",button:"Button",pointy:"Pointy",big:"Big"},
 prop:{none:"Nothing",phone:"Phone",tea:"Chai cup",bat:"Cricket bat",book:"Book",guitar:"Guitar",umbrella:"Umbrella",flowers:"Flowers"},
 pose:{idle:"Standing",wave:"Wave",cheer:"Cheer",hips:"Hands on hips",pockets:"Hands in pockets",think:"Thinking",point:"Pointing",cross:"Arms crossed",dance:"Dance",walk:"Walk",run:"Run",jump:"Jump",namaste:"Namaste",dj:"DJ mixing",bow:"Bow",sit:"Sit (cross-legged)",shrug:"Shrug",facepalm:"Facepalm",laugh:"Laugh (holding belly)"},
 bg:{studio:"Studio",college:"College",park:"Park",night:"Night city",stage:"Stage",plain:"Plain colour"}
};
const BASE={name:"New character",gender:"boy",build:"average",height:1,head:1,skin:"#e2b08a",hair:"messy",hairC:"#2a2a33",eyes:"anime",eyeC:"#3b2a20",brows:"normal",mouth:"smile",blush:true,face_hair:"none",glasses:"none",
 top:"tshirt",topC:"#3b82c4",accC:"#f4f4f4",bottom:"jeans",botC:"#2a3f6e",shoes:"sneakers",shoeC:"#f4f4f4",acc:[],pose:"idle",bg:"studio",bgC:"#ffe9f1",anim:true,faceShape:"round",nose:"small",prop:"none",say:""};
const EXPR={happy:["😊 Happy",{eyes:"anime",brows:"normal",mouth:"smile",blush:true}],laugh:["😆 Laugh",{eyes:"happy",brows:"normal",mouth:"grin"}],cool:["😎 Cool",{eyes:"smug",brows:"raised",mouth:"smirk"}],
 angry:["😠 Angry",{eyes:"angry",brows:"angry",mouth:"teeth"}],sad:["😢 Sad",{eyes:"sleepy",brows:"worried",mouth:"frown"}],shocked:["😱 Shocked",{eyes:"shock",brows:"worried",mouth:"o"}],
 love:["😍 Love",{eyes:"heart",brows:"normal",mouth:"smile",blush:true}],sleepy:["😴 Sleepy",{eyes:"sleepy",brows:"normal",mouth:"flat"}],silly:["😜 Silly",{eyes:"wink",brows:"raised",mouth:"tongue"}],
 serious:["😐 Serious",{eyes:"anime",brows:"thick",mouth:"flat"}]};
const PRESETS={
 vicky:Object.assign({},BASE,{name:"DJ Vicky",skin:"#c98f67",hair:"hero",hairC:"#141418",eyes:"smug",eyeC:"#6b4a2e",brows:"raised",mouth:"smirk",glasses:"shades_up",top:"jacket",topC:"#1d1d24",accC:"#e8d4a8",bottom:"jeans",botC:"#2a3f6e",shoes:"sneakers",shoeC:"#f4f4f4",acc:["headphones","chain","earrings"],build:"slim",height:1.05,pose:"dj",bg:"stage"}),
 golu:Object.assign({},BASE,{name:"Golu",skin:"#e2b08a",hair:"curly",hairC:"#5a3a22",eyes:"happy",mouth:"grin",top:"tshirt",topC:"#e8a33d",accC:"#c0392b",bottom:"jeans",botC:"#3b5a8a",shoes:"sneakers",shoeC:"#c4553f",acc:[],build:"chubby",height:.92,pose:"cheer",bg:"college"}),
 madhu:Object.assign({},BASE,{name:"Madhu",gender:"girl",skin:"#d39a72",hair:"braids",hairC:"#141418",eyes:"anime",eyeC:"#3b2a20",mouth:"smile",top:"kurta",topC:"#ff6fa8",accC:"#facc15",bottom:"dhoti",botC:"#f4f4f4",shoes:"sandals",shoeC:"#7a5232",acc:["bindi","earrings","flower"],build:"slim",height:.96,pose:"namaste",bg:"park"}),
 mahesh:Object.assign({},BASE,{name:"Mahesh",skin:"#b07650",hair:"side",hairC:"#2a2a33",eyes:"anime",brows:"thick",mouth:"teeth",face_hair:"mustache",top:"shirt",topC:"#f4f4f4",accC:"#2f6db5",bottom:"jeans",botC:"#1d1d24",shoes:"formal",shoeC:"#3a2a20",acc:["watch"],build:"muscular",height:1.04,pose:"hips",bg:"college"})
};
let C=JSON.parse(JSON.stringify(PRESETS.vicky));
/* ------------------------------------------------------------ renderer */
const wrap=$("#stage");const R=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
R.setPixelRatio(Math.min(2,window.devicePixelRatio||1));R.shadowMap.enabled=true;R.shadowMap.type=T.PCFSoftShadowMap;R.outputEncoding=T.sRGBEncoding;R.toneMapping=T.ACESFilmicToneMapping;R.toneMappingExposure=.92;wrap.appendChild(R.domElement);
const S=new T.Scene();const Cam=new T.PerspectiveCamera(35,1,.1,200);
const hemi=new T.HemisphereLight("#fff6ec","#b08a6a",.75);S.add(hemi);
const sun=new T.DirectionalLight("#fff1e0",1.6);sun.position.set(4,8,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-6,right:6,top:7,bottom:-2});sun.shadow.bias=-.002;sun.shadow.normalBias=.03;S.add(sun);
const fill=new T.DirectionalLight("#ffd9c2",.55);fill.position.set(-6,4,5);S.add(fill);const rim=new T.DirectionalLight("#cfe2ff",.7);rim.position.set(-5,3,-4);S.add(rim);
const gd=new Uint8Array([95,95,95,255,180,180,180,255,255,255,255,255]);const gm=new T.DataTexture(gd,3,1,T.RGBAFormat);gm.needsUpdate=true;gm.minFilter=gm.magFilter=T.NearestFilter;
const MC=new Map();const mat=c=>{if(!MC.has(c))MC.set(c,new T.MeshPhysicalMaterial({color:c,roughness:.62,metalness:0,clearcoat:.35,clearcoatRoughness:.55}));return MC.get(c)};
const basic=c=>{const k="b"+c;if(!MC.has(k))MC.set(k,new T.MeshPhysicalMaterial({color:c,roughness:.2,clearcoat:1,clearcoatRoughness:.15}));return MC.get(k)};
const LINE=new T.MeshBasicMaterial({color:"#241816",side:T.BackSide});
function M(geo,m,o){o=o||{};o.line=false;const g=new T.Group(),a=new T.Mesh(geo,m);a.castShadow=true;a.receiveShadow=true;g.add(a);if(o.line!==false){const b=new T.Mesh(geo,LINE);b.scale.setScalar(1+(o.lw||.06));g.add(b)}return g}
function at(o,x,y,z,rx,ry,rz,sx,sy,sz){o.position.set(x||0,y||0,z||0);o.rotation.set(rx||0,ry||0,rz||0);if(sx!=null)o.scale.set(sx,sy==null?sx:sy,sz==null?sx:sz);return o}
const GC=new Map();const geo=(k,f)=>{if(!GC.has(k))GC.set(k,f());return GC.get(k)};
const sph=r=>geo("s"+r,()=>new T.SphereGeometry(r,56,36)),cap=(r,l)=>geo("c"+r+"_"+l,()=>new T.CapsuleGeometry(r,l,12,30)),cyl=(a,b,h,n)=>geo("y"+a+b+h+(n||28),()=>new T.CylinderGeometry(a,b,h,n||28)),box=(x,y,z)=>geo("b"+x+y+z,()=>new T.BoxGeometry(x,y,z)),cone=(r,h,n)=>geo("k"+r+h+(n||16),()=>new T.ConeGeometry(r,h,n||16)),tor=(r,t,a)=>geo("t"+r+t+(a||7),()=>new T.TorusGeometry(r,t,10,36,a||Math.PI*2));
function tube(pts,r,m){const c=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(...p)));const g=new T.Mesh(new T.TubeGeometry(c,20,r,8,false),m);return g}
function hemiCap(r,phi,m,lw){const g=new T.SphereGeometry(r,36,20,0,Math.PI*2,0,phi);const o=M(g,m,{lw:lw||.05});return o}
/* ------------------------------------------------------------ backgrounds */
const BG=new T.Group();S.add(BG);
function buildBG(){BG.clear();const k=C.bg;const col={studio:"#f6dcc6",college:"#cfe3f0",park:"#d8eedc",night:"#1b2340",stage:"#2a1630",plain:C.bgC}[k]||"#f6dcc6";S.background=new T.Color(col);S.fog=new T.Fog(col,16,40);
 hemi.intensity=k==="night"||k==="stage"?.55:.9;sun.intensity=k==="night"?.5:k==="stage"?.7:.95;
 const groundC={studio:"#7cc79a",college:"#8cc76a",park:"#7cc35a",night:"#3a3f55",stage:"#5a3a2a",plain:"#ffffff"}[k];
 const g=new T.Mesh(new T.CylinderGeometry(k==="studio"?4:8,k==="studio"?4.2:8,.3,96),mat(groundC));g.position.y=-.15;g.receiveShadow=true;BG.add(g);if(k==="studio"){const fl=new T.Mesh(new T.PlaneGeometry(80,80),new T.MeshStandardMaterial({color:col,roughness:1}));fl.rotation.x=-Math.PI/2;fl.position.y=-.3;fl.receiveShadow=true;BG.add(fl)}
 if(k==="college"){const b=new T.Group();b.add(at(M(box(7,3,1),mat("#efe1c6")),0,1.5,0));const r=at(M(cone(4.6,1.4,4),mat("#c0553f")),0,3.7,0,0,Math.PI/4);r.scale.set(1,1,.32);b.add(r);
  b.add(at(new T.Mesh(box(1,1.8,.05),mat("#7b5a3a")),0,.9,.52));[-2.4,-1.2,1.2,2.4].forEach(x=>b.add(at(new T.Mesh(box(.8,.7,.05),mat("#a9d4f2")),x,1.9,.52)));b.position.set(0,0,-6);BG.add(b);
  [[-5,-3],[5,-3]].forEach(([x,z])=>BG.add(tree(x,z)))}
 if(k==="park"){[[-4,-3],[4.5,-2.5],[-5.5,1],[5.5,1.5],[-2,-5.5],[2.5,-5.5]].forEach(([x,z])=>BG.add(tree(x,z)));const bench=new T.Group();bench.add(at(M(box(2,.12,.5),mat("#a0522d")),0,.55,0));[-.8,.8].forEach(x=>bench.add(at(M(box(.1,.55,.4),mat("#555")),x,.27,0)));bench.position.set(3,0,-1.5);BG.add(bench)}
 if(k==="night"){for(let i=0;i<9;i++){const h=3+((i*37)%5);const b=at(M(box(1.6,h,1.6),mat("#2c3560"),{line:false}),-8+i*2,h/2,-8-((i*13)%3));BG.add(b);for(let j=0;j<h*2;j++){if((i+j)%3)continue;BG.add(at(new T.Mesh(box(.25,.3,.02),basic("#f3d27a")),-8.4+i*2+((j%2)*.6),.6+j*.45,-7.15-((i*13)%3)))}}}
 if(k==="stage"){const cur=new T.Group();[-1,1].forEach(s=>{for(let i=0;i<5;i++)cur.add(at(M(cyl(.28,.3,7,12),mat("#8a1c2b"),{line:false}),s*(4.6+i*.45),3.5,-4))});BG.add(cur);
  BG.add(at(M(box(12,.3,.4),mat("#c8902a")),0,7,-4));const spot=new T.SpotLight("#fff1d0",1.2,20,.5,.6);spot.position.set(0,8,4);spot.target.position.set(0,0,0);BG.add(spot);BG.add(spot.target);
  const dj=new T.Group();dj.add(at(M(box(1.8,.9,.7),mat("#1d1d24")),0,.45,0));[-.45,.45].forEach(x=>dj.add(at(M(cyl(.25,.25,.05),mat("#333")),x,.93,0)));dj.position.set(0,0,.9);dj.visible=C.pose==="dj";dj.name="djdesk";BG.add(dj)}
 if(k==="studio"){for(let i=0;i<30;i++){const m=new T.Mesh(new T.SphereGeometry(.07+Math.random()*.06,18,12),mat(["#ffffff","#ffd25a","#ff8fb8","#8fc1ff"][i%4]));const a=Math.random()*Math.PI*2,r=8+Math.random()*4;m.position.set(Math.cos(a)*r,.5+Math.random()*5,Math.sin(a)*r);BG.add(m)}}
}
function tree(x,z){const g=new T.Group();g.add(at(M(cyl(.15,.2,1.2),mat("#7a5234")),0,.6,0));g.add(at(M(sph(.9),mat("#4f9e48")),0,1.7,0));g.add(at(M(sph(.6),mat("#5fb256")),.4,2.2,.2));g.position.set(x,0,z);return g}
/* ------------------------------------------------------------ character */
let CH=null,rig={};
function buildChar(c){const CHg=new T.Group(),rig={};const fem=c.gender==="girl";
 const bw={slim:.86,average:1,chubby:1.22,muscular:1.12}[c.build]||1,H=+c.height||1,hs=+c.head||1;
 const skin=mat(c.skin),top=mat(c.topC),acc=mat(c.accC),bot=mat(c.botC),shoe=mat(c.shoeC),hair=mat(c.hairC);
 const root=new T.Group();CHg.add(root);rig.root=root;
 const legLen=.82*H,hipY=legLen+.18;
 const longTop=["shirt","hoodie","jacket","kurta","uniform","suit","police","doctor","sherwani"].includes(c.top),sleeveSkin=c.top==="tank"||c.top==="saree"&&false;
 /* legs */
 const pelvis=new T.Group();pelvis.position.y=hipY;root.add(pelvis);rig.pelvis=pelvis;rig.pelvisY=hipY;
 const legW=(fem?.12:.13)*Math.min(1.25,bw);
 rig.legs=[];[-1,1].forEach(s=>{const th=new T.Group();th.position.set(s*(fem?.15:.17)*bw,0,0);pelvis.add(th);
  const shorts=c.bottom==="shorts",legMat=(c.bottom==="skirt"||shorts)?skin:bot;
  const thighM=c.bottom==="skirt"?skin:bot;if(c.bottom==="lungi")th.add(at(M(cyl(legW*1.55,legW*1.6,legLen*.55),bot),s*-.03,-legLen*.25,0));
  th.add(at(M(cap(legW,legLen*.36),thighM),0,-legLen*.25,0));
  const kn=new T.Group();kn.position.y=-legLen*.5;th.add(kn);
  kn.add(at(M(cap(legW*.92,legLen*.34),["dhoti","trackpants","jeans"].includes(c.bottom)?bot:skin),0,-legLen*.24,0));
  if(c.bottom==="lungi")kn.add(at(M(cyl(legW*1.6,legW*1.75,legLen*.42),bot),s*-.03,-legLen*.2,0)),kn.add(at(new T.Mesh(cyl(legW*1.77,legW*1.77,.06),acc),s*-.03,-legLen*.4,0));
  if(c.bottom==="dhoti")kn.add(at(M(cyl(legW*1.5,legW*1.7,legLen*.4),bot),0,-legLen*.22,0));
  if(c.bottom==="trackpants")kn.add(at(new T.Mesh(box(.02,legLen*.4,.03),basic("#ffffff")),s*legW*.95,-legLen*.22,0));
  const ft=new T.Group();ft.position.y=-legLen*.5;kn.add(ft);
  const sk=c.shoes;
  if(sk==="barefoot"||sk==="sandals"){ft.add(at(M(sph(.12),skin),0,-.02,.07,0,0,0,1,.55,1.5));if(sk==="sandals"){ft.add(at(M(box(.24,.04,.38),shoe,{lw:.1}),0,-.07,.07));ft.add(at(M(tor(.08,.018,Math.PI),shoe,{line:false}),0,-.03,.12,0,0,0))}}
  else if(sk==="boots"){ft.add(at(M(cap(legW*1.05,.14),shoe),0,.05,0));ft.add(at(M(sph(.15),shoe),0,-.04,.08,0,0,0,1,.65,1.4))}
  else{ft.add(at(M(sph(.16),shoe),0,-.03,.08,0,0,0,1,.62,1.4));if(sk==="sneakers")ft.add(at(new T.Mesh(box(.3,.04,.46),basic("#ffffff")),0,-.1,.08))}
  rig.legs.push({th,kn,ft})});
 /* torso */
 const spine=new T.Group();spine.position.y=hipY+.05;root.add(spine);rig.spine=spine;
 const tw=.36*bw*(fem?.92:1),tl=.42*H;
 const topMat=c.top==="saree"?mat(c.topC):top;
 if(c.build==="chubby")spine.add(at(M(sph(.5),topMat),0,.36,.02,0,0,0,bw*.9,.95,.85));else spine.add(at(M(cap(tw,tl),topMat),0,.38,0,0,0,0,1,1,.78));
 if(c.build==="muscular")spine.add(at(M(sph(.3),topMat),0,.55,.08,0,0,0,1.3,.55,.6));
 if(fem&&c.top!=="saree")spine.add(at(M(sph(.13),topMat,{lw:.05}),-.11,.55,.2,0,0,0,1,.85,.7)),spine.add(at(M(sph(.13),topMat,{lw:.05}),.11,.55,.2,0,0,0,1,.85,.7));
 // waist / belt
 if(!["dress","kurta","saree","sherwani","police","doctor"].includes(c.top))spine.add(at(M(cyl(tw*(c.build==="chubby"?1.28:1),tw*(c.build==="chubby"?1.28:1),.1),mat("#3a2a20"),{lw:.03}),0,-.02,0,0,0,0,1,1,.8));
 // pelvis/hips cover
 if(c.bottom==="skirt")spine.add(at(M(cone(tw*1.9,.6,24),bot),0,-.2,0,Math.PI));
 else spine.add(at(M(sph(tw*1.02),bot),0,-.1,0,0,0,0,1,.55,.8));
 // tops details
 const front=tw*.78;
 if(c.top==="jacket"||c.top==="suit"){spine.add(at(new T.Mesh(box(.2,tl+.25,.04),acc),0,.36,front+.02));[-1,1].forEach(s=>spine.add(at(new T.Mesh(box(.035,tl+.2,.03),basic("#f2efe6")),s*.12,.38,front+.04,0,0,s*.08)));
  if(c.top==="suit")spine.add(at(M(cone(.05,.32,4),mat("#c0392b"),{lw:.08}),0,.44,front+.06,Math.PI))}
 if(c.top==="shirt"||c.top==="uniform"){[-1,1].forEach(s=>spine.add(at(M(box(.14,.06,.08),acc,{lw:.08}),s*.08,.78,front-.02,0,0,s*.5)));for(let i=0;i<4;i++)spine.add(at(new T.Mesh(sph(.018),basic("#333")),0,.66-i*.14,front+.03));if(c.top==="uniform")spine.add(at(M(cone(.05,.36,4),acc,{lw:.08}),0,.5,front+.05,Math.PI))}
 if(c.top==="hoodie"){spine.add(at(M(tor(.2,.07,Math.PI*1.3),top),0,.78,-.05,Math.PI/2.4,0,Math.PI*1.15));spine.add(at(M(box(.42,.2,.05),mat(c.topC)),0,.14,front+.01));[-1,1].forEach(s=>spine.add(at(new T.Mesh(cyl(.012,.012,.25),basic("#ffffff")),s*.07,.6,front+.05)))}
 if(c.top==="kurta"){spine.add(at(M(cyl(tw*1.02,tw*1.35,.6),top),0,-.25,0,0,0,0,1,1,.8));spine.add(at(new T.Mesh(box(.05,.4,.03),acc),0,.6,front+.03));spine.add(at(M(tor(.13,.03),acc,{line:false}),0,.82,0,Math.PI/2))}
 if(c.top==="police"){[-1,1].forEach(s=>{spine.add(at(M(box(.16,.04,.2),mat(dk(c.topC))),s*(tw+.02),.8,0));spine.add(at(M(box(.13,.12,.03),mat(dk(c.topC))),s*.13,.55,front+.02))});spine.add(at(M(new T.OctahedronGeometry(.05),mat("#e0b040"),{lw:.1}),-.14,.66,front+.05));for(let i=0;i<4;i++)spine.add(at(new T.Mesh(sph(.02),basic("#e0b040")),0,.7-i*.15,front+.03));spine.add(at(M(cyl(tw,tw,.11),mat("#5a3a22"),{lw:.03}),0,-.02,0,0,0,0,1,1,.8))}
 if(c.top==="doctor"){spine.add(at(new T.Mesh(box(.22,tl+.25,.04),acc),0,.36,front+.01));spine.add(at(M(cyl(tw*1.03,tw*1.25,.55),top),0,-.25,0,0,0,0,1,1,.82));[-1,1].forEach(s=>spine.add(at(M(box(.07,.55,.03),top,{line:false}),s*.13,.5,front+.04,0,0,s*.12)));
  spine.add(at(new T.Mesh(tor(.16,.016,Math.PI*1.3),basic("#222")),0,.78,front-.04,-.3,0,Math.PI*1.15));spine.add(at(M(cyl(.045,.045,.02),mat("#c0c0c8"),{lw:.1}),.06,.52,front+.06,Math.PI/2))}
 if(c.top==="cricket"){const cv=document.createElement("canvas");cv.width=cv.height=256;const x=cv.getContext("2d");x.fillStyle=c.topC;x.fillRect(0,0,256,256);x.fillStyle=c.accC;x.fillRect(0,30,256,26);x.font="900 120px Arial Black,Arial";x.textAlign="center";x.textBaseline="middle";x.lineWidth=10;x.strokeStyle="#fff";x.strokeText("07",128,150);x.fillText("07",128,150);const tx=new T.CanvasTexture(cv);tx.encoding=T.sRGBEncoding;
  spine.add(at(new T.Mesh(new T.PlaneGeometry(.42,.42),new T.MeshStandardMaterial({map:tx,roughness:.8})),0,.42,front+.035))}
 if(c.top==="sherwani"){spine.add(at(M(cyl(tw*1.02,tw*1.4,.75),top),0,-.32,0,0,0,0,1,1,.8));spine.add(at(M(cyl(.12,.13,.1),acc,{lw:.05}),0,.86,0));for(let i=0;i<6;i++)spine.add(at(new T.Mesh(sph(.025),basic("#e0b040")),0,.74-i*.13,front+.03));spine.add(at(M(box(.5,.09,.03),acc,{line:false}),0,-.02,front+.02))}
 if(c.top==="dress")spine.add(at(M(cone(tw*2.1,.9,28),top),0,-.3,0,Math.PI));
 if(c.top==="saree"){spine.add(at(M(cone(tw*1.8,1.25,28),top),0,-.48,0,Math.PI));spine.add(at(M(box(.2,1.0,.04),acc),.05,.38,front+.04,0,0,-.55));spine.add(at(M(box(.2,.7,.04),acc),.3,.5,-.1,0,0,.3))}
 if(["tshirt","tank","cricket"].includes(c.top))spine.add(at(M(tor(.12,.025),mat(c.top==="tank"?c.topC:c.accC),{line:false}),0,.8,.02,Math.PI/2));
 // accessories on torso
 if(c.acc.includes("chain")){spine.add(at(new T.Mesh(tor(.15,.014,Math.PI),mat("#f0c850")),0,.8,front-.02,-.25,0,Math.PI));spine.add(at(M(cyl(.05,.05,.02),mat("#f2cf55"),{lw:.08}),0,.62,front+.05,Math.PI/2))}
 if(c.acc.includes("backpack")){spine.add(at(M(cap(.24,.25),mat(c.accC)),0,.42,-tw*.9,0,0,0,1,1,.6));[-1,1].forEach(s=>spine.add(at(new T.Mesh(box(.05,.6,.03),mat("#333")),s*.15,.45,front,0,0,0)))}
 if(c.acc.includes("scarf")){spine.add(at(M(tor(.17,.07),mat(c.accC)),0,.83,0,Math.PI/2));spine.add(at(M(box(.13,.45,.05),mat(c.accC)),.08,.6,front+.06,0,0,-.1))}
 /* arms */
 rig.arms=[];const shY=.74,shX=tw+.06;
 [-1,1].forEach(s=>{const sh=new T.Group();sh.position.set(s*shX,shY,0);spine.add(sh);
  const sleeve=longTop||c.top==="tshirt"?top:skin;
  sh.add(at(M(sph(.12*Math.min(bw,1.2)),c.top==="tank"||c.top==="dress"||c.top==="saree"?skin:top),0,0,0));
  if(c.top==="tshirt"||c.top==="cricket"){sh.add(at(M(cap(.11,.08),top),0,-.1,0));sh.add(at(M(cap(.095,.18),skin),0,-.24,0))}
  else sh.add(at(M(cap(.1*Math.min(bw,1.15),.26),longTop?top:skin),0,-.2,0));
  const el=new T.Group();el.position.y=-.4;sh.add(el);
  el.add(at(M(cap(.09*Math.min(bw,1.1),.22),longTop?top:skin),0,-.17,0));
  if(c.acc.includes("watch")&&s>0)el.add(at(M(tor(.09,.025),mat("#333"),{line:false}),0,-.3,0,Math.PI/2));
  const hd=new T.Group();hd.position.y=-.36;el.add(hd);hd.add(at(M(sph(.1),skin),0,-.04,0,0,0,0,.95,1.1,.8));
  if(c.acc.includes("mic")&&s>0)hd.add(at(M(cyl(.04,.03,.28),mat("#222")),0,-.02,.08,Math.PI/2.2)),hd.add(at(M(sph(.07),mat("#888")),0,.1,.18));
  rig.arms.push({sh,el,hd})});
 /* neck + head */
 const neck=new T.Group();neck.position.y=.86;spine.add(neck);neck.add(at(M(cyl(.1,.11,.2),skin),0,.05,0));
 if(c.acc.includes("headphones")&&!c.acc.includes("cap")){neck.add(at(new T.Mesh(tor(.2,.035,Math.PI*1.2),mat("#d9a33a")),0,.02,.02,Math.PI/2,0,-Math.PI*.1));[-1,1].forEach(s=>neck.add(at(M(cyl(.09,.09,.08),mat("#d9a33a")),s*.21,0,.06,0,0,Math.PI/2)))}
 const head=new T.Group();head.position.y=.48*hs+.1;head.scale.setScalar(hs);neck.add(head);rig.head=head;rig.neck=neck;
 const FS={round:[1,1.02,.95],oval:[.94,1.07,.93],long:[.88,1.15,.92],square:[1.04,.98,.95],chubby:[1.1,.98,.97]}[c.faceShape]||[1,1.02,.95];
 head.add(at(M(sph(.48),skin),0,0,0,0,0,0,...FS));
 head.add(at(M(sph(.24),skin),0,-.22,.12,0,0,0,(c.build==="chubby"||c.faceShape==="chubby"?1.3:1)*FS[0],.9,.9));
 if(c.faceShape==="square")head.add(at(M(box(.62,.22,.4),skin,{line:false}),0,-.24,.08));
 [-1,1].forEach(s=>head.add(at(M(sph(.09),skin),s*.47,-.02,0,0,0,0,.6,1,1)));
 face(head,c,fem);
 hairBuild(head,c.acc.includes("turban")&&!["long","ponytail","braids","bob"].includes(c.hair)?Object.assign({},c,{hair:"crew"}):c,hair,fem);
 accHead(head,c);
 prop(rig,c,spine);
 applyPoseTo(rig,c,0);return {g:CHg,rig,c}}
let GROUP=[],GB=[],bubbleSp=null;try{GROUP=JSON.parse(localStorage.getItem("cc3d-group")||"[]")}catch(e){GROUP=[]}
function groupConf(k){if(k.startsWith("p:"))return PRESETS[k.slice(2)];const c=LIST.find(x=>x.name===k.slice(2));return c?Object.assign({},BASE,c):null}
function build(){if(CH)S.remove(CH);GB.forEach(b=>S.remove(b.g));GB=[];const m=buildChar(C);CH=m.g;rig=m.rig;S.add(CH);
 GROUP.forEach(k=>{const c=groupConf(k);if(c){const b=buildChar(c);GB.push(b);S.add(b.g)}});
 const n=1+GB.length,gap=1.55;const xs=Array.from({length:n},(_,i)=>(i-(n-1)/2)*gap);CH.position.x=xs[0];GB.forEach((b,i)=>{b.g.position.x=xs[i+1];b.g.rotation.y=-.18});CH.rotation.y=n>1?.18:0;
 target.x=0;groupDist=n>1?1+.22*(n-1):1;
 const dj=BG.getObjectByName("djdesk");if(dj){dj.visible=C.pose==="dj"&&!GB.length;dj.position.x=CH.position.x}
 bubble()}
let groupDist=1;
function bubble(){bubbleAt(C.say,CH.position.x+1.1,3.6*(+C.height||1))}
function bubbleAt(txt,bx0,by0){if(bubbleSp){S.remove(bubbleSp);bubbleSp=null}const t=(txt||"").trim();if(!t)return;
 const cv=document.createElement("canvas");cv.width=1024;cv.height=512;const x=cv.getContext("2d");x.font="700 64px system-ui,'Noto Sans Telugu',sans-serif";
 const words=t.split(/\s+/),lines=[];let l="";for(const w of words){const tt=l?l+" "+w:w;if(x.measureText(tt).width>820&&l){lines.push(l);l=w}else l=tt}if(l)lines.push(l);const L=lines.slice(0,4);
 const bh=L.length*76+70,bw=Math.min(980,Math.max(...L.map(s=>x.measureText(s).width))+110),bx=(1024-bw)/2,by=380-bh;
 x.fillStyle="#fff";x.strokeStyle="#241816";x.lineWidth=10;x.beginPath();x.roundRect?x.roundRect(bx,by,bw,bh,60):x.rect(bx,by,bw,bh);x.fill();x.stroke();
 x.beginPath();x.moveTo(470,by+bh-6);x.lineTo(500,470);x.lineTo(560,by+bh-6);x.closePath();x.fill();x.stroke();x.fillRect(476,by+bh-14,78,12);
 x.fillStyle="#241816";x.textAlign="center";x.textBaseline="middle";L.forEach((s,i)=>x.fillText(s,512,by+50+i*76));
 const tx=new T.CanvasTexture(cv);tx.encoding=T.sRGBEncoding;bubbleSp=new T.Sprite(new T.SpriteMaterial({map:tx,transparent:true,depthTest:false}));bubbleSp.scale.set(3.2,1.6,1);bubbleSp.renderOrder=10;
 bubbleSp.position.set(bx0,by0,0);S.add(bubbleSp)}
function prop(rig,c,spine){const h=rig.arms[1].hd,p=c.prop||"none",ac=mat(c.accC);
 if(p==="phone")h.add(at(M(box(.13,.24,.025),mat("#15151b")),0,-.12,.08,.3)),h.add(at(new T.Mesh(box(.11,.2,.005),basic("#7ab8ff")),0,-.12,.095,.3));
 if(p==="tea"){h.add(at(M(cyl(.075,.06,.13),mat("#f4f4f4")),0,-.1,.1));h.add(at(new T.Mesh(cyl(.065,.065,.01),basic("#a0622d")),0,-.04,.1));h.add(at(M(tor(.04,.012,Math.PI*1.2),mat("#f4f4f4"),{line:false}),.08,-.1,.1,0,0,-Math.PI/2))}
 if(p==="bat"){h.add(at(M(cyl(.025,.025,.3),mat("#3a2a20")),0,-.05,.05));h.add(at(M(box(.14,.7,.05),mat("#e8cf9a")),0,-.55,.05))}
 if(p==="book")h.add(at(M(box(.28,.36,.07),ac),0,-.14,.1,.2));
 if(p==="flowers"){h.add(at(M(cyl(.02,.02,.4),mat("#2f7a45")),0,0,.05));[[0,.25],[-.07,.2],[.07,.2],[0,.15]].forEach(([x,y],i)=>h.add(at(M(sph(.06),mat(["#ff6fa8","#ffd25a","#ff8a3d","#c06fff"][i])),x,y,.05)))}
 if(p==="umbrella"){h.add(at(M(cyl(.015,.015,1.1),mat("#333")),0,.5,0));const cn=at(M(new T.ConeGeometry(.8,.4,12,1,true),ac),0,1.15,0);cn.children.forEach(m=>{m.material=m.material===LINE?LINE:ac;m.material.side=T.DoubleSide});h.add(cn)}
 if(p==="guitar"){const gt=new T.Group();gt.add(at(M(sph(.22),mat("#b5651d")),0,0,0,0,0,0,1,1.1,.35));gt.add(at(M(sph(.16),mat("#b5651d")),0,.26,0,0,0,0,1,1,.35));gt.add(at(new T.Mesh(cyl(.06,.06,.02),basic("#2a1a10")),0,.05,.08,Math.PI/2));gt.add(at(M(box(.07,.7,.04),mat("#5a3a22")),0,.7,0));gt.position.set(0,.28,.32);gt.rotation.set(0,0,-.9);spine.add(gt)}}
function face(h,c,fem){const dark=basic("#241816"),sk=mat(c.skin);
 const eye=(s)=>{const g=new T.Group();g.position.set(s*.19,-.03,.4);g.rotation.y=s*.22;h.add(g);const e=c.eyes;
  const wink=e==="wink"&&s>0;
  if(e==="happy"||wink){g.add(tube([[-.13,-.02,0],[-.06,.08,.03],[.06,.08,.03],[.13,-.02,0]],.026,dark));return}
  if(e==="sleepy"){g.add(tube([[-.13,.02,0],[0,-.04,.03],[.13,.02,0]],.024,dark));return}
  if(e==="heart"){const sh=new T.Shape();sh.moveTo(0,-.1);sh.bezierCurveTo(-.16,.0,-.1,.14,0,.05);sh.bezierCurveTo(.1,.14,.16,0,0,-.1);const m=new T.Mesh(new T.ExtrudeGeometry(sh,{depth:.03,bevelEnabled:false}),basic("#ff4d6d"));g.add(m);return}
  const white=new T.Mesh(sph(.13),basic("#ffffff"));white.scale.set(1,e==="shock"?1.3:1.15,.35);g.add(white);
  if(e==="shock"){g.add(at(new T.Mesh(sph(.035),basic("#140c0c")),0,0,.05));return}
  const ir=new T.Mesh(sph(.095),basic(c.eyeC));ir.scale.set(1,1.2,.3);ir.position.set(0,-.01,.035);g.add(ir);
  const pu=new T.Mesh(sph(.05),basic("#140c0c"));pu.scale.set(1,1.3,.3);pu.position.set(0,-.01,.05);g.add(pu);
  g.add(at(new T.Mesh(sph(.03),basic("#ffffff")),.035,.05,.07));
  if(e==="smug"||e==="angry"){const lid=new T.Mesh(sph(.14),sk);lid.scale.set(1.02,.6,.42);lid.position.set(0,e==="angry"?.15:.13,0);if(e==="angry")lid.rotation.z=-s*.35;g.add(lid)}
  g.add(at(tube([[-.15,.07,.06],[-.05,.12,.075],[.08,.12,.07],[.18,.08,.05],[.22,.11,.04]],fem?.02:.016,dark),0,e==="smug"?-.05:0,0,0,0,0,s,1,1));
  if(fem)g.add(at(tube([[.18,.08,.05],[.25,.15,.03]],.012,dark),0,0,0,0,0,0,s,1,1))};
 eye(-1);eye(1);
 // brows
 const b=c.brows,hb=mat(c.hairC),bw=b==="thick"?.055:.035;[-1,1].forEach(s=>{let rz=0,y=.18;if(b==="angry")rz=s*-.35;if(b==="worried")rz=s*.3;if(b==="raised"&&s>0){y=.24;rz=-s*.15}
  h.add(at(new T.Mesh(box(.2,bw,.04),hb),s*.19,y,.43,0,s*.2,rz))});
 // nose
 {const nm=mat(dk(c.skin)),n=c.nose||"small";if(n==="button")h.add(at(M(sph(.05),mat(c.skin),{line:false}),0,-.13,.47));else if(n==="pointy")h.add(at(new T.Mesh(cone(.045,.18,10),nm),0,-.12,.5,Math.PI/2.2));else if(n==="big")h.add(at(M(sph(.085),mat(c.skin),{line:false}),0,-.14,.46,0,0,0,1,.9,1));else h.add(at(new T.Mesh(cone(.035,.1,8),nm),0,-.13,.48,Math.PI/2.3))}
 // mouth
 const mo=c.mouth;
 if(mo==="smile")h.add(tube([[-.1,-.27,.42],[0,-.32,.44],[.1,-.27,.42]],.014,dark));
 if(mo==="smirk")h.add(tube([[-.08,-.29,.41],[0,-.31,.43],[.08,-.29,.42],[.13,-.25,.39]],.014,dark));
 if(mo==="flat")h.add(tube([[-.08,-.29,.42],[.08,-.29,.42]],.014,dark));
 if(mo==="frown")h.add(tube([[-.1,-.32,.41],[0,-.27,.43],[.1,-.32,.41]],.014,dark));
 if(mo==="o")h.add(at(new T.Mesh(sph(.06),basic("#6e2424")),0,-.29,.42,0,0,0,1,1.3,.4));
 if(mo==="grin"||mo==="tongue"||mo==="teeth"){const m=new T.Mesh(new T.CircleGeometry(.15,28,Math.PI,Math.PI),basic("#6e2424"));at(m,0,-.22,.455,-.25);h.add(m);h.add(at(new T.Mesh(box(.26,.045,.02),basic("#ffffff")),0,-.235,.465,-.25));
  if(mo!=="teeth")h.add(at(new T.Mesh(new T.CircleGeometry(.07,20),basic("#e57373")),0,-.32,.44,-.3,0,0,1,.55,1));else h.add(at(new T.Mesh(box(.24,.04,.02),basic("#ffffff")),0,-.33,.44,-.3))}
 if(mo==="tongue")h.add(at(M(sph(.06),mat("#e57373"),{lw:.08}),0,-.38,.44,0,0,0,1,1.2,.5));
 if(c.blush)[-1,1].forEach(s=>{const b=new T.Mesh(new T.CircleGeometry(.07,20),new T.MeshBasicMaterial({color:"#e77a7a",transparent:true,opacity:.38}));at(b,s*.27,-.18,.415,0,s*.5,0,1,.5,1);h.add(b)});
 // facial hair
 const fh=c.face_hair,hm=mat(c.hairC);
 if(fh==="mustache")[-1,1].forEach(s=>h.add(at(M(cap(.035,.1),hm,{lw:.08}),s*.07,-.22,.45,0,0,s*1.3)));
 if(fh==="beard"){h.add(at(M(sph(.36),hm,{lw:.04}),0,-.26,.12,0,0,0,1.05,.75,.85));h.add(at(new T.Mesh(box(.2,.06,.04),basic("#6e2424")),0,-.27,.43))}
 if(fh==="stubble")h.add(at(new T.Mesh(sph(.37),new T.MeshBasicMaterial({color:"#3a2a22",transparent:true,opacity:.22})),0,-.25,.12,0,0,0,1.05,.7,.88));
 if(c.acc.includes("bindi"))h.add(at(new T.Mesh(sph(.025),basic("#c0392b")),0,.08,.475));
 if(c.acc.includes("tilak"))h.add(at(new T.Mesh(box(.03,.12,.02),basic("#c0392b")),0,.14,.465));
}
function dk(c){const x=new T.Color(c);x.multiplyScalar(.78);return "#"+x.getHexString()}
function hairBuild(h,c,hm,fem){const st=c.hair;if(st==="bald"){h.add(at(new T.Mesh(sph(.08),new T.MeshBasicMaterial({color:"#fff",transparent:true,opacity:.35})),-.15,.38,.25));return}
 const capH=(phi,rx,sx,sy,sz)=>{const o=hemiCap(.52,phi||Math.PI*.55,hm);at(o,0,.02,-.03,rx==null?-.25:rx,0,0,sx||1,sy||1,sz||1);h.add(o);return o};
 const fringe=(n,len,swing)=>{for(let i=0;i<n;i++){const x=-.33+i*(.66/(n-1));h.add(at(M(cone(.075,len),hm,{lw:.05}),x,.12,.38,Math.PI-.5,0,x*.4+(swing||.2)))}};
 if(st==="mohawk"){h.add(at(M(sph(.5),mat(dk(c.skin))),0,.02,-.02,0,0,0,1.01,1.02,.96));for(let i=0;i<7;i++)h.add(at(M(cone(.09,.35),hm,{lw:.05}),0,.42-Math.abs(i-3)*.04,.3-i*.12,-.3+i*.12));return}
 if(st==="crew"){capH(Math.PI*.48,-.2,1,.98,1);return}
 if(st==="hero"){capH();[[-.35,.35,-.1,.6,.4],[-.15,.48,-.05,.25,.45],[.08,.5,-.05,-.05,.5],[.3,.4,-.08,-.45,.45],[.45,.18,-.1,-.85,.35],[-.45,.1,-.12,.95,.35],[0,.35,-.38,.1,.4],[-.28,.25,-.36,.5,.36],[.28,.25,-.36,-.4,.36]].forEach(([x,y,z,rz,hh])=>h.add(at(M(cone(.13,hh),hm,{lw:.05}),x,y+hh*.3,z,-.35,0,rz)));fringe(7,.32);return}
 if(st==="messy"){capH();for(let i=0;i<14;i++){const a=i/14*Math.PI*2;h.add(at(M(cone(.09,.26),hm,{lw:.05}),Math.cos(a)*.32,.42+Math.sin(i)*.04,Math.sin(a)*.28-.05,Math.sin(a)*.7,0,-Math.cos(a)*.7))}fringe(6,.28,.05);return}
 if(st==="side"){capH(Math.PI*.5);h.add(at(M(sph(.26),hm),-.18,.36,.22,0,0,.5,1.4,.55,.9));h.add(at(M(sph(.2),hm),.24,.3,.25,0,0,-.3,1,.5,.8));return}
 if(st==="curly"||st==="afro"){const r=st==="afro"?.62:.5,n=st==="afro"?40:28;capH(Math.PI*.62,-.62,1.04,1,1.04);for(let i=0;i<n;i++){const th=i*2.399,ph=Math.acos(1-(i+.5)/n*1.15);const x=Math.sin(ph)*Math.cos(th)*r,z=Math.sin(ph)*Math.sin(th)*r,y=Math.cos(ph)*r+.05;if(z>.22&&y<.28)continue;h.add(at(M(sph(st==="afro"?.2:.16),hm,{lw:.06}),x,y,z))}return}
 if(st==="long"||st==="bob"||st==="braids"||st==="ponytail"||st==="bun"){capH(Math.PI*.58,-.3);fringe(8,st==="bob"?.3:.26,.0);
  if(st==="long"){h.add(at(M(cap(.46,.7),hm),0,-.45,-.18,0,0,0,1.05,1,.5));[-1,1].forEach(s=>h.add(at(M(cap(.1,.55),hm),s*.44,-.35,.12)))}
  if(st==="bob"){h.add(at(M(sph(.55),hm),0,-.08,-.06,0,0,0,1.06,.82,.95));}
  if(st==="ponytail"){h.add(at(M(sph(.07),mat(c.accC)),0,.15,-.5));h.add(at(M(cap(.12,.5),hm),0,-.2,-.6,.35))}
  if(st==="bun"){h.add(at(M(sph(.22),hm),0,.55,-.12))}
  if(st==="braids"){[-1,1].forEach(s=>{for(let i=0;i<6;i++)h.add(at(M(sph(.085-i*.004),hm,{lw:.06}),s*.42,-.15-i*.13,.0+i*.04));h.add(at(M(sph(.045),mat(c.accC)),s*.42,-.95,.24))})}
  return}
}
function accHead(h,c){const a=c.acc;
 if(a.includes("cap")){const cp=hemiCap(.56,Math.PI*.5,mat(c.accC));at(cp,0,.08,-.02,-.12);h.add(cp);h.add(at(M(cyl(.36,.36,.04,24),mat(c.accC)),0,.24,.42,.25,0,0,1,1,.9))}
 if(a.includes("beanie")){const b=hemiCap(.56,Math.PI*.55,mat(c.accC));at(b,0,.1,-.02,-.15);h.add(b);h.add(at(M(sph(.12),mat("#ffffff")),0,.68,-.1))}
 if(a.includes("headphones")&&a.includes("cap")){h.add(at(new T.Mesh(tor(.52,.04,Math.PI),mat("#d9a33a")),0,.05,0,0,0,0));[-1,1].forEach(s=>h.add(at(M(cyl(.13,.13,.1),mat("#d9a33a")),s*.5,0,0,0,0,Math.PI/2)))}
 if(a.includes("turban")){const tm=mat(c.accC);h.add(at(M(sph(.56),tm),0,.18,-.03,-.15,0,0,1,.62,1));[.0,.1,.2].forEach((y,i)=>h.add(at(M(tor(.47-i*.06,.07),tm,{lw:.04}),0,.2+y,-.03,Math.PI/2-.15,0,i*.4)));h.add(at(M(sph(.07),mat("#e0b040")),0,.38,.43))}
 if(a.includes("earrings"))[-1,1].forEach(s=>h.add(at(M(sph(.03),mat(c.gender==="girl"?"#f0c850":"#dfe3ea"),{lw:.15}),s*.5,-.14,.03)));
 if(a.includes("flower"))h.add(at(M(sph(.08),mat("#ff6fa8")),.35,.32,.2)),h.add(at(new T.Mesh(sph(.035),basic("#ffe27a")),.38,.34,.27));
 const g=c.glasses;if(g==="none")return;
 if(g==="shades_up"){const sg=new T.Group();at(sg,0,.38,.3,-.55);[-1,1].forEach(s=>{sg.add(at(M(box(.24,.13,.04),mat("#15151b"),{lw:.08}),s*.15,0,0));sg.add(at(new T.Mesh(box(.26,.025,.05),mat("#d9a33a")),s*.15,.07,0))});h.add(sg);return}
 const gl=new T.Group();gl.position.set(0,-.03,.47);h.add(gl);
 [-1,1].forEach(s=>{if(g==="round")gl.add(at(new T.Mesh(tor(.11,.015),basic("#241816")),s*.19,0,0));
  if(g==="square")gl.add(at(M(box(.24,.17,.01),new T.MeshBasicMaterial({color:"#ffffff",transparent:true,opacity:.15}),{lw:.12}),s*.19,0,0));
  if(g==="sunglasses")gl.add(at(M(box(.25,.15,.03),mat("#121218"),{lw:.1}),s*.19,0,0))});
 gl.add(at(new T.Mesh(box(.1,.015,.015),basic("#241816")),0,.02,0))}
/* ------------------------------------------------------------ poses & animation */
// arm values: [raise outward, swing forward(-)/back(+), elbow bend inward, forearm forward(-)]
const P={idle:{L:[.12,0,.1,0]},wave:{L:[.12,0,.1,0],R:[2.5,0,.5,0]},cheer:{L:[2.5,0,-.2,0]},hips:{L:[.8,0,1.75,0]},pockets:{L:[.28,.1,.75,0]},
 think:{L:[.25,-.35,1.5,0],R:[.15,-.55,.2,-2.1]},point:{L:[.12,0,.1,0],R:[.12,-1.5,0,0]},cross:{L:[.15,-.55,1.95,0]},dance:{L:[1.2,0,.8,0]},walk:{L:[.1,0,.1,0]},run:{L:[.15,0,0,-1.3]},jump:{L:[2.4,0,0,0]},
 namaste:{L:[.15,-.65,1.55,-.35]},dj:{L:[.22,-.95,.9,0]},bow:{L:[.1,-.3,.4,0]},sit:{L:[.2,-.4,.9,0]},shrug:{L:[.5,-.2,2.3,-.6]},facepalm:{L:[.12,0,.1,0],R:[.25,-.7,.3,-2.3]},laugh:{L:[.25,-.45,1.5,0]}};
function setArm(rig,i,v){const a=rig.arms[i],sg=i?1:-1;a.sh.rotation.set(v[1],0,sg*v[0]);a.el.rotation.set(v[3],0,-sg*v[2])}
function applyPoseTo(rig,c,t){if(!rig.arms)return;const p=P[c.pose]||P.idle;setArm(rig,0,p.L);setArm(rig,1,p.R||p.L);
 rig.arms[1].sh.position.z=c.pose==="cross"?.05:0;
 rig.legs.forEach(l=>{l.th.rotation.set(0,0,0);l.kn.rotation.set(0,0,0)});rig.root.position.y=0;rig.spine.rotation.set(0,0,0);rig.head.rotation.set(0,0,0);
 if(c.pose==="think"){rig.head.rotation.z=.15;rig.head.rotation.x=.08}
 if(c.pose==="bow"){rig.spine.rotation.x=.55;rig.head.rotation.x=.2}
 if(c.pose==="facepalm"){rig.head.rotation.x=.3;rig.head.rotation.z=-.1}
 if(c.pose==="sit"){rig.pelvis.position.y=rig.pelvisY-.0;rig.root.position.y=-(rig.pelvisY-.32);rig.legs.forEach((l,i)=>{l.th.rotation.set(-1.45,0,(i?-1:1)*.55);l.kn.rotation.set(1.9,0,(i?1:-1)*.9)})}
 if(c.pose==="sit"&&!c.anim)return;
 if(!c.anim)return;const ph=t;
 rig.spine.rotation.x=Math.sin(ph*2.2)*.01;rig.head.rotation.x+=Math.sin(ph*1.7)*.03;
 if(c.pose==="wave")rig.arms[1].el.rotation.z=-(.5+Math.sin(ph*9)*.45);
 if(c.pose==="cheer"){const b=Math.abs(Math.sin(ph*6));rig.root.position.y=b*.12;rig.arms.forEach((a,i)=>a.sh.rotation.z=(i?1:-1)*(2.5+Math.sin(ph*12+i)*.15));rig.head.rotation.z=Math.sin(ph*6)*.08}
 if(c.pose==="dance"){const b=ph*7;rig.root.position.y=Math.abs(Math.sin(b))*.1;rig.spine.rotation.z=Math.sin(b)*.12;rig.arms.forEach((a,i)=>{const sg=i?1:-1;a.sh.rotation.z=sg*(1.2+Math.sin(b+i*Math.PI)*.8);a.el.rotation.z=-sg*(.8+Math.sin(b+i)*.5)});rig.legs.forEach((l,i)=>{l.th.rotation.x=-Math.sin(b+i*Math.PI)*.35;l.kn.rotation.x=Math.max(0,Math.sin(b+i*Math.PI))*.6});rig.head.rotation.z=Math.sin(b)*.15}
 if(c.pose==="walk"||c.pose==="run"){const run=c.pose==="run",sp=run?11:6,k=run?.8:.45,b=ph*sp;rig.legs.forEach((l,i)=>{const s=Math.sin(b+i*Math.PI);l.th.rotation.x=s*k;l.kn.rotation.x=Math.max(0,-s)*k*1.4});
  rig.arms.forEach((a,i)=>{a.sh.rotation.x=-Math.sin(b+i*Math.PI)*k*(run?1.2:1)});rig.root.position.y=Math.abs(Math.sin(b))*.05;if(run)rig.spine.rotation.x=.15}
 if(c.pose==="jump"){const j=(ph*1.3)%1,tk=Math.sin(j*Math.PI);rig.root.position.y=tk*.7;rig.legs.forEach(l=>{l.th.rotation.x=-tk*.7;l.kn.rotation.x=tk*1.2});rig.arms.forEach((a,i)=>a.sh.rotation.z=(i?1:-1)*(2.4-tk*.4))}
 if(c.pose==="dj"){rig.head.rotation.x=Math.sin(ph*8)*.12;rig.arms[1].sh.rotation.x=-.95+Math.sin(ph*8)*.12;rig.root.position.y=Math.abs(Math.sin(ph*4))*.02}
 if(["hips","pockets","idle","cross","namaste","point"].includes(c.pose))rig.root.position.y=Math.abs(Math.sin(ph*1.1))*.015;
 if(c.pose==="laugh"){rig.spine.rotation.x=.12+Math.abs(Math.sin(ph*9))*.06;rig.head.rotation.x=-.25+Math.sin(ph*9)*.05;rig.root.position.y=Math.abs(Math.sin(ph*9))*.03}
 if(c.pose==="shrug"){rig.head.rotation.z=Math.sin(ph*2)*.12}}
/* ------------------------------------------------------------ camera controls */
let yaw=.35,pitch=.1,dist=6.4,auto=false,drag=false,lx=0,ly=0,pinch=0;const target=new T.Vector3(0,1.45,0);
function place(){let d=dist*groupDist;if(Cam.aspect<1)d*=Math.max(1,.8/Cam.aspect);Cam.position.set(target.x+Math.sin(yaw)*Math.cos(pitch)*d,target.y+Math.sin(pitch)*d,target.z+Math.cos(yaw)*Math.cos(pitch)*d);Cam.lookAt(target)}
const cv=R.domElement;cv.style.touchAction="none";const pts=new Map();
cv.addEventListener("pointerdown",e=>{pts.set(e.pointerId,[e.clientX,e.clientY]);drag=true;lx=e.clientX;ly=e.clientY;cv.setPointerCapture(e.pointerId)});
cv.addEventListener("pointermove",e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,[e.clientX,e.clientY]);if(pts.size===2){const [a,b]=[...pts.values()];const d=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch)dist=Math.min(14,Math.max(2.2,dist*pinch/d));pinch=d;return}
 yaw-=(e.clientX-lx)*.01;pitch=Math.min(1.1,Math.max(-.2,pitch+(e.clientY-ly)*.006));lx=e.clientX;ly=e.clientY;setAuto(false)});
const up=e=>{pts.delete(e.pointerId);if(pts.size<2)pinch=0;if(!pts.size)drag=false};cv.addEventListener("pointerup",up);cv.addEventListener("pointercancel",up);
cv.addEventListener("wheel",e=>{e.preventDefault();dist=Math.min(14,Math.max(2.2,dist*(1+e.deltaY*.001)))},{passive:false});
function setAuto(v){auto=v;const b=$("#bSpin");if(b)b.textContent=auto?"⏸ Stop":"🔄 Spin"}
function resize(){const w=wrap.clientWidth,h=wrap.clientHeight;R.setSize(w,h,false);cv.style.width=w+"px";cv.style.height=h+"px";Cam.aspect=w/h;Cam.fov=w<h?46:35;Cam.updateProjectionMatrix()}
window.addEventListener("resize",resize);try{new ResizeObserver(()=>resize()).observe(wrap)}catch(e){}
/* ------------------------------------------------------------ storage */
const KEY="cc3d-chars";let LIST=[];try{LIST=JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){LIST=[]}
const saveList=()=>{try{localStorage.setItem(KEY,JSON.stringify(LIST))}catch(e){}};
let DL=null;try{window.claude&&window.claude.use&&window.claude.use("downloads").then(d=>{DL=d}).catch(()=>{})}catch(e){}
async function saveFile(blob,name){try{if(DL){await DL.save({filename:name,data:blob});return}}catch(e){toast("Download was cancelled.");return}const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove()}
function toast(t){const el=$("#toast");el.textContent=t;el.classList.add("on");clearTimeout(toast.t);toast.t=setTimeout(()=>el.classList.remove("on"),2200)}
/* ------------------------------------------------------------ UI */
let tab="body";
const TABS=[["body","🧍 Body"],["face","🙂 Face"],["hair","💇 Hair"],["outfit","👕 Outfit"],["acc","🎧 Extras"],["pose","🕺 Pose"],["scene","🏫 Scene"],["save","💾 Save"],["video","🎬 Story video"]];
const chips=(k,obj)=>`<div class="chips">${Object.entries(obj).map(([v,n])=>`<button type="button" class="chip" data-set="${k}" data-v="${v}" aria-pressed="${C[k]===v}">${n}</button>`).join("")}</div>`;
const sw=(k,list,label)=>`<div class="row"><b>${label}</b><div class="sws">${list.map(c=>`<button type="button" class="sw${C[k]===c?" on":""}" style="background:${c}" data-col="${k}" data-v="${c}" aria-label="${c}"></button>`).join("")}<label class="sw pick" title="Any colour"><input type="color" value="${C[k]}" data-pick="${k}"></label></div></div>`;
const slider=(k,label,min,max,st)=>`<label class="sl"><span>${label}</span><input type="range" min="${min}" max="${max}" step="${st}" value="${C[k]}" data-num="${k}"></label>`;
function panel(){const b=$("#panel");let h="";
 if(tab==="body")h=`<h3>Body</h3>${chips("gender",OPT.gender)}${chips("build",OPT.build)}${slider("height","Height",.8,1.2,.01)}${slider("head","Head size",.8,1.3,.01)}${sw("skin",SKIN,"Skin colour")}`;
 if(tab==="face")h=`<h3>Quick expression</h3><div class="chips">${Object.entries(EXPR).map(([k,[n]])=>`<button type="button" class="chip" data-expr="${k}">${n}</button>`).join("")}</div><h3>Face shape</h3>${chips("faceShape",OPT.faceShape)}<h3>Nose</h3>${chips("nose",OPT.nose)}<h3>Eyes</h3>${chips("eyes",OPT.eyes)}${sw("eyeC",EYEC,"Eye colour")}<h3>Eyebrows</h3>${chips("brows",OPT.brows)}<h3>Mouth</h3>${chips("mouth",OPT.mouth)}<h3>Facial hair</h3>${chips("face_hair",OPT.face_hair)}<h3>Glasses</h3>${chips("glasses",OPT.glasses)}<label class="ck"><input type="checkbox" data-bool="blush" ${C.blush?"checked":""}> Blush on cheeks</label>`;
 if(tab==="hair")h=`<h3>Hairstyle</h3>${chips("hair",OPT.hair)}${sw("hairC",HAIRC,"Hair colour")}`;
 if(tab==="outfit")h=`<h3>Top / dress</h3>${chips("top",OPT.top)}${sw("topC",CLOTH,"Top colour")}${sw("accC",CLOTH,"Second colour (inner shirt, trim, tie, scarf, cap)")}<h3>Bottom</h3>${chips("bottom",OPT.bottom)}${sw("botC",CLOTH,"Bottom colour")}<h3>Shoes</h3>${chips("shoes",OPT.shoes)}${sw("shoeC",CLOTH,"Shoe colour")}`;
 if(tab==="acc")h=`<h3>Holding in hand</h3>${chips("prop",OPT.prop)}<h3>Accessories (tap to add or remove)</h3><div class="chips">${Object.entries(OPT.acc).map(([v,n])=>`<button type="button" class="chip" data-acc="${v}" aria-pressed="${C.acc.includes(v)}">${n}</button>`).join("")}</div>`;
 if(tab==="pose")h=`<h3>Pose & animation</h3>${chips("pose",OPT.pose)}<label class="ck"><input type="checkbox" data-bool="anim" ${C.anim?"checked":""}> Animate (breathing, waving, dancing…)</label>`;
 if(tab==="scene")h=`<h3>Background</h3>${chips("bg",OPT.bg)}${C.bg==="plain"?sw("bgC",["#ffe9f1","#dfe5f5","#e9f7ef","#fff4d6","#1d1d24","#ffffff","#cfe8ff"],"Background colour"):""}
 <h3>💬 Speech bubble</h3><input class="txt" id="cSay" maxlength="90" value="${E(C.say)}" placeholder="Type a dialogue, e.g. Ra Golu, party ki ready aa?"><p class="mute">Shows above ${E(C.name)} and is included in pictures and videos.</p>
 <h3>👥 Group photo (add up to 3 more)</h3><p class="mute">Stand other characters next to ${E(C.name)}. Each keeps its own look and pose.</p>
 <div class="chips">${[...Object.entries(PRESETS).map(([k,p])=>["p:"+k,p.name]),...LIST.map(c=>["s:"+c.name,c.name+" ★"])].map(([k,n])=>`<button type="button" class="chip" data-grp="${E(k)}" aria-pressed="${GROUP.includes(k)}">${E(n)}</button>`).join("")}</div>
 ${GROUP.length?`<div class="acts"><button type="button" class="btn ghost" id="bGrpClear">Remove all others</button></div>`:""}`;
 if(tab==="save")h=`<h3>Name</h3><input class="txt" id="cName" maxlength="40" value="${E(C.name)}" placeholder="Character name">
  <div class="acts"><button type="button" class="btn" id="bSave">💾 Save character</button><button type="button" class="btn ghost" id="bShot2">📸 Save picture</button><button type="button" class="btn ghost" id="bRand">🎲 Random</button><button type="button" class="btn ghost" id="bVid2">🎥 360° video</button></div>
  <h3>Start from</h3><div class="chips">${Object.entries(PRESETS).map(([k,p])=>`<button type="button" class="chip" data-preset="${k}">${E(p.name)}</button>`).join("")}<button type="button" class="chip" data-preset="new">➕ Blank</button></div>
  <h3>My characters (${LIST.length})</h3>${LIST.length?`<div class="mylist">${LIST.map((c,i)=>`<div class="my"><button type="button" class="chip" data-load="${i}">${E(c.name)}</button><button type="button" class="x" data-del="${i}" aria-label="Delete ${E(c.name)}">✕</button></div>`).join("")}</div>`:`<p class="mute">Nothing saved yet. Saved characters stay in this browser.</p>`}
  <div class="acts"><button type="button" class="btn ghost" id="bExport">⬇ Export all (file)</button><label class="btn ghost">⬆ Import file<input type="file" id="fImport" accept=".json,application/json" hidden></label></div>`;
 if(tab==="video")h=videoPanel();
 b.innerHTML=h;$("#tabs").innerHTML=TABS.map(([k,n])=>`<button type="button" class="tab" data-tab="${k}" aria-pressed="${tab===k}">${n}</button>`).join("");$("#title").textContent=C.name;shelf()}
const UNDO=[],REDO=[];function snap(){UNDO.push(JSON.stringify(C));if(UNDO.length>60)UNDO.shift();REDO.length=0;undoBtns()}
function undoBtns(){const u=$("#bUndo"),r=$("#bRedo");if(u)u.disabled=!UNDO.length;if(r)r.disabled=!REDO.length}
function rebuild(){build();panel();undoBtns()}
document.addEventListener("click",async e=>{const t=e.target.closest("button,[data-tab]");if(!t)return;
 if(PLAY&&t.id!=="bPlay"&&!t.dataset.tab){toast("Stop the story first");return}
 if(t.dataset.tab){tab=t.dataset.tab;panel();return}
 if(t.id==="bLine"){const l=SCRIPT.lines[SCRIPT.lines.length-1];SCRIPT.lines.push({who:l?(l.who+1)%(1+GROUP.length):0,say:"",pose:"keep",expr:"",sec:3});saveScript();panel();return}
 if(t.dataset.ldel){SCRIPT.lines.splice(+t.dataset.ldel,1);saveScript();panel();return}
 if(t.dataset.lup){const i=+t.dataset.lup;if(i>0){const a=SCRIPT.lines;[a[i-1],a[i]]=[a[i],a[i-1]];saveScript();panel()}return}
 if(t.id==="bPlay"){if(PLAY)stopPlay();else startPlay();return}
 if(t.id==="bStoryRec"){recordStory();return}
 if(t.id==="bStorySave"){const n=($("#stName").value||"").trim()||"My story";SCRIPT.name=n;const st={name:n,main:JSON.parse(JSON.stringify(C)),group:GROUP.slice(),bg:C.bg,lines:JSON.parse(JSON.stringify(SCRIPT.lines))};const i=STORIES.findIndex(x=>x.name===n);if(i>=0)STORIES[i]=st;else STORIES.push(st);saveStories();saveScript();panel();toast("Saved story "+n);return}
 if(t.dataset.sload){const st=STORIES[+t.dataset.sload];if(!st)return;snap();C=Object.assign({},BASE,JSON.parse(JSON.stringify(st.main)));GROUP=(st.group||[]).filter(k=>groupConf(k)).slice(0,3);try{localStorage.setItem("cc3d-group",JSON.stringify(GROUP))}catch(x){}SCRIPT={name:st.name,lines:JSON.parse(JSON.stringify(st.lines||[]))};saveScript();buildBG();rebuild();toast("Opened "+st.name);return}
 if(t.dataset.sdel){const i=+t.dataset.sdel;if(t.dataset.sure){STORIES.splice(i,1);saveStories();panel();toast("Deleted")}else{t.dataset.sure="1";t.textContent="Delete?";setTimeout(()=>{if(t.isConnected){delete t.dataset.sure;t.textContent="✕"}},2500)}return}
 if(t.id==="bUndo"){if(!UNDO.length)return;REDO.push(JSON.stringify(C));C=JSON.parse(UNDO.pop());buildBG();rebuild();return}
 if(t.id==="bRedo"){if(!REDO.length)return;UNDO.push(JSON.stringify(C));C=JSON.parse(REDO.pop());buildBG();rebuild();return}
 if(t.dataset.expr){snap();Object.assign(C,EXPR[t.dataset.expr][1]);rebuild();return}
 if(t.dataset.grp){const k=t.dataset.grp;if(GROUP.includes(k))GROUP=GROUP.filter(x=>x!==k);else{if(GROUP.length>=3){toast("Up to 3 more characters");return}GROUP.push(k)}try{localStorage.setItem("cc3d-group",JSON.stringify(GROUP))}catch(x){}rebuild();return}
 if(t.id==="bGrpClear"){GROUP=[];try{localStorage.setItem("cc3d-group","[]")}catch(x){}rebuild();return}
 if(t.id==="bVid"||t.id==="bVid2"){recordVideo();return}
 if(t.dataset.set||t.dataset.col||t.dataset.acc||t.dataset.preset||t.dataset.load||t.id==="bRand"||t.id==="bRand2")snap();
 if(t.dataset.set){const k=t.dataset.set;C[k]=t.dataset.v;if(k==="bg")buildBG();rebuild();return}
 if(t.dataset.col){C[t.dataset.col]=t.dataset.v;if(t.dataset.col==="bgC")buildBG();rebuild();return}
 if(t.dataset.acc){const v=t.dataset.acc;C.acc=C.acc.includes(v)?C.acc.filter(x=>x!==v):C.acc.concat(v);if(v==="cap")C.acc=C.acc.filter(x=>x!=="beanie"||v!=="cap");if(v==="beanie")C.acc=C.acc.filter(x=>x!=="cap"||v!=="beanie");rebuild();return}
 if(t.dataset.preset){C=JSON.parse(JSON.stringify(t.dataset.preset==="new"?BASE:PRESETS[t.dataset.preset]));buildBG();rebuild();toast("Loaded "+C.name);return}
 if(t.dataset.load){C=Object.assign({},BASE,JSON.parse(JSON.stringify(LIST[+t.dataset.load])));delete C.thumb;buildBG();rebuild();toast("Opened "+C.name);return}
 if(t.dataset.del){const i=+t.dataset.del;if(t.dataset.sure){LIST.splice(i,1);saveList();panel();toast("Deleted")}else{t.dataset.sure="1";t.textContent="Delete?";setTimeout(()=>{if(t.isConnected){delete t.dataset.sure;t.textContent="✕"}},2500)}return}
 if(t.id==="bSave"||t.id==="bShSave"){const inp=$(t.id==="bSave"?"#cName":"#shName");saveChar((inp&&inp.value||"").trim()||"My character");return}
 if(t.id==="bShot"||t.id==="bShot2"){R.render(S,Cam);R.domElement.toBlob(b=>b&&saveFile(b,(C.name||"character").replace(/[^\w-]+/g,"-")+"-3d.png"),"image/png");return}
 if(t.id==="bRand"||t.id==="bRand2"){const pick=o=>{const k=Object.keys(o);return k[Math.floor(Math.random()*k.length)]},pc=a=>a[Math.floor(Math.random()*a.length)];
  Object.assign(C,{faceShape:pick(OPT.faceShape),nose:pick(OPT.nose),prop:Math.random()<.6?"none":pick(OPT.prop),gender:pick(OPT.gender),build:pick(OPT.build),skin:pc(SKIN),hair:pick(OPT.hair),hairC:pc(HAIRC),eyes:pick(OPT.eyes),eyeC:pc(EYEC),brows:pick(OPT.brows),mouth:pick(OPT.mouth),top:pick(OPT.top),topC:pc(CLOTH),accC:pc(CLOTH),bottom:pick(OPT.bottom),botC:pc(CLOTH),shoes:pick(OPT.shoes),shoeC:pc(CLOTH),glasses:Math.random()<.7?"none":pick(OPT.glasses),face_hair:Math.random()<.7?"none":pick(OPT.face_hair),acc:Object.keys(OPT.acc).filter(()=>Math.random()<.18)});
  if(C.gender==="boy"&&["saree","dress"].includes(C.top))C.top="tshirt";if(C.gender==="girl")C.face_hair="none";rebuild();return}
 if(t.id==="bSpin"){setAuto(!auto);return}
 if(t.id==="bReset"){yaw=.35;pitch=.1;dist=6.4;return}
 if(t.id==="bFace"){dist=2.6;pitch=.05;target.y=2.35;return}
 if(t.id==="bBody"){dist=6.4;target.y=1.45;return}
 if(t.id==="bExport"){await saveFile(new Blob([JSON.stringify({characters:LIST},null,1)],{type:"application/json"}),"my-3d-characters.json");return}
});
document.addEventListener("input",e=>{const t=e.target;
 if(t.dataset.num){C[t.dataset.num]=+t.value;build();return}
 if(t.dataset.pick){C[t.dataset.pick]=t.value;if(t.dataset.pick==="bgC")buildBG();build();return}
 if(t.dataset.bool){C[t.dataset.bool]=t.checked;build();return}
 if(t.id==="cName"||t.id==="shName"){C.name=t.value;$("#title").textContent=t.value}
 if(t.id==="cSay"){C.say=t.value;bubble()}
 if(t.dataset.lf==="say"){const l=SCRIPT.lines[+t.dataset.li];if(l){l.say=t.value.slice(0,90);saveScript()}}});
let sliding=false;document.addEventListener("pointerdown",e=>{const t=e.target;if(t.dataset&&(t.dataset.num||t.dataset.pick||t.dataset.bool)){snap()}},true);
document.addEventListener("change",e=>{const t=e.target;if(t.dataset.pick||t.dataset.num)panel();
 if(t.dataset.cast!=null){const i=+t.dataset.cast,v=t.value;if(i===0){if(v&&v!=="cur"){const c=groupConf(v);if(c){snap();C=JSON.parse(JSON.stringify(Object.assign({},BASE,c)));buildBG()}}}else{const g=GROUP.slice();if(v)g[i-1]=v;else g.splice(i-1,1);GROUP=g.filter(Boolean).slice(0,3);try{localStorage.setItem("cc3d-group",JSON.stringify(GROUP))}catch(x){}}SCRIPT.lines.forEach(l=>{if(l.who>GROUP.length)l.who=0});saveScript();rebuild();return}
 if(t.dataset.lf!=null){const l=SCRIPT.lines[+t.dataset.li];if(!l)return;const k=t.dataset.lf;l[k]=k==="who"?+t.value:k==="sec"?Math.min(15,Math.max(1,+t.value||3)):t.value;saveScript();return}
 if(t.id==="fImport"&&t.files[0]){const r=new FileReader();r.onload=()=>{try{const j=JSON.parse(r.result);const arr=(j.characters||[]).filter(x=>x&&typeof x==="object"&&x.name).map(x=>{const o=Object.assign({},BASE);for(const k of Object.keys(BASE))if(k in x)o[k]=x[k];o.acc=Array.isArray(o.acc)?o.acc.filter(a=>OPT.acc[a]):[];for(const k of ["gender","build","hair","eyes","brows","mouth","face_hair","glasses","top","bottom","shoes","pose","bg","faceShape","nose","prop"])if(!OPT[k][o[k]])o[k]=BASE[k];for(const k of ["skin","hairC","eyeC","topC","accC","botC","shoeC","bgC"])if(!/^#[0-9a-f]{6}$/i.test(o[k]))o[k]=BASE[k];o.name=String(o.name).slice(0,40);o.say=String(o.say||"").slice(0,90);o.height=Math.min(1.2,Math.max(.8,+o.height||1));o.head=Math.min(1.3,Math.max(.8,+o.head||1));return o});LIST=LIST.concat(arr);saveList();panel();toast("Imported "+arr.length)}catch(err){toast("That file couldn't be read.")}};r.readAsText(t.files[0])}});
/* ------------------------------------------------------------ 360 video */
let REC=null;
async function recordVideo(){if(REC)return;const cv=R.domElement;if(!cv.captureStream||!window.MediaRecorder){toast("This browser can't record video");return}
 const types=["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm"];const mt=types.find(t=>MediaRecorder.isTypeSupported(t))||"";
 const st=cv.captureStream(30),rec=new MediaRecorder(st,mt?{mimeType:mt,videoBitsPerSecond:6e6}:undefined),ch=[];rec.ondataavailable=e=>{if(e.data.size)ch.push(e.data)};
 const wasAuto=auto;setAuto(false);const y0=yaw,DUR=6;let el=0;toast("Recording 360° video… 6 seconds");document.body.classList.add("rec");
 const t0=performance.now();REC={tick(dt){el=(performance.now()-t0)/1000;yaw=y0+Math.min(1,el/DUR)*Math.PI*2;if(el>=DUR+.2&&rec.state==="recording")rec.stop()}};
 rec.onstop=async()=>{st.getTracks().forEach(t=>t.stop());REC=null;yaw=y0;setAuto(wasAuto);document.body.classList.remove("rec");const b=new Blob(ch,{type:(mt||"video/webm").split(";")[0]});
  await saveFile(b,(C.name||"character").replace(/[^\w-]+/g,"-")+"-360"+(b.type.includes("mp4")?".mp4":".webm"));toast("Video ready")};
 rec.start(200)}
/* ------------------------------------------------------------ my characters shelf */
function thumb(){try{R.render(S,Cam);const src=R.domElement,w=src.width,h=src.height,sz=Math.min(w,h)*.9,c=document.createElement("canvas");c.width=c.height=180;
 c.getContext("2d").drawImage(src,(w-sz)/2,(h-sz)/2-h*.02,sz,sz,0,0,180,180);return c.toDataURL("image/jpeg",.8)}catch(e){return""}}
function saveChar(n){n=String(n).slice(0,40);C.name=n;const o=JSON.parse(JSON.stringify(C));delete o.thumb;o.thumb=thumb();const i=LIST.findIndex(x=>x.name===n);
 if(i>=0)LIST[i]=o;else LIST.push(o);saveList();panel();toast("Saved “"+n+"”")}
function shelf(){const el=$("#shelf");if(!el)return;const focused=document.activeElement&&document.activeElement.id==="shName";if(focused&&el.dataset.n==LIST.length)return;el.dataset.n=LIST.length;
 el.innerHTML=`<div class="shh"><b>💾 My characters</b><input class="txt" id="shName" maxlength="40" value="${E(C.name)}" placeholder="Name your character" aria-label="Character name"><button type="button" class="btn" id="bShSave">Save</button></div>
 <div class="cards">${LIST.length?LIST.map((c,i)=>`<div class="card${c.name===C.name?" on":""}"><button type="button" class="cimg" data-load="${i}" aria-label="Open ${E(c.name)}">${c.thumb?`<img src="${c.thumb}" alt="">`:`<span class="ph">🧸</span>`}<span class="cn">${E(c.name)}</span></button><button type="button" class="x" data-del="${i}" aria-label="Delete ${E(c.name)}">✕</button></div>`).join(""):`<p class="mute">Type a name and tap Save — your characters appear here. Tap one to open it again.</p>`}</div>`}
/* ------------------------------------------------------------ story video */
const SKEY="cc3d-stories";let STORIES=[];try{STORIES=JSON.parse(localStorage.getItem(SKEY)||"[]")}catch(e){STORIES=[]}
const saveStories=()=>{try{localStorage.setItem(SKEY,JSON.stringify(STORIES))}catch(e){toast("Couldn't save — browser storage is full")}};
let SCRIPT={name:"My story",lines:[{who:0,say:"Ra Golu, chai taagudama?",pose:"wave",expr:"happy",sec:3},{who:1,say:"Chai aa? Naaku biryani kaavali!",pose:"cheer",expr:"laugh",sec:3}]};
try{const j=JSON.parse(localStorage.getItem("cc3d-script")||"null");if(j&&Array.isArray(j.lines))SCRIPT=j}catch(e){}
const saveScript=()=>{try{localStorage.setItem("cc3d-script",JSON.stringify(SCRIPT))}catch(e){}};
function castNames(){return [C.name,...GROUP.map(k=>{const c=groupConf(k);return c?c.name:"?"})]}
function videoPanel(){const opts=[...Object.entries(PRESETS).map(([k,p])=>["p:"+k,p.name]),...LIST.map(c=>["s:"+c.name,c.name+" ★"])];
 const sel=(i,cur)=>`<select class="txt" data-cast="${i}">${i===0?`<option value="cur" selected>${E(C.name)} (current)</option>`:`<option value=""${cur?"":" selected"}>— nobody —</option>`}${opts.map(([k,n])=>`<option value="${E(k)}"${k===cur?" selected":""}>${E(n)}</option>`).join("")}</select>`;
 const names=castNames(),po=Object.assign({keep:"(same pose)"},OPT.pose),ex=Object.assign({"":"(same face)"},Object.fromEntries(Object.entries(EXPR).map(([k,[n]])=>[k,n])));
 const o=(obj,v)=>Object.entries(obj).map(([k,n])=>`<option value="${E(k)}"${k===v?" selected":""}>${E(n)}</option>`).join("");
 return `<h3>🎭 Cast (up to 4)</h3><p class="mute">Save your characters with a name in 💾 Save — they show here with ★ so you can use the same character in every video.</p>
 <div class="cast">${[0,1,2,3].map(i=>`<label><span>${i?"Character "+(i+1):"Main"}</span>${sel(i,i?GROUP[i-1]||"":"")}</label>`).join("")}</div>
 <h3>📝 Script</h3><p class="mute">Each line: who speaks, what they say, their pose and face, and how many seconds.</p>
 <div class="lines">${SCRIPT.lines.map((l,i)=>`<div class="line"><div class="lh"><b>${i+1}</b><select class="txt" data-lf="who" data-li="${i}">${names.map((n,j)=>`<option value="${j}"${j===l.who?" selected":""}>${E(n)}</option>`).join("")}</select>
  <input class="txt sec" type="number" min="1" max="15" value="${l.sec}" data-lf="sec" data-li="${i}" aria-label="Seconds"><span class="mute">s</span>
  <button type="button" class="x" data-lup="${i}" aria-label="Move up">↑</button><button type="button" class="x" data-ldel="${i}" aria-label="Delete line">✕</button></div>
  <input class="txt" maxlength="90" value="${E(l.say)}" data-lf="say" data-li="${i}" placeholder="Dialogue (leave empty for a silent action)">
  <div class="lh"><select class="txt" data-lf="pose" data-li="${i}">${o(po,l.pose)}</select><select class="txt" data-lf="expr" data-li="${i}">${o(ex,l.expr)}</select></div></div>`).join("")}</div>
 <div class="acts"><button type="button" class="btn ghost" id="bLine">➕ Add line</button></div>
 <div class="acts"><button type="button" class="btn" id="bPlay">${PLAY?"⏹ Stop":"▶ Play story"}</button><button type="button" class="btn" id="bStoryRec">🔴 Record video</button></div>
 <h3>💾 Save this story</h3><input class="txt" id="stName" maxlength="40" value="${E(SCRIPT.name)}" placeholder="Story name">
 <div class="acts"><button type="button" class="btn ghost" id="bStorySave">💾 Save story</button></div>
 <h3>My stories (${STORIES.length})</h3>${STORIES.length?`<div class="mylist">${STORIES.map((st,i)=>`<div class="my"><button type="button" class="chip" data-sload="${i}">${E(st.name)}</button><button type="button" class="x" data-sdel="${i}" aria-label="Delete ${E(st.name)}">✕</button></div>`).join("")}</div>`:`<p class="mute">No stories saved yet.</p>`}`}
let PLAY=null;
function replaceChar(i,conf){const old=i?GB[i-1]:{g:CH};if(!old||!old.g)return;const b=buildChar(conf);b.g.position.copy(old.g.position);b.g.rotation.copy(old.g.rotation);S.remove(old.g);S.add(b.g);if(i===0){CH=b.g;rig=b.rig}else GB[i-1]=b;
 const dj=BG.getObjectByName("djdesk");if(dj)dj.visible=PLAY.cur[0].pose==="dj"&&!GB.length}
function startPlay(onEnd){const lines=SCRIPT.lines.filter(l=>l.who<=GROUP.length);if(!lines.length){toast("Add a line to the script first");return false}
 setAuto(false);build();if(bubbleSp){S.remove(bubbleSp);bubbleSp=null}
 const cur=[JSON.parse(JSON.stringify(C)),...GB.map(b=>JSON.parse(JSON.stringify(b.c)))];const y0=yaw,d0=dist,ty=target.y;
 PLAY={cur,i:-1,t:0,sp:null,end:0,lines,onEnd,y0,d0,ty,
  go(i){this.i=i;this.t=0;const L=lines[i];const w=L.who;this.sp=w;const c=Object.assign({},this.cur[w]);if(L.pose&&L.pose!=="keep")c.pose=L.pose;if(L.expr&&EXPR[L.expr])Object.assign(c,EXPR[L.expr][1]);c.say="";this.cur[w]=c;replaceChar(w,c);
   const g=w?GB[w-1].g:CH;bubbleAt(L.say,g.position.x+(GB.length?0:1.1),(GB.length?3.75:3.6)*(+c.height||1))},
  tick(dt){const now=performance.now();if(this.i<0){this.last=now;this.go(0);return}const rdt=Math.min(.5,(now-this.last)/1000);this.last=now;this.t+=rdt;const L=lines[this.i];const g=this.sp?GB[this.sp-1]&&GB[this.sp-1].g:CH;
   if(g){target.x+=(g.position.x*.55-target.x)*Math.min(1,dt*2.5)}yaw+=(0-yaw)*Math.min(1,dt*1.5);
   if(this.t>=(+L.sec||3)){if(this.i+1<lines.length)this.go(this.i+1);else{this.end+=rdt;if(this.end>.6)stopPlay()}}}};
 if(tab==="video")panel();return true}
function stopPlay(){if(!PLAY)return;const p=PLAY;PLAY=null;yaw=p.y0;target.x=0;build();if(tab==="video")panel();if(p.onEnd)p.onEnd()}
function recordStory(){if(REC||PLAY)return;const cv=R.domElement;if(!cv.captureStream||!window.MediaRecorder){toast("This browser can't record video");return}
 const types=["video/mp4;codecs=avc1","video/mp4","video/webm;codecs=vp9","video/webm"];const mt=types.find(t=>MediaRecorder.isTypeSupported(t))||"";
 const st=cv.captureStream(30),rec=new MediaRecorder(st,mt?{mimeType:mt,videoBitsPerSecond:6e6}:undefined),ch=[];rec.ondataavailable=e=>{if(e.data.size)ch.push(e.data)};
 rec.onstop=async()=>{st.getTracks().forEach(t=>t.stop());document.body.classList.remove("rec");const b=new Blob(ch,{type:(mt||"video/webm").split(";")[0]});
  await saveFile(b,(SCRIPT.name||"story").replace(/[^\w-]+/g,"-")+(b.type.includes("mp4")?".mp4":".webm"));toast("Story video ready")};
 if(!startPlay(()=>{if(rec.state==="recording")setTimeout(()=>rec.stop(),150)}))return;document.body.classList.add("rec");rec.start(200);toast("Recording story…")}
/* ------------------------------------------------------------ go */
buildBG();build();panel();resize();
const clock=new T.Clock();let tt=0;
(function loop(){requestAnimationFrame(loop);const dt=Math.min(.05,clock.getDelta());tt+=dt;if(auto&&!drag)yaw+=dt*.5;if(PLAY)PLAY.tick(dt);applyPoseTo(rig,PLAY?PLAY.cur[0]:C,tt);GB.forEach((b,i)=>applyPoseTo(b.rig,b.c,tt+(i+1)*.37));if(PLAY&&PLAY.sp!=null&&(PLAY.lines[PLAY.i]||{}).say){const r=PLAY.sp?GB[PLAY.sp-1]&&GB[PLAY.sp-1].rig:rig;if(r&&r.head){r.head.rotation.z=Math.sin(tt*11)*.07;r.head.rotation.x+=Math.sin(tt*17)*.04}}place();R.render(S,Cam);if(REC)REC.tick(dt)})();
window.__ready=true;
})();
