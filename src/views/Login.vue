<template>
    <div>
        <mu-container class="tipsbox height">
            <mu-paper :z-depth="5"  >
                <mu-form   ref="form" :model="users">
                    <mu-row justify-content="center" align-content="center" fill wrap="wrap" >
                        <mu-col span="12">
                            <mu-appbar  title="登陆" color="grey300" :z-depth="0"	>
                            </mu-appbar>
                        </mu-col>
                        <mu-col span="10" md="8">
                            <mu-row  justify-content="center" align-content="center" fill wrap="wrap">
                                <mu-col span="12"  class="col-top-15px" md="10" >
                                    <mu-form-item label="用户名/邮箱" help-text="填写用户名/邮箱" prop="username" label-float :rules="usernameRules" :error-text='errs.username'>
                                        <mu-text-field v-model="users.username"  prop="username" >
                                        </mu-text-field>
                                    </mu-form-item>
                                </mu-col>
                                <mu-col span="12" class="col-top-15px" md="10" >
                                    <mu-form-item label="密码" help-text="请输入密码" prop="password" label-float :rules="passwordRules" :error-text='errs.password'>
                                        <mu-text-field  v-model="users.password" prop="password" type="password">
                                        </mu-text-field>
                                    </mu-form-item>
                                </mu-col>
                                <mu-col span="12"  >
                                    <mu-row justify-content="end" align-content="end" fill wrap="wrap" >
                                        <mu-col span="3" lg="2">
                                            <mu-button  flat color="gray"  @click="jump('forgetpassword')">忘记密码</mu-button>
                                        </mu-col>
                                        <mu-col span="3"  lg="2">
                                            <mu-button  flat color="Red" @click="jump('register')">注册账号</mu-button>
                                        </mu-col>
                                    </mu-row>
                                </mu-col>
                                <mu-col span="4"  class="col-top-15px col-bottom-40px">
                                    <mu-button color="primary" @click="submit" >登录</mu-button>
                                </mu-col>
                            </mu-row>
                        </mu-col>
                    </mu-row>
                </mu-form>
            </mu-paper>
        </mu-container>
<!--        <mydialog :name="dialog.name" :message="dialog.msg" :open="dialog.open" :path="dialog.path">
        </mydialog>-->

    </div>
</template>

<script>
    // import MuCol from "muse-ui/es5/Grid/Col";

    import MuCol from "muse-ui/es5/Grid/Col";
    import myajax from '../plugings/API/myajax'
   // import Loading from 'muse-ui-loading';
    import MuRow from "muse-ui/es5/Grid/Row";
    import {mapActions, mapGetters} from 'vuex'
    import costum from "../plugings/API/costum"
   // import myajax from
   // import Mydialog from "../template/mydialog";
    //  import axios from 'axios'

    export default {
        components: {
        //    Mydialog,
            MuRow,
            MuCol},
        name: "login",
        data()
        {
            return {
                toback:false,
               // sideBar:false,
                load:{},
                users:{
                    username:'',
                    password:'',
                    code :'',
                },
                errs:{
                    username:'',
                    password:'',
                    code:'',
                },
                dialog:{
                    open:false,
                    name:'提示',
                    msg:'',
                    path:''
                },
                old_sidebar:false,
                usernameRules: [
                    { validate: (val) => !!val, message: '未填写用户名或邮箱'},
                    { validate: (val) => val.length >= 0, message: '用户名长度大于3'},
                    { validate: (val) =>
                            val.indexOf('@') === -1 ? true:/[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(val),
                        message: '邮箱填写错误'},
                ],
                passwordRules: [
                    { validate: (val) => !!val, message: '必须填写密码'},
                    { validate: (val) => val.length >= 6 && val.length <= 50, message: '密码长度大于6小于50'}
                ],
            }
        },
        created()
        {
          this.$store.commit('storeNew',{key:'title_name',data:'Login'});
          //this.sidebar = this.$store.state.sidebarOpen;'
            this.old_sidebar = !!this.$store.state.sidebarOpen;
            console.log(this.old_sidebar);
          this.$store.commit('storeNew',{key:'sidebarOpen',data:false});

        },
        beforeMount()
        {
/*            if( localStorage.getItem('token'))
            {
                this.getkey();
            }*/
           // console.log(process.env );
        },
        computed:
            {
                ...mapGetters(["bigscreen"]),
            },
        methods:
            {
                submit()
                {
                    this.$refs.form.clear();
                    this.$refs.form.validate().then((result) => {
                        if (result)
                            this.login();
                    });
                },
                login()
                {
/*                    let loading = this.$loading({
                        overlayColor:'hsla(0,0%,100%,0.9)',
                        size:48,
                        color :'primary',
                        text :'正在发送到服务器'
                    });*/
                        let name = 'name';
                        if (this.users.username.indexOf('@') !== -1)
                        {
                            name = 'email';
                        }
                        let data ={
                            public: {
                                [name]:this.users.username,
                            },
                            secret:{
                                password:this.users.password,
                             //   time:parseInt(new Date().getTime()/1000),
                            },
                            sname:'password',
                        };
                        let url = 'auth/login';
                        let ajax = new myajax();
                        let a = ajax.ajax(url,data,(response)=>{
                            //setTimeout(()=>{/*loading.close();*/this.$router.push('/')},1000);
                            localStorage.setItem('login',true);
                            localStorage.setItem('user_token',response.data.access_token);
                            localStorage.setItem('exptime',response.data.expires_in);
                            this.$store.commit('storeNew',{key:'login',data:true});
                            if (localStorage.getItem('login'))
                            {
                                costum.me();
                                // let url2 = 'auth/me';
                               /* ajax.ajax(url2,data,(response)=>{
                                    localStorage.setItem('user_info',JSON.stringify(response.data));
                                    this.$store.commit('storeNew',{key:'user_info',data:response.data});
                                    this.$router.push('/home');
                                },(err)=>{console.log(err.response)},'get',true);*/
                            }
                            this.$router.push('/home');

                        },(err)=>{
                           // loading.close();
                            if (err.response.data.error)
                            {
                                    this.errs.username = '用户名/邮箱错误';
                                    this.errs.password = '密码错误';
                                //this.opendialog(err.response.data.failed,'错误');
                   /*             this.dialog = {
                                    open: true,
                                    name:'错误',
                                    msg:err.response.data.failed,
                                };*/
                            //    this.$nextTick(()=>this.dialog.open = false);
                            }
                            else
                            {
                                this.errs.username = '服务器未知错误，请稍后重试';
                                //this.$router.push('/');
                            }
                        },'post',true);


                        if (a === false)
                        {
                            console.log(a);
                        }



                  //  }
                },
                jump(way = 'register')
                {
                    this.$router.push('/'+way);
                },
            },
        beforeDestroy()
        {
           // console.log("NNNNNNN");
            if (this.bigscreen  /* && !this.$store.state.sidebarBanName.includes(this.$store.state.title_name)*/)
            {

                this.$store.commit('storeNew',{key:'sidebarOpen',data:this.old_sidebar});
            }
            //this.$store.commit('storeNew',{key:'sidebarOpen',data:this.sidebar})
        }

    }
</script>

<style scoped>

    .height
    {
        margin-top: 15vh;
    }

</style>

