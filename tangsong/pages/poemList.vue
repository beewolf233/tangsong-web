<template>
  <div class="poemlist_log_wrapper">
    <!-- <cube-scroll
      ref="scroll"
      :data="poemistt"
      :options="options"
      @pulling-down="onPullingDown"
      @pulling-up="onPullingUp">
      <PoemList :poemList="poemist" v-if="poemist"/>
      <div 
        v-if="(poemist && poemist.length === 0)" 
        class="no_order_tips">
        <span class="no_order_img"/>
        <span>暂无进出门记录</span>
      </div>
    </cube-scroll> -->
    <PoemItems :poemList="poemlist" poemState="list" v-if="poemlist" />
    <infinite-loading
      class="app-infinite-loading"
      @infinite="infiniteHandler">
        <span slot="no-more" class="app-infinite-nomore">
            诗歌到底了
        </span>
    </infinite-loading>
  </div>
</template>

<script>
import PoemItems from '../components/PoemItems';
import InfiniteLoading from 'vue-infinite-loading';
export default {
    name: 'PoemList',
    data() {
        return {
            poemlist: null,
            pageSize: 10,
            pageNum: 1,
            options: {
                pullDownRefresh: {
                    threshold: 90,
                    stop: 40,
                    txt: '刷新成功'
                },
                pullUpLoad: {
                    threshold: 10,
                    txt: {
                        more: '更多',
                        noMore: '没有更多数据了'
                    }
                }
            }
        };
    },
    components: {
      PoemItems,
      InfiniteLoading
    },
    created: function () {
        console.log(4444);
        // this.fetchpoemList('pulling down');
    },
    mounted: function(){
        console.log(22333);
        // this.fetchpoemList('pulling down');
    },
    methods: {
        // onPullingDown: function () {
        //     this.pageNum = 1;
        //     this.fetchpoemList('pulling down');      
        // },
        // onPullingUp: function () {
        //     this.fetchpoemList('pulling up');          
        // },
        infiniteHandler: function($state){
            this.fetchpoemList('pulling up').then((res)=>{
                if (res.length == this.pageSize){
                    $state.loaded();
                } else {
                    $state.complete();
                }
            });
        },
        fetchpoemList: function (flag) {
            return new Promise((resolve, reject)=>{
                this.$toast.loading({
                    message: '加载中...',
                    forbidClick: true
                });
                this.$axios.post(`app/poemlist`, {
                    pageSize: this.pageSize, 
                    pageNum: this.pageNum})
                    .then(response => {
                        this.$toast.clear();
                        if (response.recode === 200 && response.data && 
                        response.data.list) {
                            this.pageNum = response.data.list.length > 0 ? this.pageNum + 1 : this.pageNum;
                            let poemlist = this.poemlist || [];
                            this.poemlist = flag === 'pulling down' ? response.data.list : poemlist.concat(response.data.list);
                            resolve(response.data.list);
                        } else {
                            // 弹窗提示获取公告列表有误
                            //   this.$refs.scroll.forceUpdate();
                            if (response.recode !== 200) {
                                this.$toast(response.msg);
                                reject(error);
                            }
                        }
                    });
            })
            this.$toast.loading({
              message: '加载中...',
              forbidClick: true
            });
            this.$axios.post(`app/poemlist`, {
              pageSize: this.pageSize, 
              pageNum: this.pageNum})
              .then(response => {
                  this.$toast.clear();
                  if (response.recode === 200 && response.data && 
                  response.data.list) {
                      this.pageNum = response.data.list.length > 0 ? this.pageNum + 1 : this.pageNum;
                      if(response.data.list.length < this.pageSize){
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                      } else {
                        this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                      };
                      let poemlist = this.poemlist || [];
                      this.poemlist = flag === 'pulling down' ? response.data.list : poemlist.concat(response.data.list);
                  } else {
                      // 弹窗提示获取公告列表有误
                    //   this.$refs.scroll.forceUpdate();
                      if (response.recode !== 200) {
                          this.$toast(response.msg);
                      }
                  }
              });
        }
    }
};

</script>

<style lang="less">
  .poemlist_log_wrapper{
    padding:16px;
    .no_order_tips {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 1.5rem;
        color: @grayColor;
        .no_order_img {
            display: inline-block;
            width: .9rem;
            height: .95rem;
            // background: url(../../assets/img/no_order.png) no-repeat;
            background-size: contain;
            margin-bottom: .1rem;
        }
    }
  }
</style>
