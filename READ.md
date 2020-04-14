# 喵喵电影项目（基于vue开发）
该项目采用的是vue开发。

## 使用指导
- `git clone  项目地址` 到本地
- `npm install `
- `npm run serve` 便可以开启项目

## 如何初始化整个项目 
- 使用`vue-cli`初始化整个项目
- 使用命令 `vue create miaomiao2` 创建项目
- 手动配置。配置`vue-router`,`vuex`。

## 文件目录树
```md
.
├── README.md
├── READ.md
├── babel.config.js
├── package-lock.json
├── package.json
├── public (存放公共文件)
│   ├── css
│   │   ├── iconfont
│   │   └── common.css
│   ├── favicon.ico
│   ├── libs
│   │   ├── swiper-4.1.0.min.css
│   │   └── swiper-4.1.0.min.js
│   └── index.html
├── src
│   ├── App.vue
│   ├── assets (存放一些图片等)
│   │   ├── logo.png
│   │   └── max.png
│   ├── components(子组件)
│   │   ├── CiList
│   │   ├── City
│   │   ├── ComingSoon
│   │   ├── Header
│   │   ├── JS
│   │   ├── Loading
│   │   ├── Login
│   │   ├── NowPlaying
│   │   ├── Scroller
│   │   ├── Search
│   │   └── TabBar
│   ├── main.js（入口文件）
│   ├── routers (路由文件)
│   │   ├── cinema
│   │   ├── mine
│   │   ├── movie
│   │   └── index.js
│   ├── stores (状态管理文件)
│   │   ├── city
│   │   └── index.js
│   └── views （主要路由组件）
│       ├── City
│       ├── Movie
│       └── Mine
└── vue.config.js
```


## 项目接口
  | 接口名称 | 请求方式 | 请求示列 |
  | --- | ---- | ---- |
  | 正在热映 | get | http://39.97.33.178/api/movieOnInfoList?cityId=10 |
  | 即将上映 | get | http://39.97.33.178/api/movieComingList?cityId=10 |
  | 搜索 | get | http://39.97.33.178/api/searchList?cityId=10&kw=a |
  | 城市 | get | http://39.97.33.178/api/cityList |
  | 电影详情 | get | http://39.97.33.178/api/detailmovie?movieId=345808 |
  | 影院 | get | http://39.97.33.178/api/cinemaList?cityId=10 |
  | 城市定位 | get | http://39.97.33.178/api/getLocation |

## 技术要点
- [x] `vue`
- [x] `vuex`
- [x] `vue-router`
- [x] `better-scroll`
- [x] `proxy`
- [x] `axios`
- [x] `swiper`


## 静态页面展示 

#### 项目主要页面截图

<figure class="third">

<img src="https://github.com/JamesYinHangjun/miaomiao2/blob/dev/Images/City.png?raw=true" width=200 height=400 alt="City">
<img src="https://github.com/JamesYinHangjun/miaomiao2/blob/dev/Images/NowPlaying.png?raw=true" width=200 height=400 alt="NowPlaying">
<img src="https://github.com/JamesYinHangjun/miaomiao2/blob/dev/Images/ComingSoon.png?raw=true" width=200 height=400 alt="ComingSoon">

</figure>

<figure class="third">

<img src="https://github.com/JamesYinHangjun/miaomiao2/blob/dev/Images/Search.png?raw=true" width=200 height=400 alt="Search">
<img src="https://github.com/JamesYinHangjun/miaomiao2/blob/dev/Images/detailMovie.png?raw=true" width=200 height=400 alt="detailMovie">
<img src="https://github.com/JamesYinHangjun/miaomiao2/blob/dev/Images/CiList.png?raw=true" width=200 height=400 alt="Cilist">

</figure>

<figure class="one">

<img src="https://github.com/JamesYinHangjun/miaomiao2/blob/dev/Images/Mine.png?raw=true" width=200 height=400 alt="Mine">

</figure >


## github的上传过程  

#### 第一部分在createComponents分支上开发
- git add .
- git commit -m "add createComponents"
- git checkout dev
- git merge createComponents --no-ff(合并时，将合并记录添加到 git log 中)
- git push origin dev          (push到远程上)
- git branch 
- git branch -d createComponents


