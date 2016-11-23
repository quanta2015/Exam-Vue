<template>
  <div class="home">
    <div  class="box">
      <li  v-for="user of users"  v-on:click="doShow($event)" v-bind:id=user.userid  v-bind:class="(user.online == 1)?'online':''">
         <em>{{user.username}}</em>
         <div>{{user.userid}}</div>
      </li>
    </div>
  </div>
</template>

<script>
  import api from '../api'

  export default {
    props: ['user'],
    data () {
      return {
        users: {}
      }
    },
    mounted () {
      var root = this

      api.getUserList(this, resp => {
        root.users = resp.body
      }, respErr => {
        console.log('load user data failure...')
      })
    },
    methods: {
      doShow (e) {
        var tag = e.currentTarget
        console.log(tag.id)
        this.$socket.emit('msg', tag.id)
      }
    },
    sockets: {
      connect: function () {
        console.log('socket connected')
      },
      msg: function (val) {
        console.log(val)
      },
      login: function (val) {
        console.log('set login mark' + val)
        for (var i = 0; i < this.users.length; i++) {
          if (this.users[i].userid === val) {
            this.users[i].online = 1
          }
        }
      }
    },
    watch: {
      'user': function (val, oldVal) {
        if (val !== null) {
          this.$socket.emit('login', val)
        }
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

.online {
  border: 1px solid #ff6600;
  background: #ff6600;
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


</style>
