// ==================== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ И КОНСТАНТЫ ====================
const DOM = {
  body: document.body,
  header: document.querySelector('.header'),
  menuToggle: document.getElementById('menu-toggle'),
  mobileNav: document.getElementById('mobile-nav'),
  mobileContactBtn: document.getElementById('mobile-contact'),
  contactToggle: document.querySelector('.contact-toggle'),
  workModal: document.getElementById('work-modal'),
  workModalOverlay: document.getElementById('work-modal-overlay'),
  workModalClose: document.getElementById('work-modal-close'),
  workSlides: document.querySelectorAll('.work-slide'),
  mobileNavLinks: document.querySelectorAll('.mobile-nav__link'),
  headerNavLinks: document.querySelectorAll('.header-nav .nav__link'),
  sections: document.querySelectorAll('section[id]'),
  serviceCards: document.querySelectorAll('.service-card-new'),
  teamMembers: document.querySelectorAll('.team-member'),
  heroHalves: document.querySelectorAll('.hero__half'),
  teamModal: document.getElementById('team-modal'),
  teamModalOverlay: document.getElementById('team-modal-overlay'),
  teamModalClose: document.getElementById('team-modal-close'),
  teamModalImg: document.getElementById('team-modal-img'),
  heroMobileServicesBtn: document.querySelector('.hero__mobile-services-btn'),
  heroServicesGrid: document.querySelector('.hero-services-grid'),
  heroMainBtn: document.querySelector('.hero__main-btn'),
  scrollToTopBtn: null
};

// Создаем недостающие элементы
let menuOverlay = document.querySelector('.menu-overlay');
if (!menuOverlay) {
  menuOverlay = document.createElement('div');
  menuOverlay.className = 'menu-overlay';
  DOM.body.appendChild(menuOverlay);
}

// Создаем кнопку "Наверх"
if (!DOM.scrollToTopBtn) {
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  scrollToTopBtn.className = 'scroll-to-top';
  scrollToTopBtn.setAttribute('aria-label', 'Наверх');
  DOM.body.appendChild(scrollToTopBtn);
  DOM.scrollToTopBtn = scrollToTopBtn;
}

// Переменные состояния
let worksSlider = null;
let resizeTimeout = null;
let lastScrollTop = 0;
let activeServiceCard = null;
let isMobile = window.innerWidth <= 768;

// ==================== УТИЛИТЫ ====================
const Utils = {
  // Throttle для оптимизации производительности
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // Debounce для оптимизации resize событий
  debounce(func, wait) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  },

  // Плавный скролл к элементу
  smoothScrollTo(element, offset = 20) {
    const headerHeight = DOM.header?.offsetHeight || 80;
    const elementPosition = element.offsetTop - headerHeight - offset;
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  },

  // Проверка видимости элемента в viewport
  isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    return (
      rect.top <= windowHeight * 0.8 &&
      rect.bottom >= 0
    );
  },

  // Закрытие всех открытых меню и модальных окон
  closeAllMenus() {
    // Закрываем мобильное меню
    if (DOM.menuToggle && DOM.menuToggle.classList.contains('active')) {
      DOM.menuToggle.classList.remove('active');
      DOM.mobileNav.classList.remove('active');
      menuOverlay.classList.remove('active');
      DOM.body.classList.remove('menu-open');
      DOM.body.style.overflow = '';
    }

    // Закрываем меню контактов
    if (DOM.mobileContactBtn && DOM.mobileContactBtn.classList.contains('active')) {
      DOM.mobileContactBtn.classList.remove('active');
    }

    // Закрываем активную карточку услуг на мобильных
    if (activeServiceCard) {
      activeServiceCard.classList.remove('active');
      activeServiceCard = null;
    }
  },

  // Проверка мобильного устройства
  checkMobile() {
    isMobile = window.innerWidth <= 768;
    return isMobile;
  }
};

