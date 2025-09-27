// Global variables
let participants = JSON.parse(localStorage.getItem('participants')) || [];
let currentSlide = 0;
let carouselSlides = [];
let chatOpen = false;

// DOM elements
const elements = {
  registerForm: null,
  participantsGrid: null,
  participantsList: null,
  participantsCount: null,
  searchInput: null,
  searchModalInput: null,
  sorteosList: null,
  searchModalList: null,
  winnersGrid: null,
  carouselTrack: null,
  carouselDots: null,
  prevBtn: null,
  nextBtn: null,
  profileModal: null,
  searchModal: null,
  chatWidget: null,
  chatWindow: null,
  transactionsList: null,
  winnerResult: null
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
  initializeElements();
  setupEventListeners();
  initializeData();
  initializeCarousel();
  initializeFAQ();
  initializeStats();
  renderParticipants();
  renderWinners();
  renderSorteos();
  renderTransactions();
  updateParticipantsCount();
});

// Inicializa referencias a elementos del DOM usados por la app.
function initializeElements() {
  elements.registerForm = document.getElementById('registerForm');
  elements.participantsGrid = document.getElementById('grupoNumeros');
  elements.participantsList = document.getElementById('participantsList');
  elements.participantsCount = document.getElementById('participantsCount');
  elements.searchInput = document.getElementById('searchInput');
  elements.searchModalInput = document.getElementById('searchModalInput');
  elements.sorteosList = document.getElementById('sorteosList');
  elements.searchModalList = document.getElementById('searchModalList');
  elements.winnersGrid = document.getElementById('winners');
  elements.carouselTrack = document.getElementById('carouselTrack');
  elements.carouselDots = document.getElementById('carouselDots');
  elements.prevBtn = document.getElementById('prevBtn');
  elements.nextBtn = document.getElementById('nextBtn');
  elements.profileModal = document.getElementById('profileModal');
  elements.searchModal = document.getElementById('searchModal');
  elements.chatWidget = document.getElementById('chatWidget');
  elements.chatWindow = document.getElementById('chatWindow');
  elements.transactionsList = document.getElementById('transacciones');
  elements.winnerResult = document.getElementById('ganadorResultado');
}

// Registra listeners globales de la UI (formularios, modales, carrusel, chat, etc.).
function setupEventListeners() {
  // Registration form
  if (elements.registerForm) {
    elements.registerForm.addEventListener('submit', handleRegistration);
  }

  // Search functionality
  if (elements.searchInput) {
    elements.searchInput.addEventListener('input', handleSearch);
  }
  
  if (elements.searchModalInput) {
    elements.searchModalInput.addEventListener('input', handleModalSearch);
  }

  // Clear search
  const clearSearchBtn = document.getElementById('clearSearch');
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      elements.searchInput.value = '';
      handleSearch();
    });
  }

  // Modal controls
  setupModalListeners();

  // Carousel controls
  if (elements.prevBtn) elements.prevBtn.addEventListener('click', () => changeSlide(-1));
  if (elements.nextBtn) elements.nextBtn.addEventListener('click', () => changeSlide(1));

  // Admin controls
  const sortearBtn = document.getElementById('sortearGanador');
  if (sortearBtn) {
    sortearBtn.addEventListener('click', selectWinner);
  }

  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }

  // Newsletter form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterForm);
  }

  // Chat widget
  setupChatListeners();

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Scroll animations
  setupScrollAnimations();
}

// Configura los listeners y acciones de los modales (perfil, búsqueda y cierre por overlay).
function setupModalListeners() {
  // Profile modal
  const openProfileBtn = document.getElementById('openProfileBtn');
  const closeProfileBtn = document.getElementById('closeProfile');
  const saveProfileBtn = document.getElementById('saveProfile');

  if (openProfileBtn) {
    openProfileBtn.addEventListener('click', () => openModal('profileModal'));
  }
  if (closeProfileBtn) {
    closeProfileBtn.addEventListener('click', () => closeModal('profileModal'));
  }
  if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', saveProfile);
  }

  // Search modal
  const openSearchBtn = document.getElementById('openSearchBtn');
  const closeSearchBtn = document.getElementById('closeSearch');

  if (openSearchBtn) {
    openSearchBtn.addEventListener('click', () => openModal('searchModal'));
  }
  if (closeSearchBtn) {
    closeSearchBtn.addEventListener('click', () => closeModal('searchModal'));
  }

  // Close modals on overlay click
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-overlay')) {
        closeModal(modal.id);
      }
    });
  });

  // Profile image upload
  const profileUpload = document.getElementById('profileUpload');
  if (profileUpload) {
    profileUpload.addEventListener('change', handleProfileImageUpload);
  }
}

// Registra los listeners del widget de chat (abrir/cerrar, enviar y teclado).
function setupChatListeners() {
  const chatToggle = document.getElementById('chatToggle');
  const chatClose = document.getElementById('chatClose');
  const chatSend = document.getElementById('chatSend');
  const chatInput = document.getElementById('chatInput');

  if (chatToggle) {
    chatToggle.addEventListener('click', toggleChat);
  }
  if (chatClose) {
    chatClose.addEventListener('click', toggleChat);
  }
  if (chatSend) {
    chatSend.addEventListener('click', sendChatMessage);
  }
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendChatMessage();
      }
    });
  }
}

// Configura animaciones de aparición al hacer scroll usando IntersectionObserver.
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all sections
  document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'all 0.6s ease';
    observer.observe(section);
  });
}

// Inicializa datos de ejemplo para sorteos y ganadores (solo demostración/UI).
function initializeData() {
  // Sample lottery data
  window.lotteries = [
    {
      id: 1,
      name: 'Sorteo Express',
      status: 'open',
      participants: 18,
      maxParticipants: 25,
      prize: 250,
      endDate: '2025-01-25'
    },
    {
      id: 2,
      name: 'Sorteo Semanal',
      status: 'open',
      participants: 32,
      maxParticipants: 50,
      prize: 500,
      endDate: '2025-01-30'
    },
    {
      id: 3,
      name: 'Gran Premio',
      status: 'upcoming',
      participants: 0,
      maxParticipants: 200,
      prize: 2000,
      endDate: '2025-02-15'
    },
    {
      id: 4,
      name: 'Sorteo Premium',
      status: 'closed',
      participants: 100,
      maxParticipants: 100,
      prize: 1000,
      endDate: '2025-01-20'
    }
  ];

  // Sample winners data
  window.winners = [
    { name: 'María G.', prize: 500, date: '15 Ene 2025', avatar: '👩‍💼' },
    { name: 'Carlos R.', prize: 1000, date: '10 Ene 2025', avatar: '👨‍🔧' },
    { name: 'Ana L.', prize: 250, date: '05 Ene 2025', avatar: '👩‍🎓' },
    { name: 'Luis M.', prize: 750, date: '01 Ene 2025', avatar: '👨‍💻' }
  ];
}

