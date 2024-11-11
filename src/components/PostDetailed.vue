<template>
  <div class="post-detailed">
    <VProgressLinear v-if="isLoading" indeterminate />
    <div v-if="post" class="post-detailed__content">
      <div class="post-detailed__post-data">
        <div class="post-detailed__post-data-title">{{ post.title }}</div>
        <div class="post-detailed__post-data-body">{{ post.body }}</div>
      </div>
      <div class="post-detailed__user-data">
        <div class="post-detailed__user-data-item">
          <VIcon class="post-detailed__user-data-item-icon">mdi-account-outline</VIcon>
          {{ post.user.username }}
        </div>
        <div class="post-detailed__user-data-item">
          <VIcon class="post-detailed__user-data-item-icon">mdi-email-outline</VIcon>
          {{ post.user.email }}
        </div>
        <div class="post-detailed__user-data-item">
          <VIcon class="post-detailed__user-data-item-icon">mdi-web</VIcon>
          {{ post.user.website }}
        </div>
        <div class="post-detailed__user-data-item">
          <VIcon class="post-detailed__user-data-item-icon">mdi-map-marker-outline</VIcon>
          {{ post.user.address.city }}
        </div>
      </div>
      <div class="post-detailed__comment-header">
        <div class="post-detailed__comments-title">Comments: {{ comments.length }}</div>
        <VBtn
          v-if="!isCommentFormVisible"
          size="small"
          class="post-detailed__add-comment-button"
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
      <div class="post-detailed__comment-list">
        <CommentItem
          v-for="comment in comments"
          :comment="comment"
          :key="comment.id"
          class="post-detailed__comment"
        />
      </div>
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
      color="danger"
      location="top"
      text="Your comment was not added. Try later."
      :timeout="3000"
    />
    <div v-if="isNotFound">Post not found</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import type { Comment, Post } from '@/stores/types'
import { usePostsStore } from '@/stores/posts'
import { VBtn, VIcon, VProgressLinear, VSnackbar } from 'vuetify/lib/components/index.mjs'
import CommentForm from './CommentForm.vue'
import CommentItem from './CommentItem.vue'
import { useLoadingState } from '@/utils/useLoadingState'

const props = defineProps<{ postId: number }>()

const postsStore = usePostsStore()
const { isLoading } = storeToRefs(postsStore)
const { getComments, getPost } = postsStore

const post = ref<Post | undefined>(undefined)
const comments = ref<Comment[]>([])
const isNotFound = ref(false)
const isCommentFormVisible = ref(false)
const isSendCommentFailed = ref(false)
const isSendCommentSuccess = ref(false)

async function updatePostData(postId: number) {
  await updatePost(postId)
  await updateComments()
}

async function updatePost(id: number) {
  try {
    post.value = await getPost(id)
    post.value ? (isNotFound.value = false) : (isNotFound.value = true)
  } catch {
    post.value = undefined
    isNotFound.value = true
  }
}

async function updateComments() {
  try {
    if (!post.value?.id) {
      return
    }

    comments.value = await getComments(post.value.id)
  } catch {
    comments.value = []
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
  await updateComments()
}

onMounted(() => {
  useLoadingState(isLoading, () => updatePostData(props.postId))

  watch(
    () => props.postId,
    (newId) => {
      useLoadingState(isLoading, () => updatePostData(newId))
    },
  )
})
</script>

<style lang="scss" scoped>
.post-detailed {
  &__add-comment-button {
    text-transform: none;
  }

  &__post-data {
    padding-bottom: 4px;
  }

  &__post-data-title {
    font-weight: 700;
  }

  &__post-data-body {
    white-space: pre-line;
  }

  &__comment {
    margin-bottom: 16px;
  }

  &__comment-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  &__comments-title {
    font-weight: 700;
    padding-right: 12px;
  }

  &__user-data {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    color: #808080;
    border-bottom: solid 1px #000000;
    padding-bottom: 12px;
    margin-bottom: 24px;
  }

  &__user-data-item {
    text-wrap: nowrap;
    font-size: 90%;
    padding-right: 12px;
  }

  &__user-data-item-icon {
    font-size: 100%;
    padding-bottom: 2px;
  }
}
</style>
