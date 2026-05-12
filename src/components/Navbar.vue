<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

function go(path) {
  router.push(path)
}
</script>

<template>
  <nav style="padding: 15px; border-bottom: 1px solid #ddd; display: flex; gap: 15px;">
    
    <button 
      @click="go('/')"
      :style="{ fontWeight: route.path === '/' ? 'bold' : 'normal' }"
    >
      🏠 Home
    </button>

    <button 
      @click="go('/post/1')"
    >
      📄 Sample Post
    </button>

  </nav>
</template>