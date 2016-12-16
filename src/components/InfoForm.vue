<template>
  <div class="g-overlay">
    <div class="info-form">
       <div class="box-title">管理考试信息</div>
       <div class="box-row">
          <div class="m-tl">考试科目： </div>
            <div class="m-ct">
                <input type="text" class="form-control  text-center" v-model="infos.examname">
            </div>
      </div>
      <div class="box-row">
          <div class="m-tl">考试日期： </div>
            <div class="m-ct">
                <input type="text" class="form-control  text-center" v-model="infos.examdate">
            </div>
      </div>
      <div class="box-row">
          <div class="m-tl">开始时间： </div>
            <div class="m-ct">
                <input type="text" class="form-control  text-center" v-model="infos.starttime">
            </div>
      </div>
      <div class="box-row">
          <div class="m-tl">开始时间： </div>
            <div class="m-ct">
                <input type="text" class="form-control  text-center" v-model="infos.endtime">
            </div>
      </div>
      <div class="box-row">
            <a class="btn btn-danger" v-on:click="cancel">返 回</a>
            <a class="btn btn-primary" v-on:click="save">保 存</a>
      </div>
    </div>
    </div>
</template>

<script>
import api from '../api'

export default {
  data () {
    return {
      infos: {}
    }
  },
  mounted () {
    var root = this
    api.getExamInfo(this, resp => {
      root.infos = resp.body[0]
    }, respErr => {
      console.log('load exam data failure...')
    })
  },
  methods: {
    save (e) {
      var root = this
      api.saveExamInfo(this, this.infos, resp => {
        root.$parent.$parent.showMsg('保存考试信息成功！')
      }, respErr => {
        root.$parent.$parent.showMsg('保存考试信息失败！')
      })
    },
    cancel () {
      this.$parent.showInfo = false
    }
  }
}
</script>

<style>
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
  }


  .info-form {
    margin-top: 100px;
    width: 600px;
    box-shadow: 0 2px 3px rgba(0, 0, 0, .05);
    background-color: #fff;
    border: 1px solid #eee;
    padding: 15px;
    display: flex;
    flex-direction: column;
  }
  
.box-title {
  font: 20px/1.5 "microsoft yahei";
  text-align: center;
  color: #337ab7;
}

.box-row {
  display: flex;
  flex-direction: row;
  padding: 10px 5px;
  justify-content: center;
}

.box-row .btn {
  width: 120px;
  margin-right: 10px;
}

.m-tl {
  width: 100px;
  min-width: 100px;
  text-align: right;
  padding: 5px;
}

.m-ct {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

</style>