// Configura el carrusel (slides, dots) y el auto-avance.
function initializeCarousel() {
  carouselSlides = [
    {
      icon: '🎯',
      title: 'Sorteo en Curso',
      description: 'Sorteo Semanal - 32/50 participantes',
      status: 'Activo',
      type: 'active'
    },
    {
      icon: '⏰',
      title: 'Próximo Sorteo',
      description: 'Gran Premio - Inicia 15 Feb',
      status: 'Próximo',
      type: 'pending'
    },
    {
      icon: '✅',
      title: 'Sorteo Completado',
      description: 'Sorteo Express - Ganador: María G.',
      status: 'Completado',
      type: 'completed'
    }
  ];

  renderCarousel();
  createCarouselDots();
  
  // Auto-advance carousel
  setInterval(() => {
    changeSlide(1);
  }, 5000);
}

// Renderiza el contenido visual de cada slide en el carrusel.
function renderCarousel() {
  if (!elements.carouselTrack) return;

  elements.carouselTrack.innerHTML = carouselSlides.map((slide, index) => `
    <div class="carousel-slide">
      <div class="activity-card">
        <div class="activity-icon ${slide.type}">
          ${slide.icon}
        </div>
        <h3>${slide.title}</h3>
        <p>${slide.description}</p>
        <div class="activity-status">${slide.status}</div>
      </div>
    </div>
  `).join('');
}

// Crea y actualiza los indicadores (dots) del carrusel.
function createCarouselDots() {
  if (!elements.carouselDots) return;

  elements.carouselDots.innerHTML = carouselSlides.map((_, index) => `
    <div class="carousel-dot ${index === currentSlide ? 'active' : ''}" onclick="goToSlide(${index})"></div>
  `).join('');
}

// Cambia de slide en base a la dirección y hace wrap cuando llega al extremo.
function changeSlide(direction) {
  if (!elements.carouselTrack) return;

  currentSlide += direction;
  if (currentSlide >= carouselSlides.length) currentSlide = 0;
  if (currentSlide < 0) currentSlide = carouselSlides.length - 1;

  const translateX = -currentSlide * 100;
  elements.carouselTrack.style.transform = `translateX(${translateX}%)`;
  
  updateCarouselDots();
}

// Navega directamente al índice de slide indicado.
function goToSlide(slideIndex) {
  if (!elements.carouselTrack) return;

  currentSlide = slideIndex;
  const translateX = -currentSlide * 100;
  elements.carouselTrack.style.transform = `translateX(${translateX}%)`;
  
  updateCarouselDots();
}

function updateCarouselDots() {
  if (!elements.carouselDots) return;

  const dots = elements.carouselDots.querySelectorAll('.carousel-dot');
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

// Despliegue/oculta respuestas en la sección de preguntas frecuentes.
function initializeFAQ() {
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
      const faqItem = this.parentElement;
      const answer = faqItem.querySelector('.faq-answer');
      const isActive = this.classList.contains('active');

      // Close all FAQ items
      document.querySelectorAll('.faq-question').forEach(q => q.classList.remove('active'));
      document.querySelectorAll('.faq-answer').forEach(a => a.classList.remove('active'));

      // Toggle current item
      if (!isActive) {
        this.classList.add('active');
        answer.classList.add('active');
      }
    });
  });
}

// Anima contadores de estadísticas con prefijo/sufijo (p. ej. $, %).
function initializeStats() {
  // Animate stats counters
  const statElements = {
    participants: document.getElementById('statParticipants'),
    raised: document.getElementById('statRaised'),
    prizes: document.getElementById('statPrizes'),
    success: document.getElementById('statSuccess')
  };

  const stats = {
    participants: 1247,
    raised: 24500,
    prizes: 89,
    success: 99.9
  };

  Object.keys(statElements).forEach(key => {
    const element = statElements[key];
    if (element) {
      animateCounter(element, stats[key], key === 'raised' ? '$' : '', key === 'success' ? '%' : '');
    }
  });
}

// Anima numéricamente un elemento hasta el valor objetivo.
function animateCounter(element, target, prefix = '', suffix = '') {
  let current = 0;
  const increment = target / 100;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = `${prefix}${Math.floor(current).toLocaleString()}${suffix}`;
  }, 20);
}

// Maneja el registro de participantes: valida, persiste y actualiza UI.
function handleRegistration(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const participant = {
    id: Date.now().toString(),
    name: formData.get('nombre'),
    age: parseInt(formData.get('edad')),
    email: formData.get('correo'),
    cardDigits: formData.get('tarjeta'),
    timestamp: Date.now(),
    amount: 10
  };

  // Validate participant
  if (participants.length >= 50) {
    showNotification('El sorteo está lleno. Máximo 50 participantes.', 'error');
    return;
  }

  if (participants.some(p => p.email === participant.email)) {
    showNotification('Este correo ya está registrado.', 'error');
    return;
  }

  participants.push(participant);
  localStorage.setItem('participants', JSON.stringify(participants));
  
  // Add transaction
  addTransaction(`Registro de ${participant.name}`, participant.amount);
  
  // Re-render components
  renderParticipants();
  updateParticipantsCount();
  renderTransactions();
  
  // Reset form
  e.target.reset();
  
  showNotification('¡Registro exitoso! Has sido añadido al sorteo.', 'success');
}

// Dibuja el estado del grid y la lista de participantes registrados.
function renderParticipants() {
  // Render participants grid
  if (elements.participantsGrid) {
    elements.participantsGrid.innerHTML = '';
    
    for (let i = 0; i < 50; i++) {
      const slot = document.createElement('div');
      slot.className = `participant-slot ${i < participants.length ? 'filled' : 'empty'}`;
      slot.textContent = i + 1;
      elements.participantsGrid.appendChild(slot);
    }
  }

  // Render participants list
  if (elements.participantsList && participants.length > 0) {
    elements.participantsList.innerHTML = `
      <h3 style="color: white; margin-bottom: 1rem;">Participantes Registrados:</h3>
      ${participants.map(participant => `
        <div class="participant-item">
          <span class="participant-name">${participant.name}</span>
          <span class="participant-card">****${participant.cardDigits}</span>
        </div>
      `).join('')}
    `;
  }
}

