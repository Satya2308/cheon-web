import { flatten, getRaw } from '~/helpers/zod'
import { z } from 'zod'

export async function validateCreateTeacher(data: FormData) {
  const raw = getRaw(data)
  const schema = z.object({
    name: z.string().min(1, 'ត្រូវបំពេញ'),
    phone: z.string().min(1, 'ត្រូវបំពេញ'),
    code: z.string().min(1, 'ត្រូវបំពេញ'),
    gender: z.string().optional(),
    dob: z
      .union([z.coerce.date(), z.literal('').transform(() => undefined)])
      .optional(),
    subject: z.string().optional(),
    profession1: z.string().optional(),
    profession2: z.string().optional(),
    krobkan: z.string().optional(),
    rank: z.string().optional(),
  })
  return await schema.safeParseAsync(raw).then((res) => flatten(res))
}
