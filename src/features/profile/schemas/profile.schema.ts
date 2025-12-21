import { z } from 'zod'

export const editProfileSchema = z.object({
  firstname: z.string().min(2, 'First name must be at least 2 characters'),
  lastname: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.email('Invalid email address'),
})

export type EditProfileInput = z.infer<typeof editProfileSchema>
