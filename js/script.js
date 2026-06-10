/* ==========================================
   COTech Solutions - Lógica Interactiva (JS)
   Autor: Antigravity AI para Cris Tejedor
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Inicialización de componentes
  initNavbar();
  initDiagnoseAssistant();
  initPriceCalculator();
  initBookingSystem();
  initSupportChatbot();
});

/* ==========================================
   1. CONTROL DE NAVEGACIÓN (NAVBAR)
   ========================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar-cyber');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Cerrar navbar móvil al hacer clic en un enlace
  const navLinks = document.querySelectorAll('.nav-link-tech');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });
}

/* ==========================================
   2. ASISTENTE DE DIAGNÓSTICO
   ========================================== */
const DIAGNOSTIC_DATA = {
  slow: {
    title: 'Lentitud Extrema del Sistema',
    gravity: 'Media',
    gravityClass: 'text-warning',
    cause: 'Saturación de archivos temporales, presencia de malware/virus, software innecesario en segundo plano o disco duro en mal estado.',
    solution: 'Formateo completo con instalación limpia de Windows + Drivers optimizados y desactivación de telemetría pesada.',
    price: '$60.000 COP',
    calcRadioId: 'srv-basic'
  },
  heat: {
    title: 'Sobrecalentamiento y Ruido de Ventiladores',
    gravity: 'Alta',
    gravityClass: 'text-danger',
    cause: 'Obstrucción de disipadores por polvo y pelusas, pasta térmica del procesador seca o cristalizada que no transfiere el calor.',
    solution: 'Desarme físico del equipo, soplado e higienización de la placa, lubricación de cooler y cambio de pasta térmica de alta conductividad.',
    price: '$30.000 COP',
    calcRadioId: 'srv-clean-ind'
  },
  combo_full: {
    title: 'Fallas Lógicas Críticas + Suciedad Física',
    gravity: 'Crítica',
    gravityClass: 'text-danger',
    cause: 'Infecciones graves de virus, lentitud generalizada del software combinada con acumulación excesiva de polvo y pasta térmica vencida.',
    solution: 'Combo Mantenimiento Full (Formateo del sistema operativo, instalación de suites completas de software y limpieza física profunda).',
    price: '$110.000 COP',
    calcRadioId: 'srv-combo-full'
  },
  office: {
    title: 'Falta de Licenciamiento y Activación',
    gravity: 'Baja',
    gravityClass: 'text-info',
    cause: 'Llaves de activación vencidas de Windows u Office (marca de agua persistente en pantalla y funciones de Word/Excel bloqueadas).',
    solution: 'Instalación de sistema operativo y suites de oficina activados de forma permanente y segura para evitar bloqueos.',
    price: '$85.000 COP',
    calcRadioId: 'srv-prog'
  }
};

function initDiagnoseAssistant() {
  const options = document.querySelectorAll('.diagnose-option');
  const resultBox = document.getElementById('diagnostic-result');
  const diagTitle = document.getElementById('diag-title');
  const diagGravity = document.getElementById('diag-gravity');
  const diagCause = document.getElementById('diag-cause');
  const diagSolution = document.getElementById('diag-solution');
  const diagPrice = document.getElementById('diag-price');

  options.forEach(option => {
    option.addEventListener('click', () => {
      // Remover clase activa de las demás
      options.forEach(opt => opt.classList.remove('active'));
      
      // Activar la seleccionada
      option.classList.add('active');
      
      // Obtener datos del problema
      const problemKey = option.getAttribute('data-problem');
      const data = DIAGNOSTIC_DATA[problemKey];
      
      if (data) {
        // Actualizar interfaz del resultado
        diagTitle.textContent = data.title;
        diagGravity.textContent = data.gravity;
        diagGravity.className = `fw-bold ${data.gravityClass}`;
        diagCause.textContent = data.cause;
        diagSolution.textContent = data.solution;
        diagPrice.textContent = data.price;
        
        // Mostrar caja de resultados
        resultBox.style.display = 'block';
        
        // Sincronizar con el cotizador en tiempo real
        const calcRadio = document.getElementById(data.calcRadioId);
        if (calcRadio) {
          calcRadio.checked = true;
          // Disparar evento change para recalcular
          calcRadio.dispatchEvent(new Event('change'));
        }
      }
    });
  });
}

