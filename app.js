const demoResults = [
  {id:1,type:"video",niche:"affiliate",length:"short",source:"YouTube",title:"Affiliate Marketing for Beginners: The Simple Starting Point",desc:"A beginner-friendly explanation of how affiliate marketing works and where to start.",access:"free",duration:"12 min"},
  {id:2,type:"video",niche:"affiliate",length:"long",source:"YouTube",title:"Build an Affiliate Content System From Scratch",desc:"Long-form walkthrough covering research, content, tracking and optimization.",access:"free",duration:"58 min"},
  {id:3,type:"article",niche:"affiliate",length:"normal",source:"Web",title:"Affiliate Marketing: A Practical Beginner Guide",desc:"Definitions, common models, terminology and a framework for evaluating offers.",access:"free",duration:"10 min read"},
  {id:4,type:"document",niche:"affiliate",length:"guide",source:"PDF / Web",title:"Affiliate Marketing Workbook & Planning Guide",desc:"A structured guide for planning a niche, content topics and measurement.",access:"free",duration:"PDF"},
  {id:5,type:"website",niche:"affiliate",length:"normal",source:"Website",title:"Affiliate Program Directory & Research Resource",desc:"A resource for discovering programs and comparing their public terms.",access:"free",duration:"Website"},
  {id:6,type:"video",niche:"coding",length:"long",source:"YouTube",title:"Build a Modern Web App: Full Beginner Walkthrough",desc:"Project-based introduction to frontend, APIs and deployment concepts.",access:"free",duration:"1h 42m"},
  {id:7,type:"article",niche:"business",length:"normal",source:"Web",title:"How Online Businesses Actually Make Money",desc:"Breaks down revenue models, acquisition and basic unit economics.",access:"free",duration:"14 min read"},
  {id:8,type:"video",niche:"creator",length:"short",source:"YouTube",title:"How Creators Turn One Idea Into Multiple Pieces of Content",desc:"A practical workflow for repurposing an idea across formats.",access:"free",duration:"9 min"},
  {id:9,type:"document",niche:"trading",length:"guide",source:"PDF / Web",title:"Trading Risk Management Guide",desc:"Educational material focused on risk, position sizing and avoiding common mistakes.",access:"free",duration:"PDF"},
  {id:10,type:"video",niche:"ecommerce",length:"medium",source:"YouTube",title:"How to Research a Product Before Building an Online Store",desc:"A research workflow covering demand, competition and customer problems.",access:"free",duration:"27 min"}
];

let state = {query:"",type:"all",niche:"all",subniche:"",length:"any",freeOnly:false,mode:"learn",source:"all",playlist:JSON.parse(localStorage.getItem("nichelearn-playlist")||"[]"),livePlaylist:JSON.parse(localStorage.getItem("nichelearn-live-playlist")||"[]")};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const TAXONOMY={
 money:{name:"Make Money Online",subniches:{affiliate:"Affiliate Marketing",ecommerce:"E-commerce",freelancing:"Freelancing",digitalProducts:"Digital Products",creatorIncome:"Creator Income"}},
 affiliate:{name:"Affiliate Marketing",subniches:{research:"Niche & Product Research",programs:"Affiliate Programs",content:"Affiliate Content",traffic:"Traffic & SEO",conversion:"Conversion & Analytics"}},
 ecommerce:{name:"E-commerce",subniches:{store:"Store Building",products:"Product Research",dropshipping:"Dropshipping",ads:"E-commerce Ads",operations:"Operations"}},
 trading:{name:"Trading Education",subniches:{basics:"Trading Basics",technical:"Technical Analysis",fundamental:"Fundamental Analysis",risk:"Risk Management",systems:"Strategies & Systems"}},
 coding:{name:"Coding & AI",subniches:{web:"Web Development",software:"Software Development",ai:"AI & Machine Learning",automation:"Automation",tools:"Developer Tools"}},
 marketing:{name:"Digital Marketing",subniches:{seo:"SEO",content:"Content Marketing",social:"Social Media Marketing",email:"Email Marketing",ads:"Paid Advertising"}},
 creator:{name:"Content Creation",subniches:{youtube:"YouTube",shorts:"Short-form Video",editing:"Video Editing",audience:"Audience Growth",monetization:"Creator Monetization"}},
 business:{name:"Business",subniches:{ideas:"Business Models",startup:"Startups",sales:"Sales",operations:"Operations",finance:"Business Finance"}}
};
function nicheName(key){ return TAXONOMY[key]?.name || (key==="all"?"All niches":key); }
function updateSubniches(){
 const sel=$("#subnicheSelect"), n=TAXONOMY[state.niche]; sel.innerHTML='<option value="">All topics in niche</option>';
 if(!n){sel.disabled=true;state.subniche="";} else {Object.entries(n.subniches).forEach(([k,v])=>{const o=document.createElement("option");o.value=k;o.textContent=v;sel.appendChild(o)});sel.disabled=false;sel.value=state.subniche;}
 $("#focusText").textContent=state.niche==="all"?"Choose a niche and optional sub-niche to make results more specific.":`${nicheName(state.niche)}${state.subniche?" → "+(n.subniches[state.subniche]||state.subniche):""} will constrain discovery.`;
}

