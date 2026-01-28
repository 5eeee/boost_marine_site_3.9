// equipment.js - скрипты для страницы оборудования

document.addEventListener('DOMContentLoaded', function() {
  
  // ==================== ДАННЫЕ ТОВАРОВ ====================
  const products = [
    {
      id: 1,
      name: "Моторное масло для яхт",
      description: "Специальное масло для судовых дизельных двигателей с улучшенными характеристиками устойчивости к морской воде. Обеспечивает надежную защиту двигателя в условиях повышенной влажности и солености.",
      price: "2 500 ₽",
      category: "Расходники",
      images: [
        "assets/products/motor-oil.jpg",
        "assets/products/motor-oil-2.jpg",
        "assets/products/motor-oil-3.jpg"
      ],
      specs: [
        { name: "Объем", value: "5 л" },
        { name: "Вязкость", value: "15W-40" },
        { name: "API класс", value: "CI-4" },
        { name: "Темп. диапазон", value: "-25°C до +50°C" },
        { name: "Производитель", value: "MarineLube" },
        { name: "Тип", value: "Полусинтетическое" },
        { name: "Срок хранения", value: "5 лет" }
      ]
    },
    {
      id: 2,
      name: "Комплект фильтров",
      description: "Масляный, топливный и воздушный фильтры для судовых двигателей. Обеспечивают надежную фильтрацию и защиту двигателя от загрязнений.",
      price: "8 900 ₽",
      category: "Расходники",
      images: [
        "assets/products/filter-set.jpg",
        "assets/products/filter-set-2.jpg"
      ],
      specs: [
        { name: "Тип фильтра", value: "Масляный, топливный, воздушный" },
        { name: "Материал", value: "Синтетическое волокно" },
        { name: "Совместимость", value: "Volvo Penta, Yanmar" },
        { name: "Срок службы", value: "500 часов" },
        { name: "Давление", value: "до 6 бар" },
        { name: "Темп. диапазон", value: "-20°C до +80°C" }
      ]
    },
    {
      id: 3,
      name: "Навигационная система",
      description: "GPS-навигатор с картами для яхт и катеров, водонепроницаемый корпус. Включает в себя функции картографии, эхолота и связи.",
      price: "45 000 ₽",
      category: "Навигация",
      images: [
        "assets/products/gps-system.jpg",
        "assets/products/gps-system-2.jpg",
        "assets/products/gps-system-3.jpg"
      ],
      specs: [
        { name: "Диагональ экрана", value: '10"' },
        { name: "Разрешение", value: "1280x720" },
        { name: "GPS модуль", value: "GLONASS/GPS" },
        { name: "Водонепроницаемость", value: "IPX7" },
        { name: "Память", value: "32 ГБ" },
        { name: "Интерфейсы", value: "WiFi, Bluetooth, USB" },
        { name: "Мощность", value: "12V DC" }
      ]
    },
    {
      id: 4,
      name: "Помпа для откачки воды",
      description: "Автоматическая помпа для откачки воды из трюма с поплавковым выключателем. Надежная работа в морских условиях.",
      price: "12 500 ₽",
      category: "Оборудование",
      images: [
        "assets/products/bilge-pump.jpg",
        "assets/products/bilge-pump-2.jpg"
      ],
      specs: [
        { name: "Производительность", value: "3000 л/ч" },
        { name: "Напряжение", value: "12V" },
        { name: "Мощность", value: "120 Вт" },
        { name: "Материал корпуса", value: "Пластик ABS" },
        { name: "Автоматика", value: "Поплавковый выключатель" },
        { name: "Диаметр патрубка", value: "32 мм" },
        { name: "Вес", value: "1.8 кг" }
      ]
    },
    {
      id: 5,
      name: "Поршневые группы",
      description: "Оригинальные поршни и кольца для двигателей Volvo Penta. Изготовлены из высококачественных материалов для долговечной работы.",
      price: "22 000 ₽",
      category: "Двигатель",
      images: [
        "assets/products/piston-set.jpg",
        "assets/products/piston-set-2.jpg"
      ],
      specs: [
        { name: "Диаметр поршня", value: "84 мм" },
        { name: "Материал", value: "Алюминиевый сплав" },
        { name: "Количество", value: "4 шт" },
        { name: "Совместимость", value: "Volvo Penta D3" },
        { name: "Тип", value: "Оригинальные" },
        { name: "Гарантия", value: "12 месяцев" }
      ]
    },
    {
      id: 6,
      name: "Турбокомпрессор",
      description: "Турбокомпрессор для судовых дизельных двигателей. Обеспечивает повышение мощности двигателя при экономии топлива.",
      price: "68 000 ₽",
      category: "Двигатель",
      images: [
        "assets/products/turbo.jpg",
        "assets/products/turbo-2.jpg"
      ],
      specs: [
        { name: "Модель", value: "TD04L" },
        { name: "Макс. давление", value: "1.2 бар" },
        { name: "Материал", value: "Чугун/алюминий" },
        { name: "Вес", value: "8.5 кг" },
        { name: "Совместимость", value: "Yanmar 4LH" },
        { name: "Гарантия", value: "18 месяцев" }
      ]
    },
    {
      id: 7,
      name: "Редукторный комплект",
      description: "Ремонтный комплект для редукторов судовых двигателей. Включает все необходимые компоненты для восстановления редуктора.",
      price: "15 800 ₽",
      category: "Трансмиссия",
      images: [
        "assets/products/gearbox-kit.jpg"
      ],
      specs: [
        { name: "В комплекте", value: "Шестерни, подшипники, сальники" },
        { name: "Совместимость", value: "Yanmar 3JH" },
        { name: "Гарантия", value: "12 месяцев" },
        { name: "Материал шестерен", value: "Легированная сталь" },
        { name: "Вес", value: "3.2 кг" }
      ]
    },
    {
      id: 8,
      name: "Морской кабель",
      description: "Водонепроницаемый кабель для морской электроники. Двойная изоляция, устойчивость к маслам и соленой воде.",
      price: "850 ₽/м",
      category: "Электрооборудование",
      images: [
        "assets/products/marine-cable.jpg"
      ],
      specs: [
        { name: "Сечение", value: "2.5 мм²" },
        { name: "Изоляция", value: "Двойная, маслостойкая" },
        { name: "Цвета", value: "Красный, черный, синий" },
        { name: "Длина", value: "Моток 50 м" },
        { name: "Темп. диапазон", value: "-40°C до +105°C" },
        { name: "Сертификация", value: "ISO 10133" }
      ]
    },
    {
      id: 9,
      name: "Кондиционер каютный",
      description: "Судовой кондиционер для кают и салонов яхт. Низкий уровень шума, высокая энергоэффективность.",
      price: "89 000 ₽",
      category: "Климат",
      images: [
        "assets/products/ac-unit.jpg",
        "assets/products/ac-unit-2.jpg"
      ],
      specs: [
        { name: "Мощность охлаждения", value: "9000 BTU" },
        { name: "Потребление", value: "850 Вт" },
        { name: "Уровень шума", value: "45 дБ" },
        { name: "Габариты", value: "450x300x250 мм" },
        { name: "Напряжение", value: "220V/12V" },
        { name: "Пульт ДУ", value: "Да" }
      ]
    },
    {
      id: 10,
      name: "Эхолот",
      description: "Многофункциональный эхолот с картплоттером. Высокая точность измерений, детальное отображение рельефа дна.",
      price: "32 000 ₽",
      category: "Навигация",
      images: [
        "assets/products/fishfinder.jpg",
        "assets/products/fishfinder-2.jpg"
      ],
      specs: [
        { name: "Диагональ экрана", value: '7"' },
        { name: "Частота сонара", value: "200/77 кГц" },
        { name: "Глубина", value: "до 300 м" },
        { name: "Водонепроницаемость", value: "IPX7" },
        { name: "GPS", value: "Встроенный" },
        { name: "Память", value: "16 ГБ" }
      ]
    },
    {
      id: 11,
      name: "Спасательный жилет",
      description: "Автоматический спасательный жилет для яхтсменов. Легкий, удобный, соответствует всем требованиям безопасности.",
      price: "6 500 ₽",
      category: "Безопасность",
      images: [
        "assets/products/lifejacket.jpg"
      ],
      specs: [
        { name: "Тип", value: "Автоматический" },
        { name: "Подъемная сила", value: "150 Н" },
        { name: "Цвет", value: "Оранжевый" },
        { name: "Сертификация", value: "ISO 12402-3" },
        { name: "Вес", value: "1.1 кг" },
        { name: "Срок службы", value: "10 лет" }
      ]
    },
    {
      id: 12,
      name: "Яхтенный диван",
      description: "Угловой диван для каюты яхты с водонепроницаемой обивкой. Комфорт и надежность в морских условиях.",
      price: "45 000 ₽",
      category: "Интерьер",
      images: [
        "assets/products/yacht-sofa.jpg",
        "assets/products/yacht-sofa-2.jpg"
      ],
      specs: [
        { name: "Размеры", value: "1800x800x850 мм" },
        { name: "Материал", value: "Водонепроницаемая ткань" },
        { name: "Каркас", value: "Алюминий" },
        { name: "Цвет", value: "Белый, синий, серый" },
        { name: "Вес", value: "25 кг" },
        { name: "Монтаж", value: "Настенный" }
      ]
    },
    {
      id: 13,
      name: "Топливный насос",
      description: "Электрический топливный насос для судовых двигателей. Надежная подача топлива под давлением.",
      price: "9 800 ₽",
      category: "Двигатель",
      images: [
        "assets/products/fuel-pump.jpg"
      ],
      specs: [
        { name: "Производительность", value: "120 л/ч" },
        { name: "Напряжение", value: "12V" },
        { name: "Давление", value: "3.5 бар" },
        { name: "Подключение", value: "1/4'" },
        { name: "Потребление", value: "4.5 А" },
        { name: "Вес", value: "0.8 кг" }
      ]
    },
    {
      id: 14,
      name: "Судовой аккумулятор",
      description: "Гелевый аккумулятор для морского использования. Высокая емкость, устойчивость к вибрации, длительный срок службы.",
      price: "18 500 ₽",
      category: "Электрооборудование",
      images: [
        "assets/products/marine-battery.jpg"
      ],
      specs: [
        { name: "Емкость", value: "100 Ач" },
        { name: "Напряжение", value: "12V" },
        { name: "Тип", value: "Гелевый (AGM)" },
        { name: "Габариты", value: "330x172x240 мм" },
        { name: "Вес", value: "28 кг" },
        { name: "Срок службы", value: "10 лет" }
      ]
    },
    {
      id: 15,
      name: "Радиостанция морская",
      description: "Морская УКВ радиостанция с DSC функцией. Надежная связь в морских условиях, водонепроницаемый корпус.",
      price: "28 000 ₽",
      category: "Связь",
      images: [
        "assets/products/marine-radio.jpg",
        "assets/products/marine-radio-2.jpg"
      ],
      specs: [
        { name: "Мощность", value: "25 Вт" },
        { name: "Каналы", value: "55 морских + 10 погодных" },
        { name: "DSC", value: "Да" },
        { name: "Водонепроницаемость", value: "IPX7" },
        { name: "Интерфейс", value: "NMEA 0183/2000" },
        { name: "Гарантия", value: "24 месяца" }
      ]
    }
  ];
  
  // ==================== ПОИСК ТОВАРОВ ====================
  const searchInput = document.getElementById('searchInput');
  const searchSuggestions = document.getElementById('searchSuggestions');
  
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const query = this.value.toLowerCase().trim();
      searchSuggestions.innerHTML = '';
      
      if (query.length > 1) {
        const suggestions = products.filter(product => 
          product.name.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        ).slice(0, 5);
        
        if (suggestions.length > 0) {
          searchSuggestions.style.display = 'block';
          suggestions.forEach(product => {
            const suggestion = document.createElement('div');
            suggestion.className = 'search-suggestion';
            suggestion.innerHTML = `
              <i class="fas fa-search"></i>
              <span>${product.name}</span>
              <span class="suggestion-category">${product.category}</span>
            `;
            suggestion.addEventListener('click', function() {
              searchInput.value = product.name;
              searchSuggestions.style.display = 'none';
              filterProducts(product.name);
            });
            searchSuggestions.appendChild(suggestion);
          });
        } else {
          searchSuggestions.style.display = 'block';
          const noResult = document.createElement('div');
          noResult.className = 'search-suggestion';
          noResult.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>Товары не найдены</span>
          `;
          searchSuggestions.appendChild(noResult);
        }
      } else {
        searchSuggestions.style.display = 'none';
        filterProducts('');
      }
    });
    
    // Закрытие подсказок при клике вне
    document.addEventListener('click', function(e) {
      if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
        searchSuggestions.style.display = 'none';
      }
    });
    
    // Обработка клавиш в поле поиска
    searchInput.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        searchSuggestions.style.display = 'none';
      }
      if (e.key === 'Enter') {
        filterProducts(this.value);
        searchSuggestions.style.display = 'none';
      }
    });
  }
  
  // ==================== ФИЛЬТРАЦИЯ ТОВАРОВ ====================
  function filterProducts(query = '') {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    // Показываем все карточки
    const allCards = document.querySelectorAll('.catalog-card');
    allCards.forEach(card => {
      card.style.display = 'flex';
    });
    
    if (query) {
      const searchTerm = query.toLowerCase().trim();
      let foundProducts = false;
      
      allCards.forEach(card => {
        const title = card.querySelector('.product-card__title').textContent.toLowerCase();
        const category = card.querySelector('.product-card__category').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || category.includes(searchTerm)) {
          card.style.display = 'flex';
          foundProducts = true;
        } else {
          card.style.display = 'none';
        }
      });
      
      // Показываем сообщение, если ничего не найдено
      const existingMessage = document.querySelector('.no-results');
      if (existingMessage) existingMessage.remove();
      
      if (!foundProducts) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
          <i class="fas fa-search"></i>
          <h3>Товары не найдены</h3>
          <p>Попробуйте изменить запрос поиска</p>
        `;
        productsGrid.appendChild(noResults);
      }
    }
  }
  
  // ==================== МОДАЛЬНОЕ ОКНО ТОВАРА ====================
  const productModalOverlay = document.getElementById('productModalOverlay');
  const productModalClose = document.getElementById('productModalClose');
  const productDetailsBtns = document.querySelectorAll('.product-details-btn');
  
  function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !productModalOverlay) return;
    
    // Заполняем данные товара
    document.getElementById('modalProductTitle').textContent = product.name;
    document.getElementById('modalProductPrice').textContent = product.price;
    document.getElementById('modalProductCategory').textContent = product.category;
    document.getElementById('modalProductDescription').textContent = product.description;
    
    // Устанавливаем основное изображение
    const mainImage = document.getElementById('modalMainImage');
    mainImage.src = product.images[0];
    mainImage.alt = product.name;
    
    // Создаем миниатюры
    const thumbnailsContainer = document.getElementById('modalThumbnails');
    thumbnailsContainer.innerHTML = '';
    
    product.images.forEach((imgSrc, index) => {
      const thumb = document.createElement('div');
      thumb.className = 'thumbnail';
      if (index === 0) thumb.classList.add('active');
      
      const thumbImg = document.createElement('img');
      thumbImg.src = imgSrc;
      thumbImg.alt = `${product.name} - фото ${index + 1}`;
      thumbImg.loading = 'lazy';
      
      thumb.appendChild(thumbImg);
      thumb.addEventListener('click', function() {
        mainImage.src = imgSrc;
        mainImage.alt = `${product.name} - фото ${index + 1}`;
        
        // Убираем активный класс у всех миниатюр
        document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
        // Добавляем активный класс текущей миниатюре
        this.classList.add('active');
      });
      
      thumbnailsContainer.appendChild(thumb);
    });
    
    // Заполняем характеристики
    const specsTable = document.getElementById('modalProductSpecs');
    specsTable.innerHTML = '';
    
    product.specs.forEach(spec => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="spec-name">${spec.name}</td>
        <td class="spec-value">${spec.value}</td>
      `;
      specsTable.appendChild(row);
    });
    
    // Показываем модальное окно с анимацией
    productModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Добавляем обработчик для закрытия по ESC
    const closeOnEsc = function(e) {
      if (e.key === 'Escape') {
        closeProductModal();
        document.removeEventListener('keydown', closeOnEsc);
      }
    };
    document.addEventListener('keydown', closeOnEsc);
  }
  
  function closeProductModal() {
    productModalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Удаляем активный класс у всех миниатюр
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
  }
  
  // Закрытие модального окна
  if (productModalClose) {
    productModalClose.addEventListener('click', closeProductModal);
  }
  
  // Закрытие при клике на оверлей
  if (productModalOverlay) {
    productModalOverlay.addEventListener('click', function(e) {
      if (e.target === this) {
        closeProductModal();
      }
    });
  }
  
  // Добавляем обработчики для кнопок "Подробнее"
  productDetailsBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = parseInt(this.getAttribute('data-product-id'));
      if (productId) {
        openProductModal(productId);
      }
    });
  });
  
  // ==================== ЛЕНИВАЯ ЗАГРУЗКА ИЗОБРАЖЕНИЙ ====================
  function lazyLoadImages() {
    const images = document.querySelectorAll('.product-card__image img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // Если изображение уже загружено, пропускаем
          if (img.complete) return;
          
          // Добавляем эффект появления
          img.style.transition = 'opacity 0.3s ease';
          img.style.opacity = '0';
          
          img.onload = function() {
            this.style.opacity = '1';
          };
          
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0.1
    });
    
    images.forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  // ==================== ИНИЦИАЛИЗАЦИЯ ====================
  // Запускаем ленивую загрузку изображений
  setTimeout(lazyLoadImages, 500);
  
  // Инициализируем поиск при загрузке
  if (searchInput && searchInput.value) {
    filterProducts(searchInput.value);
  }
  
  console.log('Equipment page JavaScript loaded successfully!');
  
  // Добавляем обработчик для кнопок в модальном окне (если нужно отслеживать клики)
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('messenger-btn')) {
      const productTitle = document.getElementById('modalProductTitle').textContent;
      console.log(`Пользователь хочет купить: ${productTitle} через ${e.target.textContent.trim()}`);
    }
  });
});