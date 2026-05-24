/**
 * Lógica e Interactividad JavaScript para COTech Solutions
 * Autor: Antigravity AI
 */

document.addEventListener("DOMContentLoaded", () => {
  // Inicialización de componentes
  initNavbarScroll();
  initServiceFilters();
  initDiagnostics();
  initCalculator();
  initBookingSystem();
  initTechChatbot();
});

/* ==========================================================================
   1. NAVBAR SCROLL EFFECT
   ========================================================================== */
function initNavbarScroll() {
  const navbar = document.querySelector(".navbar-cyber");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

/* ==========================================================================
   2. SERVICE FILTERS
   ========================================================================== */
function initServiceFilters() {
  const filterBtns = document.querySelectorAll(".btn-filter");
  const serviceCards = document.querySelectorAll(".service-card-item");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      serviceCards.forEach(card => {
        if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
          card.parentElement.style.display = "block";
          card.style.opacity = "0";
          setTimeout(() => {
            card.style.transition = "opacity 0.4s ease";
            card.style.opacity = "1";
          }, 50);
        } else {
          card.parentElement.style.display = "none";
        }
      });
    });
  });
}

/* ==========================================================================
   3. DIAGNOSTICS ASSISTANT (TROUBLESHOOTER)
   ========================================================================== */
const DIAGNOSTICS_DATA = {
  slow: {
    title: "Ralentización de Sistema y Exceso de Temporales",
    gravity: "Baja a Media",
    gravityClass: "text-warning",
    cause: "Exceso de aplicaciones en arranque, registro saturado o malware en segundo plano consumiendo procesador y RAM.",
    solution: "Formateo completo con instalación limpia de Windows activado, optimización de servicios y reinstalación de programas esenciales.",
    price: "$85.000 COP",
    serviceId: "combo-programs"
  },
  heat: {
    title: "Sobrecalentamiento por Suciedad y Pasta Térmica Seca",
    gravity: "Media",
    gravityClass: "text-warning",
    cause: "Pelusa y polvo acumulados bloqueando los disipadores, obligando al ventilador a girar a revoluciones máximas. Pasta térmica reseca.",
    solution: "Mantenimiento físico preventivo que incluye desarme, soplado, lubricación de ventiladores y aplicación de nueva pasta térmica de alta conductividad.",
    price: "$30.000 COP",
    serviceId: "hardware-clean"
  },
  combo_full: {
    title: "Mantenimiento Total de Hardware y Software (Fallas Varias)",
    gravity: "Media a Alta",
    gravityClass: "text-danger",
    cause: "El sistema operativo está corrupto/lento y físicamente el computador tiene altos niveles de suciedad interna y sobrecalentamiento.",
    solution: "Servicio completo: Formateo + Windows + Drivers + Suite Office + Programas esenciales + Limpieza profunda de componentes físicos.",
    price: "$110.000 COP",
    serviceId: "combo-full"
  },
  office: {
    title: "Falta de Activación de Herramientas de Oficina (Office)",
    gravity: "Baja",
    gravityClass: "text-info",
    cause: "Licencia de Microsoft Office expirada o suite de productividad no instalada adecuadamente.",
    solution: "Instalación completa y activación permanente de Microsoft Office (Word, Excel, PowerPoint, Outlook) e instalación de drivers óptimos.",
    price: "$60.000 COP",
    serviceId: "combo-basic"
  }
};

function initDiagnostics() {
  const options = document.querySelectorAll(".diagnose-option");
  const resultDiv = document.getElementById("diagnostic-result");

  options.forEach(opt => {
    opt.addEventListener("click", () => {
      options.forEach(o => o.classList.remove("active"));
      opt.classList.add("active");

      const problemKey = opt.getAttribute("data-problem");
      const data = DIAGNOSTICS_DATA[problemKey];

      if (data) {
        document.getElementById("diag-title").textContent = data.title;
        document.getElementById("diag-gravity").textContent = data.gravity;
        
        const gravitySpan = document.getElementById("diag-gravity");
        gravitySpan.className = `fw-bold ${data.gravityClass}`;
        
        document.getElementById("diag-cause").textContent = data.cause;
        document.getElementById("diag-solution").textContent = data.solution;
        document.getElementById("diag-price").textContent = data.price;

        resultDiv.style.display = "none";
        setTimeout(() => {
          resultDiv.style.display = "block";
          resultDiv.style.animation = "float-card 0.5s ease";
        }, 50);

        // Pre-seleccionar servicio correspondiente en el modal
        const selectServicio = document.getElementById("booking-service");
        if (selectServicio) {
          if (data.serviceId === "combo-basic") {
            selectServicio.value = "Formateo + Sistema Operativo Activado";
          } else if (data.serviceId === "combo-programs") {
            selectServicio.value = "Formateo + SO Activado + Programas";
          } else if (data.serviceId === "combo-full") {
            selectServicio.value = "Formateo + SO + Programas + Limpieza de Hardware";
          } else if (data.serviceId === "hardware-clean") {
            selectServicio.value = "Limpieza de Hardware";
          }
        }
      }
    });
  });
}

