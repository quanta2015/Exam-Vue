<template>
  <div class="exam">
    <div class="nav">
        <a href="javascript:void(0);"><i class="fa fa-play fa-fw"></i> 开始考试</a>
        <a href="javascript:void(0);"><i class="fa fa-save fa-fw"></i> 保存考卷</a>
        <a href="javascript:void(0);"><i class="fa fa-eject fa-fw"></i> 提交考卷</a>
    </div>
    <div class="box">
      <div class="box-list">
        <li  v-for="sub of subs" v-on:click="doShowSub($event)" v-bind:id = "sub.subIndex">
          <div>{{sub.subIndex}}</div>
        </li>
      </div>
      <div class="box-content">
        <div class="sub-title">
            <div class="s-index">{{sub.subIndex}}</div>
            <div class="s-title"  v-html="sub.subContent"></div>
        </div>
        <div class="sub-result">
          <textarea v-bind:value="sub.result"></textarea>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
  import api from '../api'

  export default {
    data () {
      return {
        subs: {},
        sub: '',
        timer: ''
      }
    },
    mounted () {
      var root = this
      api.getSubjectList(this, resp => {
        root.subs = resp.body
      }, respErr => {
        console.log('load user data failure...')
      })
    },
    methods: {
      doShowSub (e) {
        var tag = e.currentTarget
        console.log(tag.id)
        this.sub = this.subs[tag.id - 1]
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
  background: #000;
  min-height: 30px;
}

.box {
  width: 100%;
  display: flex;
  flex-direction: row;
  height: 100vh;
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
  background: #fff;
  display: flex;
  flex-direction: row;
}

.sub-title .s-index {
  font-size: 16px;
  line-height: 1;
  background: #ff6600;
  padding: 5px;
  width: 24px;
  min-width: 24px;
  height: 24px;
  color: #fff;
  text-align: center;
  margin-right: 10px;
  border-radius: 16px;
  font-weight: 600;
}

.sub-title .s-title {
  font-size: 18px;
  color:#000;
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