/* ==========================================
   3. COTIZADOR EN TIEMPO REAL
   ========================================== */
function initPriceCalculator() {
  const baseRadios = document.querySelectorAll('input[name="base-service"]');
  const domicilioCheck = document.getElementById('srv-domicilio');
  const couponInput = document.getElementById('coupon-code');
  const couponBtn = document.getElementById('btn-apply-coupon');
  const couponStatus = document.getElementById('coupon-status');
  
  const subtotalLabel = document.getElementById('calc-subtotal');
  const discountLabel = document.getElementById('calc-discount');
  const totalLabel = document.getElementById('calc-total');

  // Valores de los servicios
  const PRICES = {
    'combo-basic': 60000,
    'combo-programs': 85000,
    'combo-full': 110000,
    'hardware-clean': 30000
  };

  const ADICIONAL_DOMICILIO = 20000;
  
  // Estado de los cupones
  let activeDiscountPercent = 0;
  let appliedCoupon = '';

  const formatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  });

  function calculate() {
    // Buscar servicio seleccionado
    let selectedVal = '';
    baseRadios.forEach(radio => {
      if (radio.checked) selectedVal = radio.value;
    });

    const basePrice = PRICES[selectedVal] || 0;
    const isDomicilio = domicilioCheck.checked;
    
    // El domicilio se suma al subtotal
    const subtotal = basePrice + (isDomicilio ? ADICIONAL_DOMICILIO : 0);
    
    // Descuento (se aplica sobre el subtotal)
    const discount = subtotal * activeDiscountPercent;
    const total = subtotal - discount;

    // Actualizar UI
    subtotalLabel.textContent = formatter.format(subtotal);
    discountLabel.textContent = `-${formatter.format(discount)}`;
    totalLabel.textContent = formatter.format(total);
  }

  // Event Listeners para cambios de opciones
  baseRadios.forEach(radio => {
    radio.addEventListener('change', calculate);
  });
  domicilioCheck.addEventListener('change', calculate);

  // Lógica de Cupones
  couponBtn.addEventListener('click', () => {
    const code = couponInput.value.trim().toUpperCase();
    
    if (code === '') {
      showCouponMessage('Por favor escribe un código.', 'text-danger');
      return;
    }

    if (code === 'COTECH10') {
      activeDiscountPercent = 0.10;
      appliedCoupon = 'COTECH10';
      showCouponMessage('¡Cupón COTECH10 aplicado! 10% de descuento.', 'text-success');
    } else if (code === 'TECH2026') {
      activeDiscountPercent = 0.15;
      appliedCoupon = 'TECH2026';
      showCouponMessage('¡Cupón TECH2026 aplicado! 15% de descuento especial.', 'text-success');
    } else {
      activeDiscountPercent = 0;
      appliedCoupon = '';
      showCouponMessage('Código no válido.', 'text-danger');
    }
    
    calculate();
  });

  function showCouponMessage(msg, className) {
    couponStatus.textContent = msg;
    couponStatus.className = `form-text d-block ${className}`;
  }

  // Ejecutar cálculo inicial
  calculate();
}

/* ==========================================
   4. SISTEMA DE RESERVAS (LOCALSTORAGE)
   ========================================== */
let bookings = [];

function initBookingSystem() {
  const bookingForm = document.getElementById('bookingForm');
  const bookingModalEl = document.getElementById('bookingModal');
  
  // Cargar registros iniciales
  loadBookings();
  
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('booking-name').value.trim();
      const email = document.getElementById('booking-email').value.trim();
      const phone = document.getElementById('booking-phone').value.trim();
      const date = document.getElementById('booking-date').value;
      const service = document.getElementById('booking-service').value;
      const type = document.getElementById('booking-type').value;
      const notes = document.getElementById('booking-notes').value.trim();
      
      const newBooking = {
        id: Date.now(),
        name,
        email,
        phone,
        date,
        service,
        type,
        notes: notes || 'Sin notas adicionales.',
        status: 'Pendiente de Confirmación'
      };
      
      bookings.unshift(newBooking); // Agregar al inicio
      saveBookings();
      renderBookings();
      
      // Cerrar Modal
      const modalInstance = bootstrap.Modal.getInstance(bookingModalEl);
      if (modalInstance) {
        modalInstance.hide();
      }
      
      // Reset del formulario
      bookingForm.reset();
      
      // Mensaje de éxito
      alert('¡Tu solicitud ha sido registrada con éxito en tu navegador! Cris Tejedor se comunicará contigo vía WhatsApp a la brevedad.');
    });
  }
}

