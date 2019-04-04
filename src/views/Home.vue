<template>
  <div class="home">
      <transition appear  name="fadeUp" mode="out-in" :duration="500" >
      <router-view  />
      </transition>
  </div>

</template>

<script>
// @ is an alias to /src
/*import Sidebar from "../components/sidebar"
import titles from "../components/titles"*/
import {mapGetters} from 'vuex'
import MuPaper from "muse-ui/es5/Paper/Paper";

import SparkMD5 from 'spark-md5'
import ajax from './../plugings/API/myajax'
import dragfiles from './../components/dragfiles'


export default {
  name: 'home',
  components: {
  /*    Pan,
      MuPaper,
      upload,
      dragfiles,*/
  },
    data()
    {
        return {
            nowdiskpath:'',
            //cancel:[],
        }
    },
    created()
    {
        this.$store.commit("storeNew",{key:"title_name",data:"Home"});
    },
    computed:
    {
         ...mapGetters(["isdrag","scroll","islogin"]),
    },
    watch:
    {

    },
    methods:
    {

    }


}
</script>
<style>

    .hover{
        display:block;
        position: fixed;
    }
    .none{
        display:none;
        position: fixed;
    }
</style>



<!--
/*        this.$refs.getfile.addEventListener('dragenter',(e)=>console.log("放上来了"),false);
this.$refs.getfile.addEventListener('dragover',(e)=>console.log("拖动中"),false);
this.$refs.getfile.addEventListener('dragleave',(e)=>console.log("离开"),false);
this.$refs.getfile.addEventListener('drop',(e)=>console.log("放下"),false);*/
//this.$refs.root.addEventListener('dragleave',(e)=>{},true);
*/-->
