import { Notify } from 'quasar'
import { i18n } from 'boot/i18n'

const { tc } = i18n.global

export const exportNotify = () => {
  Notify.create({
    classes: 'notification-negative shadow-15',
    icon: 'mdi-alert',
    textColor: 'negative',
    message: tc('noData'),
    position: 'bottom',
    closeBtn: true,
    timeout: 5000,
    multiLine: false
  })
}
