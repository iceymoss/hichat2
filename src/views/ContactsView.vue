<template>
  <div class="contacts-view">
    <div class="search-section">
      <div class="search-container">
        <i class="icon icon-search"></i>
        <input 
          type="text" 
          v-model="searchKeyword" 
          placeholder="搜索好友昵称、备注或标签" 
          @input="handleSearch"
        >
        <button v-if="searchKeyword" class="btn-clear" @click="clearSearch">
          <i class="icon icon-close"></i>
        </button>
      </div>
      
      <div v-if="searchMode" class="search-results">
        <h3 v-if="searchResults.length > 0">搜索结果</h3>
        <div v-else class="no-results">没有找到匹配的好友</div>
        
        <div v-for="friend in searchResults" :key="friend.id" class="friend-item">
          <img :src="friend.avatar" alt="头像" class="avatar">
          <div class="friend-info">
            <div class="name">{{ friend.name }}</div>
            <div class="remark">{{ friend.remark }}</div>
            <div class="tags">
              <span v-for="tag in friend.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
          <div class="friend-actions">
            <button class="btn-chat" @click="startChat(friend)">
              <i class="icon icon-chat"></i> 发消息
            </button>
            <button class="btn-profile" @click="viewProfile(friend.id)">
              <i class="icon icon-profile"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="!searchMode" class="contacts-content">
      <div class="contacts-section">
        <div class="section-header">
          <h3>好友请求</h3>
          <span v-if="friendRequests.length > 0" class="badge">{{ friendRequests.length }}</span>
        </div>
        
        <div v-if="friendRequests.length > 0" class="request-list">
          <div v-for="request in friendRequests" :key="request.id" class="request-item">
            <img :src="request.avatar" alt="头像" class="avatar">
            <div class="request-info">
              <div class="name">{{ request.name }}</div>
              <div class="message">{{ request.message }}</div>
              <div class="time">{{ request.time }}</div>
            </div>
            <div class="request-actions">
              <button class="btn-accept" @click="handleRequest(request.id, true)">接受</button>
              <button class="btn-reject" @click="handleRequest(request.id, false)">拒绝</button>
            </div>
          </div>
        </div>
        <div v-else class="no-requests">
          暂无好友请求
        </div>
      </div>
      
      <div class="contacts-section">
        <div class="section-header">
          <h3>在线好友 <span class="count">({{ groupedFriends.online.length }})</span></h3>
        </div>
        <div class="friend-list">
          <div 
            v-for="friend in groupedFriends.online" 
            :key="friend.id" 
            class="friend-item"
          >
            <div class="friend-avatar">
              <img :src="friend.avatar" alt="头像" class="avatar">
              <span class="status-badge online"></span>
            </div>
            <div class="friend-info">
              <div class="name">{{ friend.name }}</div>
              <div class="status">在线</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="contacts-section">
        <div class="section-header">
          <h3>离开的好友 <span class="count">({{ groupedFriends.away.length }})</span></h3>
        </div>
        <div class="friend-list">
          <div 
            v-for="friend in groupedFriends.away" 
            :key="friend.id" 
            class="friend-item"
          >
            <div class="friend-avatar">
              <img :src="friend.avatar" alt="头像" class="avatar">
              <span class="status-badge away"></span>
            </div>
            <div class="friend-info">
              <div class="name">{{ friend.name }}</div>
              <div class="status">离开 - {{ friend.lastActive }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="contacts-section">
        <div class="section-header">
          <h3>离线好友 <span class="count">({{ groupedFriends.offline.length }})</span></h3>
        </div>
        <div class="friend-list">
          <div 
            v-for="friend in groupedFriends.offline" 
            :key="friend.id" 
            class="friend-item"
          >
            <div class="friend-avatar">
              <img :src="friend.avatar" alt="头像" class="avatar">
              <span class="status-badge offline"></span>
            </div>
            <div class="friend-info">
              <div class="name">{{ friend.name }}</div>
              <div class="status">离线 - {{ friend.lastActive }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="!searchMode" class="add-friend-btn">
      <button @click="showAddFriendModal = true">
        <i class="icon icon-add"></i>
        添加好友
      </button>
    </div>
    
    <!-- 添加好友模态框 -->
    <AddFriendModal 
      v-if="showAddFriendModal" 
      @close="showAddFriendModal = false"
      @search="searchUser"
      @send-request="sendFriendRequest"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useContactsStore } from '../stores/contacts'
import AddFriendModal from '../components/AddFriendModal.vue'

const router = useRouter()
const contactsStore = useContactsStore()

const searchKeyword = ref('')
const showAddFriendModal = ref(false)

// 计算属性
const searchMode = computed(() => searchKeyword.value.trim() !== '')
const searchResults = computed(() => contactsStore.searchResults)
const groupedFriends = computed(() => contactsStore.groupedFriends)
const friendRequests = computed(() => contactsStore.friendRequests)

// 搜索处理
const handleSearch = () => {
  contactsStore.searchKeyword = searchKeyword.value
}

const clearSearch = () => {
  searchKeyword.value = ''
  contactsStore.searchKeyword = ''
}

// 用户搜索（模拟）
const searchUser = (keyword) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = [
        {
          id: 3001,
          name: '小明',
          avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Ming',
          account: 'user_ming',
          gender: 'male',
          tags: ['后端开发', 'Go']
        },
        {
          id: 3002,
          name: '小红',
          avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Hong',
          account: 'user_hong',
          gender: 'female',
          tags: ['产品经理']
        }
      ]
      resolve(results)
    }, 800)
  })
}

