<template>
  <div class="telemetry-view">
    <!-- Заголовок -->
    <div class="text-center mb-5">
      <h1 class="h1-retro retro-glow mb-3">
        <i class="fas fa-microchip me-3"></i>
        TELEMETRY MONITORING SYSTEM
      </h1>
      <p class="text-muted retro-border d-inline-block px-3 py-2">
        <i class="fas fa-chart-line me-2"></i>
        REAL-TIME SYSTEM DIAGNOSTICS & METRICS
      </p>
    </div>

    <!-- Статусная панель -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="panel">
          <div class="row">
            <div class="col-md-3 col-sm-6 mb-3">
              <div class="metric text-center">
                <div class="mb-2">
                  <i class="fas fa-bolt fa-2x" style="color: var(--primary-color)"></i>
                </div>
                <div class="metric-label">VOLTAGE STATUS</div>
                <div class="metric-value" :class="voltageStatusClass">
                  {{ voltageStatus }}
                </div>
              </div>
            </div>
            
            <div class="col-md-3 col-sm-6 mb-3">
              <div class="metric text-center">
                <div class="mb-2">
                  <i class="fas fa-thermometer-half fa-2x" style="color: var(--secondary-color)"></i>
                </div>
                <div class="metric-label">TEMPERATURE</div>
                <div class="metric-value" :class="tempStatusClass">
                  {{ avgTemp?.toFixed(1) || '--' }}°C
                </div>
              </div>
            </div>
            
            <div class="col-md-3 col-sm-6 mb-3">
              <div class="metric text-center">
                <div class="mb-2">
                  <i class="fas fa-check-circle fa-2x" style="color: var(--success-color)"></i>
                </div>
                <div class="metric-label">SYSTEM HEALTH</div>
                <div class="metric-value">{{ healthPercentage }}% OK</div>
              </div>
            </div>
            
            <div class="col-md-3 col-sm-6 mb-3">
              <div class="metric text-center">
                <div class="mb-2">
                  <i class="fas fa-database fa-2x" style="color: var(--accent-color)"></i>
                </div>
                <div class="metric-label">DATA POINTS</div>
                <div class="metric-value">{{ telemetryData.length }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Основные графики и метрики -->
    <div class="row mb-4">
      <!-- Левая колонка - графики -->
      <div class="col-lg-8">
        <div class="panel mb-4">
          <h4 class="retro-glow mb-3">
            <i class="fas fa-chart-area me-2"></i>
            VOLTAGE TREND
          </h4>
          <div class="chart-container" style="height: 250px;">
            <div class="chart-placeholder" v-if="telemetryData.length === 0">
              <i class="fas fa-chart-line fa-3x mb-3" style="color: var(--primary-color)"></i>
              <div class="metric-value">NO DATA AVAILABLE</div>
            </div>
            <div v-else class="chart-content">
              <!-- Упрощенный линейный график напряжения -->
              <div class="voltage-chart">
                <div class="chart-grid">
                  <div class="grid-line" v-for="n in 5" :key="'grid-' + n" 
                       :style="{ bottom: (n * 20) + '%' }"></div>
                </div>
                <div class="chart-line" :style="{ height: '100%' }">
                  <div 
                    v-for="(point, index) in voltageChartPoints" 
                    :key="'voltage-' + index"
                    class="chart-point"
                    :style="{
                      left: (index * (100 / (voltageChartPoints.length - 1))) + '%',
                      bottom: (point.voltage * 100) + '%'
                    }"
                    :title="'Voltage: ' + point.voltage.toFixed(2) + 'V'"
                  >
                    <div class="point-tooltip">
                      {{ point.voltage.toFixed(2) }}V<br>
                      {{ point.time }}
                    </div>
                  </div>
                </div>
                <div class="chart-axis">
                  <div class="y-axis">
                    <div class="y-label" v-for="n in 6" :key="'y-' + n">
                      {{ (n * 2).toFixed(1) }}V
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="panel h-100">
              <h4 class="retro-glow mb-3">
                <i class="fas fa-wave-square me-2"></i>
                VOLTAGE STATISTICS
              </h4>
              <div class="metric mb-2">
                <div class="d-flex justify-content-between">
                  <span>Current</span>
                  <span class="metric-value">{{ currentVoltage?.toFixed(2) || '--' }}V</span>
                </div>
              </div>
              <div class="metric mb-2">
                <div class="d-flex justify-content-between">
                  <span>Average</span>
                  <span class="metric-value">{{ avgVoltage?.toFixed(2) || '--' }}V</span>
                </div>
              </div>
              <div class="metric mb-2">
                <div class="d-flex justify-content-between">
                  <span>Min</span>
                  <span class="metric-value">{{ minVoltage?.toFixed(2) || '--' }}V</span>
                </div>
              </div>
              <div class="metric">
                <div class="d-flex justify-content-between">
                  <span>Max</span>
                  <span class="metric-value">{{ maxVoltage?.toFixed(2) || '--' }}V</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="panel h-100">
              <h4 class="retro-glow mb-3">
                <i class="fas fa-temperature-high me-2"></i>
                TEMPERATURE STATISTICS
              </h4>
              <div class="metric mb-2">
                <div class="d-flex justify-content-between">
                  <span>Current</span>
                  <span class="metric-value">{{ currentTemp?.toFixed(1) || '--' }}°C</span>
                </div>
              </div>
              <div class="metric mb-2">
                <div class="d-flex justify-content-between">
                  <span>Average</span>
                  <span class="metric-value">{{ avgTemp?.toFixed(1) || '--' }}°C</span>
                </div>
              </div>
              <div class="metric mb-2">
                <div class="d-flex justify-content-between">
                  <span>Min</span>
                  <span class="metric-value">{{ minTemp?.toFixed(1) || '--' }}°C</span>
                </div>
              </div>
              <div class="metric">
                <div class="d-flex justify-content-between">
                  <span>Max</span>
                  <span class="metric-value">{{ maxTemp?.toFixed(1) || '--' }}°C</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Правая колонка - статус и управление -->
      <div class="col-lg-4">
        <div class="panel mb-4">
          <h4 class="retro-glow mb-3">
            <i class="fas fa-clipboard-list me-2"></i>
            SYSTEM STATUS
          </h4>
          <div class="list-group list-group-flush">
            <div class="list-group-item bg-transparent border-secondary d-flex justify-content-between align-items-center">
              <span><i class="fas fa-power-off me-2"></i> Power Supply</span>
              <span class="badge" :class="voltageBadgeClass">{{ voltageStatus }}</span>
            </div>
            <div class="list-group-item bg-transparent border-secondary d-flex justify-content-between align-items-center">
              <span><i class="fas fa-thermometer me-2"></i> Thermal Control</span>
              <span class="badge" :class="tempBadgeClass">{{ tempStatus }}</span>
            </div>
            <div class="list-group-item bg-transparent border-secondary d-flex justify-content-between align-items-center">
              <span><i class="fas fa-file-alt me-2"></i> Log Files</span>
              <span class="badge bg-info">{{ telemetryData.length }} files</span>
            </div>
            <div class="list-group-item bg-transparent border-secondary d-flex justify-content-between align-items-center">
              <span><i class="fas fa-clock me-2"></i> Last Update</span>
              <span class="text-info">{{ lastUpdate }}</span>
            </div>
            <div class="list-group-item bg-transparent border-secondary d-flex justify-content-between align-items-center">
              <span><i class="fas fa-history me-2"></i> Update Interval</span>
              <span class="text-muted">Every 5 min</span>
            </div>
          </div>
          
          <div class="mt-4">
            <h5 class="mb-3"><i class="fas fa-cogs me-2"></i>CONTROLS</h5>
            <div class="row g-2">
              <div class="col-6">
                <button class="btn btn-retro w-100" @click="refreshData" :disabled="loading">
                  <i class="fas fa-sync-alt me-1"></i> REFRESH
                </button>
              </div>
              <div class="col-6">
                <button class="btn btn-retro w-100" @click="generateNewData" :disabled="loading">
                  <i class="fas fa-plus me-1"></i> GENERATE
                </button>
              </div>
              <div class="col-12 mt-2">
                <div class="form-check form-switch">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    v-model="autoRefresh"
                    id="telemetryAutoRefresh"
                  >
                  <label class="form-check-label" for="telemetryAutoRefresh">
                    <i class="fas fa-robot me-1"></i> AUTO REFRESH
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel">
          <h4 class="retro-glow mb-3">
            <i class="fas fa-exclamation-triangle me-2"></i>
            ALERTS & WARNINGS
          </h4>
          <div v-if="alerts.length > 0">
            <div 
              v-for="(alert, index) in alerts" 
              :key="index"
              class="alert-item mb-2 p-2"
              :class="alertClass(alert.type)"
            >
              <div class="d-flex align-items-center">
                <i :class="alertIcon(alert.type)" class="me-2"></i>
                <div>
                  <div class="small fw-bold">{{ alert.title }}</div>
                  <div class="very-small">{{ alert.message }}</div>
                </div>
                <span class="ms-auto small">{{ alert.time }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-center py-3">
            <i class="fas fa-check-circle fa-2x mb-2" style="color: var(--success-color)"></i>
            <div class="small">No active alerts</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Таблица данных -->
    <div class="panel mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="retro-glow mb-0">
          <i class="fas fa-table me-2"></i>
          TELEMETRY DATA LOG
        </h4>
        <div class="d-flex align-items-center">
          <span class="me-3 small">Show:</span>
          <select class="form-select form-select-retro-sm w-auto" v-model="itemsPerPage">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>
      
      <div class="table-responsive">
        <table class="table table-retro">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Status</th>
              <th>Voltage (V)</th>
              <th>Temperature (°C)</th>
              <th>Source File</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedData" :key="item.id">
              <td>{{ formatDateTime(item.timestamp) }}</td>
              <td>
                <span class="badge" :class="item.isOk ? 'bg-success' : 'bg-danger'">
                  {{ item.isOk ? 'OK' : 'FAIL' }}
                </span>
              </td>
              <td>
                <span :class="getVoltageClass(item.voltage)">
                  {{ item.voltage.toFixed(2) }}
                </span>
              </td>
              <td>
                <span :class="getTempClass(item.temp)">
                  {{ item.temp.toFixed(1) }}
                </span>
              </td>
              <td class="font-monospace small">{{ item.sourceFile }}</td>
              <td>
                <button class="btn btn-sm btn-outline-primary" @click="viewDetails(item)">
                  <i class="fas fa-eye"></i>
                </button>
              </td>
            </tr>
            <tr v-if="telemetryData.length === 0">
              <td colspan="6" class="text-center py-5">
                <i class="fas fa-database fa-2x mb-3" style="color: var(--secondary-color)"></i>
                <div class="metric-value">NO TELEMETRY DATA</div>
                <div class="small mt-2">Generate or wait for telemetry data collection</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Пагинация -->
      <div v-if="telemetryData.length > 0" class="d-flex justify-content-between align-items-center mt-3">
        <div class="small">
          Showing {{ startItem }}-{{ endItem }} of {{ telemetryData.length }} records
        </div>
        <nav aria-label="Page navigation">
          <ul class="pagination pagination-sm mb-0">
            <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
              <button class="page-link page-link-retro" @click="prevPage">
                <i class="fas fa-chevron-left"></i>
              </button>
            </li>
            <li 
              v-for="page in visiblePages" 
              :key="page"
              class="page-item" 
              :class="{ 'active': page === currentPage }"
            >
              <button 
                class="page-link page-link-retro" 
                @click="goToPage(page)"
                :disabled="typeof page === 'string'"
              >
                {{ page }}
              </button>
            </li>
            <li class="page-item" :class="{ 'disabled': currentPage >= totalPages }">
              <button class="page-link page-link-retro" @click="nextPage">
                <i class="fas fa-chevron-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <!-- Модальное окно деталей -->
    <div v-if="selectedItem" class="modal fade show d-block modal-retro" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title retro-glow">
              <i class="fas fa-info-circle me-2"></i>
              TELEMETRY DETAILS
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="selectedItem = null"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <div class="metric mb-3">
                  <div class="metric-label">TIMESTAMP</div>
                  <div class="metric-value">{{ formatDateTimeFull(selectedItem.timestamp) }}</div>
                </div>
                
                <div class="metric mb-3">
                  <div class="metric-label">SYSTEM STATUS</div>
                  <div class="metric-value">
                    <span class="badge" :class="selectedItem.isOk ? 'bg-success' : 'bg-danger'">
                      {{ selectedItem.isOk ? 'SYSTEM NOMINAL' : 'SYSTEM FAILURE' }}
                    </span>
                  </div>
                </div>
                
                <div class="metric mb-3">
                  <div class="metric-label">SOURCE FILE</div>
                  <div class="metric-value small font-monospace">{{ selectedItem.sourceFile }}</div>
                </div>
              </div>
              
              <div class="col-md-6">
                <div class="metric mb-3">
                  <div class="metric-label">VOLTAGE READING</div>
                  <div class="d-flex align-items-center">
                    <div class="voltage-display me-3" :class="getVoltageClass(selectedItem.voltage)">
                      {{ selectedItem.voltage.toFixed(2) }}V
                    </div>
                    <div>
                      <div class="very-small">Status: {{ getVoltageStatus(selectedItem.voltage) }}</div>
                      <div class="very-small">Range: 3.2V - 12.6V</div>
                    </div>
                  </div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">TEMPERATURE READING</div>
                  <div class="d-flex align-items-center">
                    <div class="temp-display me-3" :class="getTempClass(selectedItem.temp)">
                      {{ selectedItem.temp.toFixed(1) }}°C
                    </div>
                    <div>
                      <div class="very-small">Status: {{ getTempStatus(selectedItem.temp) }}</div>
                      <div class="very-small">Range: -50°C - 80°C</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="mt-4">
              <h6><i class="fas fa-chart-bar me-2"></i>METRICS COMPARISON</h6>
              <div class="row">
                <div class="col-md-6">
                  <div class="progress-container mb-3">
                    <div class="d-flex justify-content-between mb-1">
                      <span class="small">Voltage Level</span>
                      <span class="small">{{ selectedItem.voltage.toFixed(2) }}V</span>
                    </div>
                    <div class="progress progress-retro">
                      <div 
                        class="progress-bar" 
                        :class="getVoltageClass(selectedItem.voltage)"
                        :style="{ width: voltagePercentage + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="progress-container mb-3">
                    <div class="d-flex justify-content-between mb-1">
                      <span class="small">Temperature</span>
                      <span class="small">{{ selectedItem.temp.toFixed(1) }}°C</span>
                    </div>
                    <div class="progress progress-retro">
                      <div 
                        class="progress-bar" 
                        :class="getTempClass(selectedItem.temp)"
                        :style="{ width: tempPercentage + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-retro" @click="downloadCSV(selectedItem)">
              <i class="fas fa-file-csv me-2"></i> EXPORT CSV
            </button>
            <button class="btn btn-outline-primary" @click="selectedItem = null">
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Затемнение фона для модального окна -->
    <div v-if="selectedItem" class="modal-backdrop fade show" @click="selectedItem = null"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import dayjs from 'dayjs'

interface TelemetryItem {
  id: number
  timestamp: string
  isOk: boolean
  voltage: number
  temp: number
  sourceFile: string
}

interface Alert {
  type: 'success' | 'warning' | 'danger'
  title: string
  message: string
  time: string
}

// Состояния
const telemetryData = ref<TelemetryItem[]>([])
const loading = ref(false)
const selectedItem = ref<TelemetryItem | null>(null)
const autoRefresh = ref(true)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Таймер автообновления
let refreshTimer: number | undefined = undefined

// Фильтры
const alerts = ref<Alert[]>([
  {
    type: 'warning',
    title: 'Voltage Fluctuation',
    message: 'Voltage dropped below 4.0V at 14:32',
    time: '5 min ago'
  },
  {
    type: 'success',
    title: 'System Check',
    message: 'All systems operating within normal parameters',
    time: '10 min ago'
  }
])

// Компьютеды
const totalPages = computed(() => {
  return Math.ceil(telemetryData.value.length / itemsPerPage.value)
})

const startItem = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value + 1
})