function updateParticipantsCount() {
  if (elements.participantsCount) {
    elements.participantsCount.textContent = participants.length;
  }
}

// Renderiza la lista de sorteos aplicando filtro por término de búsqueda.
function renderSorteos() {
  if (!elements.sorteosList || !window.lotteries) return;

  const filteredLotteries = window.lotteries.filter(lottery => {
    const searchTerm = elements.searchInput?.value.toLowerCase() || '';
    return lottery.name.toLowerCase().includes(searchTerm) ||
           lottery.status.toLowerCase().includes(searchTerm);
  });

  elements.sorteosList.innerHTML = filteredLotteries.map(lottery => `
    <div class="sorteo-item">
      <div class="sorteo-info">
        <h3>${lottery.name}</h3>
        <p>${lottery.participants}/${lottery.maxParticipants} participantes</p>
      </div>
      <div class="sorteo-meta">
        <div class="sorteo-prize">$${lottery.prize}</div>
        <div class="sorteo-status ${lottery.status}">
          ${lottery.status === 'open' ? 'Abierto' :
            lottery.status === 'upcoming' ? 'Próximo' : 'Cerrado'}
        </div>
      </div>
    </div>
  `).join('');
}

// Renderiza tarjetas de ganadores recientes.
function renderWinners() {
  if (!elements.winnersGrid || !window.winners) return;

  elements.winnersGrid.innerHTML = window.winners.map(winner => `
    <div class="winner-card">
      <div class="winner-avatar">${winner.avatar}</div>
      <h4>${winner.name}</h4>
      <div class="winner-prize">$${winner.prize}</div>
      <div class="winner-date">${winner.date}</div>
    </div>
  `).join('');
}

// Muestra últimas transacciones (máx. 10) desde localStorage.
function renderTransactions() {
  if (!elements.transactionsList) return;

  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  
  elements.transactionsList.innerHTML = transactions.length > 0 ?
    transactions.slice(-10).reverse().map(transaction => `
      <div class="transaction-item">
        <span class="transaction-info">${transaction.description}</span>
        <span class="transaction-amount">+$${transaction.amount}</span>
      </div>
    `).join('') : 
    '<p style="color: var(--color-light-text);">No hay transacciones aún.</p>';
}

// Registra una transacción en localStorage con timestamp.
function addTransaction(description, amount) {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  transactions.push({
    id: Date.now(),
    description,
    amount,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function handleSearch() {
  renderSorteos();
}

// Busca sorteos en el modal por nombre/estado y actualiza resultados.
function handleModalSearch() {
  if (!elements.searchModalList || !window.lotteries) return;

  const searchTerm = elements.searchModalInput.value.toLowerCase();
  const filteredLotteries = window.lotteries.filter(lottery =>
    lottery.name.toLowerCase().includes(searchTerm) ||
    lottery.status.toLowerCase().includes(searchTerm)
  );

  elements.searchModalList.innerHTML = filteredLotteries.map(lottery => `
    <div class="sorteo-item">
      <div class="sorteo-info">
        <h3>${lottery.name}</h3>
        <p>${lottery.participants}/${lottery.maxParticipants} participantes</p>
      </div>
      <div class="sorteo-meta">
        <div class="sorteo-prize">$${lottery.prize}</div>
        <div class="sorteo-status ${lottery.status}">
          ${lottery.status === 'open' ? 'Abierto' :
            lottery.status === 'upcoming' ? 'Próximo' : 'Cerrado'}
        </div>
      </div>
    </div>
  `).join('');
}

// Selecciona un ganador al azar, actualiza historial y muestra anuncio.
function selectWinner() {
  if (participants.length === 0) {
    showNotification('No hay participantes registrados.', 'error');
    return;
  }

  const randomIndex = Math.floor(Math.random() * participants.length);
  const winner = participants[randomIndex];
  
  if (elements.winnerResult) {
    elements.winnerResult.innerHTML = `
      <div class="winner-announcement">
        🎉 ¡Ganador: ${winner.name}! 🎉
      </div>
    `;
  }

  // Add transaction for prize
  addTransaction(`Premio ganado por ${winner.name}`, 500);
  renderTransactions();
  
  showNotification(`¡${winner.name} ha ganado el sorteo!`, 'success');
  
  // Add winner to winners list
  window.winners.unshift({
    name: winner.name,
    prize: 500,
    date: new Date().toLocaleDateString('es-ES'),
    avatar: '🏆'
  });
  renderWinners();
}

// Abre un modal por id y administra el foco del primer input.
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    const firstInput = modal.querySelector('input, textarea');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }
  }
}

// Cierra un modal por id y restaura el scroll del body.
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
  }
}




// Valida y guarda perfil de usuario en localStorage.
function saveProfile() {
  const name = document.getElementById('profileName').value;
  const email = document.getElementById('profileEmail').value;
  const imagePreview = document.getElementById('profileImagePreview');
  
  if (!name || !email) {
    showNotification('Por favor completa todos los campos.', 'error');
    return;
  }
  
  // Guardar imagen si existe
  let image = '';
  if (imagePreview && imagePreview.style.backgroundImage) {
    // extraemos la URL sin url("") 
    image = imagePreview.style.backgroundImage.slice(5, -2);
  }
  
  // Guardar perfil completo
  const profile = { name, email, image };
  localStorage.setItem('userProfile', JSON.stringify(profile));
  
  showNotification('Perfil guardado exitosamente.', 'success');
  closeModal('profileModal');
}

// Carga una imagen local y la muestra como preview en el perfil.
function handleProfileImageUpload(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const preview = document.getElementById('profileImagePreview');
      if (preview) {
        preview.style.backgroundImage = `url(${event.target.result})`;
        preview.style.backgroundSize = 'cover';
        preview.style.backgroundPosition = 'center';
        preview.textContent = '';
      }
    };
    reader.readAsDataURL(file);
  }
}

