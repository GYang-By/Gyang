## wc-loading

## 安装
```shell
npm i wc-loading --save

import Loading from 'wc-loading'
import 'wc-loading/style.css'
Vue.use(Loading);
```

## 使用
```javascript
this.$loading.show(); //显示
this.$loading.hide(); //隐藏
```

## 说明
* loading 会阻止页面的点击事件 -- loading 出现之后,  页面是不能点击的.