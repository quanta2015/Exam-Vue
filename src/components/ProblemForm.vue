<template>
<div class="g-overlay">
    <div class="problem-form">
        <div class="m-bar">
            <a class="btn btn-primary" v-on:click="add()">新增</a>
            <a class="btn btn-primary" v-on:click="edit()" v-if="!isEdit">修改</a>
            <a class="btn btn-primary" v-on:click="save()" v-if="isEdit">保存</a>
            <a class="btn btn-danger" v-on:click="cancel">返 回</a>
        </div>
        <div class="box">
            <li  v-for="sub in infos" v-bind:id = "sub.subIndex">
            <div class="box-title">
                <div class="id" v-if="!isEdit">{{sub.subIndex}}</div>
                <div  v-if="isEdit"><input type="text" v-model="sub.subIndex"></div>
                <div class="sep"></div>
                <div class="fun">
                    <!-- <a class="btn btn-primary" v-on:click="del()">删除</a> -->
                </div>
            </div>
            <div class="box-problem" v-html="sub.subContent" v-if="!isEdit"></div>
            <textarea class="box-problem" v-model="datas[sub.subIndex-1]" v-if="isEdit"></textarea>
        </li>
        </div>
    </div>
</div>
</template>

<script>
import api from '../api'
import Remarkable from 'remarkable'
// import autosize from '../../node_modules/autosize/dist/autosize.js'

export default {
  data () {
    return {
      infos: {},
      datas: [],
      index: 0,
      isEdit: false
    }
  },
  mounted () {
    // autosize(document.querySelectorAll('textarea'))
    var root = this
    api.getProblemInfo(this, resp => {
      root.infos = resp.body
      for (var i = 0; i < root.infos.length; i++) {
        root.datas.push(root.infos[i].subContent)
      }
    })
  },
  methods: {
    cancel () {
      this.$parent.showProblem = false
    },
    doShowSub (e) {
      var tag = e.currentTarget
      console.log(tag.id)
      this.index = parseInt(tag.id) - 1
    },
    edit () {
      this.isEdit = true
    },
    save () {
      this.isEdit = false
      for (var i = 0; i < this.datas.length; i++) {
        var md = new Remarkable()
        this.infos[i].subContent = md.render(this.datas[i])
      }
      api.saveProblems(this, this.infos, resp => {
        console.log(resp.body)
      })
    },
    add () {
      var len = this.infos.length + 1
      this.infos.push({'examid': '20160001', 'subContent': '', 'subIndex': len})
    }
  }
}
</script>

<style scoped>

.m-bar{
  background: #666;
  padding: 10px 15px;
}

.m-bar a{
  margin: 0 5px;
}

.box-problem {
  width: 100%;
  flex: 1
}

.box {
  padding: 15px;
}

.box-title {
  display: flex;
  flex-direction: row;
  padding: 10px 0;
  min-height: 40px;
  border-bottom: 1px dashed #ddd;
}

.box-title input {
  border:none;
  border-bottom: 2px solid #666;
  text-align: center;
  width: 60px;
  outline: none;
  color: #ff3300;
  font-weight: 600;
}

.box-title>.id {
  width: 36px;
  height: 36px;
  background: #ff3300;
  color: #fff;
  border-radius: 3px;
}

.box-title>.sep {
  flex: 1
}

  .problem-form li {
  list-style: none;
  margin: 5px 0 20px 0;
  width: 100%;
  height: 100%;
  /*border-bottom: 1px dashed #c8c8c8;*/
  padding: 0 0 20px 0;
}

.problem-form textarea{
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  outline: none;
  padding: 10px;
  min-height: 200px;
}

  .g-overlay {
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f9f9f9;
    overflow: scroll;
  }


  .problem-form {
    margin-top: 10px;
    width: 800px;
    height: 100vh;
    box-shadow: 0 2px 3px rgba(0, 0, 0, .05);
    background-color: #fff;
    border: 1px solid #eee;
    display: flex;
    flex-direction: column;
  }
  

</style>
