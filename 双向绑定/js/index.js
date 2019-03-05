/**
 * 脏值检查实现双向绑定
 */

//将数据和节点挂载在一起
let obj = { msg: new ViewModel(''), name: new ViewModel('') };

function ViewModel(data) {
  this.data = data; //this.data代表的是当前的值 （new一个对应一个）
  this.nodes = [];//放节点的盒子
};

ViewModel.prototype.bindNode = function (node) { //这里要做的事就是把节点和数据绑定在一起(prototype可以让你向对象添加属性和方法)
  this.nodes.push(node);//数组中添加input
  //				console.log(this.nodes)
};
ViewModel.prototype.setVal = function (newVal) { //这里要做的是将input的值赋给{{}}
  if (newVal !== this.data) {
    this.data = newVal;
    this.update()
  };
};
ViewModel.prototype.getVal = function () { //把该方法暴露，取得data的值
  return this.data
}
ViewModel.prototype.update = function () { //更新方法 可以把节点依次渲染成想要的结果
  this.nodes.forEach(node => {
    if (node.nodeType === 1) {
      node.value = this.data;
    } else {
      node.textContent = node.my.replace(/\{\{([^}]*)}\}/g, function () {
        return obj[arguments[1]].data;
      })
    }
  })
}

function compile(el) {
  let ele = document.querySelector(el); //取元素
  //我们不要直接操作节点 可能会导致页面的回流
  let fragment = document.createDocumentFragment() //创建一个文档碎片
  //取ele下的第一个元素	直到取完为止并且将内容放到文档碎片中
  let child;
  while (child = ele.firstChild) {
    fragment.appendChild(child);
  };
  function replace(fragment) { //用来递归判断是否有我们想要的标签
    //				NodeList 类数组 Array.prototype.slice.call					
    Array.from(fragment.childNodes).forEach(node => {	//childNodes取他的儿子 forEach遍历数组

      //					console.log(node)
      //判断node 节点是标签 还是文本
      if (node.nodeType === 1) {	//元素节点
        //						node.attributes; //取到节点上的所有属性  这还是一个类数组 
        Array.from(node.attributes).forEach(attr => {
          //							console.dir(attr);  //console.dir 显示一个对象的所有属性和方法
          let { name, value } = attr;  //相当于 let name = attr.name; let value = attr.value
          if (name.includes('xy-')) {	//array.includes是判断数组里是否包含某一元素,返回true和false
            obj[value].bindNode(node) //给对应的input添加上bindNode这个方法
            node.addEventListener("input", function (e) {
              obj[value].setVal(e.target.value)
            })
          };
        });
        //取得节点上的所有属性
      };
      let reg = /\{\{([^}]*)\}\}/g;
      let text = node.textContent; //取得node文本节点中的数值用来做正则判断
      //test方法用来检索字符串中是否有匹配的文本，有返回true.否则false
      if (node.nodeType === 3 && reg.test(text)) {//文本节点
        text.replace(reg, function () {
          //								console.log(arguments)  //获取到函数中的所有参数
          node.my = text; //自定义属性   保留原有的值
          obj[arguments[1]].bindNode(node);//给对应的text添加上bindNode这个方法
        });
      };
      if (node.childNodes.length) {
        replace(node); //如果有嵌套关系 继续查找
      };
    });
  };
  replace(fragment); //编译后要调用update方法
  Object.keys(obj).forEach(key => { //Object.keys()，该方法返回一个数组，可以拿到对象的所有属性
    obj[key].update();
  })
  // 这里操作数据  是不会导致页面回流
  ele.appendChild(fragment);
};
compile('#app')
