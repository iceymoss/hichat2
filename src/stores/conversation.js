import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConversationStore = defineStore('conversation', () => {
  const activeConversation = ref(null)
  
  const setActiveConversation = (conversation) => {
    activeConversation.value = conversation
  }
  
  return {
    activeConversation,
    setActiveConversation
  }
})