<template>
  <div class="home-container">
    <div>
      <div class="header flex-one">
        <img class="header-hometitle" src="../assets/img/home_header_title@3x.png" alt="">
        <span class="app-icon app-icon-search"></span>
      </div>
      <div class="app-container20">
        <div class="home-banner">
          <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item
              v-for="(item, index) in banner"
              :key="index">
              <img :src="item.url" alt="">
            </van-swipe-item>
          </van-swipe>
          <!-- <img src="../assets/img/banner@3x.png" alt=""> -->
        </div>
        <!-- 每日推荐 -->
        <div class="app-title">
          <img src="../assets/img/dayintro@3x.png" alt="">
        </div>
        <div class="dayinfo-box"
          v-for="(item, index) in poemDay" 
          @click="goPoemDetail(item)"
          :key="index">
            <div class="dayinfo-one">
              <div class="dayinfo-title">{{item.title}}</div>
              <div class="dayinfo-user">{{item.auther}}</div>
            </div>
            <div class="poem-line">
            </div>
            <div class="dayinfo-two">
              <div class="dayinfo-content text-overflow2">{{item.content}}</div>
              <div class="dayinfo-go">
                <img src="../assets/img/readpic@3x.png" alt="">
              </div>
            </div>
        </div>
        <!-- 古诗推荐 -->
        <div class="app-title">
          <img src="../assets/img/poems@3x.png" alt="">
          <div class="at-gomore"><nuxt-link :to="{name: 'poemList'}">更多></nuxt-link></div>
        </div>
        <PoemItems :poemList="poemintro"/>
        <!-- 人间词话 -->
         <div class="app-title">
          <img src="../assets/img/qihua@3x.png" alt="">
        </div>
        <div class="qihua">
          <div class="qihua-title">特别企划</div>
          <div class="qihua-info">各种对诗歌的想象从这里开始</div>
          <div class="qihua-pic">
            <img src="../assets/img/qihua1@3x.png" alt="">
            <img src="../assets/img/qihua2@3x.png" alt="">
            <img src="../assets/img/qihua3@3x.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PoemItems from '../components/PoemItems'
export default {
  asyncData (app) {
    return app.$axios.post(`app/home`)
    .then((res) => {
      let {recode, data, msg} = res;
      if (recode === 200) {
        return {
          banner: data.banner,
          poemDay: data.poemDay,
          poemintro: data.poemintro
        }
      } else {
        return {
          banner: [],
          poemDay: [],
          poemintro: []
        }
      }
    })
    .catch((e) => {
      // error({ statusCode: 404, message: 'not found' })
    })
  },
  components: {
    PoemItems
  },
  created () {
  },
  methods: {
    goPoemDetail(item){
      this.$router.push({ path: `/poemdetail`,query: { poemState: 'single', id: item._id }})
    }
  }
}
</script>

<style lang="less">
.home-container {
  margin: 0 auto;
  min-height: 100%;
  .app-title{
    margin-top: 15px;
  }
}
.header{
  height: 60px;
  background: #fff;
  padding: 0 16px;
  box-sizing: border-box;
  justify-content: space-between;
  .header-hometitle{
    height: 24px;
  }
}
.home-banner{
  width: 100%;
  height: 196px;
  img{
    width: 100%;
    height: 100%;
  }
  .my-swipe .van-swipe-item {
    width: 100%;
    height: 196px;
    background-color: transparent;
  }
}
.dayinfo-box {
	width: 100%;
	// height: 119px;
  background-color: #ffffff;
  box-shadow:0px 2px 12px 0px rgba(226,226,226,0.5);
	// box-shadow: 0px 3px 3px 0px 
	// 	rgba(19, 72, 87, 0.11);
  box-sizing: border-box;
  padding: 20px 15px;
  .dayinfo-one{
    .flexOne();
    .dayinfo-title{
      font-size: 16px;
    }
    .dayinfo-user{
      font-size: 13px;
    }
  }
  .poem-line{
    margin-top: 6px;
    margin-bottom: 14px;
  }
  .dayinfo-two{
    .flexOne();
    align-items: flex-end;
    .dayinfo-content{
      font-size: 12px;
      width: 170px;
      margin-bottom: 20px;
      padding-right: 20px;
      background: url(~assets/img/icon_leaf.png) no-repeat 154px bottom;
      background-size: 16px 16px; 
    }
    .dayinfo-go{
      width: 100px;
      img{
        width: 100%;
      }
      // height: 32px;
      // background: url(~assets/img/icon_read@3x.png) no-repeat center center;
      // background-size: contain;
    }
  }
}
.qihua{
  width: 100%;
	height: 310px;
	background-image: linear-gradient(0deg, 
		#144a74 0%, 
    #2486b9 100%);
  margin-bottom: 20px;
  border-radius: 5px;
  color: #fff;
  text-align: center;
  box-sizing: border-box;
  padding: 20px 20px;
  .qihua-title{
    font-size: 18px;
  }
  .qihua-info{
    font-size: 12px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .qihua-pic{
    width: 100%;
    overflow: scroll;
    display: flex;
    flex-wrap: nowrap; 
    margin-top: 20px;
    img{
      width: 125px;
      height: 185px;
      margin-right: 15px;
    }
  }
}
</style>
