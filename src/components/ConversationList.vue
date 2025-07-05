<template>
  <div class="conversation-list-bg">
    <div class="conversation-list">
      <template v-if="conversations.length > 0">
        <div 
          v-for="conversation in conversations" 
          :key="conversation.id" 
          class="conversation-item"
          :class="{ active: activeConversation?.id === conversation.id }"
          @click="selectConversation(conversation)"
        >
          <div class="avatar-wrapper">
            <img :src="conversation.avatar" alt="头像" class="avatar">
            <span v-if="conversation.unread > 0" class="unread-badge">
              {{ conversation.unread > 99 ? '99+' : conversation.unread }}
            </span>
          </div>
          <div class="conversation-info">
            <div class="conversation-header">
              <h4 class="name">{{ conversation.name }}</h4>
              <span class="time">{{ conversation.lastTime }}</span>
            </div>
            <p class="last-message">{{ conversation.lastMessage }}</p>
          </div>
        </div>
        <div v-if="conversations.length < 3" class="empty-fill">
          <div class="empty-content">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="#4a8cff22"/><path d="M16 32h16M20 20v-2a4 4 0 1 1 8 0v2" stroke="#4a8cff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="14" y="20" width="20" height="10" rx="5" stroke="#4a8cff" stroke-width="2"/></svg>
            <div class="empty-text">暂无会话，快去添加好友吧~</div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="empty-content">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" fill="#4a8cff22"/><path d="M16 32h16M20 20v-2a4 4 0 1 1 8 0v2" stroke="#4a8cff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="14" y="20" width="20" height="10" rx="5" stroke="#4a8cff" stroke-width="2"/></svg>
          <div class="empty-text">暂无会话，快去添加好友吧~</div>
        </div>
      </template>
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
  },
  {
    id: 5,
    name: '前端交流群',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=FE&backgroundType=gradientLinear',
    lastMessage: 'Vue3的响应式原理很有趣',
    lastTime: '09:10',
    unread: 0
  },
  {
    id: 6,
    name: '后端交流群',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BE&backgroundType=gradientLinear',
    lastMessage: 'Go的并发模型很棒',
    lastTime: '08:45',
    unread: 2
  },
  {
    id: 7,
    name: '产品经理',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=PM',
    lastMessage: '需求文档已更新',
    lastTime: '08:30',
    unread: 0
  },
  {
    id: 8,
    name: '测试组',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=QA&backgroundType=gradientLinear',
    lastMessage: '发现一个新bug',
    lastTime: '07:50',
    unread: 1
  },
  {
    id: 9,
    name: '小王',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Wang',
    lastMessage: '收到，谢谢！',
    lastTime: '07:30',
    unread: 0
  },
  {
    id: 10,
    name: '小赵',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Zhao',
    lastMessage: '明天见',
    lastTime: '06:20',
    unread: 0
  },
  {
    id: 11,
    name: '设计组',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=UI&backgroundType=gradientLinear',
    lastMessage: '新UI稿已上传',
    lastTime: '05:10',
    unread: 4
  },
  {
    id: 12,
    name: '小陈',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Chen',
    lastMessage: '收到，马上处理',
    lastTime: '04:50',
    unread: 0
  },
  {
    id: 13,
    name: '小刘',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Liu',
    lastMessage: 'OK',
    lastTime: '04:20',
    unread: 0
  },
  {
    id: 14,
    name: '小孙',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Sun',
    lastMessage: '收到',
    lastTime: '03:10',
    unread: 0
  },
  {
    id: 15,
    name: '小周',
    avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Zhou',
    lastMessage: '明天开会',
    lastTime: '02:00',
    unread: 6
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
.conversation-list-bg {
  background: rgba(30,32,40,0.88);
  border-radius: 18px;
  margin: 18px 12px 18px 12px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.10);
  padding: 0 0 0 0;
  height: calc(100vh - 60px - 36px); /* 60px header, 36px margin */
  display: flex;
  flex-direction: column;
}
.conversation-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #4a8cff #23242a;
  padding-right: 2px;
}
.conversation-item {
  position: relative;
  display: flex;
  padding: 12px 15px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-radius: 10px;
  margin: 0 8px 6px 8px;
}
.conversation-item:hover {
  background-color: rgba(74,140,255,0.10);
}
.conversation-item.active {
  background-color: rgba(74,140,255,0.18);
}
.avatar-wrapper {
  position: relative;
  display: inline-block;
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 12px;
  display: block;
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
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.time {
  font-size: 12px;
  color: #b3b3b3;
  white-space: nowrap;
  margin-left: 5px;
}
.last-message {
  margin: 0;
  font-size: 14px;
  color: #d3d3d3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.unread-badge {
  position: absolute;
  left: -4px;
  top: -4px;
  min-width: 20px;
  height: 20px;
  line-height: 20px;
  background: #ff3b30;
  color: #fff;
  border-radius: 10px;
  text-align: center;
  font-size: 12px;
  padding: 0 6px;
  box-shadow: 0 2px 8px rgba(255,59,48,0.15);
  z-index: 2;
  font-weight: bold;
  display: inline-block;
  border: 2px solid #fff;
}
.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #b3cfff;
  margin: 48px 0 32px 0;
  min-height: 120px;
}
.empty-content svg {
  margin-bottom: 12px;
}
.empty-text {
  font-size: 16px;
  color: #b3cfff;
  margin-top: 4px;
}
.empty-fill {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-bottom: 32px;
}
/* 美化滚动条（Webkit） */
.conversation-list::-webkit-scrollbar {
  width: 6px;
}
.conversation-list::-webkit-scrollbar-thumb {
  background: #4a8cff;
  border-radius: 4px;
}
.conversation-list::-webkit-scrollbar-track {
  background: #23242a;
  border-radius: 4px;
}
</style>