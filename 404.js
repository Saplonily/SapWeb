window.addEventListener('DOMContentLoaded', function () {
    function createGridShards(page) {
        var shards = document.createElement('div');
        shards.className = 'grid-shards';
        shards.setAttribute('aria-hidden', 'true');

        for (var index = 0; index < 13; index += 1) {
            var shard = document.createElement('span');
            var rotation = (Math.random() * 10 - 5).toFixed(2);
            var offsetX = (Math.random() * 66 - 33).toFixed(1);
            var offsetY = (Math.random() * 66 - 33).toFixed(1);
            var cellSize = (Math.random() * 14 + 33).toFixed(1);

            shard.style.setProperty('--shard-x', (Math.random() * 100 - 15).toFixed(1) + '%');
            shard.style.setProperty('--shard-y', (Math.random() * 100 - 15).toFixed(1) + '%');
            shard.style.setProperty('--shard-width', (Math.random() * 420 + 220).toFixed(0) + 'px');
            shard.style.setProperty('--shard-height', (Math.random() * 290 + 150).toFixed(0) + 'px');
            shard.style.setProperty('--shard-offset-x', offsetX + 'px');
            shard.style.setProperty('--shard-offset-y', offsetY + 'px');
            shard.style.setProperty('--shard-cell', cellSize + 'px');
            shard.style.setProperty('--shard-rotation', rotation + 'deg');
            shard.style.setProperty('--shard-opacity', (Math.random() * 0.18 + 0.82).toFixed(2));
            shard.style.setProperty('--shard-delay', (Math.random() * 0.16).toFixed(2) + 's');
            shards.appendChild(shard);
        }

        page.appendChild(shards);
    }

    var btnBack = document.getElementById('back-home');
    if (btnBack) {
        if (window.history.length <= 1) {
            btnBack.remove();
        } else {
            btnBack.classList.add('show');
            btnBack.onclick = function () {
                window.history.back();
            };
        }
    }

    var btnHome = document.getElementById('go-home');
    if (btnHome) {
        btnHome.classList.add('show');
        btnHome.addEventListener('click', function () {
            window.location.href = '/';
        });
    }

    var legacyTutorialLink = document.getElementById('legacy-tutorial-link');
    var currentUrl = window.location.href;
    if (legacyTutorialLink && (
        currentUrl.includes('celeste_mod_tutorial') ||
        currentUrl.includes('celeste_modding_tutorial/code_modding')
    )) {
        legacyTutorialLink.hidden = false;
    }

    var hiddenLink = document.getElementById('hidden-c2fwY2M-link');
    var page = document.getElementById('div404');
    if (!page) return;

    [hiddenLink, legacyTutorialLink].forEach(function (link) {
        if (!link) return;

        link.addEventListener('click', function (event) {
            if (page.classList.contains('grid-collapsed')) return;

            event.preventDefault();
            createGridShards(page);
            page.classList.add('grid-collapsed');
            link.classList.add('grid-collapsed');
        });
    });
});
