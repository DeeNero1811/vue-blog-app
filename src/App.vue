<script setup>
import { ref } from 'vue'
import Navbar from './components/Navbar.vue'

const hasError = ref(false)

function errorCaptured(err) {
  console.error('App Error:', err)
  hasError.value = true
}
</script>

<template>
  <Navbar />

  <div v-if="hasError" style="padding:20px; color:red;">
    <h2>Something went wrong 😢</h2>
    <p>Please refresh the page.</p>
  </div>

  <div v-else>
    <Suspense>
      <template #default>
        <router-view @error="errorCaptured" />
      </template>

      <template #fallback>
        <div style="padding:20px;">Loading page...</div>
      </template>
    </Suspense>
  </div>
</template>