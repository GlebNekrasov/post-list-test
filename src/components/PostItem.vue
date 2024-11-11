<template>
  <div class="post-item">
    <div class="post-item__title">{{ post.title }}</div>
    <div class="post-item__body">{{ post.body }}</div>
    <div class="post-item__username">Username: {{ post.user.username }}</div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '@/stores/types'

defineProps<{ post: Post }>()
</script>

<style lang="scss" scoped>
.post-item {
  cursor: pointer;

  &__body {
    white-space: pre-line;
  }

  &__title {
    font-weight: 700;
  }

  &__username {
    font-size: 90%;
    color: #808080;
  }
}
</style>
