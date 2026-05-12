<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchPosts } from '../services/api'

const router = useRouter()

const posts = ref([])
const loading = ref(true)
const search = ref('')
const currentPage = ref(1)

const perPage = 5

onMounted(async () => {
  posts.value = await fetchPosts()
  loading.value = false
})

function openPost(post) {
  router.push(`/post/${post.slug || post.id}`)
}

const filteredPosts = computed(() => {
  const list = Array.isArray(posts.value) ? posts.value : []

  return list.filter(post => {
    const title = post?.title || ''
    return title.toLowerCase().includes(search.value.toLowerCase())
  })
})

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredPosts.value.slice(start, start + perPage)
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredPosts.value.length / perPage))
)

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
</script>

<template>
  <div style="padding:20px; max-width:800px; margin:auto;">

    <h1>📝 Blog Application </h1>

    <input
      v-model="search"
      placeholder="Search posts..."
      style="width:100%; padding:10px; margin-bottom:15px;"
    />

    <p v-if="loading">Loading...</p>

    <div v-else>
      <div
        v-for="post in paginatedPosts"
        :key="post.id"
        @click="openPost(post)"
        style="cursor:pointer; border:1px solid #ddd; padding:10px; margin-bottom:10px;"
      >
        <h3>{{ post.title }}</h3>
        <p>{{ post.excerpt }}</p>
      </div>

      <div style="display:flex; gap:10px; justify-content:center;">
        <button @click="prevPage">Prev</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage">Next</button>
      </div>
    </div>

  </div>
</template>