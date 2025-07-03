import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useContactsStore = defineStore('contacts', () => {
  // 好友列表
  const friends = ref([
    {
      id: 1001,
      name: '小李',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Lily',
      remark: '前端开发',
      status: 'online',
      tags: ['同事', '前端'],
      lastActive: '刚刚'
    },
    {
      id: 1002,
      name: '王经理',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Wang',
      remark: '产品经理',
      status: 'away',
      tags: ['领导'],
      lastActive: '1小时前'
    },
    {
      id: 1003,
      name: '张工程师',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Zhang',
      remark: '后端开发',
      status: 'online',
      tags: ['同事', 'Go'],
      lastActive: '刚刚'
    },
    {
      id: 1004,
      name: '小陈',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Chen',
      remark: 'UI设计师',
      status: 'offline',
      tags: ['设计'],
      lastActive: '2天前'
    }
  ])
  
  // 好友请求列表
  const friendRequests = ref([
    {
      id: 2001,
      name: '刘同学',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Liu',
      remark: '求职者',
      message: '您好，我对Go开发很感兴趣',
      status: 'pending',
      time: '10分钟前'
    }
  ])
  
  // 搜索关键词
  const searchKeyword = ref('')
  
  // 分组好友列表
  const groupedFriends = computed(() => {
    const groups = {
      online: [],
      away: [],
      offline: []
    }
    
    friends.value.forEach(friend => {
      if (friend.status === 'online') groups.online.push(friend)
      else if (friend.status === 'away') groups.away.push(friend)
      else groups.offline.push(friend)
    })
    
    return groups
  })
  
  // 过滤搜索结果
  const searchResults = computed(() => {
    if (!searchKeyword.value.trim()) return []
    
    const keyword = searchKeyword.value.toLowerCase()
    return friends.value.filter(friend => 
      friend.name.toLowerCase().includes(keyword) || 
      friend.remark.toLowerCase().includes(keyword) ||
      friend.tags.some(tag => tag.toLowerCase().includes(keyword))
    )
  })
  
  // 添加好友请求
  const addFriendRequest = (request) => {
    friendRequests.value.unshift(request)
  }
  
  // 处理好友请求
  const handleFriendRequest = (requestId, accept) => {
    const requestIndex = friendRequests.value.findIndex(r => r.id === requestId)
    
    if (requestIndex !== -1) {
      const request = friendRequests.value[requestIndex]
      
      if (accept) {
        // 添加到好友列表
        friends.value.unshift({
          id: Date.now(),
          name: request.name,
          avatar: request.avatar,
          remark: request.remark || request.name,
          status: 'online',
          tags: ['新好友'],
          lastActive: '刚刚'
        })
      }
      
      // 移除请求
      friendRequests.value.splice(requestIndex, 1)
    }
  }
  
  // 发送好友请求
  const sendFriendRequest = (userId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: '好友请求已发送'
        })
      }, 1000)
    })
  }
  
  return {
    friends,
    friendRequests,
    searchKeyword,
    groupedFriends,
    searchResults,
    addFriendRequest,
    handleFriendRequest,
    sendFriendRequest
  }
})