/* ==========================================================================
   4. BUDGET CALCULATOR
   ========================================================================== */
const SERVICES_PRICES = {
  "combo-basic": 60000,
  "combo-programs": 85000,
  "combo-full": 110000,
  "hardware-clean": 30000
};

const EXTRA_PRICES = {
  domicilio: 20000
};

const PROMO_CODES = {
  "COTECH10": 0.10,      // 10% de descuento
  "BARRANQUILLA": 0.15,  // 15% de descuento
  "TECH2026": 0.20       // 20% de descuento
};

function initCalculator() {
  const serviceRadios = document.querySelectorAll(".calc-radio");
  const domicilioCheckbox = document.getElementById("srv-domicilio");
  const subtotalEl = document.getElementById("calc-subtotal");
  const discountEl = document.getElementById("calc-discount");
  const totalEl = document.getElementById("calc-total");
  
  const couponInput = document.getElementById("coupon-code");
  const applyCouponBtn = document.getElementById("btn-apply-coupon");
  const couponStatus = document.getElementById("coupon-status");

  let discountPercentage = 0;

  function formatCOP(number) {
    return "$" + number.toLocaleString("de-DE") + " COP";
  }

  function calculateTotal() {
    let subtotal = 0;
    
    // Obtener servicio base seleccionado
    serviceRadios.forEach(radio => {
      if (radio.checked) {
        const val = radio.value;
        subtotal += SERVICES_PRICES[val] || 0;
      }
    });

    // Sumar domicilio si está marcado
    if (domicilioCheckbox && domicilioCheckbox.checked) {
      subtotal += EXTRA_PRICES.domicilio;
    }

    let discount = subtotal * discountPercentage;
    let total = subtotal - discount;

    // Actualizar UI
    subtotalEl.textContent = formatCOP(subtotal);
    discountEl.textContent = "-" + formatCOP(discount);
    totalEl.textContent = formatCOP(total);
  }

  // Escuchar cambios
  serviceRadios.forEach(radio => {
    radio.addEventListener("change", calculateTotal);
    const container = radio.closest(".calc-checkbox-container");
    if (container) {
      container.addEventListener("click", (e) => {
        if (e.target !== radio) {
          radio.checked = true;
          calculateTotal();
        }
      });
    }
  });

  if (domicilioCheckbox) {
    domicilioCheckbox.addEventListener("change", calculateTotal);
    const domContainer = domicilioCheckbox.closest(".calc-checkbox-container");
    if (domContainer) {
      domContainer.addEventListener("click", (e) => {
        if (e.target !== domicilioCheckbox) {
          domicilioCheckbox.checked = !domicilioCheckbox.checked;
          calculateTotal();
        }
      });
    }
  }

  // Aplicar cupón de descuento
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener("click", () => {
      const code = couponInput.value.trim().toUpperCase();
      if (PROMO_CODES[code] !== undefined) {
        discountPercentage = PROMO_CODES[code];
        couponStatus.textContent = `¡Cupón aplicado! -${discountPercentage * 100}% de descuento.`;
        couponStatus.className = "form-text text-success d-block";
        couponInput.classList.remove("is-invalid");
        couponInput.classList.add("is-valid");
      } else {
        discountPercentage = 0;
        couponStatus.textContent = "Cupón no válido para COTech.";
        couponStatus.className = "form-text text-danger d-block";
        couponInput.classList.remove("is-valid");
        couponInput.classList.add("is-invalid");
      }
      calculateTotal();
    });
  }

  // Ejecutar cálculo inicial
  calculateTotal();
}

/* ==========================================================================
   5. BOOKING SYSTEM & LOCALSTORAGE DASHBOARD
   ========================================================================== */
