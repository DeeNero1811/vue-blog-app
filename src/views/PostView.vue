<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchPost } from '../services/api'

const route = useRoute()
const router = useRouter()

const post = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    post.value = await fetchPost(route.params.id)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div style="padding: 20px; max-width: 800px; margin: auto;">
    
    <button 
      @click="router.back()" 
      style="margin-bottom:20px; padding:8px 12px; cursor:pointer;"
    >
      ⬅ Back
    </button>

    <p v-if="loading">Loading post...</p>

    <p v-else-if="error" style="color:red;">
      {{ error }}
    </p>

    <div v-else>
      <h1 style="margin-bottom:10px;">{{ post.title }}</h1>

      <p v-if="post.excerpt" style="font-style:italic; opacity:0.7;">
        {{ post.excerpt }}
      </p>

      <hr />

      <div v-html="post.content" style="margin-top:20px;"></div>

      <p style="margin-top:20px; opacity:0.5;">
        👁 Views: {{ post.viewCount }}
      </p>
    </div>
  </div>
</template>