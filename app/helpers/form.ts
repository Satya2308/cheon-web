export function getFormDataFromObject(o: object) {
  const formData = new FormData()
  for (let k in o) {
    const value = o[k as keyof typeof o]
    formData.append(k, value == null ? '' : value)
  }
  return formData
}

export function getUpdatedFormData(a: FormData, b: FormData) {
  const formData = new FormData()
  for (let [key, value] of a.entries()) {
    if (b.get(key) !== value && (typeof value !== 'object' || value.size > 0)) {
      formData.append(key, value)
    }
  }
  return formData
}
