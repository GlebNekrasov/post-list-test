<template>
  <div class="comment-list">
    <CommentItem
      v-for="comment in selectedPostComments"
      :comment="comment"
      :key="comment.id"
      class="comment-list__comment"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePostsStore } from '@/stores/posts'
import CommentItem from './CommentItem.vue'

const postsStore = usePostsStore()
const { selectedPostComments } = storeToRefs(postsStore)
</script>

<style lang="scss" scoped>
.comment-list {
  &__comment {
    margin-bottom: 16px;
  }
}
</style>
