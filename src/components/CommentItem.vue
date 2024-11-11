<template>
  <div class="comment-item">
    <div class="comment-item__name">{{ comment.name }}</div>
    <div class="comment-item__body">{{ comment.body }}</div>
    <div class="comment-item__email">
      <VIcon class="comment-item__email-icon">mdi-email-outline</VIcon>
      {{ comment.email }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { VIcon } from 'vuetify/lib/components/index.mjs'
import type { Comment } from '@/stores/types'

defineProps<{ comment: Comment }>()
</script>

<style lang="scss" scoped>
.comment-item {
  &__body {
    white-space: pre-line;
    padding-bottom: 4px;
  }

  &__name {
    font-weight: 700;
  }

  &__email {
    font-size: 90%;
    color: #808080;
  }

  &__email-icon {
    font-size: 90%;
    padding-bottom: 2px;
  }
}
</style>
