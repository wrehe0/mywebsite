// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    initMobileMenu();
    initSearch();
    updateVisitorStats();
    initContactForm();
    initFAQ();
    loadBlogPosts();
    updateStats();
    setLastUpdate();
    initBlogSearch();
    initCategoryFilter();
    initNewsletter();
    animateCounters();
});

// Управление темой
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    const themeSwitcher = document.getElementById('theme-switcher');
    if (themeSwitcher) {
        updateThemeIcon(savedTheme);
        themeSwitcher.addEventListener('click', toggleTheme);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('#theme-switcher i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Мобильное меню
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
        
        // Закрытие меню при клике на ссылку
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
            });
        });
    }
}

// Поиск
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }
}

function performSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    
    if (query) {
        alert(`Поиск: "${query}"\nРезультаты поиска будут отображены на странице блога.`);
        searchInput.value = '';
        
        // Сохраняем поисковый запрос для использования на странице блога
        localStorage.setItem('searchQuery', query);
        
        // Перенаправляем на страницу блога
        if (!window.location.href.includes('blog.html')) {
            window.location.href = 'blog.html';
        }
    }
}

// Статистика посетителей
function updateVisitorStats() {
    let visitors = parseInt(localStorage.getItem('siteVisitors')) || 0;
    visitors++;
    localStorage.setItem('siteVisitors', visitors.toString());
    
    // Обновляем счетчик на главной странице
    const visitorsElement = document.getElementById('visitors-count');
    if (visitorsElement) {
        animateCounter(visitorsElement, visitors);
    }
}

// Форма обратной связи
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const messageDiv = document.getElementById('form-message');
    
    // Валидация формы
    if (!validateForm(formData)) {
        showMessage('Пожалуйста, заполните все обязательные поля правильно.', 'error', messageDiv);
        return;
    }
    
    // Имитация отправки
    setTimeout(() => {
        // Сохраняем контакт в localStorage
        saveContact(formData);
        
        // Показываем сообщение об успехе
        showMessage('Сообщение успешно отправлено! Я свяжусь с вами в ближайшее время.', 'success', messageDiv);
        
        // Очищаем форму
        e.target.reset();
        
        // Обновляем статистику
        updateContactStats();
    }, 1000);
}

function validateForm(formData) {
    const email = formData.get('email');
    const agreement = formData.get('agreement');
    
    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false;
    }
    
    // Проверка согласия
    if (!agreement) {
        return false;
    }
    
    return true;
}

function saveContact(formData) {
    const contact = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        newsletter: formData.get('newsletter') === 'on',
        date: new Date().toISOString()
    };
    
    let contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    contacts.push(contact);
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

function updateContactStats() {
    let contactCount = parseInt(localStorage.getItem('contactCount')) || 0;
    contactCount++;
    localStorage.setItem('contactCount', contactCount.toString());
}

function showMessage(text, type, element) {
    if (!element) return;
    
    element.textContent = text;
    element.className = `form-message ${type}`;
    element.style.display = 'block';
    
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

// FAQ
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = answer.classList.contains('active');
            
            // Закрываем все ответы
            document.querySelectorAll('.faq-answer').forEach(item => {
                item.classList.remove('active');
            });
            
            document.querySelectorAll('.faq-question i').forEach(icon => {
                icon.className = 'fas fa-chevron-down';
            });
            
            // Открываем текущий ответ, если он был закрыт
            if (!isActive) {
                answer.classList.add('active');
                question.querySelector('i').className = 'fas fa-chevron-up';
            }
        });
    });
}

