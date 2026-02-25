import { get, set, del, keys, entries } from 'idb-keyval'

export const historyDB = {
  async saveGeneration(data) {
    const id = `gen_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const record = {
      ...data,
      id,
      timestamp: Date.now(),
    }
    await set(id, record)
    return id
  },

  async getGeneration(id) {
    return get(id)
  },

  async getAllGenerations() {
    const allEntries = await entries()
    return allEntries
      .map(([, val]) => val)
      .filter(val => val && val.timestamp)
      .sort((a, b) => b.timestamp - a.timestamp)
  },

  async deleteGeneration(id) {
    return del(id)
  },

  async clearAll() {
    const allKeys = await keys()
    await Promise.all(allKeys.map(k => del(k)))
  },
}
