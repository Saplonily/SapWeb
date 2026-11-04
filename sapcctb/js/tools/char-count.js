function x(c){return Array.from(String(c)).length}function v(c,s){const t=String(c);let a=0;let e=0;while(e<t.length&&e<s){const o=t.charCodeAt(e);e+=o>=55296&&o<=56319&&e+1<t.length?2:1;a++}return a}function g(c){c.innerHTML=`
    <div class="tool-head">
      <h1 class="tool-title">字数统计</h1>
    </div>

    <div class="tool-stack">
      <section class="card tool-pane">
        <h2 class="card-title">输入</h2>
        <textarea id="cc-input" class="input" spellcheck="false"
          placeholder="在这里输入或粘贴要统计的文本…"></textarea>
      </section>

      <div class="cc-stat" aria-live="polite">
        <span class="cc-stat-value" id="cc-count">0</span>
        <span class="cc-stat-label">字符</span>
      </div>

      <section class="card cc-pos">
        <h2 class="card-title">位置</h2>
        <div class="cc-pos-grid">
          <div class="cc-pos-item">
            <span class="cc-pos-label">光标</span>
            <span class="cc-pos-value" id="cc-caret">–</span>
          </div>
          <div class="cc-pos-item cc-sel" hidden>
            <span class="cc-pos-label">选区开始</span>
            <span class="cc-pos-value" id="cc-sel-start">–</span>
          </div>
          <div class="cc-pos-item cc-sel" hidden>
            <span class="cc-pos-label">选区结束</span>
            <span class="cc-pos-value" id="cc-sel-end">–</span>
          </div>
          <div class="cc-pos-item cc-sel" hidden>
            <span class="cc-pos-label">选区长度</span>
            <span class="cc-pos-value" id="cc-sel-len">–</span>
          </div>
        </div>
        <div class="cc-pos-opt">
          <label class="field-label" for="cc-base">起始序号</label>
          <select id="cc-base" class="input input-sm">
            <option value="1" selected>从 1 开始</option>
            <option value="0">从 0 开始</option>
          </select>
        </div>
      </section>
    </div>
  `;const s=c.querySelector("#cc-input");const t=c.querySelector("#cc-count");const a=c.querySelector("#cc-caret");const e=c.querySelector("#cc-sel-start");const o=c.querySelector("#cc-sel-end");const f=c.querySelector("#cc-sel-len");const h=c.querySelectorAll(".cc-sel");const r=c.querySelector("#cc-base");function S(){return Number(r.value)||0}function l(){const n=s.value;t.textContent=String(x(n));const d=S();const i=v(n,s.selectionStart);const p=v(n,s.selectionEnd);a.textContent=String(i+d);const u=p>i;for(const b of h)b.hidden=!u;if(!u)return;e.textContent=String(i+d);o.textContent=String(p+d);f.textContent=String(p-i)}s.addEventListener("input",l);for(const n of["select","click","keyup","focus"]){s.addEventListener(n,l)}r.addEventListener("change",l);l();s.focus();l()}export{x as countCodePoints,g as mount,v as toCodePointIndex};
