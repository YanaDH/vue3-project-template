import { defineStore } from 'pinia'
import { store } from '@/store'
import { UserInterface } from '@/types'
import { getUser } from '@/utils/auth'

const userStore = defineStore('user', {
  state: () => {
    return {
      token: getUser('token'),
      hasPermission: !!getUser('token'),
      userId: getUser('userId')
    }
  },
  actions: {
    SET_USER_INFO(data: UserInterface) {
      const { token, userId } = data
      this.token = token
      this.hasPermission = !!token
      this.userId = userId
    },
    REMOVE_USER_INFO() {
      this.token = null
      this.hasPermission = false
      this.userId = null
    }
  }
})

export function userStoreHook() {
  return userStore(store)
}
