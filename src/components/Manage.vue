<template>
  <div class="home">
    <div class="nav">
         <a  v-on:click="editInfo()"><i class="fa fa-print fa-edit"></i> 编辑信息</a>
         <a  v-on:click="imortData()"><i class="fa fa-send"></i> 导入名单</a>
         <a  v-on:click="editProblem()"><i class="fa fa-pencil"></i> 编辑考题</a>
         
         <!-- <a href="http://121.196.218.1:3000/pdf" target = _blank ><i class="fa fa-print fa-fw"></i> 导出PDF</a> -->
          <a v-bind:href="server +'pdf'"  target = _blank ><i class="fa fa-print fa-fw"></i> 导出PDF</a>
          <a  v-on:click="exportExcel()"><i class="fa fa-file fa-fw"></i> 导出Excel</a>
          <div class="sep"></div>
          <div class="info">[ {{$parent.timer.info}} ] -  [ {{$parent.timer.time}} ]</div>
    </div>
    <div  class="box">
      <li  v-for="user of users"  v-on:click="doShow($event)" v-bind:id=user.userid  v-bind:username=user.username   v-bind:class="{'online': (user.online==1), 'exam': (user.online==2), 'finish': (user.online==3), 'cls1': (user.class=='软工161'), 'cls2': (user.class=='软工162')}">
         <em>{{user.username}}</em>
         <div>{{user.userid}}</div>
      </li>
    </div>

    <result-form v-if="show" v-bind:result="result"></result-form>
    <info-form  v-if="showInfo"></info-form>
    <import-form v-if="showImport" ></import-form>
    <problem-form v-if="showProblem" ></problem-form>
  </div>
</template>

<script>
  import api from '../api'
  import ResultForm from './ResultForm'
  import InfoForm from './InfoForm'
  import ImportForm from './ImportForm'
  import ProblemForm from './ProblemForm'

  export default {
    props: ['user'],
    data () {
      return {
        // server: 'http://121.196.218.1:3000/',
        server: 'http://localhost:3000/',
        users: {},
        show: false,
        showInfo: false,
        showImport: false,
        showProblem: false,
        curUser: null,
        result: {
          subs: null,
          user: null,
          score: 0
        }
      }
    },
    components: {
      ResultForm,
      InfoForm,
      ImportForm,
      ProblemForm
    },
    mounted () {
      var root = this
      api.getUserList(this, resp => {
        root.users = resp.body
      })
    },
    methods: {
      doShow (e) {
        var tag = e.currentTarget
        this.curUser = tag.id
        api.getSubjectList(this, tag.id, tag.username, resp => {
          this.show = true
          console.log(resp.body)
          this.result.subs = resp.body
          this.result.user = tag.id
        }, respErr => {
          this.$parent.showMsg('显示结果失败！')
        })
      },
      editInfo () {
        this.showInfo = true
      },
      imortData () {
        this.showImport = true
      },
      editProblem () {
        this.showProblem = true
      },
      exportExcel () {
        api.exportExcel(this, resp => {
          console.log(resp.body)
          window.open('http://localhost:3000/' + resp.body.url)
        }, respErr => {
          this.$parent.showMsg('导出Excel失败！')
        })
      }
    },
    sockets: {
      refresh: function (val) {
        var root = this
        api.getUserList(root, resp => {
          root.users = resp.body
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
li {
  list-style: none;
  width: 100px;
  background: #efefef;
  margin:2px 5px;
  text-align: center;
  color: #333;
  padding-top:2px;
  border: 1px solid #aaa;
  overflow: hidden;
  cursor: pointer;
  height: 70px;
  display: flex;
  flex-direction: column;
}

li:hover {
  border: 1px solid #666;
}

.cls1 {
  background: #ffffdd
}

.cls2 {
  background: #ddddff
}

.online {
  border: 1px solid #ff9900;
  background: #ff9900;
  color: #fff;
}

.finish {
  border: 1px solid #cc3300;
  background: #cc3300;
  color: #fff;
}

.exam {
  border: 1px solid #339933;
  background: #339933;
  color: #fff;
}

li em {
  flex: 1;
   font-style:normal;
   font-weight: 600;
   overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 10px 0
}

li div{
   font-size: 12px;
   /*background: #aaa;*/
   padding: 2px 5px;
   /*color: #999;*/
}

.box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 10px;
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


.nav a{
  padding:5px 20px;
  text-decoration: none;
  cursor: pointer;
  color:#fff;
}

.nav a:hover{
  color: #ff6600;
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



</style>
