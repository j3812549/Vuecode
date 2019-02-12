/**
 * 相当于Vue的构造函数
 * @param {配置对象} options 
 */
function Vue(options) {
  this.$options = options // 将配置对象保存到vm中
  var data = this._data = this.$options.data // 酱data对象保存到vm和变量data中
  var me = this // 保存vm到变量me
  // 数据代理
  // 实现vm。xxx -> vm._data.xxx
  Object.keys(data).forEach(function(key) { // key = 'name'，key为data的某个属性名
    me._proxy(key)
  })
}
Vue.prototype = {
  /**
   * 实现数据代理的方法
   * @param {vm的属性} key 
   */
  _proxy: function(key) { // key = 'name'
    var me = this
    Object.defineProperty(me, key, { // 给对象添加属性
      configurable: false, // 使外部不能修改
      enumerable: true, // 可以枚举遍历
      /**
       * 当通过vm.xxx读取属性值时调用，从data中获取对应的属性值返回，代理读操作
       */
      get: function proxyGetter() {
        return me._data[key]
      },
      /**
       * 当通过vm.xxx = value时，value被保存到data中对应的属性上，代理写操作
       */
      set: function proxySetter(newVal) {
        me._data[key] = newVal
      }
    })
  }
}