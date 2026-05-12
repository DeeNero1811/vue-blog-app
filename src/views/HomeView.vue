<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchPosts } from '../services/api'

const posts = ref([])
const loading = ref(true)
const error = ref(null)

const search = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const perPage = 5

const router = useRouter()

/* SAFE API FETCH */
onMounted(async () => {
  try {
    const res = await fetchPosts()

    console.log('API RESPONSE:', res)

    // SAFE NORMALIZATION (handles ANY API shape)
    const data =
      Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : []

    posts.value = data
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load posts'
    posts.value = []
  } finally {
    loading.value = false
  }
})

/* OPEN POST */
function openPost(post) {
  router.push(`/post/${post?.slug || post?.id}`)
}

/* SAFE FILTER */
const filteredPosts = computed(() => {
  const list = posts.value || []

  return list
    .filter(post => {
      const title = post?.title || ''
      return title.toLowerCase().includes(search.value.toLowerCase())
    })
    .filter(post => {
      return selectedCategory.value
        ? post?.category === selectedCategory.value
        : true
    })
})

/* PAGINATION */
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
    
    <h1 style="text-align:center;">📝 My Blog</h1>

    <!-- CATEGORY -->
    <select
      v-model="selectedCategory"
      style="padding:8px; margin-bottom:10px; width:100%;"
    >
      <option value="">All Categories</option>
      <option value="tech">Tech</option>
      <option value="news">News</option>
      <option value="life">Life</option>
    </select>

    <!-- SEARCH -->
    <input
      v-model="search"
      placeholder="Search posts..."
      style="width:100%; padding:10px; margin:10px 0 20px; border:1px solid #ccc; border-radius:8px;"
    />

    <!-- LOADING -->
    <div v-if="loading">
      <div
        v-for="n in 5"
        :key="n"
        style="
          height: 80px;
          background: #f2f2f2;
          margin-bottom: 15px;
          border-radius: 10px;
          animation: pulse 1.2s infinite;
        "
      ></div>
    </div>

    <!-- ERROR -->
    <p v-else-if="error" style="color:red;">
      {{ error }}
    </p>

    <!-- POSTS -->
    <div v-else>
      <div
        v-for="post in paginatedPosts"
        :key="post.id"
        @click="openPost(post)"
        style="cursor:pointer; padding:15px; margin-bottom:15px; border:1px solid #ddd; border-radius:10px;"
      >
        <h3>{{ post?.title }}</h3>

        <p style="opacity:0.7;">
          {{ post?.excerpt || (post?.content ? post.content.slice(0, 120) + '...' : '') }}
        </p>
      </div>

      <!-- PAGINATION -->
      <div style="display:flex; justify-content:center; gap:10px; margin-top:20px;">
        <button @click="prevPage" :disabled="currentPage === 1">
          Prev
        </button>

        <span>Page {{ currentPage }} / {{ totalPages }}</span>

        <button @click="nextPage" :disabled="currentPage === totalPages">
          Next
        </button>
      </div>
    </div>

  </div>
</template>

<style>
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}
</style>