import axios from 'axios'
import { Loading, Message } from 'element-ui'

// create axios instance
const instance = axios.create({
  baseURL: 'http://10.11.0.9:8080',
  timeout: 600000
})

// Add a request interceptor
instance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    // Loading 为单例模式
    Loading.service({
      lock: false, // 这里要设为false,否则loading时会隐藏滚动条，导致抖动
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    return config
  },
  (error) => {
    // Do something with request error
    Message.error({
      message: error.toString(),
      duration: 2000
    })
    Loading.service().close()
    return Promise.reject(error)
  }
)

// Add a response interceptor
instance.interceptors.response.use(
  (response) => {
    Loading.service().close()
    return response
  },
  (error) => {
    // 发生异常时，请求列表清空
    // 关闭loading
    Loading.service().close()
    return Promise.reject(error)
  }
)

export default instance
