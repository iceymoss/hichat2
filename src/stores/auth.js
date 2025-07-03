import { defineStore } from 'pinia'
import { ref } from 'vue'
import request from '../utils/request'

export const useAuthStore = defineStore('auth', () => {
  // 当前用户信息
  const user = ref(null)
  
  // 登录状态
  const isAuthenticated = ref(false)
  
  // 登录方法
  const login = async (phone, password) => {
    try {
      const response = await request.post('api/v1/user/login', {
        phone,
        password,
        // 以下字段在登录时可能不需要，但接口要求，暂时使用默认值
        nickname: '新用户',
        sex: 1,
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=User'
      })
      
      // 保存token到本地存储
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('token_expire', response.data.expire)
      
      // 获取用户信息（这里需要另一个接口，暂时模拟）
      user.value = {
        id: '1001',
        phone,
        name: '新用户',
        avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=User'
      }
      
      isAuthenticated.value = true
      
      return user.value
    } catch (error) {
      throw new Error(error.message || '登录失败')
    }
  }
  
  // 注册方法
  const register = async (userData) => {
    try {
      // 注册接口应该与登录接口不同，这里假设使用同一个接口
      const response = await request.post('/api/v1/user/register', {
        phone: userData.phone,
        password: userData.password,
        nickname: userData.nickname,
        sex: userData.sex || 1,
        avatar: userData.avatar || 'https://api.dicebear.com/7.x/personas/svg?seed=User'
      })
      
      // 保存token到本地存储
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('token_expire', response.data.expire)
      
      // 获取用户信息（这里需要另一个接口，暂时模拟）
      user.value = {
        id: '1001',
        phone: userData.phone,
        name: userData.nickname,
        avatar: userData.avatar || 'https://api.dicebear.com/7.x/personas/svg?seed=User'
      }
      
      isAuthenticated.value = true
      
      return user.value
    } catch (error) {
      throw new Error(error.message || '注册失败')
    }
  }
  
  // 登出方法
  const logout = () => {
    // 清除本地存储的token
    localStorage.removeItem('token')
    localStorage.removeItem('token_expire')
    
    user.value = null
    isAuthenticated.value = false
  }
  
  // 检查登录状态
  const checkAuth = () => {
    const token = localStorage.getItem('token')
    const expire = localStorage.getItem('token_expire')
    
    if (token && expire && Date.now() < expire * 1000) {
      isAuthenticated.value = true
      // 这里应该调用获取用户信息的接口
      return true
    }
    return false
  }
  
  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth
  }
})