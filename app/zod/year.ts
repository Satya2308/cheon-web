import { flatten, getRaw } from '~/helpers/zod'
import { z } from 'zod'

const baseSchema = z.object({
  name: z.string().min(1, 'ត្រូវបំពេញ'),
  classDuration: z.enum(['1_hour', '1_5_hour']),
  isActive: z.coerce.boolean(),
  startDateKh: z.string().min(1, 'ត្រូវបំពេញ'),
  startDateEng: z.string().min(1, 'ត្រូវបំពេញ'),
})

export async function validateCreateYear(data: FormData) {
  const raw = getRaw(data)
  return await baseSchema.safeParseAsync(raw).then((res) => flatten(res))
}

export async function validateUpdateYear(data: FormData) {
  const raw = getRaw(data)
  return await baseSchema
    .partial()
    .safeParseAsync(raw)
    .then((res) => flatten(res))
}
