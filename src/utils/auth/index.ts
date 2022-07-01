import { userStoreHook } from '@/store/modules/user'
import { UserInterface } from '@/types'
import { storageLocal } from '@/utils/storage'
import config from '../../../config'

const userStore = userStoreHook()
const prefix = config.PROJECT_NAME

export function getUser(key: string) {
  const user = storageLocal.getItem('user') || {}
  return user[key]
}

// 设置用户信息
export function setUser(data: UserInterface) {
  storageLocal.setItem('user', data)
  userStore.SET_USER_INFO(data)
}

// 删除用户信息
export function removeUser() {
  storageLocal.removeItem('user')
  userStore.REMOVE_USER_INFO()
}

// 手动删除localstorage时清空userStore
window.addEventListener('storage', function (e) {
  if ((!e.key || e.key === `${prefix}-user`) && !e.newValue) {
    userStore.REMOVE_USER_INFO()
    window.location.reload()
  }
})
