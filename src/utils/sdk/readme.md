# 数独算法SDK


## 1. JS sdk 修改为 module 的方法

```js
// 1. 移除最外层的闭包, 移除底部 convertToFastObject 后面的加载函数

// 2. 底部添加

const sdk = {}
G.dg(sdk)
export default sdk

// 注意，底部的G.dg 因为压缩可能会改变，需要看代码调整
```

## 1. 文件说明

```sh
 - index.d.ts     # 类型声明文件
 - index.js       # 针对本项目设置的sdk 入口，调用外层的函数或导出 sdk 函数在此处进行
 - interface.js   # 针对 dart2js 生成的文件做一层友好封装
 - lib-v*.*.*.js  # 相应版本的 sdk 编译出来的文件
 - sdk.test.js    # test and example
```

所以, 版本更新需要修改: `lib-v*.*.*.js` 和 `interface.js`, 本项目的调整一般在 `index.(d.)js  `
