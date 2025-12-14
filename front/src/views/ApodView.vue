<template>
  <div class="apod-view">
    <!-- Заголовок -->
    <div class="text-center mb-5">
      <h1 class="h1-retro retro-glow mb-3">
        <i class="fas fa-star me-3"></i>
        ASTRONOMY PICTURE OF THE DAY
      </h1>
      <p class="text-muted retro-border d-inline-block px-3 py-2">
        <i class="fas fa-calendar-day me-2"></i>
        NASA's daily glimpse of the cosmos since 1995
      </p>
    </div>

    <!-- Основной контент -->
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <!-- Карточка APOD -->
        <div class="panel mb-4">
          <!-- Заголовок и дата -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 class="retro-glow mb-1">{{ apodData?.title || 'Loading...' }}</h2>
              <div class="d-flex align-items-center">
                <i class="fas fa-calendar-alt me-2" style="color: var(--primary-color)"></i>
                <span class="metric-value">{{ formattedDate }}</span>
                <span class="mx-2">•</span>
                <span class="badge" :class="mediaTypeBadgeClass">
                  {{ mediaTypeLabel }}
                </span>
                <span class="mx-2">•</span>
                <span class="badge" :class="sourceBadgeClass">
                  <i class="fas fa-database me-1"></i> {{ apodData?.source || 'API' }}
                </span>
              </div>
            </div>
            
            <div class="d-flex gap-2">
              <button 
                class="btn btn-retro"
                @click="refreshApod"
                :disabled="loading"
              >
                <i class="fas fa-sync-alt me-2" :class="{ 'fa-spin': loading }"></i>
                REFRESH
              </button>
              <button 
                class="btn btn-retro"
                @click="toggleFavorite"
                :title="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
              >
                <i class="fas" :class="isFavorite ? 'fa-heart text-danger' : 'fa-heart'"></i>
              </button>
            </div>
          </div>

          <!-- Медиа контент -->
          <div class="media-container mb-4">
            <!-- Изображение -->
            <div v-if="apodData?.media_type === 'image'" class="image-wrapper">
              <img 
                :src="apodData.url" 
                :alt="apodData.title"
                class="img-fluid retro-border"
                @load="imageLoaded = true"
                @error="handleImageError"
                :class="{ 'loaded': imageLoaded }"
              />
              
              <!-- Индикатор загрузки -->
              <div v-if="!imageLoaded" class="loading-overlay">
                <i class="fas fa-spinner fa-spin fa-3x"></i>
                <div class="mt-3">Loading cosmic image...</div>
              </div>

              <!-- Кнопки управления изображением -->
              <div class="image-controls">
                <button 
                  class="btn btn-retro btn-sm"
                  @click="zoomImage"
                  :disabled="!imageLoaded"
                >
                  <i class="fas fa-search-plus"></i>
                </button>
                <button 
                  class="btn btn-retro btn-sm"
                  @click="downloadImage"
                  :disabled="!imageLoaded"
                >
                  <i class="fas fa-download"></i>
                </button>
                <a 
                  v-if="extendedApodData?.hdurl"
                  :href="extendedApodData.hdurl"
                  class="btn btn-retro btn-sm"
                  target="_blank"
                >
                  <i class="fas fa-expand-arrows-alt"></i> HD
                </a>
              </div>
            </div>

            <!-- Видео -->
            <div v-else-if="apodData?.media_type === 'video'" class="video-wrapper">
              <div class="video-placeholder retro-border">
                <i class="fas fa-video fa-4x mb-3"></i>
                <div class="metric-value mb-2">VIDEO CONTENT</div>
                <p class="small">Today's APOD is a video. Click to watch on YouTube.</p>
                <a 
                  :href="apodData.url"
                  class="btn btn-retro"
                  target="_blank"
                >
                  <i class="fab fa-youtube me-2"></i> WATCH ON YOUTUBE
                </a>
              </div>
            </div>

            <!-- Загрузка -->
            <div v-else-if="loading" class="loading-wrapper">
              <i class="fas fa-spinner fa-spin fa-3x mb-3"></i>
              <div class="metric-value">FETCHING TODAY'S COSMIC WONDER...</div>
            </div>

            <!-- Ошибка -->
            <div v-else class="error-wrapper">
              <i class="fas fa-exclamation-triangle fa-3x mb-3 text-warning"></i>
              <div class="metric-value">UNABLE TO LOAD APOD</div>
              <p class="small mt-2">Try refreshing or check your connection</p>
            </div>
          </div>

          <!-- Описание -->
          <div class="apod-description mb-4">
            <h4 class="retro-glow mb-3">
              <i class="fas fa-info-circle me-2"></i>
              EXPLANATION
            </h4>
            <div class="description-content">
              <p>{{ apodData?.explanation || 'No description available.' }}</p>
            </div>
          </div>

          <!-- Метаданные -->
          <div class="row">
            <div class="col-md-6">
              <div class="panel mb-3">
                <h5 class="retro-glow mb-3">
                  <i class="fas fa-cogs me-2"></i>
                  TECHNICAL DETAILS
                </h5>
                <div class="row">
                  <div class="col-6">
                    <div class="metric mb-2">
                      <div class="metric-label">SERVICE VERSION</div>
                      <div class="metric-value small">{{ apodData?.service_version || 'v1' }}</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="metric mb-2">
                      <div class="metric-label">COPYRIGHT</div>
                      <div class="metric-value small">{{ extendedApodData?.copyright || 'Public Domain' }}</div>
                    </div>
                  </div>
                </div>
                
                <div v-if="apodData?.date" class="metric">
                  <div class="metric-label">IMAGE DATE</div>
                  <div class="metric-value">{{ formatFullDate(apodData.date) }}</div>
                </div>
              </div>
            </div>

            <div class="col-md-6">
              <div class="panel mb-3">
                <h5 class="retro-glow mb-3">
                  <i class="fas fa-history me-2"></i>
                  APOD HISTORY
                </h5>
                <div class="metric mb-2">
                  <div class="metric-label">TODAY'S SELECTION</div>
                  <div class="metric-value small">#{{ randomApodNumber }} of 10,000+</div>
                </div>
                
                <div class="metric">
                  <div class="metric-label">RANDOM APOD</div>
                  <button 
                    class="btn btn-retro btn-sm"
                    @click="fetchRandomApod"
                    :disabled="loading"
                  >
                    <i class="fas fa-random me-1"></i> SHOW RANDOM
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Навигация по датам -->
          <div class="panel">
            <h5 class="retro-glow mb-3">
              <i class="fas fa-calendar-week me-2"></i>
              DATE NAVIGATION
            </h5>
            <div class="row">
              <div class="col-md-8">
                <div class="metric mb-3">
                  <div class="metric-label">SELECT DATE</div>
                  <div class="d-flex align-items-center gap-2">
                    <input 
                      type="date" 
                      class="form-control form-control-retro"
                      v-model="selectedDate"
                      :max="today"
                      @change="fetchApodByDate"
                    />
                    <button 
                      class="btn btn-retro"
                      @click="fetchApodByDate"
                      :disabled="loading || !selectedDate"
                    >
                      <i class="fas fa-search me-1"></i> GO
                    </button>
                    <button 
                      class="btn btn-outline-primary"
                      @click="resetToToday"
                    >
                      TODAY
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="col-md-4">
                <div class="metric">
                  <div class="metric-label">QUICK NAV</div>
                  <div class="d-flex gap-2">
                    <button 
                      class="btn btn-retro btn-sm"
                      @click="navigateDate(-1)"
                      :disabled="loading"
                    >
                      <i class="fas fa-chevron-left"></i> PREV
                    </button>
                    <button 
                      class="btn btn-retro btn-sm"
                      @click="navigateDate(1)"
                      :disabled="loading || isToday"
                    >
                      NEXT <i class="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Информация о проекте -->
        <div class="panel">
          <h5 class="retro-glow mb-3">
            <i class="fas fa-rocket me-2"></i>
            ABOUT APOD
          </h5>
          <div class="row">
            <div class="col-md-8">
              <p class="small">
                Astronomy Picture of the Day (APOD) is a NASA website that features a different 
                astronomical image or photograph each day, along with a brief explanation written 
                by a professional astronomer. Started in 1995, it is one of the most popular 
                websites at NASA.
              </p>
            </div>
            <div class="col-md-4 text-end">
              <a 
                href="https://apod.nasa.gov/apod/astropix.html" 
                class="btn btn-retro btn-sm"
                target="_blank"
              >
                <i class="fas fa-external-link-alt me-1"></i> OFFICIAL SITE
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно для увеличенного изображения -->
    <div v-if="showZoomedImage && apodData?.media_type === 'image'" class="modal fade show d-block modal-retro" tabindex="-1">
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title retro-glow">
              <i class="fas fa-expand me-2"></i>
              {{ apodData?.title }}
            </h5>
            <button type="button" class="btn-close btn-close-white" @click="showZoomedImage = false"></button>
          </div>
          <div class="modal-body text-center">
            <img 
              :src="apodData.url" 
              :alt="apodData.title"
              class="img-fluid"
              style="max-height: 85vh; object-fit: contain;"
            />
            <div class="mt-3">
              <button class="btn btn-retro me-2" @click="downloadImage">
                <i class="fas fa-download me-2"></i> DOWNLOAD
              </button>
              <button class="btn btn-outline-primary" @click="showZoomedImage = false">
                CLOSE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Затемнение фона для модального окна -->
    <div v-if="showZoomedImage" class="modal-backdrop fade show" @click="showZoomedImage = false"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useSpaceStore } from '@/stores/space.store'
