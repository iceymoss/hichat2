<template>
  <div class="discover-view">
    <!-- 左侧：动态分类列表 -->
    <div class="feed-types-panel">
      <FeedList v-model="activeType" />
    </div>
    
    <!-- 中间：动态列表 -->
    <div class="feed-list-panel">
      <FeedTypeList 
        :feeds="currentFeeds"
        @select="handleSelectFeed"
        @like="handleLikeFeed"
        @comment="handleCommentFeed"
      />
    </div>
    
    <!-- 右侧：动态详情 -->
    <div class="feed-detail-panel" v-if="selectedFeed">
      <FeedDetail 
        :selected="selectedFeed"
        @back="handleBackToList"
        @like="handleLikeFeed"
        @comment="handleCommentFeed"
      />
    </div>
    
    <!-- 空状态 -->
    <div v-if="!selectedFeed" class="empty-detail">
      <div class="empty-content">
        <div class="empty-icon">
          <i class="icon icon-message-square"></i>
        </div>
        <h3 class="empty-title">选择一条动态</h3>
        <p class="empty-desc">点击左侧动态列表中的任意一条动态来查看详情</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useFeedStore } from '../stores/feed'
import FeedList from '../components/FeedList.vue'
import FeedTypeList from '../components/FeedTypeList.vue'
import FeedDetail from '../components/FeedDetail.vue'

const router = useRouter()
const authStore = useAuthStore()
const feedStore = useFeedStore()

// 状态管理
const activeType = ref('friend')
const selectedFeed = ref(null)

// 计算属性
const currentFeeds = computed(() => {
  if (activeType.value === 'friend') {
    return feedStore.getFriendFeeds
  } else {
    return feedStore.getCommunityFeeds
  }
})

// 事件处理
function handleSelectFeed(feed) {
  selectedFeed.value = feed
}

function handleBackToList() {
  selectedFeed.value = null
}

function handleLikeFeed(feedId) {
  const type = activeType.value
  feedStore.toggleLike(feedId, type)
}

function handleCommentFeed(data) {
  const type = activeType.value
  feedStore.addComment(data.feedId, data.content, type)
}

// 生命周期
onMounted(() => {
  // 确保有初始数据
  if (feedStore.posts.length === 0) {
    feedStore.createPost("欢迎使用HiChat 2.0动态功能！", [
      'https://picsum.photos/400/300?random=1'
    ])
  }
})

onBeforeUnmount(() => {
  console.log('DiscoverView unmounted')
})
</script>

<style scoped>
.discover-view {
  height: 100%;
  display: flex;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  overflow: hidden;
}

.feed-types-panel {
  width: 280px;
  min-width: 280px;
  max-width: 280px;
  border-right: 1px solid rgba(229, 231, 235, 0.8);
  background: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95));
  backdrop-filter: blur(20px);
  overflow-y: auto;
}

.feed-list-panel {
  flex: 1;
  min-width: 0;
  border-right: 1px solid rgba(229, 231, 235, 0.8);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  overflow: hidden;
}

.feed-detail-panel {
  width: 450px;
  min-width: 450px;
  max-width: 450px;
  background: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95));
  backdrop-filter: blur(20px);
  overflow: hidden;
}

.empty-detail {
  width: 450px;
  min-width: 450px;
  max-width: 450px;
  background: linear-gradient(135deg, rgba(255,255,255,0.98), rgba(248,250,252,0.95));
  backdrop-filter: blur(20px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid rgba(229, 231, 235, 0.8);
}

.empty-content {
  text-align: center;
  padding: 60px 40px;
  max-width: 300px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, rgba(74, 140, 255, 0.1), rgba(138, 105, 255, 0.1));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon .icon {
  font-size: 32px;
  color: #6b7280;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.empty-desc {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

.icon-message-square:before { content: '📝'; }
</style>