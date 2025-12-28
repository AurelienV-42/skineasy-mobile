import { api } from '@shared/services/api'
import type { RoutineResponse } from '@shared/types/routine.types'

interface ApiResponse<T> {
  data: T
}

export const routineService = {
  /**
   * Get routine by response ID (rspid) from Typeform
   */
  getByRspid: async (rspid: string): Promise<RoutineResponse> => {
    const response = await api.get<ApiResponse<RoutineResponse>>(`/api/v1/routine/${rspid}`)
    return response.data
  },
}
