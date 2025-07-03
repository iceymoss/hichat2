<template>
  <div class="chat-panel">
    <div class="chat-header">
      <img :src="currentConversation.avatar" alt="头像" class="avatar">
      <div class="chat-info">
        <h3 class="name">{{ currentConversation.name }}</h3>
        <div class="status">在线</div>
      </div>
      <div class="chat-actions">
        <button class="btn-action">
          <i class="icon icon-video"></i>
        </button>
        <button class="btn-action">
          <i class="icon icon-phone"></i>
        </button>
        <button class="btn-action">
          <i class="icon icon-more"></i>
        </button>
      </div>
    </div>
    
    <div class="chat-messages">
      <div 
        v-for="(message, index) in messages" 
        :key="index" 
        class="message"
        :class="{ 'own-message': message.sender === 'me', 'their-message': message.sender !== 'me' }"
      >
        <img v-if="message.sender !== 'me'" :src="message.avatar" alt="头像" class="message-avatar">
        <div class="message-content">
          <div class="message-text">{{ message.text }}</div>
          <div class="message-time">{{ message.time }}</div>
        </div>
      </div>
    </div>
    
    <div class="chat-input">
      <div class="input-tools">
        <button class="btn-tool">
          <i class="icon icon-emoji"></i>
        </button>
        <button class="btn-tool">
          <i class="icon icon-image"></i>
        </button>
        <button class="btn-tool">
          <i class="icon icon-file"></i>
        </button>
      </div>
      <input 
        type="text" 
        class="message-input" 
        placeholder="输入消息..." 
        v-model="messageText"
        @keyup.enter="sendMessage"
      >
      <button class="btn-send" @click="sendMessage">发送</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useConversationStore } from '../stores/conversation'
import { useAuthStore } from '../stores/auth'

const conversationStore = useConversationStore()
const authStore = useAuthStore()

const currentConversation = computed(() => conversationStore.activeConversation || {})

// 模拟消息数据
const messages = ref([
  {
    sender: 'them',
    name: '小李',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Lily',
    text: '你好！最近项目进展怎么样？',
    time: '10:25'
  },
  {
    sender: 'me',
    text: '还不错，后端部分基本完成了，现在在开发前端部分',
    time: '10:26'
  },
  {
    sender: 'them',
    name: '小李',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Lily',
    text: '前端用的什么技术栈？Vue还是React？',
    time: '10:27'
  },
  {
    sender: 'me',
    text: '用的是Vue3，配合Pinia做状态管理',
    time: '10:28'
  },
  {
    sender: 'them',
    name: '小李',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Lily',
    text: 'Vue3确实不错，组合式API写起来很舒服',
    time: '10:28'
  },
  {
    sender: 'me',
    text: '对，作为后端开发上手也很容易',
    time: '10:29'
  }
])

// 发送消息
const messageText = ref('')

const sendMessage = () => {
  if (!messageText.value.trim()) return
  
  const newMessage = {
    sender: 'me',
    text: messageText.value,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  messages.value.push(newMessage)
  messageText.value = ''
  
  // 滚动到底部
  scrollToBottom()
  
  // 模拟回复
  setTimeout(() => {
    messages.value.push({
      sender: 'them',
      name: '小李',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Lily',
      text: '收到，感谢分享！',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    scrollToBottom()
  }, 2000)
}

// 滚动到底部
const scrollToBottom = () => {
  const chatMessages = document.querySelector('.chat-messages')
  if (chatMessages) {
    chatMessages.scrollTop = chatMessages.scrollHeight
  }
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: #f0f2f5;
}

.chat-header {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.chat-info {
  flex: 1;
  padding: 0 15px;
}

.name {
  margin: 0 0 5px 0;
  font-size: 18px;
}

.status {
  font-size: 13px;
  color: #4a8cff;
}

.chat-actions {
  display: flex;
  gap: 15px;
}

.btn-action {
  background: none;
  border: none;
  color: #666;
  font-size: 20px;
  cursor: pointer;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.message {
  display: flex;
  max-width: 80%;
  margin-bottom: 25px;
}

.message-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
  align-self: flex-end;
}

.message-content {
  max-width: 100%;
}

.message-text {
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 15px;
  line-height: 1.5;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.own-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.own-message .message-content {
  align-items: flex-end;
}

.own-message .message-text {
  background-color: #4a8cff;
  color: white;
  border-top-right-radius: 0;
}

.own-message .message-time {
  text-align: right;
}

.their-message .message-text {
  background-color: white;
  color: #333;
  border-top-left-radius: 0;
}

.their-message .message-time {
  text-align: left;
}

.chat-input {
  padding: 15px;
  background-color: white;
  border-top: 1px solid #e1e1e1;
}

.input-tools {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.btn-tool {
  background: none;
  border: none;
  color: #666;
  font-size: 18px;
  cursor: pointer;
}

.message-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #e1e1e1;
  border-radius: 20px;
  font-size: 14px;
}

.btn-send {
  margin-top: 10px;
  padding: 8px 20px;
  background-color: #4a8cff;
  color: white;
  border: none;
  border-radius: 18px;
  font-size: 14px;
  cursor: pointer;
  float: right;
}
</style>