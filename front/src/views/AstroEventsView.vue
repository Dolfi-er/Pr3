<template>
  <div class="astro-events-view">
    <!-- Заголовок -->
    <div class="text-center mb-5">
      <h1 class="h1-retro retro-glow mb-3">
        <i class="fas fa-star-and-crescent me-3"></i>
        ASTRONOMICAL EVENTS CALCULATOR
      </h1>
      <p class="text-muted retro-border d-inline-block px-3 py-2">
        <i class="fas fa-calendar-alt me-2"></i>
        SUN & MOON POSITIONS FOR ANY LOCATION
      </p>
    </div>

    <!-- Панель управления -->
    <div class="panel mb-4">
      <div class="row g-4">
        <div class="col-lg-8">
          <div class="metric mb-3">
            <div class="metric-label">SELECT LOCATION</div>
            <div class="row align-items-center">
              <div class="col-md-5 mb-3 mb-md-0">
                <div class="input-group">
                  <span class="input-group-text input-group-retro">
                    <i class="fas fa-map-marker-alt"></i>
                  </span>
                  <input 
                    type="number" 
                    class="form-control form-control-retro" 
                    v-model.number="location.lat"
                    placeholder="Latitude"
                    step="0.0001"
                    min="-90"
                    max="90"
                  />
                  <span class="input-group-text input-group-retro">°</span>
                </div>
              </div>
              <div class="col-md-5 mb-3 mb-md-0">
                <div class="input-group">
                  <span class="input-group-text input-group-retro">
                    <i class="fas fa-map-marker-alt"></i>
                  </span>
                  <input 
                    type="number" 
                    class="form-control form-control-retro" 
                    v-model.number="location.lon"
                    placeholder="Longitude"
                    step="0.0001"
                    min="-180"
                    max="180"
                  />
                  <span class="input-group-text input-group-retro">°</span>
                </div>
              </div>
              <div class="col-md-2">
                <button 
                  class="btn btn-retro w-100"
                  @click="useCurrentLocation"
                  :disabled="gettingLocation"
                >
                  <i class="fas fa-location-crosshairs"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="metric">
            <div class="metric-label">FORECAST PERIOD</div>
            <div class="d-flex align-items-center">
              <div class="flex-grow-1">
                <input 
                  type="range" 
                  class="form-range form-range-retro" 
                  v-model.number="days"
                  min="1"
                  max="30"
                  step="1"
                />
              </div>
              <div class="ms-3 text-center" style="min-width: 100px;">
                <div class="metric-value">{{ days }}</div>
                <div class="metric-label small">DAYS</div>
              </div>
            </div>
            <div class="d-flex justify-content-between mt-1">
              <small>1 day</small>
              <small>7 days</small>
              <small>14 days</small>
              <small>30 days</small>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="h-100 d-flex flex-column justify-content-between">
            <div class="metric mb-4">
              <div class="metric-label">QUICK LOCATIONS</div>
              <div class="d-flex flex-wrap gap-2 mt-2">
                <button 
                  v-for="loc in quickLocations" 
                  :key="loc.name"
                  class="btn btn-outline-primary btn-sm"
                  @click="setLocation(loc.lat, loc.lon)"
                >
                  {{ loc.name }}
                </button>
              </div>
            </div>

            <div class="d-grid">
              <button 
                class="btn btn-retro"
                @click="fetchEvents"
                :disabled="loading"
              >
                <i class="fas fa-satellite-dish me-2"></i>
                CALCULATE EVENTS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Состояние загрузки -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <div class="metric-value">QUERYING ASTRONOMY API...</div>
      <div class="small mt-2">Calculating positions for {{ location.lat }}°, {{ location.lon }}° over {{ days }} days</div>
    </div>

    <!-- Ошибка -->
    <div v-else-if="error" class="panel mb-4">
      <div class="alert alert-danger alert-retro mb-0">
        <i class="fas fa-exclamation-triangle me-2"></i>
        {{ error }}
        <button class="btn btn-sm btn-outline-light ms-3" @click="fetchEvents">
          <i class="fas fa-redo me-1"></i> RETRY
        </button>
      </div>
    </div>

    <!-- Результаты -->
    <div v-else-if="events.length > 0">
      <!-- Сводка -->
      <div class="panel mb-4">
        <div class="row align-items-center">
          <div class="col-md-6">
            <div class="d-flex align-items-center">
              <i class="fas fa-globe-americas fa-2x me-3" style="color: var(--primary-color)"></i>
              <div>
                <div class="metric-label">OBSERVATION POINT</div>
                <div class="metric-value">
                  {{ location.lat.toFixed(4) }}° N, {{ location.lon.toFixed(4) }}° E
                </div>
                <div class="small">
                  <i class="fas fa-calendar me-1"></i>
                  <template v-if="events[0]?.data?.data?.dates?.from && events[0]?.data?.data?.dates?.to">
                    {{ formatDate(events[0].data.data.dates.from) }} to {{ formatDate(events[0].data.data.dates.to) }}
                  </template>
                  <template v-else>
                    N/A to N/A
                  </template>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 text-end">
            <div class="metric">
              <div class="metric-label">BODIES TRACKED</div>
              <div class="d-flex justify-content-end gap-3">
                <div class="text-center">
                  <i class="fas fa-sun fa-2x" style="color: var(--warning-color)"></i>
                  <div class="small">SUN</div>
                </div>
                <div class="text-center">
                  <i class="fas fa-moon fa-2x" style="color: var(--text-color)"></i>
                  <div class="small">MOON</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Детали по каждому телу -->
      <div class="row g-4">
        <div 
          v-for="event in events" 
          :key="event.body"
          class="col-md-6"
        >
          <div class="panel h-100">
            <div class="d-flex align-items-center mb-3">
              <div class="me-3">
                <i 
                  :class="event.body === 'sun' ? 'fas fa-sun fa-2x' : 'fas fa-moon fa-2x'"
                  :style="{ color: event.body === 'sun' ? 'var(--warning-color)' : 'var(--text-color)' }"
                ></i>
              </div>
              <div>
                <h4 class="retro-glow mb-0">{{ event.body.toUpperCase() }}</h4>
                <div class="small text-muted">{{ getBodyDescription(event.body) }}</div>
              </div>
            </div>

            <div class="metric mb-3">
              <div class="metric-label">OBSERVATION PERIOD</div>
              <div class="d-flex justify-content-between">
                <div>
                  <div class="small">FROM</div>
                  <div class="metric-value small">{{ formatDateShort(event.data?.data?.dates?.from) }}</div>
                </div>
                <div>
                  <div class="small">TO</div>
                  <div class="metric-value small">{{ formatDateShort(event.data?.data?.dates?.to) }}</div>
                </div>
              </div>
            </div>

            <!-- Данные таблицы -->
            <div v-if="hasTableData(event)" class="metric mb-3">
              <div class="metric-label">CALCULATED EVENTS</div>
              
              <!-- Заголовки таблицы -->
              <div v-if="event.data?.data?.table?.header && event.data.data.table.header.length > 0" class="table-responsive">
                <table class="table table-sm table-retro mb-0">
                  <thead>
                    <tr>
                      <th v-for="(header, idx) in event.data.data.table.header" :key="idx">
                        {{ header }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(row, rowIdx) in (event.data.data.table.rows || [])" :key="rowIdx">
                      <td v-for="(cell, cellIdx) in (row.cells || [])" :key="cellIdx">
                        {{ cell }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Если данных нет -->
              <div v-else class="text-center py-4">
                <i class="fas fa-info-circle fa-2x mb-3" style="color: var(--secondary-color)"></i>
                <div class="metric-value">NO EVENT DATA</div>
                <div class="small mt-2">
                  {{ event.body === 'sun' ? 'Sun position data not available' : 'Moon phase data not available' }}
                </div>
              </div>
            </div>

            <!-- Raw данные для отладки -->
            <div class="mt-3">
              <button 
                class="btn btn-sm btn-outline-primary w-100"
                @click="toggleRawData(event.body)"
              >
                <i class="fas fa-code me-1"></i>
                {{ showRawData[event.body] ? 'HIDE' : 'SHOW' }} RAW DATA
              </button>
              
              <div v-if="showRawData[event.body]" class="mt-3">
                <div class="metric-label mb-2">API RESPONSE</div>
                <pre class="bg-dark p-3 rounded small overflow-auto" style="max-height: 300px;">
{{ JSON.stringify(event, null, 2) }}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Информационная панель -->
      <div class="panel mt-4">
        <h4 class="retro-glow mb-3">
          <i class="fas fa-info-circle me-2"></i>
          ABOUT ASTRONOMICAL EVENTS
        </h4>
        <div class="row">
          <div class="col-md-6">
            <div class="metric mb-3">
              <div class="metric-label">SUN EVENTS</div>
              <ul class="small mb-0">
                <li><strong>Sunrise/Sunset:</strong> Daily times when sun appears/disappears</li>
                <li><strong>Solar Noon:</strong> When sun reaches highest point</li>
                <li><strong>Twilight:</strong> Civil, nautical, astronomical periods</li>
                <li><strong>Day Length:</strong> Duration between sunrise and sunset</li>
              </ul>
            </div>
          </div>
          <div class="col-md-6">
            <div class="metric mb-3">
              <div class="metric-label">MOON EVENTS</div>
              <ul class="small mb-0">
                <li><strong>Moonrise/Moonset:</strong> Daily appearance/disappearance</li>
                <li><strong>Moon Phase:</strong> New, waxing, full, waning cycles</li>
                <li><strong>Lunar Distance:</strong> Distance from Earth (varies)</li>
                <li><strong>Illumination:</strong> Percentage of visible surface</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Начальный экран -->
    <div v-else-if="!loading && events.length === 0 && !error" class="panel text-center py-5">
      <i class="fas fa-star-and-crescent fa-3x mb-3" style="color: var(--primary-color)"></i>
      <div class="metric-value">READY FOR CALCULATION</div>
      <div class="small mt-2">
        Set your location and time period, then click "Calculate Events" to get astronomical data
      </div>
      <div class="mt-4">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="metric">
              <div class="metric-label">CURRENT SETTINGS</div>
              <div class="d-flex justify-content-center gap-4 mt-2">
                <div>
                  <div class="small">LATITUDE</div>
                  <div class="metric-value">{{ location.lat.toFixed(4) }}°</div>
                </div>
                <div>
                  <div class="small">LONGITUDE</div>
                  <div class="metric-value">{{ location.lon.toFixed(4) }}°</div>
                </div>
                <div>
                  <div class="small">DAYS</div>
                  <div class="metric-value">{{ days }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import spaceService from '@/services/space.service'
import dayjs from 'dayjs'

interface AstroEvent {
  body: string
  data: {
    data?: {
      dates?: {
        from: string
        to: string
      }
      observer?: {
        location: {
          longitude: number
          latitude: number
          elevation: number
        }
      }
      table?: {
        header: string[]
        rows: Array<{
          cells: string[]
        }>
      }
    }
  }
}

// Состояния
const events = ref<AstroEvent[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const gettingLocation = ref(false)
const showRawData = ref<Record<string, boolean>>({
  sun: false,
  moon: false
})

// Настройки местоположения и времени
const location = ref({
  lat: 55.7558,  // Москва по умолчанию
  lon: 37.6176
})

const days = ref(7)

// Быстрые локации
const quickLocations = ref([
  { name: 'Moscow', lat: 55.7558, lon: 37.6176 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'NYC', lat: 40.7128, lon: -74.0060 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 }
])

// Методы
const fetchEvents = async () => {
  try {
    loading.value = true
    error.value = null
    events.value = []

    const response = await spaceService.getAstroEvents(
      location.value.lat,
      location.value.lon,
      days.value
    )

    if (Array.isArray(response)) {
      events.value = response
    } else if (response.body) {
      // Если ответ приходит в другом формате
      events.value = [response]
    }

    // Сбрасываем показ raw данных
    showRawData.value = { sun: false, moon: false }

  } catch (err: any) {
    console.error('Error fetching astro events:', err)
    error.value = err.message || 'Failed to fetch astronomical events'
    events.value = []
  } finally {
    loading.value = false
  }
}

const useCurrentLocation = () => {
  if (!navigator.geolocation) {
    error.value = 'Geolocation is not supported by your browser'
    return
  }

  gettingLocation.value = true
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      location.value.lat = position.coords.latitude
      location.value.lon = position.coords.longitude
      gettingLocation.value = false
      fetchEvents()
    },
    (err) => {
      error.value = `Unable to retrieve location: ${err.message}`
      gettingLocation.value = false
    }
  )
}

const setLocation = (lat: number, lon: number) => {
  location.value.lat = lat
  location.value.lon = lon
  fetchEvents()
}

const toggleRawData = (body: string) => {
  showRawData.value[body] = !showRawData.value[body]
}

const hasTableData = (event: AstroEvent): boolean => {
  const table = event.data?.data?.table
  if (!table) return false
  
  // Проверяем, есть ли строки с данными
  return table.rows?.some(row => row.cells?.length > 0) || false
}

const getBodyDescription = (body: string): string => {
  return body === 'sun' 
    ? 'Solar position, sunrise/sunset, day length' 
    : 'Lunar phases, moonrise/moonset, illumination'
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A'
  return dayjs(dateString).format('YYYY-MM-DD HH:mm')
}

const formatDateShort = (dateString?: string): string => {
  if (!dateString) return 'N/A'
  return dayjs(dateString).format('MMM DD')
}

// Наблюдатели
watch([location, days], () => {
  // Сбрасываем данные при изменении параметров
  events.value = []
})

// Жизненный цикл
onMounted(() => {
  // Автоматически загружаем данные для местоположения по умолчанию
  fetchEvents()
})
</script>

<style scoped>
.astro-events-view {
  position: relative;
}

.input-group-retro {
  background: rgba(16, 16, 32, 0.8);
  border: 1px solid var(--primary-color);
  color: var(--text-color);
  border-radius: 0;
}

.input-group-retro:focus-within {
  border-color: var(--secondary-color);
  box-shadow: 0 0 10px var(--primary-color);
}

.form-range-retro {
  height: 1.5rem;
  padding: 0;
  background: transparent;
}

.form-range-retro::-webkit-slider-runnable-track {
  height: 0.5rem;
  background: linear-gradient(90deg, 
    var(--primary-color) 0%, 
    var(--secondary-color) 100%);
  border-radius: 0.25rem;
  border: 1px solid var(--primary-color);
}

.form-range-retro::-webkit-slider-thumb {
  width: 1.5rem;
  height: 1.5rem;
  margin-top: -0.5rem;
  background: var(--accent-color);
  border: 2px solid var(--primary-color);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px var(--accent-color);
}

.alert-retro {
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid #dc3545;
  border-radius: 0;
  color: #f8d7da;
  backdrop-filter: blur(10px);
}

pre {
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  line-height: 1.4;
  background: rgba(0, 0, 0, 0.7) !important;
  border: 1px solid rgba(0, 255, 255, 0.2);
}

.table-retro th {
  background: rgba(0, 255, 255, 0.1);
  border-bottom: 2px solid var(--primary-color);
}

.table-retro td {
  border-color: rgba(0, 255, 255, 0.1);
}

.spinner-border {
  --bs-spinner-width: 3rem;
  --bs-spinner-height: 3rem;
  --bs-spinner-border-width: 0.25em;
  --bs-spinner-animation-speed: 0.75s;
}
</style>