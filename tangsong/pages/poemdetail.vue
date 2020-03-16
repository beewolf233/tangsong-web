<template>
  <div class="poemdetail-container">
    <div v-if="!poem">
      诗歌不存在
    </div>
    <div v-else class="poemdetail-box">
      <div class="poem-title">
        {{ poem.title }}
      </div>
      <div class="poem-autherbox">
        <span>{{ poem.book }}</span>
        <span class="poem-auther">{{ poem.auther}}</span>
      </div>
      <div class="poem-content">
       <span>{{ poem.content }}</span>
      </div>
      <div class="pome-des">
        <p><span>注释</span>{{ poem.descript}}</p>
      </div>
    </div>
    <div class="poem-trangle" v-if="poem&&poemState==='list'">
      <div class="poem-trangle-btn poem-trangle-up" @click="getPoem('up')">
      </div>
      <div class="poem-trangle-btn poem-trangle-next" @click="getPoem('down')">
      </div>
    </div>
    <!-- {{poem.title}} -->
  </div>
</template>

<script>
export default {
    asyncData (app) {
      let { query} = app;
      let apiName = '';
      let params = '';
      let poemState = query.poemState;
      if (query.poemState === 'single'){
        apiName = 'app/poemdetail';
        params = {
          id: query.id
        };
      } else {
        apiName = 'app/poemlist';
        params = {
          pageNum: query.index,
          pageSize: 1
        };
      }
      return app.$axios.post(apiName, params)
      .then((res) => {
        let {recode, data, msg} = res;
        if (recode === 200) {
          if (query.poemState === 'single'){
            return {
              poem: data,
              poemState
            }
          } else {
            return {
              poem: data.list[0],
              total: data.count,
              poemState
            }
          }
        } else {
          return {
            poem: null
          }
        }
      })
      .catch((e) => {
        // error({ statusCode: 404, message: 'not found' })
      })
    },
    data(){
        return {
          params: {},
          apiName: ''
        }
    },
  created () {
    let query = this.$route.query;
    let apiName = '';
      let params = '';
      if (query.poemState === 'single'){
        apiName = 'app/poemdetail';
        params = {
          id: query.id
        };
      } else {
        apiName = 'app/poemlist';
        params = {
          pageNum: query.index,
          pageSize: 1
        };
      };
      this.apiName = apiName;
      this.params = params;
  },
  methods: {
      getPoem(state){
        let pageNum = this.params.pageNum;
        let pageNumBefore = this.params.pageNum;
        if (state === 'up') {
          pageNum --;
          if(pageNum === 0){
            this.$toast.fail('已经是第一个了');
            return;
          }
        } else {
          if(pageNum === this.total){
            this.$toast.fail('已经是最后一个了');
            return;
          }
          pageNum ++;
        };
        this.params.pageNum = pageNum;
        this.$toast.loading({
            message: '加载中...',
            forbidClick: true
        });
        // this.params= Object.assign({}, this.params, pageNum);
        this.$axios.post(this.apiName, this.params)
        .then((res) => {
          this.$toast.clear();
          let {recode, data, msg} = res;
          if (recode === 200) {
              this.poem = data.list[0];
              this.total = data.count;
          } else {
            this.$toast.fail(msg);
            this.params.pageNum = pageNumBefore;
          }
        })
        .catch((e) => {
          this.$toast.clear();
          // error({ statusCode: 404, message: 'not found' })
        })
      }
  }
}
</script>

<style lang="less">
.poemdetail-container{
  height: 100%;
  .poemdetail-box{
    width: 100%;
    min-height: 100%;
    background: #fff;
    .poem-title{
      padding-top: 20px;
      font-size: 20px;
      text-align: center;
      font-weight: bold;
    }
    .poem-autherbox{
      margin-top: 30px;
      font-size: 16px;
      text-align: center;
      margin-bottom: 30px;
      .poem-auther{
        margin-left: 10px;
        color: @primaryColor;
        font-weight: bold;
      }
    }
    .poem-content{
      font-size: 18px;
      line-height: 34px;
      width: 343px;
      margin: 0 auto;
      border-top: 2px solid @goldColor;
      border-bottom: 2px solid @goldColor;
      padding: 30px 20px;
      background-color: #f5f1e6;
      background-image: url(~assets/img/texture.png);
    }
    .pome-des{
      font-size: 18px;
      line-height: 34px;
      width: 343px;
      margin: 0 auto;
      padding: 20px;
      margin-top: 10px;
      span{
        color: @primaryColor;
        font-weight: bold;
        margin-right: 15px;
      }
    }
  }
  .poem-trangle{
    position: fixed;
    bottom: 30px;
    right: 30px;
    .poem-trangle-btn{
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: url(~assets/img/icon_gonext.png) no-repeat center center @primaryColor;
      background-size: 16px 16px; 
      color: @goldColor;
      font-size: 12px;
      margin: 10px 0;
    }
    .poem-trangle-up{
      transform:rotate(180deg);
    }
  }
}
</style>
