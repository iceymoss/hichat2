import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

export const useFeedStore = defineStore('feed', () => {
  const authStore = useAuthStore()
  
  // 动态列表
  const posts = ref([
    {
      id: 'p1',
      userId: 'u1',
      userName: '小李',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Lily',
      content: '今天学习Vue3，感觉非常棒！特别是组合式API，让代码更清晰了。',
      images: [
        'https://picsum.photos/300/200?random=1',
        'https://picsum.photos/300/200?random=2'
      ],
      likes: ['u2', 'u3'],
      comments: [
        {
          id: 'c1',
          userId: 'u3',
          userName: '张工程师',
          content: 'Vue3确实不错，我也在学习！',
          time: '2023-05-15T10:30:00Z'
        }
      ],
      createdAt: '2023-05-15T08:30:00Z'
    },
    {
      id: 'p2',
      userId: 'u2',
      userName: '王经理',
      avatar: 'https://api.dicebear.com/7.x/personas/svg?seed=Wang',
      content: '新产品设计已经完成，欢迎大家提意见！',
      images: [
        'https://picsum.photos/300/200?random=3'
      ],
      likes: ['u1', 'u4'],
      comments: [],
      createdAt: '2023-05-14T15:45:00Z'
    }
  ])
  
  // 当前正在查看的图片索引
  const currentImageIndex = ref(0)
  // 当前查看的图片列表
  const viewingImages = ref([])
  
  // 获取当前用户的动态（按时间倒序）
  const userFeed = computed(() => {
    return [...posts.value].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    )
  })
  
  // 发布新动态
  const createPost = (content, images) => {
    const newPost = {
      id: `p${Date.now()}`,
      userId: authStore.user?.id || 'u0',
      userName: authStore.user?.name || '当前用户',
      avatar: authStore.user?.avatar || 'https://api.dicebear.com/7.x/personas/svg?seed=You',
      content,
      images: images || [],
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    }
    
    posts.value.unshift(newPost)
    return newPost
  }
  
  // 点赞/取消点赞
  const toggleLike = (postId) => {
    const post = posts.value.find(p => p.id === postId)
    if (!post) return
    
    const userId = authStore.user?.id
    if (!userId) return
    
    const index = post.likes.indexOf(userId)
    
    if (index === -1) {
      // 点赞
      post.likes.push(userId)
    } else {
      // 取消点赞
      post.likes.splice(index, 1)
    }
  }
  
  // 添加评论
  const addComment = (postId, content) => {
    const post = posts.value.find(p => p.id === postId)
    if (!post) return
    
    const userId = authStore.user?.id
    if (!userId) return
    
    post.comments.unshift({
      id: `c${Date.now()}`,
      userId,
      userName: authStore.user?.name,
      content,
      time: new Date().toISOString()
    })
  }
  
  // 打开图片查看器
  const openImageViewer = (postId, index = 0) => {
    const post = posts.value.find(p => p.id === postId)
    if (post) {
      viewingImages.value = post.images
      currentImageIndex.value = index
    }
  }
  
  // 关闭图片查看器
  const closeImageViewer = () => {
    viewingImages.value = []
  }
  
  return {
    posts,
    userFeed,
    viewingImages,
    currentImageIndex,
    createPost,
    toggleLike,
    addComment,
    openImageViewer,
    closeImageViewer
  }
})