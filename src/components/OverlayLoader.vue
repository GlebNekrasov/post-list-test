<template>
  <VOverlay :model-value="isLoading" class="overlay-loader" contained persistent />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePostsStore } from '@/stores/posts'
import { VOverlay } from 'vuetify/lib/components/index.mjs'

const postsStore = usePostsStore()
const { isLoading } = storeToRefs(postsStore)
</script>
