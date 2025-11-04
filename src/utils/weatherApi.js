/**
 * src/utils/weatherApi.js
 * Utilitário que:
 * - Faz geocoding + clima atual via Open‑Meteo
 * - Mapeia weather_code para descrição em PT-BR e condição semântica
 * - Retorna um tema visual moderno (imagem de fundo, gradiente, cores) conforme o clima
 *
 * Retorno principal: {
 *   city, temperatureC, description,
 *   condition, // 'clear' | 'cloud' | 'rain' | 'snow' | 'fog' | 'thunderstorm' | 'drizzle' | 'hail' | 'unknown'
 *   visualTheme: {
 *     backgroundImage, // URL (ex.: Unsplash) com query responsiva
 *     gradientOverlay, // CSS linear-gradient para contraste
 *     textColor,       // cor de texto recomendada
 *     accentColor,     // cor de destaque (botões/links)
 *     iconHint         // slug para seu sistema de ícones (opcional)
 *   }
 * }
 */

/**
 * src/utils/weatherApi.js
 * Utilitário que:
 * - Faz geocoding + clima atual via Open‑Meteo
 * - Mapeia weather_code para descrição em PT-BR e condição semântica
 * - Retorna um tema visual moderno (imagem de fundo, gradiente, cores) conforme o clima
 *
 * Retorno principal: {
 *   city, temperatureC, description,
 *   condition, // 'clear' | 'cloud' | 'rain' | 'snow' | 'fog' | 'thunderstorm' | 'drizzle' | 'hail' | 'unknown'
 *   visualTheme: {
 *     backgroundImage, // URL de background (use CDN própria em produção)
 *     gradientOverlay, // CSS linear-gradient para contraste do texto
 *     textColor,       // cor de texto recomendada
 *     accentColor,     // cor de destaque (botões/links)
 *     iconHint         // slug para seu sistema de ícones (opcional)
 *   }
 * }
 */

function describeWeatherCode(code) {
  const map = {
    0: 'Céu limpo',
    1: 'Principalmente limpo',
    2: 'Parcialmente nublado',
    3: 'Nublado',
    45: 'Nevoeiro',
    48: 'Nevoeiro com geada',
    51: 'Garoa fraca',
    53: 'Garoa moderada',
    55: 'Garoa intensa',
    56: 'Garoa congelante fraca',
    57: 'Garoa congelante intensa',
    61: 'Chuva fraca',
    63: 'Chuva moderada',
    65: 'Chuva intensa',
    66: 'Chuva congelante fraca',
    67: 'Chuva congelante intensa',
    71: 'Neve fraca',
    73: 'Neve moderada',
    75: 'Neve intensa',
    77: 'Grãos de neve',
    80: 'Aguaceiros fracos',
    81: 'Aguaceiros moderados',
    82: 'Aguaceiros violentos',
    85: 'Aguaceiros de neve fracos',
    86: 'Aguaceiros de neve fortes',
    95: 'Trovoadas',
    96: 'Trovoadas com granizo fraco',
    99: 'Trovoadas com granizo forte',
  };
  return map[code] ?? 'Condição desconhecida';
}

/**
 * Mapeia weather_code da Open‑Meteo para uma condição semântica única
 * para simplificar temas e ícones.
 */
function mapWeatherCodeToCondition(code) {
  if (code === 0 || code === 1) return 'clear';
  if (code === 2 || code === 3) return 'cloud';
  if ([45, 48].includes(code)) return 'fog';
  if ([51, 53, 55, 56, 57].includes(code)) return 'drizzle';
  if ([61, 63, 65, 80, 81, 82].includes(code)) return 'rain';
  if ([66, 67].includes(code)) return 'hail';
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
  if ([95, 96, 99].includes(code)) return 'thunderstorm';
  return 'unknown';
}

/**
 * Gera tema visual moderno conforme a condição.
 * Dica: troque para assets locais/CDN própria em produção para evitar hotlink.
 */