// 发送好友请求
const sendFriendRequest = (userId) => {
  contactsStore.sendFriendRequest(userId).then(() => {
    showAddFriendModal.value = false
    
    // 添加请求到状态管理
    contactsStore.addFriendRequest({
      id: Date.now(),
      name: '新用户',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=NewUser',
      message: '我想添加您为好友',
      status: 'pending',
      time: '刚刚'
    })
  })
}

// 处理好友请求
const handleRequest = (requestId, accept) => {
  contactsStore.handleFriendRequest(requestId, accept)
}

// 查看个人资料
const viewProfile = (friendId) => {
  router.push(`/app/profile/${friendId}`)
}

// 开始聊天
const startChat = (friend) => {
  // 这里实现跳转到聊天页面
  router.push('/app/chat')
}
</script>

<style scoped>
.contacts-view {
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.search-section {
  padding: 0 10px 15px;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  background-color: #f0f2f5;
  border-radius: 20px;
  padding: 8px 15px;
}

.search-container .icon {
  color: #999;
  font-size: 18px;
  margin-right: 8px;
}

.search-container input {
  flex: 1;
  border: none;
  background: none;
  font-size: 14px;
  outline: none;
}

.btn-clear {
  background: none;
  border: none;
  padding: 5px;
  cursor: pointer;
  color: #999;
}

.search-results {
  margin-top: 15px;
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.no-results, .no-requests {
  padding: 15px;
  text-align: center;
  color: #999;
}

.contacts-content {
  max-height: 70vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #4a8cff #8a69ff;
}
.contacts-content::-webkit-scrollbar {
  width: 6px;
}
.contacts-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #4a8cff, #8a69ff);
  border-radius: 4px;
}
.contacts-content::-webkit-scrollbar-track {
  background: #23242a;
  border-radius: 4px;
}

.contacts-section {
  margin-bottom: 25px;
  background-color: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f2f5;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: #ff4d4d;
  color: white;
  font-size: 12px;
  margin-left: 8px;
}

.count {
  color: #999;
  font-weight: normal;
}

.friend-list, .request-list {
  padding: 5px 0;
}

.friend-item, .request-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.friend-item:hover {
  background-color: #f9f9f9;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 15px;
}

.friend-info {
  flex: 1;
  min-width: 0;
}

.name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.remark, .message {
  font-size: 13px;
  color: #666;
  margin-bottom: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 5px;
}

.tag {
  font-size: 11px;
  padding: 3px 8px;
  background-color: #eef5ff;
  color: #4a8cff;
  border-radius: 12px;
}

.time {
  font-size: 12px;
  color: #999;
}

.status {
  font-size: 13px;
  color: #999;
}

.friend-avatar {
  position: relative;
  margin-right: 15px;
}

.status-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;
}

.status-badge.online {
  background-color: #52c41a;
}

.status-badge.away {
  background-color: #faad14;
}

.status-badge.offline {
  background-color: #ccc;
}

.friend-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-chat, .btn-profile {
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.btn-chat {
  background-color: #4a8cff;
  color: white;
}

.btn-chat i {
  margin-right: 5px;
}

.btn-profile {
  background-color: #f0f2f5;
  padding: 6px;
  border-radius: 4px;
}

.request-actions {
  display: flex;
  gap: 8px;
}

.btn-accept, .btn-reject {
  padding: 5px 12px;
  font-size: 13px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-accept {
  background-color: #52c41a;
  color: white;
}

.btn-reject {
  background-color: #f5f5f5;
  color: #666;
}

.add-friend-btn {
  padding: 20px;
  text-align: center;
}

.add-friend-btn button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(to right, #4a8cff, #8a69ff);
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
</style>