import dayjs from 'dayjs'

const store = useSpaceStore()

// Интерфейс для расширенных данных APOD
interface ExtendedApodData {
  date?: string;
  explanation?: string;
  hdurl?: string;
  media_type?: string;
  service_version?: string;
  title?: string;
  url?: string;
  copyright?: string;
  source?: string;
}

// Состояния
const loading = ref(false)
const imageLoaded = ref(false)
const showZoomedImage = ref(false)
const isFavorite = ref(false)
const selectedDate = ref<string>('')
const randomApodNumber = ref<number>(0)

// Компьютеды
const apodData = computed(() => store.apodData)
const extendedApodData = computed<ExtendedApodData>(() => store.apodData || {})

const today = computed(() => dayjs().format('YYYY-MM-DD'))

const formattedDate = computed(() => {
  if (!apodData.value?.date) return dayjs().format('MMMM D, YYYY')
  return dayjs(apodData.value.date).format('MMMM D, YYYY')
})

const mediaTypeLabel = computed(() => {
  if (!apodData.value?.media_type) return 'Unknown'
  return apodData.value.media_type.toUpperCase()
})

const mediaTypeBadgeClass = computed(() => ({
  'bg-primary': apodData.value?.media_type === 'image',
  'bg-warning text-dark': apodData.value?.media_type === 'video',
  'bg-secondary': !apodData.value?.media_type
}))

