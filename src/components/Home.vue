<template>
  <div class="g-home">

    <div class="box">
        <div class="title">考试课程：</div>
        <div class="cont">{{infos.examname}}</div>
    </div>
    <div class="box">
        <div class="title">开始时间：</div>
        <div class="cont">{{infos.starttime}}</div>
    </div>
    <div class="box">
        <div class="title">结束时间：</div>
        <div class="cont">{{infos.endtime}} </div>
    </div>
    <div class="box">
        <div class="title">{{$parent.timer.info}}：</div>
        <div class="cont">{{$parent.timer.time}} </div>
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
        this.startTime()
      }, respErr => {
        console.log('load exam data failure...')
      })
    },
    methods: {
      startTime () {
        setInterval(this.update, 1000)
      },
      update () {
        this.$parent.timer = api.caluTime(this.infos.starttime, this.infos.endtime)
        if ((this.$parent.timer.type === 1) && (this.$parent.isLogin) && (this.$parent.user !== 'admin')) {
          this.$parent.timer.type = 3
          this.$router.push('exam')
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.g-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding:0;
  padding-top: 100px;
}

.box {
  display: flex;
  flex-direction: row;
  width: 600px;
}

.g-home .title {
  width: 150px;
  font: 24px/1.5 "Microsoft yahei";
  font-weight: 600;
  color: #000;
  text-align: right
}

.cont{
  flex: 1;
  font: 24px/1.5 "Microsoft yahei";
  font-weight: 600;
  color: #666;
}

</style>