// Cargar perfil al iniciar la página
function loadProfile() {
  const profile = JSON.parse(localStorage.getItem('userProfile'));
  if (profile) {
    document.getElementById('profileName').value = profile.name || '';
    document.getElementById('profileEmail').value = profile.email || '';
    
    if (profile.image) {
      const preview = document.getElementById('profileImagePreview');
      preview.style.backgroundImage = `url(${profile.image})`;
      preview.style.backgroundSize = 'cover';
      preview.style.backgroundPosition = 'center';
      preview.textContent = '';
    }
  }
}

// Ejecutar al cargar la página
window.addEventListener('DOMContentLoaded', loadProfile);












 let selectedStars = 0;

  // Selección de estrellas
  document.querySelectorAll('.stars-input .star').forEach(star => {
    star.addEventListener('click', () => {
      selectedStars = star.dataset.value;
      document.querySelectorAll('.stars-input .star').forEach(s => {
        s.classList.toggle('selected', s.dataset.value <= selectedStars);
      });
    });
  });

  // Función para cargar testimonios
  function loadTestimonials() {
    const testimonials = JSON.parse(localStorage.getItem('userTestimonials')) || [];
    const grid = document.getElementById('testimonialsGrid');
    grid.innerHTML = ''; // Limpiar antes de agregar
    testimonials.forEach(t => {
      const div = document.createElement('div');
      div.classList.add('testimonial-card');
      div.innerHTML = `
        <div class="testimonial-rating">
          ${'★'.repeat(t.stars)}${'★'.repeat(5 - t.stars)}
        </div>
        <p>${t.text}</p>
        <div class="testimonial-author">
          <div class="author-avatar">${t.image || '👤'}</div>
          <div>
            <h4>${t.name}</h4>
            <span>${t.date}</span>
          </div>
        </div>
      `;
      grid.appendChild(div);
    });
  }

  // Enviar opinión
  document.getElementById('submitTestimonial').addEventListener('click', () => {
    const text = document.getElementById('testimonialText').value;
    if (!text || selectedStars === 0) {
      alert('Por favor, escribe tu opinión y selecciona estrellas.');
      return;
    }

    // Obtener perfil del usuario
    const profile = JSON.parse(localStorage.getItem('userProfile')) || {};
    const testimonial = {
      name: profile.name || 'Anonimo',
      image: profile.image ? `<img src="${profile.image}" alt="${profile.name}" style="width:50px;height:50px;border-radius:50%;">` : '👤',
      text,
      stars: parseInt(selectedStars),
      date: new Date().toLocaleDateString()
    };

    // Guardar en localStorage
    const testimonials = JSON.parse(localStorage.getItem('userTestimonials')) || [];
    testimonials.push(testimonial);
    localStorage.setItem('userTestimonials', JSON.stringify(testimonials));

    // Limpiar formulario
    document.getElementById('testimonialText').value = '';
    selectedStars = 0;
    document.querySelectorAll('.stars-input .star').forEach(s => s.classList.remove('selected'));

    loadTestimonials();
  });

  // Cargar testimonios al iniciar
  window.addEventListener('DOMContentLoaded', loadTestimonials);



// Abre/cierra el chat, oculta badge y enfoca el input al abrir.
function toggleChat() {
  if (elements.chatWindow) {
    chatOpen = !chatOpen;
    elements.chatWindow.classList.toggle('show', chatOpen);
    
    if (chatOpen) {
      // Remove notification badge
      const badge = document.querySelector('.chat-badge');
      if (badge) badge.style.display = 'none';
      
      // Focus input
      const input = document.getElementById('chatInput');
      if (input) setTimeout(() => input.focus(), 100);
    }
  }
}

