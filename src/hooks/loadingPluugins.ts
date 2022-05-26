import { Loading } from 'quasar'

export const loadingShow = () => {
  Loading.show({
    spinnerColor: 'black',
    backgroundColor: 'white'
  })
}
export const loadingHide = () => {
  Loading.hide()
}
