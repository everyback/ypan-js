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
                                <img src="data:image/png;base64,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
"  style="max-width:5vh; max-height:5vw" />
                            </span>
                        <div slot="default" class="small-font" v-if="islogin">
                            <span>您好，<router-link :to="{ name: 'setting'}">{{user.name}}</router-link>！</span>
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
                    <div style="order: 99;width: 100%;background-color: whitesmoke;height:3rem" v-if="islogin" >
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
                    {name:"my share",path:"/myshare"},
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
                if (!this.bigscreen)
                {
                    this.sidebar.open = false;
                }
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
