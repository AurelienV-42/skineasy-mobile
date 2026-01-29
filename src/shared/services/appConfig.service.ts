import { api } from '@shared/services/api'

interface AppConfig {
  minimumVersion: string
  storeUrls: {
    ios: string
    android: string
  }
}

interface AppConfigResponse {
  data: AppConfig
}

export const appConfigService = {
  getConfig: (): Promise<AppConfigResponse> =>
    api.get<AppConfigResponse>('/api/v1/app/config', { skipAuth: true }),
}
