import type { Ref } from 'vue'
import { nextTick } from 'vue'

export function useLoadingState(state: Ref<boolean>, asyncCallback: () => Promise<void>) {
  state.value = true
  asyncCallback().finally(async () => {
    await nextTick()
    state.value = false
  })
}
