import{buildBatchPage as v}from"./batch.js";import{shiftPrintable as y,caesar as S,shiftCodePoints as E}from"../shift-core.js";const h=2e3;const g=/^[\x20-\x7e]*$/;const k=/^[A-Za-z0-9]*$/;function w(){return`
    <div class="field field-inline">
      <label class="field-label" for="bs-start">起始偏移</label>
      <input id="bs-start" class="input input-sm" type="number" step="1" value="-32">
    </div>
    <div class="field field-inline">
      <label class="field-label" for="bs-end">结束偏移</label>
      <input id="bs-end" class="input input-sm" type="number" step="1" value="32">
    </div>`}function m(e,t,s){const i=e.querySelector(`#${t}`);const a=i.value.trim();const r=Number(a);if(a===""||!Number.isFinite(r)||!Number.isInteger(r)){throw new Error(`${s}必须是整数`)}return r}function q(e){const t=m(e,"bs-start","起始偏移");const s=m(e,"bs-end","结束偏移");if(t>s)throw new Error("起始偏移不能大于结束偏移");if(s-t+1>h)throw new Error(`偏移范围太大，最多 ${h} 个`);return{start:t,end:s}}function x(e,t,s){const{start:i,end:a}=q(t);const r=[];for(let l=i;l<=a;l++){if(l===0)continue;r.push({label:l>0?`+${l}`:String(l),text:s(e,l)})}return r}const c={ascii:{label:"可打印 ASCII（32–126，循环）",hint:"会依次尝试 0–94 共 95 个偏移",options:()=>`
      <label class="switch-row">
        <span class="switch">
          <input type="checkbox" id="bs-visible">
          <span class="track"><span class="thumb"></span></span>
        </span>
        仅全部为可见字符
      </label>
      <label class="switch-row">
        <span class="switch">
          <input type="checkbox" id="bs-alnum">
          <span class="track"><span class="thumb"></span></span>
        </span>
        仅全部为英文数字字符
      </label>`,list:e=>Array.from({length:95},(t,s)=>({label:`+${s}`,text:y(e,s)})),filter:(e,t)=>{const s=t.querySelector("#bs-visible")?.checked;const i=t.querySelector("#bs-alnum")?.checked;if(!s&&!i)return e;return e.filter(a=>{if(s&&!g.test(a.text))return false;if(i&&!k.test(a.text))return false;return true})}},caesar:{label:"英文字母（凯撒，仅 A–Z / a–z）",hint:"会依次尝试 1–25 共 25 个位移",options:()=>"",list:e=>Array.from({length:25},(t,s)=>({label:`密钥 ${s+1}`,text:S(e,s+1,true)}))},unicode:{label:"Unicode 码点（整体加减）",hint:"设置偏移范围后点击「列出全部结果」，0 会被跳过",options:w,list:(e,t)=>x(e,t,E)}};const L=[["可打印 ASCII","0–94 共 95 个偏移全部试一遍（等价于在 32–126 内循环）。可勾选筛掉含不可见字符或含符号的结果。"],["英文字母","1–25 共 25 个凯撒位移全部试一遍，只移动 A–Z / a–z，其他字符原样。"],["Unicode 码点","在给定范围内逐个尝试码点加减，emoji 等代理对不会被拆开，最多 2000 个。"]];function I(e){const t=v(e,{id:"bs",title:"批量移位",headExtra:`
      <button type="button" class="mk-help-btn" id="bs-help-btn"
        aria-label="查看各模式的含义" title="查看各模式的含义">?</button>`,placeholder:"在这里输入需要尝试移位的文本…",runLabel:"列出全部结果",hint:"",optionsHtml:`
      <div class="batch-options">
        <div class="field field-inline">
          <label class="field-label" for="bs-mode">移位对象</label>
          <select id="bs-mode" class="input input-sm">
            ${Object.entries(c).map(([n,o])=>`<option value="${n}">${o.label}</option>`).join("")}
          </select>
        </div>
        <div class="batch-options-extra" id="bs-options"></div>
      </div>`,run:({text:n,container:o})=>c[o.querySelector("#bs-mode").value].list(n,o),filter:(n,o)=>{const d=o.querySelector("#bs-mode").value;return c[d].filter?c[d].filter(n,o):n},customSlot:`
      <dialog class="mk-help" id="bs-help" aria-labelledby="bs-help-title">
        <div class="mk-help-head">
          <h2 class="mk-help-title" id="bs-help-title">各模式的含义</h2>
          <button type="button" class="mk-help-close" id="bs-help-close" aria-label="关闭">×</button>
        </div>
        <p class="mk-help-desc">
          与「移位」页的三种模式一一对应，区别只是把一个偏移换成一整批：
          每个偏移生成一张结果卡，按顺序排列，便于肉眼找出可读的那条。
        </p>
        <dl class="mk-help-list" id="bs-help-list"></dl>
      </dialog>`});if(!t)return;const s=e.querySelector("#bs-options");const i=e.querySelector("#bs-mode");function a(){const n=i.value;if(n==="unicode"){s.querySelector("#bs-start")?.addEventListener("change",t.run);s.querySelector("#bs-end")?.addEventListener("change",t.run)}else if(n==="ascii"){s.querySelector("#bs-visible")?.addEventListener("change",t.refresh);s.querySelector("#bs-alnum")?.addEventListener("change",t.refresh)}}function r(){s.innerHTML=c[i.value].options();a()}i.addEventListener("change",()=>{r();t.clearResults();t.setStatus(c[i.value].hint)});r();t.setStatus(c[i.value].hint);const l=e.querySelector("#bs-help");const f=e.querySelector("#bs-help-list");const u=document.createDocumentFragment();for(const[n,o]of L){const d=document.createElement("div");d.className="mk-help-row";const b=document.createElement("dt");b.textContent=n;const p=document.createElement("dd");p.textContent=o;d.append(b,p);u.append(d)}f.append(u);e.querySelector("#bs-help-btn").addEventListener("click",()=>{if(!l.open)l.showModal()});e.querySelector("#bs-help-close").addEventListener("click",()=>l.close());l.addEventListener("click",n=>{if(n.target===l)l.close()})}export{I as mount};