function initBookingSystem() {
  const bookingForm = document.getElementById("bookingForm");
  const bookingList = document.getElementById("bookings-list");
  const noBookingsMsg = document.getElementById("no-bookings-message");
  const bookingModal = document.getElementById("bookingModal");

  renderBookings();

  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("booking-name").value.trim();
      const email = document.getElementById("booking-email").value.trim();
      const phone = document.getElementById("booking-phone").value.trim();
      const date = document.getElementById("booking-date").value;
      const service = document.getElementById("booking-service").value;
      const type = document.getElementById("booking-type").value;
      const notes = document.getElementById("booking-notes").value.trim();

      if (!name || !email || !phone || !date) {
        alert("Por favor completa los campos obligatorios del formulario.");
        return;
      }

      const newBooking = {
        id: "COT-" + Math.floor(1000 + Math.random() * 9000),
        name,
        email,
        phone,
        date,
        service,
        type,
        notes: notes || "Sin detalles adicionales",
        status: "Pendiente de Confirmación",
        createdAt: new Date().toLocaleDateString()
      };

      const bookings = getBookingsFromStorage();
      bookings.push(newBooking);
      localStorage.setItem("cotech_bookings", JSON.stringify(bookings));

      bookingForm.reset();
      
      const bootstrapModal = bootstrap.Modal.getInstance(bookingModal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }

      showSuccessAlert(`¡Solicitud enviada! Código de orden: ${newBooking.id}. Cris Tejedor se contactará contigo pronto.`);
      renderBookings();
    });
  }

  function getBookingsFromStorage() {
    const bookings = localStorage.getItem("cotech_bookings");
    return bookings ? JSON.parse(bookings) : [];
  }

  function renderBookings() {
    if (!bookingList) return;

    const bookings = getBookingsFromStorage();
    bookingList.innerHTML = "";

    if (bookings.length === 0) {
      if (noBookingsMsg) noBookingsMsg.style.display = "block";
      return;
    }

    if (noBookingsMsg) noBookingsMsg.style.display = "none";

    bookings.forEach(bk => {
      const card = document.createElement("div");
      card.className = "booking-badge";
      card.innerHTML = `
        <i class="bi bi-trash delete-booking" data-id="${bk.id}" title="Cancelar Solicitud"></i>
        <div class="d-flex align-items-center gap-2 mb-2">
          <span class="badge bg-primary">${bk.id}</span>
          <span class="badge bg-info text-dark">${bk.status}</span>
        </div>
        <h6 class="mb-1 text-white">${bk.service}</h6>
        <p class="mb-1 text-muted fs-7"><i class="bi bi-geo-alt me-1"></i> Tipo: <strong>${bk.type}</strong></p>
        <p class="mb-1 text-muted fs-7"><i class="bi bi-calendar3 me-1"></i> Fecha: ${bk.date}</p>
        <p class="mb-1 text-muted fs-7"><i class="bi bi-person me-1"></i> Cliente: ${bk.name} (${bk.phone})</p>
        ${bk.notes ? `<p class="mb-0 text-muted fs-7 text-truncate"><em>" ${bk.notes} "</em></p>` : ""}
      `;
      bookingList.appendChild(card);
    });

    const deleteBtns = bookingList.querySelectorAll(".delete-booking");
    deleteBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        if (confirm(`¿Deseas cancelar la solicitud de soporte ${id}?`)) {
          cancelBooking(id);
        }
      });
    });
  }

  function cancelBooking(id) {
    let bookings = getBookingsFromStorage();
    bookings = bookings.filter(bk => bk.id !== id);
    localStorage.setItem("cotech_bookings", JSON.stringify(bookings));
    renderBookings();
    showSuccessAlert("La solicitud ha sido eliminada correctamente del panel.");
  }

  function showSuccessAlert(msg) {
    const alertBox = document.createElement("div");
    alertBox.style.position = "fixed";
    alertBox.style.top = "100px";
    alertBox.style.right = "20px";
    alertBox.style.zIndex = "9999";
    alertBox.innerHTML = `
      <div class="alert alert-info alert-dismissible fade show card-glass text-white border-primary" role="alert" style="box-shadow: 0 0 20px rgba(0, 82, 255, 0.4);">
        <i class="bi bi-info-circle-fill me-2 text-info"></i> <strong>Soporte COTech:</strong> ${msg}
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    document.body.appendChild(alertBox);

    setTimeout(() => {
      alertBox.remove();
    }, 6000);
  }
}

/* ==========================================================================
   6. TECHBOT CHATBOT - PERSONALIZADO PARA COTech SOLUTIONS
   ========================================================================== */
const BOT_RESPONSES = {
  "precios": "En COTech Solutions manejamos tarifas claras y competitivas:<br>- <strong>Formateo + SO Activado:</strong> $60.000 COP.<br>- <strong>Formateo + SO + Programas esenciales:</strong> $85.000 COP.<br>- <strong>Combo Full (SO + Programas + Limpieza de Hardware):</strong> $110.000 COP.<br>- <strong>Limpieza de Hardware sola:</strong> $30.000 COP.<br>- <strong>Servicio a domicilio:</strong> +$20.000 COP.",
  "ubicacion": "Estamos ubicados en la hermosa ciudad de <strong>Barranquilla, Colombia</strong>. Prestamos servicios técnicos presenciales a domicilio en toda el área urbana de la ciudad, y soporte remoto a nivel nacional para temas puramente de software.",
  "garantia": "¡Totalmente! Todos los trabajos de software (instalaciones de SO/Office) y limpieza física cuentan con garantía de soporte. Trabajamos con transparencia. Si tienes algún inconveniente post-servicio, nos avisas de inmediato y lo solucionamos.",
  "horario": "Atendemos solicitudes y agendamientos técnicos de <strong>Lunes a Sábado de 8:00 AM a 7:00 PM</strong>. Puedes registrar tu reserva en esta web las 24 horas y Cris Tejedor te llamará en horario laboral para confirmar.",
  "sobre_mi": "El fundador y especialista a cargo es <strong>Cris O. Tejedor</strong>, estudiante de Ingeniería en Gestión de Sistemas Informáticos en la <strong>Institución Universitaria de Barranquilla</strong>, con títulos certificados de Técnico en Mantenimiento de Sistemas e Informática.",
  "whatsapp": "Puedes comunicarte de manera directa con nosotros haciendo clic en el botón flotante verde de WhatsApp en la pantalla, o agregándonos directamente al número: <strong>3246352829</strong>."
};

function initTechChatbot() {
  const chatToggle = document.getElementById("chat-toggle");
  const chatBox = document.getElementById("chat-box");
  const closeChat = document.getElementById("close-chat");
  const chatBody = document.getElementById("chat-body");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const optionsContainer = document.getElementById("chat-options");
  const chatPing = document.getElementById("chat-ping");

  if (!chatToggle || !chatBox) return;

  chatToggle.addEventListener("click", () => {
    chatBox.classList.add("open");
    if (chatPing) chatPing.style.display = "none";
    scrollChatToBottom();
  });

  closeChat.addEventListener("click", () => {
    chatBox.classList.remove("open");
  });

  optionsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("chat-option-btn")) {
      const topic = e.target.getAttribute("data-topic");
      const questionText = e.target.textContent;

      appendChatMessage(questionText, "user");
      simulateBotResponse(topic);
    }
  });

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = chatInput.value.trim().toLowerCase();
    if (!query) return;

    appendChatMessage(chatInput.value.trim(), "user");
    chatInput.value = "";

    let matchFound = false;
    let topicMatch = "";

    if (query.includes("precio") || query.includes("costo") || query.includes("vale") || query.includes("cuanto") || query.includes("cobras")) {
      topicMatch = "precios";
      matchFound = true;
    } else if (query.includes("donde") || query.includes("ubicacion") || query.includes("barranquilla") || query.includes("queda")) {
      topicMatch = "ubicacion";
      matchFound = true;
    } else if (query.includes("garant") || query.includes("seguro") || query.includes("respaldo")) {
      topicMatch = "garantia";
      matchFound = true;
    } else if (query.includes("horario") || query.includes("abre") || query.includes("atiende") || query.includes("cuando")) {
      topicMatch = "horario";
      matchFound = true;
    } else if (query.includes("cris") || query.includes("tejedor") || query.includes("quien") || query.includes("estud")) {
      topicMatch = "sobre_mi";
      matchFound = true;
    } else if (query.includes("whatsapp") || query.includes("telefono") || query.includes("celular") || query.includes("llamar") || query.includes("numero")) {
      topicMatch = "whatsapp";
      matchFound = true;
    }

    if (matchFound) {
      simulateBotResponse(topicMatch);
    } else {
      simulateGenericBotResponse();
    }
  });

  function appendChatMessage(text, sender) {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerHTML = text;
    chatBody.appendChild(bubble);
    scrollChatToBottom();
  }

  function simulateBotResponse(topic) {
    const typingBubble = document.createElement("div");
    typingBubble.className = "chat-bubble bot typing-indicator";
    typingBubble.innerHTML = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Escribiendo respuesta...`;
    chatBody.appendChild(typingBubble);
    scrollChatToBottom();

    setTimeout(() => {
      typingBubble.remove();
      const response = BOT_RESPONSES[topic];
      appendChatMessage(response, "bot");
    }, 1000);
  }

  function simulateGenericBotResponse() {
    const typingBubble = document.createElement("div");
    typingBubble.className = "chat-bubble bot typing-indicator";
    typingBubble.innerHTML = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span> Escribiendo respuesta...`;
    chatBody.appendChild(typingBubble);
    scrollChatToBottom();

    setTimeout(() => {
      typingBubble.remove();
      const fallbackMsg = "Hola. Para resolver tu caso particular o contratar un formateo, te sugiero enviarnos un mensaje rápido por <strong>WhatsApp al 3246352829</strong> haciendo clic en el icono verde. ¡Te atenderá Cris O. Tejedor de inmediato!";
      appendChatMessage(fallbackMsg, "bot");
    }, 1000);
  }

  function scrollChatToBottom() {
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  setTimeout(() => {
    if (!chatBox.classList.contains("open") && chatPing) {
      chatPing.style.display = "block";
    }
  }, 4000);
}