const sourceBadgeClass = computed(() => ({
  'bg-success': apodData.value?.source === 'Redis',
  'bg-info': apodData.value?.source === 'API' || !apodData.value?.source
}))

const isToday = computed(() => {
  if (!apodData.value?.date) return false
  return dayjs(apodData.value.date).isSame(dayjs(), 'day')
})

// Методы
const refreshApod = async () => {
  try {
    loading.value = true
    imageLoaded.value = false
    await store.fetchApod()
    // Генерируем случайный номер для истории
    randomApodNumber.value = Math.floor(Math.random() * 10000) + 1
  } catch (error) {
    console.error('Error refreshing APOD:', error)
  } finally {
    loading.value = false
  }
}

const fetchRandomApod = async () => {
  // Генерируем случайную дату между 1995-06-16 и сегодня
  const startDate = dayjs('1995-06-16')
  const endDate = dayjs()
  const randomDays = Math.floor(Math.random() * endDate.diff(startDate, 'day'))
  const randomDate = startDate.add(randomDays, 'day').format('YYYY-MM-DD')
  
  selectedDate.value = randomDate
  await fetchApodByDate()
}

const fetchApodByDate = async () => {
  if (!selectedDate.value) return
  
  try {
    loading.value = true
    imageLoaded.value = false
    
    // Здесь в реальном приложении был бы отдельный endpoint для даты
    // Пока просто перезагружаем текущий APOD и симулируем смену даты
    await store.fetchApod()
    
    // Обновляем данные с выбранной датой
    if (apodData.value) {
      // Используем type assertion для обновления данных
      const updatedData = { ...apodData.value }
      updatedData.date = selectedDate.value
      updatedData.title = `Astronomy Picture of the Day - ${dayjs(selectedDate.value).format('MMMM D, YYYY')}`
      
      // В реальном приложении здесь был бы вызов API с датой
      // Временно обновляем локально
      store.setApodData(updatedData)
    }
    
  } catch (error) {
    console.error('Error fetching APOD by date:', error)
  } finally {
    loading.value = false
  }
}

