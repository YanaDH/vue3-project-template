import config from '../../../config'

const prefix = config.PROJECT_NAME

interface ProxyStorage {
  getItem(key: string): any
  setItem(Key: string, value: string): void
  removeItem(key: string): void
  clear(): void
}

//sessionStorage operate
class sessionStorageProxy implements ProxyStorage {
  protected storage: ProxyStorage

  constructor(storageModel: ProxyStorage) {
    this.storage = storageModel
  }

  // 存
  public setItem(key: string, value: any): void {
    this.storage.setItem(`${prefix}-${key}`, JSON.stringify(value))
  }

  // 取
  public getItem(key: string): any {
    return JSON.parse(this.storage.getItem(`${prefix}-${key}`))
  }

  // 删
  public removeItem(key: string): void {
    this.storage.removeItem(`${prefix}-${key}`)
  }

  // 清空
  public clear(): void {
    Object.keys(this.storage).forEach((key) => {
      if (key.startsWith(prefix)) this.storage.removeItem(key)
    })
    // this.storage.clear()
  }
}

//localStorage operate
class localStorageProxy extends sessionStorageProxy implements ProxyStorage {
  constructor(localStorage: ProxyStorage) {
    super(localStorage)
  }
}

export const storageSession = new sessionStorageProxy(sessionStorage)

export const storageLocal = new localStorageProxy(localStorage)
