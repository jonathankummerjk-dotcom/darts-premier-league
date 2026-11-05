let db=JSON.parse(localStorage.getItem("dartsleague")||"{}");for(const d in SCHEDULE){if(!db[d])db[d]=SCHEDULE[d].map(x=>({p1:x[0],p2:x[1]}));}save();
nav.innerHTML='<button onclick="tableView()">Tabelle</button><button onclick="statsView()">Statistiken</button><button onclick="headView()">Head2Head</button><button onclick="playoffView()">Playoffs</button><button onclick="recordsView()">Rekorde</button>'+Object.keys(SCHEDULE).map(d=>`<button onclick="day(${d})">ST${d}</button>`).join('')+'<button onclick="exp()">Export</button>';
function save(){localStorage.setItem("dartsleague",JSON.stringify(db));}
function upd(d,i,k,v){
    db[d][i][k]=v;
    save();
}

function parseAvg(v){
    return parseFloat(String(v || "0").replace(",", ".")) || 0;
}
function calc(){let s={};PLAYERS.forEach(p=>s[p]={pts:0,w:0,l:0,lf:0,la:0,o:0,av:[],aga:[],hf:[],matches:[]});Object.values(db).forEach(day=>day.forEach(m=>{let a=+m.l1||0,b=+m.l2||0;if(a||b){if(a>b){s[m.p1].pts+=2;s[m.p1].w++;s[m.p2].l++;} if(b>a){s[m.p2].pts+=2;s[m.p2].w++;s[m.p1].l++;}s[m.p1].lf+=a;s[m.p1].la+=b;s[m.p2].lf+=b;s[m.p2].la+=a;} if(m.avg1){
    let avg1=parseAvg(m.avg1);
    s[m.p1].av.push(avg1);
    s[m.p2].aga.push(avg1);
}

if(m.avg2){
    let avg2=parseAvg(m.avg2);
    s[m.p2].av.push(avg2);
    s[m.p1].aga.push(avg2);
}
 s[m.p1].o+=(+m.o1||0);s[m.p2].o+=(+m.o2||0);if(m.hf1)s[m.p1].hf.push(...m.hf1.split(',').map(Number).filter(Boolean));if(m.hf2)s[m.p2].hf.push(...m.hf2.split(',').map(Number).filter(Boolean));}));return s;}
function rank(){let s=calc();return PLAYERS.map(p=>({p,...s[p],diff:s[p].lf-s[p].la})).sort((a,b)=>b.pts-a.pts||b.diff-a.diff||b.lf-a.lf||b.w-a.w)}
function tableView(){let r=rank();let h='<h2>Tabelle</h2><table><tr><th>#</th><th>Name</th><th>Pkt</th><th>S</th><th>N</th><th>Leg+</th><th>Leg-</th><th>Diff</th></tr>';r.forEach((x,i)=>h+=`<tr class="${i<4?'top4':''}"><td>${i+1}</td><td>${x.p}</td><td>${x.pts}</td><td>${x.w}</td><td>${x.l}</td><td>${x.lf}</td><td>${x.la}</td><td>${x.diff}</td></tr>`);app.innerHTML=h+'</table>'}
function statsView(){let s=calc(),h='<h2>Spielerstatistiken</h2>';for(const p of PLAYERS){let a=s[p];let avg=a.av.length
?(a.av.reduce((x,y)=>x+y,0)/a.av.length).toFixed(2).replace(".", ",")
:"0,00";

let aga=a.aga.length
?(a.aga.reduce((x,y)=>x+y,0)/a.aga.length).toFixed(2).replace(".", ",")
:"0,00";h+=`<div class=card><b>${p}</b><br>Average: ${avg}<br>Average Against: ${aga}<br>180er: ${a.o}<br>High Finishes: ${a.hf.join(', ')}<br>Höchstes Finish: ${Math.max(0,...a.hf)}</div>`}app.innerHTML=h}
function playoffView(){let r=rank();app.innerHTML=`<h2>Playoffs</h2><div class=card>HF1: ${r[0].p} vs ${r[3].p}</div><div class=card>HF2: ${r[1].p} vs ${r[2].p}</div>`}
function recordsView(){let s=calc();let high=0,name='-';PLAYERS.forEach(p=>{let m=Math.max(0,...s[p].hf);if(m>high){high=m;name=p}});app.innerHTML=`<h2>Rekorde</h2><div class=card>Höchstes Finish: ${high} (${name})</div>`}
function headView(){app.innerHTML='<h2>Head-to-Head (Basisversion)</h2><div class=card>Vergleich erfolgt über eingetragene Ergebnisse. Erweiterbar.</div>'}
function day(d){let h='<h2>Spieltag '+d+'</h2><table><tr><th>Spiel</th><th>L1</th><th>L2</th><th>Avg1</th><th>Avg2</th><th>180er P1</th><th>180er P2</th><th>Höchstes Finish P1</th><th>Höchstes Finish P2</th><th>High Finishes P1</th><th>High Finishes P2</th></tr>';db[d].forEach((m,i)=>{h+=`<tr><td>${m.p1}-${m.p2}</td><td><input value='${m.l1||''}' onchange="upd(${d},${i},'l1',this.value)"></td><td><input value='${m.l2||''}' onchange="upd(${d},${i},'l2',this.value)"></td><td><input value='${m.avg1||''}' onchange="upd(${d},${i},'avg1',this.value)"></td><td><input value='${m.avg2||''}' onchange="upd(${d},${i},'avg2',this.value)"></td><td><input value='${m.o1||''}' onchange="upd(${d},${i},'o1',this.value)"></td><td><input value='${m.o2||''}' onchange="upd(${d},${i},'o2',this.value)"></td><td><input value='${m.best1||''}' onchange="upd(${d},${i},'best1',this.value)"></td><td><input value='${m.best2||''}' onchange="upd(${d},${i},'best2',this.value)"></td><td><input value='${m.hf1||''}' placeholder='107,156' onchange="upd(${d},${i},'hf1',this.value)"></td><td><input value='${m.hf2||''}' onchange="upd(${d},${i},'hf2',this.value)"></td></tr>`});app.innerHTML=h+'</table>'}
function exp(){let a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(db)]));a.download='premierleague.json';a.click();}
tableView();