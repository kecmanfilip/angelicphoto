/* ═══════════════════════════════════════════════════════
   ANGELIC PHOTO — WHATSAPP WIDGET
   Floating WhatsApp button + auto bubble sa quick-reply opcijama.
   Klik okida Google Ads conversion (isti send_to kao pre Tawk).
   ═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    var PHONE = '381666702000';
    var BUBBLE_TEXT = 'Zdravo! 👋 Ako imate pitanja o fotografisanju ili želite da zakažete termin, slobodno mi se javite. Tu sam!';
    var BUBBLE_DELAY_MS = 4000;
    var STORAGE_KEY = 'wa_bubble_dismissed_v1';
    var CONVERSION_SEND_TO = 'AW-18001917494/lpjaCJz_9I8cELbs_YdD';

    var QUICK_REPLIES = [
        { label: 'Imam pitanje o cenama', message: 'Zdravo Anđela! Imam pitanje o cenama.' },
        { label: 'Želim da zakažem termin', message: 'Zdravo Anđela! Želim da zakažem termin.' }
    ];
    var DEFAULT_MESSAGE = 'Zdravo Anđela! Imam pitanje o fotografisanju.';

    function waUrl(text) {
        return 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(text);
    }

    // ─── STILOVI ───
    var css = ''
        + '.wa-widget{position:fixed;right:24px;bottom:24px;z-index:9998;font-family:Inter,system-ui,-apple-system,sans-serif}'
        + '.wa-widget__btn{position:relative;display:flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:50%;background:#25D366;color:#fff;box-shadow:0 8px 24px rgba(37,211,102,.4),0 2px 8px rgba(0,0,0,.18);text-decoration:none;transition:transform .2s ease,box-shadow .2s ease;cursor:pointer}'
        + '.wa-widget__btn:hover{transform:scale(1.06);box-shadow:0 12px 32px rgba(37,211,102,.5),0 4px 12px rgba(0,0,0,.2)}'
        + '.wa-widget__btn:focus-visible{outline:3px solid #fff;outline-offset:3px}'
        + '.wa-widget__btn::before{content:"";position:absolute;inset:0;border-radius:50%;background:#25D366;animation:wa-pulse 2.4s ease-out infinite;z-index:-1;opacity:.6}'
        + '@keyframes wa-pulse{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.55);opacity:0}}'
        + '.wa-widget__icon{width:36px;height:36px;display:block}'
        + '.wa-widget__bubble{position:absolute;right:0;bottom:82px;width:300px;background:#fff;border-radius:14px;box-shadow:0 14px 36px rgba(0,0,0,.16),0 4px 10px rgba(0,0,0,.08);padding:16px 16px 14px;opacity:0;transform:translateY(10px) scale(.96);transform-origin:bottom right;pointer-events:none;transition:opacity .25s ease,transform .25s ease}'
        + '.wa-widget__bubble--visible{opacity:1;transform:translateY(0) scale(1);pointer-events:auto}'
        + '.wa-widget__bubble::after{content:"";position:absolute;right:24px;bottom:-7px;width:14px;height:14px;background:#fff;transform:rotate(45deg);box-shadow:3px 3px 6px rgba(0,0,0,.05)}'
        + '.wa-widget__bubble-header{display:flex;align-items:center;gap:10px;margin-bottom:10px}'
        + '.wa-widget__bubble-avatar{width:36px;height:36px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;flex:0 0 auto}'
        + '.wa-widget__bubble-avatar svg{width:20px;height:20px;color:#fff}'
        + '.wa-widget__bubble-meta{line-height:1.2}'
        + '.wa-widget__bubble-name{font-size:14px;font-weight:600;color:#2c2c2c;margin:0}'
        + '.wa-widget__bubble-status{font-size:11px;color:#8a8a8a;margin:2px 0 0}'
        + '.wa-widget__bubble-status::before{content:"";display:inline-block;width:6px;height:6px;border-radius:50%;background:#25D366;margin-right:5px;vertical-align:middle}'
        + '.wa-widget__bubble-close{position:absolute;top:8px;right:10px;width:26px;height:26px;border:none;background:transparent;font-size:20px;line-height:1;color:#999;cursor:pointer;padding:0;border-radius:50%;transition:color .15s,background .15s}'
        + '.wa-widget__bubble-close:hover{color:#333;background:#f2f2f2}'
        + '.wa-widget__bubble-text{margin:0 0 12px;font-size:13.5px;line-height:1.5;color:#3a3a3a;background:#f4f4f2;padding:10px 12px;border-radius:10px 10px 10px 2px}'
        + '.wa-widget__quick{display:flex;flex-direction:column;gap:8px}'
        + '.wa-widget__quick-btn{display:flex;align-items:center;justify-content:space-between;gap:8px;background:#fff;border:1.5px solid #e5e5e5;color:#2c2c2c;text-decoration:none;padding:10px 14px;border-radius:10px;font-size:13px;font-weight:500;transition:border-color .15s,background .15s,transform .1s;text-align:left;cursor:pointer;font-family:inherit}'
        + '.wa-widget__quick-btn:hover{border-color:#25D366;background:#f0fbf4;color:#2c2c2c}'
        + '.wa-widget__quick-btn:active{transform:scale(.98)}'
        + '.wa-widget__quick-btn::after{content:"→";color:#25D366;font-weight:600;flex:0 0 auto}'
        + '@media (max-width:520px){'
        +   '.wa-widget{right:16px;bottom:16px}'
        +   '.wa-widget__btn{width:58px;height:58px}'
        +   '.wa-widget__icon{width:40px;height:40px}'
        +   '.wa-widget__bubble{width:calc(100vw - 40px);max-width:320px;right:-4px;bottom:74px}'
        + '}';

    function injectStyles() {
        var style = document.createElement('style');
        style.setAttribute('data-wa-widget', '');
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    var SVG_NS = 'http://www.w3.org/2000/svg';
    function buildWaSvg(sizeClass) {
        var svg = document.createElementNS(SVG_NS, 'svg');
        svg.setAttribute('class', sizeClass);
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'currentColor');
        svg.setAttribute('aria-hidden', 'true');
        var path = document.createElementNS(SVG_NS, 'path');
        path.setAttribute('d', 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z');
        svg.appendChild(path);
        return svg;
    }

    function trackConversion() {
        if (typeof window.gtag === 'function') {
            window.gtag('event', 'conversion', { 'send_to': CONVERSION_SEND_TO });
        }
    }

    function init() {
        injectStyles();

        var wrap = document.createElement('div');
        wrap.className = 'wa-widget';

        // ─── BUBBLE ───
        var bubble = document.createElement('div');
        bubble.className = 'wa-widget__bubble';
        bubble.setAttribute('role', 'dialog');
        bubble.setAttribute('aria-label', 'Poruka od Anđele Ranđelović');

        var closeBtn = document.createElement('button');
        closeBtn.className = 'wa-widget__bubble-close';
        closeBtn.type = 'button';
        closeBtn.setAttribute('aria-label', 'Zatvori poruku');
        closeBtn.textContent = '×';
        bubble.appendChild(closeBtn);

        var header = document.createElement('div');
        header.className = 'wa-widget__bubble-header';
        var avatar = document.createElement('div');
        avatar.className = 'wa-widget__bubble-avatar';
        avatar.appendChild(buildWaSvg(''));
        var meta = document.createElement('div');
        meta.className = 'wa-widget__bubble-meta';
        var name = document.createElement('p');
        name.className = 'wa-widget__bubble-name';
        name.textContent = 'Anđela Ranđelović';
        var status = document.createElement('p');
        status.className = 'wa-widget__bubble-status';
        status.textContent = 'Obično odgovaram u roku od par minuta';
        meta.appendChild(name);
        meta.appendChild(status);
        header.appendChild(avatar);
        header.appendChild(meta);
        bubble.appendChild(header);

        var text = document.createElement('p');
        text.className = 'wa-widget__bubble-text';
        text.textContent = BUBBLE_TEXT;
        bubble.appendChild(text);

        var quick = document.createElement('div');
        quick.className = 'wa-widget__quick';
        var quickLinks = [];
        QUICK_REPLIES.forEach(function (item) {
            var a = document.createElement('a');
            a.className = 'wa-widget__quick-btn';
            a.href = waUrl(item.message);
            a.target = '_blank';
            a.rel = 'noopener';
            a.textContent = item.label;
            quick.appendChild(a);
            quickLinks.push(a);
        });
        bubble.appendChild(quick);

        // ─── DUGME ───
        var btn = document.createElement('a');
        btn.className = 'wa-widget__btn';
        btn.href = waUrl(DEFAULT_MESSAGE);
        btn.target = '_blank';
        btn.rel = 'noopener';
        btn.setAttribute('aria-label', 'Kontaktiraj preko WhatsApp-a');
        btn.appendChild(buildWaSvg('wa-widget__icon'));

        wrap.appendChild(bubble);
        wrap.appendChild(btn);
        document.body.appendChild(wrap);

        var dismissed = false;
        try { dismissed = sessionStorage.getItem(STORAGE_KEY) === '1'; } catch (e) { /* storage disabled */ }

        if (!dismissed) {
            setTimeout(function () {
                bubble.classList.add('wa-widget__bubble--visible');
            }, BUBBLE_DELAY_MS);
        }

        closeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            bubble.classList.remove('wa-widget__bubble--visible');
            try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (err) { /* noop */ }
        });

        // Klik na dugme: ako je bubble sakriven → otvori ga. Ako je vidljiv → vodi na WhatsApp + konverzija.
        btn.addEventListener('click', function (e) {
            if (!bubble.classList.contains('wa-widget__bubble--visible')) {
                e.preventDefault();
                bubble.classList.add('wa-widget__bubble--visible');
                try { sessionStorage.removeItem(STORAGE_KEY); } catch (err) { /* noop */ }
                return;
            }
            trackConversion();
        });

        quickLinks.forEach(function (link) {
            link.addEventListener('click', trackConversion);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
