import{copyText as $}from"../ui.js";import{ENCODINGS as z,encodingsAvailable as M,loadEncoder as I,encodeText as T,decodeBytes as D}from"../encoding.js";const x=Object.fromEntries(z.map(e=>[e.id,e.label]));const G=24;let q=null;function A(){if(q)return q;const e=M();const o=[];for(const c of e){for(const l of e){if(c.id!==l.id)o.push([c.id,l.id])}}q=o;return o}function P(e,o,c,l){const a=D(T(o,l),c);if(a==null)return 0;const i=String(e);const n=String(a);const d=Math.max(i.length,n.length);if(d===0)return 1;let y=0;const E=Math.min(i.length,n.length);for(let f=0;f<E;f++){if(i[f]===n[f])y++}return y/d}function R(e){if(e>=99)return"high";if(e>=60)return"mid";return"low"}function _(e){const o=[];const c=new Set;for(const[l,a]of A()){const i=T(e,l);if(!i)continue;const n=D(i,a);if(n==null||n===e)continue;if(c.has(n))continue;c.add(n);o.push({source:l,shown:a,label:`${x[l]} → ${x[a]}`,text:n,keep:P(e,n,l,a)})}o.sort((l,a)=>a.keep-l.keep);return o}function Q(e){e.innerHTML=`
    <div class="tool-head mk-head">
      <h1 class="tool-title">乱码化</h1>
      <button type="button" class="mk-help-btn" id="gb-help-btn"
        aria-label="查看支持哪些编码" title="查看支持哪些编码">?</button>
    </div>

    <section class="card mk-input-card">
      <textarea id="gb-input" class="input mono" spellcheck="false"
        placeholder="在这里输入原文…"></textarea>
    </section>

    <div class="mk-toolbar">
      <button type="button" class="btn btn-primary" id="gb-run">生成乱码</button>
      <button type="button" class="btn btn-outline" id="gb-clear">清空</button>
      <span class="mk-status" id="gb-status"></span>
    </div>

    <div class="mk-results" id="gb-results"></div>
    <button type="button" class="btn btn-outline mk-more" id="gb-more" hidden></button>
    <div class="tool-error" id="gb-error" role="alert"></div>

    <dialog class="mk-help" id="gb-help" aria-labelledby="gb-help-title">
      <div class="mk-help-head">
        <h2 class="mk-help-title" id="gb-help-title">编码组合与排序</h2>
        <button type="button" class="mk-help-close" id="gb-help-close" aria-label="关闭">×</button>
      </div>
      <p class="mk-help-desc">
        把原文按箭头左边的编码写成字节，再按右边的编码读出来，就得到乱码。
        下列编码两两组合都会试一遍（共 <b id="gb-help-count"></b> 种组合），
        结果按信息保留从高到低排列。
      </p>
      <dl class="mk-help-list" id="gb-help-list"></dl>
      <p class="mk-help-note">
        信息保留按“编码往返相似度”计算：把乱码结果再按同一组合编码回去，
        再和原文逐字符比较，越接近说明保留的信息越多；内容相同的组合只保留一条。
      </p>
    </dialog>

    <dialog class="mk-help mk-preview" id="gb-preview" aria-labelledby="gb-preview-title">
      <div class="mk-help-head">
        <h2 class="mk-help-title" id="gb-preview-title"></h2>
        <button type="button" class="mk-help-close" id="gb-preview-close" aria-label="关闭">×</button>
      </div>
      <p class="mk-preview-meta" id="gb-preview-meta"></p>
      <textarea class="input mono mk-preview-text" id="gb-preview-text" readonly
        spellcheck="false"></textarea>
      <div class="mk-preview-actions">
        <button type="button" class="btn btn-outline" id="gb-preview-copy">复制</button>
      </div>
    </dialog>
  `;const o=e.querySelector("#gb-input");const c=e.querySelector("#gb-results");const l=e.querySelector("#gb-more");const a=e.querySelector("#gb-status");const i=e.querySelector("#gb-error");let n=[];const d=e.querySelector("#gb-help");const y=e.querySelector("#gb-help-list");const E=e.querySelector("#gb-help-count");function f(){const t=M();const s=new Map;for(const r of t){const u=r.group||"其它";if(!s.has(u))s.set(u,[]);s.get(u).push(r.label)}const p=document.createDocumentFragment();for(const[r,u]of s){const m=document.createElement("div");m.className="mk-help-row";const h=document.createElement("dt");h.textContent=r;const b=document.createElement("dd");b.textContent=u.join("、");m.append(h,b);p.append(m)}y.replaceChildren(p);E.textContent=String(t.length*(t.length-1))}e.querySelector("#gb-help-btn").addEventListener("click",()=>{f();if(!d.open)d.showModal()});e.querySelector("#gb-help-close").addEventListener("click",()=>d.close());d.addEventListener("click",t=>{if(t.target===d)d.close()});I().catch(()=>{});const v=e.querySelector("#gb-preview");const B=e.querySelector("#gb-preview-title");const F=e.querySelector("#gb-preview-meta");const w=e.querySelector("#gb-preview-text");function O(t){B.textContent=t.label;F.textContent=`信息保留 ${Math.round(t.keep*100)}%`;w.value=t.text;w.scrollTop=0;w.scrollLeft=0;if(!v.open)v.showModal()}e.querySelector("#gb-preview-close").addEventListener("click",()=>v.close());e.querySelector("#gb-preview-copy").addEventListener("click",()=>$(w.value));v.addEventListener("click",t=>{if(t.target===v)v.close()});function g(t){a.textContent=t}function S(t){if(t){i.textContent=t;i.classList.add("show")}else{i.textContent="";i.classList.remove("show")}}function C(){c.replaceChildren();l.hidden=true;n=[];S(null)}function j(t){const s=document.createElement("article");s.className="mk-result";const p=document.createElement("div");p.className="mk-result-head";const r=document.createElement("span");r.className="mk-result-pair";r.textContent=t.label;r.title=`原文按 ${x[t.source]} 写成字节，再当作 ${x[t.shown]} 显示`;const u=Math.round(t.keep*100);const m=document.createElement("span");m.className=`mk-result-tag ${R(u)}`;m.textContent=`保留 ${u}%`;m.title=`信息保留 ${(t.keep*100).toFixed(1)}%`;const h=document.createElement("button");h.type="button";h.className="btn btn-outline mk-result-copy";h.textContent="复制";h.addEventListener("click",()=>$(t.text));const b=document.createElement("button");b.type="button";b.className="mk-result-expand";b.textContent="放大";b.title="在大窗口中查看";b.addEventListener("click",()=>O(t));p.append(r);const L=document.createElement("div");L.className="mk-result-foot";L.append(m,b,h);const k=document.createElement("textarea");k.className="input mk-result-text";k.readOnly=true;k.spellcheck=false;k.value=t.text;k.setAttribute("aria-label",`${t.label} 的乱码结果`);s.append(p,k,L);return s}function N(t){const s=t?n:n.slice(0,G);c.replaceChildren();const p=document.createDocumentFragment();for(const u of s)p.append(j(u));c.append(p);const r=n.length-s.length;l.hidden=r<=0;if(r>0){l.textContent=`显示其余 ${r} 个结果`;l.onclick=()=>N(true)}}async function H(){const t=o.value;if(t.trim()===""){C();g("请先输入原文");return}g("正在计算…");try{await I()}catch{g("");S("编码模块加载失败，请刷新页面重试。");return}const s=_(t);if(!s.length){C();g("没有找到可用的乱码结果");return}n=s;N(false);S(null);g(`已尝试 ${A().length} 种组合，按信息保留从高到低排列`)}e.querySelector("#gb-run").addEventListener("click",H);e.querySelector("#gb-clear").addEventListener("click",()=>{o.value="";C();g("");o.focus()});g("输入原文后，点击「生成乱码」查看所有编码组合");o.focus()}export{_ as analyze,Q as mount};