## 部分技术要点分析
1.使用`vue.config.js`中配置`proxy`反向数据代理 [具体可以参考](https://cli.vuejs.org/zh/config/#devserver-proxy)，看代码分析 
```js
module.exports = {
    publicPath: '/miaomiao',
    devServer: {
        proxy: {
            '/api' : {
                target: 'http://39.97.33.178',
                changeOrigin : true
            }
        }
    }
}
```
2.使用axios 发送ajax请求。
```js  
//安装axios
npm i axios -S  
// main.js引入 
import axios from 'axios'
// 将axios放入Vue原型中 ，以便全局调用 
Vue.prototype.axios = axios
// 使用
this.axios.get/post(url).then((res) => {

})
```

## 项目结构分析
本次项目全部采用子组件方式去创建，可以根据目录看到
- `views`文件存放路由组件(都是不复用的组件)。
- `components` 文件存放非路由组件(是一次书写，可以多次调用的组件)。比如`Header/index.vue`作为头部分的页面，不仅是在单个页面拥有，而且是在其他三个大的单页面同时拥有，这时候就被抽离出来，以便与随时调用。
- `routers` 为了后续大的项目，将每个页面的路由都抽离出来，存放在文件中，以方便管理。
- 可以看看对路由作出来哪些优化
- 在 routers/index.js中引入
```js 
import Vue from 'vue'
import Router from 'vue-router'
// 为了方便管理，路由也按需加载
import movieRouter from './movie'
import cityRouter from './city'
import personRouter from './mine'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
      movieRouter,
      cinemaRouter,
      mineRouter,
      {
          path: '/*',
          redirect: '/movie'
      }
  ]
})
```
```js
export default {
    path:'/movie',
    component:() => import('@/views/movie')
}
```
- 对于子路由的优化，我们做到来 按需加载 的形式。如果我们使用以前的方式。这个页面不需要组件的文件也会被加载进来，但是使用`() => import('组件的地址')`。优化之后，对页面也会有一定的提升。


#### 对于路由组件传递参数

```js
 {
  path: 'detail/:movieId',
    components: {
    detail: () => import('@/views/movie/detail.vue'),
    }
 }
```
对于上面这种写法， 我们可以在传递过去的组件中，直接使用`this.$route.params.movieId`接受参数。
在组件中使用 $route 会使之与其对应路由形成高度耦合，从而使组件只能在某些特定的 URL 上使用，限制了其灵活性。
故我们可以采取`props`将路由组件解偶。
```js
{
  path: 'detail/:movieId',
    components: {
      detail: () => import('@/views/movie/detail.vue'),
    },
    props: {
      detail: true
    }
}
```
组件接收方式
```js
export default {
  name: "detail",
  props: ['movieId'],
  components: {
    Header
  },
  mounted() {
    // 这种方式也可以传递id过来，在组件中使用 $route 会使之与其对应路由形成高度耦合，从而使组件只能在某些特定的 URL 上使用，限制了其灵活性。
    // console.log(this.$route.params.movieId)
    console.log(this.movieId)
  },
}
```
这样你便可以在任何地方使用该组件，使得该组件更易于重用和测试。

[参考官方文档](https://router.vuejs.org/zh/guide/essentials/passing-props.html)


## 功能实现
1.components/City/index.vue中，点击右边ABCDE,跳转到左边相应索引位置功能的实现
```js
// 点击右边的索引，跳转到对应的索引下的城市
        handleToIndex(index) {
            var h2 = this.$refs.city_sort.getElementsByTagName('h2');
            // this.$refs.city_sort.parentNode.scrollTop = h2[index].offsetTop;

            this.$refs.city_List.toScrollTop(-h2[index].offsetTop);
        }

// offsetTop：返回距离上级盒子(带有定位的盒子)的top值
// h2 上级有定位的是 .city_body，所以 h2[A].offsetTop的值返回的是 左边 A 距离最外层盒子的距离,所以也就实现了点击右边的索引，左边定位到相应索引的功能
```

2.函数防抖功能 components/Search/index.vue 搜索
```js
message(newValue) {
            // console.log(newValue)
            var that = this;
            var cityId = this.$store.state.city.id;

            this.cancelRequest();
            this.axios.get('/api/searchList?cityId='+cityId+'&kw='+newValue,{
                cancelToken: new this.axios.CancelToken(function(c) {
                    // console.log(111);
                   that.source = c;
               })
            })
            .then((res) => {
                var msg = res.data.msg;
                var movies = res.data.data.movies;
                if(msg && movies) {
                    this.moviesList = res.data.data.movies.list;
                }
            }).catch((err) => {
                if (this.axios.isCancel(err)) {
                    console.log('Request canceled', err.message); //请求如果被取消，这里是返回取消的message
                } else {
                    //handle error
                    console.log(err);
                }
            })
        }
```

3.不怎么变化但数据量又特别大的数据存储在本地，比如说 城市 数据
- 当城市数据请求完成之后，存储到本地(localStorage)
- 本地存储存的是字符串，所以数据要通过JSON.stringify()转化为字符串，取的时候通过JSON.parse()转化为对象
```js
mounted() {
        // 当如果有本地存储，就在本地存储中取值。如果没有，就走下面的请求
        var cityList = window.localStorage.getItem('cityList');
        var hotList = window.localStorage.getItem('hotList');

        if(cityList && hotList) {
            // 当有cityList 和 hotList 时
            this.cityList = JSON.parse(cityList);
            this.hotList = JSON.parse(hotList);
            this.isLoading = false; // 保证不再重新加载
        } else {       // 没有值就往本地上存储数据
            this.axios.get('/api/cityList').then((res) => {
                // console.log(res);
                var msg = res.data.msg;
                if(msg === 'ok') {
                    this.isLoading = false;

                    var cities = res.data.data.cities;   // 所有城市

                    // 给所有城市分组，按照首拼py(拼音)
                    // [{ index: 'A', list:[{nm:'安庆', id:123}]}]
                    var { cityList,hotList} =  this.formatCityList(cities);
                    // 映射
                    this.cityList = cityList;
                    this.hotList = hotList;

                    // 城市数据请求完成之后，进行本地存储
                    window.localStorage.setItem('cityList',JSON.stringify(cityList));
                    window.localStorage.setItem('hotList',JSON.stringify(hotList));
                }
            })
        }
    }
```
4.出现 Uncaught SyntaxError: Unexpected token '<' 错误
原因: 在router/index.js中配置了 base: 'miaomiao'后，在vue.config.js下需要配置
      publicPath: '/miaomiao'
