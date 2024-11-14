<template>
  <div class="post-detailed-view">
    <div class="post-detailed-view__header">
      <nav>
        <router-link to="/">Back to posts list</router-link>
        <span> | </span>
        <router-link :to="`/post/${postId - 1}`">Previous post</router-link>
        <span> | </span>
        <router-link :to="`/post/${postId + 1}`">Next post</router-link>
      </nav>
    </div>
    <VProgressLinear v-if="isLoading" indeterminate />
    <div class="post-detailed-view__body">
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
          @fail="handleCommentFormFail"
          @success="handleCommentFormSuccess"
          @hide="changeCommentFormVisibility(false)"
        />
        <CommentList />
      </div>
      <div v-else>Post not found</div>
    </div>
    <VSnackbar
      :model-value="isSendCommentSuccess"
      color="success"
      location="top"
      text="Your comment was added."
      :timeout="3000"
    />
    <VSnackbar
      :model-value="isSendCommentFailed"
      color="error"
      location="top"
      text="Your comment was not added. Try later."
      :timeout="3000"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePostsStore } from '@/stores/posts'
import { VBtn, VProgressLinear, VSnackbar } from 'vuetify/lib/components/index.mjs'
import PostDetailed from '@/components/PostDetailed.vue'
import CommentForm from '@/components/CommentForm.vue'
import CommentList from '@/components/CommentList.vue'
import { useLoadingState } from '@/utils/useLoadingState'

const route = useRoute()
const postsStore = usePostsStore()
const { isLoading, selectedPost, selectedPostComments } = storeToRefs(postsStore)
const { getPost, updateSelectedPostComments } = postsStore

const postId = ref(getIdFromRoute())
const isCommentFormVisible = ref(false)
const isSendCommentFailed = ref(false)
const isSendCommentSuccess = ref(false)

function getIdFromRoute() {
  const paramId = route.params.id

  if (Array.isArray(paramId)) {
    return parseInt(paramId[0])
  } else {
    return parseInt(paramId)
  }
}

function changeCommentFormVisibility(state: boolean) {
  isCommentFormVisible.value = state
}

function handleAddComment() {
  isSendCommentFailed.value = false
  isSendCommentSuccess.value = false
  changeCommentFormVisibility(true)
}

function handleCommentFormFail() {
  isSendCommentFailed.value = true
}

async function handleCommentFormSuccess() {
  isSendCommentSuccess.value = true
  changeCommentFormVisibility(false)
  useLoadingState(isLoading, async () => {
    await updateSelectedPostComments()
  })
}

function updateData() {
  postId.value = getIdFromRoute()
  useLoadingState(isLoading, async () => {
    selectedPost.value = await getPost(postId.value)
    await updateSelectedPostComments()
  })
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
    background-color: #ffffff;
    padding: 16px;
    margin: 24px;
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
    padding: 24px;
    background-color: #ffffff;
    border-bottom: solid 2px #f0f2f5;
    z-index: 100;

    nav {
      a {
        font-weight: bold;
        color: #42b983;
      }
    }
  }
}
</style>