// Envía el mensaje del usuario y simula una respuesta del bot.
function sendChatMessage() {
  const input = document.getElementById('chatInput');
  if (!input || !input.value.trim()) return;

  const message = input.value.trim();
  const messagesContainer = document.querySelector('.chat-messages');
  
  if (messagesContainer) {
    // Add user message
    messagesContainer.innerHTML += `
      <div class="chat-message user" style="flex-direction: row-reverse;">
        <div class="message-avatar" style="background: var(--gradient-secondary);">👤</div>
        <div class="message-content" style="background: var(--gradient-secondary); margin-left: 0; margin-right: var(--spacing-sm);">
          <p>${message}</p>
        </div>
      </div>
    `;
    
    // Auto-scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Clear input
    input.value = '';
    
    // Simulate bot response
    setTimeout(() => {
      const responses = [
        'Gracias por tu mensaje. Te ayudo en un momento.',
        '¿En qué puedo asistirte con los sorteos?',
        'Nuestro equipo te responderá pronto.',
        '¿Tienes alguna pregunta sobre cómo participar?'
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      messagesContainer.innerHTML += `
        <div class="chat-message bot">
          <div class="message-avatar">🤖</div>
          <div class="message-content">
            <p>${response}</p>
          </div>
        </div>
      `;
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
  }
}

// Maneja el envío de contacto: valida, notifica y resetea.
function handleContactForm(e) {
  e.preventDefault();
  
  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const message = document.getElementById('contactMsg').value;
  
  if (!name || !email || !message) {
    showNotification('Por favor completa todos los campos.', 'error');
    return;
  }
  
  // Simulate form submission
  setTimeout(() => {
    showNotification('Mensaje enviado exitosamente. Te contactaremos pronto.', 'success');
    e.target.reset();
  }, 500);
}

// Maneja suscripción a newsletter (simulado) y resetea el formulario.
function handleNewsletterForm(e) {
  e.preventDefault();
  
  const email = e.target.querySelector('input[type="email"]').value;
  
  if (!email) {
    showNotification('Por favor ingresa un email válido.', 'error');
    return;
  }
  
  // Simulate subscription
  setTimeout(() => {
    showNotification('¡Suscripción exitosa! Te mantendremos informado.', 'success');
    e.target.reset();
  }, 500);
}

// Muestra una notificación temporal con estilos según el tipo.
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    max-width: 350px;
    box-shadow: var(--shadow-lg);
    animation: slideIn 0.3s ease;
  `;
  
  // Set background based on type
  const backgrounds = {
    success: 'var(--gradient-success)',
    error: 'var(--gradient-warning)',
    info: 'var(--gradient-primary)'
  };
  
  notification.style.background = backgrounds[type] || backgrounds.info;
  notification.textContent = message;
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`;
document.head.appendChild(notificationStyles);

// Load saved profile data
window.addEventListener('load', () => {
  const savedProfile = localStorage.getItem('userProfile');
  if (savedProfile) {
    const profile = JSON.parse(savedProfile);
    const nameInput = document.getElementById('profileName');
    const emailInput = document.getElementById('profileEmail');
    
    if (nameInput) nameInput.value = profile.name || '';
    if (emailInput) emailInput.value = profile.email || '';
  }
});

// Export functions for global access
window.goToSlide = goToSlide;





// Variables globales
let terminosAceptados = false;

// Elementos del DOM
const formulario = document.getElementById('formularioRegistro');
const modalTerminos = document.getElementById('modalTerminos');
const modalExito = document.getElementById('modalExito');
const botonEnvio = document.getElementById('botonEnvio');
const spinner = document.getElementById('spinner');

// Campos del formulario
const campos = {
    nombre: document.getElementById('nombre'),
    edad: document.getElementById('edad'),
    tarjeta: document.getElementById('tarjeta'),
    fechaVencimiento: document.getElementById('fechaVencimiento'),
    codigoSeguridad: document.getElementById('codigoSeguridad')
};

// Contenedores de errores
const errores = {
    nombre: document.getElementById('error-nombre'),
    edad: document.getElementById('error-edad'),
    tarjeta: document.getElementById('error-tarjeta'),
    fechaVencimiento: document.getElementById('error-fechaVencimiento'),
    codigoSeguridad: document.getElementById('error-codigoSeguridad')
};

// Funciones de validación
function validarNombre(nombre) {
    if (!nombre.trim()) {
        return 'El nombre es requerido';
    }
    if (nombre.trim().length < 2) {
        return 'El nombre debe tener al menos 2 caracteres';
    }
    return null;
}

function validarEdad(edad) {
    if (!edad) {
        return 'La edad es requerida';
    }
    const edadNum = parseInt(edad);
    if (edadNum < 18) {
        return 'Debes ser mayor de 18 años';
    }
    if (edadNum > 120) {
        return 'Edad inválida';
    }
    return null;
}

function validarTarjeta(tarjeta) {
    if (!tarjeta) {
        return 'El número de tarjeta es requerido';
    }
    const soloNumeros = tarjeta.replace(/\s/g, '');
    if (!/^\d{16}$/.test(soloNumeros)) {
        return 'El número de tarjeta debe tener 16 dígitos';
    }
    return null;
}

function validarFechaVencimiento(fecha) {
    if (!fecha) {
        return 'La fecha de vencimiento es requerida';
    }
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(fecha)) {
        return 'Formato inválido (MM/AA)';
    }
    return null;
}

function validarCodigoSeguridad(codigo) {
    if (!codigo) {
        return 'El código de seguridad es requerido';
    }
    if (!/^\d{3,4}$/.test(codigo)) {
        return 'Debe tener 3 o 4 dígitos';
    }
    return null;
}

// Funciones de formateo
function formatearNumeroTarjeta(valor) {
    const soloNumeros = valor.replace(/\D/g, '');
    return soloNumeros.replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
}

function formatearFechaVencimiento(valor) {
    const soloNumeros = valor.replace(/\D/g, '');
    if (soloNumeros.length >= 2) {
        return soloNumeros.slice(0, 2) + '/' + soloNumeros.slice(2, 4);
    }
    return soloNumeros;
}

// Función para mostrar/ocultar errores
function mostrarError(campo, mensaje) {
    errores[campo].textContent = mensaje || '';
    if (mensaje) {
        campos[campo].classList.add('error');
        errores[campo].classList.add('animacion-aparecer');
    } else {
        campos[campo].classList.remove('error');
    }
}

// Función para validar todo el formulario
function validarFormulario() {
    const validaciones = {
        nombre: validarNombre(campos.nombre.value),
        edad: validarEdad(campos.edad.value),
        tarjeta: validarTarjeta(campos.tarjeta.value),
        fechaVencimiento: validarFechaVencimiento(campos.fechaVencimiento.value),
        codigoSeguridad: validarCodigoSeguridad(campos.codigoSeguridad.value)
    };

    let hayErrores = false;
    
    Object.keys(validaciones).forEach(campo => {
        const error = validaciones[campo];
        mostrarError(campo, error);
        if (error) hayErrores = true;
    });

    return !hayErrores;
}

// Función para mostrar modal
function mostrarModal(modal) {
    modal.classList.add('activo');
    document.body.style.overflow = 'hidden';
}

// Función para ocultar modal
function ocultarModal(modal) {
    modal.classList.remove('activo');
    document.body.style.overflow = '';
}

// Función para limpiar formulario
function limpiarFormulario() {
    Object.keys(campos).forEach(campo => {
        campos[campo].value = '';
        mostrarError(campo, null);
    });
}

// Función para simular envío
function simularEnvio() {
    botonEnvio.disabled = true;
    botonEnvio.classList.add('enviando');
    
    setTimeout(() => {
        botonEnvio.disabled = false;
        botonEnvio.classList.remove('enviando');
        mostrarModal(modalExito);
        limpiarFormulario();
    }, 2000);
}

// Event listeners para formateo en tiempo real
campos.tarjeta.addEventListener('input', function(e) {
    e.target.value = formatearNumeroTarjeta(e.target.value);
});

campos.fechaVencimiento.addEventListener('input', function(e) {
    e.target.value = formatearFechaVencimiento(e.target.value);
});

campos.codigoSeguridad.addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
});

// Event listeners para validación en tiempo real
Object.keys(campos).forEach(campo => {
    campos[campo].addEventListener('blur', function() {
        let error = null;
        
        switch(campo) {
            case 'nombre':
                error = validarNombre(this.value);
                break;
            case 'edad':
                error = validarEdad(this.value);
                break;
            case 'tarjeta':
                error = validarTarjeta(this.value);
                break;
            case 'fechaVencimiento':
                error = validarFechaVencimiento(this.value);
                break;
            case 'codigoSeguridad':
                error = validarCodigoSeguridad(this.value);
                break;
        }
        
        mostrarError(campo, error);
    });
    
    // Limpiar error al escribir
    campos[campo].addEventListener('input', function() {
        if (errores[campo].textContent) {
            mostrarError(campo, null);
        }
    });
});

// Event listener para el formulario
formulario.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!validarFormulario()) {
        return;
    }
    
    if (!terminosAceptados) {
        mostrarModal(modalTerminos);
        return;
    }
    
    simularEnvio();
});