const endItem = computed(() => {
  return Math.min(currentPage.value * itemsPerPage.value, telemetryData.value.length)
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return telemetryData.value.slice(start, end)
})

const visiblePages = computed<(number | string)[]>(() => {
  const current = currentPage.value
  const total = totalPages.value
  const pages: (number | string)[] = []
  
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 3) {
      pages.push(1, 2, 3, 4, '...', total)
    } else if (current >= total - 2) {
      pages.push(1, '...', total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }
  
  return pages
})

// Статистика
const currentVoltage = computed(() => {
  return telemetryData.value[0]?.voltage || null
})

const currentTemp = computed(() => {
  return telemetryData.value[0]?.temp || null
})

const avgVoltage = computed(() => {
  if (telemetryData.value.length === 0) return null
  const sum = telemetryData.value.reduce((acc, item) => acc + item.voltage, 0)
  return sum / telemetryData.value.length
})

const avgTemp = computed(() => {
  if (telemetryData.value.length === 0) return null
  const sum = telemetryData.value.reduce((acc, item) => acc + item.temp, 0)
  return sum / telemetryData.value.length
})

const minVoltage = computed(() => {
  if (telemetryData.value.length === 0) return null
  return Math.min(...telemetryData.value.map(item => item.voltage))
})

const maxVoltage = computed(() => {
  if (telemetryData.value.length === 0) return null
  return Math.max(...telemetryData.value.map(item => item.voltage))
})

