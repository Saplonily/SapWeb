import{copyText as v}from"../ui.js";import{boldText as h,normalizeBits as y}from"../bolder-core.js";function w(t){t.innerHTML=`
    <div class="tool-head">
      <h1 class="tool-title">bolder</h1>
    </div>

    <div class="tool-stack">
      <section class="card tool-pane">
        <h2 class="card-title">输入</h2>
        <div class="bd-inputs">
          <div class="field">
            <label class="field-label" for="bd-bits">二进制</label>
            <input id="bd-bits" class="input mono" type="text" spellcheck="false"
              autocomplete="off" placeholder="只填 0 和 1，空白可用来分组">
          </div>
          <div class="field">
            <label class="field-label" for="bd-text">文本</label>
            <textarea id="bd-text" class="input mono" spellcheck="false"
              placeholder="在这里输入要加标签的文本…"></textarea>
          </div>
        </div>
      </section>

      <div class="tool-controls">
        <div class="controls-actions">
          <button type="button" class="btn btn-primary" id="bd-run">转换</button>
          <button type="button" class="btn btn-secondary" id="bd-copy">复制</button>
        </div>
        <div class="controls-fields">
          <div class="field field-inline">
            <label class="field-label" for="bd-open">开标签</label>
            <input id="bd-open" class="input input-sm bd-tag" type="text"
              spellcheck="false" autocomplete="off" value="&lt;bold&gt;">
          </div>
          <div class="field field-inline">
            <label class="field-label" for="bd-close">闭标签</label>
            <input id="bd-close" class="input input-sm bd-tag" type="text"
              spellcheck="false" autocomplete="off" value="&lt;/bold&gt;">
          </div>
          <label class="switch-row">
            <span class="switch">
              <input type="checkbox" id="bd-batch" checked>
              <span class="track"><span class="thumb"></span></span>
            </span>
            batch
          </label>
        </div>
      </div>

      <section class="card tool-pane">
        <h2 class="card-title">输出</h2>
        <textarea id="bd-output" class="input mono" readonly spellcheck="false"
          placeholder="结果会显示在这里…"></textarea>
      </section>

      <div class="bd-warn" id="bd-warn" role="status"></div>
    </div>
  `;const c=t.querySelector("#bd-bits");const n=t.querySelector("#bd-text");const o=t.querySelector("#bd-output");const r=t.querySelector("#bd-open");const u=t.querySelector("#bd-close");const b=t.querySelector("#bd-batch");const a=t.querySelector("#bd-warn");function i(e,s=false){if(!e){a.textContent="";a.classList.remove("show","is-error");return}a.textContent=e;a.classList.add("show");a.classList.toggle("is-error",s)}function p(e){const{converted:s,slots:l,bitCount:d}=e;if(d<l){return`二进制只有 ${d} 位，只转换了前 ${s} 个字符（文本共 ${l} 个非空格字符）`}if(l<d){return`文本只有 ${l} 个非空格字符，多出的 ${d-l} 位已忽略`}return""}function f(){if(c.value.trim()===""||n.value===""){o.value="";i("");return}try{const e=r.value;const s=u.value;if(e===""||s===""){throw new Error("开标签与闭标签都必须填写")}const l=h(n.value,y(c.value),{open:e,close:s,batch:b.checked});o.value=l.value;i(p(l))}catch(e){o.value="";i(e.message,true)}}t.querySelector("#bd-run").addEventListener("click",f);t.querySelector("#bd-copy").addEventListener("click",async()=>{if(!o.value)return;await v(o.value)});for(const e of[c,n,r,u,b]){e.addEventListener("input",()=>i(""))}c.focus()}export{w as mount};