// Блог - загрузка постов
function loadBlogPosts() {
    const postsContainer = document.getElementById('blog-posts-container');
    const popularPosts = document.getElementById('popular-posts');
    const tagsCloud = document.getElementById('tags-cloud');
    const archiveList = document.getElementById('archive-list');
    
    if (!postsContainer) return;
    
    const blogPosts = [
        {
            id: 1,
            title: "Мой первый проект на GitHub",
            excerpt: "Рассказываю о том, как создал свой первый репозиторий и выложил проект на GitHub Pages.",
            content: "Полный текст статьи о моем первом проекте на GitHub...",
            date: "2024-03-15",
            category: "projects",
            tags: ["GitHub", "Первый проект", "Веб-разработка"],
            readTime: "5 мин",
            views: 156
        },
        {
            id: 2,
            title: "Изучение адаптивного дизайна",
            excerpt: "Практические советы по созданию сайтов, которые хорошо выглядят на всех устройствах.",
            content: "Полный текст статьи об адаптивном дизайне...",
            date: "2024-03-10",
            category: "webdev",
            tags: ["CSS", "Адаптивность", "Дизайн"],
            readTime: "8 мин",
            views: 203
        },
        {
            id: 3,
            title: "Как эффективно учить JavaScript",
            excerpt: "Мой опыт и рекомендации по изучению JavaScript для начинающих.",
            content: "Полный текст статьи об изучении JavaScript...",
            date: "2024-03-05",
            category: "learning",
            tags: ["JavaScript", "Обучение", "Советы"],
            readTime: "6 мин",
            views: 189
        },
        {
            id: 4,
            title: "Git для начинающих",
            excerpt: "Базовые команды Git, которые должен знать каждый разработчик.",
            content: "Полный текст статьи о Git...",
            date: "2024-02-28",
            category: "tips",
            tags: ["Git", "Начинающим", "Команды"],
            readTime: "7 мин",
            views: 245
        },
        {
            id: 5,
            title: "Создание темной темы для сайта",
            excerpt: "Практическое руководство по реализации переключения тем на чистом CSS и JavaScript.",
            content: "Полный текст статьи о темной теме...",
            date: "2024-02-20",
            category: "webdev",
            tags: ["CSS", "JavaScript", "Темная тема"],
            readTime: "10 мин",
            views: 178
        }
    ];
    
    // Отображаем посты
    blogPosts.forEach(post => {
        const postElement = createPostElement(post);
        postsContainer.appendChild(postElement);
    });
    
    // Популярные посты
    if (popularPosts) {
        const popular = [...blogPosts].sort((a, b) => b.views - a.views).slice(0, 3);
        popular.forEach(post => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="#" data-post-id="${post.id}">
                    <strong>${post.title}</strong>
                    <span>${post.views} просмотров</span>
                </a>
            `;
            popularPosts.appendChild(li);
        });
    }
    
    // Облако тегов
    if (tagsCloud) {
        const allTags = blogPosts.flatMap(post => post.tags);
        const uniqueTags = [...new Set(allTags)];
        
        uniqueTags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'post-tag';
            tagElement.textContent = tag;
            tagElement.style.fontSize = `${Math.random() * 10 + 12}px`;
            tagElement.style.opacity = `${Math.random() * 0.5 + 0.5}`;
            tagsCloud.appendChild(tagElement);
        });
    }
    
    // Архив
    if (archiveList) {
        const archives = {};
        blogPosts.forEach(post => {
            const date = new Date(post.date);
            const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthName = date.toLocaleDateString('ru-RU', { month: 'long' });
            
            if (!archives[yearMonth]) {
                archives[yearMonth] = {
                    name: `${monthName} ${date.getFullYear()}`,
                    count: 0
                };
            }
            archives[yearMonth].count++;
        });
        
        Object.entries(archives).forEach(([key, value]) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <a href="#">
                    ${value.name}
                    <span>(${value.count})</span>
                </a>
            `;
            archiveList.appendChild(li);
        });
    }
    
    // Пагинация
    initPagination();
}

function createPostElement(post) {
    const article = document.createElement('article');
    article.className = 'post-card';
    article.setAttribute('data-category', post.category);
    
    const date = new Date(post.date);
    const formattedDate = date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    article.innerHTML = `
        <div class="post-meta">
            <span><i class="far fa-calendar"></i> ${formattedDate}</span>
            <span><i class="far fa-clock"></i> ${post.readTime}</span>
            <span class="post-category">${getCategoryName(post.category)}</span>
        </div>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <div class="post-tags">
            ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
        </div>
        <a href="#" class="read-more" data-post-id="${post.id}">
            Читать далее <i class="fas fa-arrow-right"></i>
        </a>
    `;
    
    return article;
}

function getCategoryName(category) {
    const categories = {
        'webdev': 'Веб-разработка',
        'learning': 'Обучение',
        'projects': 'Проекты',
        'tips': 'Советы'
    };
    return categories[category] || category;
}

// Статистика учебы
function updateStats() {
    const stats = {
        completedCourses: 8,
        codeHours: calculateCodeHours(),
        projectsCount: 12,
        studyDays: calculateStudyDays()
    };
    
    // Обновляем значения с анимацией
    Object.entries(stats).forEach(([key, value]) => {
        const element = document.getElementById(key);
        if (element) {
            animateCounter(element, value);
        }
    });
}

function calculateCodeHours() {
    // Примерный расчет часов программирования
    const startDate = new Date('2023-09-01');
    const today = new Date();
    const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    return Math.floor(daysDiff * 1.5); // В среднем 1.5 часа в день
}

function calculateStudyDays() {
    const startDate = new Date('2023-09-01');
    const today = new Date();
    return Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
}

// Анимация счетчиков
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
}

