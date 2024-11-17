<template>
  <router-link :to="isLoading ? '' : link" :class="{ disabled: isLoading }">
    {{ title }}
  </router-link>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePostsStore } from '@/stores/posts'

defineProps<{
  link: string
  title: string
}>()

const postsStore = usePostsStore()
const { isLoading } = storeToRefs(postsStore)
</script>

<style lang="scss" scoped>
a {
  font-weight: bold;
  color: #42b983;

  &.disabled:hover {
    cursor: default;
  }
}
</style>
