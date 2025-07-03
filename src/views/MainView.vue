<template>
  <div class="main-container">
    <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    
    <div class="main-content">
      <AppSidebar :open="sidebarOpen" />
      
      <div class="chat-area">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppSidebar from '../components/AppSidebar.vue'

const sidebarOpen = ref(true)
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f7fa;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.chat-area {
  flex: 1;
  display: flex;
}
</style>