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

/* 🚀 FIX 1 — SAFE API LOADING */
onMounted(async () => {
  try {
    const res = await fetchPosts()

    console.log('API RESPONSE:', res)

    posts.value = Array.isArray(res)
      ? res
      : Array.isArray(res?.data)
        ? res.data
        : []
  } catch (err) {
    console.error('API ERROR:', err)
    posts.value = []
    error.value = 'Failed to load posts'
  } finally {
    loading.value = false
  }
})

/* 🚀 NAVIGATION */
function openPost(post) {
  router.push(`/post/${post?.slug || post?.id}`)
}

/* 🚀 FIX 2 — SAFE FILTER (NO CRASH) */
const filteredPosts = computed(() => {
  const list = Array.isArray(posts.value)
    ? posts.value
    : posts.value?.data && Array.isArray(posts.value.data)
      ? posts.value.data
      : []

  return list
    .filter(post => {
      const title = post?.title ?? ''
      return title.toLowerCase().includes(search.value.toLowerCase())
    })
    .filter(post =>
      selectedCategory.value
        ? post?.category === selectedCategory.value
        : true
    )
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