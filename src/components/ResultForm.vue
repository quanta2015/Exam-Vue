<template>
    <div class="g-result">
      <div class="g-hd">
        <div class="m-title">
          考生学号： {{result.user}}
        </div>
        <div class="m-fun">
          <a href="javascript:void(0);" @click="close()"><i class="fa fa-close fa-fw"></i> 关 闭</a>
        </div>
        
      </div>
      <div class="g-bd">
        <div class="m-result" v-for="sub of result.subs">
          <div class="title" >
            {{sub.subIndex}}. {{sub.subContent}}
          </div>
          <div class="result">
            <textarea readonly="readonly" v-model="sub.result"></textarea>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import autosize from '../../node_modules/autosize/dist/autosize.js'

export default {
  props: ['result'],
  data () {
    return {
    }
  },
  mounted () {
    autosize(document.querySelectorAll('.g-result textarea'))
  },
  methods: {
    close () {
      this.$parent.show = false
    }
  }
}
</script>

<style scoped>
.g-fd {
  width: 100%;
  height: 48px;
  background: #fff;
  display: flex;
  flex-direction: row-reverse;
  padding: 10px;
}
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
    overflow: scroll;
 }

 .g-hd {
  display: flex;
  flex-direction: row;
  background: #666;
  width: 100%;
  padding: 15px 20px;
  color: #fff;
  font: 24px/1 "microsoft yahei";
  border-bottom: 1px solid #c9c9c9;
  min-height: 60px;
 }

 .g-bd {
  display: flex;
  flex-direction: column;
  background: #fff;
  padding: 10px;
  font-size: 16px;
 }

 .m-title {
  flex: 1;
 }

.m-result .title {
    font-size: 16px;
    font-weight: 600;
    padding: 20px 10px 5px 10px;
    color: #666;
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