const minTemp = computed(() => {
  if (telemetryData.value.length === 0) return null
  return Math.min(...telemetryData.value.map(item => item.temp))
})

const maxTemp = computed(() => {
  if (telemetryData.value.length === 0) return null
  return Math.max(...telemetryData.value.map(item => item.temp))
})

const healthPercentage = computed(() => {
  if (telemetryData.value.length === 0) return 0
  const okCount = telemetryData.value.filter(item => item.isOk).length
  return Math.round((okCount / telemetryData.value.length) * 100)
})

const voltageStatus = computed(() => {
  const voltage = currentVoltage.value
  if (voltage === null) return 'UNKNOWN'
  if (voltage >= 4.0 && voltage <= 12.0) return 'NOMINAL'
  if (voltage < 4.0) return 'LOW'
  if (voltage > 12.0) return 'HIGH'
  return 'UNKNOWN'
})

const tempStatus = computed(() => {
  const temp = currentTemp.value
  if (temp === null) return 'UNKNOWN'
  if (temp >= -20 && temp <= 50) return 'NORMAL'
  if (temp < -20) return 'COLD'
  if (temp > 50) return 'HOT'
  return 'UNKNOWN'
})

const voltageStatusClass = computed(() => {
  const status = voltageStatus.value
  return {
    'text-success': status === 'NOMINAL',
    'text-warning': status === 'LOW' || status === 'HIGH',
    'text-danger': status === 'UNKNOWN'
  }
})

