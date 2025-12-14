import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import spaceService, { type IssPosition, type ApodData } from '@/services/space.service'

export const useSpaceStore = defineStore('space', () => {
  
  const issPosition: Ref<IssPosition | null> = ref(null)
  const issTrend: Ref<any> = ref(null)
  const apodData: Ref<ApodData | null> = ref(null)
  const spaceData: Ref<Record<string, any>> = ref({})
  const telemetryData: Ref<any[]> = ref([])
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  
  const issCoordinates = computed(() => {
    if (!issPosition.value) return null
    return {
      lat: issPosition.value.latitude,
      lng: issPosition.value.longitude,
      alt: issPosition.value.altitude
    }
  })

  const issVelocity = computed(() => {
    if (!issPosition.value) return 0
    return issPosition.value.velocity
  })

  
  const fetchIssData = async () => {
    try {
      loading.value = true
      error.value = null
      
      const [current, trend] = await Promise.all([
        spaceService.getIssLast(),
        spaceService.getIssTrend()
      ])
      
      if (current?.payload) {
        issPosition.value = JSON.parse(current.payload)
      }
      issTrend.value = trend
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch ISS data'
      console.error('Error fetching ISS data:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchApod = async () => {
    try {
      loading.value = true
      const data = await spaceService.getApod()
      apodData.value = data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch APOD'
    } finally {
      loading.value = false
    }
  }

  const fetchSpaceData = async (source: string) => {
    try {
      const data = await spaceService.getSpaceData(source)
      spaceData.value[source] = data
    } catch (err: any) {
      console.error(`Error fetching ${source} data:`, err)
    }
  }

  const fetchAllSpaceData = async () => {
    const sources = ['neo', 'cme', 'flr', 'spacex', 'apod']
    await Promise.all(sources.map(source => fetchSpaceData(source)))
  }

  return {
    
    issPosition,
    issTrend,
    apodData,
    spaceData,
    telemetryData,
    loading,
    error,
    
    
    issCoordinates,
    issVelocity,
    
    
    fetchIssData,
    fetchApod,
    fetchSpaceData,
    fetchAllSpaceData
  }
})