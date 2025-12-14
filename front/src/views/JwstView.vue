[file name]: JwstView.vue
[file content begin]
<template>
  <div class="jwst-view">
    <!-- Заголовок -->
    <div class="text-center mb-5">
      <h1 class="h1-retro retro-glow mb-3">
        <i class="fas fa-hubble me-3"></i>
        JAMES WEBB SPACE TELESCOPE
      </h1>
      <p class="text-muted retro-border d-inline-block px-3 py-2">
        <i class="fas fa-satellite-dish me-2"></i>
        DEEP SPACE OBSERVATORY IMAGE ARCHIVE
      </p>
    </div>

    <!-- Панель фильтров -->
    <div class="panel mb-4">
      <div class="row g-3">
        <div class="col-md-3">
          <div class="metric mb-2">
            <div class="metric-label">SOURCE TYPE</div>
            <select class="form-select form-select-retro" v-model="filters.source">
              <option value="jpg">JPEG Images</option>
              <option value="suffix">By Suffix</option>
              <option value="program">By Program</option>
            </select>
          </div>
        </div>

        <div class="col-md-3">
          <div class="metric mb-2">
            <div class="metric-label">INSTRUMENT</div>
            <select class="form-select form-select-retro" v-model="filters.instrument">
              <option value="">All Instruments</option>
              <option value="NIRCam">NIRCam</option>
              <option value="NIRSpec">NIRSpec</option>
              <option value="MIRI">MIRI</option>
              <option value="NIRISS">NIRISS</option>
              <option value="FGS">FGS</option>
            </select>
          </div>
        </div>

        <div class="col-md-2">
          <div class="metric mb-2">
            <div class="metric-label">SUFFIX</div>
            <input 
              type="text" 
              class="form-control form-control-retro" 
              v-model="filters.suffix"
              placeholder="e.g., _thumb"
              :disabled="filters.source !== 'suffix'"
            >
          </div>
        </div>

        <div class="col-md-2">
          <div class="metric mb-2">
            <div class="metric-label">PROGRAM</div>
            <input 
              type="text" 
              class="form-control form-control-retro" 
              v-model="filters.program"
              placeholder="Program ID"
              :disabled="filters.source !== 'program'"
            >
          </div>
        </div>

        <div class="col-md-2">
          <div class="metric mb-2">
            <div class="metric-label">PER PAGE</div>
            <select class="form-select form-select-retro" v-model="filters.perPage">
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="48">48</option>
              <option value="96">96</option>
            </select>
          </div>
        </div>

        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mt-2">
            <div>
              <button class="btn btn-retro me-2" @click="loadImages" :disabled="loading">
                <i class="fas fa-search me-2"></i> SEARCH
              </button>
              <button class="btn btn-outline-primary" @click="resetFilters">
                <i class="fas fa-redo me-1"></i> RESET
              </button>
            </div>
            <div v-if="totalImages > 0" class="text-end">
              <span class="badge bg-info">{{ totalImages }} images</span>
              <span class="badge bg-secondary ms-2">Page {{ filters.page }} of {{ totalPages }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Галлерея -->
    <div v-if="loading" class="text-center py-5">
      <i class="fas fa-spinner fa-spin fa-3x mb-3" style="color: var(--primary-color)"></i>
      <div class="metric-value">LOADING JWST IMAGES...</div>
      <div class="small mt-2">Querying James Webb Space Telescope archive</div>
    </div>

    <div v-else-if="images.length === 0" class="panel text-center py-5">
      <i class="fas fa-image fa-3x mb-3" style="color: var(--secondary-color)"></i>
      <div class="metric-value">NO IMAGES FOUND</div>
      <div class="small mt-2">Try adjusting your search filters</div>
    </div>

    <div v-else>
      <!-- Панель информации -->
      <div class="panel mb-4">
        <div class="row align-items-center">
          <div class="col-md-6">
            <div class="d-flex align-items-center">
              <i class="fas fa-database fa-2x me-3" style="color: var(--primary-color)"></i>
              <div>
                <div class="metric-label">JWST ARCHIVE</div>
                <div class="metric-value">Displaying {{ images.length }} of {{ totalImages }} images</div>
              </div>
            </div>
          </div>
          <div class="col-md-6 text-end">
            <div class="d-flex justify-content-end align-items-center gap-2">
              <button 
                class="btn btn-retro btn-sm" 
                @click="prevPage" 
                :disabled="filters.page <= 1"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <span class="metric-label">PAGE {{ filters.page }} / {{ totalPages }}</span>
              <button 
                class="btn btn-retro btn-sm" 
                @click="nextPage" 
                :disabled="filters.page >= totalPages"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Сетка изображений -->
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mb-5">
        <div class="col" v-for="(image, index) in images" :key="image.id || index">
          <div class="card jwst-card h-100">
            <!-- Загрузчик изображения -->
            <div class="image-container position-relative">
              <img 
                :src="image.thumbnail || image.location" 
                :alt="image.id"
                class="card-img-top"
                @load="image.loaded = true"
                @error="image.loaded = false"
                :class="{ 'loaded': image.loaded }"
              />
              
              <!-- Индикатор загрузки -->
              <div v-if="!image.loaded" class="image-loading">
                <i class="fas fa-spinner fa-spin fa-2x"></i>
              </div>

              <!-- Бейдж инструментов -->
              <div class="image-badges">
                <span 
                  v-for="(inst, idx) in getInstruments(image)" 
                  :key="idx"
                  class="badge instrument-badge"
                  :class="getInstrumentClass(inst)"
                >
                  {{ inst }}
                </span>
              </div>

              <!-- Кнопка просмотра -->
              <button 
                class="btn btn-retro btn-sm view-button"
                @click="viewImage(image)"
              >
                <i class="fas fa-expand"></i>
              </button>
            </div>

            <div class="card-body">
              <h6 class="card-title text-truncate" :title="image.id">
                {{ truncateText(image.id, 30) }}
              </h6>
              
              <div class="card-text">
                <div class="metric mb-2">
                  <div class="metric-label">PROGRAM</div>
                  <div class="metric-value small">{{ image.program || 'N/A' }}</div>
                </div>

                <div class="metric mb-2">
                  <div class="metric-label">SUFFIX</div>
                  <div class="metric-value small">{{ image.details?.suffix || 'N/A' }}</div>
                </div>

                <div class="metric">
                  <div class="metric-label">DESCRIPTION</div>
                  <div class="small text-muted">{{ truncateText(image.details?.description || 'No description', 40) }}</div>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <div class="d-flex justify-content-between align-items-center">
                <a 
                  :href="image.location" 
                  class="btn btn-outline-primary btn-sm"
                  target="_blank"
                  @click.prevent="downloadImage(image)"
                >
                  <i class="fas fa-download me-1"></i> DOWNLOAD
                </a>
                <small class="text-muted">{{ image.file_type }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Пагинация -->
      <div class="panel">
        <div class="row align-items-center">
          <div class="col-md-4">
            <div class="metric">
              <div class="metric-label">IMAGES PER PAGE</div>
              <select 
                class="form-select form-select-retro-sm d-inline-block w-auto" 
                v-model="filters.perPage"
                @change="perPageChanged"
              >
                <option value="12">12</option>
                <option value="24">24</option>
                <option value="48">48</option>
                <option value="96">96</option>
              </select>
            </div>
          </div>
          
          <div class="col-md-4 text-center">
            <nav aria-label="Page navigation">
              <ul class="pagination justify-content-center mb-0">
                <li class="page-item" :class="{ 'disabled': filters.page <= 1 }">
                  <button class="page-link page-link-retro" @click="prevPage">
                    <i class="fas fa-chevron-left"></i>
                  </button>
                </li>
                
                <li 
                  v-for="page in visiblePages" 
                  :key="page"
                  class="page-item" 
                  :class="{ 'active': page === filters.page }"
                >
                  <button 
                    class="page-link page-link-retro" 
                    @click="goToPage(page)"
                  >
                    {{ page }}
                  </button>
                </li>
                
                <li class="page-item" :class="{ 'disabled': filters.page >= totalPages }">
                  <button class="page-link page-link-retro" @click="nextPage">
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          
          <div class="col-md-4 text-end">
            <div class="metric">
              <div class="metric-label">TOTAL PAGES</div>
              <div class="metric-value">{{ totalPages }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно просмотра изображения -->
    <div v-if="selectedImage" class="modal fade show d-block modal-retro" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title retro-glow">
              <i class="fas fa-image me-2"></i>
              {{ selectedImage.id }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="selectedImage = null"></button>
          </div>
          <div class="modal-body text-center">
            <img 
              :src="selectedImage.location" 
              :alt="selectedImage.id"
              class="img-fluid mb-3"
              style="max-height: 70vh;"
            />
            
            <div class="row">
              <div class="col-md-6">
                <div class="metric mb-3">
                  <div class="metric-label">PROGRAM</div>
                  <div class="metric-value">{{ selectedImage.program || 'N/A' }}</div>
                </div>
                
                <div class="metric mb-3">
                  <div class="metric-label">OBSERVATION ID</div>
                  <div class="metric-value small">{{ selectedImage.observation_id || 'N/A' }}</div>
                </div>
                
                <div class="metric mb-3">
                  <div class="metric-label">FILE TYPE</div>
                  <div class="metric-value">{{ selectedImage.file_type || 'N/A' }}</div>
                </div>
              </div>
              
              <div class="col-md-6">
                <div class="metric mb-3">
                  <div class="metric-label">INSTRUMENTS</div>
                  <div class="d-flex flex-wrap gap-1">
                    <span 
                      v-for="(inst, idx) in getInstruments(selectedImage)" 
                      :key="idx"
                      class="badge instrument-badge"
                      :class="getInstrumentClass(inst)"
                    >
                      {{ inst }}
                    </span>
                  </div>
                </div>
                
                <div class="metric mb-3">
                  <div class="metric-label">DESCRIPTION</div>
                  <div class="small">{{ selectedImage.details?.description || 'No description' }}</div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">SUFFIX</div>
                  <div class="metric-value">{{ selectedImage.details?.suffix || 'N/A' }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-retro" @click="downloadImage(selectedImage)">
              <i class="fas fa-download me-2"></i> DOWNLOAD FULL RESOLUTION
            </button>
            <button class="btn btn-outline-primary" @click="selectedImage = null">
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Затемнение фона для модального окна -->
    <div v-if="selectedImage" class="modal-backdrop fade show" @click="selectedImage = null"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import spaceService from '@/services/space.service'

interface JwstImage {
  id: string
  observation_id?: string
  program?: number
  details?: {
    mission?: string
    instruments?: Array<{ instrument: string }>
    suffix?: string
    description?: string
  }
  file_type?: string
  thumbnail?: string
  location: string
  loaded?: boolean
}

// Состояния
const images = ref<JwstImage[]>([])
const loading = ref(false)
const selectedImage = ref<JwstImage | null>(null)
const totalImages = ref(0)

// Фильтры
const filters = ref({
  source: 'jpg',
  suffix: '',
  program: '',
  instrument: '',
  page: 1,
  perPage: 12
})

// Компьютеды
const totalPages = computed(() => {
  return Math.ceil(totalImages.value / parseInt(filters.value.perPage.toString()))
})

const visiblePages = computed(() => {
  const current = filters.value.page
  const total = totalPages.value
  const pages: number[] = []
  
  // Показываем до 5 страниц
  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)
  
  // Корректируем начало, если мы в конце
  if (end - start < 4 && start > 1) {
    start = Math.max(1, end - 4)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Методы
const loadImages = async () => {
  try {
    loading.value = true
    images.value = []
    
    const params: any = {
      source: filters.value.source,
      page: filters.value.page,
      perPage: filters.value.perPage
    }
    
    if (filters.value.suffix && filters.value.source === 'suffix') {
      params.suffix = filters.value.suffix
    }
    
    if (filters.value.program && filters.value.source === 'program') {
      params.program = filters.value.program
    }
    
    if (filters.value.instrument) {
      params.instrument = filters.value.instrument
    }
    
    const response = await spaceService.getJwstFeed(params)
    
    // Извлекаем массив изображений из ответа
    let data = response.body || response
    
    if (data && !Array.isArray(data)) {
      // Пробуем разные пути к данным
      if (data.body && Array.isArray(data.body)) {
        data = data.body
      } else if (data.data && Array.isArray(data.data)) {
        data = data.data
      } else if (Array.isArray(data)) {
        // Уже массив
      } else {
        data = []
      }
    }
    
    if (Array.isArray(data)) {
      images.value = data.map((img: any) => ({
        ...img,
        loaded: false
      }))
      totalImages.value = data.length * 10 // Примерное количество, на самом деле нужен total из API
    } else {
      images.value = []
      totalImages.value = 0
    }
    
  } catch (error) {
    console.error('Error loading JWST images:', error)
    images.value = []
    totalImages.value = 0
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filters.value = {
    source: 'jpg',
    suffix: '',
    program: '',
    instrument: '',
    page: 1,
    perPage: 12
  }
  loadImages()
}

const prevPage = () => {
  if (filters.value.page > 1) {
    filters.value.page--
    loadImages()
  }
}

const nextPage = () => {
  if (filters.value.page < totalPages.value) {
    filters.value.page++
    loadImages()
  }
}

const goToPage = (page: number) => {
  filters.value.page = page
  loadImages()
}

const perPageChanged = () => {
  filters.value.page = 1
  loadImages()
}

const viewImage = (image: JwstImage) => {
  selectedImage.value = image
}

const downloadImage = (image: JwstImage) => {
  // Создаем временную ссылку для скачивания
  const link = document.createElement('a')
  link.href = image.location
  link.download = image.id || 'jwst-image.jpg'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const getInstruments = (image: JwstImage): string[] => {
  if (!image.details?.instruments) return []
  return image.details.instruments.map(i => i.instrument).filter(Boolean)
}

const getInstrumentClass = (instrument: string): string => {
  const classes: Record<string, string> = {
    'NIRCam': 'bg-primary',
    'NIRSpec': 'bg-success',
    'MIRI': 'bg-warning text-dark',
    'NIRISS': 'bg-info',
    'FGS': 'bg-secondary'
  }
  return classes[instrument] || 'bg-dark'
}

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Наблюдатели
watch(
  () => filters.value.source,
  () => {
    filters.value.suffix = ''
    filters.value.program = ''
  }
)

// Жизненный цикл
onMounted(() => {
  loadImages()
})
</script>

<style scoped>
.jwst-view {
  position: relative;
}

.form-select-retro,
.form-control-retro {
  background: rgba(16, 16, 32, 0.8);
  border: 1px solid var(--primary-color);
  color: var(--text-color);
  border-radius: 0;
}

.form-select-retro:focus,
.form-control-retro:focus {
  background: rgba(16, 16, 32, 0.9);
  border-color: var(--secondary-color);
  box-shadow: 0 0 10px var(--primary-color);
  color: var(--text-color);
}

.form-select-retro-sm {
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
}

.jwst-card {
  background: var(--panel-bg);
  border: 1px solid var(--primary-color);
  border-radius: 0;
  transition: all 0.3s ease;
  overflow: hidden;
}

.jwst-card:hover {
  border-color: var(--secondary-color);
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
  transform: translateY(-5px);
}

.image-container {
  height: 200px;
  overflow: hidden;
  position: relative;
  background: rgba(0, 0, 0, 0.5);
}

.image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
  opacity: 0;
}

.image-container img.loaded {
  opacity: 1;
}

.image-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  color: var(--primary-color);
}

.image-badges {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.instrument-badge {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-button {
  position: absolute;
  top: 10px;
  right: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.jwst-card:hover .view-button {
  opacity: 1;
}

.card-title {
  color: var(--primary-color);
  font-weight: bold;
  font-family: 'Courier New', monospace;
}

.card-footer {
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(0, 255, 255, 0.2);
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
</style>
[file content end]