// Event listeners para el modal de términos
document.getElementById('cerrarTerminos').addEventListener('click', function() {
    ocultarModal(modalTerminos);
});

document.getElementById('cancelarTerminos').addEventListener('click', function() {
    ocultarModal(modalTerminos);
});

document.getElementById('aceptarTerminos').addEventListener('click', function() {
    terminosAceptados = true;
    ocultarModal(modalTerminos);
    simularEnvio();
});

// Event listener para el modal de éxito
document.getElementById('cerrarExito').addEventListener('click', function() {
    ocultarModal(modalExito);
});

// Event listener para cerrar modales al hacer clic fuera
[modalTerminos, modalExito].forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            ocultarModal(modal);
        }
    });
});

// Event listener para cerrar modales con Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (modalTerminos.classList.contains('activo')) {
            ocultarModal(modalTerminos);
        }
        if (modalExito.classList.contains('activo')) {
            ocultarModal(modalExito);
        }
    }
});

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    console.log('Formulario de registro cargado correctamente');
});











class SorteoSystem {
    constructor() {
        this.rooms = [];
        this.currentRoom = null;
        this.currentParticipant = null;
        this.participants = [];
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadData();
        this.updateUI();
        this.setMinDateTime();
        this.setupFormValidation();
    }

    bindEvents() {
        // Form submission
        document.getElementById('createRoomForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createRoom();
        });

        // Modal events
        document.getElementById('viewRoomsBtn').addEventListener('click', () => {
            this.showRoomsModal();
        });

        document.getElementById('joinRoomBtn').addEventListener('click', () => {
            this.showRoomsModal();
        });

        document.getElementById('viewRoomsBtn2').addEventListener('click', () => {
            this.showRoomsModal();
        });

        document.getElementById('closeModalBtn').addEventListener('click', () => {
            this.hideRoomsModal();
        });

        // Room actions
        document.getElementById('selectWinnerBtn').addEventListener('click', () => {
            this.selectWinner();
        });

        document.getElementById('leaveRoomBtn').addEventListener('click', () => {
            this.leaveRoom();
        });

        // Winner overlay
        document.getElementById('closeWinnerBtn').addEventListener('click', () => {
            this.hideWinnerOverlay();
        });

        // Registration modal events
        document.getElementById('closeRegistrationBtn').addEventListener('click', () => {
            this.hideRegistrationModal();
        });

        document.getElementById('formularioRegistro').addEventListener('submit', (e) => {
            e.preventDefault();
            this.processRegistration();
        });

