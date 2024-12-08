<template>
  <VForm ref="commentForm" class="comment-form" validate-on="input" @submit.prevent="sendComment">
    <VTextField
      v-model="commentName"
      density="compact"
      label="Comment name"
      :rules="commentNameRules"
    />
    <VTextarea
      v-model="commentBody"
      density="compact"
      label="Comment text"
      :rules="commentBodyRules"
    />
    <VTextField v-model="commentEmail" density="compact" label="Email" :rules="emailRules" />
    <VBtn size="small" type="submit" class="comment-form__send-button">Send comment</VBtn>
    <VBtn size="small" class="comment-form__cancel-button" @click="cancelAddComment">Cancel</VBtn>
  </VForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePostsStore } from '@/stores/posts'
import { VBtn, VForm, VTextarea, VTextField } from 'vuetify/lib/components/index.mjs'
import { showNotification } from '@/utils/showNotification'

const props = defineProps<{ postId: number }>()
const emit = defineEmits(['hide', 'success'])

const postsStore = usePostsStore()
const { isLoading } = storeToRefs(postsStore)
const { addComment } = postsStore

const commentForm = ref<InstanceType<typeof VForm> | null>()

const commentBody = ref('')
const commentName = ref('')
const commentEmail = ref('')

function cancelAddComment() {
  clearCommentData()
  emit('hide')
}

function clearCommentData() {
  commentBody.value = ''
  commentEmail.value = ''
  commentName.value = ''
}

async function sendComment() {
  isLoading.value = true

  if (commentForm.value) {
    const isFormValid = await commentForm.value.validate()
    if (!isFormValid.valid) {
      isLoading.value = false
      return
    }
  } else {
    isLoading.value = false
    return
  }

  const newComment = await addComment({
    body: commentBody.value,
    email: commentEmail.value,
    name: commentName.value,
    postId: props.postId,
  })

  isLoading.value = false

  if (newComment?.id) {
    clearCommentData()
    showNotification('Your comment was added', 'success')
    emit('success')
  } else {
    showNotification('Your comment was not added. Try later.', 'error')
  }
}

const commentNameRules = [
  (value: string) => !!(value.length >= 1) || 'Comment name must be filled.',
]

const commentBodyRules = [
  (value: string) => !!(value.length >= 1) || 'Comment text must be filled.',
]

const emailRules = [
  (value: string) =>
    /^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(value) || 'Email must be valid.',
]
</script>

<style lang="scss" scoped>
.comment-form {
  padding-bottom: 12px;

  &__cancel-button,
  &__send-button {
    text-transform: none;
  }

  &__send-button {
    margin-right: 12px;
  }
}
</style>
