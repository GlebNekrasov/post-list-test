<template>
  <VSelect
    v-model="selectedUserId"
    class="user-select"
    :items="items"
    clearable
    density="compact"
    hide-details
    label="Username"
    @update:model-value="emit('select')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { VSelect } from 'vuetify/lib/components/index.mjs'
import { usePostsStore } from '@/stores/posts'

const emit = defineEmits(['select'])

const postsStore = usePostsStore()
const { selectedUserId, users } = storeToRefs(postsStore)

const items = computed(() => {
  const options = users.value.map((user) => {
    return {
      value: user.id,
      title: user.username,
    }
  })

  options.sort((a, b) => (a.title > b.title ? 1 : -1))
  return options
})
</script>
