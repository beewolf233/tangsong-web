<template>
  <div class="poemwrite-container">
    <div v-if="!poem">
      诗歌不存在
    </div>
    <div v-else class="poemwrite-box">
      <div class="poemwrite-innerbox">
        <div class="poem-titleauther">
          <div class="poem-title">
            {{ poem.traditionTitle }}
          </div>
          <div class="poem-autherbox">
            <span>【{{ poem.traditionBook }}】</span>
            <span class="poem-auther">{{ poem.traditionAuther}}</span>
          </div>
        </div>
        <div class="poem-content">
          <span class="poem-content1">{{ poem.traditionContent }}</span>
          <span class="poem-content2">{{ poem.traditionContent.substring(0, startIndex) }}</span>
        </div>
      </div>
      <div class="poemwrite-wenzi-box">
        <div class="poemwrite-wenzi-inner">
          <div v-if="wenziNow" @touchend="goNextBihua">
            <img :src="wenziNow.backpic[0].url"  class="poemwrite-wenzi-back">
            <img 
              :src="item.url"
              class="poemwrite-wenzi-bihua"
              :class="{writed: writeIndex>index, writing: writeIndex===index, notwrite: writeIndex<index}"
              v-for="(item, index) in wenziNow.pic"
              :key="index"
            >
          </div>
          
        </div>
      </div>
    </div>
    
    <div class="poem-trangle" v-if="poem&&poemState==='list'">
      <div class="poem-trangle-btn poem-trangle-up" @click="getPoem('up')">
      </div>
      <div class="poem-trangle-btn poem-trangle-next" @click="getPoem('down')">
      </div>
    </div>
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
          apiName: '',
          startIndex: 1,
          nextIndex: 2,
          wenziNow: null,
          wenziNext: null,
          writeIndex: 0,
          poemend: false
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
      // 获取文字
      if (this.poem) {
        this.checkWenzi();
      }
  },
  methods: {
    goNextBihua() {
      this.writeIndex = this.writeIndex + 1;
      if (this.writeIndex >= this.wenziNow.pic.length) {
         console.log('该下个字了')
         if (this.wenziNext) {
           this.writeIndex = 0;
           this.wenziNow = this.wenziNext;
           this.startIndex = this.nextIndex;
           this.nextIndex = this.nextIndex + 1;
           this.checkWenziNext();
         }
      }
    },
      checkWenzi() { 
        let getStr = this.poem.traditionContent[this.startIndex - 1];
        let reg = /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/g;
        if (reg.test(getStr)) {
          this.getWenzi(getStr, (data) => {
            this.wenziNow = data;
          });
          this.checkWenziNext();
        } else {
          this.checkWenziNext('fugai');
        }
      },
      checkWenziNext(state) {
        let nextIndex = this.nextIndex;
        let getStr = this.poem.traditionContent[nextIndex - 1];
        let reg = /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/g;
        if (reg.test(getStr)) {
          // 是中文
          this.getWenzi(getStr, (data) => {
            if (state === 'fugai') {
                this.wenziNow = data;
                this.startIndex = nextIndex;
                this.nextIndex = nextIndex + 1;
                this.checkWenziNext();
            } else {
                this.nextIndex = nextIndex;
                this.wenziNext = data;
            }
            
          });
        } else {
          console.log(this.poem.traditionContent.length, this.nextIndex)
          if (this.poem.traditionContent.length <= this.nextIndex) {
            console.log('诗歌结束了')
            this.wenziNext = null;
            this.poemend = true;
          } else {
            this.nextIndex = this.nextIndex + 1;
            this.checkWenziNext();
          }
        }
      },
      getWenzi(wenzi, callback) {
        this.$axios.post('app/wenziSearch', {
          traditionname: wenzi
        })
        .then((res) => {
          let {recode, data, msg} = res;
          if (recode === 200) {
              if (callback) {
                data.pic = JSON.parse(data.pic);
                data.backpic = JSON.parse(data.backpic);
                callback(data)
              }
          } else {
            this.$toast.fail(msg);
          }
        })
        .catch((e) => {
        })
      },
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
.poemwrite-container{
  height: 100%;
  .poemwrite-box{
    width: 100%;
    height: 100%;
    max-height: 100%;
    // position: relative;
    background: #fff;
    box-sizing: border-box;
    padding-bottom: 280px;
    .poemwrite-innerbox {
      width: 100%;
      height: calc(100% - 280px);
      position: relative;
      // padding-bottom: 280px;
      overflow: auto;
      padding: 20px;
      box-sizing: border-box;
      writing-mode: vertical-rl;/*从左向右 从右向左是 writing-mode: vertical-rl;*/  
      writing-mode: tb-lr;/*IE浏览器的从左向右 从右向左是 writing-mode: tb-rl；*/  
    }
    .poem-titleauther{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .poem-title{
      padding-top: 20px;
      font-size: 20px;
      text-align: center;
      font-weight: bold;
    }
    .poem-autherbox{
      // margin-top: 30px;
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
      font-size: 22px;
      line-height: 34px;
      width: 343px;
      margin: 0 auto;
      // border-top: 2px solid @goldColor;
      // border-bottom: 2px solid @goldColor;
      padding: 30px 20px;
      position: relative;
     .poem-content1{
       color: #999;
     }
     .poem-content2{
       position: absolute;
       top: 30px;
       right: 20px;
       bottom: 30px;
       color: black;
      //  font-weight: bold;
     }
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
  .poemwrite-wenzi-box{
    position: absolute;
    height: 280px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f5f1e6;
    background-image: url(~assets/img/texture.png);
    .poemwrite-wenzi-inner{
      width: 240px;
      height: 240px;
      border: 2px solid @goldColor;
      box-sizing: border-box;
      margin: 0 auto;
      margin-top: 20px;
      position: relative;
      .poemwrite-wenzi-back{
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1;
        opacity: .8;
      }
      .poemwrite-wenzi-bihua{
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 2;
        &.notwrite{
          display: none;
        }
        &.writed{
          display: block;
          opacity: 1;
        }
        &.writing{
          display: block;
          opacity: .6;
        }
      }
      img{
        width: 100%;
        height: 100%;
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
