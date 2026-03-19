/**
 * form-handler.js — Lógica central del formulario de captura de leads
 * Versión: 1.0 · QPAlliance · 2026
 *
 * Responsabilidades:
 *  1. Carga de opciones dinámicas desde form-data.json
 *  2. Validación de todos los campos
 *  3. Construcción del payload estandarizado
 *  4. Envío al endpoint (con reintentos en error)
 *  5. Manejo de estados: idle → loading → success / error
 *  6. Respaldo local en localStorage si el endpoint falla
 *
 * Dependencias: utils.js (debe cargarse antes)
 */

'use strict';

// ============================================================
// CARGA DE OPCIONES DINÁMICAS
// ============================================================

/**
 * Carga form-data.json y puebla todos los dropdowns del formulario.
 * Muestra un overlay de carga mientras se obtienen los datos.
 * @param {string} dataUrl - Ruta al archivo form-data.json
 */
async function loadFormOptions(dataUrl) {
  const loader = document.getElementById('options-loader');
  if (loader) loader.classList.add('active');

  try {
    const res = await fetch(dataUrl, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status} al cargar ${dataUrl}`);

    const data = await res.json();

    // Indicativo del país
    populateSelect('indicativo', data.country_codes.map(c => ({
      value:   c.value,
      label:   c.label,
      default: c.default || false,
    })));

    // Industria
    populateSelect('industria',      data.industries);
    // Tamaño de empresa
    populateSelect('tamano_empresa', data.company_sizes);
    // Operarios de producción
    populateSelect('operarios',      data.production_operators);

    if (window.CONFIG?.DEBUG_MODE) {
      console.log('[Quanta] Opciones del formulario cargadas:', data);
    }

  } catch (err) {
    console.error('[Quanta] Error cargando form-data.json:', err);
    // Fallback: marcar cada select con error
    ['indicativo', 'industria', 'tamano_empresa', 'operarios'].forEach(id => {
      const s = document.getElementById(id);
      if (s) s.innerHTML = '<option value="" disabled selected>Error al cargar opciones — recarga la página</option>';
    });
  } finally {
    if (loader) loader.classList.remove('active');
  }
}

// ============================================================
// VALIDACIÓN DEL FORMULARIO
// ============================================================

/**
 * Ejecuta validación completa sobre todos los campos del formulario.
 * Muestra mensajes de error inline en los campos inválidos.
 * @param {FormData} formData
 * @returns {boolean} true si todos los campos son válidos
 */
function validateForm(formData) {
  let isValid = true;

  const rules = [
    {
      field: 'nombre', error: 'nombre-error',
      test:  v => v && v.length >= 3,
      msg:   'Ingresa tu nombre completo (mín. 3 caracteres)',
    },
    {
      field: 'empresa', error: 'empresa-error',
      test:  v => v && v.length >= 2,
      msg:   'Ingresa el nombre de tu empresa',
    },
    {
      field: 'indicativo', error: 'indicativo-error',
      test:  v => !!v,
      msg:   'Selecciona el indicativo del país',
    },
    {
      field: 'telefono', error: 'telefono-error',
      test:  v => validatePhone(v || ''),
      msg:   'Ingresa un número válido (7–15 dígitos)',
    },
    {
      field: 'email', error: 'email-error',
      test:  v => validateEmail(v || ''),
      msg:   'Ingresa un email corporativo válido',
    },
    {
      field: 'industria', error: 'industria-error',
      test:  v => !!v,
      msg:   'Selecciona tu industria',
    },
    {
      field: 'tamano_empresa', error: 'tamano-error',
      test:  v => !!v,
      msg:   'Selecciona el tamaño de tu empresa',
    },
    {
      field: 'operarios', error: 'operarios-error',
      test:  v => !!v,
      msg:   'Selecciona el número de operarios',
    },
  ];

  rules.forEach(({ field, error, test }) => {
    const raw   = formData.get(field);
    const value = typeof raw === 'string' ? raw.trim() : raw;
    const valid = test(value);
    toggleFieldError(field, error, !valid);
    if (!valid) isValid = false;
  });

  return isValid;
}

// ============================================================
// ESTADOS DEL FORMULARIO
// ============================================================

/**
 * Actualiza la UI del formulario según el estado actual.
 * @param {'idle'|'loading'|'success'|'error'} state
 */
function setFormState(state) {
  const form      = document.getElementById('lead-form');
  const success   = document.getElementById('form-success');
  const errorMsg  = document.getElementById('form-error');
  const submitBtn = document.getElementById('btn-submit');

  // Guardar referencia al texto original del botón
  if (!submitBtn.dataset.originalText) {
    submitBtn.dataset.originalText = submitBtn.textContent;
  }

  switch (state) {
    case 'loading':
      submitBtn.disabled  = true;
      submitBtn.innerHTML = '<span class="spinner"></span> Enviando...';
      if (errorMsg) errorMsg.style.display = 'none';
      break;

    case 'success':
      if (form)     form.style.display    = 'none';
      if (success)  success.style.display = 'block';
      if (errorMsg) errorMsg.style.display = 'none';
      if (success)  success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      break;

    case 'error':
      submitBtn.disabled    = false;
      submitBtn.textContent = submitBtn.dataset.originalText;
      if (errorMsg) errorMsg.style.display = 'block';
      break;

    default: // idle
      submitBtn.disabled    = false;
      submitBtn.textContent = submitBtn.dataset.originalText;
      if (errorMsg) errorMsg.style.display = 'none';
      break;
  }
}

// ============================================================
// ENVÍO DEL LEAD
// ============================================================

/**
 * Construye el payload estandarizado (contrato v1.0) y lo envía al endpoint.
 * En caso de fallo, guarda el lead en localStorage como respaldo.
 * @param {FormData} formData
 */
async function submitLead(formData) {
  const CONFIG = window.CONFIG || {};
  const utms   = getStoredUTMs();

  // Número completo: indicativo + número
  const indicativo      = formData.get('indicativo') || '';
  const telefonoRaw     = (formData.get('telefono') || '').trim();
  const telefonoFull    = `${indicativo} ${telefonoRaw}`.trim();

  // ── Payload estandarizado (schema v1.0) ─────────────────
  const payload = {
    schema_version: '1.0',
    timestamp:       new Date().toISOString(),
    source:          'landing_quanta',

    campaign: {
      name:         CONFIG.CAMPAIGN_NAME    || 'quanta-landing',
      utm_source:   utms.utm_source         || 'direct',
      utm_medium:   utms.utm_medium         || 'none',
      utm_campaign: utms.utm_campaign       || CONFIG.CAMPAIGN_NAME || '',
      utm_content:  utms.utm_content        || '',
      utm_term:     utms.utm_term           || '',
      gclid:        utms.gclid              || '',
      fbclid:       utms.fbclid             || '',
    },

    lead: {
      nombre:         (formData.get('nombre')  || '').trim(),
      empresa:        (formData.get('empresa') || '').trim(),
      indicativo:     indicativo,
      telefono:       telefonoFull,
      email:          (formData.get('email')   || '').trim(),
      industria:      formData.get('industria')      || '',
      tamano_empresa: formData.get('tamano_empresa') || '',
      operarios:      formData.get('operarios')      || '',
    },

    metadata: {
      landing_url:  window.location.href,
      referrer:     document.referrer || '',
      user_agent:   navigator.userAgent,
      session_id:   getOrCreateSessionId(),
      ip_hash:      '',  // Se resuelve en el backend
    },
  };

  if (CONFIG.DEBUG_MODE) {
    console.log('[Quanta] Payload:', JSON.stringify(payload, null, 2));
  }

  setFormState('loading');

  try {
    const endpoint = CONFIG.FORM_ENDPOINT;
    if (!endpoint || endpoint.includes('TU-ENDPOINT')) {
      throw new Error('FORM_ENDPOINT no configurado');
    }

    const res = await fetch(endpoint, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);

    setFormState('success');
    fireConversionPixels('Lead');

    if (CONFIG.DEBUG_MODE) console.log('[Quanta] Lead enviado OK ✓');

  } catch (err) {
    setFormState('error');
    console.error('[Quanta] Error al enviar lead:', err.message);

    // ── Respaldo local ──────────────────────────────────────
    try {
      const BACKUP_KEY = 'quanta_pending_leads';
      const pending    = JSON.parse(localStorage.getItem(BACKUP_KEY) || '[]');
      pending.push({ ...payload, _error: err.message, _retries: 0 });
      localStorage.setItem(BACKUP_KEY, JSON.stringify(pending));
      if (CONFIG.DEBUG_MODE) console.log('[Quanta] Lead guardado en respaldo local');
    } catch (storageErr) {
      console.warn('[Quanta] No se pudo guardar respaldo local:', storageErr);
    }
  }
}

// ============================================================
// INICIALIZACIÓN DEL FORMULARIO
// ============================================================

/**
 * Inicializa todos los listeners del formulario.
 * Llamar desde DOMContentLoaded en cada landing.
 */
function initForm() {
  // ── Validación en tiempo real del email ─────────────────
  const emailInput  = document.getElementById('email');
  const emailStatus = document.getElementById('email-status');

  if (emailInput && emailStatus) {
    emailInput.addEventListener('input', () => {
      const val = emailInput.value.trim();
      if (!val) {
        emailInput.classList.remove('valid', 'error');
        emailStatus.textContent = '';
        return;
      }
      if (validateEmail(val)) {
        emailInput.classList.add('valid');
        emailInput.classList.remove('error');
        emailStatus.textContent  = '✓';
        emailStatus.style.color  = '#2ECC71';
        const errEl = document.getElementById('email-error');
        if (errEl) errEl.classList.remove('visible');
      } else {
        emailInput.classList.add('error');
        emailInput.classList.remove('valid');
        emailStatus.textContent = '✕';
        emailStatus.style.color = '#FF6B6B';
      }
    });
  }

  // ── Submit ───────────────────────────────────────────────
  const leadForm = document.getElementById('lead-form');
  if (!leadForm) return;

  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(leadForm);
    if (validateForm(formData)) {
      await submitLead(formData);
    } else {
      // Scroll al primer campo con error
      const firstError = leadForm.querySelector('.form-input.error, .form-select.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // ── Limpiar errores al corregir ──────────────────────────
  leadForm.querySelectorAll('.form-input, .form-select').forEach(field => {
    field.addEventListener('input', () => {
      field.classList.remove('error');
      const errEl = document.getElementById(field.id + '-error');
      if (errEl) errEl.classList.remove('visible');
    });
  });
}
