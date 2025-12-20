import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email({ message: 'validation.invalidEmail' }),
  password: z.string().min(6, { message: 'validation.passwordMin' }),
})

export const registerSchema = z.object({
  firstname: z.string().min(2, { message: 'validation.firstnameMin' }),
  lastname: z.string().min(2, { message: 'validation.lastnameMin' }),
  email: z.email({ message: 'validation.invalidEmail' }),
  password: z.string().min(6, { message: 'validation.passwordMin' }),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
