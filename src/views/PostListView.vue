<template>
  <div class="post-list-view">
    <div class="post-list-view__header">
      <div class="post-list-view__title">Posts list</div>
      <UserSelect @select="handeSelect" />
      <VProgressLinear v-if="isLoading" color="success" indeterminate />
    </div>
    <div class="post-list-view__body">
      <VOverlay :model-value="isLoading" contained persistent :z-index="99" />
      <PostList />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { usePostsStore } from '@/stores/posts'
import { VOverlay, VProgressLinear } from 'vuetify/lib/components/index.mjs'
import PostList from '@/components/PostList.vue'
import UserSelect from '@/components/UserSelect.vue'
import { useLoadingState } from '@/utils/useLoadingState'
import { showNotification } from '@/utils/showNotification'

const postsStore = usePostsStore()
const { updatePosts } = postsStore
const { isLoading, posts, selectedUserId } = storeToRefs(postsStore)

async function updatePostList(userId?: number) {
  const isPostsUpdated = userId ? await updatePosts({ userId: userId }) : await updatePosts()
  if (!isPostsUpdated) {
    showNotification('Could not get posts from the server', 'error')
  }
}

function handeSelect() {
  useLoadingState(isLoading, async () => {
    await updatePostList(selectedUserId.value)
  })
}

onMounted(() => {
  if (!posts.value.length && !selectedUserId.value) {
    useLoadingState(isLoading, async () => {
      await updatePostList()
    })
  }
})
</script>

<style lang="scss" scoped>
.post-list-view {
  position: relative;

  &__body {
    padding: 16px;
    position: relative;
    min-height: 200px;
  }

  &__header {
    position: sticky;
    top: 0px;
    padding: 16px;
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