        // Modal backdrop click
        document.getElementById('roomsModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('roomsModal')) {
                this.hideRoomsModal();
            }
        });

        document.getElementById('registrationModal').addEventListener('click', (e) => {
            if (e.target === document.getElementById('registrationModal')) {
                this.hideRegistrationModal();
            }
        });
    }

    setMinDateTime() {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 10); // Minimum 10 minutes from now
        const minDateTime = now.toISOString().slice(0, 16);
        document.getElementById('closingDate').min = minDateTime;
    }

    createRoom() {
        const formData = new FormData(document.getElementById('createRoomForm'));
        const roomData = {
            id: Date.now(),
            name: formData.get('roomName') || document.getElementById('roomName').value,
            maxParticipants: parseInt(formData.get('maxParticipants') || document.getElementById('maxParticipants').value),
            amount: parseFloat(formData.get('roomAmount') || document.getElementById('roomAmount').value),
            closingDate: formData.get('closingDate') || document.getElementById('closingDate').value,
            participants: [],
            winner: null,
            status: 'active',
            createdAt: new Date().toISOString()
        };

        // Validate closing date
        const closingDate = new Date(roomData.closingDate);
        const now = new Date();
        
        if (closingDate <= now) {
            this.showToast('Error', 'La fecha de cierre debe ser en el futuro', 'error');
            return;
        }

        this.rooms.push(roomData);
        this.saveData();
        this.showToast('Éxito', `Sala "${roomData.name}" creada exitosamente`, 'success');
        
        // Reset form
        document.getElementById('createRoomForm').reset();
        this.setMinDateTime();
    }

    showRoomsModal() {
        this.renderRooms();
        document.getElementById('roomsModal').classList.add('show');
    }

    hideRoomsModal() {
        document.getElementById('roomsModal').classList.remove('show');
    }

    renderRooms() {
        const roomsList = document.getElementById('roomsList');
        
        if (this.rooms.length === 0) {
            roomsList.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <i class="fas fa-inbox" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    <p>No hay sorteos disponibles</p>
                    <p style="font-size: 0.9rem; margin-top: 0.5rem;">Crea uno desde el panel de administración</p>
                </div>
            `;
            return;
        }

        const activeRooms = this.rooms.filter(room => room.status === 'active');
        
        roomsList.innerHTML = activeRooms.map(room => {
            const isFull = room.participants.length >= room.maxParticipants;
            const isCurrentRoom = this.currentRoom && this.currentRoom.id === room.id;
            const closingDate = new Date(room.closingDate);
            const isExpired = closingDate <= new Date();
            
            let statusClass = 'active';
            let statusText = 'Activo';
            
            if (isExpired) {
                statusClass = 'closed';
                statusText = 'Cerrado';
            } else if (isFull) {
                statusClass = 'full';
                statusText = 'Lleno';
            }

            return `
                <div class="room-item ${isFull || isExpired ? 'full' : ''}" 
                     onclick="${!isExpired && !isCurrentRoom ? `sorteoSystem.showRegistrationModal(${room.id})` : ''}"
                     ${isCurrentRoom ? 'style="border: 2px solid #4facfe;"' : ''}>
                    <div class="room-header">
                        <div>
                            <div class="room-name">
                                ${room.name}
                                ${isCurrentRoom ? '<i class="fas fa-check-circle" style="color: #4facfe; margin-left: 0.5rem;"></i>' : ''}
                            </div>
                            <div style="font-size: 0.9rem; color: var(--text-secondary);">
                                Creado ${this.formatDateTime(room.createdAt)}
                            </div>
                        </div>
                        <div class="room-status ${statusClass}">${statusText}</div>
                    </div>
                    <div class="room-details">
                        <div class="room-detail">
                            <i class="fas fa-users"></i>
                            <span>${room.participants.length}/${room.maxParticipants} participantes</span>
                        </div>
                        <div class="room-detail">
                            <i class="fas fa-dollar-sign"></i>
                            <span>$${room.amount}</span>
                        </div>
                        <div class="room-detail">
                            <i class="fas fa-calendar-alt"></i>
                            <span>${this.formatDate(room.closingDate)}</span>
                        </div>
                        <div class="room-detail">
                            <i class="fas fa-clock"></i>
                            <span>${this.formatTime(room.closingDate)}</span>
                        </div>
                    </div>
                    ${isCurrentRoom ? '<div style="text-align: center; margin-top: 1rem; color: #4facfe; font-weight: 600;"><i class="fas fa-info-circle"></i> Sala actual</div>' : ''}
                </div>
            `;
        }).join('');
    }

    showRegistrationModal(roomId) {
        const room = this.rooms.find(r => r.id === roomId);
        if (!room) return;

        // Check if room is expired
        const closingDate = new Date(room.closingDate);
        if (closingDate <= new Date()) {
            this.showToast('Error', 'Esta sala ya está cerrada', 'error');
            return;
        }

        this.selectedRoomId = roomId;
        document.getElementById('roomNameInForm').textContent = room.name;
        document.getElementById('roomAmountInForm').textContent = room.amount;
        
        // Reset form
        document.getElementById('formularioRegistro').reset();
        this.clearFormErrors();
        
        document.getElementById('registrationModal').classList.add('show');
        this.hideRoomsModal();
    }

    hideRegistrationModal() {
        document.getElementById('registrationModal').classList.remove('show');
    }

    processRegistration() {
        if (!this.validateForm()) {
            return;
        }

        const room = this.rooms.find(r => r.id === this.selectedRoomId);
        if (!room) return;

        // Check if room is full
        if (room.participants.length >= room.maxParticipants) {
            this.showToast('Error', 'Esta sala está llena', 'error');
            this.hideRegistrationModal();
            return;
        }

        // Show loading state
        const submitBtn = document.getElementById('botonEnvio');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate payment processing
        setTimeout(() => {
            this.joinRoom(this.selectedRoomId);
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            this.hideRegistrationModal();
        }, 2000);
    }

    joinRoom(roomId) {
        const room = this.rooms.find(r => r.id === roomId);
        if (!room) return;

        // Leave current room if any
        if (this.currentRoom) {
            this.leaveRoom(false);
        }

        // Find next available slot
        let participantNumber = 1;
        const occupiedNumbers = room.participants.map(p => p.number);
        while (occupiedNumbers.includes(participantNumber)) {
            participantNumber++;
        }

        const participant = {
            number: participantNumber,
            name: document.getElementById('nombre')?.value || `Participante ${participantNumber}`,
            age: document.getElementById('edad')?.value || '',
            joinedAt: new Date().toISOString()
        };

        room.participants.push(participant);
        this.currentRoom = room;
        this.currentParticipant = participant;
        this.participants = room.participants;

        this.saveData();
        this.updateUI();
        this.showToast('Éxito', `Te has unido a "${room.name}" como participante #${participantNumber}`, 'success');

        // Check if room is now full and auto-select winner
        if (room.participants.length >= room.maxParticipants) {
            setTimeout(() => {
                this.showToast('Info', 'La sala está llena. Seleccionando ganador automáticamente...', 'warning');
                setTimeout(() => {
                    this.selectWinner();
                }, 2000);
            }, 1000);
        }
    }

    leaveRoom(showToast = true) {
        if (!this.currentRoom || !this.currentParticipant) return;

        const room = this.rooms.find(r => r.id === this.currentRoom.id);
        if (room) {
            room.participants = room.participants.filter(p => p.number !== this.currentParticipant.number);
        }

        this.currentRoom = null;
        this.currentParticipant = null;
        this.participants = [];

        this.saveData();
        this.updateUI();

        if (showToast) {
            this.showToast('Info', 'Has salido del grupo', 'warning');
        }
    }

    selectWinner() {
        if (!this.currentRoom || this.participants.length === 0 || this.isAnimating) return;

        this.isAnimating = true;
        const slots = document.querySelectorAll('.participant-slot.occupied');
        const participantNumbers = this.participants.map(p => p.number);
        
        // Disable button during animation
        document.getElementById('selectWinnerBtn').disabled = true;
        
        let animationSpeed = 200; // Start slow
        let iterations = 0;
        const maxIterations = 30 + Math.floor(Math.random() * 20); // Random between 30-50
        
        const animate = () => {
            // Clear previous animations
            slots.forEach(slot => slot.classList.remove('animating'));
            
            // Randomly select a slot to highlight
            const randomIndex = Math.floor(Math.random() * participantNumbers.length);
            const randomNumber = participantNumbers[randomIndex];
            const currentSlot = document.querySelector(`.participant-slot[data-number="${randomNumber}"]`);
            
            if (currentSlot) {
                currentSlot.classList.add('animating');
            }
            
            iterations++;
            
            if (iterations < maxIterations) {
                // Gradually increase speed (decrease delay)
                animationSpeed = Math.max(50, animationSpeed * 0.95);
                setTimeout(animate, animationSpeed);
            } else {
                // Final winner selection
                setTimeout(() => {
                    slots.forEach(slot => slot.classList.remove('animating'));
                    
                    const winnerIndex = Math.floor(Math.random() * participantNumbers.length);
                    const winnerNumber = participantNumbers[winnerIndex];
                    const winner = this.participants.find(p => p.number === winnerNumber);
                    
                    this.showWinner(winner);
                    this.isAnimating = false;
                    document.getElementById('selectWinnerBtn').disabled = false;
                }, 500);
            }
        };
        
        animate();
    }

    showWinner(winner) {
        document.getElementById('winnerNumber').textContent = winner.number;
        document.getElementById('winnerName').textContent = winner.name;
        
        // Mark winner in room
        const room = this.rooms.find(r => r.id === this.currentRoom.id);
        if (room) {
            room.winner = winner;
            room.status = 'completed';
            this.saveData();
        }
        
        // Update slot visual
        const winnerSlot = document.querySelector(`.participant-slot[data-number="${winner.number}"]`);
        if (winnerSlot) {
            winnerSlot.classList.add('winner');
        }
        
        document.getElementById('winnerOverlay').classList.add('show');
        
        // Auto-remove room after winner is selected
        setTimeout(() => {
            this.currentRoom = null;
            this.currentParticipant = null;
            this.participants = [];
            this.updateUI();
        }, 5000);
    }

    hideWinnerOverlay() {
        document.getElementById('winnerOverlay').classList.remove('show');
    }

    updateUI() {
        if (this.currentRoom) {
            this.showGroupState();
        } else {
            this.showNoGroupState();
        }
    }

    showNoGroupState() {
        document.getElementById('noGroupState').style.display = 'block';
        document.getElementById('groupState').style.display = 'none';
    }

    showGroupState() {
        document.getElementById('noGroupState').style.display = 'none';
        document.getElementById('groupState').style.display = 'block';
        
        // Update room info
        document.getElementById('currentRoomName').textContent = this.currentRoom.name;
        document.getElementById('participantsCount').textContent = this.participants.length;
        document.getElementById('maxParticipantsCount').textContent = this.currentRoom.maxParticipants;
        document.getElementById('roomDate').textContent = this.formatDate(this.currentRoom.closingDate);
        document.getElementById('roomTime').textContent = this.formatTime(this.currentRoom.closingDate);
        document.getElementById('roomAmount').textContent = `$${this.currentRoom.amount}`;
        
        this.renderParticipantGrid();
        this.renderParticipantsList();
    }

    renderParticipantGrid() {
        const grid = document.getElementById('grupoNumeros');
        const maxParticipants = this.currentRoom.maxParticipants;
        const occupiedNumbers = this.participants.map(p => p.number);
        
        grid.innerHTML = '';
        
        for (let i = 1; i <= maxParticipants; i++) {
            const slot = document.createElement('div');
            slot.className = 'participant-slot';
            slot.dataset.number = i;
            slot.textContent = i;
            
            if (occupiedNumbers.includes(i)) {
                slot.classList.add('occupied');
                
                // Highlight current user's slot
                if (this.currentParticipant && this.currentParticipant.number === i) {
                    slot.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
                    slot.style.borderColor = '#f093fb';
                }
            }
            
            grid.appendChild(slot);
        }
    }

    renderParticipantsList() {
        const list = document.getElementById('participantsList');
        
        if (this.participants.length === 0) {
            list.innerHTML = '';
            return;
        }
        
        const sortedParticipants = [...this.participants].sort((a, b) => a.number - b.number);
        
        list.innerHTML = sortedParticipants.map(participant => `
            <div class="participant-item">
                <div class="participant-number">${participant.number}</div>
                <div class="participant-name">${participant.name}</div>
                <div class="participant-time">${this.formatTime(participant.joinedAt)}</div>
            </div>
        `).join('');
    }

    showToast(title, message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        toast.innerHTML = `
            <i class="toast-icon ${icons[type]}"></i>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;
        
        document.getElementById('toastContainer').appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 5000);
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    saveData() {
        localStorage.setItem('sorteo_rooms', JSON.stringify(this.rooms));
        localStorage.setItem('sorteo_current_room', JSON.stringify(this.currentRoom));
        localStorage.setItem('sorteo_current_participant', JSON.stringify(this.currentParticipant));
    }

    loadData() {
        try {
            const savedRooms = localStorage.getItem('sorteo_rooms');
            const savedCurrentRoom = localStorage.getItem('sorteo_current_room');
            const savedCurrentParticipant = localStorage.getItem('sorteo_current_participant');
            
            if (savedRooms) {
                this.rooms = JSON.parse(savedRooms);
            }
            
            if (savedCurrentRoom && savedCurrentRoom !== 'null') {
                this.currentRoom = JSON.parse(savedCurrentRoom);
                if (this.currentRoom) {
                    const room = this.rooms.find(r => r.id === this.currentRoom.id);
                    if (room) {
                        this.participants = room.participants;
                        this.currentRoom = room; // Update with latest data
                    }
                }
            }
            
            if (savedCurrentParticipant && savedCurrentParticipant !== 'null') {
                this.currentParticipant = JSON.parse(savedCurrentParticipant);
            }
            
            // Clean up expired or completed rooms
            this.cleanupRooms();
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    cleanupRooms() {
        const now = new Date();
        this.rooms = this.rooms.filter(room => {
            const closingDate = new Date(room.closingDate);
            return closingDate > now || room.status === 'active';
        });
        this.saveData();
    }

    setupFormValidation() {
        // Card number formatting
        document.getElementById('tarjeta').addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });

        // Expiry date formatting
        document.getElementById('fechaVencimiento').addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });

        // CVV formatting
        document.getElementById('codigoSeguridad').addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }

    validateForm() {
        let isValid = true;
        this.clearFormErrors();

        // Validate name
        const nombre = document.getElementById('nombre').value.trim();
        if (nombre.length < 2) {
            this.showFieldError('nombre', 'El nombre debe tener al menos 2 caracteres');
            isValid = false;
        }

        // Validate age
        const edad = parseInt(document.getElementById('edad').value);
        if (!edad || edad < 1 || edad > 120) {
            this.showFieldError('edad', 'Ingresa una edad válida');
            isValid = false;
        }

        // Validate card number
        const tarjeta = document.getElementById('tarjeta').value.replace(/\s/g, '');
        if (tarjeta.length !== 16 || !/^\d+$/.test(tarjeta)) {
            this.showFieldError('tarjeta', 'Ingresa un número de tarjeta válido');
            isValid = false;
        }

        // Validate expiry date
        const fechaVencimiento = document.getElementById('fechaVencimiento').value;
        if (!/^\d{2}\/\d{2}$/.test(fechaVencimiento)) {
            this.showFieldError('fechaVencimiento', 'Formato: MM/AA');
            isValid = false;
        }

        // Validate CVV
        const cvv = document.getElementById('codigoSeguridad').value;
        if (cvv.length < 3 || cvv.length > 4 || !/^\d+$/.test(cvv)) {
            this.showFieldError('codigoSeguridad', 'CVV inválido');
            isValid = false;
        }

        return isValid;
    }

    showFieldError(fieldId, message) {
        const errorElement = document.getElementById(`error-${fieldId}`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    clearFormErrors() {
        const errorElements = document.querySelectorAll('.mensaje-error');
        errorElements.forEach(element => {
            element.classList.remove('show');
            element.textContent = '';
        });
    }
}

// Initialize the system
const sorteoSystem = new SorteoSystem();

// Auto-cleanup expired rooms every minute
setInterval(() => {
    sorteoSystem.cleanupRooms();
    sorteoSystem.updateUI();
}, 60000); 







