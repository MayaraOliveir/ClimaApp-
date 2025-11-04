// app.js — estrutura simples, moderna e com boas práticas
// - Validação e normalização da entrada
// - Geocoding + previsão via Open‑Meteo
// - Estados de loading/erro
// - Sem dependências externas
// - Integra utilitário getCurrentWeatherByCity para uso didático

const UI = (() => {
  const els = {
    form: document.getElementById('weather-form'),
    input: document.getElementById('city'),
    status: document.getElementById('status'),
    result: document.getElementById('result'),
    locationName: document.getElementById('location-name'),
    updatedAt: document.getElementById('updated-at'),
    tempValue: document.getElementById('temp-value'),
  };

  const setStatus = (message, type = 'loading') => {
    els.status.innerHTML = message ? `<span class="${type}">${message}</span>` : '';
  };

  const showResult = ({ city, country, tempC, updatedAt }) => {
    els.locationName.textContent = country ? `${city}, ${country}` : city;
    els.updatedAt.textContent = `Atualizado: ${updatedAt}`;
    els.tempValue.textContent = Math.round(tempC);
    els.result.hidden = false;
  };

  const hideResult = () => { els.result.hidden = true; };

  return { els, setStatus, showResult, hideResult };
})();

// Importa utilitário para demonstração prática
import { getCurrentWeatherByCity } from './utils/weatherApi.js';

const OpenMeteo = (() => {
  const BASE_GEO = 'https://geocoding-api.open-meteo.com/v1/search';
  const BASE_METEO = 'https://api.open-meteo.com/v1/forecast';

  async function fetchJSON(url, options) {
    const res = await fetch(url, { ...options, headers: { 'Accept': 'application/json', ...(options?.headers || {}) } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  async function geocodeCity(city) {
    const url = new URL(BASE_GEO);
    url.searchParams.set('name', city);
    url.searchParams.set('count', '1');
    url.searchParams.set('language', 'pt');
    url.searchParams.set('format', 'json');

    const data = await fetchJSON(url.toString());
    if (!data?.results?.length) throw new Error('Cidade não encontrada.');

    const [{ latitude, longitude, name, country_code, country }] = data.results;
    return { lat: latitude, lon: longitude, name, countryCode: country_code, country };
  }

  async function fetchCurrentTemperature(lat, lon) {
    const url = new URL(BASE_METEO);
    url.searchParams.set('latitude', lat);
    url.searchParams.set('longitude', lon);
    url.searchParams.set('current', 'temperature_2m');
    url.searchParams.set('timezone', 'auto');

    const data = await fetchJSON(url.toString());
    const temp = data?.current?.temperature_2m;
    if (typeof temp !== 'number') throw new Error('Não foi possível obter a temperatura.');

    return { tempC: temp, timestamp: data?.current?.time };
  }

  return { geocodeCity, fetchCurrentTemperature };
})();

const Format = (() => {
  function formatUpdatedAt(isoString) {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat('pt-BR', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(d);
    } catch {
      return isoString || '';
    }
  }
  return { formatUpdatedAt };
})();

function sanitizeCity(input) {
  return input
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 80);
}

async function handleSearch(event) {
  event.preventDefault();
  UI.hideResult();

  const raw = UI.els.input.value || '';
  const city = sanitizeCity(raw);

  if (!city) {
    UI.setStatus('Informe uma cidade para buscar.', 'error');
    return;
  }

  UI.setStatus('Buscando clima...', 'loading');
  try {
    // Uso da função utilitária solicitada
    const payload = await getCurrentWeatherByCity(city);

    UI.showResult({
      city: payload.city,
      country: '',
      tempC: payload.temperatureC,
      updatedAt: new Date().toISOString(),
    });
    UI.setStatus(payload.description || 'Pronto', 'success');
  } catch (err) {
    console.error(err);
    const message = err?.message === 'Cidade não encontrada.'
      ? err.message
      : 'Não foi possível obter os dados. Tente novamente.';
    UI.setStatus(message, 'error');
  }
}

function init() {
  UI.els.form.addEventListener('submit', handleSearch);
  // UX: focar input ao carregar
  UI.els.input.focus();
}

document.addEventListener('DOMContentLoaded', init);
