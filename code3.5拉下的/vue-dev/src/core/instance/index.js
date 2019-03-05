import { initMixin } from './init' // 初始化
import { stateMixin } from './state' // 状态
import { renderMixin } from './render' // 渲染
import { eventsMixin } from './events' // 事件
import { lifecycleMixin } from './lifecycle' // 生命周期
import { warn } from '../util/index' // 警告

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue) // 判断 实例 是否为New出来的，或者不为生产模式，将调用warn方法提示
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
