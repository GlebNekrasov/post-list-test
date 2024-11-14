<template>
  <div class="post-detailed">
    <div v-if="selectedPost" class="post-detailed__content">
      <div class="post-detailed__post-data">
        <div class="post-detailed__post-data-title">{{ selectedPost.title }}</div>
        <div class="post-detailed__post-data-body">{{ selectedPost.body }}</div>
      </div>
      <div class="post-detailed__user-data">
        <div class="post-detailed__user-data-item">
          <VIcon class="post-detailed__user-data-item-icon">mdi-account-outline</VIcon>
          {{ selectedPost.user.username }}
        </div>
        <div class="post-detailed__user-data-item">
          <VIcon class="post-detailed__user-data-item-icon">mdi-email-outline</VIcon>
          {{ selectedPost.user.email }}
        </div>
        <div class="post-detailed__user-data-item">
          <VIcon class="post-detailed__user-data-item-icon">mdi-web</VIcon>
          {{ selectedPost.user.website }}
        </div>
        <div class="post-detailed__user-data-item">
          <VIcon class="post-detailed__user-data-item-icon">mdi-map-marker-outline</VIcon>
          {{ selectedPost.user.address.city }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePostsStore } from '@/stores/posts'
import { VIcon } from 'vuetify/lib/components/index.mjs'

const postsStore = usePostsStore()
const { selectedPost } = storeToRefs(postsStore)
</script>

<style lang="scss" scoped>
.post-detailed {
  &__post-data {
    padding-bottom: 4px;
  }

  &__post-data-title {
    font-weight: 700;
  }

  &__post-data-body {
    white-space: pre-line;
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
