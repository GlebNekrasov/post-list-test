<template>
  <div v-for="post in posts" :key="post.id" class="post-list">
    <PostItem :post="post" class="post-list__item" @click="handleClick(post.id)" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePostsStore } from '@/stores/posts'
import PostItem from '@/components/PostItem.vue'

const postsStore = usePostsStore()
const { posts } = storeToRefs(postsStore)

const router = useRouter()

function handleClick(postId: number) {
  router.push(`/post/${postId}`)
}
</script>

<style lang="scss" scoped>
.post-list {
  &__item {
    padding: 16px;
    margin-bottom: 16px;
  }
}
</style>