function renderResults(){
  const q=state.query.trim().toLowerCase();
  let data=demoResults.filter(x=>{
    const text=(x.title+" "+x.desc+" "+x.source).toLowerCase();
    const nicheOk=state.niche==="all"||x.niche===state.niche||(state.niche==="money"&&["affiliate","ecommerce","trading","business"].includes(x.niche));
    const typeOk=state.type==="all"||x.type===state.type;
    const lengthOk=state.length==="any"||x.length===state.length;
    const freeOk=!state.freeOnly||x.access==="free";
    const qOk=!q||text.includes(q)||x.niche.includes(q);
    return nicheOk&&typeOk&&lengthOk&&freeOk&&qOk;
  });
  $("#resultCount").textContent=`${data.length} resources • demo search`;
  $("#resultsTitle").textContent=state.niche==="all"?"Explore your niche":`Explore ${nicheName(state.niche)}`;
  $("#nicheSummary").textContent=state.niche==="all"?"Choose a niche to narrow discovery.":`Only resources classified for ${nicheName(state.niche)} are shown. In production, the same rule will be enforced by the search backend.`;
  $("#results").innerHTML=data.length?data.map(x=>`
    <article class="result-card">
      <div class="thumb">${x.type.toUpperCase()}</div>
      <div>
        <div class="result-meta"><span>${x.source}</span><span>•</span><span>${x.duration}</span></div>
        <h3>${x.title}</h3><p>${x.desc}</p>
      </div>
      <div class="result-actions">
        <button class="small-btn" onclick="openResult(${x.id})">Open</button>
        <button class="small-btn" onclick="addToPlaylist(${x.id})">+ Playlist</button>
      </div>
    </article>`).join(""):`<div class="empty">No demo results match those filters. Try a broader search, another content type, or a different niche.</div>`;
}

function renderPlaylist(){
  const p=$("#playlist");
  const localItems=state.playlist.map(id=>demoResults.find(r=>r.id===id)).filter(Boolean).map(x=>({title:x.title,url:x.url||"",source:x.source,type:x.type,desc:x.desc}));
  const items=[...localItems,...state.livePlaylist];
  if(!items.length){p.innerHTML='<div class="empty">Your learning path is empty. Add resources from the search results.</div>';return;}
  p.innerHTML=items.map((x,i)=>`<div class="playlist-item"><div class="num">${i+1}</div><div class="info"><strong>${escapeHtml(x.title||"Untitled resource")}</strong><small>${escapeHtml(x.source||x.type||"Resource")}</small></div><button class="move" title="Open" onclick='openLiveResult(${JSON.stringify(x)})'>↗</button></div>`).join("");
  localStorage.setItem("nichelearn-playlist",JSON.stringify(state.playlist));
  localStorage.setItem("nichelearn-live-playlist",JSON.stringify(state.livePlaylist));
}
window.addToPlaylist=id=>{if(!state.playlist.includes(id)){state.playlist.push(id);renderPlaylist()}};
window.removeItem=i=>{state.playlist.splice(i,1);renderPlaylist()};
window.moveItem=(i,d)=>{const j=i+d;if(j<0||j>=state.playlist.length)return;[state.playlist[i],state.playlist[j]]=[state.playlist[j],state.playlist[i]];renderPlaylist()};
window.openResult=id=>{
  const x=demoResults.find(r=>r.id===id);
  if(x?.url) window.open(x.url,"_blank","noopener,noreferrer");
};
window.openLiveResult=x=>{
  try{
    const u=new URL(String(x?.url||""),window.location.origin);
    if(u.protocol!=="http:"&&u.protocol!=="https:") throw new Error("Invalid URL");
    window.open(u.href,"_blank","noopener,noreferrer");
  }catch(e){ alert("This result does not have a valid original source URL."); }
};

