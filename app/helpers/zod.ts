import { z } from "zod";

export function getRaw(data: FormData, allowMultiple: boolean = false) {
  const raw: { [key: string]: any } = {};
  for (const key of data.keys()) {
    const val = allowMultiple ? data.getAll(key) : data.get(key);

    if (allowMultiple && Array.isArray(val)) {
      if (val.length === 0) continue;
      raw[key] = val
        .map((item) =>
          item instanceof File && item.size === 0 ? undefined : item
        )
        .filter((item) => item !== undefined);
    } else {
      if (val === undefined) continue;
      const notFile = !(val instanceof File);
      const notEmptyFile = val instanceof File && val.size > 0;
      if (notFile || notEmptyFile) raw[key] = val;
    }
  }
  return raw;
}

export function flatten<Input, Output>(
	res: z.SafeParseReturnType<Input, Output>
) {
	const ok = res.success
	if (ok) return { data: res.data, error: null }
	return { data: null, error: res.error.flatten().fieldErrors }
}
