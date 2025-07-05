<template>
  <div class="feed-detail-container">
    <div class="feed-detail" v-if="selectedReactive">
      <div class="feed-detail-header">
        <button class="back-btn" @click="$emit('back')">
          <div class="back-btn-icon">
            <i class="icon icon-arrow-left"></i>
          </div>
          <span class="back-btn-text">返回动态列表</span>
          <div class="back-btn-ripple"></div>
        </button>
        <img :src="selectedReactive.user.avatar" class="avatar" />
        <div class="user-info">
          <div class="name">{{ selectedReactive.user.name }}</div>
          <div class="time">{{ selectedReactive.time }}</div>
        </div>
      </div>
      
      <div class="feed-detail-content">
        <div class="feed-detail-text">{{ selectedReactive.content }}</div>
        <div class="feed-detail-images" v-if="selectedReactive.images && selectedReactive.images.length">
          <img v-for="image in selectedReactive.images" :key="image" :src="image" alt="图片" />
        </div>
        <div class="feed-detail-image" v-if="selectedReactive.image">
          <img :src="selectedReactive.image" alt="动态图片" />
        </div>
      </div>
      
      <div class="feed-detail-stats">
        <div class="stat-item">
          <i class="icon icon-like"></i>
          <span>{{ selectedReactive.likes ? selectedReactive.likes.length : 0 }} 个赞</span>
        </div>
        <div class="stat-item">
          <i class="icon icon-comment"></i>
          <span>{{ selectedReactive.comments ? selectedReactive.comments.length : 0 }} 条评论</span>
        </div>
        <div class="stat-item">
          <i class="icon icon-share"></i>
          <span>分享</span>
        </div>
      </div>
      
      <div class="feed-detail-likes" v-if="selectedReactive.likes && selectedReactive.likes.length">
        <div class="likes-avatars">
          <img 
            v-for="(user, index) in Array.from(new Set(selectedReactive.likes)).slice(0, 15)" 
            :key="user"
            :src="`https://api.dicebear.com/7.x/personas/svg?seed=${encodeURIComponent(user)}`"
            :alt="user"
            class="like-avatar"
          />
          <span v-if="selectedReactive.likes.length > 15" class="more-likes">+{{ selectedReactive.likes.length - 15 }}</span>
        </div>
        <div class="likes-text">
          <span v-for="(user, index) in Array.from(new Set(selectedReactive.likes)).slice(0, 15)" :key="user" class="like-user">
            {{ user }}{{ index < Math.min(14, selectedReactive.likes.length - 1) ? '、' : '' }}
          </span>
          <span v-if="selectedReactive.likes.length > 15">等{{ selectedReactive.likes.length }}位好友点赞</span>
        </div>
      </div>
      
      <div class="feed-detail-actions">
        <button class="action-btn like-btn" :class="{ active: selectedReactive.liked }" @click="toggleLike">
          <i class="icon" :class="selectedReactive.liked ? 'icon-liked' : 'icon-like'"></i>
          <span>{{ selectedReactive.liked ? '已点赞' : '点赞' }}</span>
        </button>
        <button class="action-btn comment-btn" @click="focusCommentInput">
          <i class="icon icon-comment"></i>
          <span>评论</span>
        </button>
      </div>
      

      
      <div class="feed-detail-comments">
        <div class="comments-title">全部评论</div>
        <div class="add-comment">
          <input v-model="newComment" placeholder="写评论，支持@用户" @keyup.enter="addComment" />
          <button @click="addComment">发送</button>
        </div>
        
        <!-- 评论列表 -->
        <CommentThread 
          :comments="selectedReactive.comments"
          :format-comment="formatComment"
          @reply="handleCommentReply"
          @like-comment="handleCommentLike"
          @like-reply="handleReplyLike"
          @delete-comment="handleDeleteComment"
          @delete-reply="handleDeleteReply"
        />
      </div>
    </div>
    <div v-else class="feed-detail-empty">请选择一条动态</div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import CommentThread from './CommentThread.vue'
import { useFeedStore } from '../stores/feed'
import { useAuthStore } from '../stores/auth'

