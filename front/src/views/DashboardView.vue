<template>
  <div class="dashboard-view">
    <!-- Заголовок с анимированными эффектами -->
    <div class="text-center mb-5">
      <h1 class="h1-retro retro-glow mb-3">
        <i class="fas fa-tachometer-alt me-3"></i>
        MISSION CONTROL DASHBOARD
      </h1>
      <p class="text-muted retro-border d-inline-block px-3 py-2">
        <i class="fas fa-satellite me-2"></i>
        REAL-TIME SPACE MONITORING SYSTEM
      </p>
    </div>

    <!-- Быстрая статистика -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="panel">
          <div class="row">
            <div class="col-md-3 col-sm-6 mb-3">
              <div class="metric text-center">
                <div class="mb-2">
                  <i class="fas fa-globe-americas fa-2x" style="color: var(--primary-color)"></i>
                </div>
                <div class="metric-label">ISS ALTITUDE</div>
                <div class="metric-value">{{ issAltitude || '--.--' }} km</div>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mb-3">
              <div class="metric text-center">
                <div class="mb-2">
                  <i class="fas fa-bolt fa-2x" style="color: var(--secondary-color)"></i>
                </div>
                <div class="metric-label">TELEMETRY STATUS</div>
                <div class="metric-value" :class="telemetryStatusClass">
                  {{ telemetryStatus }}
                </div>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mb-3">
              <div class="metric text-center">
                <div class="mb-2">
                  <i class="fas fa-sun fa-2x" style="color: var(--accent-color)"></i>
                </div>
                <div class="metric-label">ACTIVE EVENTS</div>
                <div class="metric-value">{{ activeEvents || '0' }}</div>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mb-3">
              <div class="metric text-center">
                <div class="mb-2">
                  <i class="fas fa-database fa-2x" style="color: var(--success-color)"></i>
                </div>
                <div class="metric-label">DATA POINTS</div>
                <div class="metric-value">{{ dataPoints || '---' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Основные виджеты -->
    <div class="row">
      <!-- Левая колонка -->
      <div class="col-lg-8">
        <!-- Карта ISS -->
        <div class="panel mb-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="retro-glow mb-0">
              <i class="fas fa-satellite me-2"></i>
              INTERNATIONAL SPACE STATION
            </h3>
            <span class="badge bg-warning text-dark" v-if="issTrend?.Movement">
              <i class="fas fa-running me-1"></i> MOVING
            </span>
          </div>
          
          <div class="row">
            <div class="col-md-6">
              <div class="metric mb-3">
                <div class="row">
                  <div class="col-6">
                    <div class="metric-label">LATITUDE</div>
                    <div class="metric-value">{{ issCoordinates?.lat?.toFixed(4) || '--.--' }}°</div>
                  </div>
                  <div class="col-6">
                    <div class="metric-label">LONGITUDE</div>
                    <div class="metric-value">{{ issCoordinates?.lng?.toFixed(4) || '--.--' }}°</div>
                  </div>
                </div>
              </div>
              
              <div class="metric mb-3">
                <div class="row">
                  <div class="col-6">
                    <div class="metric-label">VELOCITY</div>
                    <div class="metric-value">{{ issVelocity?.toFixed(0) || '--' }} km/h</div>
                  </div>
                  <div class="col-6">
                    <div class="metric-label">VISIBILITY</div>
                    <div class="metric-value">{{ issPosition?.visibility || '--' }}</div>
                  </div>
                </div>
              </div>
              
              <div class="d-grid">
                <button class="btn btn-retro" @click="refreshIss">
                  <i class="fas fa-sync-alt me-2"></i> UPDATE TRACKING
                </button>
              </div>
            </div>
            
            <div class="col-md-6">
              <div class="position-relative" style="height: 200px; background: rgba(0,0,0,0.3);">
                <div class="position-absolute top-50 start-50 translate-middle text-center">
                  <i class="fas fa-globe-americas fa-4x" style="color: rgba(0, 255, 255, 0.3)"></i>
                  <div class="mt-2">
                    <i class="fas fa-circle fa-lg" style="color: var(--warning-color)"></i>
                    <div class="small">ISS POSITION</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Быстрые данные -->
        <div class="row">
          <div class="col-md-6 mb-4">
            <div class="panel h-100">
              <h4 class="retro-glow mb-3">
                <i class="fas fa-meteor me-2"></i>
                NEO TRACKER
              </h4>
              <div v-if="spaceData.neo" class="metric">
                <div class="metric-label">NEAR EARTH OBJECTS</div>
                <div class="metric-value">{{ neoCount || '--' }} objects</div>
              </div>
              <div v-else class="text-center py-4">
                <i class="fas fa-sync fa-spin me-2"></i>
                Loading NEO data...
              </div>
            </div>
          </div>
          
          <div class="col-md-6 mb-4">
            <div class="panel h-100">
              <h4 class="retro-glow mb-3">
                <i class="fas fa-sun me-2"></i>
                SOLAR ACTIVITY
              </h4>
              <div class="metric">
                <div class="metric-label">SOLAR FLARES</div>
                <div class="metric-value">{{ solarFlares || '--' }} today</div>
              </div>
              <div class="metric mt-2">
                <div class="metric-label">CME EVENTS</div>
                <div class="metric-value">{{ cmeEvents || '--' }} detected</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Правая колонка -->
      <div class="col-lg-4">
        <!-- APOD -->
        <div class="panel mb-4">
          <h4 class="retro-glow mb-3">
            <i class="fas fa-star me-2"></i>
            ASTRONOMY PICTURE
          </h4>
          <div v-if="apodData" class="text-center">
            <div class="mb-3 position-relative">
              <img 
                :src="apodData.url" 
                :alt="apodData.title"
                class="img-fluid retro-border"
                style="max-height: 200px; object-fit: cover;"
                v-if="apodData.media_type === 'image'"
              >
              <div v-else class="py-5 retro-border">
                <i class="fas fa-video fa-3x mb-3"></i>
                <div>Video Content Available</div>
              </div>
              <div class="position-absolute top-0 end-0 m-2">
                <span class="badge" :class="apodData.source === 'Redis' ? 'bg-success' : 'bg-info'">
                  {{ apodData.source }}
                </span>
              </div>
            </div>
            <div class="metric">
              <div class="metric-label">{{ apodData.title }}</div>
              <div class="small">{{ apodData.date }}</div>
            </div>
            <router-link to="/apod" class="btn btn-retro btn-sm mt-3">
              <i class="fas fa-expand me-1"></i> VIEW FULLSCREEN
            </router-link>
          </div>
          <div v-else class="text-center py-4">
            <i class="fas fa-sync fa-spin me-2"></i>
            Loading APOD...
          </div>
        </div>

        <!-- Системный статус -->
        <div class="panel">
          <h4 class="retro-glow mb-3">
            <i class="fas fa-server me-2"></i>
            SYSTEM STATUS
          </h4>
          <div class="list-group list-group-flush">
            <div class="list-group-item bg-transparent border-secondary d-flex justify-content-between align-items-center">
              <span><i class="fas fa-database me-2"></i> Database</span>
              <span class="badge bg-success">ONLINE</span>
            </div>
            <div class="list-group-item bg-transparent border-secondary d-flex justify-content-between align-items-center">
              <span><i class="fas fa-broadcast-tower me-2"></i> Telemetry</span>
              <span class="badge" :class="telemetryBadgeClass">{{ telemetryStatus }}</span>
            </div>
            <div class="list-group-item bg-transparent border-secondary d-flex justify-content-between align-items-center">
              <span><i class="fas fa-satellite-dish me-2"></i> API Connections</span>
              <span class="badge bg-info">{{ apiConnections || '8' }}/10</span>
            </div>
            <div class="list-group-item bg-transparent border-secondary d-flex justify-content-between align-items-center">
              <span><i class="fas fa-clock me-2"></i> Last Update</span>
              <span class="text-info">{{ lastUpdate }}</span>
            </div>
          </div>
          <div class="d-grid gap-2 mt-3">
            <button class="btn btn-retro btn-sm" @click="refreshAll">
              <i class="fas fa-sync-alt me-1"></i> REFRESH ALL SYSTEMS
            </button>
            <router-link to="/telemetry" class="btn btn-outline-primary btn-sm">
              <i class="fas fa-chart-line me-1"></i> DETAILED METRICS
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Быстрые действия -->
    <div class="row mt-4">
      <div class="col-12">
        <div class="panel">
          <h4 class="retro-glow mb-3">
            <i class="fas fa-rocket me-2"></i>
            QUICK ACTIONS
          </h4>
          <div class="row g-3">
            <div class="col-md-2 col-sm-4 col-6" v-for="action in quickActions" :key="action.name">
              <router-link 
                :to="action.route" 
                class="btn btn-retro d-flex flex-column align-items-center justify-content-center p-3"
                style="height: 100px;"
              >
                <i :class="action.icon" class="fa-2x mb-2"></i>
                <div class="small">{{ action.name }}</div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useSpaceStore } from '@/stores/space.store'
import spaceService from '@/services/space.service'
import dayjs from 'dayjs'

const store = useSpaceStore()

// Состояния
const issAltitude = ref<number | null>(null)
const activeEvents = ref<number>(3)
const dataPoints = ref<number>(15420)
const solarFlares = ref<number>(2)
const cmeEvents = ref<number>(1)
const apiConnections = ref<number>(8)
const lastUpdate = ref<string>('Just now')

// Быстрые действия
const quickActions = [
  { name: 'ISS Tracker', route: '/iss', icon: 'fas fa-satellite' },
  { name: 'JWST Feed', route: '/jwst', icon: 'fas fa-hubble' },
  { name: 'Space Weather', route: '/space', icon: 'fas fa-wind' },
  { name: 'Astro Events', route: '/astro', icon: 'fas fa-moon' },
  { name: 'Telemetry', route: '/telemetry', icon: 'fas fa-microchip' },
  { name: 'OSDR Data', route: '/space', icon: 'fas fa-database' }
]

// Компьютеды
const issPosition = computed(() => store.issPosition)
const issCoordinates = computed(() => store.issCoordinates)
const issVelocity = computed(() => store.issVelocity)
const issTrend = computed(() => store.issTrend)
const apodData = computed(() => store.apodData)
const spaceData = computed(() => store.spaceData)

const telemetryStatus = computed(() => {
  const telem = spaceData.value['telemetry']
  if (!telem) return 'UNKNOWN'
  const data = JSON.parse(telem.payload || '{}')
  return data.isOk ? 'NOMINAL' : 'WARNING'
})

const telemetryStatusClass = computed(() => ({
  'text-success': telemetryStatus.value === 'NOMINAL',
  'text-warning': telemetryStatus.value === 'WARNING',
  'text-danger': telemetryStatus.value === 'UNKNOWN'
}))

const telemetryBadgeClass = computed(() => ({
  'bg-success': telemetryStatus.value === 'NOMINAL',
  'bg-warning': telemetryStatus.value === 'WARNING',
  'bg-danger': telemetryStatus.value === 'UNKNOWN'
}))

const neoCount = computed(() => {
  const neo = spaceData.value['neo']
  if (!neo) return null
  try {
    const data = JSON.parse(neo.payload || '{}')
    return data.element_count || 0
  } catch {
    return 0
  }
})

// Методы
const refreshIss = async () => {
  await store.fetchIssData()
  updateAltitude()
  lastUpdate.value = dayjs().format('HH:mm:ss')
}

const refreshApod = async () => {
  await store.fetchApod()
}

const refreshAll = async () => {
  await Promise.all([
    store.fetchIssData(),
    store.fetchApod(),
    store.fetchAllSpaceData()
  ])
  updateAltitude()
  lastUpdate.value = dayjs().format('HH:mm:ss')
}

const updateAltitude = () => {
  if (issPosition.value) {
    issAltitude.value = parseFloat(issPosition.value.altitude.toFixed(2))
  }
}

// Жизненный цикл
onMounted(async () => {
  await refreshAll()
  
  // Авто-обновление каждые 30 секунд
  const interval = setInterval(() => {
    refreshIss()
  }, 30000)
  
  onUnmounted(() => clearInterval(interval))
})
</script>

<style scoped>
.dashboard-view {
  position: relative;
}

.metric-label {
  font-size: 0.85rem;
  color: var(--text-color);
  opacity: 0.8;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.list-group-item {
  background: transparent !important;
  color: var(--text-color) !important;
  border-color: rgba(0, 255, 255, 0.2) !important;
}

.badge {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  letter-spacing: 1px;
}

.position-relative {
  border: 1px solid rgba(0, 255, 255, 0.2);
  background: linear-gradient(45deg, transparent, rgba(0, 255, 255, 0.05));
}

.btn-outline-primary {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.btn-outline-primary:hover {
  background: var(--primary-color);
  color: var(--dark-bg);
}
</style>