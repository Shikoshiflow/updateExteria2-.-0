
// Мобильное меню и общий скрипт сайта
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.getElementById('nav-links');

    mobileMenu.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    // Плавная прокрутка
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Закрыть мобильное меню
                navLinks.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    });

    // Анимация появления элементов при прокрутке с помощью IntersectionObserver для лучшей производительности
    const fadeElements = document.querySelectorAll('.fade-in');
    const observerOptions = {
        root: null, // относительно viewport
        rootMargin: '0px 0px -100px 0px', // смещение, аналог "windowHeight - 100" из старой логики
        threshold: 0 // триггер сработает как только элемент появится в зоне
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Если элемент пересекает область видимости
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Отключаем наблюдение за элементом после того, как он стал видимым, для экономии ресурсов
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Начинаем наблюдение за каждым элементом
    fadeElements.forEach(element => observer.observe(element));

    // Проверка наличия якоря в URL
    const hash = window.location.hash;
    if (hash) {
        const target = document.querySelector(hash);
        if (target) {
            setTimeout(() => {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }, 500);
        }
    }

    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        // Изменение навигационной панели при прокрутке
        if (scrollPosition > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

});