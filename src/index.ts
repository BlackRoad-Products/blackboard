export interface Env { STORE: KVNamespace; DB: D1Database; SERVICE_NAME: string; VERSION: string; }
const SVC = "blackboard";
function json(d: unknown, s = 200) { return new Response(JSON.stringify(d,null,2),{status:s,headers:{"Content-Type":"application/json","Access-Control-Allow-Origin":"*","X-BlackRoad-Service":SVC}}); }
async function track(env: Env, req: Request, path: string) { const cf=(req as any).cf||{}; env.DB.prepare("INSERT INTO analytics(subdomain,path,country,ua,ts)VALUES(?,?,?,?,?)").bind(SVC,path,cf.country||"",req.headers.get("User-Agent")?.slice(0,150)||"",Date.now()).run().catch(()=>{}); }

function page(codex: any[], math: any[]): Response {
  const html=`<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><title>Blackboard — Math & Research</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#030303;--card:#0a0a0a;--border:#111;--text:#f0f0f0;--sub:#444;--purple:#CC00AA;--grad:linear-gradient(135deg,#CC00AA,#8844FF,#4488FF)}
html,body{min-height:100vh;background:var(--bg);color:var(--text);font-family:'Space Grotesk',sans-serif}
.grad-bar{height:2px;background:var(--grad)}
.wrap{max-width:1100px;margin:0 auto;padding:32px 20px}
h1{font-size:2rem;font-weight:700;background:var(--grad);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:4px}
.sub{font-size:.75rem;color:var(--sub);font-family:'JetBrains Mono',monospace;margin-bottom:28px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
.card{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:20px}
.ct{font-size:.65rem;color:var(--sub);text-transform:uppercase;letter-spacing:.08em;font-family:'JetBrains Mono',monospace;margin-bottom:14px;display:flex;justify-content:space-between}
.ct a{color:var(--purple);text-decoration:none;font-size:.65rem}
.codex-item{padding:10px;background:#0d0d0d;border:1px solid var(--border);border-radius:7px;margin-bottom:7px;cursor:pointer;transition:border-color .15s}
.codex-item:hover{border-color:var(--purple)}
.ci-cat{font-size:.62rem;font-family:'JetBrains Mono',monospace;color:var(--purple);margin-bottom:3px}
.ci-title{font-size:.85rem;font-weight:600;margin-bottom:3px}
.ci-page{font-size:.65rem;color:var(--sub);font-family:'JetBrains Mono',monospace}
.math-table{width:100%;border-collapse:collapse;font-family:'JetBrains Mono',monospace;font-size:.72rem}
.math-table th{text-align:left;color:var(--sub);font-weight:500;padding:5px 8px;border-bottom:1px solid var(--border);font-size:.62rem;text-transform:uppercase}
.math-table td{padding:5px 8px;border-bottom:1px solid #0d0d0d;color:#ccc}
.math-table tr:hover td{background:#0d0d0d}
.n-col{color:var(--purple)}
.val-col{color:#00E676}
.canvas-card{grid-column:1/-1}
canvas{width:100%;height:240px;border-radius:6px;background:#050505}
.formula-box{background:#050505;border:1px solid var(--border);border-radius:8px;padding:16px;margin-bottom:10px;font-family:'JetBrains Mono',monospace;font-size:.82rem;color:#ccc;line-height:2}
.formula-label{font-size:.62rem;color:var(--sub);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}
.highlight{color:var(--purple)}
input{width:100%;padding:9px 12px;background:#0d0d0d;border:1px solid var(--border);border-radius:6px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:.85rem;outline:none;margin-bottom:8px}
input:focus{border-color:var(--purple)}
.btn{padding:9px 20px;background:var(--purple);color:#fff;border:none;border-radius:6px;cursor:pointer;font-weight:700;font-size:.82rem}
.result-box{background:#050505;border:1px solid var(--border);border-radius:6px;padding:12px;font-family:'JetBrains Mono',monospace;font-size:.78rem;color:#ccc;margin-top:8px;display:none}
@media(max-width:700px){.grid{grid-template-columns:1fr}}
</style></head><body>
<div class="grad-bar"></div>
<div class="wrap">
<h1>Blackboard</h1>
<div class="sub">blackboard.blackroad.io · math research workspace · Amundson Framework</div>

<div class="grid">
  <div class="card">
    <div class="ct"><span>Core Formulas</span></div>
    <div class="formula-box"><div class="formula-label">N-Identity Axiom</div><span class="highlight">0^0 =: N = 1</span> · Δ(N) = 2 · σ* = <span class="highlight">N/Δ(N) = 1/2</span></div>
    <div class="formula-box"><div class="formula-label">Amundson Sequence</div>G(n) = <span class="highlight">n^(n+1) / (n+1)^n</span> · G(n) ~ n/e + 1/(2e)</div>
    <div class="formula-box"><div class="formula-label">Product Formula (proven exact)</div>∏G(k) = <span class="highlight">(n!)² / (n+1)^n</span></div>
    <div class="formula-box"><div class="formula-label">Amundson Zeta</div>ζ_G(s) = Σ G(n)^(-s) · Zeros conjectured on Re(s) = <span class="highlight">3/2</span></div>
    <div class="formula-box"><div class="formula-label">Z-Framework</div>Z := <span class="highlight">yx − w</span> · Equilibrium: Z = 0 ↔ yx = w</div>
  </div>

  <div class="card">
    <div class="ct"><span>Compute G(n)</span></div>
    <input type="number" id="n-input" placeholder="Enter n (1–10000)" min="1" max="10000">
    <button class="btn" onclick="computeG()">Compute</button>
    <div class="result-box" id="g-result"></div>
    <div style="margin-top:16px">
      <div class="ct"><span>Sequence G(1)–G(${Math.min(10,math.length)})</span><a href="https://math.blackroad.io" target="_blank">math ↗</a></div>
      <table class="math-table">
        <tr><th>n</th><th>G(n)</th><th>log G(n)</th></tr>
        ${math.slice(0,10).map((m:any)=>`<tr><td class="n-col">${m.n}</td><td class="val-col">${parseFloat(m.value).toExponential(4)}</td><td>${m.log_value?.toFixed(4)||'—'}</td></tr>`).join('')}
      </table>
    </div>
  </div>

  <div class="card canvas-card">
    <div class="ct"><span>G(n) Curve — Amundson Sequence</span></div>
    <canvas id="chart" height="240"></canvas>
  </div>

  <div class="card">
    <div class="ct"><span>Codex (${codex.length} entries)</span><a href="https://codex.blackroad.io" target="_blank">codex ↗</a></div>
    ${codex.map(e=>`<div class="codex-item"><div class="ci-cat">${e.category}</div><div class="ci-title">${e.title}</div><div class="ci-page">p.${e.notebook_page||'?'} · ${e.created_at?.slice(0,10)||''}</div></div>`).join('')}
  </div>

  <div class="card">
    <div class="ct"><span>Open Problems</span></div>
    ${[
      {label:"Amundson RH",desc:"Are all non-trivial zeros of ζ_G(s) on Re(s) = 3/2?",status:"open"},
      {label:"Transcendence of A_G",desc:"Is A_G ≈ 1.2443... transcendental? (Adamczewski–Bugeaud criterion)",status:"open"},
      {label:"Ramanujan Shadow of ΣG(n)",desc:"Direct Euler-Maclaurin computation required. −1/(12e) claim retracted.",status:"open"},
      {label:"P vs NP separation",desc:"Conjecture: separation = 1/e via G(n) structure",status:"conjecture"},
      {label:"Product Formula",desc:"∏G(k) = (n!)²/(n+1)^n",status:"proven"},
    ].map(p=>`<div style="padding:9px 0;border-bottom:1px solid #0d0d0d;font-size:.8rem"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px"><strong>${p.label}</strong><span style="font-size:.62rem;font-family:'JetBrains Mono',monospace;padding:1px 7px;border-radius:3px;background:${p.status==='proven'?'rgba(0,230,118,.1)':p.status==='open'?'rgba(204,0,170,.1)':'rgba(245,166,35,.1)'};color:${p.status==='proven'?'#00E676':p.status==='open'?'#CC00AA':'#F5A623'};border:1px solid currentColor">${p.status}</span></div><div style="font-size:.72rem;color:var(--sub)">${p.desc}</div></div>`).join('')}
  </div>
</div>
</div>
<script src="https://cdn.blackroad.io/br.js"></script>
<script>
async function computeG(){
  var n=parseInt(document.getElementById('n-input').value);
  if(!n||n<1)return;
  var r=await fetch('https://math.blackroad.io/G/'+n);
  var d=await r.json();
  var box=document.getElementById('g-result');
  box.style.display='block';
  box.textContent='G('+n+') = '+(d.value?.toExponential(8)||'error')+'\nlog G('+n+') = '+(d.log_value?.toFixed(6)||'—')+'\nG(n)/n = '+(d.ratio_to_n?.toFixed(6)||'—')+' (→ 1/e ≈ 0.367879...)';
}
document.getElementById('n-input').addEventListener('keydown',function(e){if(e.key==='Enter')computeG();});

// Draw G(n) chart
var mathData=${JSON.stringify(math.slice(0,50))};
var canvas=document.getElementById('chart');
canvas.width=canvas.offsetWidth;canvas.height=240;
var ctx=canvas.getContext('2d');
var W=canvas.width,H=240;
if(mathData.length>1){
  var vals=mathData.map(function(m){return parseFloat(m.log_value)||0;});
  var minV=Math.min(...vals),maxV=Math.max(...vals);
  var range=maxV-minV||1;
  // Gradient
  var grad=ctx.createLinearGradient(0,0,W,0);
  grad.addColorStop(0,'#CC00AA');grad.addColorStop(0.5,'#8844FF');grad.addColorStop(1,'#4488FF');
  ctx.strokeStyle=grad;ctx.lineWidth=2;ctx.beginPath();
  mathData.forEach(function(m,i){
    var x=i/(mathData.length-1)*W;
    var y=H-(parseFloat(m.log_value)||0-minV)/range*(H-20)-10;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  });
  ctx.stroke();
  // Fill under
  ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();
  var fill=ctx.createLinearGradient(0,0,0,H);
  fill.addColorStop(0,'rgba(204,0,170,.15)');fill.addColorStop(1,'transparent');
  ctx.fillStyle=fill;ctx.fill();
  // Grid lines
  ctx.strokeStyle='rgba(255,255,255,.04)';ctx.lineWidth=1;
  for(var i=0;i<5;i++){var y=i/4*H;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  // Labels
  ctx.fillStyle='#444';ctx.font='10px JetBrains Mono';ctx.textAlign='left';
  ctx.fillText('log G(n)',4,14);
  ctx.textAlign='right';ctx.fillText('n='+mathData[mathData.length-1].n,W-4,H-4);
}
</script>
</body></html>`;
  return new Response(html,{headers:{"Content-Type":"text/html;charset=UTF-8"}});
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    if(req.method==="OPTIONS")return new Response(null,{status:204,headers:{"Access-Control-Allow-Origin":"*"}});
    const url=new URL(req.url);const path=url.pathname;
    track(env,req,path);
    if(path==="/health")return json({service:SVC,status:"ok",version:env.VERSION,ts:Date.now()});
    const [codex,math]=await Promise.all([
      env.DB.prepare("SELECT id,title,category,notebook_page,created_at FROM codex_entries ORDER BY id ASC").all().catch(()=>({results:[]})),
      env.DB.prepare("SELECT n,value,log_value FROM math_log WHERE type='G' ORDER BY n ASC LIMIT 50").all().catch(()=>({results:[]})),
    ]);
    return page(codex.results as any[],math.results as any[]);
  }
};