const tempStatusClass = computed(() => {
  const status = tempStatus.value
  return {
    'text-success': status === 'NORMAL',
    'text-warning': status === 'COLD' || status === 'HOT',
    'text-danger': status === 'UNKNOWN'
  }
})

const voltageBadgeClass = computed(() => {
  const status = voltageStatus.value
  return {
    'bg-success': status === 'NOMINAL',
    'bg-warning': status === 'LOW' || status === 'HIGH',
    'bg-danger': status === 'UNKNOWN'
  }
})

const tempBadgeClass = computed(() => {
  const status = tempStatus.value
  return {
    'bg-success': status === 'NORMAL',
    'bg-warning': status === 'COLD' || status === 'HOT',
    'bg-danger': status === 'UNKNOWN'
  }
})

const lastUpdate = computed(() => {
  if (telemetryData.value.length === 0) return 'Never'
  return dayjs(telemetryData.value[0]?.timestamp).format('HH:mm:ss')
})

// График
const voltageChartPoints = computed(() => {
  if (telemetryData.value.length === 0) return []
  
  // Берем последние 10 точек
  const recentData = telemetryData.value.slice(0, 10).reverse()
  
  return recentData.map((item, index) => ({
    voltage: item.voltage / 12.0, // Нормализуем к 0-1
    time: dayjs(item.timestamp).format('HH:mm')
  }))
})

