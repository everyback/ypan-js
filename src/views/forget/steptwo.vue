<template>
    <div>
        <mu-container class="tipsbox">
            <mu-paper :z-depth="5" >
                    <mu-row gutter>
                        <mu-col span="12">
                            <mu-appbar  title="请输入验证码" color="primary">
                            </mu-appbar>
                        </mu-col>
                        <mu-col span="10" class="col-top-15px" offset="1">
                            <mu-alert color="success">
                                <mu-icon left value="check_circle">
                                </mu-icon>
                                邮件已发送,请访问邮件中的链接，或直接复制邮件code后的代码到下面的输入框
                            </mu-alert>
                        </mu-col>
                        <mu-col span="10" offset="1"  class="col-top-15px" >
                                <mu-text-field v-model="codes.code" label="CODE" help-text="请输入CODE"  label-float :error-text='errs.code' full-width="">
                                </mu-text-field>
                        </mu-col>
                        <mu-col span="6" offset="3"  class="col-top-15px  col-bottom-40px" >
                            <mu-button color="secondary" v-loading="loading" data-mu-loading-size="24" @click="set()" :disabled="!button" >确认</mu-button>
                        </mu-col>
                    </mu-row>
            </mu-paper>
        </mu-container>
    </div>
</template>

<script>
    import ajax from  './../../plugings/API/myajax'
    export default {
        name: "steptwo",
       data()
        {
            return {
                button:true,
                send:{},
                codes:{
                    code:'',
                },
                errs:{
                    code:'',
                },
                loading:false,
            }
        },
        created()
        {
            this.$store.commit('stepchange',1);
        },
        methods:
        {
            set()
            {
              //  let send;
                if (this.send)
                {
                    clearTimeout(this.send);
                    this.send = setTimeout(()=>{
                        this.submit();
                    },80);
                }

            },
            submit()
            {
                this.loading = true;
                this.button = false;
                const url = 'restpassword';
                const data = {
                    public:{
                        code:this.codes.code,
                    }
                };
                ajax.ajax(url,data,(response)=>
                {
                    this.loading = false;
                    this.button = true;
                    this.$store.commit('codechange',this.codes.code);
                    this.$router.push('/forgetpassword/stepthree/');

                },(err)=>{
                    this.loading = false;
                    this.button = true;
                    if (err.response.data.failed.indexOf('错误') !== -1 ||err.response.data.failed.indexOf('找不到') !== -1 ) {
                        this.errs.code = 'code错误，请确认参数完整无误，如多次失败，请重新发送邮件';
                    }
                })
            }
        }

    }
</script>

<style scoped>

</style>
