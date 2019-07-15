<template>
    <div class="city_body">
		<!-- <div class="city_list">
			<div class="city_hot">
				<h2>热门城市</h2>
				<ul class="clearfix">
					<li>上海</li>
				</ul>
			</div>
			<div class="city_sort">
				<div>
					<h2>A</h2>
					<ul>
						<li>阿拉善盟</li>
						<li>鞍山</li>
						<li>安庆</li>
						<li>安阳</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="city_index">
			<ul>
				<li>A</li>
				<li>B</li>
				<li>C</li>
			</ul>
		</div> -->

        <div class="city_list">
            <Loading v-if="isLoading"/>

            <Scroller ref="city_List" v-else>
                <!-- 只针对一个子元素的，所以在外面加层div -->
                <div>
                    <div class="city_hot">
        				<h2>热门城市</h2>
        				<ul class="clearfix">
        					<li v-for="item in hotList" :key="item.id"
                            @tap="handleToCity(item.nm,item.id)">
                                {{item.nm}}
                            </li>
        				</ul>
        			</div>

                    <!-- 热门城市下的各个排好序的城市 -->
                    <!-- [{ index: 'A', list:[{nm:'安庆', id:123}]}] -->
                    <div class="city_sort" ref="city_sort">
        				<div v-for="item in cityList" :key="item.index">
        					<h2>{{ item.index }}</h2>
        					<ul>
        						<li v-for="itemList in item.list" :key="itemList.id" @tap="handleToCity(itemList.nm,itemList.id)">
                                    {{ itemList.nm }}
                                </li>
        					</ul>
        				</div>
        			</div>
                </div>
            </Scroller>
        </div>

        <!-- 右边索引 -->
        <div class="city_index">
			<ul>
				<li v-for="(item,index) in cityList" :key="item.index"
                @touchstart="handleToIndex(index)">
                    {{ item.index }}
                </li>
			</ul>
		</div>

	</div>
</template>

<script>
export default {
    name: 'City',
    data() {
        return {
            cityList: [],
            hotList: [],
            isLoading: true
        }
    },
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
    },
    methods: {
        // 给城市分组
        formatCityList(cities) {
            var cityList = [];   // 城市分类
            var hotList = [];   //热门城市

            // 热门城市
            for(var i = 0; i < cities.length; i++) {
                if(cities[i].isHot === 1 ) {
                    hotList.push(cities[i]);
                }
            }

            // 循环所有的城市
            for(var i = 0; i < cities.length; i++) {
                // 拿到每个城市首拼
                var firstLetter = cities[i].py.substring(0,1).toUpperCase();

                if(toCom(firstLetter)) {   //比如说：没有A，就把A添加进去 新添加index,然后再添加城市
                    cityList.push({ index : firstLetter, list: [{ nm : cities[i].nm, id : cities[i].id}]});
                } else {     // 累加到已有index 中
                    for(var j = 0 ;j < cityList.length; j++) {
                        if(cityList[j].index === firstLetter) {
                            cityList[j].list.push({nm : cities[i].nm ,id : cities[i].id});
                        }
                    }
                }
            }

            // 按照ABCD顺序排序
            cityList.sort((n1,n2) => {
                if(n1.index > n2.index) {
                    return 1;
                } else if(n1.index < n2.index) {
                    return -1;
                } else {
                    return 0;
                }
            });

            // 这个函数用来判断cityList中拥不拥有某个大写首拼
            function toCom(firstLetter) {
                for(var i = 0; i < cityList.length; i++) {
                    if(cityList[i].index === firstLetter) {
                        return false;     // 在结果集中,表示有
                    }
                }
                return true;          // 表示没有
            }

            // console.log(cityList);
            return {
                cityList,
                hotList
            }

        },
        // 点击右边的索引，跳转到对应的索引下的城市
        handleToIndex(index) {
            var h2 = this.$refs.city_sort.getElementsByTagName('h2');
            // this.$refs.city_sort.parentNode 指的是 city_list
            // this.$refs.city_sort.parentNode.scrollTop = h2[index].offsetTop;

            // toScrollTop在 components/Scroller/index.vue 定义的
            // this.$refs.city_List拿到 Scroller/index.vue 组件，然后调用其中的 toScrollTop
            this.$refs.city_List.toScrollTop(-h2[index].offsetTop);
        },

        handleToCity(nm,id) {
            this.$store.commit('city/CITY_INFO',{nm,id});
            // 页面刷新的时候还是该城市，不会变成一开始的城市，存储到本地后，在Stores/city/index.js中取
            window.localStorage.setItem('nowNm',nm);
            window.localStorage.setItem('nowId',id);
            this.$router.push('/movie/nowPlaying');
        }

    }
}
</script>

<style scoped>
#content .city_body {
    margin-top: 45px;
    display: flex;
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
}

.city_body .city_list {
    flex: 1;
    overflow: auto;
    background: #FFF5F0;
}

.city_body .city_list::-webkit-scrollbar {
    background-color: transparent;
    width: 0;
}

.city_body .city_hot {
    margin-top: 20px;
}

.city_body .city_hot h2 {
    padding-left: 15px;
    line-height: 30px;
    font-size: 14px;
    background: #F0F0F0;
    font-weight: normal;
}

.city_body .city_hot ul li {
    float: left;
    background: #fff;
    width: 29%;
    height: 33px;
    margin-top: 15px;
    margin-left: 3%;
    padding: 0 4px;
    border: 1px solid #e6e6e6;
    border-radius: 3px;
    line-height: 33px;
    text-align: center;
    box-sizing: border-box;
}

.city_body .city_sort div {
    margin-top: 20px;
}

.city_body .city_sort h2 {
    padding-left: 15px;
    line-height: 30px;
    font-size: 14px;
    background: #F0F0F0;
    font-weight: normal;
}

.city_body .city_sort ul {
    padding-left: 10px;
    margin-top: 10px;
}

.city_body .city_sort ul li {
    line-height: 30px;
    line-height: 30px;
}

.city_body .city_index {
    width: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    border-left: 1px #e6e6e6 solid;
}
</style>