function loadBookings() {
  const stored = localStorage.getItem('cotech_bookings');
  if (stored) {
    try {
      bookings = JSON.parse(stored);
    } catch (e) {
      bookings = [];
    }
  }
  renderBookings();
}

function saveBookings() {
  localStorage.setItem('cotech_bookings', JSON.stringify(bookings));
}

function renderBookings() {
  const listContainer = document.getElementById('bookings-list');
  const emptyMessage = document.getElementById('no-bookings-message');
  
  if (!listContainer || !emptyMessage) return;

  if (bookings.length === 0) {
    listContainer.style.display = 'none';
    emptyMessage.style.display = 'block';
  } else {
    emptyMessage.style.display = 'none';
    listContainer.style.display = 'flex';
    listContainer.innerHTML = '';
    
    bookings.forEach(booking => {
      const card = document.createElement('div');
      card.className = 'booking-dashboard-card';
      
      // Formatear Fecha
      const dateParts = booking.date.split('-');
      const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : booking.date;

      card.innerHTML = `
        <div class="d-flex justify-content-between align-items-start gap-2">
          <div>
            <div class="d-flex align-items-center gap-2 flex-wrap mb-2">
              <span class="badge bg-primary bg-opacity-25 text-white border border-primary border-opacity-50 fs-8"><i class="bi bi-clock-history me-1"></i> ${booking.status}</span>
              <span class="badge bg-dark border border-secondary text-muted fs-8"><i class="bi bi-calendar3 me-1"></i> ${formattedDate}</span>
            </div>
            <h6 class="text-white mb-1">${booking.service}</h6>
            <p class="mb-1 text-muted small"><i class="bi bi-person me-1"></i> <strong>Cliente:</strong> ${booking.name} | <i class="bi bi-telephone me-1"></i> ${booking.phone}</p>
            <p class="mb-1 text-muted small"><i class="bi bi-geo me-1"></i> <strong>Modalidad:</strong> ${booking.type}</p>
            <p class="mb-0 text-muted fs-7 border-start border-secondary border-opacity-50 ps-2 mt-2" style="font-style: italic;">"${booking.notes}"</p>
          </div>
          <button class="booking-card-delete" onclick="deleteBooking(${booking.id})" title="Cancelar solicitud">
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      `;
      listContainer.appendChild(card);
    });
  }
}

// Ventana global para borrar citas
window.deleteBooking = function(id) {
  if (confirm('¿Estás seguro de que deseas cancelar y eliminar esta solicitud de soporte?')) {
    bookings = bookings.filter(b => b.id !== id);
    saveBookings();
    renderBookings();
  }
};

/* ==========================================
   5. CHATBOT DE SOPORTE TÉCNICO
   ========================================== */
const BOT_RESPONSES = {
  precios: 'Nuestras tarifas base son:\n- **Limpieza de hardware**: $30.000 COP\n- **Formateo + Sistema Activado**: $60.000 COP\n- **Formateo + SO + Programas**: $85.000 COP\n- **Combo Mantenimiento Full**: $110.000 COP\n\n*Nota: El soporte a domicilio en Barranquilla tiene un recargo de +$20.000 COP.*',
  ubicacion: 'COTech Solutions está ubicada en **Barranquilla, Colombia**. Cris Tejedor realiza visitas técnicas a domicilio en toda el área metropolitana de Barranquilla (norte, centro, sur y Soledad) o puedes coordinar para llevar tu equipo.',
  garantia: 'Todos nuestros trabajos cuentan con garantía:\n- **Soporte de Software**: 15 días de garantía ante fallos lógicos.\n- **Limpieza y Hardware**: 30 días de garantía sobre la pasta térmica y ensamblado.\n\n*Nota: No cubre daños provocados por golpes o derrames posteriores.*',
  horario: 'Nuestros horarios de soporte son:\n- **Lunes a Sábado**: 8:00 AM - 7:00 PM\n- **Domingos**: Soporte de urgencia acordado previamente.',
  sobre_mi: 'El especialista principal es **Cris O. Tejedor**, estudiante del programa Tecnólogo en Gestión de Sistemas Informáticos en la **Institución Universitaria de Barranquilla (IUB)**, con certificaciones académicas avanzadas en ensamble y soporte.',
  whatsapp: 'Puedes contactar directamente al WhatsApp de Cris Tejedor dando clic al botón flotante verde en pantalla o usando este link directo: [Chat WhatsApp](https://wa.me/573246352829?text=Hola%20COTech%20Solutions,%20deseo%20consultar%20por%20un%20servicio%20técnico).'
};

