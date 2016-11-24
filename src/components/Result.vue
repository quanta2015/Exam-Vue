<template>
  <div class="result">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.result {
  height: 100%;
}
</style>
