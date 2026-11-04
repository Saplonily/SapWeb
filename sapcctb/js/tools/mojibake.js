import{copyText as q}from"../ui.js";import{ENCODINGS as H,encodingsAvailable as I,loadEncoder as N,recoverText as z}from"../encoding.js";import{SIMPLIFIED as G,TRADITIONAL as K}from"../data/char-freq.js";const w=Object.fromEntries(H.map(t=>[t.id,t.label]));const _=24;let S=null;function T(){if(S)return S;const t=I();const e=[];for(const l of t){for(const r of t){if(l.id!==r.id)e.push([l.id,r.id])}}S=e;return e}let L=null;function J(t){if(t<=200)return 3.4;if(t<=500)return 3.2;if(t<=1e3)return 3;if(t<=1800)return 2.7;if(t<=3e3)return 2.3;return 1.8}function Q(){if(L)return L;const t=new Map;const e=l=>{let r=0;for(const i of l){r++;const c=J(r);const m=t.get(i);if(m===void 0||c>m)t.set(i,c)}};e(G);e(K);L=t;return t}function U(t){const e=t.codePointAt(0);if(e===9||e===10||e===13)return 2;if(e<32)return-6;if(e>=127&&e<=159)return-6;if(e>=57344&&e<=63743)return-6;if(e>=12352&&e<=12543)return 2.4;if(e>=65377&&e<=65439)return 1;if(e>=44032&&e<=55203)return 2.2;if(e>=13312&&e<=40959){const l=Q().get(t);return l===void 0?-.2:l}if(e>=12288&&e<=12351)return 2.4;if(e>=65280&&e<=65519)return 1.4;if(e>=32&&e<=126)return 2.6;if(e>=8192&&e<=8303)return 1.8;if(e>=8352&&e<=8527)return-2;if(e>=192&&e<=591&&e!==215&&e!==247)return 1.2;if(e>=160&&e<=191||e===215||e===247)return-2;return 0}function $(t){let e=0;let l=0;let r=0;for(const i of t){if(i==="�"){r++;continue}e+=U(i);l++}if(l===0)return-Infinity;return e/l-r/(l+r)*4}function M(t){if(t>=2.5)return"高";if(t>=1.6)return"中";return"低"}function V(t){if(t>=2.5)return"high";if(t>=1.6)return"mid";return"low"}function W(t){let e=0;let l=0;for(const r of t){if(r==="�")e++;l++}return l===0?1:e/l}function X(t){const e=[];const l=new Set;for(const[r,i]of T()){const c=z(t,r,i);if(c==null||c===t)continue;if(W(c)>.5)continue;if(l.has(c))continue;l.add(c);e.push({key:`${r}>${i}`,from:r,to:i,label:`${w[r]} → ${w[i]}`,text:c,score:$(c)})}e.sort((r,i)=>i.score-r.score);return e}function te(t){t.innerHTML=`
    <div class="tool-head mk-head">
      <h1 class="tool-title">乱码恢复</h1>
      <button type="button" class="mk-help-btn" id="mk-help-btn"
        aria-label="查看支持的编码与复制说明" title="查看支持的编码与复制说明">?</button>
    </div>

    <section class="card mk-input-card">
      <textarea id="mk-input" class="input mono" spellcheck="false"
        placeholder="在这里粘贴乱码文本…"></textarea>
    </section>

    <div class="mk-toolbar">
      <button type="button" class="btn btn-primary" id="mk-run">恢复</button>
      <button type="button" class="btn btn-outline" id="mk-clear">清空</button>
      <span class="mk-status" id="mk-status"></span>
    </div>

    <div class="mk-results" id="mk-results"></div>
    <button type="button" class="btn btn-outline mk-more" id="mk-more" hidden></button>
    <div class="tool-error" id="mk-error" role="alert"></div>

    <dialog class="mk-help" id="mk-help" aria-labelledby="mk-help-title">
      <div class="mk-help-head">
        <h2 class="mk-help-title" id="mk-help-title">支持的编码</h2>
        <button type="button" class="mk-help-close" id="mk-help-close" aria-label="关闭">×</button>
      </div>
      <p class="mk-help-desc">
        恢复时会把文本按「当前编码」写回字节，再按「原始编码」读出来。
        下列编码两两组合都会试一遍（共 <b id="mk-help-count"></b> 种组合），结果按可信度从高到低排列。
      </p>
      <dl class="mk-help-list" id="mk-help-list"></dl>
      <p class="mk-help-note">
        结果中的 <span class="mk-help-fffd">�</span> 表示该处字节已丢失，无法还原；内容相同的组合只保留一条。
      </p>
      <p class="mk-help-note">
        复制结果前会自动过滤不可见控制字符（如 \0~、~），避免乱码中夹带的控制符造成剪贴板截断。
      </p>
      <p class="mk-help-note">
        可信度只覆盖部分字符集：以简繁常用汉字字频表为主，另加假名、谚文、ASCII 等少量规则；
        英文等没有字频信息的文本会普遍得到「低」，只适合在同一批结果之间横向比较。
      </p>
    </dialog>

    <dialog class="mk-help mk-preview" id="mk-preview" aria-labelledby="mk-preview-title">
      <div class="mk-help-head">
        <h2 class="mk-help-title" id="mk-preview-title"></h2>
        <button type="button" class="mk-help-close" id="mk-preview-close" aria-label="关闭">×</button>
      </div>
      <p class="mk-preview-meta" id="mk-preview-meta"></p>
      <textarea class="input mono mk-preview-text" id="mk-preview-text" readonly
        spellcheck="false"></textarea>
      <div class="mk-preview-actions">
        <button type="button" class="btn btn-outline" id="mk-preview-copy">复制</button>
      </div>
    </dialog>
  `;const e=t.querySelector("#mk-input");const l=t.querySelector("#mk-results");const r=t.querySelector("#mk-more");const i=t.querySelector("#mk-status");const c=t.querySelector("#mk-error");let m=null;let v=[];const k=t.querySelector("#mk-help");const A=t.querySelector("#mk-help-list");const D=t.querySelector("#mk-help-count");function F(){const n=I();const o=new Map;for(const s of n){const a=s.group||"其它";if(!o.has(a))o.set(a,[]);o.get(a).push(s.label)}const u=document.createDocumentFragment();for(const[s,a]of o){const d=document.createElement("div");d.className="mk-help-row";const f=document.createElement("dt");f.textContent=s;const x=document.createElement("dd");x.textContent=a.join("、");d.append(f,x);u.append(d)}A.replaceChildren(u);D.textContent=String(n.length*(n.length-1))}t.querySelector("#mk-help-btn").addEventListener("click",()=>{F();if(!k.open)k.showModal()});t.querySelector("#mk-help-close").addEventListener("click",()=>k.close());k.addEventListener("click",n=>{if(n.target===k)k.close()});N().catch(()=>{});const h=t.querySelector("#mk-preview");const O=t.querySelector("#mk-preview-title");const j=t.querySelector("#mk-preview-meta");const y=t.querySelector("#mk-preview-text");function B(n){O.textContent=n.label;j.textContent=`可信度 ${M(n.score)}`;y.value=n.text;y.scrollTop=0;y.scrollLeft=0;if(!h.open)h.showModal()}t.querySelector("#mk-preview-close").addEventListener("click",()=>h.close());t.querySelector("#mk-preview-copy").addEventListener("click",()=>q(y.value));h.addEventListener("click",n=>{if(n.target===h)h.close()});function p(n){i.textContent=n}function E(n){if(n){c.textContent=n;c.classList.add("show")}else{c.textContent="";c.classList.remove("show")}}function g(){l.replaceChildren();r.hidden=true;m=null;v=[];E(null)}function P(n){const o=document.createElement("article");o.className="mk-result";if(n.key===m)o.classList.add("best");const u=document.createElement("div");u.className="mk-result-head";const s=document.createElement("span");s.className="mk-result-pair";s.textContent=n.label;s.title=`把这段文本当作 ${w[n.from]} 显示，还原为 ${w[n.to]}`;const a=document.createElement("span");a.className=`mk-result-tag ${V(n.score)}`;a.textContent=M(n.score);const d=document.createElement("button");d.type="button";d.className="btn btn-outline mk-result-copy";d.textContent="复制";d.addEventListener("click",()=>q(n.text));const f=document.createElement("button");f.type="button";f.className="mk-result-expand";f.textContent="放大";f.title="在大窗口中查看";f.addEventListener("click",()=>B(n));u.append(s);const x=document.createElement("div");x.className="mk-result-foot";x.append(a,f,d);const b=document.createElement("textarea");b.className="input mk-result-text";b.readOnly=true;b.spellcheck=false;b.value=n.text;b.setAttribute("aria-label",`${n.label} 的恢复结果`);o.append(u,b,x);return o}function C(n){const o=n?v:v.slice(0,_);l.replaceChildren();const u=document.createDocumentFragment();for(const a of o)u.append(P(a));l.append(u);const s=v.length-o.length;r.hidden=s<=0;if(s>0){r.textContent=`显示其余 ${s} 个结果`;r.onclick=()=>C(true)}}async function R(){const n=e.value;if(n.trim()===""){g();p("请先粘贴乱码文本");return}p("正在计算…");try{await N()}catch{p("");E("编码模块加载失败，请刷新页面重试。");return}const o=X(n);if(!o.length){g();p("没有找到可用的恢复结果：原文可能不含乱码，或字节已丢失");return}v=o;m=o[0].key;C(false);E(null);const u=$(n);const s=[`已尝试 ${T().length} 种组合，按可信度从高到低排列`];if(o[0].score<=u)s.push("输入本身更像正常文本");if(o.some(a=>a.text.includes("�"))){s.push("� 表示该处字节已丢失，无法还原")}p(s.join("；"))}t.querySelector("#mk-run").addEventListener("click",R);t.querySelector("#mk-clear").addEventListener("click",()=>{e.value="";g();p("");e.focus()});p("粘贴乱码文本后，点击「恢复」尝试所有编码组合");e.focus()}export{X as analyze,te as mount};
