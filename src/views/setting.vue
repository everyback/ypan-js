<template>
    <div >
        <div v-if="islogin">
            <ul class="list">
                <li class="in-li">
                    <div class="in-block left ">
                        <span class="inblockon top50">
                            用户id：
                        </span>

                    </div>
                    <div class="in-block mid top50">
                        {{userInfo.id}}
                    </div>
                    <div class="in-block right top30">
                    </div>
                </li>
                <li class="in-li">
                    <div class="in-block left ">
                        <span class="inblockon top50">
                            用户名
                        </span>
                    </div>
                    <div class="in-block mid top50">
                        {{userInfo.name}}
                    </div>
                    <div class="in-block right top30">
                        <mu-button color="#00c853"  @click="open.name = true"  >change</mu-button>
                    </div>
                </li>
                <li class="in-li">
                    <div class="in-block left ">
                        <span class="inblockon top50">
                            密码
                        </span>
                    </div>
                    <div class="in-block mid top50">

                    </div>
                    <div class="in-block right top30">
                        <mu-button color="#00c853"  @click="open.password = true" >change</mu-button>
                    </div>
                </li>
                <li class="in-li">
                    <div class="in-block left ">
                        <span class="inblockon top50">
                            邮箱
                        </span>
                    </div>
                    <div class="in-block mid top50">
                        {{userInfo.email}}
                    </div>
                    <div class="in-block right">
                        <!--<mu-button color="secondary"  @click="submit" :disabled="!button" >确认</mu-button>-->
                    </div>
                </li>
            </ul>
            <mu-dialog title="请输入密码" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="open.password">
                <mu-text-field v-model="password.old" type="password" label="旧密码" full-width  :error-text='err.oldpw' >
                </mu-text-field>
                <mu-text-field v-model="password.news" type="password" label="新密码" full-width  :error-text='err.newpw' >
                </mu-text-field>
                <mu-text-field v-model="password.repeat" type="password" label="重复密码" full-width :error-text='err.repeat' >
                </mu-text-field>

                <mu-button slot="actions" flat color="red" @click="close('pw')">Cancel</mu-button>
                <mu-button slot="actions" flat color="primary" @click="changepassword">OK!</mu-button>
            </mu-dialog>
            <mu-dialog title="请输入新名称" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="open.name">

                <mu-text-field v-model="newname" label="新名称"  full-width :error-text='err.name' >
                </mu-text-field>
                <mu-button slot="actions" flat color="red" @click="close('name')">Cancel</mu-button>
                <mu-button slot="actions" flat color="primary" @click="changename()">OK!</mu-button>
            </mu-dialog>
            <MyDialog :name="dialog.name" :message="dialog.msg" :open.sync="open.dia" :path="dialog.path" :confirm="false"> </MyDialog>
        </div>
        <div v-else>
            未登录
        </div>
    </div>
</template>

<script>

    import {mapGetters} from 'vuex'
    import MyDialog from "../components/myDialog";
    import costum from '../plugings/API/costum'

    export default {
        components: {MyDialog},
        name: "setting",
        data()
        {
          return{
              open:{
                  password:false,
                  name:false,
                  dia:false,
              },
              password:{
                  old:'',
                  news:'',
                  repeat:'',
              },
              dialog:{
                  name:'成功',
                  msg:'修改成功，将会导致重新登陆，点击确定以跳转',
                  path:'/logout',
              },
              newname:'',
              err:{
                  oldpw:'',
                  newpw:'',
                  repeat:'',
                  name:'',
              }
          }
        },
        created()
        {
            this.$store.commit("storeNew",{key:"title_name",data:"Setting"});

        },
        computed:{
            ...mapGetters(['fullPath','paths',"fresh","islogin","userInfo"]),
        },
        created()
        {
            if (!this.islogin)
            {
                this.$router.push('/login');
            }
        },
        methods:{
            changename()
            {
                this.err.name = '';
                if(this.newname === '')
                {
                    this.err.name = '不能为空';
                }
                else if (this.newname === this.userInfo.name)
                {
                    this.err.name = '不能与原名称相同';
                }
                else
                {
                    costum.changename(this.newname).then((resolve)=>{
                       this.open.name = false;
                       this.open.dia = true;
                    },(reject)=>{
                        this.err.name = "请换一个名称";
                    });
                }
            },
            changepassword()
            {
                this.err = {
                    oldpw:'',
                    newpw:'',
                    repeat:'',
                    name:'',
                };
                if(this.password.old === '' )
                {
                    this.err.oldpw = '不能为空';
                }
                if (this.password.news === '')
                {
                    this.err.newpw = '不能为空';
                }
                if (this.password.repeat === '')
                {
                    this.err.repeat = '不能为空';
                }
                if (this.password.oldpw === this.password.news)
                {
                    this.err.newpw = '不能与原密码相同';
                }
                if (this.password.news !== this.password.repeat)
                {
                    this.err.repeat = '重复密码不对';
                }
                if (this.password.news.length < 6)
                {
                    this.err.newpw = '新密码过短';
                }
                if (this.err.oldpw === "" && this.err.newpw === "" &&  this.err.repeat === "")
                {
                    costum.changepassword(this.password.old,this.password.news).then((resolve)=>{
                        this.open.password = false;
                        this.open.dia = true;
                    },(reject)=>{
                        if (reject.error.indexOf("wrong") !==  -1)
                        {
                            this.err.oldpw = "原密码不对";
                        }else
                        {
                            this.err.newpw = "请换一个密码";
                        }

                    });
                }
            },
            close(name)
            {
                if (name === 'name')
                    this.open.name = false;
                if (name === 'pw')
                {
                    this.open.password = false;
                }
            }
        }
    }
</script>

<style scoped>

    ul,li{ padding:0;margin:0;list-style:none}
    li:nth-child(2n){
        background-color: #f5f5f5;
    }
    li{

        background-color: #e0e0e0;
    }
    li:first-child{
        border-radius: 10px 10px 0 0 ;
    }
    li:last-child{
         border-radius: 0 0 10px 10px;
    }
    .list{
        height: 50vh;

    }
    .in-li{
        height: 25%;
    }
    .in-block{
        display:inline-block;
        height: 100%;
        vertical-align:top;
    }
    .inblockon{
        display:inline-block;
    }
    .left{
        width: 30%;
        text-align: center;
        line-height:100%;
        font-size: 1.3em;
        border-right:1px solid #f5f5f5;
        color: #757575;

    }
    .left:nth-child(2n)
    {
        border-right:1px solid #e0e0e0;
    }
/*    .left:after{
        content: '';
        height: 70%;
        border-right:1px solid #9e9e9e;
    }*/
    .mid{
        width:30%;
        color: #757575;
    }
    .right{
        width:40%;
    }
    .top50{
        /*top: 50%;*/
        margin-top: 50px;
    }
    .top30{
        /*top: 50%;*/
        margin-top: 30px;
    }


</style>