const voltagePercentage = computed(() => {
  if (!selectedItem.value) return 0
  return ((selectedItem.value.voltage - 3.2) / (12.6 - 3.2)) * 100
})

const tempPercentage = computed(() => {
  if (!selectedItem.value) return 0
  return ((selectedItem.value.temp + 50) / (80 + 50)) * 100
})

// Методы
const refreshData = async () => {
  try {
    loading.value = true
    // В реальном приложении здесь был бы запрос к API
    // Для демо генерируем тестовые данные
    await generateSampleData()
  } catch (error) {
    console.error('Error refreshing telemetry data:', error)
  } finally {
    loading.value = false
  }
}

const generateNewData = async () => {
  try {
    loading.value = true
    // В реальном приложении здесь был бы запрос к API для генерации новой записи
    const newItem: TelemetryItem = {
      id: telemetryData.value.length + 1,
      timestamp: new Date().toISOString(),
      isOk: Math.random() > 0.2, // 80% chance of OK
      voltage: 3.2 + Math.random() * 9.4, // 3.2-12.6V
      temp: -50 + Math.random() * 130, // -50 to 80°C
      sourceFile: `telemetry_${dayjs().format('YYYYMMDD_HHmmss')}.csv`
    }
    
    telemetryData.value.unshift(newItem)
    
    // Обновляем alerts
    if (newItem.voltage < 4.0) {
      alerts.value.unshift({
        type: 'warning',
        title: 'Low Voltage Alert',
        message: `Voltage dropped to ${newItem.voltage.toFixed(2)}V`,
        time: 'Just now'
      })
    }
    
    if (newItem.temp > 60) {
      alerts.value.unshift({
        type: 'danger',
        title: 'High Temperature Alert',
        message: `Temperature reached ${newItem.temp.toFixed(1)}°C`,
        time: 'Just now'
      })
    }
    
    // Ограничиваем количество алертов
    if (alerts.value.length > 5) {
      alerts.value = alerts.value.slice(0, 5)
    }
    
  } catch (error) {
    console.error('Error generating new data:', error)
  } finally {
    loading.value = false
  }
}

