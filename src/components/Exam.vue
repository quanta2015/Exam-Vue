<template>
  <div class="exam">
      <div class="nav">
          <a href="javascript:void(0);" v-if="(!start)&&($parent.online!=='3')" @click="startExam()"><i class="fa fa-play fa-fw"></i> 开始考试</a>
          <a href="javascript:void(0);"  v-if="($parent.online!=='3')"  @click="saveExam()"><i class="fa fa-save fa-fw"></i> 保存考卷</a>
          <a href="javascript:void(0);" v-if="($parent.online!=='3')" @click="submitExam()"><i class="fa fa-eject fa-fw"></i> 提交考卷</a>
          <a href="javascript:void(0);" @click="showResult()"><i class="fa fa-book fa-fw"></i> 查看答卷</a>
          <div class="sep"></div>
          <div class="info">[ {{$parent.timer.info}} ] -  [ {{$parent.timer.time}} ]</div>
      </div>
      <div class="box" v-if="start">
          <div class="box-list">
            <li  v-for="sub of subs" v-on:click="doShowSub($event)" v-bind:id = "sub.subIndex">
              <div>{{sub.subIndex}}</div>
            </li>
          </div>
          <div class="box-content">
            <div class="sub-title">
                <div class="s-index">{{subs[index].subIndex}}</div>
                <div class="s-title"  v-html="subs[index].subContent"></div>
            </div>
            <div class="sub-result">
              <textarea v-model="subs[index].result"></textarea>
            </div>
          </div>
      </div>

    <result-form v-if="show" v-bind:result="result"></result-form>
  </div>
</template>

<script>
  import api from '../api'
  import ResultForm from './ResultForm'
  // import autosize from '../../node_modules/autosize/dist/autosize.js'

  export default {
    data () {
      return {
        subs: {},
        index: 0,
        timer: null,
        start: false,
        show: false,
        result: {
          subs: null,
          user: null
        }
      }
    },
    components: {
      ResultForm
    },
    mounted () {
      // autosize(document.querySelectorAll('textarea'))
      var root = this
      api.getSubjectList(this, this.$parent.user, resp => {
        root.subs = resp.body
      }, respErr => {
        console.log('load user data failure...')
      })
    },
    methods: {
      startExam (e) {
        this.start = true
        this.timer = setInterval(this.saveExam, 60000)
        api.startExam(this, this.$parent.user, resp => {
          this.$parent.showMsg(resp.body.msg)
        }, respErr => {
          this.$parent.showMsg('开始考试出错！')
        })
      },
      doShowSub (e) {
        var tag = e.currentTarget
        console.log(tag.id)
        this.index = parseInt(tag.id) - 1
        // autosize(document.querySelectorAll('textarea'))
      },
      saveExam () {
        api.saveExam(this, this.$parent.user, this.subs, 0, resp => {
          this.$parent.showMsg(resp.body.msg)
        }, respErr => {
          this.$parent.showMsg('保存考卷失败！')
        })
      },
      submitExam () {
        api.submitExam(this, this.$parent.user, this.subs, resp => {
          this.$parent.showMsg(resp.body.msg)
          this.$parent.online = '3'
          clearInterval(this.timer)
        }, respErr => {
          this.$parent.showMsg('提交考卷失败！')
        })
      },
      showResult () {
        api.getSubjectList(this, this.$parent.user, resp => {
          this.show = true
          this.result.subs = resp.body
          this.result.user = this.$parent.user
        }, respErr => {
          this.$parent.showMsg('显示结果失败！')
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


.exam {
  display: flex;
  flex-direction: column;
  padding: 0;
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
}

.nav {
  display: flex;
  flex-direction: row;
  padding: 10px;
  background: #494949;
  min-height: 45px;
}

.nav .sep {
  flex: 1;
}

.nav .info {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.box {
  width: 100%;
  display: flex;
  flex-direction: row;
  height: 100vh;
  background: #f9f9f9;
}

.box-list {
  width: 50px;
  background: #eee;
}

li {
  list-style: none;
  padding: 10px; 
  text-align: center;
  margin:5px;
  background: #666;
  color: #fff;
  cursor: pointer;
}

li:hover {
  background: #999;
}

.box-content {
  display: flex;
  flex-direction: column;
  flex: 1;
  border: 1px solid #ccc;
  padding: 10px 20px;
}

.sub-title {
  display: flex;
  flex-direction: row;
}

.sub-title .s-index {
font-size: 32px;
    line-height: 1.2;
    background: #ff6600;
    padding: 5px;
    width: 48px;
    min-width: 48px;
    height: 48px;
    color: #fff;
    text-align: center;
    margin-right: 10px;
    border-radius: 24px;
    font-weight: 600;
}

.sub-title .s-title {
    font-size: 24px;
    color: #666;
    font-weight: 600;
    padding-top: 18px;
    padding-left: 10px;
}

.sub-result {
  flex: 1;
  margin-top: 10px;
}

.sub-result textarea{
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  outline: none;
  padding: 10px;
}

</style>
