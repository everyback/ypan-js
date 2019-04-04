<template>
    <div>
        <mu-container  >
            <v-touch style="width: calc(100% - 240px);height: 100%;position:fixed; z-index: 20141228;right:0; " v-if="!bigscreen&& sidebar.open" @swipeleft="sleft" @tap="sleft" >
            </v-touch>
            <v-touch style="width: 2%;height: 80%;position:fixed;left:0;top:10%; z-index: 20141222 " @swiperight="sright" v-if="tooutshow()" :key="'side'" >
            </v-touch>
            <mu-drawer :open.sync="sidebar.open" :docked="bigscreen" :right="false"  :z-depth="0" style="width: 240px; " v-swipeleft="(s,e)=>sleft('mus')"  >
                <div class="sidebar-flex">
                    <mu-appbar  z-depth="0" color="lightBlue50" v-if="bigscreen" class="sidebar-flex-item">
                        <span class="bigtest" slot="left">Heartbeat monitor</span>
                    </mu-appbar>
                    <mu-appbar  z-depth="0" style="width: 100%;flex: none">
                            <span  slot="left" v-if="islogin">
                                <img src="http://127.0.0.1:8000/api/avatar/-1"  style="max-width:5vh; max-height:5vw" />
                            </span>
                        <div slot="default" class="small-font" v-if="islogin">
                            <span>您好，<a href="#">{{user.name}}</a>！</span>
                        </div>
                        <div v-else>
                            <p><a href="/login">未登录</a></p>
                        </div>
                        <mu-button  v-if="islogin" slot="right" flat color="primary" small @click="logout()" >Logout</mu-button>
                        <mu-button  v-else slot="right" flat color="primary" small @click="tologin()" >请登录</mu-button>
                    </mu-appbar>
                    <mu-divider />

                    <div class="sidebar-list"  >
                        <div class=" innerx sidebar-list-inner"   v-swipeleft="(s,e)=>sleft('mus')" >
                            <div style="width: calc(100% ); height: calc(100% - 12rem); ">
                                <mu-list v-show="shows">
                                    <!--<mu-list-item  v-if="!bigscreen" @click="closebar()" button>-->
                                  <!--  <mu-list-item  @click="closebar()" button>
                                        <mu-list-item-title>1</mu-list-item-title>
                                    </mu-list-item>
                                    <mu-list-item  @click="closebar()" button>
                                        <mu-list-item-title>2</mu-list-item-title>
                                    </mu-list-item>-->
                                    <transition-group appear tag="li"  name="fadeLeft" move-class="sidemove" :duration="300" >
                                            <mu-list-item button v-for="(items,index) in uselist" @click="pushto(items) " :key="items.name" >
                                                <mu-list-item-title>{{items.name}}</mu-list-item-title>
                                            </mu-list-item>
                                            <mu-list-item  v-if="bigscreen" @click="closebar()" key="close" button style="animation-duration:0.1s;">
                                                <mu-list-item-title>Close</mu-list-item-title>
                                            </mu-list-item>
                                    </transition-group>
                                </mu-list>


                            </div>
                        </div>
                    </div>

                    <!-- <mu-appbar style="position: absolute;bottom: 0;width: 100% "  z-depth="0">

                     </mu-appbar>-->
                    <div style="order: 99;width: 100%;background-color: whitesmoke;height:3rem" >
                        <div style="  margin-top:-10px;margin-left: 20px">
                           <space />
                        </div>
                    </div>
                </div>
            </mu-drawer>
        </mu-container>
        <Mydialog :name="dialog.name" :message="dialog.msg" :open.sync="dialog.open" :path="dialog.path" :confirm="true"> </Mydialog>
    </div>
</template>


