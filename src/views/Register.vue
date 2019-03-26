<template>
    <div>
        <mu-container class="tipsbox" fluid >
            <mu-paper :z-depth="5" >
                <mu-form  ref="form" :model="users">
                    <mu-row gutter justify-content="center" align-content="center" fill wrap="wrap">
                        <mu-col span="12">
                            <mu-appbar  title="注册" color="primary">
                            </mu-appbar>
                        </mu-col>
                        <mu-col span="10"  class="col-top-15px"  md="10" >
                            <mu-row gutter justify-content="center" align-content="center" fill wrap="wrap">
                                <mu-col span="12"  class="col-top-15px"  md="8" fill >
                                    <mu-form-item label="用户名" help-text="请输入用户名" prop="username" label-float :rules="usernameRules" :error-text='errs.username'>
                                        <mu-text-field v-model="users.username"  prop="username" >
                                        </mu-text-field>
                                    </mu-form-item>
                                </mu-col>
                                <mu-col span="12"   class="col-top-15px"  md="8" fill>
                                    <mu-form-item label="邮箱" help-text="请输入邮箱" prop="email" label-float :rules="emailRules" :error-text='errs.email'>
                                        <mu-text-field v-model="users.email"  prop="email" >
                                        </mu-text-field>
                                    </mu-form-item>
                                </mu-col>
                                <mu-col span="12"  class="col-top-15px"  md="8" fill>
                                    <mu-form-item label="密码" help-text="请输入密码" prop="password" label-float :rules="passwordRules" :error-text='errs.password'>
                                        <mu-text-field v-model="users.password"  prop="password"type="password" >
                                        </mu-text-field>
                                    </mu-form-item>
                                </mu-col>
                                <mu-col span="12"   class="col-top-15px" md="8" >
                                    <mu-form-item label="重复密码" help-text="请重复输入密码" prop="repassword" label-float :rules="repasswordRules" :error-text='errs.repassword'>
                                        <mu-text-field v-model="users.repassword"  prop="repassword" type="password" >
                                        </mu-text-field>
                                    </mu-form-item>
                                </mu-col>
                                <mu-col span="12"  class="col-top-15px" md="8" >
                                    <mu-form-item label="邀请码" help-text="请输入邀请码（可选）" prop="invitecode" label-float :rules="invitecodeRules" :error-text='errs.invitecode'>
                                        <mu-text-field v-model="users.invitecode"  prop="invitecode" >
                                        </mu-text-field>
                                    </mu-form-item>
                                </mu-col>
                                <mu-col span="12" class="col-top-15px  col-bottom-40px" >
                                    <!--<mu-button color="secondary" v-loading="loading" data-mu-loading-size="24" @click="submit" :disabled="!button" >确认</mu-button>-->
                                    <mu-button color="secondary"  @click="submit" :disabled="!button" >确认</mu-button>
                                </mu-col>
                            </mu-row>
                        </mu-col>
                    </mu-row>
                </mu-form>
            </mu-paper>
            <Mydialog :name="dialog.name" :message="dialog.msg" :open="dialog.open" :path="dialog.path" :confirm="false"> </Mydialog>
        </mu-container>
    </div>
</template>


<script>
    import Mydialog from "../components/myDialog"
    import myajax from "../plugings/API/myajax";
    export default {
        name: "register",
   components:{
       Mydialog,
   },
   data()
   {
       return {
           loading:false,
           button:true,
           name:['用户名','邮箱','密码','重复密码','邀请码'],
           help:['请输入用户名','请输入邮箱','请输入密码','请重复输入密码','请输入邀请码（可选）'],
           users:
               {
                   email:'',
                   username:'',
                  // phonenuber:'',
                   password:'',
                   repassword :'',
                   invitecode:'',
               },
           errs:{
               email:'',
               username:'',
               password:'',
               repassword :'',
               invitecode:'',
           },
           dialog:{
               open: false,
               name:'提示',
               msg:'',
               toback:false,
           },
           usernameRules: [
               { validate: (val) => !!val, message: '必须填写用户名'},
               { validate: (val) => val.length >= 3, message: '用户名长度大于3'},
               { validate: (val) => /^(?!\d+$)[\da-zA-Z_]+$/.test(val), message: '只能输入字母或数字，并且不能只有数字'},
               { validate: (val) =>this.check({name: val}), message: 'space'},
           ],
           emailRules:[
               {validate: (val) => !!val, message: '必须填写邮箱'},
               { validate: (val) => /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(val),message: '邮箱填写错误'},
               { validate: (val) => this.check({email:val}), message: 'space'},
           ],
           passwordRules: [
               { validate: (val) => !!val, message: '必须填写密码'},
               { validate: (val) => val.length >= 6 && val.length <= 50, message: '密码长度大于6小于50'}
           ],
           repasswordRules:[
               { validate: (val) => !!val, message: '必须填写密码'},
               { validate: (val) => val.length >= 6 && val.length <= 50, message: '密码长度大于6小于50'},
               { validate: (val) => val === this.users.password, message: '重复密码不一致'}
           ],
           invitecodeRules:[
           ],
       }
   },
    created()
    {
        this.$store.commit('storeNew',{key:'title_name',data:'Register'});
        this.$store.commit('storeNew',{key:'sidebarOpen',data:false});
    },
   methods:
   {
       submit() {
       this.loading = true;
       this.button = false;
       this.$refs.form.clear();
       this.$refs.form.validate().then((result) => {
           if (result) {
               this.regist();
           }
           else{
               this.close();
           }
       });
   },
       regist()
       {
           const url = 'register';
           const data = {
               public: {
                   name: this.users.username,
                   email: this.users.email,
                 //  phonenumber:this.users.phonenuber,
               },
               secret:{
                   password:this.users.password,
                  // time:parseInt(new Date().getTime()/1000),
               },
             //  sname:'password',
           };
           let ajax = new myajax();
           ajax.ajax(url,data,(response)=>{
               this.dialog = {
                   open : true,
                   name :'成功',
                   msg  : response.data.success+'点击确定后返回登陆界面',
                   path :'/login',
               };
               this.users=
                   {
                       email:'',
                       username:'',
                       password:'',
                       repassword :'',
                       invitecode:'',
                   };
               this.$nextTick(()=>this.close());
               //setTimeout(()=>this.close(),1000);
           },(err)=>{
               this.dialog = {
                   open : true,
                   name :'错误',
                   msg  : err.response.data.failed,
                   path :'',
               };
               this.$nextTick(()=>{this.dialog.open = false; this.close();});
               this.close();
           },'post');
       },
       check(val)
       {
           let g = '';
           g = Object.keys(val)[0];
           g.indexOf('name') !== -1 ? this.errs.username = '':this.errs.email = '';
           this.errs.username = '';
           this.errs.email = '';
           const url = 'same'+g;
           const data = {
               public: {
                   [g]:val[g],
               },
           };
           let resu = true;
           let ajax = new myajax();
           ajax.ajax(url,data,(response)=>{
              // console.log(response);
               //result = true;
               if (response.data.message.indexOf('have') !== -1)
               {
                   if (g.indexOf('name') !== -1 )
                       this.errs.username = '用户名已存在';
                   else
                       this.errs.email = '邮箱已存在';
                   resu = false;
               }
           },(err)=>{
                console.log(err.response);
               resu = false;
           },'get',false);
           return resu;
       },
       close()
       {
           this.loading = false;
           this.$nextTick(()=>this.button = true);
       }
   }
   }
</script>

<style scoped>

</style>
