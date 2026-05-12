<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchPosts } from '../services/api'

const router = useRouter()

const posts = ref([])
const loading = ref(true)
const error = ref(null)

const search = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)

const perPage = 5

/* 🚀 SAFE LOAD */
onMounted(async () => {
  try {
    const res = await fetchPosts()

    console.log('API RESPONSE:', res)

    let safeData = []

    if (Array.isArray(res)) {
      safeData = res
    } else if (Array.isArray(res?.data)) {
      safeData = res.data
    } else {
      safeData = []
    }

    posts.value = safeData
  } catch (err) {
    console.error(err)
    posts.value = []
    error.value = 'Failed to load posts'
  } finally {
    loading.value = false
  }
})

/* 🚀 OPEN POST */
function openPost(post) {
  router.push(`/post/${post?.slug || post?.id}`)
}

/* 🚀 EXTRA SAFETY (BLOCK CRASH COMPLETELY) */
const safePosts = computed(() => {
  return Array.isArray(posts.value) ? posts.value : []
})

/* 🚀 FILTER */
const filteredPosts = computed(() => {
  return safePosts.value
    .filter(post => {
      const title = post?.title || ''
      return title.toLowerCase().includes(search.value.toLowerCase())
    })
    .filter(post =>
      selectedCategory.value
        ? post?.category === selectedCategory.value
        : true
    )
})

/* 🚀 PAGINATION */
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
  <div style="padding: 20px; max-width: 800px; margin: auto;">

    <h1>📝 Blog</h1>

    <input
      v-model="search"
      placeholder="Search posts..."
      style="width:100%; padding:10px; margin-bottom:10px;"
    />

    <select v-model="selectedCategory" style="margin-bottom:10px;">
      <option value="">All</option>
      <option value="tech">Tech</option>
      <option value="news">News</option>
      <option value="life">Life</option>
    </select>

    <!-- LOADING -->
    <div v-if="loading">
      <p>Loading...</p>
    </div>

    <!-- ERROR -->
    <p v-else-if="error" style="color:red;">{{ error }}</p>

    <!-- POSTS -->
    <div v-else>
      <div
        v-for="post in paginatedPosts"
        :key="post.id"
        @click="openPost(post)"
        style="cursor:pointer; padding:10px; border:1px solid #ddd; margin-bottom:10px;"
      >
        <h3>{{ post?.title }}</h3>
        <p>{{ post?.excerpt }}</p>
      </div>

      <!-- PAGINATION -->
      <div style="display:flex; gap:10px;">
        <button @click="prevPage">Prev</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage">Next</button>
      </div>
    </div>

  </div>
</template>