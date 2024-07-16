import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  save<T>(key: string, data: T) {
    const jsonData = localStorage.getItem(key)
    try {
      if (jsonData) {
        const listData: T[] = JSON.parse(jsonData)
        listData.push(data)
        const updatedJSONData = JSON.stringify(listData)
        localStorage.setItem(key, updatedJSONData)
      } else {
        const newData = [data]
        const newJSONData = JSON.stringify(newData)
        localStorage.setItem(key, newJSONData)
      }
    } catch (e) {
      throw new Error('Failed to save data')
    }
  }

  update<T>(key: string, id: string, newData: T) {
    const allData = this.findAll<T>(key)
    const idx = allData.findIndex((item: any) => item.id == id)
    if (idx > 0) {
      allData[idx] = newData
      const updatedJSONData = JSON.stringify(allData)
      localStorage.setItem(key, updatedJSONData)
    }
  }

  find<T>(key: string, id: string): T | undefined {
    const dataJSON = localStorage.getItem(key)
    try {
      if (dataJSON) {
        const listData: T[] = JSON.parse(dataJSON)
        const data = listData.find((item: any) => item.id == id)
        return data
      }
    } catch (ignored) { }
    return undefined
  }

  findAll<T>(key: string, page: number = 1, limit: number = 0, sortDesc: boolean = false): T[] {
    const dataJSON = localStorage.getItem(key)
    try {
      if (dataJSON) {
        const listData: T[] = JSON.parse(dataJSON)
        if (sortDesc) listData.reverse();
        if (!limit) return listData;
        return listData.splice((limit * (page - 1)), (limit * page))
      }
    } catch (ignored) { }
    return []
  }

  clearAll(key: string) {
    localStorage.removeItem(key);
  }
}
