<template>
  <div class="conversation-list">
    <div 
      v-for="conversation in conversations" 
      :key="conversation.id" 
      class="conversation-item"
      :class="{ active: activeConversation?.id === conversation.id }"
      @click="selectConversation(conversation)"
    >
      <img :src="conversation.avatar" alt="头像" class="avatar">
      <div class="conversation-info">
        <div class="conversation-header">
          <h4 class="name">{{ conversation.name }}</h4>
          <span class="time">{{ conversation.lastTime }}</span>
        </div>
        <p class="last-message">{{ conversation.lastMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useConversationStore } from '../stores/conversation'

const conversationStore = useConversationStore()
const activeConversation = ref(null)

const conversations = ref([
  {
    id: 1,
    name: '技术讨论群',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Tg&backgroundType=gradientLinear',
    lastMessage: 'Go的goroutine真是强大...',
    lastTime: '10:25',
    unread: 3
  },
  {
    id: 2,
    name: '小李',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Lily',
    lastMessage: '今晚一起吃饭吗？',
    lastTime: '昨天',
    unread: 0
  },
  {
    id: 3,
    name: '公司通知群',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=NT&backgroundType=gradientLinear',
    lastMessage: '下周五下午3点有全体会议',
    lastTime: '昨天',
    unread: 0
  },
  {
    id: 4,
    name: '项目小组',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Pg&backgroundType=gradientLinear',
    lastMessage: '小张: 接口已经开发完成',
    lastTime: '周三',
    unread: 7
  }
])

onMounted(() => {
  // 选择第一个会话作为默认
  if (conversations.value.length > 0) {
    activeConversation.value = conversations.value[0]
  }
})

const selectConversation = (conversation) => {
  activeConversation.value = conversation
  conversationStore.setActiveConversation(conversation)
}
</script>

<style scoped>
.conversation-list {
  padding: 10px 0;
}

.conversation-item {
  display: flex;
  padding: 12px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.conversation-item:hover {
  background-color: #2a2f38;
}

.conversation-item.active {
  background-color: #2e323b;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.name {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #e1e1e1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.time {
  font-size: 12px;
  color: #888;
  white-space: nowrap;
  margin-left: 5px;
}

.last-message {
  margin: 0;
  font-size: 14px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>