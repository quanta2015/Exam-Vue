<template>
  <transition name="slide">
    <div class="notification success"  v-if="show" >
      <div class="content">
        {{msg}}
      </div>
    </div>
   </transition>
</template>

<script>
export default {
  data () {
    return {
      count: 2,
      timer: null
    }
  },
  props: ['show', 'msg'],
  methods: {
    update () {
      this.count--
      if (this.count <= 0) {
        this.$parent.showNotifications = false
        this.count = 2
        clearInterval(this.timer)
      }
    }
  },
  watch: {
    show (curVal, oldVal) {
      if (curVal) {
        this.timer = setInterval(this.update, 1000)
      }
    }
  }
}
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: opacity .8s
}
.slide-enter, .slide-leave-active {
  opacity: 0
}
  
  .notification {
    margin: 10px;
    z-index: 3;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    color: #fff;
    opacity:0.8;
    box-shadow: 0 0 12px #999;
    border-radius: 3px;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADsSURBVEhLY2AYBfQMgf///3P8+/evAIgvA/FsIF+BavYDDWMBGroaSMMBiE8VC7AZDrIFaMFnii3AZTjUgsUUWUDA8OdAH6iQbQEhw4HyGsPEcKBXBIC4ARhex4G4BsjmweU1soIFaGg/WtoFZRIZdEvIMhxkCCjXIVsATV6gFGACs4Rsw0EGgIIH3QJYJgHSARQZDrWAB+jawzgs+Q2UO49D7jnRSRGoEFRILcdmEMWGI0cm0JJ2QpYA1RDvcmzJEWhABhD/pqrL0S0CWuABKgnRki9lLseS7g2AlqwHWQSKH4oKLrILpRGhEQCw2LiRUIa4lwAAAABJRU5ErkJggg==") !important;
    background-position: 15px center;
    background-repeat: no-repeat;
  }
  .notification .content {
    padding: .75rem 2rem;
    font: 24px/1.5 "microsoft yahei";
    margin-left: 36px;
  }

.success {
  background-color: #51a351;
  background-color: 
}
.error {
  background-color: #bd362f;
}
.info {
  background-color: #2f96b4;
}
.warning {
  background-color: #f89406;
}
</style>