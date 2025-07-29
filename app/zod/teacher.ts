import { flatten, getRaw } from '~/helpers/zod'
import { z } from 'zod'

const baseSchema = z.object({
  name: z.string().min(1, 'ត្រូវបំពេញ'),
  phone: z.string().min(1, 'ត្រូវបំពេញ'),
  code: z.string().min(1, 'ត្រូវបំពេញ'),
  gender: z.enum(['MALE', 'FEMALE']),
  dob: z.union([z.coerce.date(), z.literal('').transform(() => null)]),
  subject: z.string(),
  profession1: z.string(),
  profession2: z.string(),
  krobkan: z.string(),
  rank: z.string(),
})

export async function validateCreateTeacher(data: FormData) {
  const raw = getRaw(data)
  return await baseSchema.safeParseAsync(raw).then((res) => flatten(res))
}

export async function validateUpdateTeacher(data: FormData) {
  const raw = getRaw(data)
  return await baseSchema
    .partial()
    .safeParseAsync(raw)
    .then((res) => flatten(res))
}