async function realSearch(){
  const q=state.query.trim();
  if(!q){renderResults();return}
  $("#results").innerHTML='<div class="empty">Searching connected sources…</div>';
  try{
    const r=await fetch("/api/search",{
      method:"POST",headers:{"content-type":"application/json"},
      body:JSON.stringify({query:q,niche:state.niche,subniche:state.subniche,type:state.type,length:state.length,mode:state.mode,source:state.source})
    });
    const d=await r.json();
    if(d.ok && d.results?.length){
      $("#resultCount").textContent=`${d.results.length} real results • ${Object.entries(d.providers).filter(x=>x[1]).map(x=>x[0]).join(" + ")}`;
      $("#results").innerHTML=d.results.map((x,i)=>`
        <article class="result-card">
          <div class="thumb">${x.thumbnail?`<img src="${escapeHtml(x.thumbnail)}" style="width:100%;height:100%;object-fit:cover;border-radius:10px">`:escapeHtml(x.type.toUpperCase())}</div>
          <div><div class="result-meta"><span>${escapeHtml(x.source)}</span><span>•</span><span>${Math.round((x.relevance||0)*100)}% match</span><span>•</span><span>${escapeHtml(x.access||"Access unknown")}</span></div><h3>${escapeHtml(x.title)}</h3><p>${escapeHtml(x.description||"")}</p><small class="match-reason">${escapeHtml(x.matchReason||"Matches your selected niche, topic, and learning mode.")}</small></div>
          <div class="result-actions"><button class="small-btn" onclick="openLiveResult(${JSON.stringify(x).replace(/</g,'\u003c')})">Open</button><button class="small-btn" onclick='addLiveToPlaylist(${JSON.stringify(x)})'>+ Playlist</button></div>
        </article>`).join("");
      return;
    }
    if(d.ok && !d.results?.length){
      $("#resultCount").textContent="0 real results";
      $("#results").innerHTML='<div class="empty">No connected provider returned a matching resource. Try a broader query or another content type.</div>';
      return;
    }
    $("#resultCount").textContent="Search unavailable";
    $("#results").innerHTML=`<div class="empty">${escapeHtml(d.error||"Real search is not configured yet. Add the provider API keys in your deployment secrets.")}</div>`;
  }catch(e){
    $("#resultCount").textContent="Search unavailable";
    $("#results").innerHTML='<div class="empty">Real search could not be reached. Check your deployment and API configuration.</div>';
  }
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
$("#searchBtn").onclick=()=>{state.query=$("#searchInput").value;realSearch()};
$("#searchInput").addEventListener("keydown",e=>{if(e.key==="Enter"){$("#searchBtn").click()}});
$("#typeSelect").onchange=e=>{state.type=e.target.value;realSearch()};
$("#sourceSelect").onchange=e=>{state.source=e.target.value;realSearch()};
$("#nicheSelect").onchange=e=>{state.niche=e.target.value;state.subniche="";updateSubniches();realSearch()};
$("#subnicheSelect").onchange=e=>{state.subniche=e.target.value;updateSubniches();realSearch()};
$("#freeOnly").onchange=e=>{state.freeOnly=e.target.checked;realSearch()};
$$(".chip").forEach(b=>b.onclick=()=>{$$(".chip").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.length=b.dataset.length;realSearch()});
$$(".templates button").forEach(b=>b.onclick=()=>{$("#searchInput").value=b.dataset.template;$("#searchInput").focus()});
$$(".mode-card").forEach(b=>b.onclick=()=>{$$(".mode-card").forEach(x=>x.classList.remove("active"));b.classList.add("active");state.mode=b.dataset.mode;realSearch()});
$("#playlistBtn").onclick=()=>$("#playlists").scrollIntoView({behavior:"smooth"});
$("#clearPlaylist").onclick=()=>{state.playlist=[];renderPlaylist()};
async function refreshMembership(){
  try{
    const r=await fetch("/api/membership",{credentials:"same-origin"}); const d=await r.json();
    const m=d.membership;
    const title=$("#membershipTitle"), text=$("#membershipText"), badge=$("#membershipBadge");
    if(!d.authenticated){ title.textContent="Not subscribed"; text.textContent="Sign in to see your trial and billing status."; badge.textContent="SIGN IN"; badge.className="membership-badge inactive"; return; }
    if(!m){ title.textContent="No active membership"; text.textContent="Start the 7-day Pro trial above."; badge.textContent="NO PLAN"; badge.className="membership-badge inactive"; return; }
    const end=m.trial_ends_at||m.current_period_end;
    let suffix=end?` • ${new Date(end.replace(' ','T')+'Z').toLocaleDateString()}`:"";
    const label=m.status==='pending'?"CHECKOUT PENDING":m.status.toUpperCase();
    title.textContent=m.status==='active'?'Pro membership':m.status==='pending'?'PayPal checkout pending':'Membership '+m.status;
    text.textContent=(m.trial_ends_at?"7-day trial included":"Paid billing active")+suffix;
    badge.textContent=label; badge.className=`membership-badge ${m.status}`;
  }catch(e){}
}

async function refreshAccount(){
  try{
    const r=await fetch("/api/auth-me",{credentials:"same-origin"}); const d=await r.json();
    if(d.authenticated){
      window.nichelearnUser=d.user; localStorage.setItem("nichelearn-user",JSON.stringify(d.user));
      $("#accountBar").classList.add("open"); $("#accountName").textContent=d.user.name||d.user.email;
      $("#loginBtn").classList.add("hidden"); $("#joinBtn").classList.add("hidden");
    }else{
      window.nichelearnUser=null; localStorage.removeItem("nichelearn-user");
      $("#accountBar").classList.remove("open"); $("#loginBtn").classList.remove("hidden"); $("#joinBtn").classList.remove("hidden");
    }
  }catch(e){}
}

async function startSubscription(plan){
  if(!window.nichelearnUser){openAuth("login");$("#authMessage").textContent="Sign in or create an account before starting your 7-day trial.";return;}
  try{
    const r=await fetch("/api/paypal-subscription",{method:"POST",headers:{"content-type":"application/json"},credentials:"same-origin",body:JSON.stringify({plan})});
    const d=await r.json();
    if(!d.ok) throw new Error(d.error||"Billing is not configured yet.");
    if(d.approvalUrl) window.location.href=d.approvalUrl; else throw new Error("PayPal did not return an approval URL.");
  }catch(e){alert(e.message)}
}
$("#subscribeMonthlyBtn").onclick=()=>startSubscription("monthly");
$("#subscribeYearlyBtn").onclick=()=>startSubscription("yearly");
$("#trialInfoBtn").onclick=()=>alert("Your Pro trial costs $0 for 7 days. You must choose a paid monthly or yearly plan to continue after the trial.");
$("#refreshMembershipBtn").onclick=refreshMembership;
$("#logoutBtn").onclick=async()=>{await fetch("/api/auth-logout",{method:"POST",credentials:"same-origin"});refreshAccount();};

updateSubniches();renderResults();renderPlaylist();refreshAccount();refreshMembership();

let authMode="login";
const authModal=$("#authModal"), authTitle=$("#authTitle"), authSubmit=$("#authSubmit"), authToggle=$("#authToggle"), nameField=$("#nameField");
function openAuth(mode="login"){authMode=mode;authModal.classList.add("open");authTitle.textContent=mode==="login"?"Sign in":"Create your account";authSubmit.textContent=mode==="login"?"Sign in":"Create account";authToggle.textContent=mode==="login"?"Create an account instead":"I already have an account";nameField.classList.toggle("hidden",mode==="login");$("#authMessage").textContent=""}
$("#loginBtn").onclick=()=>openAuth("login");$("#joinBtn").onclick=()=>openAuth("register");$("#closeAuth").onclick=()=>authModal.classList.remove("open");
authToggle.onclick=()=>openAuth(authMode==="login"?"register":"login");
authSubmit.onclick=async()=>{
  const email=$("#authEmail").value.trim(),password=$("#authPassword").value,name=$("#authName").value.trim();
  const endpoint=authMode==="login"?"/api/auth-login":"/api/auth-register";
  $("#authMessage").textContent="Working…";
  try{
    const r=await fetch(endpoint,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({email,password,name})});
    const d=await r.json(); if(!d.ok) throw new Error(d.error||"Request failed");
    localStorage.setItem("nichelearn-user",JSON.stringify(d.user));
    $("#authMessage").textContent=authMode==="login"?"Signed in.":"Account created and signed in.";
    await refreshAccount();
    await refreshMembership();
    setTimeout(()=>authModal.classList.remove("open"),700);
  }catch(e){$("#authMessage").textContent=e.message}
};

window.openLiveResult=x=>{
  if(!x?.url)return;
  window.open(x.url,"_blank","noopener,noreferrer");
};

window.addLiveToPlaylist=x=>{
  if(!x?.url)return;
  if(!state.livePlaylist.some(y=>y.url===x.url)){
    state.livePlaylist.push(x);
    localStorage.setItem("nichelearn-live-playlist",JSON.stringify(state.livePlaylist));
    renderPlaylist();
  }
  alert(window.nichelearnUser?"Added to your learning path. Cloud sync can be connected from your account workspace.":"Added locally to your learning path. Sign in to sync your learning path across devices.");
};