// ==================== МОБИЛЬНОЕ МЕНЮ ====================
const MobileMenu = {
  init() {
    if (DOM.menuToggle) {
      DOM.menuToggle.addEventListener('click', MobileMenu.toggle);
    }

    // Закрытие при клике на оверлей
    menuOverlay.addEventListener('click', Utils.closeAllMenus);

    // Закрытие при клике на ссылки
    DOM.mobileNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            Utils.closeAllMenus();
            setTimeout(() => {
              Utils.smoothScrollTo(target);
            }, 300);
          }
        } else {
          Utils.closeAllMenus();
        }
      });
    });

    // Закрытие при нажатии ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        Utils.closeAllMenus();
      }
    });
  },

  toggle(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    DOM.menuToggle.classList.toggle('active');
    DOM.mobileNav.classList.toggle('active');
    menuOverlay.classList.toggle('active');

    if (DOM.mobileNav.classList.contains('active')) {
      DOM.body.classList.add('menu-open');
      DOM.body.style.overflow = 'hidden';
    } else {
      DOM.body.classList.remove('menu-open');
      DOM.body.style.overflow = '';
    }

    // Закрываем меню контактов, если оно открыто
    if (DOM.mobileContactBtn && DOM.mobileContactBtn.classList.contains('active')) {
      DOM.mobileContactBtn.classList.remove('active');
    }
  }
};

// ==================== МЕНЮ КОНТАКТОВ ДЛЯ МОБИЛЬНЫХ ====================
const ContactMenu = {
  init() {
    if (DOM.contactToggle) {
      DOM.contactToggle.addEventListener('click', ContactMenu.toggle);
    }

    // Закрытие при клике на ссылки
    const contactLinks = DOM.mobileContactBtn.querySelectorAll('.mobile-contact-link');
    contactLinks.forEach(link => {
      link.addEventListener('click', () => {
        DOM.mobileContactBtn.classList.remove('active');
      });
    });

    // Закрытие при клике вне
    document.addEventListener('click', (e) => {
      if (DOM.mobileContactBtn && 
          !DOM.mobileContactBtn.contains(e.target) && 
          DOM.mobileContactBtn.classList.contains('active')) {
        DOM.mobileContactBtn.classList.remove('active');
      }
    });
  },

  toggle(e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    // Закрываем меню навигации, если оно открыто
    if (DOM.mobileNav && DOM.mobileNav.classList.contains('active')) {
      Utils.closeAllMenus();
    }

    if (DOM.mobileContactBtn) {
      DOM.mobileContactBtn.classList.toggle('active');
    }
  }
};

