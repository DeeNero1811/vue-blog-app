<script setup>
import Navbar from './components/Navbar.vue'
</script>

<template>
  <Navbar />

  <Suspense>
    <template #default>
      <router-view />
    </template>

    <template #fallback>
      <div style="padding:20px;">
        Loading page...
      </div>
    </template>
  </Suspense>
</template>