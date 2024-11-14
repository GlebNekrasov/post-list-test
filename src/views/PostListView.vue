<template>
  <div class="post-list-view">
    <div class="post-list-view__header">
      <div class="post-list-view__title">Posts list</div>
      <UserSelect @select="handeSelect" />
    </div>
    <div class="post-list-view__body">
      <VProgressLinear v-if="isLoading" indeterminate />
      <PostList />
    </div>
    <VSnackbar
      :model-value="isPostsUpdateFailed"
      color="error"
      location="top"
      text="Could not get posts from server."
      :timeout="3000"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePostsStore } from '@/stores/posts'
import { VSnackbar } from 'vuetify/lib/components/index.mjs'
import PostList from '@/components/PostList.vue'
import UserSelect from '@/components/UserSelect.vue'

const postsStore = usePostsStore()
const { updatePosts } = postsStore
const { isLoading, posts, selectedUserId } = storeToRefs(postsStore)

const isPostsUpdateFailed = ref(false)

async function updatePostList(userId?: number) {
  isPostsUpdateFailed.value = false
  isPostsUpdateFailed.value = userId
    ? !(await updatePosts({ userId: userId }))
    : !(await updatePosts())
}

function handeSelect() {
  updatePostList(selectedUserId.value)
}

onMounted(() => {
  if (!posts.value.length && !selectedUserId.value) {
    updatePostList()
  }
})
</script>

<style lang="scss" scoped>
.post-list-view {
  position: relative;

  &__body {
    padding: 16px;
    margin: 24px;
    background-color: #ffffff;
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