const props = defineProps({ selected: Object })
const emit = defineEmits(['back', 'like', 'comment'])

const feedStore = useFeedStore()
const authStore = useAuthStore()
const selectedReactive = computed(() => {
  if (!props.selected) return null
  const allFeeds = [...feedStore.getFriendFeeds, ...feedStore.getCommunityFeeds]
  const foundFeed = allFeeds.find(f => String(f.id) === String(props.selected.id))
  if (foundFeed) {
    return foundFeed
  }
  return props.selected
})

const newComment = ref('')

function handleDeleteComment(comment) {
  if (!selectedReactive.value) return
  const postId = selectedReactive.value.id
  const type = selectedReactive.value.type || 'friend'
  feedStore.deleteComment(postId, comment.id, type)
}

function addComment() {
  if (!newComment.value.trim() || !selectedReactive.value) return
  const postId = selectedReactive.value.id
  const type = selectedReactive.value.type || 'friend'
  feedStore.addComment(postId, newComment.value, type)
  newComment.value = ''
}

function handleCommentReply({ comment, reply }) {
  if (!selectedReactive.value) return
  const postId = selectedReactive.value.id
  const type = selectedReactive.value.type || 'friend'
  feedStore.addReply(postId, comment.id, reply.content, type)
}

function handleCommentLike(comment) {
  if (!selectedReactive.value) return
  
  const postId = selectedReactive.value.id
  const type = selectedReactive.value.type || 'friend'
  
  feedStore.toggleCommentLike(postId, comment.id, type)
}

function handleReplyLike(reply) {
  if (!selectedReactive.value) return
  
  const comment = selectedReactive.value.comments.find(c => 
    c.replies && c.replies.some(r => r.id === reply.id)
  )
  
  if (!comment) return
  
  const postId = selectedReactive.value.id
  const type = selectedReactive.value.type || 'friend'
  
  feedStore.toggleReplyLike(postId, comment.id, reply.id, type)
}

function formatComment(content) {
  return content.replace(/@([\u4e00-\u9fa5\w\-]+)/g, '<span class="at-user">@$1</span>')
}

function toggleLike() {
  if (!selectedReactive.value) return
  const postId = selectedReactive.value.id
  const type = selectedReactive.value.type || 'friend'
  feedStore.toggleLike(postId, type)
}

function focusCommentInput() {
  const commentInput = document.querySelector('.add-comment input')
  if (commentInput) {
    commentInput.focus()
  }
}

function handleDeleteReply({ comment, reply }) {
  if (!selectedReactive.value) return
  const postId = selectedReactive.value.id
  const type = selectedReactive.value.type || 'friend'
  feedStore.deleteReply(postId, comment.id, reply.id, type)
}


</script>

<style scoped>
.feed-detail-container {
  height: 100%;
  overflow-y: auto;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e0e7ff 100%);
  padding: 24px;
  position: relative;
}

.feed-detail-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 20%, rgba(74,140,255,0.03) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(138,105,255,0.02) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.feed-detail {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 36px;
  box-shadow: 
    0 20px 40px rgba(74, 140, 255, 0.08),
    0 8px 16px rgba(138, 105, 255, 0.05),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(229, 231, 235, 0.2);
  backdrop-filter: blur(20px);
  position: relative;
  z-index: 1;
}
.feed-detail-header {
  display: flex;
  align-items: center;
  margin-bottom: 32px;
  gap: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(229, 231, 235, 0.3);
}
.back-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #4a8cff 0%, #8a69ff 100%);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 
    0 4px 12px rgba(74, 140, 255, 0.25),
    0 2px 6px rgba(138, 105, 255, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  min-width: 140px;
  justify-content: center;
}

