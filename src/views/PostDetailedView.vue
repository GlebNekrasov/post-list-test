<template>
  <div class="post-detailed-view">
    <div class="post-detailed-view__header">
      <nav>
        <HeaderLink link="/" title="Back to posts list" />
        <span> | </span>
        <HeaderLink :link="`/post/${postId - 1}`" title="Previous post" />
        <span> | </span>
        <HeaderLink :link="`/post/${postId + 1}`" title="Next post" />
      </nav>
      <VProgressLinear v-if="isLoading" color="success" indeterminate />
    </div>
    <div class="post-detailed-view__body">
      <VOverlay :model-value="isLoading" contained persistent :z-index="99" />
      <div v-if="selectedPost">
        <PostDetailed />
        <div class="post-detailed-view__comments-header">
          <div class="post-detailed-view__comments-title">
            Comments: {{ selectedPostComments.length }}
          </div>
          <VBtn
            v-if="!isCommentFormVisible"
            size="small"
            class="post-detailed-view__add-comment-button"
            @click="handleAddComment"
          >
            Add comment
          </VBtn>
        </div>
        <CommentForm
          v-if="isCommentFormVisible"
          :post-id="postId"
          @hide="changeCommentFormVisibility(false)"
          @success="handleCommentFormSuccess()"
        />
        <CommentList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePostsStore } from '@/stores/posts'
import { VBtn, VOverlay, VProgressLinear } from 'vuetify/lib/components/index.mjs'
import CommentForm from '@/components/CommentForm.vue'
import CommentList from '@/components/CommentList.vue'
import HeaderLink from '@/components/HeaderLink.vue'
import PostDetailed from '@/components/PostDetailed.vue'
import { useLoadingState } from '@/utils/useLoadingState'
import { showNotification } from '@/utils/showNotification'

const route = useRoute()
const postsStore = usePostsStore()
const { isLoading, selectedPost, selectedPostComments } = storeToRefs(postsStore)
const { getPost, updateSelectedPostComments } = postsStore

const postId = ref(getIdFromRoute())
const isCommentFormVisible = ref(false)

function getIdFromRoute() {
  const paramId = route.params.id
  return Array.isArray(paramId) ? parseInt(paramId[0]) : parseInt(paramId)
}

function changeCommentFormVisibility(state: boolean) {
  isCommentFormVisible.value = state
}

function handleAddComment() {
  changeCommentFormVisibility(true)
}

async function handleCommentFormSuccess() {
  changeCommentFormVisibility(false)
  useLoadingState(isLoading, async () => {
    await updateComments()
  })
}

function updateData() {
  postId.value = getIdFromRoute()
  useLoadingState(isLoading, async () => {
    await updatePost()
    await updateComments()
  })
}

async function updateComments() {
  if (!selectedPost.value) {
    selectedPostComments.value = []
    return
  }

  const isCommentsUpdated = await updateSelectedPostComments()

  if (!isCommentsUpdated) {
    selectedPostComments.value = []
    showNotification('Could not get comments from the server', 'error')
  }
}

async function updatePost() {
  selectedPost.value = await getPost(postId.value)

  if (!selectedPost.value) {
    showNotification('Could not get the post from the server', 'error')
  }
}

onMounted(() => {
  updateData()
  watch(
    () => route.params.id,
    () => updateData(),
  )
})
</script>

<style lang="scss" scoped>
.post-detailed-view {
  position: relative;

  &__add-comment-button {
    text-transform: none;
  }

  &__body {
    position: relative;
    background-color: #ffffff;
    padding: 16px;
    margin: 16px;
    min-height: 200px;
  }

  &__comments-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  &__comments-title {
    font-weight: 700;
    padding-right: 12px;
  }

  &__header {
    position: sticky;
    top: 0px;
    padding: 16px;
    background-color: #ffffff;
    border-bottom: solid 2px #f0f2f5;
    z-index: 100;
  }
}
</style>