// ==================== МОДАЛЬНОЕ ОКНО ДЛЯ РАБОТ ====================
const WorkModal = {
  // Данные для работ (с реальными описаниями)
  data: {
    1: {
      title: 'Лодка Nord Star Patrol 36+',
      description: 'Работы выполнялись по задаче повышения контроля и безопасности при управлении судном. Клиенту требовалось получить единое, наглядное и удобное решение для визуального контроля всех ключевых зон лодки, без разрозненных экранов и лишних приборов.',
      works: [
        'Установлены четыре камеры видеонаблюдения с охватом основных зон судна',
        'Выполнена коммутация всех камер в единую систему',
        'Настроен вывод изображения на одно головное устройство',
        'Установлено и настроено головное устройство Raymarine Axiom XL 24',
        'Проведена настройка отображения и переключения видеопотоков',
        'Проверена стабильность работы системы в различных режимах'
      ],
      result: 'Лодка получила современную систему видеоконтроля, полностью интегрированную в навигационный комплекс. Все камеры выводятся на один большой дисплей Raymarine Axiom XL 24, без задержек и с корректной картинкой. Управление стало удобнее и безопаснее, особенно при манёврах, швартовке и работе в ограниченных пространствах. Владелец получил централизованное решение без лишних экранов и разрозненных систем, соответствующее уровню и классу судна.',
      details: {
        duration: '5 дней',
        type: 'Установка видеонаблюдения и навигации',
        vessel: 'Лодка Nord Star Patrol 36+'
      },
      images: [
        'assets/фото_наших_работ.jpg',
        'assets/фото_наших_работ1.jpg',
        'assets/фото_наших_работ2.jpg'
      ]
    },
    2: {
      title: 'Ремонт двигателя гидроцикла Yamaha FZR 1800',
      description: 'Гидроцикл поступил после длительного простоя без эксплуатации. За время хранения на деталях двигателя образовалась коррозия. Из за ржавчины произошло снижение компрессии, что напрямую повлияло на запуск и стабильную работу мотора.',
      works: [
        'Разборка двигателя',
        'Диагностика состояния цилиндропоршневой группы',
        'Устранение последствий коррозии на деталях двигателя',
        'Восстановление компрессии',
        'Сборка двигателя с соблюдением заводских допусков',
        'Проверка работы двигателя после ремонта'
      ],
      result: 'Компрессия восстановлена до рабочих значений. Двигатель запускается стабильно и работает ровно во всех режимах. Последствия простоя устранены, мотор готов к дальнейшей эксплуатации без ограничений.',
      details: {
        duration: '3 дня',
        type: 'Капитальный ремонт двигателя',
        vessel: 'Гидроцикл Yamaha FZR 1800'
      },
      images: [
        'assets/фото_наших_работ3.jpg',
        'assets/фото_наших_работ4.jpg',
        'assets/фото_наших_рабо5.jpg'
      ]
    },
    3: {
      title: 'Ремонт двигателя гидроцикла BRP RXT 300',
      description: 'Гидроцикл поступил с серьёзной механической неисправностью. В процессе диагностики выявлено разрушение поршня. Причина поломки оказалась не в износе, а в неверной настройке блока управления. В погоне за увеличением мощности были нарушены рабочие режимы двигателя, что привело к перегрузке и механическому повреждению.',
      works: [
        'Полная разборка двигателя',
        'Дефектовка цилиндропоршневой группы',
        'Замена повреждённого поршня',
        'Сборка двигателя с соблюдением заводских допусков',
        'Проверка всех сопряжённых узлов',
        'Откат прошивки блока управления в штатную заводскую конфигурацию',
        'Контрольный запуск и проверка работы двигателя'
      ],
      result: 'Двигатель восстановлен и работает в штатных режимах. Компрессия приведена к нормальным значениям. Риск повторного разрушения устранён за счёт возврата корректных настроек блока управления.',
      details: {
        duration: '4 дня',
        type: 'Ремонт двигателя и электроники',
        vessel: 'Гидроцикл BRP RXT 300'
      },
      images: [
        'assets/фото_наших_работ6.jpg',
        'assets/фото_наших_работ7.jpg',
        'assets/фото_наших_работ8.jpg'
      ]
    },
    4: {
      title: 'Полная сборка новой Victory A7',
      description: 'Техника: абсолютно новая Victory A7, полученная «в металле» без навесного оборудования и электроники. Задача была собрать лодку под использование в реальных условиях: установить силовую часть, навигацию, приборы и обновить рулевое управление под будущие нагрузки.',
      works: [
        'Установка двигателя Mercury 250 Pro XS',
        'Установка эхолота Lowrance 12"',
        'Установка мультиприбора Mercury',
        'Установка системы идентификации судов (AIS)',
        'Замена и настройка рулевого управления',
        'Диагностика всех систем после сборки',
        'Настройка приборов под реальные условия эксплуатации'
      ],
      result: 'Victory A7 собрана полностью под эксплуатацию: двигатель, навигация, приборы и рулевое работают как единая система. Управление мягкое и точное, все данные корректно отображаются на приборах и Lowrance. Лодка готова к использованию без доработок и дополнительных выездов.',
      details: {
        duration: '7 дней',
        type: 'Полная сборка и настройка',
        vessel: 'Victory A7'
      },
      images: [
        'assets/фото_наших_работ9.jpg',
        'assets/фото_наших_работ10.jpg',
        'assets/фото_наших_работ11.jpg'
      ]
    }
  },

  init() {
    // Обработчики для открытия модального окна
    DOM.workSlides.forEach(slide => {
      const viewBtn = slide.querySelector('.work-slide__view-btn');
      
      if (viewBtn) {
        viewBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          WorkModal.open(slide.dataset.project);
        });
      }
      
      slide.addEventListener('click', () => {
        WorkModal.open(slide.dataset.project);
      });
    });

    // Закрытие модального окна
    if (DOM.workModalOverlay) {
      DOM.workModalOverlay.addEventListener('click', WorkModal.close);
    }
    
    if (DOM.workModalClose) {
      DOM.workModalClose.addEventListener('click', WorkModal.close);
    }

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DOM.workModal.classList.contains('active')) {
        WorkModal.close();
      }
    });
  },

  open(projectId) {
    const project = WorkModal.data[projectId];
    if (!project) {
      console.error('Проект не найден:', projectId);
      return;
    }

    // Заполняем данные
    document.getElementById('work-modal-title').textContent = project.title;
    document.getElementById('work-modal-desc').textContent = project.description;

    // Обновляем детали
    const details = document.querySelector('.work-modal__details-top');
    if (details) {
      details.innerHTML = `
        <div class="work-modal__detail">
          <i class="fas fa-calendar-alt"></i>
          <span>Срок выполнения: <strong>${project.details.duration}</strong></span>
        </div>
        <div class="work-modal__detail">
          <i class="fas fa-tools"></i>
          <span>Тип работ: <strong>${project.details.type}</strong></span>
        </div>
        <div class="work-modal__detail">
          <i class="fas fa-ship"></i>
          <span>Судно: <strong>${project.details.vessel}</strong></span>
        </div>
      `;
    }

    // Обновляем изображения
    const mainImg = document.getElementById('work-modal-main-img');
    if (mainImg && project.images[0]) {
      mainImg.src = project.images[0];
      mainImg.alt = project.title;
    }

    // Обновляем миниатюры
    const thumbsContainer = document.querySelector('.work-modal__thumbnails');
    if (thumbsContainer) {
      thumbsContainer.innerHTML = '';

      project.images.forEach((imgSrc, index) => {
        const thumb = document.createElement('div');
        thumb.className = `work-modal__thumb ${index === 0 ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${imgSrc}" alt="Миниатюра ${index + 1}">`;

        thumb.addEventListener('click', () => {
          document.querySelectorAll('.work-modal__thumb').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
          mainImg.src = imgSrc;
        });

        thumbsContainer.appendChild(thumb);
      });
    }

    // Обновляем список работ
    const worksList = document.getElementById('work-modal-list');
    if (worksList) {
      worksList.innerHTML = '';
      project.works.forEach(work => {
        const li = document.createElement('li');
        li.textContent = work;
        worksList.appendChild(li);
      });
    }

    // Обновляем результат
    const resultElement = document.getElementById('work-modal-result');
    if (resultElement) {
      resultElement.textContent = project.result;
    }

    // Показываем модальное окно
    DOM.workModal.classList.add('active');
    DOM.body.style.overflow = 'hidden';
    DOM.body.classList.add('modal-open');
  },

  close() {
    DOM.workModal.classList.remove('active');
    DOM.body.style.overflow = '';
    DOM.body.classList.remove('modal-open');
  }
};

