import{copyText as H}from"../ui.js";import{loadEncoder as T}from"../encoding.js";const U=200;const k=["GB2312","BIG5","GBK","GB18030"];const F=new TextEncoder;let N=null;function q(){if(!N){N=Promise.all([import("../data/gb2312.js"),import("../data/big5.js")]).then(([e,n])=>({gb2312Code:e.gb2312Code,big5Code:n.big5Code}))}return N}function I(e,n){if(n==="dec")return e.join(" ");return e.map(t=>t.toString(16).padStart(2,"0")).join("").toUpperCase()}function A(e,n){if(n==="dec")return String(e);return e.toString(16).toUpperCase().padStart(8,"0")}function g(e,n){const t=e.codePointAt(0);const c=t>65535?[55296+(t-65536>>10),56320+(t-65536&1023)]:[t];const o=[];for(const i of c){if(n)o.push(i&255,i>>8);else o.push(i>>8,i&255)}return o}function P(e,n,t){const c=e.codePointAt(0);if(c<128)return[c];if(n==="GB2312")return t.gb2312Code(e);if(n==="BIG5")return t.big5Code(e);let o;try{o=new Uint8Array(t.iconv.encode(e,n.toLowerCase()))}catch{return null}return o.includes(63)?null:[...o]}function $(e,n){const t=k.map(c=>({label:c,bytes:P(e,c,n)}));t.push({label:"Unicode",cp:e.codePointAt(0)});t.push({label:"UTF-8",bytes:[...F.encode(e)]});t.push({label:"UTF-16BE",bytes:g(e,false)});t.push({label:"UTF-16LE",bytes:g(e,true)});return t}function M(e,n){const t=k.map(r=>{const h=[];for(const d of e){const E=P(d,r,n);if(!E)return{label:r,bytes:null};h.push(...E)}return{label:r,bytes:h}});t.push({label:"Unicode",cps:e.map(r=>r.codePointAt(0))});const c=[];const o=[];const i=[];for(const r of e){c.push(...F.encode(r));o.push(...g(r,false));i.push(...g(r,true))}t.push({label:"UTF-8",bytes:c});t.push({label:"UTF-16BE",bytes:o});t.push({label:"UTF-16LE",bytes:i});return t}function G(e,n){if(e.cps)return e.cps.map(t=>A(t,n)).join(" ");if(e.cp!==void 0)return A(e.cp,n);if(!e.bytes)return null;return I(e.bytes,n)}function X(e){e.innerHTML=`
    <div class="tool-head">
      <h1 class="tool-title">字符集查询</h1>
    </div>

    <section class="card mk-input-card">
      <textarea id="cs-input" class="input mono" spellcheck="false"
        placeholder="输入一个或多个字符…"></textarea>
    </section>

    <div class="mk-toolbar">
      <button type="button" class="btn btn-primary" id="cs-run">查询</button>
      <button type="button" class="btn btn-outline" id="cs-clear">清空</button>
      <div class="cs-options">
        <div class="field field-inline">
          <label class="field-label" for="cs-mode">输出</label>
          <select id="cs-mode" class="input input-sm">
            <option value="char">单字</option>
            <option value="string">整串</option>
          </select>
        </div>
        <div class="field field-inline">
          <label class="field-label" for="cs-radix">进制</label>
          <select id="cs-radix" class="input input-sm">
            <option value="hex">十六进制</option>
            <option value="dec">十进制</option>
          </select>
        </div>
      </div>
      <span class="mk-status" id="cs-status"></span>
    </div>

    <div class="cs-results" id="cs-results"></div>
    <div class="tool-error" id="cs-error" role="alert"></div>
  `;const n=e.querySelector("#cs-input");const t=e.querySelector("#cs-results");const c=e.querySelector("#cs-status");const o=e.querySelector("#cs-error");const i=e.querySelector("#cs-mode");const r=e.querySelector("#cs-radix");let h=0;function d(s){c.textContent=s}function E(s){if(s){o.textContent=s;o.classList.add("show")}else{o.textContent="";o.classList.remove("show")}}function y(){t.replaceChildren()}function R(s,v,p,f){const m=document.createElement("article");m.className="cs-card";const b=document.createElement("div");b.className="cs-card-head";const l=document.createElement("span");l.className="cs-char";l.textContent=s;const u=document.createElement("span");u.className="cs-index";u.textContent=String(v);b.append(l,u);const a=document.createElement("dl");a.className="cs-rows";for(const C of p){const S=document.createElement("div");S.className="cs-row";const B=document.createElement("dt");B.textContent=C.label;const x=document.createElement("dd");x.className="mono";const L=G(C,f);if(L===null){x.textContent="没有";x.classList.add("cs-none")}else{x.textContent=L}S.append(B,x);a.append(S)}m.append(b,a);return m}function j(s,v){const p=document.createElement("article");p.className="cs-card cs-card-string";const f=document.createElement("div");f.className="cs-card-head";const m=document.createElement("span");m.className="cs-charset";m.textContent=s.label;f.append(m);const b=G(s,v);if(b===null){const a=document.createElement("div");a.className="cs-code-block cs-none";a.textContent="没有";p.append(f,a);return p}const l=document.createElement("button");l.type="button";l.className="btn btn-outline mk-result-copy";l.textContent="复制";l.addEventListener("click",()=>H(b));f.append(l);const u=document.createElement("div");u.className="cs-code-block mono";u.textContent=b;p.append(f,u);return p}async function w(){const s=[...n.value];if(s.length===0){y();d("请先输入要查询的字符");return}if(s.length>U){y();d("");E(`一次最多查询 ${U} 个字符`);return}const v=++h;d("正在查询…");let p;let f;try{[p,f]=await Promise.all([q(),T()])}catch{if(v!==h)return;y();d("");E("编码模块加载失败，请刷新页面重试。");return}if(v!==h)return;const m={...p,iconv:f};const b=i.value;const l=r.value;y();const u=document.createDocumentFragment();if(b==="string"){for(const a of M(s,m)){u.append(j(a,l))}d(`共 ${s.length} 个字符，按整串输出`)}else{s.forEach((a,C)=>{u.append(R(a,C+1,$(a,m),l))});d(`共 ${s.length} 个字符`)}t.append(u);E(null)}e.querySelector("#cs-run").addEventListener("click",w);e.querySelector("#cs-clear").addEventListener("click",()=>{n.value="";y();d("");E(null);n.focus()});for(const s of[i,r]){s.addEventListener("change",()=>{if(n.value!=="")w()})}q().catch(()=>{});T().catch(()=>{});d("输入字符后点击「查询」，例如：啊〇跱");n.focus()}export{X as mount};
