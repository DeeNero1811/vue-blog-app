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

onMounted(async () => {
  try {
    const data = await fetchPosts()

    // SAFE CHECK (prevents crash)
    posts.value = Array.isArray(data) ? data : []
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load posts'
  } finally {
    loading.value = false
  }
})

function openPost(post) {
  router.push(`/post/${post.slug || post.id}`)
}

/* SAFE FILTER (prevents runtime crash) */
const filteredPosts = computed(() => {
  return posts.value
    .filter(post => {
      const title = post?.title || ''
      return title.toLowerCase().includes(search.value.toLowerCase())
    })
    .filter(post =>
      selectedCategory.value
        ? post.category === selectedCategory.value
        : true
    )
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