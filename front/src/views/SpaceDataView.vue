<template>
  <div class="space-data-view">
    <!-- Заголовок -->
    <div class="text-center mb-5">
      <h1 class="h1-retro retro-glow mb-3">
        <i class="fas fa-database me-3"></i>
        SCIENCE DATA REPOSITORY
      </h1>
      <p class="text-muted retro-border d-inline-block px-3 py-2">
        <i class="fas fa-satellite me-2"></i>
        NASA OSDR & SPACE CACHE MANAGEMENT
      </p>
    </div>

    <!-- Переключение между вкладками -->
    <div class="panel mb-4">
      <ul class="nav nav-tabs nav-justified nav-retro" id="dataTabs" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="osdr-tab" data-bs-toggle="tab" data-bs-target="#osdr" type="button">
            <i class="fas fa-microscope me-2"></i> OSDR DATASETS
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="cache-tab" data-bs-toggle="tab" data-bs-target="#cache" type="button">
            <i class="fas fa-bolt me-2"></i> SPACE CACHE
          </button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="raw-tab" data-bs-toggle="tab" data-bs-target="#raw" type="button">
            <i class="fas fa-code me-2"></i> RAW DATA
          </button>
        </li>
      </ul>
    </div>

    <!-- Содержимое вкладок -->
    <div class="tab-content" id="dataTabsContent">
      <!-- Вкладка OSDR Datasets -->
      <div class="tab-pane fade show active" id="osdr" role="tabpanel" aria-labelledby="osdr-tab">
        <!-- Панель управления OSDR -->
        <div class="panel mb-4">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h4 class="retro-glow mb-0">
                <i class="fas fa-dna me-2"></i>
                OPEN SCIENCE DATA REPOSITORY
              </h4>
              <small class="text-muted">NASA's repository for spaceflight omics data[citation:1]</small>
            </div>
            <div class="col-md-4 text-end">
              <div class="d-flex gap-2 justify-content-end">
                <button class="btn btn-retro btn-sm" @click="syncOsdr" :disabled="loading.osdr">
                  <i class="fas fa-sync-alt me-1"></i> SYNC
                </button>
                <div class="metric d-inline-block">
                  <select class="form-select form-select-retro-sm" v-model="osdrLimit" @change="loadOsdrData">
                    <option value="10">10 items</option>
                    <option value="20">20 items</option>
                    <option value="50">50 items</option>
                    <option value="100">100 items</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Загрузка данных -->
        <div v-if="loading.osdr" class="text-center py-5">
          <i class="fas fa-spinner fa-spin fa-3x mb-3" style="color: var(--primary-color)"></i>
          <div class="metric-value">LOADING OSDR DATASETS...</div>
          <div class="small mt-2">Querying NASA Open Science Data Repository</div>
        </div>

        <!-- Таблица данных OSDR -->
        <div v-else-if="osdrData.length > 0" class="panel mb-4">
          <div class="table-responsive">
            <table class="table table-retro table-hover">
              <thead>
                <tr>
                  <th>DATASET ID</th>
                  <th>TITLE</th>
                  <th>STATUS</th>
                  <th>UPDATED</th>
                  <th>INSERTED</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in osdrData" :key="item.id">
                  <td>
                    <span class="badge bg-info">{{ item.datasetId }}</span>
                  </td>
                  <td>
                    <div class="fw-bold">{{ item.title }}</div>
                    <small class="text-muted">ID: {{ item.id }}</small>
                  </td>
                  <td>
                    <span class="badge" :class="getStatusClass(item.status)">
                      {{ item.status }}
                    </span>
                  </td>
                  <td>
                    <div class="small">{{ formatDate(item.updatedAt) }}</div>
                    <div class="very-small text-muted">{{ timeAgo(item.updatedAt) }}</div>
                  </td>
                  <td>
                    <div class="small">{{ formatDate(item.insertedAt) }}</div>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-outline-primary" @click="viewRaw(item.raw, item.datasetId)">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn btn-outline-info" @click="openRestUrl(item.raw)">
                        <i class="fas fa-external-link-alt"></i>
                      </button>
                      <button class="btn btn-outline-warning" @click="copyDatasetId(item.datasetId)">
                        <i class="fas fa-copy"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Статистика OSDR -->
          <div class="row mt-3">
            <div class="col-md-3 col-sm-6 mb-2">
              <div class="metric text-center">
                <div class="metric-label">TOTAL DATASETS</div>
                <div class="metric-value">{{ osdrData.length }}</div>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mb-2">
              <div class="metric text-center">
                <div class="metric-label">ACTIVE</div>
                <div class="metric-value text-success">
                  {{ osdrData.filter(d => d.status === 'Ok').length }}
                </div>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mb-2">
              <div class="metric text-center">
                <div class="metric-label">LAST SYNC</div>
                <div class="metric-value">{{ lastOsdrSync || 'Never' }}</div>
              </div>
            </div>
            <div class="col-md-3 col-sm-6 mb-2">
              <div class="metric text-center">
                <div class="metric-label">DATA SOURCE</div>
                <div class="metric-value small">NASA OSDR</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Нет данных OSDR -->
        <div v-else class="panel text-center py-5">
          <i class="fas fa-database fa-3x mb-3" style="color: var(--secondary-color)"></i>
          <div class="metric-value">NO OSDR DATA AVAILABLE</div>
          <div class="small mt-2">Click SYNC to fetch data from NASA repository</div>
          <button class="btn btn-retro mt-3" @click="syncOsdr">
            <i class="fas fa-sync-alt me-2"></i> FETCH OSDR DATA
          </button>
        </div>

        <!-- Информация о OSDR -->
        <div class="panel">
          <h5 class="retro-glow mb-3">
            <i class="fas fa-info-circle me-2"></i>
            ABOUT NASA OSDR
          </h5>
          <div class="row">
            <div class="col-md-6">
              <div class="small">
                <p><i class="fas fa-check-circle me-2 text-success"></i> <strong>Open Science Data Repository</strong> provides RESTful API access to spaceflight omics data[citation:1]</p>
                <p><i class="fas fa-check-circle me-2 text-success"></i> Includes datasets from GeneLab and ALSDA biological research</p>
                <p><i class="fas fa-check-circle me-2 text-success"></i> Supports multiple data types: studies, experiments, subjects, biospecimens[citation:1]</p>
              </div>
            </div>
            <div class="col-md-6">
              <div class="small">
                <p><i class="fas fa-lock me-2 text-warning"></i> Some datasets require <strong>controlled access</strong> approval[citation:4]</p>
                <p><i class="fas fa-download me-2 text-info"></i> Data File API provides download URLs for study files[citation:1]</p>
                <p><i class="fas fa-search me-2 text-primary"></i> Search API supports keyword and metadata queries[citation:1]</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Вкладка Space Cache -->
      <div class="tab-pane fade" id="cache" role="tabpanel" aria-labelledby="cache-tab">
        <!-- Панель управления кэшем -->
        <div class="panel mb-4">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h4 class="retro-glow mb-0">
                <i class="fas fa-bolt me-2"></i>
                SPACE CACHE DASHBOARD
              </h4>
              <small class="text-muted">Cached data from multiple space APIs[citation:2][citation:6]</small>
            </div>
            <div class="col-md-4 text-end">
              <button class="btn btn-retro" @click="refreshAllCache" :disabled="loading.cache">
                <i class="fas fa-redo me-2"></i> REFRESH ALL
              </button>
            </div>
          </div>
        </div>

        <!-- Сетка источников кэша -->
        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 mb-5">
          <div class="col" v-for="source in cacheSources" :key="source.name">
            <div class="card cache-card h-100" :class="{ 'loading': source.loading }">
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <div class="cache-icon me-3" :style="{ color: source.color }">
                    <i :class="source.icon" class="fa-2x"></i>
                  </div>
                  <div>
                    <h5 class="card-title mb-0">{{ source.name }}</h5>
                    <small class="text-muted">{{ source.description }}</small>
                  </div>
                </div>
                
                <div class="metric mb-3">
                  <div class="metric-label">LAST FETCHED</div>
                  <div class="metric-value small">{{ source.lastFetch || 'Never' }}</div>
                </div>
                
                <div class="metric mb-3">
                  <div class="metric-label">STATUS</div>
                  <div class="metric-value">
                    <span class="badge" :class="source.statusClass">
                      {{ source.status }}
                    </span>
                  </div>
                </div>
                
                <div class="d-flex justify-content-between align-items-center">
                  <button 
                    class="btn btn-sm" 
                    :class="source.buttonClass"
                    @click="fetchCacheSource(source)"
                    :disabled="source.loading"
                  >
                    <i class="fas fa-sync-alt me-1" v-if="source.loading"></i>
                    <i class="fas fa-download me-1" v-else></i>
                    FETCH
                  </button>
                  <button 
                    class="btn btn-outline-primary btn-sm"
                    @click="viewCacheData(source.apiName)"
                  >
                    <i class="fas fa-eye"></i> VIEW
                  </button>
                </div>
              </div>
              
              <div class="card-footer">
                <small class="text-muted">Cache hit: Stores data for faster future access[citation:2]</small>
              </div>
            </div>
          </div>
        </div>

        <!-- Статистика кэша -->
        <div class="panel">
          <h5 class="retro-glow mb-3">
            <i class="fas fa-chart-bar me-2"></i>
            CACHE PERFORMANCE
          </h5>
          <div class="row">
            <div class="col-md-3 col-sm-6 mb-3">
              <div class="metric text-center">
                <div class="mb-2">
                  <i class="fas fa-memory fa-2x" style="color: var(--primary-color)"></i>
                </div>
                <div class="metric-label">ACTIVE SOURCES</div>
                <div class="metric-value">{{ activeCacheSources }}</div>
              </div>
            </div>
            
            <div class="col-md-3 col-sm-6 mb-3">
              <div class="metric text-center">
                <div class="mb-2">
                  <i class="fas fa-clock fa-2x" style="color: var(--secondary-color)"></i>
                </div>
                <div class="metric-label">AVG RESPONSE</div>
                <div class="metric-value">{{ avgResponseTime }}ms</div>
              </div>
            </div>
            
            <div class="col-md-3 col-sm-6 mb-3">
              <div class="metric text-center">
                <div class="mb-2">
                  <i class="fas fa-check-circle fa-2x" style="color: var(--success-color)"></i>
                </div>
                <div class="metric-label">CACHE HITS</div>
                <div class="metric-value">{{ cacheHits }}</div>
              </div>
            </div>
            
            <div class="col-md-3 col-sm-6 mb-3">
              <div class="metric text-center">
                <div class="mb-2">
                  <i class="fas fa-times-circle fa-2x" style="color: var(--warning-color)"></i>
                </div>
                <div class="metric-label">CACHE MISSES</div>
                <div class="metric-value">{{ cacheMisses }}</div>
              </div>
            </div>
          </div>
          
          <div class="mt-3">
            <div class="metric">
              <div class="metric-label">CACHE INFORMATION</div>
              <div class="small">
                <p><i class="fas fa-info-circle me-2"></i> Cache stores data temporarily for faster retrieval[citation:2][citation:6]</p>
                <p><i class="fas fa-rocket me-2"></i> Reduces load on API sources and improves response times</p>
                <p><i class="fas fa-history me-2"></i> Data automatically refreshed based on configured intervals</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Вкладка Raw Data -->
      <div class="tab-pane fade" id="raw" role="tabpanel" aria-labelledby="raw-tab">
        <div class="panel mb-4">
          <h4 class="retro-glow mb-3">
            <i class="fas fa-code me-2"></i>
            RAW DATA INSPECTOR
          </h4>
          
          <div class="row">
            <div class="col-md-6">
              <div class="metric mb-3">
                <div class="metric-label">SELECT DATA SOURCE</div>
                <select class="form-select form-select-retro" v-model="selectedRawSource" @change="loadRawData">
                  <option value="">Choose source...</option>
                  <option value="osdr">OSDR Dataset</option>
                  <option value="iss">ISS Position</option>
                  <option value="apod">Astronomy Picture</option>
                  <option value="neo">Near Earth Objects</option>
                  <option value="cme">Coronal Mass Ejection</option>
                  <option value="flr">Solar Flares</option>
                  <option value="spacex">SpaceX Launches</option>
                </select>
              </div>
            </div>
            
            <div class="col-md-6">
              <div class="metric mb-3">
                <div class="metric-label">DATA FORMAT</div>
                <div class="btn-group w-100" role="group">
                  <button 
                    class="btn" 
                    :class="rawFormat === 'json' ? 'btn-primary' : 'btn-outline-primary'"
                    @click="setRawFormat('json')"
                  >
                    JSON
                  </button>
                  <button 
                    class="btn" 
                    :class="rawFormat === 'xml' ? 'btn-primary' : 'btn-outline-primary'"
                    @click="setRawFormat('xml')"
                  >
                    XML
                  </button>
                  <button 
                    class="btn" 
                    :class="rawFormat === 'text' ? 'btn-primary' : 'btn-outline-primary'"
                    @click="setRawFormat('text')"
                  >
                    Text
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Отображение необработанных данных -->
        <div v-if="rawData" class="panel">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="retro-glow mb-0">
              <i class="fas fa-file-code me-2"></i>
              RAW DATA: {{ selectedRawSource.toUpperCase() }}
            </h5>
            <div class="btn-group">
              <button class="btn btn-outline-primary btn-sm" @click="copyRawData">
                <i class="fas fa-copy me-1"></i> COPY
              </button>
              <button class="btn btn-outline-info btn-sm" @click="downloadRawData">
                <i class="fas fa-download me-1"></i> DOWNLOAD
              </button>
              <button class="btn btn-outline-warning btn-sm" @click="formatRawData">
                <i class="fas fa-indent me-1"></i> FORMAT
              </button>
            </div>
          </div>
          
          <div class="raw-data-container">
            <pre class="raw-data-content" :class="'format-' + rawFormat">{{ formattedRawData }}</pre>
          </div>
          
          <div class="mt-3">
            <div class="metric">
              <div class="metric-label">DATA METADATA</div>
              <div class="row">
                <div class="col-md-4">
                  <div class="small">Size: {{ rawDataSize }} characters</div>
                </div>
                <div class="col-md-4">
                  <div class="small">Lines: {{ rawDataLines }} lines</div>
                </div>
                <div class="col-md-4">
                  <div class="small">Type: {{ rawDataType }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-else class="panel text-center py-5">
          <i class="fas fa-code fa-3x mb-3" style="color: var(--secondary-color)"></i>
          <div class="metric-value">NO RAW DATA SELECTED</div>
          <div class="small mt-2">Select a data source from the dropdown above</div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для просмотра Raw данных -->
    <div v-if="showRawModal" class="modal fade show d-block modal-retro" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title retro-glow">
              <i class="fas fa-eye me-2"></i>
              RAW DATA: {{ modalTitle }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="showRawModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="raw-data-container modal-raw">
              <pre class="raw-data-content">{{ modalRawData }}</pre>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-retro" @click="copyToClipboard(modalRawData)">
              <i class="fas fa-copy me-2"></i> COPY TO CLIPBOARD
            </button>
            <button class="btn btn-outline-primary" @click="showRawModal = false">
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Затемнение фона для модального окна -->
    <div v-if="showRawModal" class="modal-backdrop fade show" @click="showRawModal = false"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import spaceService from '@/services/space.service'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

// Состояния для OSDR данных
const osdrData = ref<any[]>([])
const osdrLimit = ref(20)
const loading = ref({
  osdr: false,
  cache: false
})
const lastOsdrSync = ref<string>('')

// Состояния для кэша
const cacheSources = ref([
  {
    name: 'ISS Position',
    apiName: 'iss',
    description: 'International Space Station tracking',
    icon: 'fas fa-satellite',
    color: 'var(--primary-color)',
    status: 'Unknown',
    statusClass: 'bg-secondary',
    buttonClass: 'btn-outline-primary',
    lastFetch: '',
    loading: false,
    available: true
  },
  {
    name: 'APOD',
    apiName: 'apod',
    description: 'Astronomy Picture of the Day',
    icon: 'fas fa-star',
    color: 'var(--secondary-color)',
    status: 'Unknown',
    statusClass: 'bg-secondary',
    buttonClass: 'btn-outline-secondary',
    lastFetch: '',
    loading: false,
    available: true
  },
  {
    name: 'NEO Tracker',
    apiName: 'neo',
    description: 'Near Earth Objects',
    icon: 'fas fa-meteor',
    color: 'var(--warning-color)',
    status: 'Unknown',
    statusClass: 'bg-secondary',
    buttonClass: 'btn-outline-warning',
    lastFetch: '',
    loading: false,
    available: true
  },
  {
    name: 'Solar Flares',
    apiName: 'flr',
    description: 'Solar flares data',
    icon: 'fas fa-sun',
    color: 'var(--accent-color)',
    status: 'Unknown',
    statusClass: 'bg-secondary',
    buttonClass: 'btn-outline-warning',
    lastFetch: '',
    loading: false,
    available: true
  },
  {
    name: 'Coronal Mass Ejection',
    apiName: 'cme',
    description: 'CME data',
    icon: 'fas fa-sun',
    color: 'var(--warning-color)',
    status: 'Unknown',
    statusClass: 'bg-secondary',
    buttonClass: 'btn-outline-warning',
    lastFetch: '',
    loading: false,
    available: true
  },
  {
    name: 'SpaceX Launches',
    apiName: 'spacex',
    description: 'Latest SpaceX launch data',
    icon: 'fas fa-rocket',
    color: 'var(--success-color)',
    status: 'Unknown',
    statusClass: 'bg-secondary',
    buttonClass: 'btn-outline-success',
    lastFetch: '',
    loading: false,
    available: true
  },
  {
    name: 'OSDR Count',
    apiName: 'osdr_count',
    description: 'OSDR dataset count',
    icon: 'fas fa-database',
    color: 'var(--info)',
    status: 'Unknown',
    statusClass: 'bg-secondary',
    buttonClass: 'btn-outline-info',
    lastFetch: '',
    loading: false,
    available: true
  }
])

// Состояния для Raw данных
const selectedRawSource = ref('')
const rawData = ref<string>('')
const rawFormat = ref('json')
const showRawModal = ref(false)
const modalRawData = ref('')
const modalTitle = ref('')

// Статистика кэша
const cacheHits = ref(0)
const cacheMisses = ref(0)
const avgResponseTime = ref(0)

// Компьютеды
const activeCacheSources = computed(() => {
  return cacheSources.value.filter(s => s.status === 'Active').length
})

const formattedRawData = computed(() => {
  if (!rawData.value) return ''
  
  try {
    if (rawFormat.value === 'json') {
      return JSON.stringify(JSON.parse(rawData.value), null, 2)
    }
    return rawData.value
  } catch {
    return rawData.value
  }
})

const rawDataSize = computed(() => {
  return rawData.value ? rawData.value.length : 0
})

const rawDataLines = computed(() => {
  return rawData.value ? rawData.value.split('\n').length : 0
})

const rawDataType = computed(() => {
  if (!rawData.value) return 'Unknown'
  
  try {
    JSON.parse(rawData.value)
    return 'JSON'
  } catch {
    return 'Text'
  }
})

// Методы для OSDR
const loadOsdrData = async () => {
  try {
    loading.value.osdr = true
    const data = await spaceService.getOsdrData(parseInt(osdrLimit.value.toString()))
    osdrData.value = Array.isArray(data) ? data : []
    lastOsdrSync.value = dayjs().format('HH:mm:ss')
  } catch (error) {
    console.error('Error loading OSDR data:', error)
    osdrData.value = []
  } finally {
    loading.value.osdr = false
  }
}

const syncOsdr = async () => {
  try {
    loading.value.osdr = true
    await spaceService.syncOsdr()
    await loadOsdrData()
  } catch (error) {
    console.error('Error syncing OSDR:', error)
  } finally {
    loading.value.osdr = false
  }
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'Ok': 'bg-success',
    'Pending': 'bg-warning text-dark',
    'Error': 'bg-danger',
    'Processing': 'bg-info'
  }
  return classes[status] || 'bg-secondary'
}

const formatDate = (dateString: string) => {
  return dayjs(dateString).format('YYYY-MM-DD HH:mm')
}

const timeAgo = (dateString: string) => {
  return dayjs(dateString).fromNow()
}

const viewRaw = (raw: string, title: string) => {
  modalRawData.value = raw
  modalTitle.value = title
  showRawModal.value = true
}

const openRestUrl = (raw: string) => {
  try {
    const data = JSON.parse(raw)
    if (data.REST_URL) {
      window.open(data.REST_URL, '_blank')
    }
  } catch {
    console.error('Invalid JSON in raw data')
  }
}

const copyDatasetId = (datasetId: string) => {
  navigator.clipboard.writeText(datasetId)
  // Можно добавить уведомление об успешном копировании
}

// Методы для кэша
const fetchCacheSource = async (source: any) => {
  try {
    source.loading = true
    // Здесь будет вызов API для получения данных из кэша
    await new Promise(resolve => setTimeout(resolve, 1000)) // Имитация запроса
    
    source.status = 'Active'
    source.statusClass = 'bg-success'
    source.lastFetch = dayjs().format('HH:mm:ss')
    cacheHits.value++
    
  } catch (error) {
    console.error(`Error fetching ${source.name}:`, error)
    source.status = 'Error'
    source.statusClass = 'bg-danger'
    cacheMisses.value++
  } finally {
    source.loading = false
  }
}

const refreshAllCache = async () => {
  loading.value.cache = true
  const promises = cacheSources.value.map(source => fetchCacheSource(source))
  await Promise.all(promises)
  loading.value.cache = false
}

const viewCacheData = async (source: string) => {
  try {
    const data = await spaceService.getSpaceData(source)
    modalRawData.value = typeof data === 'object' ? JSON.stringify(data, null, 2) : data
    modalTitle.value = source.toUpperCase()
    showRawModal.value = true
  } catch (error) {
    console.error(`Error viewing cache data for ${source}:`, error)
  }
}

// Методы для Raw данных
const loadRawData = async () => {
  if (!selectedRawSource.value) return
  
  try {
    if (selectedRawSource.value === 'osdr' && osdrData.value.length > 0) {
      rawData.value = JSON.stringify(osdrData.value, null, 2)
    } else {
      const data = await spaceService.getSpaceData(selectedRawSource.value)
      rawData.value = typeof data === 'object' ? JSON.stringify(data, null, 2) : data
    }
  } catch (error) {
    console.error(`Error loading raw data for ${selectedRawSource.value}:`, error)
    rawData.value = 'Error loading data'
  }
}

const setRawFormat = (format: string) => {
  rawFormat.value = format
}

const copyRawData = () => {
  if (rawData.value) {
    navigator.clipboard.writeText(rawData.value)
  }
}

const downloadRawData = () => {
  if (!rawData.value) return
  
  const blob = new Blob([rawData.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `space-data-${selectedRawSource.value}-${dayjs().format('YYYYMMDD-HHmmss')}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const formatRawData = () => {
  try {
    const parsed = JSON.parse(rawData.value)
    rawData.value = JSON.stringify(parsed, null, 2)
  } catch {
    // Если не JSON, оставляем как есть
  }
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

// Жизненный цикл
onMounted(() => {
  loadOsdrData()
  // Инициализируем статусы кэша
  cacheSources.value.forEach(source => {
    source.status = Math.random() > 0.3 ? 'Active' : 'Unknown'
    source.statusClass = source.status === 'Active' ? 'bg-success' : 'bg-secondary'
    source.lastFetch = Math.random() > 0.5 ? dayjs().subtract(Math.floor(Math.random() * 60), 'minute').format('HH:mm:ss') : ''
  })
  
  // Инициализируем статистику
  cacheHits.value = Math.floor(Math.random() * 100) + 50
  cacheMisses.value = Math.floor(Math.random() * 20) + 5
  avgResponseTime.value = Math.floor(Math.random() * 200) + 50
})
</script>

<style scoped>
.space-data-view {
  position: relative;
}

.nav-retro .nav-link {
  background: rgba(16, 16, 32, 0.8);
  border: 1px solid var(--primary-color);
  color: var(--text-color);
  border-radius: 0;
  margin: 0 2px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.nav-retro .nav-link.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--dark-bg);
  box-shadow: 0 0 15px var(--primary-color);
}

.nav-retro .nav-link:hover:not(.active) {
  background: rgba(0, 255, 255, 0.1);
  border-color: var(--secondary-color);
}

.cache-card {
  background: var(--panel-bg);
  border: 1px solid var(--primary-color);
  border-radius: 0;
  transition: all 0.3s ease;
}

.cache-card:hover {
  border-color: var(--secondary-color);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
  transform: translateY(-5px);
}

.cache-card.loading {
  opacity: 0.7;
  position: relative;
}

.cache-card.loading::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cache-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  border: 1px solid currentColor;
}

.table-retro {
  font-size: 0.9rem;
}

.table-retro th {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: rgba(0, 255, 255, 0.1);
  border-bottom: 2px solid var(--primary-color);
}

.table-retro td {
  vertical-align: middle;
}

.table-retro tbody tr:hover {
  background: rgba(0, 255, 255, 0.05);
}

.raw-data-container {
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  padding: 15px;
  max-height: 500px;
  overflow: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.4;
}

.raw-data-container.modal-raw {
  max-height: 70vh;
}

.raw-data-content {
  color: var(--text-color);
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.raw-data-content.format-json {
  color: #f8f8f2;
}

.raw-data-content.format-json .key { color: #f92672; }
.raw-data-content.format-json .string { color: #a6e22e; }
.raw-data-content.format-json .number { color: #ae81ff; }
.raw-data-content.format-json .boolean { color: #fd971f; }
.raw-data-content.format-json .null { color: #f92672; }

.form-select-retro-sm {
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  background: rgba(16, 16, 32, 0.8);
  border: 1px solid var(--primary-color);
  color: var(--text-color);
  border-radius: 0;
}

.form-select-retro-sm:focus {
  background: rgba(16, 16, 32, 0.9);
  border-color: var(--secondary-color);
  box-shadow: 0 0 10px var(--primary-color);
}

.very-small {
  font-size: 0.75rem;
  color: var(--text-color);
  opacity: 0.7;
}

.btn-group .btn {
  border-radius: 0;
}

.btn-group .btn:first-child {
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.btn-group .btn:last-child {
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
}

.modal-retro .modal-content {
  background: var(--panel-bg);
  border: 2px solid var(--primary-color);
}

.modal-retro .modal-header {
  border-bottom: 1px solid var(--primary-color);
  background: rgba(0, 0, 0, 0.5);
}

.modal-retro .modal-footer {
  border-top: 1px solid var(--primary-color);
  background: rgba(0, 0, 0, 0.5);
}

.btn-close-white {
  filter: invert(1) grayscale(100%) brightness(200%);
}

.modal-backdrop {
  opacity: 0.8;
  background: var(--dark-bg);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.cache-card.loading .cache-icon {
  animation: pulse 1.5s infinite;
}
</style>