// ==================== МОДАЛЬНОЕ ОКНО ДЛЯ КОМАНДЫ ====================
const TeamModal = {
  init() {
    // Открытие модального окна при клике на фото команды
    DOM.teamMembers.forEach(member => {
      member.addEventListener('click', function() {
        const img = this.querySelector('img');
        if (img && img.src) {
          DOM.teamModalImg.src = img.src;
          DOM.teamModalImg.alt = img.alt;
          TeamModal.open();
        }
      });
    });

    // Закрытие модального окна
    if (DOM.teamModalOverlay) {
      DOM.teamModalOverlay.addEventListener('click', TeamModal.close);
    }
    
    if (DOM.teamModalClose) {
      DOM.teamModalClose.addEventListener('click', TeamModal.close);
    }

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DOM.teamModal.classList.contains('active')) {
        TeamModal.close();
      }
    });
  },

  open() {
    DOM.teamModal.classList.add('active');
    DOM.body.style.overflow = 'hidden';
    DOM.body.classList.add('modal-open');
  },

  close() {
    DOM.teamModal.classList.remove('active');
    DOM.body.style.overflow = '';
    DOM.body.classList.remove('modal-open');
  }
};

// ==================== ПЛАВНЫЙ СКРОЛЛ ====================
const SmoothScroll = {
  init() {
    // Обработчики для всех якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', SmoothScroll.handleClick);
    });
  },

  handleClick(e) {
    const href = this.getAttribute('href');
    
    if (href === '#' || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      return;
    }
    
    const targetElement = document.querySelector(href);
    if (targetElement) {
      e.preventDefault();
      
      // Закрываем все меню
      Utils.closeAllMenus();
      
      // Закрываем модальные окна
      if (DOM.workModal.classList.contains('active')) {
        WorkModal.close();
      }
      
      if (DOM.teamModal.classList.contains('active')) {
        TeamModal.close();
      }
      
      // Плавный скролл
      Utils.smoothScrollTo(targetElement);
    }
  }
};

