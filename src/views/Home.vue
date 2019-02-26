<template>
  <div class="home">
      <div>
<!--        <sidebar />
         <titles  v-show="titleShow"/>-->
          <!--<div style="height: 3000px;width: 50px;background-color: black; margin:auto"></div>-->
          <mu-paper style=" min-height: 8vmin" :z-depth="5">
<!--              <div>
                  <span >
                      <input  type="file"    style="visibility:hidden;position:absolute"  />

                </span>
              </div>-->
              <label style="display: inline-block;position:relative">
                  <input title="点击选择文件" id="h5Input0" multiple="" accept="*/*" type="file" name="html5uploader" style="position:absolute;opacity:0;top:0;left:0;width:100%;height:100%;cursor:pointer;">
                  <!--<input type="file" id="fileInput1" name="file" class="mFileInput" style="left:-9999px;position:absolute;">-->
                  <mu-button color="primary"  style="position:absolute"> UPLOAD </mu-button>
                  <span>sssssssssss</span>
              </label>
          </mu-paper>
          <mu-paper style="margin-top: 20px;height:1000px;" :z-depth="5">
              <dragfiles />
          </mu-paper>
      </div>
      <upload />
  </div>
</template>

<script>
// @ is an alias to /src
/*import Sidebar from "../components/sidebar"
import titles from "../components/titles"*/
import {mapGetters} from 'vuex'
import MuPaper from "muse-ui/es5/Paper/Paper";
import upload from './../components/upload'
import SparkMD5 from 'spark-md5'
import ajax from './../plugings/API/myajax'
import dragfiles from './../components/dragfiles'

export default {
  name: 'home',
  components: {
      MuPaper,
      upload,
      dragfiles,
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
         ...mapGetters(["isdrag","scroll"]),
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
