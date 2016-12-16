<template>
    <div class="g-result">
      <div class="g-hd">
        <div class="m-title">
          考生学号： {{result.user}}
        </div>
        <div class="m-score" ><span  v-if="this.$parent.user == 'admin'">{{score}}</span></div>
        <div class="m-fun">
          <a href="javascript:void(0);" v-if="this.$parent.user == 'admin'" @click="save()"><i class="fa fa-save fa-fw"></i> 保存</a>
          <a href="javascript:void(0);" @click="close()"><i class="fa fa-close fa-fw"></i> 关 闭</a>
        </div>
        
      </div>
      <div class="g-bd">
        <div class="m-result" v-for="sub of result.subs">
          <div class="m-hd">
            <div class="index">{{sub.subIndex}}</div>
            <div class="title" v-html="sub.subContent"></div>
            <div class="m-mark" v-if="$parent.user == 'admin'"  >
              <input type="text" class="form-control  text-center"  v-model="sub.mark" @keyup="caluScore()">
            </div>
          </div>
          <pre>
            <code class="hljs cpp" v-html="sub.html">
            </code>
          </pre>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import api from '../api'
import '../../node_modules/highlightjs/styles/default.css'

export default {
  props: ['result'],
  data () {
    return {
      score: 0
    }
  },
  mounted () {
    this.caluScore()
  },
  methods: {
    close () {
      this.$parent.show = false
    },
    save () {
      console.log(this.$parent.curUser)
      api.saveExam(this, this.$parent.curUser, this.result.subs, this.result.score, resp => {
        this.$parent.$parent.showMsg(resp.body.msg)
      }, respErr => {
        this.$parent.showMsg('保存考卷失败！')
      })
    },
    caluScore () {
      this.score = 0
      for (var i = 0; i < this.result.subs.length; i++) {
        (this.result.subs[i].mark === '') ? (this.result.subs[i].mark = 0) : ''
        this.score += parseInt(this.result.subs[i].mark)
      }
      this.score = Math.round(this.score / this.result.subs.length)
      this.result.score = this.score
    }
  }
}
</script>

<style scoped>

 .g-result {
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
 }

 .g-hd {
  display: flex;
  flex-direction: row;
  align-items: center;
  background: #666;
  width: 100%;
  padding-left: 20px;
  padding-right: 20px;
  color: #fff;
  font: 24px/1 "microsoft yahei";
  border-bottom: 1px solid #c9c9c9;
  min-height: 80px;
 }

 .g-bd {
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 10px;
  font-size: 16px;
  overflow-y: scroll;
  padding: 10px 50px; 
 }


 .m-score {
  flex: 1;
  text-align: center;
  font-size: 48px;
  color: #ff9900;
  font-weight: 600;
 }

 .m-hd {
  display: flex;
  position: relative;
  flex-direction: row;
  padding: 0px 0 5px 10px;
 }

.m-result .title {
    flex: 1;
    font-size: 16px;
    font-weight: 600;
    color: #666;
/*    display: flex;
    align-items: center;*/
 }

.m-hd .index {
    position: absolute;
    top: 20px;
    left: -24px;
    background: #ff6600;
    width: 24px;
    height: 24px;
    border-radius: 12px;
    color: #666;
    text-align: center;
    line-height: 1.5;
    font-family: "microsoft yahei";
    color: #fff;
/*    display: flex;
    align-items: center;*/
    }

 .m-result .m-mark {
    width: 150px;
    display: flex;
    flex-direction: row-reverse;
    font:16px/1 "microsoft yahei";
 }

  .m-result .m-mark:after {
    content: "得分 : ";
    margin: 2px 5px;
    font-size: 24px;
    color: #41B883;
 }

 .m-mark input {
  color: #ff3300;
  font-size: 24px;
  font-weight: 600;
  width: 60px;
  border-radius: 0;
  border: none;
  border-bottom: 3px solid #999;
  outline: none;
  background: #fff;
  box-shadow: none
 }

 .result textarea {
  width: 100%;
  background: #fff;
  padding: 10px 15px;
  outline: none;
  border: none;
  border-top: 1px solid #ccc;
 }

 a {
    display: inline-block;
    background: #41B883;
    padding: 5px 20px;
    color: #fff;
    font-weight: 600;
    font: 14px/1 "microsoft yahei";
    text-decoration: none;
    margin-right: 20px;
}

a:hover {
  background: #41C883;
  color: #fff;
  text-decoration: none;
}
</style>
