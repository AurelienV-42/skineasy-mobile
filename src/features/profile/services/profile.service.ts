import { api } from '@shared/services/api'
import type { EditProfileInput } from '@features/profile/schemas/profile.schema'
import type { UserProfile } from '@shared/types/user.types'

export interface UpdateProfileResponse {
  data: UserProfile
}

export const profileService = {
  updateProfile: (data: EditProfileInput): Promise<UpdateProfileResponse> => {
    return api.put<UpdateProfileResponse>('/api/v1/user/profile', data)
  },
}
