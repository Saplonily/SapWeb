window.addEventListener('DOMContentLoaded', function () {
    var btnBack = document.getElementById('back-home');
    if (btnBack) {
        if (window.history.length > 1) {
            btnBack.textContent = '后退页面';
        } else {
            btnBack.textContent = '返回首页';
        }
        btnBack.classList.add('show');
        btnBack.onclick = function () {
            if (window.history.length > 1) {
                window.history.back();
            } else {
                window.location.href = '/';
            }
        };
    }

    var btnHome = document.getElementById('go-home');
    if (btnHome) {
        btnHome.classList.add('show');
        btnHome.addEventListener('click', function () {
            window.location.href = '/';
        });
    }

    var hiddenLink = document.getElementById('hidden-c2fwY2M-link');
    var page = document.getElementById('div404');
    if (!hiddenLink || !page) return;

    hiddenLink.addEventListener('click', function (event) {
        if (page.classList.contains('grid-collapsed')) return;

        event.preventDefault();
        page.classList.add('grid-collapsed');
    });
});
