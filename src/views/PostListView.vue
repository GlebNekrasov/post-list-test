<template>
  <div class="post-list-view">
    <div class="post-list-view__header">
      <div class="post-list-view__title">Posts list</div>
      <UserSelect />
    </div>
    <div class="post-list-view__body">
      <PostList />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePostsStore } from '@/stores/posts'
import PostList from '@/components/PostList.vue'
import UserSelect from '@/components/UserSelect.vue'

const postsStore = usePostsStore()
const { updatePosts } = postsStore
const { posts, selectedUserId } = storeToRefs(postsStore)

onMounted(async () => {
  if (!posts.value.length && !selectedUserId.value) {
    await updatePosts()
  }
})
</script>

<style lang="scss" scoped>
.post-list-view {
  position: relative;

  &__body {
    padding: 24px;
  }

  &__header {
    position: sticky;
    top: 0px;
    padding: 24px;
    background-color: #ffffff;
    border-bottom: solid 2px #f0f2f5;
    z-index: 100;
  }

  &__title {
    font-size: 120%;
    font-weight: 700;
    margin-bottom: 12px;
  }
}

.user-select {
  max-width: 300px;
}
</style>
