<template>
  <div class="iss-view">
    <!-- Заголовок -->
    <div class="text-center mb-5">
      <h1 class="h1-retro retro-glow mb-3">
        <i class="fas fa-satellite me-3"></i>
        ISS TRACKING STATION
      </h1>
      <p class="text-muted retro-border d-inline-block px-3 py-2">
        <i class="fas fa-map-marked-alt me-2"></i>
        REAL-TIME ORBITAL MONITORING
      </p>
    </div>

    <!-- Основные метрики -->
    <div class="row mb-4">
      <div class="col-md-8">
        <div class="panel">
          <div class="row">
            <div class="col-md-6">
              <div class="metric mb-4">
                <div class="metric-label">CURRENT POSITION</div>
                <div class="d-flex align-items-center">
                  <i class="fas fa-globe-americas fa-2x me-3" style="color: var(--primary-color)"></i>
                  <div>
                    <div class="metric-value">{{ formattedLat }}°</div>
                    <div class="small">LATITUDE</div>
                  </div>
                  <div class="mx-3">|</div>
                  <div>
                    <div class="metric-value">{{ formattedLon }}°</div>
                    <div class="small">LONGITUDE</div>
                  </div>
                </div>
              </div>

              <div class="metric mb-4">
                <div class="metric-label">ORBITAL PARAMETERS</div>
                <div class="row">
                  <div class="col-6">
                    <div class="small">ALTITUDE</div>
                    <div class="metric-value">{{ issAltitude || '--' }} km</div>
                  </div>
                  <div class="col-6">
                    <div class="small">VELOCITY</div>
                    <div class="metric-value">{{ issVelocity || '--' }} km/h</div>
                  </div>
                </div>
              </div>

              <div class="metric mb-4">
                <div class="metric-label">STATION STATUS</div>
                <div class="row">
                  <div class="col-6">
                    <div class="small">VISIBILITY</div>
                    <div class="metric-value text-warning">{{ visibilityStatus }}</div>
                  </div>
                  <div class="col-6">
                    <div class="small">FOOTPRINT</div>
                    <div class="metric-value">{{ footprint || '--' }} km</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="position-relative world-map" style="height: 250px;">
                <!-- Упрощенная карта с позицией ISS -->
                <div class="world-outline"></div>
                <div 
                  class="iss-marker" 
                  :style="issMarkerStyle"
                  @mouseenter="showMarkerInfo = true"
                  @mouseleave="showMarkerInfo = false"
                >
                  <i class="fas fa-satellite"></i>
                  <div v-if="showMarkerInfo" class="marker-tooltip">
                    ISS Position<br>
                    Lat: {{ formattedLat }}°<br>
                    Lon: {{ formattedLon }}°
                  </div>
                </div>
                
                <!-- Континенты -->
                <div class="continent na" title="North America"></div>
                <div class="continent sa" title="South America"></div>
                <div class="continent eu" title="Europe"></div>
                <div class="continent af" title="Africa"></div>
                <div class="continent as" title="Asia"></div>
                <div class="continent au" title="Australia"></div>
                
                <!-- Легенда -->
                <div class="map-legend">
                  <div class="legend-item">
                    <span class="legend-dot" style="background: var(--primary-color);"></span>
                    <span class="legend-text">ISS Position</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-dot" style="background: var(--success-color);"></span>
                    <span class="legend-text">Day Side</span>
                  </div>
                  <div class="legend-item">
                    <span class="legend-dot" style="background: var(--dark-bg);"></span>
                    <span class="legend-text">Night Side</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="panel mb-4">
          <h4 class="retro-glow mb-3">
            <i class="fas fa-chart-line me-2"></i>
            MOVEMENT TREND
          </h4>
          <div v-if="trend" class="metric">
            <div class="metric-label">STATUS</div>
            <div class="metric-value" :class="trend.movement ? 'text-success' : 'text-warning'">
              {{ trend.movement ? 'MOVING' : 'STATIONARY' }}
            </div>
            
            <div class="mt-3">
              <div class="small text-muted mb-1">LAST MOVEMENT</div>
              <div class="d-flex justify-content-between">
                <div>
                  <div class="very-small">Distance</div>
                  <div class="metric-value">{{ trend.deltaKm?.toFixed(2) || '0.00' }} km</div>
                </div>
                <div>
                  <div class="very-small">Time</div>
                  <div class="metric-value">{{ trend.dtSec?.toFixed(0) || '0' }} sec</div>
                </div>
                <div>
                  <div class="very-small">Speed</div>
                  <div class="metric-value">{{ trend.velocityKmh?.toFixed(0) || '0' }} km/h</div>
                </div>
              </div>
            </div>
            
            <div v-if="trend.fromTime && trend.toTime" class="mt-3">
              <div class="small text-muted mb-1">TIME FRAME</div>
              <div class="very-small">
                {{ formatTime(trend.fromTime) }} → {{ formatTime(trend.toTime) }}
              </div>
            </div>

            <div v-if="trend.fromLat && trend.fromLon && trend.toLat && trend.toLon" class="mt-3">
              <div class="small text-muted mb-1">COORDINATE CHANGE</div>
              <div class="very-small">
                {{ trend.fromLat?.toFixed(4) || '0' }}°N, {{ trend.fromLon?.toFixed(4) || '0' }}°W<br>
                ↓<br>
                {{ trend.toLat?.toFixed(4) || '0' }}°N, {{ trend.toLon?.toFixed(4) || '0' }}°W
              </div>
            </div>
          </div>
          <div v-else class="text-center py-4">
            <i class="fas fa-sync fa-spin me-2"></i>
            Loading trend data...
          </div>
        </div>

        <div class="panel">
          <h4 class="retro-glow mb-3">
            <i class="fas fa-sun me-2"></i>
            SOLAR POSITION
          </h4>
          <div class="metric">
            <div class="row">
              <div class="col-6">
                <div class="metric-label">SOLAR LAT</div>
                <div class="metric-value">{{ solarLat?.toFixed(2) || '--' }}°</div>
              </div>
              <div class="col-6">
                <div class="metric-label">SOLAR LON</div>
                <div class="metric-value">{{ solarLon?.toFixed(2) || '--' }}°</div>
              </div>
            </div>
          </div>
          <div class="mt-3">
            <div class="metric-label">DAY NUMBER</div>
            <div class="metric-value">{{ dayNum?.toFixed(2) || '--' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Контрольные панели -->
    <div class="row">
      <div class="col-md-6">
        <div class="panel mb-4">
          <h4 class="retro-glow mb-3">
            <i class="fas fa-history me-2"></i>
            RECENT DATA
          </h4>
          <div class="table-responsive">
            <table class="table table-retro">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Altitude</th>
                  <th>Velocity</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(log, index) in recentLogs" :key="index">
                  <td>{{ formatTimeShort(log.fetchedAt) }}</td>
                  <td>{{ parsePosition(log.payload)?.latitude?.toFixed(4) || '--' }}°</td>
                  <td>{{ parsePosition(log.payload)?.longitude?.toFixed(4) || '--' }}°</td>
                  <td>{{ parsePosition(log.payload)?.altitude?.toFixed(2) || '--' }} km</td>
                  <td>{{ parsePosition(log.payload)?.velocity?.toFixed(0) || '--' }} km/h</td>
                </tr>
                <tr v-if="recentLogs.length === 0">
                  <td colspan="5" class="text-center py-3">No data available</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="panel mb-4">
          <h4 class="retro-glow mb-3">
            <i class="fas fa-cogs me-2"></i>
            CONTROLS
          </h4>
          
          <div class="row g-3">
            <div class="col-md-6">
              <button 
                class="btn btn-retro w-100 d-flex flex-column align-items-center py-3"
                @click="fetchCurrent"
                :disabled="loading.current"
              >
                <i class="fas fa-download fa-2x mb-2"></i>
                <div>FETCH CURRENT</div>
                <small class="mt-1">Get live position</small>
              </button>
            </div>
            
            <div class="col-md-6">
              <button 
                class="btn btn-retro w-100 d-flex flex-column align-items-center py-3"
                @click="refreshData"
                :disabled="loading.refresh"
              >
                <i class="fas fa-sync-alt fa-2x mb-2"></i>
                <div>REFRESH DATA</div>
                <small class="mt-1">Update all data</small>
              </button>
            </div>
            
            <div class="col-md-12">
              <div class="metric mt-3">
                <div class="metric-label">AUTO REFRESH</div>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="form-check form-switch">
                    <input 
                      class="form-check-input" 
                      type="checkbox" 
                      v-model="autoRefresh"
                      id="autoRefreshSwitch"
                    >
                    <label class="form-check-label" for="autoRefreshSwitch">
                      {{ autoRefresh ? 'ENABLED' : 'DISABLED' }}
                    </label>
                  </div>
                  <div v-if="autoRefresh" class="small text-info">
                    Next update in {{ countdown }}s
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-4">
            <h5 class="mb-3"><i class="fas fa-info-circle me-2"></i>INFORMATION</h5>
            <div class="small">
              <p><i class="fas fa-rocket me-2"></i> The International Space Station orbits Earth at ~400 km altitude</p>
              <p><i class="fas fa-bolt me-2"></i> Speed: ~27,600 km/h (7.66 km/s)</p>
              <p><i class="fas fa-globe me-2"></i> Orbits Earth every 90 minutes</p>
              <p><i class="fas fa-eye me-2"></i> Visibility indicates if ISS is in sunlight or Earth's shadow</p>
              <p v-if="trend?.dtSec" class="text-info">
                <i class="fas fa-chart-line me-2"></i>
                Last movement: {{ trend.deltaKm?.toFixed(2) }} km in {{ trend.dtSec?.toFixed(0) }} seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Статус системы -->
    <div class="row">
      <div class="col-12">
        <div class="panel">
          <h4 class="retro-glow mb-3">
            <i class="fas fa-server me-2"></i>
            SYSTEM STATUS
          </h4>
          <div class="row">
            <div class="col-md-3 col-sm-6 mb-3">
              <div class="metric text-center">
                <div class="mb-2">
                  <i class="fas fa-database fa-2x" :class="dbStatusClass"></i>
                </div>
                <div class="metric-label">DATABASE</div>
                <div class="metric-value">{{ dbStatus }}</div>
              </div>
            </div>
            
            <div class="col-md-3 col-sm-6 mb-3">
              <div class="metric text-center">
                <div class="mb-2">
                  <i class="fas fa-wifi fa-2x" :class="apiStatusClass"></i>
                </div>
                <div class="metric-label">API CONNECTION</div>
                <div class="metric-value">{{ apiStatus }}</div>
              </div>
            </div>
            
            <div class="col-md-3 col-sm-6 mb-3">
              <div class="metric text-center">
                <div class="mb-2">
                  <i class="fas fa-clock fa-2x" style="color: var(--accent-color)"></i>
                </div>
                <div class="metric-label">LAST UPDATE</div>
                <div class="metric-value">{{ lastUpdate || '--:--:--' }}</div>
              </div>
            </div>
            
            <div class="col-md-3 col-sm-6 mb-3">
              <div class="metric text-center">
                <div class="mb-2">
                  <i class="fas fa-history fa-2x" style="color: var(--secondary-color)"></i>
                </div>
                <div class="metric-label">DATA POINTS</div>
                <div class="metric-value">{{ dataPoints || '0' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useSpaceStore } from '@/stores/space.store'
import spaceService from '@/services/space.service'
import dayjs from 'dayjs'

const store = useSpaceStore()

// Состояния
const showMarkerInfo = ref(false)
const autoRefresh = ref(true)
const countdown = ref(30)
const lastUpdate = ref<string>('')
const dataPoints = ref<number>(0)
const loading = ref({
  current: false,
  refresh: false
})

const recentLogs = ref<any[]>([])

// Таймеры - инициализируем как undefined
let refreshTimer: number | undefined = undefined
let countdownTimer: number | undefined = undefined

// Компьютеды
const position = computed(() => store.issPosition)
const trend = computed(() => store.issTrend)

const formattedLat = computed(() => position.value?.latitude?.toFixed(4) || '--.--')
const formattedLon = computed(() => position.value?.longitude?.toFixed(4) || '--.--')
const issAltitude = computed(() => position.value?.altitude?.toFixed(2))
const issVelocity = computed(() => position.value?.velocity?.toFixed(0))
const visibilityStatus = computed(() => position.value?.visibility || 'UNKNOWN')
const footprint = computed(() => position.value?.footprint?.toFixed(0))
const solarLat = computed(() => position.value?.solar_lat)
const solarLon = computed(() => position.value?.solar_lon)
const dayNum = computed(() => position.value?.daynum)

const dbStatus = computed(() => recentLogs.value.length > 0 ? 'ONLINE' : 'OFFLINE')
const dbStatusClass = computed(() => ({
  'text-success': recentLogs.value.length > 0,
  'text-danger': recentLogs.value.length === 0
}))

const apiStatus = computed(() => store.error ? 'ERROR' : 'CONNECTED')
const apiStatusClass = computed(() => ({
  'text-success': !store.error,
  'text-danger': store.error
}))

// Стиль маркера на карте
const issMarkerStyle = computed(() => {
  if (!position.value) return {}
  
  // Преобразуем координаты в позицию на карте
  const lat = position.value.latitude
  const lon = position.value.longitude
  
  // Простая проекция для упрощенной карты
  const x = 50 + (lon / 360) * 100
  const y = 50 - (lat / 180) * 100
  
  return {
    left: `${Math.min(95, Math.max(5, x))}%`,
    top: `${Math.min(95, Math.max(5, y))}%`,
    transform: 'translate(-50%, -50%)'
  }
})

// Методы
const fetchCurrent = async () => {
  try {
    loading.value.current = true
    await spaceService.getIssCurrent()
    await refreshData()
  } catch (error) {
    console.error('Error fetching current ISS:', error)
  } finally {
    loading.value.current = false
  }
}

const refreshData = async () => {
  try {
    loading.value.refresh = true
    await store.fetchIssData()
    
    // Симулируем получение логов (в реальном приложении был бы отдельный endpoint)
    recentLogs.value = [
      {
        fetchedAt: new Date().toISOString(),
        payload: JSON.stringify(position.value || {})
      },
      {
        fetchedAt: dayjs().subtract(1, 'minute').toISOString(),
        payload: JSON.stringify({
          latitude: (position.value?.latitude || 0) - 0.5,
          longitude: (position.value?.longitude || 0) - 0.5,
          altitude: (position.value?.altitude || 0) + 0.1
        })
      },
      {
        fetchedAt: dayjs().subtract(2, 'minute').toISOString(),
        payload: JSON.stringify({
          latitude: (position.value?.latitude || 0) - 1,
          longitude: (position.value?.longitude || 0) - 1,
          altitude: (position.value?.altitude || 0) - 0.1
        })
      }
    ]
    
    dataPoints.value = recentLogs.value.length
    lastUpdate.value = dayjs().format('HH:mm:ss')
  } catch (error) {
    console.error('Error refreshing ISS data:', error)
  } finally {
    loading.value.refresh = false
  }
}

const formatTime = (time: string | Date) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}

const formatTimeShort = (time: string | Date) => {
  return dayjs(time).format('HH:mm:ss')
}

const parsePosition = (payload: string) => {
  try {
    return JSON.parse(payload)
  } catch {
    return null
  }
}

// Автообновление
const startAutoRefresh = () => {
  // Очищаем старые таймеры
  if (refreshTimer !== undefined) {
    clearInterval(refreshTimer)
  }
  if (countdownTimer !== undefined) {
    clearInterval(countdownTimer)
  }
  
  countdown.value = 30
  
  countdownTimer = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      countdown.value = 30
      refreshData()
    }
  }, 1000)
}