// ==================== СЛАЙДЕР РАБОТ ====================
const Slider = {
  init() {
    const sliderElement = document.querySelector('.works-slider');
    if (!sliderElement) return;

    worksSlider = new Swiper('.works-slider', {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        320: { 
          slidesPerView: 1, 
          spaceBetween: 10 
        },
        768: { 
          slidesPerView: 2, 
          spaceBetween: 20 
        },
        1024: { 
          slidesPerView: 3, 
          spaceBetween: 30 
        }
      }
    });
  },

  destroy() {
    if (worksSlider) {
      worksSlider.destroy(true, true);
      worksSlider = null;
    }
  },

  reinit() {
    Slider.destroy();
    Slider.init();
  }
};

// ==================== АНИМАЦИЯ ПРИ СКРОЛЛЕ ====================
const ScrollAnimations = {
  observer: null,

  init() {
    const fadeElements = document.querySelectorAll('.service-card-new, .team-member, .section-header, .contact-item, .onsite-feature, .work-slide');
    
    ScrollAnimations.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            ScrollAnimations.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    fadeElements.forEach(el => {
      if (el) ScrollAnimations.observer.observe(el);
    });
  }
};

// ==================== ИЗМЕНЕНИЕ ШАПКИ ПРИ СКРОЛЛЕ ====================
const HeaderScroll = {
  init() {
    window.addEventListener('scroll', Utils.throttle(HeaderScroll.update, 100));
    HeaderScroll.update(); // Инициализация
  },

  update() {
    if (!DOM.header) return;

    const scrollY = window.scrollY;
    const scrollDirection = scrollY > lastScrollTop ? 'down' : 'up';
    lastScrollTop = scrollY <= 0 ? 0 : scrollY;

    // Добавляем/убираем класс при скролле
    if (scrollY > 50) {
      DOM.header.classList.add('scrolled');
    } else {
      DOM.header.classList.remove('scrolled');
    }

    // Показываем/скрываем кнопку "Наверх"
    if (DOM.scrollToTopBtn) {
      if (scrollY > 500) {
        DOM.scrollToTopBtn.classList.add('visible');
      } else {
        DOM.scrollToTopBtn.classList.remove('visible');
      }
    }

    // Подсветка активного раздела
    let currentSection = '';
    DOM.sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollY >= (sectionTop - 150)) {
        currentSection = section.getAttribute('id');
      }
    });

    // Обновляем активные ссылки в шапке
    DOM.headerNavLinks.forEach(link => {
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Обновляем активные ссылки в мобильном меню
    DOM.mobileNavLinks.forEach(link => {
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
};

// ==================== КНОПКА "НАВЕРХ" ====================
const ScrollToTop = {
  init() {
    if (DOM.scrollToTopBtn) {
      DOM.scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }
};

// ==================== КАРТОЧКИ УСЛУГ ====================
const ServiceCards = {
  init() {
    DOM.serviceCards.forEach(card => {
      // Для десктопа используем hover
      if (!Utils.checkMobile()) {
        ServiceCards.setupDesktopBehavior(card);
      } else {
        // Для мобильных используем логику "первый тап - инфо, второй - переход"
        ServiceCards.setupMobileBehavior(card);
      }
    });

    // Закрытие активной карточки при клике вне
    document.addEventListener('click', (e) => {
      if (activeServiceCard && 
          !e.target.closest('.service-card-new') && 
          !e.target.closest('.service-card-arrow')) {
        activeServiceCard.classList.remove('active');
        activeServiceCard = null;
      }
    });

    // Обработка клика по стрелке на мобильных
    document.querySelectorAll('.service-card-arrow').forEach(arrow => {
      arrow.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = e.target.closest('.service-card-new');
        if (card) {
          const link = card.getAttribute('href');
          if (link) {
            window.location.href = link;
          }
        }
      });
    });
  },

  setupDesktopBehavior(card) {
    card.addEventListener('mouseenter', () => {
      card.classList.add('hover-active');
    });
    
    card.addEventListener('mouseleave', () => {
      card.classList.remove('hover-active');
    });
    
    // Клик для перехода по ссылке
    card.addEventListener('click', (e) => {
      if (!e.target.closest('.service-card-arrow')) {
        const link = card.getAttribute('href');
        if (link) {
          window.location.href = link;
        }
      }
    });
  },

  setupMobileBehavior(card) {
    let tapCount = 0;
    let tapTimer;

    card.addEventListener('click', (e) => {
      // Если кликнули по стрелке - сразу переход
      if (e.target.closest('.service-card-arrow')) {
        const link = card.getAttribute('href');
        if (link) {
          window.location.href = link;
        }
        return;
      }

      tapCount++;

      if (tapCount === 1) {
        tapTimer = setTimeout(() => {
          // Одиночный тап - показываем/скрываем инфо
          if (card.classList.contains('active')) {
            card.classList.remove('active');
            activeServiceCard = null;
          } else {
            // Скрываем другие активные карточки
            if (activeServiceCard && activeServiceCard !== card) {
              activeServiceCard.classList.remove('active');
            }
            card.classList.add('active');
            activeServiceCard = card;
          }
          tapCount = 0;
        }, 300);
      } else if (tapCount === 2) {
        // Двойной тап - переход по ссылке
        clearTimeout(tapTimer);
        const link = card.getAttribute('href');
        if (link) {
          window.location.href = link;
        }
        tapCount = 0;
      }
    });

    // Сброс счетчика тапов
    card.addEventListener('touchstart', () => {
      if (tapCount > 0 && !tapTimer) {
        tapCount = 0;
      }
    });
  },

  updateBehavior() {
    DOM.serviceCards.forEach(card => {
      // Удаляем все старые обработчики
      card.replaceWith(card.cloneNode(true));
    });
    
    // Обновляем ссылку на карточки
    DOM.serviceCards = document.querySelectorAll('.service-card-new');
    
    // Применяем новое поведение
    ServiceCards.init();
  }
};

// ==================== ГЛАВНЫЙ ЭКРАН ====================
const HeroSection = {
  init() {
    HeroSection.setHeight();
    HeroSection.adjustImages();
    HeroSection.setupMobileBehavior();
  },

  setHeight() {
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.style.height = '100vh';
    }
  },

  adjustImages() {
    const windowWidth = window.innerWidth;
    
    DOM.heroHalves.forEach(half => {
      if (half) {
        if (windowWidth <= 1024) {
          half.style.backgroundPosition = half.classList.contains('hero__half--yacht') 
            ? 'center bottom 20%' 
            : 'center bottom 15%';
        } else {
          half.style.backgroundPosition = half.classList.contains('hero__half--yacht') 
            ? 'right center' 
            : 'left center';
        }
      }
    });
  },

  setupMobileBehavior() {
    // На мобильных скрываем сетку услуг и показываем одну кнопку
    if (Utils.checkMobile()) {
      if (DOM.heroServicesGrid) {
        DOM.heroServicesGrid.style.display = 'none';
      }
      if (DOM.heroMobileServicesBtn) {
        DOM.heroMobileServicesBtn.style.display = 'flex';
      }
    } else {
      if (DOM.heroServicesGrid) {
        DOM.heroServicesGrid.style.display = 'grid';
      }
      if (DOM.heroMobileServicesBtn) {
        DOM.heroMobileServicesBtn.style.display = 'none';
      }
    }
  }
};

// ==================== ОПТИМИЗАЦИЯ ИЗОБРАЖЕНИЙ ====================
const ImageOptimizer = {
  init() {
    const images = document.querySelectorAll('img[src]:not([src=""])');
    
    images.forEach(img => {
      // Устанавливаем lazy loading
      img.loading = 'lazy';
      
      // Добавляем плавное появление
      if (!img.complete) {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        
        img.onload = () => {
          img.style.opacity = '1';
        };
        
        img.onerror = () => {
          img.style.opacity = '1';
          console.warn('Не удалось загрузить изображение:', img.src);
        };
      }
    });

    // Предзагрузка изображений команды
    const teamImages = document.querySelectorAll('.team-member__photo img');
    teamImages.forEach(img => {
      if (img.src && img.src.includes('placeholder')) {
        img.style.backgroundColor = '#1a1a1a';
      }
    });
  }
};

// ==================== ЦЕНТРИРОВАНИЕ ТЕКСТА ПОД НОМЕРОМ ====================
const TextCentering = {
  init() {
    if (!Utils.checkMobile()) {
      TextCentering.centerText();
    }
  },

  centerText() {
    const headerPhone = document.querySelector('.header-phone');
    const headerOnsite = document.querySelector('.header-onsite');
    const headerSocialRow = document.querySelector('.header-social-row');

    if (!headerPhone || !headerOnsite || !headerSocialRow) return;

    // Получаем ширину элементов
    const phoneWidth = headerPhone.offsetWidth;
    const socialWidth = headerSocialRow.offsetWidth;
    
    // Рассчитываем позиционирование
    headerOnsite.style.width = `${phoneWidth}px`;
    headerOnsite.style.textAlign = 'right';
    headerOnsite.style.marginRight = `${socialWidth + 12}px`;
    headerOnsite.style.position = 'relative';
    headerOnsite.style.left = '-4px';
  },

  reset() {
    const headerOnsite = document.querySelector('.header-onsite');
    if (headerOnsite) {
      headerOnsite.style.width = '';
      headerOnsite.style.textAlign = '';
      headerOnsite.style.marginRight = '';
      headerOnsite.style.position = '';
      headerOnsite.style.left = '';
    }
  }
};

// ==================== АДАПТИВНОСТЬ ====================
const Responsive = {
  init() {
    window.addEventListener('resize', Utils.debounce(Responsive.handleResize, 250));
    Responsive.checkWindowSize();
  },

  handleResize() {
    const wasMobile = isMobile;
    const nowMobile = Utils.checkMobile();
    
    Responsive.checkWindowSize();
    TextCentering.init();
    HeroSection.adjustImages();
    HeroSection.setupMobileBehavior();
    HeroSection.setHeight();
    
    // Переинициализируем слайдер при изменении размера
    if (nowMobile && worksSlider) {
      Slider.destroy();
    } else if (!nowMobile && !worksSlider) {
      Slider.init();
    }

    // Переключаем логику карточек услуг при изменении типа устройства
    if (wasMobile !== nowMobile) {
      ServiceCards.updateBehavior();
    }
  },

  checkWindowSize() {
    const windowWidth = window.innerWidth;

    // На десктопе закрываем мобильные меню
    if (windowWidth > 767) {
      Utils.closeAllMenus();
      TextCentering.init();
    } else {
      TextCentering.reset();
    }
  }
};

// ==================== ОСНОВНОЙ СКРИПТ САЙТА ====================
const App = {
  init() {
    // Инициализация модулей
    MobileMenu.init();
    ContactMenu.init();
    WorkModal.init();
    TeamModal.init();
    SmoothScroll.init();
    Slider.init();
    ScrollAnimations.init();
    HeaderScroll.init();
    ScrollToTop.init();
    HeroSection.init();
    ImageOptimizer.init();
    ServiceCards.init();
    Responsive.init();
    TextCentering.init();

    // Дополнительные настройки
    App.setupHeroScroll();
    App.addPageLoadedClass();

    console.log('Boost Marine website loaded successfully!');
  },

  setupHeroScroll() {
    const heroScroll = document.querySelector('.hero__scroll');
    if (heroScroll) {
      heroScroll.addEventListener('click', () => {
        const worksSection = document.querySelector('#works');
        if (worksSection) {
          Utils.smoothScrollTo(worksSection);
        }
      });
    }
  },

  addPageLoadedClass() {
    setTimeout(() => {
      DOM.body.classList.add('loaded');
    }, 100);
  }
};

// ==================== ЗАГРУЗКА ПРИЛОЖЕНИЯ ====================
document.addEventListener('DOMContentLoaded', App.init);

// Обработка события загрузки всех ресурсов
window.addEventListener('load', () => {
  // Пересчитываем позиционирование текста после загрузки всех шрифтов
  setTimeout(TextCentering.init, 100);
});

// Обработка события beforeunload для очистки
window.addEventListener('beforeunload', () => {
  if (worksSlider) {
    Slider.destroy();
  }
});

// Обработка клика вне выпадающего меню Telegram
document.addEventListener('click', (e) => {
  const telegramDropdown = document.querySelector('.telegram-dropdown');
  const telegramMenu = document.querySelector('.telegram-dropdown__menu');
  
  if (telegramDropdown && telegramMenu && 
      !telegramDropdown.contains(e.target) && 
      telegramMenu.style.visibility === 'visible') {
    telegramMenu.style.opacity = '0';
    telegramMenu.style.visibility = 'hidden';
    telegramMenu.style.transform = 'translateY(-10px)';
  }
});

// ==================== ОБРАБОТКА ВИДЕО В КАРТОЧКАХ УСЛУГ ====================
const VideoHandler = {
  init() {
    const videos = document.querySelectorAll('video[autoplay]');
    
    videos.forEach(video => {
      // Устанавливаем muted для автовоспроизведения
      video.muted = true;
      
      // Пытаемся воспроизвести
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Автовоспроизведение видео заблокировано:', error);
          // Показываем кнопку воспроизведения
          VideoHandler.addPlayButton(video);
        });
      }
    });
  },
  
  addPlayButton(video) {
    const playButton = document.createElement('button');
    playButton.innerHTML = '<i class="fas fa-play"></i>';
    playButton.className = 'video-play-button';
    playButton.style.position = 'absolute';
    playButton.style.top = '50%';
    playButton.style.left = '50%';
    playButton.style.transform = 'translate(-50%, -50%)';
    playButton.style.zIndex = '3';
    playButton.style.background = 'rgba(0, 0, 0, 0.7)';
    playButton.style.border = 'none';
    playButton.style.borderRadius = '50%';
    playButton.style.width = '60px';
    playButton.style.height = '60px';
    playButton.style.color = 'white';
    playButton.style.fontSize = '24px';
    playButton.style.cursor = 'pointer';
    playButton.style.display = 'flex';
    playButton.style.alignItems = 'center';
    playButton.style.justifyContent = 'center';
    
    video.parentNode.style.position = 'relative';
    video.parentNode.appendChild(playButton);
    
    playButton.addEventListener('click', () => {
      video.play();
      playButton.style.display = 'none';
    });
    
    video.addEventListener('play', () => {
      playButton.style.display = 'none';
    });
    
    video.addEventListener('pause', () => {
      playButton.style.display = 'flex';
    });
  }
};

// Инициализация обработчика видео после загрузки DOM
document.addEventListener('DOMContentLoaded', VideoHandler.init);