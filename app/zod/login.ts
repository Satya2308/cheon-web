import { flatten, getRaw } from "~/helpers/zod"
import { z } from "zod"

export async function validateLogin(data: FormData) {
    const raw = getRaw(data)
    const schema = z.object({
        phone: z.string(),
        password: z.string()
    })
    return await schema.safeParseAsync(raw).then(res => flatten(res))
}
