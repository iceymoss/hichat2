<template>
  <div class="main-view main-bg">
    <AppHeader />
    <div class="main-nav">
      <div 
        v-for="tab in tabs" 
        :key="tab.key" 
        :class="['nav-item', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        <i :class="['icon', tab.icon]"></i>
        <span>{{ tab.label }}</span>
      </div>
    </div>
    <div class="main-body">
      <template v-if="activeTab === 'feed'">
        <div style="display:flex;height:100%;width:100%">
          <FeedList v-model="activeFeedType" />
          <FeedTypeList 
            :feeds="feedData[activeFeedType]" 
            @select="handleFeedSelect" 
            @like="handleLike"
            @comment="handleComment"
            style="flex:1;" 
            v-if="!selectedFeed" 
          />
          <FeedDetail 
            :selected="selectedFeed" 
            @back="handleFeedBack" 
            @like="handleDetailLike"
            @comment="handleDetailComment"
            v-else 
            style="flex:1;" 
          />
        </div>
      </template>
      <template v-else>
        <div class="side-list">
          <component :is="activeTabListComponent" @select="handleSelect" />
        </div>
        <div class="main-detail">
          <component :is="activeTabDetailComponent" :selected="selectedItem" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import ConversationList from '../components/ConversationList.vue'
import ContactsView from './ContactsView.vue'
import FeedList from '../components/FeedList.vue'
import FeedTypeList from '../components/FeedTypeList.vue'
import FeedDetail from '../components/FeedDetail.vue'
import ProfileView from './ProfileView.vue'
import { useFeedStore } from '../stores/feed'

// 先声明详情组件
const ConversationDetail = { template: '<div style="padding:32px;color:#fff;">会话详情区（可替换为真实聊天窗口）</div>' }
const ContactDetail = { template: '<div style="padding:32px;color:#fff;">好友详情区（可替换为好友资料/聊天）</div>' }
const ProfileDetail = { template: '<div style="padding:32px;color:#fff;">我的详情区（可替换为我的资料）</div>' }

const feedStore = useFeedStore()

// 使用feed store的数据，改为computed，保证响应式和不为undefined
const feedData = computed(() => ({
  friend: feedStore.getFriendFeeds,
  community: feedStore.getCommunityFeeds
}))
const activeFeedType = ref('friend')
const selectedFeed = ref(null)

const tabs = [
  { key: 'chat', label: '会话', icon: 'icon-chat', list: ConversationList, detail: ConversationDetail },
  { key: 'contacts', label: '好友', icon: 'icon-contacts', list: ContactsView, detail: ContactDetail },
  { key: 'feed', label: '动态', icon: 'icon-feed', list: null, detail: null },
  { key: 'profile', label: '我的', icon: 'icon-user', list: ProfileView, detail: ProfileDetail }
]

const activeTab = ref('chat')
const selectedItem = ref(null)
const activeTabListComponent = computed(() => {
  const found = tabs.find(t => t.key === activeTab.value)
  return found ? found.list : ConversationList
})
const activeTabDetailComponent = computed(() => {
  const found = tabs.find(t => t.key === activeTab.value)
  return found ? found.detail : ConversationDetail
})

function handleSelect(item) {
  selectedItem.value = item
}

function handleFeedTypeChange(type) {
  activeFeedType.value = type
  selectedFeed.value = null
}

function handleFeedSelect(feed) {
  selectedFeed.value = feed
}

function handleFeedBack() {
  selectedFeed.value = null
}

function handleLike(feedId) {
  feedStore.toggleLike(feedId, activeFeedType.value)
}

function handleComment(commentData) {
  feedStore.addComment(commentData.feedId, commentData.content, activeFeedType.value)
}

function handleDetailLike(feedId) {
  feedStore.toggleLike(feedId, activeFeedType.value)
}

function handleDetailComment(commentData) {
  feedStore.addComment(commentData.feedId, commentData.content, activeFeedType.value)
}
</script>

<style scoped>
.main-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.main-nav {
  height: 56px;
  background: rgba(30,32,40,0.96);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid #23242a;
  padding-left: 32px;
}
.nav-item {
  margin-right: 36px;
  color: #b3cfff;
  font-size: 16px;
  padding: 8px 0 2px 0;
  cursor: pointer;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  font-weight: 500;
}
.nav-item.active {
  color: #4a8cff;
  font-weight: bold;
  border-bottom: 2.5px solid #4a8cff;
}
.nav-item .icon {
  font-size: 22px;
  margin-right: 6px;
}
.main-body {
  flex: 1 1 0;
  display: flex;
  min-height: 0;
  background: none;
  height: 0;
}
.side-list {
  width: 360px;
  min-width: 360px;
  max-width: 360px;
  background: none;
  border-right: 1px solid #23242a;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1 0 0;
}
.main-detail {
  flex: 1;
  background: none;
  min-width: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
</style>