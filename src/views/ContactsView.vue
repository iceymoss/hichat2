<template>
  <div class="contacts-view">
    <div class="sidebar">
      <div class="tabs">
        <button :class="{active: tab==='friends'}" @click="tab='friends'">好友</button>
        <button :class="{active: tab==='groups'}" @click="tab='groups'">群聊</button>
      </div>
      <div class="list-scroll">
        <FriendList v-if="tab==='friends'" :selectedFriendId="selectedFriendId" @select-friend="selectFriend" @add-friend="showAddFriendModal = true" />
        <GroupList v-if="tab==='groups'" :selectedGroupId="selectedGroupId" @select-group="selectGroup" />
      </div>
    </div>
    <div class="detail-panel">
      <FriendDetail v-if="tab==='friends'" :friend="selectedFriend" />
      <GroupDetailView v-if="tab==='groups'" :groupId="selectedGroupId" />
    </div>
    <AddFriendModal v-if="showAddFriendModal" @close="showAddFriendModal = false" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useContactsStore } from '../stores/contacts'
import FriendList from '../components/FriendList.vue'
import FriendDetail from '../components/FriendDetail.vue'
import AddFriendModal from '../components/AddFriendModal.vue'
import GroupDetailView from './GroupDetailView.vue'
import GroupList from '../components/GroupList.vue'

const tab = ref('friends')
const selectedFriendId = ref(null)
const selectedGroupId = ref(null)
const showAddFriendModal = ref(false)

const contactsStore = useContactsStore()

const selectedFriend = computed(() => {
  return contactsStore.friends.find(f => f.id === selectedFriendId.value) || null
})

const selectFriend = (friend) => {
  selectedFriendId.value = friend.id
}
const selectGroup = (group) => {
  selectedGroupId.value = group.id
}
</script>

<style scoped>
.contacts-view {
  display: flex;
  height: 100vh;
  background: #f8fafc;
}
.sidebar {
  width: 340px;
  min-width: 260px;
  max-width: 400px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
}
.tabs {
  display: flex;
  gap: 8px;
  padding: 16px 12px 0 12px;
}
.tabs button {
  flex: 1;
  padding: 8px 0;
  border: none;
  border-radius: 8px 8px 0 0;
  background: #f1f5f9;
  color: #333;
  font-weight: 500;
  cursor: pointer;
}
.tabs button.active {
  background: #4a8cff;
  color: #fff;
}
.list-scroll {
  flex: 1;
  overflow-y: auto;
}
.detail-panel {
  flex: 1;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>