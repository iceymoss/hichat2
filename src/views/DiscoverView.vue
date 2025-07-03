<template>
  <div class="discover-view">
    <div class="discover-header">
      <h2>好友动态</h2>
    </div>
    
    <div class="feed-container">
      <CreatePostCard @post-created="createPost" />
      
      <div v-if="feed.length === 0" class="empty-feed">
        <p>还没有动态，快去发布第一条吧！</p>
        <button @click="createSamplePost">创建示例动态</button>
      </div>
      
      <FeedItem 
        v-for="post in feed" 
        :key="post.id" 
        :post="post" 
        @like="likePost"
        @comment="addComment"
        @open-image="openImage(post.id, $event)"
      />
      
      <div class="load-more">
        <button v-if="hasMore" @click="loadMore">加载更多</button>
      </div>
    </div>
    
    <FeedViewer v-if="viewingImages.length > 0" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFeedStore } from '../stores/feed'
import CreatePostCard from '../components/CreatePostCard.vue'
import FeedItem from '../components/FeedItem.vue'
import FeedViewer from '../components/FeedViewer.vue'

const feedStore = useFeedStore()

const feed = computed(() => feedStore.userFeed)
const viewingImages = computed(() => feedStore.viewingImages)
const hasMore = ref(true)
const pageSize = 5
const currentPage = ref(1)

onMounted(() => {
  // 确保有数据
  if (feedStore.posts.length === 0) {
    feedStore.createPost("你好，这是第一条模拟动态！", [
      'https://picsum.photos/400/300?random=1'
    ])
  }
})

const createPost = (postData) => {
  feedStore.createPost(postData.content, postData.images)
}

const createSamplePost = () => {
  feedStore.createPost("这是示例动态，欢迎体验 HiChat2！", [
    'https://picsum.photos/400/300?random=5'
  ])
}

const likePost = (postId) => {
  feedStore.toggleLike(postId)
}

const addComment = ({ postId, content }) => {
  feedStore.addComment(postId, content)
}

const openImage = (postId, index) => {
  feedStore.openImageViewer(postId, index)
}

const loadMore = () => {
  // 模拟加载更多（实际应用中从API获取）
  currentPage.value += 1
  hasMore.value = feed.value.length < 20 // 模拟最多20条
}
</script>

<style scoped>
.discover-view {
  height: 100%;
  padding: 16px;
  overflow-y: auto;
  background-color: #f5f7fa;
}

.discover-header {
  padding: 0 16px 16px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 16px;
}

.discover-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.feed-container {
  max-width: 680px;
  margin: 0 auto;
}

.empty-feed {
  text-align: center;
  padding: 40px 20px;
  background-color: white;
  border-radius: 12px;
  color: #999;
}

.empty-feed button {
  margin-top: 15px;
  padding: 8px 20px;
  background-color: #4a8cff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

.load-more {
  text-align: center;
  padding: 20px 0;
}

.load-more button {
  padding: 8px 25px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 20px;
  color: #666;
  cursor: pointer;
}

.load-more button:hover {
  background-color: #f0f2f5;
}
</style>