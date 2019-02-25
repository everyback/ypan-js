<template>
    <div>
        <mu-container class="tipsbox">
            <mu-paper :z-depth="5" >
                <mu-form   ref="form" :model="passwords">
                    <mu-row gutter justify-content="center" align-content="center" fill wrap="wrap">
                        <mu-col span="12">
                            <mu-appbar  title="重置密码" color="primary">
                            </mu-appbar>
                        </mu-col>
                        <mu-col span="8" class="col-top-15px" >
                        </mu-col>
                        <mu-col span="10"   class="col-top-15px"  md="8"  lg="7">
                            <mu-form-item label="新密码" help-text="请输入新密码" prop="password" label-float :rules="passwordRules" :error-text='errs.newpw'>
                                <mu-text-field v-model="passwords.password"  prop="password" type="password">
                                </mu-text-field>
                            </mu-form-item>
                        </mu-col>
                        <mu-col span="10"   class="col-top-15px" md="8"  lg="7">
                            <mu-form-item label="重复新密码" help-text="重复新密码" prop="repeat" label-float :rules="reppasswordRules" :error-text='errs.repnpw'>
                                <mu-text-field v-model="passwords.repeat" prop="repeat" type="password"   >
                                </mu-text-field>
                            </mu-form-item>
                        </mu-col>
                        <mu-col span="10"   class="col-top-15px  col-bottom-40px" md="8" lg="7" >
                            <mu-button color="secondary" v-loading="loading" data-mu-loading-size="24" @click="submit"  :disabled="button">确认</mu-button>
                        </mu-col>
                    </mu-row>
                </mu-form>
            </mu-paper>
        </mu-container>
        <mydialog :name="dialog.name" :message="dialog.msg" :open="dialog.open" :path="dialog.path">
        </mydialog>
    </div>
</template>

<script>

    import ajax from '../../plugings/API/myajax'
    import Mydialog from "../../components/myDialog";

    export default {
        components: {Mydialog},
        name: "stepthree",
        data()
        {
          return {
              code :'',
              loading:false,
              button :false,
              errs:{
                  newpw:'',
                  repnpw:'',
              },
              passwords:{
                  password:'',
                  repeat :'',
              },
              dialog:{
                  open:false,
                  name:'修改成功',
                  msg:'',
                  path:'',
              },
              passwordRules: [
                  { validate: (val) => !!val, message: '必须填写密码'},
                  { validate: (val) => val.length >= 6 && val.length <= 50, message: '密码长度大于6小于50'},
              ],
              reppasswordRules: [
                  { validate: (val) => !!val, message: '必须填写密码'},
                  { validate: (val) => val.length >= 6 && val.length <= 50, message: '密码长度大于6小于50'},
                  { validate: (val) => val === this.passwords.password, message: '重复密码不一致'}
              ],

          }
        },
        created()
        {
            this.$store.commit('storeNew',{key:'title_name',data:'Reset'});
        },
        beforeMount()
        {
           // this.$store.commit('codechange',2);
            this.$store.commit('stepchange',2);
            if ( this.$route.query.code )
            {
                this.code = this.$route.query.code;
            }
            else if (this.$store.state.code !== '')
            {
                this.code = this.$store.state.code;
            }
            else
            {
                this.$router.push('/forgetpassword');
            }
            if (localStorage.getItem('pubkey') == '')
            {
                this.getkey();
            }
        },
        methods:
        {
            submit()
            {
                this.loading = true;
                this.$refs.form.clear();
                this.button = true;
                this.$refs.form.validate().then((result) => {
                   // if (this)

                    if (result)
                    {
                        this.restpassword();
                    }
                    else
                    {
                        this.close()
                    }
                });
            },
            restpassword()
            {
                const url= 'restpassword';

                const data = {
                    public:{
                        code:this.code,
                    },
                    secret:{
                        password:this.passwords.password,
                    },
                    sname:'password',
                };
                ajax.ajax(url,data,(response)=> {
                    this.dialog = {
                            open : true,
                            name :'成功',
                            msg  : '密码修改成功，点击确定返回登录',
                            path :'/login',
                    };
                    this.close();
                },(err)=>{
                    if (err.response.data.failed.indexOf('相同') !== -1)
                    {
                        this.errs.newpw = err.response.data.failed;
                    }
                    else
                    {
                       // this.opendialog(err.response.data.failed,'错误');
                        this.dialog = {
                            open: true,
                            name: '错误',
                            msg: err.response.data.failed,
                            path :'',
                          //  radom:Math.random(),
                        };
                    //    setTimeout(()=>this.dialog.open = false,0);
                        this.$nextTick(()=>{
                            this.dialog.open = false;
                        });
                        this.close();
                      //  this.$set(this.dialog,'open',true);
                    }
                },'post');
                return 'a' ;
            },
            getkey()
            {
                let url = 'getkey';
                let data ={};
                let a = ajax.ajax(url,data,(response)=>{
                    localStorage.setItem('pubkey',JSON.stringify(response.data.result.pubkey));
                });
                if (a === false)
                    console.log(a);
            },
            close()
            {
                this.button = false;
                this.loading = false;
            },
          /*  opendialog(msg,name,toback = false)
            {
                this.dialog.msg = msg;
                this.dialog.name = name;
                this.dialog.open = true;
                this.dialog.toback = toback;
            },
            closedialog()
            {
                this.dialog.open = false;
                if (this.dialog.toback )
                    this.$router.push('/login');
            },*/
        }

    }
</script>

<style scoped>

</style>
