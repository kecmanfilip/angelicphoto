/* ═══════════════════════════════════════════════════════
   ANGELIC PHOTO - MAIN.JS
   Navigacija, dropdown, hamburger, scroll efekti
   ═══════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ─── DOM Elementi ───
    const header = document.getElementById('header');
    const nav = document.getElementById('nav');
    const hamburger = document.getElementById('hamburger');
    const dropdownItems = document.querySelectorAll('.nav__item--dropdown');
    const body = document.body;

    // Kreiramo overlay element za mobile meni
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    body.appendChild(overlay);


    // ═══════════════════════════════════════════
    // HAMBURGER MENI (MOBILE)
    // ═══════════════════════════════════════════
    function toggleMobileMenu() {
        const isOpen = nav.classList.toggle('nav--open');
        hamburger.classList.toggle('hamburger--active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
        overlay.classList.toggle('nav-overlay--visible', isOpen);
        body.style.overflow = isOpen ? 'hidden' : '';

        // Zatvori dropdownove kad se zatvori meni
        if (!isOpen) {
            closeAllDropdowns();
        }
    }

    function closeMobileMenu() {
        nav.classList.remove('nav--open');
        hamburger.classList.remove('hamburger--active');
        hamburger.setAttribute('aria-expanded', 'false');
        overlay.classList.remove('nav-overlay--visible');
        body.style.overflow = '';
        closeAllDropdowns();
    }

    hamburger.addEventListener('click', toggleMobileMenu);
    overlay.addEventListener('click', closeMobileMenu);


    // ═══════════════════════════════════════════
    // DROPDOWN MENI
    // ═══════════════════════════════════════════
    function closeAllDropdowns() {
        dropdownItems.forEach(function (item) {
            item.setAttribute('data-open', 'false');
            var toggle = item.querySelector('.nav__link--dropdown-toggle');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
    }

    dropdownItems.forEach(function (item) {
        var toggle = item.querySelector('.nav__link--dropdown-toggle');

        // Click toggle za dropdown
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var isOpen = item.getAttribute('data-open') === 'true';

            // Zatvori ostale dropdownove
            dropdownItems.forEach(function (other) {
                if (other !== item) {
                    other.setAttribute('data-open', 'false');
                    var otherToggle = other.querySelector('.nav__link--dropdown-toggle');
                    if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle trenutni
            item.setAttribute('data-open', !isOpen);
            toggle.setAttribute('aria-expanded', !isOpen);
        });

        // Desktop: hover otvara dropdown sa delay-em
        var closeTimeout = null;

        item.addEventListener('mouseenter', function () {
            if (window.innerWidth > 968) {
                clearTimeout(closeTimeout);
                item.setAttribute('data-open', 'true');
                toggle.setAttribute('aria-expanded', 'true');
            }
        });

        item.addEventListener('mouseleave', function () {
            if (window.innerWidth > 968) {
                closeTimeout = setTimeout(function () {
                    item.setAttribute('data-open', 'false');
                    toggle.setAttribute('aria-expanded', 'false');
                }, 250);
            }
        });
    });

    // Zatvori dropdown na klik van njega (desktop)
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.nav__item--dropdown')) {
            closeAllDropdowns();
        }
    });

    // ESC zatvara sve
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeAllDropdowns();
            closeMobileMenu();
        }
    });


    // ═══════════════════════════════════════════
    // HEADER SCROLL EFEKAT
    // ═══════════════════════════════════════════
    var lastScroll = 0;
    var scrollThreshold = 50;

    function onScroll() {
        var currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > scrollThreshold) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }

        lastScroll = currentScroll;
    }

    // Throttle scroll event
    var ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                onScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });


    // ═══════════════════════════════════════════
    // SMOOTH SCROLL ZA ANCHOR LINKOVE
    // ═══════════════════════════════════════════
    // Posle smooth scrolla pozicija se koriguje jos ~3s jer lazy slike i
    // fontovi koji se ucitavaju usput pomeraju cilj. Korekcija se prekida
    // cim korisnik sam skroluje ili dodirne ekran.
    var scrollCorrection = null;

    function cancelScrollCorrection() {
        if (scrollCorrection) {
            clearInterval(scrollCorrection);
            scrollCorrection = null;
        }
    }

    ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(function (ev) {
        window.addEventListener(ev, cancelScrollCorrection, { passive: true });
    });

    function scrollToAnchor(target) {
        var targetPos = target.getBoundingClientRect().top + window.pageYOffset - header.offsetHeight;

        window.scrollTo({
            top: targetPos,
            behavior: 'smooth'
        });

        cancelScrollCorrection();
        var deadline = Date.now() + 3000;
        var lastY = -1;

        scrollCorrection = setInterval(function () {
            var y = window.pageYOffset;
            var settled = Math.abs(y - lastY) < 2;
            lastY = y;
            if (!settled) return;

            var desired = target.getBoundingClientRect().top + y - header.offsetHeight;
            var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            desired = Math.max(0, Math.min(desired, maxScroll));

            if (Math.abs(desired - y) > 4) {
                window.scrollTo({ top: desired, behavior: 'instant' });
            } else if (Date.now() > deadline) {
                cancelScrollCorrection();
            }
        }, 250);
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                closeMobileMenu();
                scrollToAnchor(target);
            }
        });
    });


    // ═══════════════════════════════════════════
    // INICIJALNI SCROLL CHECK
    // ═══════════════════════════════════════════
    onScroll();


    // ═══════════════════════════════════════════
    // BLOG KATEGORIJE FILTER
    // ═══════════════════════════════════════════
    var categoryBtns = document.querySelectorAll('.blog-categories__btn');
    if (categoryBtns.length > 0) {
        var blogCards = document.querySelectorAll('.blog-listing__grid .blog-card');
        var featuredCard = document.querySelector('.blog-featured-card');

        categoryBtns.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var category = this.getAttribute('data-category');

                // Ažuriraj aktivno dugme
                categoryBtns.forEach(function (b) {
                    b.classList.remove('blog-categories__btn--active');
                });
                this.classList.add('blog-categories__btn--active');

                // Filtriraj kartice
                blogCards.forEach(function (card) {
                    var cardCat = card.getAttribute('data-category');
                    if (category === 'all' || cardCat === category) {
                        card.removeAttribute('data-hidden');
                        card.style.display = '';
                    } else {
                        card.setAttribute('data-hidden', 'true');
                        card.style.display = 'none';
                    }
                });

                // Filtriraj featured post
                if (featuredCard) {
                    if (category === 'all' || featuredCard.getAttribute('data-category') === category) {
                        featuredCard.removeAttribute('data-hidden');
                        featuredCard.style.display = '';
                    } else {
                        featuredCard.setAttribute('data-hidden', 'true');
                        featuredCard.style.display = 'none';
                    }
                }
            });
        });
    }


    // ═══════════════════════════════════════════
    // LIGHTBOX GALERIJA
    // ═══════════════════════════════════════════
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');

    if (lightbox && lightboxImg) {
        var galleryItems = document.querySelectorAll('.gallery-grid__item, .gallery-masonry__item');
        var currentIndex = 0;
        var galleryImages = [];

        // Sakupi trenutno vidljive slike (na galerija stranici sakriveni
        // paneli ne ulaze u navigaciju strelicama)
        function collectVisibleImages() {
            galleryImages = [];
            galleryItems.forEach(function (item) {
                var img = item.querySelector('.gallery-grid__img, .gallery-masonry__img');
                if (img && item.offsetParent !== null) {
                    galleryImages.push({
                        src: img.src,
                        alt: img.alt
                    });
                }
            });
        }

        galleryItems.forEach(function (item) {
            var img = item.querySelector('.gallery-grid__img, .gallery-masonry__img');
            if (img) {
                item.addEventListener('click', function () {
                    collectVisibleImages();
                    currentIndex = 0;
                    for (var i = 0; i < galleryImages.length; i++) {
                        if (galleryImages[i].src === img.src) {
                            currentIndex = i;
                            break;
                        }
                    }
                    openLightbox(currentIndex);
                });
            }
        });

        function openLightbox(index) {
            lightboxImg.src = galleryImages[index].src;
            lightboxImg.alt = galleryImages[index].alt;
            lightbox.removeAttribute('hidden');
            // Force reflow then add class for animation
            void lightbox.offsetWidth;
            lightbox.classList.add('lightbox--active');
            body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('lightbox--active');
            body.style.overflow = '';
            setTimeout(function () {
                lightbox.setAttribute('hidden', '');
                lightboxImg.src = '';
            }, 300);
        }

        function showPrev() {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            lightboxImg.src = galleryImages[currentIndex].src;
            lightboxImg.alt = galleryImages[currentIndex].alt;
        }

        function showNext() {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            lightboxImg.src = galleryImages[currentIndex].src;
            lightboxImg.alt = galleryImages[currentIndex].alt;
        }

        var closeBtn = lightbox.querySelector('.lightbox__close');
        var prevBtn = lightbox.querySelector('.lightbox__prev');
        var nextBtn = lightbox.querySelector('.lightbox__next');

        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (prevBtn) prevBtn.addEventListener('click', showPrev);
        if (nextBtn) nextBtn.addEventListener('click', showNext);

        // Klik na pozadinu zatvara lightbox
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox__content')) {
                closeLightbox();
            }
        });

        // Tastatura: ESC zatvara, strelice menjaju slike
        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('lightbox--active')) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });
    }


    // ═══════════════════════════════════════════
    // GALERIJA STRANICA - FILTER PO USLUGAMA
    // ═══════════════════════════════════════════
    var galerijaBtns = document.querySelectorAll('[data-galerija-btn]');
    if (galerijaBtns.length > 0) {
        var galerijaPanels = document.querySelectorAll('[data-galerija-panel]');

        function activateGalerija(slug, updateHash) {
            var found = false;
            galerijaPanels.forEach(function (panel) {
                var match = panel.getAttribute('data-galerija-panel') === slug;
                if (match) found = true;
                panel.hidden = !match;
            });
            if (!found) return;

            galerijaBtns.forEach(function (btn) {
                btn.classList.toggle(
                    'blog-categories__btn--active',
                    btn.getAttribute('data-galerija-btn') === slug
                );
            });

            if (updateHash && window.history && window.history.replaceState) {
                window.history.replaceState(null, '', '#' + slug);
            }
        }

        galerijaBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                activateGalerija(this.getAttribute('data-galerija-btn'), true);
            });
        });

        // #hash u URL-u bira kategoriju (npr. galerija.html#bebe)
        var initialSlug = window.location.hash.replace('#', '');
        if (initialSlug) {
            activateGalerija(initialSlug, false);
        }

        window.addEventListener('hashchange', function () {
            activateGalerija(window.location.hash.replace('#', ''), false);
        });
    }

})();
