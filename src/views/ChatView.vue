<template>
  <div class="chat-view">
    <ChatPanel />
  </div>
</template>

<script setup>
import ChatPanel from '../components/ChatPanel.vue'
</script>

<style scoped>
.chat-view {
  display: flex;
  height: 100%;
  width: 100%;
}
</style>