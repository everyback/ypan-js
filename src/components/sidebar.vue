<template>
    <div>
        <mu-container  >
            <v-touch style="width: calc(100% - 240px);height: 100%;position:fixed; z-index: 20141228;right:0; " v-if="!bigscreen&& sidebar.open" @swipeleft="sleft" @tap="sleft" >
            </v-touch>
            <v-touch style="width: 2%;height: 80%;position:fixed;left:0;top:10%; z-index: 20141222 " @swiperight="sright" v-if="!bigscreen&&!sidebar.open" :key="'side'" >
            </v-touch>
            <mu-drawer :open.sync="sidebar.open" :docked="bigscreen" :right="false"  :z-depth="0" style="width: 240px" v-swipeleft="(s,e)=>sleft('mus')"  >
                <div v-if="bigscreen">
                    <mu-appbar  z-depth="0" color="lightBlue50" >
                        <span class="bigtest" slot="left">Heartbeat monitor</span>
                    </mu-appbar>
                </div>
                <mu-appbar  z-depth="0" >
                            <span  slot="left" v-if="login">
                                <img src="http://127.0.0.1:8000/api/avatar/-1"  style="max-width:5vh; max-height:5vw" />
                            </span>
                    <div slot="default" class="small-font" v-if="login">
                        <p>
                            <span>您好，<a href="#">{{user.name}}</a>！</span>

                        </p>

                    </div>
                    <mu-button  v-if="login" slot="right" flat color="primary" small @click="logout()" >Logout</mu-button>
                    <div v-if="!login">
                        <p><a href="/login">未登录</a></p>
                    </div>
                    <mu-button  v-if="!login" slot="right" flat color="primary" small @click="tologin()" >请登录</mu-button>
                </mu-appbar>
                <mu-divider />
                <!--                <mu-list>
                                    <mu-slide-left-transition>
                                        <div v-show="shows">
                                            <mu-list-item  @click="jumpto(key)" v-for="(item,key) in lists" :key="key"   button>
                                                <mu-list-item-title>{{item}}</mu-list-item-title>
                                            </mu-list-item>
                                            <mu-list-item  v-if="!this.$store.state.table" @click="muclose()" button>
                                                <mu-list-item-title>Close</mu-list-item-title>
                                            </mu-list-item>
                                        </div>
                                    </mu-slide-left-transition>
                                </mu-list>-->
                <mu-list>
                    <mu-list-item  v-if="!bigscreen" @click="closebar()" button>
                        <mu-list-item-title>Close</mu-list-item-title>
                    </mu-list-item>
                </mu-list>
            </mu-drawer>
        </mu-container>
        <Mydialog :name="dialog.name" :message="dialog.msg" :open="dialog.open" :path="dialog.path"> </Mydialog>
    </div>
</template>

<script>

    import Mydialog from "../template/mydialog";
    import {mapActions, mapGetters} from 'vuex'

    export default {
        name: "sidebar",
        components: {
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
            }
        },
        computed :{
            ...mapGetters(["bigscreen","islogin","barOpen"]),
        },
        watch:{
            bigscreen(val){
                this.sidebar.open = val ;
            },
            barOpen()
            {
                this.sidebar.open = this.$store.state.sidebarOpen;
            },
            'sidebar.open': {
                handler(val)
                {
                    //if(!( val === barOpen))
                    this.$store.commit('newdata',{key:'sidebarOpen',data:this.sidebar.open});
                }
            },
            islogin(val)
            {
                this.login = !!val;
            },
        },
        beforeMount()
        {
            if (!this.bigscreen)
            {
                this.sidebar.open = false;
            }
            if (localStorage.getItem('login') === '1' )
            {
                this.login = true;
                let s = JSON.parse(localStorage.getItem('user'));
                //console.log(s.name);
                this.user.name = s.name;
                this.user.uid  = s.id;
            }
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
                this.dialog.path = '/logout'

            },
            tologin()
            {
                this.$router.push('/login');
            },
            jumpto(val)
            {
                this.$store.commit('newdata',{key:'title_name',data:val.name});
            },
            sleft(s,e)
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
            }

        }

    }
</script>

<style scoped>

    .img{

    }
</style>
