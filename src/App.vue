<template>
  <div id="app" ref="root">
      <sidebar />
      <titles  v-show="titleShow"/>
      <div class="showpages" :class="this.$store.state.sidebarOpen? 'showpages-sidebar-open':'showpages-sidebar-close'" >
          <div :class="this.$store.state.sidebarOpen? 'inner-showpages-sidebar-open':'inner-showpages-sidebar-close'" style="min-height: calc(100vh - 70px)">
                <router-view/>
          </div>
          <footer style="margin-top: 10px"> This is foot </footer>
      </div>
  </div>
</template>

<script>
    import store from './store'
    import Sidebar from "./components/sidebar"
    import titles from "./components/titles"
    import {mapGetters} from 'vuex'

    export default {
        store,
        components: {
            Sidebar, titles,
        },
        data()
        {
            return {
                titleShow:true,
                lastrtead:0,
            }
        },
        created()
        {
            let resizeTimer;
            this.$store.commit('storeNew',{key:'screen',data:document.documentElement.clientWidth / document.documentElement.clientHeight});
            window.onresize = () => {
                if (resizeTimer)
                    clearTimeout(resizeTimer);
                resizeTimer = setTimeout(()=>{
                    this.$store.commit('storeNew',{key:'screen',data:document.documentElement.clientWidth / document.documentElement.clientHeight});
                },70);
            };
            let times;
            window.onscroll=()=>{

                if (times)
                {
                    clearTimeout(times);
                }
                times = setTimeout(()=>{
                    this.$store.commit("storeNew",{
                        key:"read",
                        data:(document.documentElement.scrollTop + document.documentElement.clientHeight) / document.documentElement.scrollHeight
                    });
                },100);
            };
            let timew;
            window.onmousewheel = (e)=>{

                if (timew)
                    clearTimeout(timew);
                timew = setTimeout(()=> {
                    this.$store.commit('storeNew', {
                        key: 'scroll',
                        data: e.wheelDelta
                    });
                },100);
            };
            if (localStorage.getItem('user_info'))
            {
                this.$store.commit("storeNew",{key:'user_info',data:JSON.parse(localStorage.getItem('user_info'))})
            }

        },
        mounted()
        {
            this.$refs.root.addEventListener('dragenter',(e)=>{
                e.cancelBubble = true;
                e.preventDefault();
                e.stopPropagation();
                 this.$store.commit("storeNew",{key:"drag",data:true});
             //   console.log("catched");
                }
                ,true);
           // this.$refs.getfile.addEventListener('dragover',(e)=>this.$store.commit("storeNew",{key:"drag",data:true}),false);
/*            this.$refs.root.addEventListener('dragleave',(e)=>{
                e.cancelBubble = true;
                console.log("leave");
               // this.$store.commit("storeNew",{key:"drag",data:false});
            },true);*/
        },
        computed:
            {
                ...mapGetters(["read","scroll"]),
                progress()//全局进度条， 使用museui的额外插件
                {
                    return this.$store.state.Nprogress;
                }
            },
        watch:
            {
               /* progress(val)
                {
                    if (val === true)
                        this.$progress.start();
                    else
                        setTimeout(()=>this.$progress.done(),100);
                },*/
                read(val){
                    this.titleShow = document.documentElement.scrollTop < document.documentElement.clientHeight/2 || this.lastrtead > val  ;
                    this.lastrtead = val;
                },

            }

    }
</script>

<style>
    @import 'http://cdn.bootcss.com/material-design-icons/3.0.1/iconfont/material-icons.css';
    @import "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic";

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }
</style>
