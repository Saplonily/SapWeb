import*as c from"./theme.js";import*as s from"./router.js";import*as l from"./sidebar.js";import{getTool as a,resolveId as m}from"./tools/registry.js";const e=document.getElementById("app-main");function r(t){const o=t?m(t):t;document.querySelectorAll("[data-nav]").forEach(n=>{n.classList.toggle("active",n.dataset.nav===o)});l.closeDrawer();e.innerHTML="";e.scrollTop=0;if(!o||o==="home"){e.innerHTML=`
      <div class="tool-head">
        <h1 class="tool-title">工具箱</h1>
      </div>
    `;document.title="sapcctb · 个人工具箱";return}const i=a(o);if(!i){e.innerHTML=`
      <div class="tool-head">
        <h1 class="tool-title">页面不存在</h1>
      </div>
    `;document.title="页面不存在 · sapcctb";return}i.mount(e);document.title=`${i.title} · sapcctb`}c.init();l.init();s.init(t=>r(t));r(s.parseHash());
