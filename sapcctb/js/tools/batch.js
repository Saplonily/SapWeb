import{copyText as C}from"../ui.js";const A=24;function F(l,n){const{id:e,title:I}=n;l.innerHTML=`
    <div class="tool-head${n.headExtra?" mk-head":""}">
      <h1 class="tool-title">${I}</h1>
      ${n.headExtra||""}
    </div>

    <section class="card mk-input-card">
      <textarea id="${e}-input" class="input mono" spellcheck="false"
        placeholder="${n.placeholder||""}"></textarea>
      ${n.optionsHtml||""}
    </section>

    <div class="mk-toolbar">
      <button type="button" class="btn btn-primary" id="${e}-run">${n.runLabel||"开始"}</button>
      <button type="button" class="btn btn-outline" id="${e}-clear">清空</button>
      <span class="mk-status" id="${e}-status"></span>
    </div>

    <div class="mk-results" id="${e}-results"></div>
    <button type="button" class="btn btn-outline mk-more" id="${e}-more" hidden></button>
    <div class="tool-error" id="${e}-error" role="alert"></div>

    ${n.customSlot||""}

    <dialog class="mk-help mk-preview" id="${e}-preview" aria-labelledby="${e}-preview-title">
      <div class="mk-help-head">
        <h2 class="mk-help-title" id="${e}-preview-title"></h2>
        <button type="button" class="mk-help-close" id="${e}-preview-close" aria-label="关闭">×</button>
      </div>
      <textarea class="input mono mk-preview-text" id="${e}-preview-text" readonly
        spellcheck="false"></textarea>
      <div class="mk-preview-actions">
        <button type="button" class="btn btn-outline" id="${e}-preview-copy">复制</button>
      </div>
    </dialog>
  `;const p=l.querySelector(`#${e}-input`);const y=l.querySelector(`#${e}-results`);const h=l.querySelector(`#${e}-more`);const N=l.querySelector(`#${e}-status`);const $=l.querySelector(`#${e}-error`);let c=[];let a=[];let k=false;function o(t){N.textContent=t}function f(t){if(t){$.textContent=t;$.classList.add("show")}else{$.textContent="";$.classList.remove("show")}}function m(){y.replaceChildren();h.hidden=true;c=[];a=[];k=false;f(null)}const i=l.querySelector(`#${e}-preview`);const T=l.querySelector(`#${e}-preview-title`);const x=l.querySelector(`#${e}-preview-text`);function B(t){T.textContent=t.label;x.value=t.text;x.scrollTop=0;x.scrollLeft=0;if(!i.open)i.showModal()}l.querySelector(`#${e}-preview-close`).addEventListener("click",()=>i.close());l.querySelector(`#${e}-preview-copy`).addEventListener("click",()=>C(x.value));i.addEventListener("click",t=>{if(t.target===i)i.close()});function M(t){const s=document.createElement("article");s.className="mk-result";const r=document.createElement("div");r.className="mk-result-head";const v=document.createElement("span");v.className="mk-result-pair batch-label";v.textContent=t.label;const u=document.createElement("textarea");u.className="input mk-result-text";u.readOnly=true;u.spellcheck=false;u.value=t.text;u.setAttribute("aria-label",`${t.label} 的结果`);const w=document.createElement("div");w.className="mk-result-foot";const d=document.createElement("button");d.type="button";d.className="mk-result-expand";d.textContent="放大";d.title="在大窗口中查看";d.addEventListener("click",()=>B(t));const b=document.createElement("button");b.type="button";b.className="btn btn-outline mk-result-copy";b.textContent="复制";b.addEventListener("click",()=>C(t.text));r.append(v);w.append(d,b);s.append(r,u,w);return s}function E(){const t=k?a:a.slice(0,A);y.replaceChildren();const s=document.createDocumentFragment();for(const v of t)s.append(M(v));y.append(s);const r=a.length-t.length;h.hidden=r<=0;if(r>0){h.textContent=`显示其余 ${r} 个结果`;h.onclick=()=>{k=true;E()}}}function L(){a=n.filter?n.filter(c,l):c;k=false;E();const t=c.length;if(a.length===t){o(`共 ${t} 条结果`)}else{o(`共 ${t} 条结果，筛选后 ${a.length} 条`)}}function S(){const t=p.value;if(t.trim()===""){m();o("请先输入文本");return}let s;try{s=n.run({text:t,container:l})||[]}catch(r){m();o("");f(r.message);return}if(!s.length){m();o("没有可用的结果");return}c=s;f(null);L()}function g(){if(!c.length)return;L()}const q={input:p,container:l,run:S,refresh:g,clearResults:m,setStatus:o};l.querySelector(`#${e}-run`).addEventListener("click",S);l.querySelector(`#${e}-clear`).addEventListener("click",()=>{p.value="";m();o(n.hint||"");p.focus()});n.bindOptions?.(q);o(n.hint||"");p.focus();return q}export{F as buildBatchPage};
