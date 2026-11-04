import{copyText as T}from"../ui.js";import{SHAPES as G,cellCount as P,emptyCells as X,fillCells as J,normalizeCell as S,orderIndices as K,readCells as Q,resizeCells as R}from"../railfence-core.js";const F=5;const N=5;const L=1;const q=20;function tt(l){l.innerHTML=`
    <div class="tool-head">
      <h1 class="tool-title">栅栏</h1>
    </div>

    <div class="tool-stack">
      <section class="card tool-pane">
        <h2 class="card-title">配置</h2>
        <div class="rf-config">
          <div class="field field-inline">
            <label class="field-label" for="rf-shape">图形</label>
            <select id="rf-shape" class="input input-sm">
              ${G.map(t=>`<option value="${t.id}">${t.label}</option>`).join("")}
            </select>
          </div>
          <div class="field field-inline rf-size-fields">
            <label class="field-label" for="rf-w">宽</label>
            <input id="rf-w" class="input input-sm rf-size" type="number"
              min="${L}" max="${q}" step="1" value="${F}">
            <label class="field-label" for="rf-h">高</label>
            <input id="rf-h" class="input input-sm rf-size" type="number"
              min="${L}" max="${q}" step="1" value="${N}">
          </div>
          <label class="switch-row">
            <span class="switch">
              <input type="checkbox" id="rf-edit">
              <span class="track"><span class="thumb"></span></span>
            </span>
            编辑
          </label>
          <button type="button" class="btn btn-primary" id="rf-io">输入</button>
        </div>
      </section>

      <section class="card tool-pane">
        <h2 class="card-title">网格</h2>
        <div class="rf-grid-wrap">
          <div class="rf-grid" id="rf-grid"></div>
        </div>
        <p class="tool-hint" id="rf-hint"></p>
      </section>

      <section class="card tool-pane">
        <h2 class="card-title">输出</h2>
        <textarea id="rf-output" class="input mono" readonly spellcheck="false"
          placeholder="点击网格里的字符，会追加到这里…"></textarea>
        <div class="rf-output-actions">
          <button type="button" class="btn btn-secondary" id="rf-copy">复制</button>
          <button type="button" class="btn btn-outline" id="rf-clear">清空</button>
        </div>
      </section>
    </div>

    <dialog class="mk-help rf-dialog" id="rf-input-dialog" aria-labelledby="rf-input-title">
      <div class="mk-help-head">
        <h2 class="mk-help-title" id="rf-input-title">输入文本</h2>
        <button type="button" class="mk-help-close" id="rf-input-close" aria-label="关闭">×</button>
      </div>
      <p class="mk-help-desc" id="rf-input-desc"></p>
      <textarea id="rf-input-text" class="input mono" spellcheck="false"
        placeholder="在这里输入要填进格子的文本…"></textarea>
      <div class="rf-warn" id="rf-input-warn" role="alert"></div>
      <div class="rf-dialog-actions">
        <button type="button" class="btn btn-outline" id="rf-input-cancel">取消</button>
        <button type="button" class="btn btn-primary" id="rf-input-apply">应用</button>
      </div>
    </dialog>

    <dialog class="mk-help rf-dialog" id="rf-output-dialog" aria-labelledby="rf-output-title">
      <div class="mk-help-head">
        <h2 class="mk-help-title" id="rf-output-title">输出文本</h2>
        <button type="button" class="mk-help-close" id="rf-output-close" aria-label="关闭">×</button>
      </div>
      <p class="mk-help-desc" id="rf-output-desc"></p>
      <textarea id="rf-output-text" class="input mono" readonly spellcheck="false"></textarea>
      <div class="rf-dialog-actions">
        <button type="button" class="btn btn-outline" id="rf-output-cancel">关闭</button>
        <button type="button" class="btn btn-secondary" id="rf-output-copy">复制</button>
      </div>
    </dialog>
  `;const $=l.querySelector("#rf-shape");const A=l.querySelector(".rf-size-fields");const v=l.querySelector("#rf-w");const x=l.querySelector("#rf-h");const d=l.querySelector("#rf-edit");const C=l.querySelector("#rf-io");const a=l.querySelector("#rf-grid");const H=l.querySelector("#rf-hint");const p=l.querySelector("#rf-output");let o=[];let f=false;function w(t,n){const e=Math.trunc(Number(t.value));if(!Number.isFinite(e))return n;return Math.min(q,Math.max(L,e))}function D(){return $.value}function i(){return w(v,F)}function u(){return w(x,N)}function y(){return K(D(),i(),u())}function h(){return P(D(),i(),u())}function _(){a.classList.remove("is-edit");a.style.gridTemplateColumns=`repeat(${i()}, auto)`;const t=document.createDocumentFragment();y().forEach(n=>{const e=S(o[n]);const s=document.createElement("button");s.type="button";s.className="rf-cell";s.textContent=e;s.title=`追加「${e===" "?"空格":e}」到输出`;s.addEventListener("click",()=>{p.value+=e});t.append(s)});a.replaceChildren(t)}function B(){a.classList.add("is-edit");a.style.gridTemplateColumns=`repeat(${i()}, auto)`;const t=document.createDocumentFragment();y().forEach(n=>{const e=document.createElement("input");e.type="text";e.className="input rf-cell-input";e.value=S(o[n]);e.spellcheck=false;e.autocomplete="off";e.setAttribute("aria-label",`第 ${n+1} 格`);e.addEventListener("input",()=>{const s=S(e.value);o[n]=s;if(e.value!==s)e.value=s});e.addEventListener("blur",()=>{o[n]=S(e.value);e.value=o[n]});t.append(e)});a.replaceChildren(t)}function m(){if(d.checked)B();else _();z()}function z(){const t=i();const n=u();H.textContent=d.checked?`编辑模式：每格 1 个字符，点「输出」把 ${t} × ${n} 个格子拼成文本`:`共 ${t} × ${n} = ${t*n} 格，点击任意格可把该字符追加到输出`}function I(){v.value=String(i());x.value=String(u());o=R(o,h());m()}const c=l.querySelector("#rf-input-dialog");const g=l.querySelector("#rf-input-text");const E=l.querySelector("#rf-input-warn");const W=l.querySelector("#rf-input-desc");const b=l.querySelector("#rf-input-apply");function k(t){if(!t){E.textContent="";E.classList.remove("show");return}E.textContent=t;E.classList.add("show")}function O(){const t=h();W.textContent=`按图形顺序（${$.selectedOptions[0].textContent}：从左到右、从上到下）填进 ${i()} × ${u()} = ${t} 格。`;g.value="";f=false;b.textContent="应用";k("");if(!c.open)c.showModal();g.focus()}function U(){const t=g.value;const n=h();const e=Array.from(t).length;if(!f&&e!==n){f=true;b.textContent="仍然应用";k(e>n?`文本有 ${e} 个字符，比网格的 ${n} 格多 ${e-n} 个，多出的会被丢弃。再点一次「仍然应用」即可写入。`:`文本有 ${e} 个字符，比网格的 ${n} 格少 ${n-e} 个，空着的格子会被清成空格。再点一次「仍然应用」即可写入。`);return}const s=J(n,t,y());o=s.cells;m();c.close();f=false;b.textContent="应用";k("")}l.querySelector("#rf-input-close").addEventListener("click",()=>c.close());l.querySelector("#rf-input-cancel").addEventListener("click",()=>c.close());b.addEventListener("click",U);g.addEventListener("input",()=>{f=false;b.textContent="应用";k("")});c.addEventListener("click",t=>{if(t.target===c)c.close()});const r=l.querySelector("#rf-output-dialog");const M=l.querySelector("#rf-output-text");const Z=l.querySelector("#rf-output-desc");function j(){Z.textContent=`按图形顺序（从左到右、从上到下）把 ${i()} × ${u()} = ${h()} 格拼成一串文本。`;M.value=Q(o,y());if(!r.open)r.showModal()}l.querySelector("#rf-output-close").addEventListener("click",()=>r.close());l.querySelector("#rf-output-cancel").addEventListener("click",()=>r.close());l.querySelector("#rf-output-copy").addEventListener("click",()=>T(M.value));r.addEventListener("click",t=>{if(t.target===r)r.close()});$.addEventListener("change",()=>{A.hidden=false;I()});for(const t of[v,x]){t.addEventListener("change",I);t.addEventListener("input",()=>{if(Number.isFinite(Number(t.value)))z()})}d.addEventListener("change",()=>{C.textContent=d.checked?"输出":"输入";m()});C.addEventListener("click",()=>{if(d.checked)j();else O()});l.querySelector("#rf-copy").addEventListener("click",()=>{if(!p.value)return;T(p.value)});l.querySelector("#rf-clear").addEventListener("click",()=>{p.value="";p.focus()});o=X(h());m();v.focus()}export{tt as mount};
