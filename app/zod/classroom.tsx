import { flatten, getRaw } from '~/helpers/zod'
import { z } from 'zod'

const baseSchema = z.object({
  name: z.string().min(1, 'ត្រូវបំពេញ'),
  leadTeacherId: z.string().min(1, 'ត្រូវបំពេញ'),
  yearId: z.string().min(1, 'ត្រូវបំពេញ'),
})

export async function validateCreateClassroom(data: FormData) {
  const raw = getRaw(data)
  return await baseSchema.safeParseAsync(raw).then((res) => flatten(res))
}

export async function validateUpdateClassroom(data: FormData) {
  const raw = getRaw(data)
  return await baseSchema
    .partial()
    .safeParseAsync(raw)
    .then((res) => flatten(res))
}