function animateCounters() {
    document.querySelectorAll('.stat-content h3').forEach(counter => {
        const target = parseInt(counter.textContent);
        if (!isNaN(target)) {
            animateCounter(counter, target);
        }
    });
}

// Поиск в блоге
function initBlogSearch() {
    const searchInput = document.getElementById('blog-search');
    const searchButton = document.getElementById('search-button');
    
    if (searchInput && searchButton) {
        searchButton.addEventListener('click', performBlogSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performBlogSearch();
        });
        
        // Загружаем сохраненный запрос
        const savedQuery = localStorage.getItem('searchQuery');
        if (savedQuery) {
            searchInput.value = savedQuery;
            performBlogSearch();
            localStorage.removeItem('searchQuery');
        }
    }
}

function performBlogSearch() {
    const searchInput = document.getElementById('blog-search');
    const query = searchInput.value.trim().toLowerCase();
    
    if (query) {
        const posts = document.querySelectorAll('.post-card');
        posts.forEach(post => {
            const title = post.querySelector('h3').textContent.toLowerCase();
            const excerpt = post.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(post.querySelectorAll('.post-tag'))
                .map(tag => tag.textContent.toLowerCase());
            
            const matches = title.includes(query) || 
                           excerpt.includes(query) || 
                           tags.some(tag => tag.includes(query));
            
            post.style.display = matches ? 'block' : 'none';
        });
    } else {
        // Показываем все посты, если запрос пустой
        document.querySelectorAll('.post-card').forEach(post => {
            post.style.display = 'block';
        });
    }
}

// Фильтрация по категориям
function initCategoryFilter() {
    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Удаляем активный класс у всех кнопок
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Добавляем активный класс текущей кнопке
            this.classList.add('active');
            
            // Фильтруем посты
            const category = this.getAttribute('data-filter');
            filterPosts(category);
        });
    });
}

function filterPosts(category) {
    const posts = document.querySelectorAll('.post-card');
    
    posts.forEach(post => {
        if (category === 'all' || post.getAttribute('data-category') === category) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
}

// Пагинация
function initPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const pages = 3; // Примерное количество страниц
    let html = '';
    
    for (let i = 1; i <= pages; i++) {
        html += `
            <button class="${i === 1 ? 'active' : ''}" data-page="${i}">
                ${i}
            </button>
        `;
    }
    
    pagination.innerHTML = html;
    
    // Обработчики для кнопок пагинации
    pagination.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            const page = parseInt(this.getAttribute('data-page'));
            
            // Обновляем активную кнопку
            pagination.querySelectorAll('button').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            // Загружаем посты для выбранной страницы
            loadPage(page);
        });
    });
}

function loadPage(page) {
    // Здесь можно реализовать загрузку постов для конкретной страницы
    console.log(`Загрузка страницы ${page}`);
}

// Подписка на рассылку
function initNewsletter() {
    const subscribeBtn = document.getElementById('subscribe-btn');
    const emailInput = document.getElementById('subscribe-email');
    
    if (subscribeBtn && emailInput) {
        subscribeBtn.addEventListener('click', () => {
            const email = emailInput.value.trim();
            
            if (!email || !validateEmail(email)) {
                alert('Пожалуйста, введите корректный email адрес.');
                return;
            }
            
            // Сохраняем подписку
            let subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
            if (!subscriptions.includes(email)) {
                subscriptions.push(email);
                localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
            }
            
            alert('Спасибо за подписку! Вы будете получать уведомления о новых статьях.');
            emailInput.value = '';
        });
    }
}

function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Дата последнего обновления
function setLastUpdate() {
    const lastUpdateElement = document.getElementById('last-update');
    if (lastUpdateElement) {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        lastUpdateElement.textContent = formattedDate;
    }
}

// Загрузка новостей на главную
function loadNews() {
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) return;
    
    const news = [
        {
            title: "Завершен курс по Git",
            date: "15 марта 2024",
            excerpt: "Успешно завершил курс по системе контроля версий Git."
        },
        {
            title: "Новый проект: Калькулятор",
            date: "10 марта 2024",
            excerpt: "Начал работу над интерактивным калькулятором на JavaScript."
        },
        {
            title: "Изучаю адаптивный дизайн",
            date: "5 марта 2024",
            excerpt: "Осваиваю техники создания адаптивных веб-сайтов."
        }
    ];
    
    news.forEach(item => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
            <h3>${item.title}</h3>
            <p class="news-date">${item.date}</p>
            <p>${item.excerpt}</p>
        `;
        newsContainer.appendChild(newsItem);
    });
}

// Запускаем загрузку новостей
loadNews();