import api from './api'

export interface SpaceCache {
  id: number
  source: string
  fetchedAt: string
  payload: any
}

export interface IssPosition {
  name: string
  id: number
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  visibility: string
  footprint: number
  timestamp: number
  daynum: number
  solar_lat: number
  solar_lon: number
  units: string
}

export interface IssFetchLog {
  id: number
  fetchedAt: string
  sourceUrl: string
  payload: string
}

export interface ApodData {
  url: string
  date: string
  title: string
  media_type: string
  explanation: string
  service_version: string
  source: string
}

export interface TelemetryData {
  id: number
  timestamp: string
  isOk: boolean
  voltage: number
  temp: number
  sourceFile: string
}

export interface JwstImage {
  id?: string
  thumbnail?: string
  title?: string
  description?: string
  url?: string
}

export interface AstroEvent {
  body: string
  data: any
}

class SpaceService {
  // ISS данные
  async getIssCurrent() {
    const response = await api.get('/iss/fetch')
    return response.data
  }

  async getIssLast() {
    const response = await api.get('/iss/last')
    return response.data
  }

  async getIssTrend() {
    const response = await api.get('/iss/trend')
    return response.data
  }

  // APOD данные
  async getApod() {
    const response = await api.get('/apod/apod')
    return response.data
  }

  // Space Cache данные
  async getSpaceData(source: string) {
    const response = await api.get(`/space/${source}/latest`)
    return response.data
  }

  // JWST данные
  async getJwstFeed(params: any) {
    const response = await api.get('/jwst/feed', { params })
    return response.data
  }

  // Astro Events
  async getAstroEvents(lat: number, lon: number, days: number) {
    const response = await api.get('/astro/events', {
      params: { lat, lon, days }
    })
    return response.data
  }

  // OSDR данные
  async getOsdrData(limit = 20) {
    const response = await api.get('/osdr/list', { params: { limit } })
    return response.data
  }

  async getAllOsdr() {
    const response = await api.get('/osdr/all')
    return response.data
  }

  async syncOsdr() {
    const response = await api.get('/osdr/sync')
    return response.data
  }

  // Health check
  async getHealth() {
    const response = await api.get('/health')
    return response.data
  }
}

export default new SpaceService()