const generateSampleData = () => {
  const sampleData: TelemetryItem[] = []
  const now = dayjs()
  
  for (let i = 0; i < 25; i++) {
    const timestamp = now.subtract(i * 5, 'minute').toISOString()
    sampleData.push({
      id: i + 1,
      timestamp,
      isOk: Math.random() > 0.3, // 70% chance of OK
      voltage: 4.5 + Math.random() * 6, // 4.5-10.5V
      temp: -20 + Math.random() * 70, // -20 to 50°C
      sourceFile: `telemetry_${dayjs(timestamp).format('YYYYMMDD_HHmmss')}.csv`
    })
  }
  
  telemetryData.value = sampleData
}

const viewDetails = (item: TelemetryItem) => {
  selectedItem.value = item
}

const downloadCSV = (item: TelemetryItem) => {
  const csvContent = [
    ['Timestamp', 'Status', 'Voltage (V)', 'Temperature (°C)', 'Source File'],
    [
      item.timestamp,
      item.isOk ? 'OK' : 'FAIL',
      item.voltage.toFixed(2),
      item.temp.toFixed(1),
      item.sourceFile
    ]
  ].map(row => row.join(',')).join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${item.sourceFile.replace('.csv', '')}_export.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const getVoltageClass = (voltage: number) => {
  if (voltage >= 4.0 && voltage <= 12.0) return 'text-success'
  if (voltage < 4.0) return 'text-warning'
  if (voltage > 12.0) return 'text-danger'
  return 'text-muted'
}

const getTempClass = (temp: number) => {
  if (temp >= -20 && temp <= 50) return 'text-success'
  if (temp < -20) return 'text-info'
  if (temp > 50) return 'text-danger'
  return 'text-muted'
}

const getVoltageStatus = (voltage: number) => {
  if (voltage >= 4.0 && voltage <= 12.0) return 'NORMAL'
  if (voltage < 4.0) return 'LOW'
  if (voltage > 12.0) return 'HIGH'
  return 'UNKNOWN'
}

const getTempStatus = (temp: number) => {
  if (temp >= -20 && temp <= 50) return 'NORMAL'
  if (temp < -20) return 'COLD'
  if (temp > 50) return 'HOT'
  return 'UNKNOWN'
}

const formatDateTime = (timestamp: string) => {
  return dayjs(timestamp).format('MM/DD HH:mm')
}

const formatDateTimeFull = (timestamp: string) => {
  return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
}

const alertClass = (type: string) => {
  return {
    'success': 'alert-success',
    'warning': 'alert-warning',
    'danger': 'alert-danger'
  }[type] || 'alert-secondary'
}

const alertIcon = (type: string) => {
  return {
    'success': 'fas fa-check-circle',
    'warning': 'fas fa-exclamation-triangle',
    'danger': 'fas fa-times-circle'
  }[type] || 'fas fa-info-circle'
}

// Пагинация
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page: number | string) => {
  if (typeof page === 'number') {
    currentPage.value = page
  }
  // Игнорируем клик на многоточие (строка)
}