function initSupportChatbot() {
  const toggleBtn = document.getElementById('chat-toggle');
  const chatBox = document.getElementById('chat-box');
  const closeBtn = document.getElementById('close-chat');
  const chatBody = document.getElementById('chat-body');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const pingBadge = document.getElementById('chat-ping');
  const optionBtns = document.querySelectorAll('.chat-option-btn');

  // Mostrar el ping de alerta después de 3 segundos para enganchar al usuario
  setTimeout(() => {
    if (pingBadge && !chatBox.classList.contains('active')) {
      pingBadge.style.display = 'block';
    }
  }, 3000);

  // Abrir / Cerrar Chat
  toggleBtn.addEventListener('click', () => {
    chatBox.classList.toggle('active');
    if (pingBadge) pingBadge.style.display = 'none';
    scrollToBottom();
  });

  closeBtn.addEventListener('click', () => {
    chatBox.classList.remove('active');
  });

  // Evento para opciones predefinidas
  optionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const topic = btn.getAttribute('data-topic');
      const questionText = btn.textContent;
      
      // Añadir mensaje del usuario
      appendMessage(questionText, 'user');
      
      // Responder
      setTimeout(() => {
        const reply = BOT_RESPONSES[topic] || 'Lo siento, no tengo esa información.';
        appendMessage(reply, 'bot');
      }, 500);
    });
  });

  // Evento para formulario personalizado
  if (chatForm) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (text === '') return;

      appendMessage(text, 'user');
      chatInput.value = '';

      setTimeout(() => {
        const reply = getKeywordReply(text);
        appendMessage(reply, 'bot');
      }, 600);
    });
  }

  function appendMessage(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    
    // Convertir markdown simple a HTML (**texto** y [texto](url))
    let formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/- (.*?)\n/g, '• $1<br>')
      .replace(/\n/g, '<br>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-cyan">$1</a>');

    bubble.innerHTML = formattedText;
    chatBody.appendChild(bubble);
    scrollToBottom();
  }

  function scrollToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function getKeywordReply(text) {
    const t = text.toLowerCase();
    
    if (t.includes('precio') || t.includes('costo') || t.includes('cuanto cuesta') || t.includes('cuanto vale') || t.includes('tarifa') || t.includes('precio') || t.includes('valor')) {
      return BOT_RESPONSES.precios;
    }
    if (t.includes('donde') || t.includes('ubicacion') || t.includes('direccion') || t.includes('barranquilla') || t.includes('lugar') || t.includes('sector')) {
      return BOT_RESPONSES.ubicacion;
    }
    if (t.includes('garantia') || t.includes('seguro') || t.includes('reparar') || t.includes('fallo') || t.includes('malo')) {
      return BOT_RESPONSES.garantia;
    }
    if (t.includes('horario') || t.includes('hora') || t.includes('abierto') || t.includes('atiende') || t.includes('domingo') || t.includes('lunes')) {
      return BOT_RESPONSES.horario;
    }
    if (t.includes('quien') || t.includes('cris') || t.includes('tejedor') || t.includes('tecnico') || t.includes('estudia')) {
      return BOT_RESPONSES.sobre_mi;
    }
    if (t.includes('whatsapp') || t.includes('celular') || t.includes('telefono') || t.includes('contacto') || t.includes('escribir') || t.includes('hablar')) {
      return BOT_RESPONSES.whatsapp;
    }

    return 'Gracias por tu consulta. Para brindarte una respuesta precisa y personalizada sobre tu equipo, te recomiendo agendar una solicitud en el panel de reservas o escribir directamente al WhatsApp de Cris Tejedor usando el botón verde de abajo.';
  }
}
