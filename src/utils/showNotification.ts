import { toast } from 'vue3-toastify'
import type { ToastType } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export function showNotification(message: string, type: ToastType) {
  toast(message, {
    theme: 'auto',
    type: type,
    position: 'top-center',
    dangerouslyHTMLString: true,
  })
}