// Автообновление
const startAutoRefresh = () => {
  if (refreshTimer !== undefined) {
    clearInterval(refreshTimer)
  }
  
  refreshTimer = window.setInterval(() => {
    refreshData()
  }, 30000) // 30 секунд
}

const stopAutoRefresh = () => {
  if (refreshTimer !== undefined) {
    clearInterval(refreshTimer)
    refreshTimer = undefined
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

watch(itemsPerPage, () => {
  currentPage.value = 1
})

// Жизненный цикл
onMounted(() => {
  generateSampleData()
  if (autoRefresh.value) {
    startAutoRefresh()
  }
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<style scoped>
.telemetry-view {
  position: relative;
}

.chart-container {
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(0, 255, 255, 0.2);
  border-radius: 4px;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-color);
  opacity: 0.7;
}

.chart-content {
  height: 100%;
  position: relative;
  padding: 20px 40px 30px 20px;
}

.voltage-chart {
  position: relative;
  height: 100%;
  width: 100%;
}

.chart-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.grid-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(0, 255, 255, 0.1);
}

.chart-line {
  position: relative;
  width: 100%;
}

.chart-point {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--primary-color);
  border-radius: 50%;
  transform: translate(-50%, 50%);
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
}

.chart-point:hover {
  width: 12px;
  height: 12px;
  background: var(--secondary-color);
  box-shadow: 0 0 10px var(--primary-color);
}

.point-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid var(--primary-color);
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 100;
  margin-bottom: 5px;
}

.chart-point:hover .point-tooltip {
  opacity: 1;
}

.chart-axis {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
}

.y-axis {
  position: absolute;
  left: -40px;
  top: 0;
  bottom: 0;
  width: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.y-label {
  font-size: 10px;
  color: var(--text-color);
  opacity: 0.7;
  transform: translateY(50%);
}

.alert-item {
  background: rgba(0, 0, 0, 0.3);
  border-left: 3px solid;
  border-radius: 4px;
}

.alert-success {
  border-left-color: var(--success-color);
  background: rgba(0, 255, 136, 0.1);
}

.alert-warning {
  border-left-color: var(--warning-color);
  background: rgba(255, 85, 0, 0.1);
}

.alert-danger {
  border-left-color: #dc3545;
  background: rgba(220, 53, 69, 0.1);
}

.voltage-display,
.temp-display {
  padding: 8px 16px;
  border-radius: 4px;
  font-family: 'Orbitron', monospace;
  font-weight: bold;
  min-width: 100px;
  text-align: center;
}

.progress-retro {
  height: 8px;
  background: rgba(0, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-retro .progress-bar {
  border-radius: 4px;
  transition: width 0.5s ease;
}

.very-small {
  font-size: 0.75rem;
  opacity: 0.8;
}

.page-link-retro {
  background: rgba(16, 16, 32, 0.8);
  border: 1px solid var(--primary-color);
  color: var(--text-color);
  border-radius: 0;
  margin: 0 2px;
}

.page-link-retro:hover {
  background: rgba(0, 255, 255, 0.1);
  border-color: var(--secondary-color);
  color: var(--primary-color);
}

.page-item.active .page-link-retro {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--dark-bg);
  font-weight: bold;
}

.page-item.disabled .page-link-retro {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>