<script>

    import Mydialog from "../components/myDialog";
    import {mapActions, mapGetters} from 'vuex'
    import Space from "./space";


    export default {
        name: "sidebar",
        components: {
            Space,
            Mydialog,
        },
        data(){
            return {
                login:false,
                imgs:{
                    link: 'http://127.0.0.1:8000/api/avatar/-1',

                },
                sidebar:{
                    open:true,
                    bigscreen :true,
                },
                user: {
                    name: 'none',
                    uid: -99,
                },
                dialog:{
                    open:false,
                    name:'提示',
                    msg:'',
                    path:''
                },
                uselist:[],
                sidebar_items:[
                    {name:"disk",path:"/home/disk"},
                    {name:"share",path:"/share"},
                    {name:"setting",path:"/setting"},
                    ],
                rolerouter:false,
                shows:true,
            }
        },
        computed :{
            ...mapGetters(["bigscreen","islogin","barOpen","userInfo"]),
            routename()
            {
                return this.$route.path;
            },
            isrole()
            {
                return this.$store.state.role;
            }

        },
        watch:{
            bigscreen(val){
                if (!this.$store.state.sidebarBanName.includes(this.$store.state.title_name))
                    this.sidebar.open = val ;
                else
                    this.sidebar.open = true ;
                //if (this.$store.state.title_name !== )

               // console.log(this.$router.path);
            },
            barOpen()
            {
                this.sidebar.open = this.$store.state.sidebarOpen;
            },
            'sidebar.open': {
                handler(val)
                {
                    //if(!( val === barOpen))
                    this.$store.commit('storeNew',{key:'sidebarOpen',data:this.sidebar.open});
                }
            },
            islogin(val)
            {
                this.login = !!val;
            },
            userInfo(val)
            {
                if (val)
                {
                    this.user.name = val.name;
                    this.user.uid = val.id;
                }
            },
            isrole(val)
            {
               // console.log("outs");
                if(!val)
                    this.setpath(true);
                   // this.rolerouter = false ;
            },
            routename()
            {
                this.setpath();
            }

        },
        beforeMount()
        {
            if (!this.bigscreen)
            {
                this.sidebar.open = false;
            }
            if (localStorage.getItem('login') === "true" )
            {
                this.login = true;
                //let s = JSON.parse(localStorage.getItem('user_info'));
                let s = this.$store.state.user_info;
                //console.log(s.name);
                this.user.name = s.name;
                this.user.uid  = s.id;
            }
            this.setpath(this.routename);
            //console.log(this.spaceused);
        },
        methods:{
            closebar()
            {
                this.sidebar.open = false;
            },
            logout()
            {
                this.dialog.open = true;
                this.dialog.msg  = '确认要退出么';
                this.dialog.path = '/logout';
                // this.$nextTick(()=>this.dialog.open = false);

            },
            setpath(val = false)
            {
                if (/*this.routename.indexOf("/manage") !== -1 &&*/ this.$store.state.role_items.length !== 0 && this.rolerouter === false )
               // if (this.isrole === true && this.$store.state.role_items.length !== 0 && this.rolerouter === false )
             //   if (this.isrole === true && this.rolerouter === false)
                {
                    this.uselist = this.$store.state.role_items;
                    this.shows = false;
                    this.$nextTick(()=>this.shows = true);
                    if (this.uselist[this.uselist.length - 1].name !== "userchoose")
                        this.uselist.push({name:"userchoose",path:"/home"});
                    this.rolerouter = true;
                }
                if ((this.routename.indexOf("/manage") === -1 && this.rolerouter === true) || this.uselist.length === 0  )
             //   if ((this.isrole === true && this.rolerouter === true) || this.uselist.length === 0)
               // if (this.isrole === false && this.rolerouter === true)
                {
                    this.uselist = this.sidebar_items;
                    this.shows = false;
                    this.$nextTick(()=>this.shows = true);
                    if (this.uselist[this.uselist.length - 1].name !== "manage" && this.rolerouter === true && this.isrole === true )
                        this.uselist.push({name:"manage",path:"/manage"});
                    this.rolerouter = false;
                }
                if (val === true)
                {
                    this.uselist = this.sidebar_items;
                }
            },
            tologin()
            {
                this.$router.push('/login');
            },
            jumpto(val)
            {
                this.$store.commit('storeNew',{key:'title_name',data:val.name});
            },
            pushto(items)
            {
                this.$router.push(items.path);
            },
            sleft(s)
            {
                if (s==="mus")
                    console.log("由本体出发");
                if (this.bigscreen)
                    console.log("左滑触发,zhuomian");
                else
                {
                    this.closebar();
                    console.log("左滑触发");
                }

            },
            sright(s)
            {
                this.sidebar.open = true;
                console.log("右滑触发");
            },
            tooutshow()
            {
                return !(this.bigscreen || this.sidebar.open || this.$store.state.sidebarBanName.includes(this.$store.state.title_name));
            },


        }

    }
</script>

<style scoped>

    .sidebar-flex{
        height: 100%;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content:flex-start;
        align-items: flex-start;


    }
    .sidemove {
        transition: all 1s;
    }

    .sidemove-leave-active {
        position:absolute;
    }
    .sidebar-flex-item{
        width: 100%;
        flex: none;
    }

    .innerx::-webkit-scrollbar{
        display: none;
    }
    .img{

    }
</style>
