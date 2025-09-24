// 返回首页/后退按钮逻辑
window.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('back-home');
    if (!btn) return;
    // 判断能否后退并设置按钮文本
    if (window.history.length > 1) {
        btn.textContent = '后退页面';
    } else {
        btn.textContent = '返回首页';
    }
    btn.classList.add('show');
    btn.onclick = function() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/';
        }
    };
});
