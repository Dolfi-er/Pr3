<template>
  <div id="app" class="retro-futurism">
    <!-- Эффект сканирующих линий -->
    <div class="scanlines"></div>
    
    <!-- Навигация -->
    <nav class="navbar navbar-expand-lg navbar-dark nav-retro">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand retro-glow">
          <i class="fas fa-satellite me-2"></i>
          SPACE DASHBOARD
        </router-link>
        
        <button class="navbar-toggler btn-retro" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link nav-link-retro" exact-active-class="active">
                <i class="fas fa-tachometer-alt me-1"></i> Dashboard
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/iss" class="nav-link nav-link-retro" active-class="active">
                <i class="fas fa-satellite me-1"></i> ISS
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/apod" class="nav-link nav-link-retro" active-class="active">
                <i class="fas fa-star me-1"></i> APOD
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/jwst" class="nav-link nav-link-retro" active-class="active">
                <i class="fas fa-hubble me-1"></i> JWST
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/space" class="nav-link nav-link-retro" active-class="active">
                <i class="fas fa-rocket me-1"></i> Space Data
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/astro" class="nav-link nav-link-retro" active-class="active">
                <i class="fas fa-moon me-1"></i> Astro Events
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/telemetry" class="nav-link nav-link-retro" active-class="active">
                <i class="fas fa-microchip me-1"></i> Telemetry
              </router-link>
            </li>
          </ul>
          
          <div class="d-flex ms-3">
            <button class="btn btn-retro btn-sm" @click="toggleTheme">
              <i :class="themeIcon"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Основной контент -->
    <main class="container-fluid mt-4">
      <router-view />
    </main>
    
    <!-- Футер -->
    <footer class="mt-5 py-3 border-top border-primary">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <p class="mb-0">
              <i class="fas fa-rocket me-2"></i>
              SPACE MONITORING SYSTEM v1.0
            </p>
          </div>
          <div class="col-md-6 text-end">
            <p class="mb-0">
              {{ currentTime }} UTC
            </p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

// Подключаем плагин UTC для dayjs
dayjs.extend(utc)

const isDarkTheme = ref(true)
const currentTime = ref('')

const themeIcon = computed(() => 
  isDarkTheme.value ? 'fas fa-sun' : 'fas fa-moon'
)

const toggleTheme = () => {
  isDarkTheme.value = !isDarkTheme.value
  document.documentElement.setAttribute(
    'data-theme', 
    isDarkTheme.value ? 'dark' : 'light'
  )
}

const updateTime = () => {
  // Используем плагин utc
  currentTime.value = dayjs().utc().format('YYYY-MM-DD HH:mm:ss')
}

let timer: number

onMounted(() => {
  updateTime()
  timer = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.retro-futurism {
  min-height: 100vh;
  position: relative;
}

footer {
  background: rgba(16, 16, 32, 0.9);
  border-top: 1px solid var(--primary-color) !important;
  color: var(--text-color);
  font-family: 'Courier New', monospace;
}
</style>