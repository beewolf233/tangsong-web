<template>
  <div class="poem-info">
    <div
      class="poem-item"
      v-for="(item, index) in poemList"
      :key="index"
      @click="goPoemDetail(item, index)">
      <div class="icon-yinhao"></div>
      <div class="poem-one">
        {{item.content}}
        <div class="poem-user">
          <span>{{item.title}}</span><span>{{item.auther}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
      poemList: {
          type: Array,
          default: []
      },
      poemState: {
        type: String,
        default: 'single'
      },
      poemQuery: {
        type: Object,
        default: ()=>{}
      }
  },
  data(){
      return {

      }
  },
  created () {
  },
  methods: {
      goPoemDetail(item, index){
        let { poemState, poemQuery } = this;
        if (poemState === 'single') {
          this.$router.push({ path: `/poemdetail`,query: { poemState, id: item._id }})
        } else {
          this.$router.push({ path: `/poemdetail`,query: Object.assign({},
          { poemState, index: index+1 }, this.poemQuery)})
        }
      }
  }
}
</script>

<style lang="less" scoped>
.poem-info{
  width: 100%;
  background-color: #ffffff;
  box-shadow:0px 2px 12px 0px rgba(226,226,226,0.5);
  box-sizing: border-box;
  padding: 20px 15px;
  .icon-yinhao{
    width: 16px;
    height: 16px;
    background: url(~assets/img/icon_yinhao@3x.png) no-repeat center center;
    background-size: contain;
    margin-bottom: 16px;
  }
  .poem-item{
    padding-top: 20px;
    border-top: 1px solid @primaryColor;
  }
  .poem-item:first-child{
    padding-top: 0;
    border: none;
  }
  .poem-one{
    font-size: 13px;
    line-height: 24px;
    // color: @grayColor;
    .poem-user{
      margin: 15px 0;
      text-align: right;
      span:first-child{
        font-size: 14px;
        font-weight: normal;
        margin-right: 10px;
      }
      span:first-child + span{
        font-size: 14px;
        color: @primaryColor;
        font-weight: normal;
      }
    }
  }
}
</style>
