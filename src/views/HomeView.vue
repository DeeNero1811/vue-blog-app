<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchPosts } from '../services/api'

const router = useRouter()

const posts = ref([])
const loading = ref(true)
const error = ref(null)

const search = ref('')
const currentPage = ref(1)
const perPage = 5

/* -------------------------
   FETCH POSTS (SAFE)
--------------------------*/
onMounted(async () => {
  try {
    const res = await fetchPosts()

    // ALWAYS FORCE ARRAY
    if (Array.isArray(res)) {
      posts.value = res
    } else if (Array.isArray(res?.data)) {
      posts.value = res.data
    } else {
      posts.value = []
    }

  } catch (err) {
    console.error(err)
    error.value = 'Failed to load posts'
    posts.value = []
  } finally {
    loading.value = false
  }
})

/* -------------------------
   OPEN POST PAGE
--------------------------*/
function openPost(post) {
  router.push(`/post/${post?.slug || post?.id}`)
}

/* -------------------------
   SAFE LIST (CRASH PROOF)
--------------------------*/
const safePosts = computed(() => {
  return Array.isArray(posts.value) ? posts.value : []
})

/* -------------------------
   SEARCH FILTER
--------------------------*/
const filteredPosts = computed(() => {
  const list = safePosts.value

  return list.filter(post => {
    const title = post?.title || ''
    return title.toLowerCase().includes(search.value.toLowerCase())
  })
})

/* -------------------------
   PAGINATION
--------------------------*/
const paginatedPosts = computed(() => {
  const list = filteredPosts.value
  const start = (currentPage.value - 1) * perPage
  return list.slice(start, start + perPage)
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredPosts.value.length / perPage))
})

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
</script>

<template>
  <div style="padding: 20px; max-width: 800px; margin: auto;">

    <h1>📝 Blog Posts</h1>

    <!-- SEARCH -->
    <input
      v-model="search"
      placeholder="Search posts..."
      style="width:100%; padding:10px; margin-bottom:15px;"
    />

    <!-- LOADING -->
    <p v-if="loading">Loading posts...</p>

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
        <h3>{{ post.title }}</h3>
        <p>{{ post.excerpt }}</p>
      </div>

      <!-- PAGINATION -->
      <div style="display:flex; gap:10px; justify-content:center; margin-top:20px;">
        <button @click="prevPage">Prev</button>

        <span>Page {{ currentPage }} / {{ totalPages }}</span>

        <button @click="nextPage">Next</button>
      </div>
    </div>

  </div>
</template>