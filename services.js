// services.js - обновленный для работы с новым горизонтальным меню и улучшенной анимацией

document.addEventListener('DOMContentLoaded', function() {
  
  // ==================== ИНИЦИАЛИЗАЦИЯ ПЕРЕМЕННЫХ ====================
  const desktopNavLinks = document.querySelectorAll('.services-sidebar-nav__link');
  const mobileNavLinks = document.querySelectorAll('.mobile-services-nav__link');
  const serviceSections = document.querySelectorAll('.service-section');
  const serviceCards = document.querySelectorAll('.service-chess-card, .service-text-card');
  const serviceImages = document.querySelectorAll('.service-chess-card__image img');
  const mobileServicesNav = document.querySelector('.mobile-services-nav');
  const desktopSidebar = document.querySelector('.services-sidebar');
  
  // ==================== ПЛАВНАЯ ПРОКРУТКА К РАЗДЕЛАМ ====================
  function setupSmoothScroll(links) {
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          let targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          // Для мобильных учитываем дополнительное меню
          if (window.innerWidth <= 992 && mobileServicesNav) {
            targetPosition -= mobileServicesNav.offsetHeight;
          }
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Обновляем URL без перезагрузки страницы
          history.pushState(null, null, targetId);
          
          // Обновляем активные ссылки
          updateActiveNavLinks(targetId);
        }
      });
    });
  }
  
  // Настраиваем плавную прокрутку для обоих типов меню
  setupSmoothScroll(desktopNavLinks);
  setupSmoothScroll(mobileNavLinks);
  
  // ==================== ПОДСВЕТКА АКТИВНОГО РАЗДЕЛА ====================
  function updateActiveNavLinks(targetId = null) {
    // Если передали конкретный targetId, активируем соответствующую ссылку
    if (targetId) {
      updateLinksByTargetId(targetId);
      return;
    }
    
    // Определяем активный раздел по скроллу
    const scrollPosition = window.scrollY + 150;
    let currentSectionId = '';
    
    serviceSections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollPosition >= sectionTop && 
          scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = '#' + section.id;
      }
    });
    
    // Если не нашли секцию, проверяем последнюю
    if (!currentSectionId && serviceSections.length > 0) {
      const lastSection = serviceSections[serviceSections.length - 1];
      if (scrollPosition >= lastSection.offsetTop) {
        currentSectionId = '#' + lastSection.id;
      }
    }
    
    updateLinksByTargetId(currentSectionId);
  }
  
  function updateLinksByTargetId(targetId) {
    // Обновляем активные ссылки в десктопном меню
    desktopNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === targetId) {
        link.classList.add('active');
        scrollSidebarToActiveLink(link);
      }
    });
    
    // Обновляем активные ссылки в мобильном меню
    mobileNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === targetId) {
        link.classList.add('active');
        scrollMobileNavToActiveLink(link);
      }
    });
  }
  
  // ==================== ПРОКРУТКА САЙДБАРА К АКТИВНОЙ ССЫЛКЕ ====================
  function scrollSidebarToActiveLink(activeLink) {
    if (!desktopSidebar) return;
    
    const sidebarScrollContainer = desktopSidebar.querySelector('.services-sidebar-nav__scroll');
    if (!sidebarScrollContainer) return;
    
    const linkTop = activeLink.offsetTop;
    const containerHeight = sidebarScrollContainer.clientHeight;
    const containerScrollTop = sidebarScrollContainer.scrollTop;
    
    // Если активная ссылка не видна в контейнере, прокручиваем к ней
    if (linkTop < containerScrollTop || 
        linkTop > containerScrollTop + containerHeight - 50) {
      sidebarScrollContainer.scrollTo({
        top: linkTop - 20,
        behavior: 'smooth'
      });
    }
  }
  
  // ==================== ПРОКРУТКА МОБИЛЬНОГО МЕНЮ К АКТИВНОЙ ССЫЛКЕ ====================
  function scrollMobileNavToActiveLink(activeLink) {
    if (!mobileServicesNav) return;
    
    const navScroller = mobileServicesNav.querySelector('.mobile-services-nav__scroller');
    if (!navScroller) return;
    
    const linkLeft = activeLink.offsetLeft;
    const containerWidth = mobileServicesNav.clientWidth;
    const containerScrollLeft = mobileServicesNav.scrollLeft;
    
    // Если активная ссылка не видна в контейнере, прокручиваем к ней
    if (linkLeft < containerScrollLeft || 
        linkLeft > containerScrollLeft + containerWidth - 100) {
      mobileServicesNav.scrollTo({
        left: linkLeft - 50,
        behavior: 'smooth'
      });
    }
  }
  
  // ==================== ОБРАБОТКА СКРОЛЛА С ОПТИМИЗАЦИЕЙ ====================
  let scrollTimeout;
  let lastScrollPosition = 0;
  
  window.addEventListener('scroll', function() {
    // Используем throttle для оптимизации
    clearTimeout(scrollTimeout);
    
    // Проверяем, изменилась ли позиция скролла значительно
    const currentScroll = window.scrollY;
    const scrollDiff = Math.abs(currentScroll - lastScrollPosition);
    
    if (scrollDiff > 50) { // Обновляем только при значительном скролле
      scrollTimeout = setTimeout(() => {
        updateActiveNavLinks();
        lastScrollPosition = currentScroll;
      }, 100);
    }
  }, { passive: true });
  
  // ==================== ОБРАБОТКА ЯКОРЕЙ В URL ПРИ ЗАГРУЗКЕ ====================
  function handleInitialHash() {
    if (window.location.hash) {
      const targetId = window.location.hash;
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        setTimeout(() => {
          const headerHeight = document.querySelector('.header').offsetHeight;
          let targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          if (window.innerWidth <= 992 && mobileServicesNav) {
            targetPosition -= mobileServicesNav.offsetHeight;
          }
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          updateActiveNavLinks(targetId);
        }, 800); // Увеличили задержку для полной загрузки изображений
      }
    }
  }
  
  handleInitialHash();
  
  // ==================== ЛЕНИВАЯ ЗАГРУЗКА ИЗОБРАЖЕНИЙ ====================
  function lazyLoadImages() {
    // Если IntersectionObserver не поддерживается, загружаем все изображения сразу
    if (!('IntersectionObserver' in window)) {
      loadAllImages();
      return;
    }
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            
            img.onload = function() {
              this.style.opacity = '1';
              this.style.transition = 'opacity 0.7s ease';
            };
          }
          
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px 0px',
      threshold: 0.1
    });
    
    serviceImages.forEach(img => {
      // Пропускаем уже загруженные изображения
      if (img.complete || img.src.includes('data:image')) {
        return;
      }
      
      // Сохраняем оригинальный src в data-src для ленивой загрузки
      if (!img.hasAttribute('data-src')) {
        const originalSrc = img.src;
        img.setAttribute('data-src', originalSrc);
        
        // Создаем placeholder с цветом фона
        const placeholderColor = getComputedStyle(document.documentElement)
          .getPropertyValue('--dark-light').trim() || '#1a1a2e';
        
        img.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='${encodeURIComponent(placeholderColor)}'/%3E%3C/svg%3E`;
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.7s ease';
      }
      
      imageObserver.observe(img);
    });
  }
  
  // Функция для загрузки всех изображений (фолбэк)
  function loadAllImages() {
    serviceImages.forEach(img => {
      if (img.hasAttribute('data-src')) {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
      }
    });
  }
  
  // Запускаем ленивую загрузку
  lazyLoadImages();
  
  // ==================== АНИМАЦИИ КАРТОЧЕК ПРИ ПРОКРУТКЕ ====================
  function setupCardAnimations() {
    // Если IntersectionObserver не поддерживается, показываем все карточки сразу
    if (!('IntersectionObserver' in window)) {
      serviceCards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
      return;
    }
    
    const cardObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '50px 0px',
      threshold: 0.1
    });
    
    serviceCards.forEach((card, index) => {
      // Устанавливаем задержку анимации для каждой карточки
      card.style.animationDelay = `${(index % 8) * 0.1 + 0.1}s`;
      cardObserver.observe(card);
    });
  }
  
  setupCardAnimations();
  
  // ==================== УМЕНЬШЕННЫЙ ПАРАЛЛАКС ДЛЯ ИЗОБРАЖЕНИЙ ====================
  function setupImageParallax() {
    // Отключаем параллакс на мобильных устройствах
    if (window.innerWidth <= 768) return;
    
    serviceCards.forEach(card => {
      const imageContainer = card.querySelector('.service-chess-card__image');
      if (!imageContainer) return;
      
      const img = imageContainer.querySelector('img');
      if (!img) return;
      
      imageContainer.addEventListener('mousemove', function(e) {
        const { left, top, width, height } = this.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        
        // Уменьшенный параллакс-эффект (в 2 раза меньше)
        const moveX = (x - 0.5) * 10; // было 20
        const moveY = (y - 0.5) * 10; // было 20
        
        img.style.transform = `scale(1.08) translate(${moveX}px, ${moveY}px)`;
      });
      
      imageContainer.addEventListener('mouseleave', function() {
        const img = this.querySelector('img');
        if (img) {
          img.style.transform = 'scale(1.08) translate(0, 0)';
        }
      });
    });
  }
  
  setupImageParallax();
  
  // ==================== АДАПТИВНЫЙ РЕСАЙЗ ====================
  let resizeTimeout;
  let lastWindowWidth = window.innerWidth;
  
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    
    resizeTimeout = setTimeout(() => {
      const currentWidth = window.innerWidth;
      
      // Если изменился тип устройства (десктоп/мобильное), перенастраиваем параллакс
      if ((lastWindowWidth > 768 && currentWidth <= 768) || 
          (lastWindowWidth <= 768 && currentWidth > 768)) {
        // Переинициализируем параллакс при изменении типа устройства
        serviceCards.forEach(card => {
          const imageContainer = card.querySelector('.service-chess-card__image');
          if (imageContainer) {
            const img = imageContainer.querySelector('img');
            if (img) {
              img.style.transform = ''; // Сбрасываем трансформации
            }
          }
        });
        
        if (currentWidth > 768) {
          setupImageParallax();
        }
      }
      
      lastWindowWidth = currentWidth;
      
      // Обновляем активные ссылки
      updateActiveNavLinks();
      
      // Перезапускаем ленивую загрузку для новых размеров
      lazyLoadImages();
    }, 250);
  });
  
  // ==================== ПОДДЕРЖКА КЛАВИАТУРНОЙ НАВИГАЦИИ ====================
  function setupKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
      // Прокрутка вверх/вниз с помощью клавиш PageUp/PageDown
      if (e.key === 'PageUp' || e.key === 'PageDown') {
        e.preventDefault();
        
        const scrollAmount = window.innerHeight * 0.8;
        const targetPosition = e.key === 'PageUp' 
          ? window.scrollY - scrollAmount 
          : window.scrollY + scrollAmount;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
      
      // Навигация по разделам с помощью клавиш Home/End
      if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        updateActiveNavLinks('#repair');
      }
      
      if (e.key === 'End') {
        e.preventDefault();
        window.scrollTo({ 
          top: document.body.scrollHeight, 
          behavior: 'smooth' 
        });
        updateActiveNavLinks('#other');
      }
    });
  }
  
  setupKeyboardNavigation();
  
  // ==================== ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ====================
  function initPage() {
    console.log('Services page initialized successfully!');
    
    // Добавляем класс для активации CSS-анимаций
    document.body.classList.add('page-loaded');
    
    // Показываем все изображения, если они уже загружены
    serviceImages.forEach(img => {
      if (img.complete && img.naturalHeight !== 0) {
        img.style.opacity = '1';
      }
    });
  }
  
  // Ждем полной загрузки страницы перед инициализацией
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
  } else {
    initPage();
  }
  
  // ==================== ЭКСПОРТ ФУНКЦИЙ ДЛЯ ГЛОБАЛЬНОГО ДОСТУПА ====================
  window.servicesPage = {
    scrollToSection: function(sectionId) {
      const targetElement = document.querySelector(sectionId);
      if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        let targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        if (window.innerWidth <= 992 && mobileServicesNav) {
          targetPosition -= mobileServicesNav.offsetHeight;
        }
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        history.pushState(null, null, sectionId);
        updateActiveNavLinks(sectionId);
        return true;
      }
      return false;
    },
    
    refreshActiveSection: function() {
      updateActiveNavLinks();
    },
    
    reloadImages: function() {
      lazyLoadImages();
    }
  };
});