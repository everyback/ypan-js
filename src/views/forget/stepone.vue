<template>
    <div>
        <mu-container class="tipsbox one">
            <mu-paper :z-depth="5" >
                <mu-form   ref="form" :model="email">
                    <mu-row gutter justify-content="center" align-content="center" fill wrap="wrap">
                        <mu-col span="12">
                            <mu-appbar  title="请输入邮箱" color="primary">
                            </mu-appbar>
                        </mu-col>
                        <mu-col span="10"  md="8" lg="6" class="col-top-15px" >
                            <mu-form-item label="邮箱" help-text="请输入邮箱" prop="email" label-float :rules="emailRules" :error-text='errs.email'>
                                <mu-text-field v-model="email.email"  prop="email" >
                                </mu-text-field>
                            </mu-form-item>
                        </mu-col>
                        <mu-col span="10"  md="8" lg="7"  class="col-top-15px  col-bottom-40px" >
                            <mu-button color="secondary" v-loading="loading" data-mu-loading-size="24" @click="submit" :disabled="!button">确认</mu-button>
                        </mu-col>
                    </mu-row>
                </mu-form>
            </mu-paper>
        </mu-container>
    </div>
</template>

<script>

    import ajax from  './../../plugings/API/myajax'

    export default {
        name: "stepone",
        data() {
            return {
                loading: false,
                button:true,
                emailRules: [
                    {validate: (val) => !!val, message: '必须填写邮箱'},
                    {validate: (val) => /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/.test(val),
                        message: '邮箱填写错误'},
                ],
                email: {
                    email: '',
                },
                errs: {
                    email: '',
                },
            }
        },
        computed: {
            screen() {
                if (this.$store.state.screen <= (9 / 16)) {
                    this.orientation = "vertical";
                    return "vertical";
                }
                else {
                    this.orientation = "horizontal";
                    return 'horizontal';
                }
            },
        },
        beforeMount()
        {
            this.$store.commit('codechange','');  //清除code
            this.$store.commit('stepchange');
        },
        methods:
            {
                submit() {
                    this.$refs.form.clear();
                    this.$refs.form.validate().then((result) => {
                        if (result) {
                            this.tosend();
                        }
                    });
                },
                tosend() {
                    this.loading = true;
                    this.button = false;
                    let url = 'forget';
                    const data = {
                        public: {
                            email: this.email.email,
                        }
                    };
                    ajax.ajax(url, data, (response) => {
                        this.loading = false;
                        this.$router.push('/forgetpassword/steptwo');

                    }, (err) => {
                        this.loading = false;
                        this.button = true;
                        if (err.response.data.failed.indexOf('失败') !== -1) {
                            this.errs.email = '邮箱错误，该邮箱未注册';
                        }
                    }, 'post');
                }
            }
    }

</script>

<style scoped>
    .one
    {
        margin-top: 10vh;
    }
    @media screen and ( max-aspect-ratio:10/16	)
    {
        .one
        {
            margin-top: 5vh;
        }

    }
</style>