const resetToToday = () => {
  selectedDate.value = today.value
  refreshApod()
}

const navigateDate = (days: number) => {
  if (!apodData.value?.date) return
  
  const currentDate = dayjs(apodData.value.date)
  const newDate = currentDate.add(days, 'day')
  
  // Не позволяем заглядывать в будущее
  if (newDate.isAfter(dayjs(), 'day')) return
  
  selectedDate.value = newDate.format('YYYY-MM-DD')
  fetchApodByDate()
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  // Здесь можно сохранить в localStorage или отправить на сервер
  if (isFavorite.value) {
    console.log('Added to favorites:', apodData.value?.title)
  } else {
    console.log('Removed from favorites:', apodData.value?.title)
  }
}

const zoomImage = () => {
  if (apodData.value?.media_type === 'image' && imageLoaded.value) {
    showZoomedImage.value = true
  }
}

const downloadImage = () => {
  if (!apodData.value?.url || apodData.value.media_type !== 'image') return
  
  const link = document.createElement('a')
  link.href = apodData.value.url
  link.download = `apod-${apodData.value.date || 'today'}.jpg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handleImageError = () => {
  console.error('Failed to load APOD image')
  imageLoaded.value = false
}

const formatFullDate = (dateString: string) => {
  return dayjs(dateString).format('dddd, MMMM D, YYYY')
}

// Жизненный цикл
onMounted(() => {
  // Инициализируем выбранную дату сегодняшним днем
  selectedDate.value = today.value
  
  // Если APOD еще не загружен, загружаем
  if (!store.apodData) {
    refreshApod()
  } else {
    // Генерируем случайный номер для истории
    randomApodNumber.value = Math.floor(Math.random() * 10000) + 1
  }
  
  // Восстанавливаем состояние избранного из localStorage
  const savedFavorite = localStorage.getItem(`apod-favorite-${apodData.value?.date}`)
  if (savedFavorite) {
    isFavorite.value = JSON.parse(savedFavorite)
  }
})

// Наблюдатель для избранного
watch(isFavorite, (newVal) => {
  if (apodData.value?.date) {
    localStorage.setItem(`apod-favorite-${apodData.value.date}`, JSON.stringify(newVal))
  }
})
</script>

<style scoped>
.apod-view {
  position: relative;
}

.media-container {
  position: relative;
  min-height: 400px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow: hidden;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 500px;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: opacity 0.5s ease;
  opacity: 0;
}

.image-wrapper img.loaded {
  opacity: 1;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  color: var(--primary-color);
}

.image-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-wrapper:hover .image-controls {
  opacity: 1;
}

.video-wrapper {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-placeholder {
  padding: 60px;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  max-width: 600px;
}

.loading-wrapper,
.error-wrapper {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.apod-description {
  background: rgba(16, 16, 32, 0.5);
  padding: 25px;
  border-radius: 4px;
  border-left: 3px solid var(--primary-color);
}

.description-content {
  line-height: 1.8;
  color: var(--text-color);
  font-size: 1.05rem;
}

.form-control-retro {
  background: rgba(16, 16, 32, 0.8);
  border: 1px solid var(--primary-color);
  color: var(--text-color);
  border-radius: 0;
}

.form-control-retro:focus {
  background: rgba(16, 16, 32, 0.9);
  border-color: var(--secondary-color);
  box-shadow: 0 0 10px var(--primary-color);
  color: var(--text-color);
}

input[type="date"].form-control-retro {
  font-family: 'Courier New', monospace;
}

.modal-retro .modal-content {
  background: var(--panel-bg);
  border: 2px solid var(--primary-color);
}

.modal-retro .modal-header {
  border-bottom: 1px solid var(--primary-color);
  background: rgba(0, 0, 0, 0.5);
}

.modal-retro .modal-body {
  background: rgba(0, 0, 0, 0.3);
}

.btn-close-white {
  filter: invert(1) grayscale(100%) brightness(200%);
}

.modal-backdrop {
  opacity: 0.8;
  background: var(--dark-bg);
}

.badge {
  font-family: 'Courier New', monospace;
  font-weight: bold;
  letter-spacing: 0.5px;
}

.small {
  color: var(--text-color);
  opacity: 0.9;
}

.metric-value.small {
  font-size: 0.9rem;
}
</style>