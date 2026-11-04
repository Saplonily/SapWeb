const c="A".charCodeAt(0);const s="a".charCodeAt(0);function n(o){let t="";for(const e of String(o)){const a=e.charCodeAt(0);if(a>=c&&a<=c+25){t+=String.fromCharCode(c+25-(a-c))}else if(a>=s&&a<=s+25){t+=String.fromCharCode(s+25-(a-s))}else{t+=e}}return t}function r(o){o.innerHTML=`
    <div class="tool-head">
      <h1 class="tool-title">Atbash</h1>
    </div>

    <div class="tool-stack">
      <section class="card tool-pane">
        <h2 class="card-title">输入</h2>
        <textarea id="ab-input" class="input mono" spellcheck="false"
          placeholder="在这里输入要转换的文本…"></textarea>
      </section>

      <div class="tool-controls">
        <div class="controls-actions">
          <button type="button" class="btn btn-primary" id="ab-run">转换</button>
          <button type="button" class="btn btn-secondary" id="ab-copy">复制</button>
          <button type="button" class="btn btn-outline" id="ab-swap">互换 ⇄</button>
        </div>
      </div>

      <section class="card tool-pane">
        <h2 class="card-title">输出</h2>
        <textarea id="ab-output" class="input mono" readonly spellcheck="false"
          placeholder="结果会显示在这里…"></textarea>
      </section>
    </div>
  `;const t=o.querySelector("#ab-input");const e=o.querySelector("#ab-output");function a(){e.value=t.value.trim()===""?"":n(t.value)}o.querySelector("#ab-run").addEventListener("click",a);o.querySelector("#ab-copy").addEventListener("click",async()=>{if(!e.value)return;const{copyText:l}=await import("../ui.js");await l(e.value)});o.querySelector("#ab-swap").addEventListener("click",()=>{if(!e.value)return;t.value=e.value;e.value="";t.focus()});t.focus()}export{n as atbash,r as mount};