function getVisualThemeByWeather(condition) {
  const themes = {
    clear: {
      query: 'clear sky sunrise minimal aesthetic',
      textColor: '#0B1221',
      accentColor: '#2563EB',
      gradient: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.00) 60%)',
      iconHint: 'sun',
    },
    cloud: {
      query: 'overcast clouds soft light minimal',
      textColor: '#0B1221',
      accentColor: '#0EA5E9',
      gradient: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.00) 60%)',
      iconHint: 'cloud',
    },
    fog: {
      query: 'foggy landscape moody minimal',
      textColor: '#0B1221',
      accentColor: '#14B8A6',
      gradient: 'linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.00) 60%)',
      iconHint: 'fog',
    },
    drizzle: {
      query: 'light drizzle rain street reflections minimal',
      textColor: '#0B1221',
      accentColor: '#22D3EE',
      gradient: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.00) 60%)',
      iconHint: 'drizzle',
    },
    rain: {
      query: 'heavy rain storm city night neon minimal',
      textColor: '#F8FAFC',
      accentColor: '#60A5FA',
      gradient: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.05) 70%)',
      iconHint: 'rain',
    },
    hail: {
      query: 'ice rain hail storm dramatic minimal',
      textColor: '#F8FAFC',
      accentColor: '#93C5FD',
      gradient: 'linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.06) 70%)',
      iconHint: 'hail',
    },
    snow: {
      query: 'snowfall serene winter minimal',
      textColor: '#0B1221',
      accentColor: '#3B82F6',
      gradient: 'linear-gradient(180deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.00) 60%)',
      iconHint: 'snow',
    },
    thunderstorm: {
      query: 'thunderstorm lightning dramatic night minimal',
      textColor: '#F8FAFC',
      accentColor: '#A78BFA',
      gradient: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.10) 70%)',
      iconHint: 'thunder',
    },
    unknown: {
      query: 'abstract gradient minimal background',
      textColor: '#0B1221',
      accentColor: '#06B6D4',
      gradient: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.00) 60%)',
      iconHint: 'question',
    },
  };

  const t = themes[condition] || themes.unknown;

  // Placeholder de imagem responsiva (recomendado trocar por assets seus)
  const backgroundImage = `https://images.unsplash.com/photo-149${Math.floor(
    Math.random() * 9000 + 1000
  )}-?auto=format&fit=crop&w=1920&q=75&ixid=weather-app&keyword=${encodeURIComponent(
    t.query
  )}`;

  return {
    backgroundImage,
    gradientOverlay: t.gradient,
    textColor: t.textColor,
    accentColor: t.accentColor,
    iconHint: t.iconHint,
  };
}

function sanitizeCity(input) {
  return String(input || '').trim().replace(/\s+/g, ' ').slice(0, 100);
}

async function getCurrentWeatherByCity(cityName) {
  if (typeof cityName !== 'string') {
    throw new TypeError('cityName deve ser uma string.');
  }
  const city = sanitizeCity(cityName);
  if (!city) {
    throw new Error('Informe um nome de cidade válido.');
  }

  const fetchJSON = async (url) => {
    let res;
    try {
      res = await fetch(url, { headers: { Accept: 'application/json' } });
    } catch {
      throw new Error('Falha de rede ao tentar conectar à API.');
    }
    if (!res.ok) {
      throw new Error(`Falha na API (${res.status}).`);
    }
    return res.json();
  };

  // 1) Geocoding
  const geoUrl = new URL('https://geocoding-api.open-meteo.com/v1/search');
  geoUrl.searchParams.set('name', city);
  geoUrl.searchParams.set('count', '1');
  geoUrl.searchParams.set('language', 'pt');
  geoUrl.searchParams.set('format', 'json');

  const geoData = await fetchJSON(geoUrl.toString());
  if (!geoData?.results?.length) {
    throw new Error('Cidade não encontrada.');
  }
  const { name, country, country_code: countryCode, latitude, longitude } = geoData.results[0];

  // 2) Clima atual
  const weatherUrl = new URL('https://api.open-meteo.com/v1/forecast');
  weatherUrl.searchParams.set('latitude', latitude);
  weatherUrl.searchParams.set('longitude', longitude);
  weatherUrl.searchParams.set('current', 'temperature_2m,weather_code');
  weatherUrl.searchParams.set('timezone', 'auto');

  const weatherData = await fetchJSON(weatherUrl.toString());
  const temp = weatherData?.current?.temperature_2m;
  const code = weatherData?.current?.weather_code;
  if (typeof temp !== 'number') {
    throw new Error('Não foi possível obter a temperatura atual.');
  }

  const description = describeWeatherCode(typeof code === 'number' ? code : -1);
  const condition = mapWeatherCodeToCondition(typeof code === 'number' ? code : -1);
  const visualTheme = getVisualThemeByWeather(condition);

  return {
    city: country ? `${name}, ${country}` : `${name}${countryCode ? ', ' + countryCode : ''}`,
    temperatureC: temp,
    description,
    condition,
    visualTheme,
  };
}

export {
  getCurrentWeatherByCity,
  describeWeatherCode,
  mapWeatherCodeToCondition,
  getVisualThemeByWeather,
};