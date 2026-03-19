/**
 * utils.js — Utilidades generales Quanta Landing Pages
 * Versión: 1.0 · QPAlliance · 2026
 *
 * Funciones puras y reutilizables entre campañas.
 * Sin dependencias externas. Sin side effects al importar.
 */

'use strict';

// ============================================================
// SESSION
// ============================================================

/**
 * Genera o recupera un session ID único para tracking.
 * Se persiste en sessionStorage durante la sesión del navegador.
 * @returns {string} Session ID con formato "qs_[timestamp]_[random]"
 */
function getOrCreateSessionId() {
  const KEY = 'quanta_session_id';
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = 'qs_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem(KEY, id);
  }
  return id;
}

// ============================================================
// UTM TRACKING
// ============================================================

/**
 * Captura todos los parámetros UTM y tracking desde la URL actual.
 * @param {string} campaignName - Nombre por defecto si utm_campaign no está presente
 * @returns {Object} Objeto con todos los parámetros de tracking
 */
function getUTMs(campaignName = 'quanta-landing') {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source:   params.get('utm_source')   || 'direct',
    utm_medium:   params.get('utm_medium')   || 'none',
    utm_campaign: params.get('utm_campaign') || campaignName,
    utm_content:  params.get('utm_content')  || '',
    utm_term:     params.get('utm_term')     || '',
    gclid:        params.get('gclid')        || '',
    fbclid:       params.get('fbclid')       || '',
  };
}

/**
 * Persiste los UTMs en sessionStorage para mantenerlos entre pasos/páginas.
 * Debe llamarse al inicio de cada página (DOMContentLoaded).
 * @param {string} campaignName
 */
function persistUTMs(campaignName) {
  const utms = getUTMs(campaignName);
  sessionStorage.setItem('quanta_utms', JSON.stringify(utms));
  return utms;
}

/**
 * Recupera los UTMs persistidos. Si no existen, los captura de la URL.
 * @returns {Object}
 */
function getStoredUTMs() {
  try {
    return JSON.parse(sessionStorage.getItem('quanta_utms') || '{}');
  } catch {
    return {};
  }
}

// ============================================================
// VALIDACIÓN
// ============================================================

/**
 * Valida estructura de un email.
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email);
}

/**
 * Valida un número de teléfono (solo dígitos, espacios, guión y +).
 * @param {string} phone
 * @returns {boolean}
 */
function validatePhone(phone) {
  return /^[0-9\s\-\+]{7,15}$/.test(phone);
}

// ============================================================
// DOM
// ============================================================

/**
 * Muestra o esconde el estado de error de un campo del formulario.
 * @param {string} inputId  - ID del input/select
 * @param {string} errorId  - ID del span de error
 * @param {boolean} show    - true para mostrar, false para ocultar
 */
function toggleFieldError(inputId, errorId, show) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (!input || !error) return;
  if (show) {
    input.classList.add('error');
    input.classList.remove('valid');
    error.classList.add('visible');
  } else {
    input.classList.remove('error');
    error.classList.remove('visible');
  }
}

/**
 * Puebla un elemento <select> con opciones desde un array.
 * @param {string} selectId
 * @param {Array<{value: string, label: string, disabled?: boolean, default?: boolean}>} options
 */
function populateSelect(selectId, options) {
  const select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = '';
  options.forEach(opt => {
    const el = document.createElement('option');
    el.value    = opt.value;
    el.text     = opt.label;
    el.disabled = !!opt.disabled;
    el.selected = !!(opt.default || opt.value === '');
    select.appendChild(el);
  });
}

// ============================================================
// PIXEL EVENTS
// ============================================================

/**
 * Dispara eventos de conversión en Meta Pixel y Google Analytics
 * si están disponibles en la página.
 * @param {string} eventName - Nombre del evento (ej: 'Lead')
 */
function fireConversionPixels(eventName = 'Lead') {
  if (typeof fbq !== 'undefined')  fbq('track', eventName);
  if (typeof gtag !== 'undefined') gtag('event', 'generate_lead');
}

// ============================================================
// EXPORTS (para uso como módulo ES6 si aplica)
// ============================================================
// Si el proyecto evoluciona a usar módulos ES6 o un bundler,
// descomentar las siguientes líneas:
//
// export {
//   getOrCreateSessionId,
//   getUTMs,
//   persistUTMs,
//   getStoredUTMs,
//   validateEmail,
//   validatePhone,
//   toggleFieldError,
//   populateSelect,
//   fireConversionPixels,
// };