const stopAutoRefresh = () => {
  if (refreshTimer !== undefined) {
    clearInterval(refreshTimer)
    refreshTimer = undefined
  }
  if (countdownTimer !== undefined) {
    clearInterval(countdownTimer)
    countdownTimer = undefined
  }
}

// Наблюдатели
watch(autoRefresh, (newVal) => {
  if (newVal) {
    startAutoRefresh()
  } else {
    stopAutoRefresh()
  }
})

// Жизненный цикл
onMounted(() => {
  refreshData()
  if (autoRefresh.value) {
    startAutoRefresh()
  }
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
.iss-view {
  position: relative;
}

.world-map {
  background: linear-gradient(
    135deg,
    rgba(0, 20, 40, 0.9) 0%,
    rgba(0, 40, 80, 0.9) 100%
  );
  border: 2px solid var(--primary-color);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.world-outline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 30% 40%, rgba(0, 150, 100, 0.1) 2%, transparent 4%),
    radial-gradient(circle at 70% 30%, rgba(0, 150, 100, 0.1) 3%, transparent 5%),
    radial-gradient(circle at 20% 70%, rgba(0, 150, 100, 0.1) 2%, transparent 4%),
    radial-gradient(circle at 80% 60%, rgba(0, 150, 100, 0.1) 3%, transparent 5%);
}

.continent {
  position: absolute;
  background: rgba(0, 100, 50, 0.2);
  border: 1px solid rgba(0, 200, 100, 0.3);
  border-radius: 2px;
}

.continent.na { top: 20%; left: 15%; width: 20%; height: 15%; }
.continent.sa { top: 50%; left: 20%; width: 15%; height: 25%; }
.continent.eu { top: 25%; left: 45%; width: 10%; height: 10%; }
.continent.af { top: 40%; left: 45%; width: 15%; height: 25%; }
.continent.as { top: 15%; left: 65%; width: 25%; height: 25%; }
.continent.au { top: 65%; left: 80%; width: 15%; height: 15%; }

.iss-marker {
  position: absolute;
  width: 30px;
  height: 30px;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--dark-bg);
  font-size: 12px;
  z-index: 10;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px var(--primary-color), 0 0 20px var(--primary-color);
  animation: pulse 2s infinite;
}

.iss-marker:hover {
  transform: translate(-50%, -50%) scale(1.2);
  box-shadow: 0 0 20px var(--primary-color), 0 0 40px var(--primary-color);
}

.marker-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid var(--primary-color);
  padding: 8px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  z-index: 100;
  margin-bottom: 10px;
}

.map-legend {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 8px;
  border-radius: 4px;
  border: 1px solid rgba(0, 255, 255, 0.3);
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}

.legend-item:last-child {
  margin-bottom: 0;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}

.legend-text {
  font-size: 11px;
  color: var(--text-color);
}

.very-small {
  font-size: 0.8rem;
  color: var(--text-color);
  opacity: 0.8;
}

.form-check-input:checked {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.form-check-input {
  width: 3em;
  height: 1.5em;
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 10px var(--primary-color), 0 0 20px var(--primary-color);
  }
  50% {
    box-shadow: 0 0 15px var(--primary-color), 0 0 30px var(--primary-color);
  }
}

.table-retro {
  font-size: 0.9rem;
}

.table-retro th {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.table-retro td {
  vertical-align: middle;
}

.text-info {
  color: var(--primary-color) !important;
}
</style>