function b(l,t){const{id:a,title:m}=t;const u=(t.controls||[]).map(e=>{switch(e.type){case"number":return`
            <div class="field field-inline">
              <label class="field-label" for="${e.id}">${e.label}</label>
              <input id="${e.id}" class="input input-sm" type="number"
                step="${e.step??1}" ${e.min!=null?`min="${e.min}"`:""}
                ${e.max!=null?`max="${e.max}"`:""} value="${e.value??0}">
            </div>`;case"switch":return`
            <label class="switch-row">
              <span class="switch">
                <input type="checkbox" id="${e.id}" ${e.checked?"checked":""}>
                <span class="track"><span class="thumb"></span></span>
              </span>
              ${e.label}
            </label>`;case"select":return`
            <div class="field field-inline">
              <label class="field-label" for="${e.id}">${e.label}</label>
              <select id="${e.id}" class="input input-sm">
                ${(e.options||[]).map(s=>`<option value="${s.value}">${s.label}</option>`).join("")}
              </select>
            </div>`;case"text":return`
            <div class="field field-inline">
              <label class="field-label" for="${e.id}">${e.label}</label>
              <input id="${e.id}" class="input input-sm ${e.cls||""}" type="text"
                ${e.maxlength!=null?`maxlength="${e.maxlength}"`:""}
                spellcheck="false" value="${e.value??""}">
            </div>`;default:return""}}).join("");const d=(t.actions||[]).map(e=>`<button type="button" class="btn btn-${e.cls||"primary"}" id="${e.id}">${e.label}</button>`).join("");const p=(t.extraActions||[]).map(e=>`<button type="button" class="btn btn-${e.cls||"secondary"}" id="${e.id}">${e.label}</button>`).join("");l.innerHTML=`
    <div class="tool-head${t.headExtra?" mk-head":""}">
      <h1 class="tool-title">${m}</h1>
      ${t.headExtra||""}
    </div>

    <div class="tool-stack">
      <section class="card tool-pane">
        <h2 class="card-title">输入</h2>
        <textarea id="${a}-input" class="input mono" spellcheck="false"
          placeholder="${t.input.placeholder}"></textarea>
        ${t.inputExtra||""}
      </section>

      ${u||d||p?`
      <div class="tool-controls">
        <div class="controls-actions">
          ${d}
          ${p}
        </div>
        ${u?`<div class="controls-fields">${u}</div>`:""}
      </div>`:""}

      <section class="card tool-pane">
        <h2 class="card-title">输出</h2>
        <textarea id="${a}-output" class="input mono" readonly spellcheck="false"
          placeholder="${t.output.placeholder}"></textarea>
        ${t.outputExtra||""}
      </section>
    </div>

    ${t.customSlot||""}

    <div class="tool-error" id="${a}-error" role="alert"></div>
  `;const n=l.querySelector(`#${a}-input`);const i=l.querySelector(`#${a}-output`);const r=l.querySelector(`#${a}-error`);if(!n||!i||!r)return;function o(e){if(e){r.textContent=e;r.classList.add("show");i.setAttribute("aria-invalid","true")}else{r.classList.remove("show");i.removeAttribute("aria-invalid")}}function c(){if(n.value.trim()===""){i.value="";o(null);return true}return false}function $(e,{label:s}){const v=Number(e.value);if(e.value.trim()===""||!Number.isFinite(v)){throw new Error(`${s}必须是数字`)}return v}(t.actions||[]).forEach(e=>{const s=l.querySelector(`#${e.id}`);if(s)s.addEventListener("click",()=>e.run({input:n,output:i,showError:o,clearOutputIfEmpty:c,readNumber:$}))});(t.extraActions||[]).forEach(e=>{const s=l.querySelector(`#${e.id}`);if(s)s.addEventListener("click",()=>e.run({input:n,output:i,showError:o,clearOutputIfEmpty:c}))});n.addEventListener("input",()=>o(null));return{input:n,output:i,showError:o,clearOutputIfEmpty:c,readNumber:$}}async function h(l){const t=l.output.value;if(!t)return;const{copyText:a}=await import("../ui.js");await a(t)}function x(l){const t=l.output.value;if(!t)return;l.input.value=t;l.output.value="";l.showError(null)}export{b as buildToolPage,h as copyOutput,x as swapIO};
