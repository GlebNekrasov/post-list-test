<template>
  <div class="post-detailed-view">
    <div class="post-detailed-view__header">
      <nav>
        <router-link to="/">Back to posts list</router-link>
        <span> | </span>
        <router-link :to="`/post/${id - 1}`">Previous post</router-link>
        <span> | </span>
        <router-link :to="`/post/${id + 1}`">Next post</router-link>
      </nav>
    </div>
    <div class="post-detailed-view__body">
      <PostDetailed :post-id="id" class="post-detailed-view__content" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PostDetailed from '@/components/PostDetailed.vue'

const route = useRoute()
const id = ref(getIdFromRoute())

function getIdFromRoute() {
  const paramId = route.params.id

  if (Array.isArray(paramId)) {
    return parseInt(paramId[0])
  } else {
    return parseInt(paramId)
  }
}

watch(
  () => route.params.id,
  () => {
    id.value = getIdFromRoute()
  },
)
</script>

<style lang="scss" scoped>
.post-detailed-view {
  position: relative;

  &__body {
    padding: 24px;
  }

  &__content {
    background-color: #ffffff;
    padding: 16px;
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
