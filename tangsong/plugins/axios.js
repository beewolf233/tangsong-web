import { Toast } from 'vant';
export default function ({ $axios, redirect }) {
    // const $axios = app.$axios
    $axios.onRequest(config => {
        console.log('Making request to ' + config.url)
    })
    // 返回回调
    $axios.onResponse((response) => {
        const res = response.data
        if (res.recode !== 200) {
            Toast.fail(res.msg || res.message || 'Error');
            return Promise.reject(new Error(res.msg || res.message || 'Error'))
        } else {
            return res
        }
    })
    $axios.onError(error => {
      const code = parseInt(error.response && error.response.status)
      if (code === 400) {
        redirect('/400')
      }
    })
}