.back-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.back-btn:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 6px 20px rgba(74, 140, 255, 0.35),
    0 4px 12px rgba(138, 105, 255, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  background: linear-gradient(135deg, #5a9cff 0%, #9a79ff 100%);
}

.back-btn:hover::before {
  opacity: 1;
}

.back-btn:active {
  transform: translateY(-1px) scale(0.98);
  transition: all 0.1s ease;
}

.back-btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.back-btn:hover .back-btn-icon {
  background: rgba(255, 255, 255, 0.25);
  transform: translateX(-2px) rotate(-5deg);
}

.back-btn-icon .icon {
  font-size: 12px;
  color: #ffffff;
  font-weight: bold;
}

.back-btn-text {
  white-space: nowrap;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.back-btn-ripple {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border-radius: 12px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  opacity: 0;
  transform: scale(0);
  transition: all 0.6s ease;
  pointer-events: none;
}

.back-btn:active .back-btn-ripple {
  opacity: 1;
  transform: scale(1);
  transition: all 0.3s ease;
}

/* 添加聚焦状态的可访问性支持 */
.back-btn:focus {
  outline: none;
  box-shadow: 
    0 4px 12px rgba(74, 140, 255, 0.25),
    0 2px 6px rgba(138, 105, 255, 0.15),
    0 0 0 3px rgba(74, 140, 255, 0.3);
}
.avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 
    0 4px 12px rgba(0,0,0,0.08),
    0 0 0 1px rgba(74, 140, 255, 0.1);
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 
    0 6px 16px rgba(0,0,0,0.12),
    0 0 0 2px rgba(74, 140, 255, 0.2);
}

.user-info {
  flex: 1;
}

.user-info .name {
  color: #1e293b;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 2px;
  background: linear-gradient(135deg, #1e293b 0%, #4a8cff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-info .time {
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.user-info .time::before {
  content: '•';
  color: #94a3b8;
  font-weight: bold;
}
.feed-detail-content {
  margin-bottom: 24px;
}
.feed-detail-text {
  color: #222;
  font-size: 16px;
  line-height: 1.7;
  margin-bottom: 16px;
}
.feed-detail-image img {
  max-width: 100%;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
}
.feed-detail-stats {
  display: flex;
  gap: 32px;
  margin-bottom: 20px;
  padding: 16px 0 0 0;
  border-top: 1px solid #f1f5f9;
}
.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 14px;
}
.feed-detail-likes {
  margin-bottom: 20px;
  padding: 12px 0 0 0;
}
.likes-avatars {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.like-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #fff;
}
.more-likes {
  color: #64748b;
  font-size: 12px;
  margin-left: 8px;
}
.likes-text {
  color: #374151;
  font-size: 14px;
}
.like-user {
  font-weight: 600;
  color: #1f2937;
}
.feed-detail-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px 0 0 0;
  border-bottom: 1px solid #f1f5f9;
}
.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: #f8fafc;
  color: #4a8cff;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}
.action-btn:hover {
  background: #e0e7ef;
  color: #2563eb;
}
.action-btn.active {
  background: #dbeafe;
  color: #2563eb;
}
.comments-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
}
.add-comment {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  align-items: center;
}
.add-comment input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
  background: #fff;
}
.add-comment input:focus {
  border-color: #4a8cff;
}
.add-comment button {
  padding: 12px 20px;
  background: #4a8cff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: 500;
}
.add-comment button:hover {
  background: #2563eb;
}
.feed-detail-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  color: #64748b;
  font-size: 16px;
  gap: 12px;
  text-align: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  box-shadow: 
    0 20px 40px rgba(74, 140, 255, 0.08),
    0 8px 16px rgba(138, 105, 255, 0.05);
  border: 1px solid rgba(229, 231, 235, 0.2);
  position: relative;
  z-index: 1;
  max-width: 400px;
  margin: 0 auto;
}

.feed-detail-empty::before {
  content: '📝';
  font-size: 48px;
  opacity: 0.6;
}
.more-comments {
  color: #4a8cff;
  font-size: 14px;
  cursor: pointer;
  margin: 8px 0 0 0;
  user-select: none;
  transition: color 0.2s;
  display: inline-block;
}
.more-comments:hover {
  text-decoration: underline;
  color: #2563eb;
}
/* @用户样式 */
:deep(.at-user) {
  color: #4a8cff;
  font-weight: 600;
}
</style> 