<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchPostById } from '../services/api'

const route = useRoute()
const router = useRouter()

const post = ref(null)
const loading = ref(true)

onMounted(async () => {
  post.value = await fetchPostById(route.params.id)
  loading.value = false
})
</script>

<template>
  <div style="padding:20px; max-width:800px; margin:auto;">

    <button @click="router.back()">⬅ Back</button>

    <p v-if="loading">Loading post...</p>

    <div v-else-if="post">
      <h1>{{ post.title }}</h1>
      <p><em>{{ post.excerpt }}</em></p>
      <div v-html="post.content"></div>
    </div>

    <p v-else style="color:red;">Post not found</p>

  </div>
</template>