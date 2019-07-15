<template>
<div class="movie_body" ref="movie_body">
    <Loading v-if="isLoading"/>
    <Scroller v-else :handleToScroll="handleToScroll" :handleToTouchEnd="handleToTouchEnd">
        <ul>
            <!-- <li> 
                <div class="pic_show">
                    <img src="/images/movie_1.jpg">
                </div>
                <div class="info_list">
                    <h2>无名之辈</h2>
                    <p>观众评 <span class="grade">9.2</span></p>
                    <p>主演: 陈建斌,任素汐,潘斌龙</p>
                    <p>今天55家影院放映607场</p>
                </div>
                <div class="btn_mall">
                    购票
                </div>
            </li> -->

            <li class="pullDown">{{ pullDownMsg }}</li>

            <li v-for="item in movieList" :key="item.id">
                <div class="pic_show" @tap="handleToDetail(item.id)">
                    <img :src="item.img | setWH('128.180')">
                </div> 
                <div class="info_list">
                    <!-- 标题 -->
                    <h2 @tap="handleToDetail(item.id)">{{item.nm}}
                        <img v-if="item.version" src="@/assets/maxs.png">
                    </h2>
                    <p>观众评
                        <span class="grade">{{ item.sc }}</span>
                    </p>
                    <p>主演: {{ item.star }}</p>
                    <p>{{ item.showInfo }}</p>
                </div> 
                <div class="btn_mall">
                    购票
                </div>
            </li>
        </ul>
    </Scroller>
</div>
</template>

<script>
// import BScroll from 'better-scroll'

export default {
    name: 'NowPlaying',
    data() {
        return {
            movieList: [],         // 存放所有电影信息
            pullDownMsg: '',      // 下拉信息
            isLoading: true,  // 初始值为true,当页面加载完成后变为false
            prevCityId: -1    // 上一次城市的 id
        }
    },
    // activated 是在 keep-alive激活时调用
    activated() {
        var cityId = this.$store.state.city.id;

        // 当切换城市时，需要再次请求ajax;
        // 而不是城市切换时，比如说从 即将上映 切换到 正在热映，就不需要再次请求ajax
        if(this.prevCityId === cityId) {return;}   // 相同的话表示没有切换城市
        this.isLoading = true;

        this.axios.get('/api/movieOnInfoList?cityId='+cityId)
        .then((res) => {
            var msg = res.data.msg;
            if( msg === 'ok' ) {
                this.movieList = res.data.data.movieList;   

                // 页面加载完成后
                this.isLoading = false;

                this.prevCityId = cityId;

                // 当数据全部渲染完成之后，触发 new BScroll() 滑动方法
                // this.$nextTick(() => {
                //     // 需要满足最外层容器小，里面容器大，才可以滑动
                //     // 两个参数： 第一个参数是最外层包裹的容器，第二个参数是配置
                //     // 滑动时不触发，点击时触发
                //     var scroll = new BScroll(this.$refs.movie_body, {
                //         tap: true,    // 允许滑动的元素可以点击，滑动没效果
                //         // 该值为1时，滚动时会派发scroll 事件，会截流(一段时间触发一次)
                //         probeType: 1
                //     });
                //
                        // 下拉时触发
                //     scroll.on('scroll',(pos) => {
                //         // console.log('scroll');
                //         if( pos.y > 30) {
                //             this.pullDownMsg = '正在更新中'
                //         }
                //     });
                //
                //     // 滑动结束触发该事件(鼠标离开页面)
                //     scroll.on('touchEnd',(pos) => {
                //         // console.log('touchEnd')
                //         if( pos.y > 30) {
                //             this.axios.get('/api/movieOnInfoList?cityId=11').then((res) => {
                //                 var msg = res.data.msg;
                //                 if( msg === 'ok' ) {
                //                     this.pullDownMsg = '更新成功'
                //                     setTimeout(()=>{
                //                         this.movieList = res.data.data.movieList;
                //                         this.pullDownMsg = ''
                //                     },1000)
                //                 }
                //             })
                //         }
                //     });
                // })
            }
        })
    },
    methods: {
        handleToDetail(movieId) {
            // console.log(222);
            this.$router.push('/movie/detail/1/' + movieId);
        },
        handleToScroll(pos) {
            if( pos.y > 30) {
                this.pullDownMsg = '正在更新中'
            }
        },
        handleToTouchEnd(pos) {
            if( pos.y > 30) {
                 this.axios.get('/api/movieOnInfoList?cityId='+cityId).then((res) => {
                     var msg = res.data.msg;
                     if( msg === 'ok' ) {
                         this.pullDownMsg = '更新成功'
                         setTimeout(()=>{
                             this.movieList = res.data.data.movieList;
                             this.pullDownMsg = ''
                         },1000)
                     }
                 });
             }
        }
    }
}
</script>

<style scoped>
#content .movie_body {
    flex: 1;
    overflow: auto;
}

.movie_body ul {
    margin: 0 12px;
    overflow: hidden;
}

.movie_body ul li {
    margin-top: 12px;
    display: flex;
    align-items: center;
    border-bottom: 1px #e6e6e6 solid;
    padding-bottom: 10px;
}

.movie_body .pic_show {
    width: 64px;
    height: 90px;
}

.movie_body .pic_show img {
    width: 100%;
}

.movie_body .info_list {
    margin-left: 10px;
    flex: 1;
    position: relative;
}

.movie_body .info_list h2 {
    font-size: 17px;
    line-height: 24px;
    width: 150px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.movie_body .info_list p {
    font-size: 13px;
    color: #666;
    line-height: 22px;
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.movie_body .info_list .grade {
    font-weight: 700;
    color: #faaf00;
    font-size: 15px;
}

.movie_body .info_list img {
    width: 50px;
    position: absolute;
    right: 10px;
    top: 5px;
}

.movie_body .btn_mall,
.movie_body .btn_pre {
    width: 47px;
    height: 27px;
    line-height: 28px;
    text-align: center;
    background-color: #f03d37;
    color: #fff;
    border-radius: 4px;
    font-size: 12px;
}

.movie_body .pullDown {
    margin: 0;
    padding: 0;
    border: none;
}
</style>
