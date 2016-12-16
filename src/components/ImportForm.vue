<template>
  <div class="g-overlay">
    <div class="import-form">
       <div class="box-title">导入考生</div>
       <div class="box-row">
          <div class="m-upload">
            <a class="btn btn-grey btn-upload"><i class="fa fa-upload"></i><span>选择文件</span></a>
            <em >{{this.fileObj.name}}</em>
            <input type="file" id="uploadFile" accept="excel/excel" v-on:change="showFileInfo($event)"/>
          </div>
      </div>
      <div class="box-row">
            <a class="btn btn-danger" v-on:click="cancel">返 回</a>
            <a class="btn btn-primary" v-on:click="upload">上 传</a>
      </div>
    </div>
    </div>
</template>

<script>
import api from '../api'

export default {
  data () {
    return {
      fileObj: {}
    }
  },
  mounted () {
    var root = this
    api.getExamInfo(this, resp => {
      root.infos = resp.body[0]
    })
  },
  methods: {
    upload (e) {
      /* eslint-disable no-undef */
      var form = new FormData()
      form.append('file', this.fileObj)
      api.uploadFile(this, form, resp => {
        this.$parent.$parent.showMsg('上传名单成功！')
      }, respErr => {
        this.$parent.$parent.showMsg('上传名单失败！')
      })
    },
    cancel () {
      this.$parent.showImport = false
    },
    showFileInfo (e) {
      this.fileObj = e.target.files[0]
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


  .import-form {
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
  position: relative;
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

#uploadFile {
    position: absolute; 
    left: 50%;
    top: 50%;
    transform:translate(-50%,-50%);
    width:120px; 
    height: 81px; 
    opacity: 0; /* 实现的关键点 */ 
    cursor: pointer;
}

.m-upload {
    flex: 1;
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    background: #f8f8f8;
    padding: 80px;
}
</style>
