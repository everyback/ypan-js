<template>
    <div>
        <mu-stepper :active-step="activeStep" class="page-width page-start" :orientation="screen"  :class="screen === 'vertical' ? 'leftp':''" :linear="false">
            <mu-step >
                <mu-step-button @click="tocheck('/forgetpassword/stepone')">
                   输入邮箱
                </mu-step-button>
            </mu-step>
            <mu-step>
                <mu-step-button @click="tocheck('/forgetpassword/steptwo')">
                    验证代码
                </mu-step-button>
            </mu-step>
            <mu-step>
                <mu-step-button disabled>
                    重置密码
                </mu-step-button>
            </mu-step>
        </mu-stepper>
        <router-view > </router-view >
    </div>
</template>

<script>
    import ajax from  './../plugings/API/myajax'

    export default {
        name: "forgetpassword",
        data(){
            return {
           //     activeStep: 0,
                orientation:"horizontal",
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
            activeStep()
            {
                return this.$store.state.step;
            }
        },
        created()
        {
            const url = 'isloged';
            ajax.ajax(url,{},(response)=>{
                this.$router.push('/');
            },(err)=>{
                    this.getkey();
            });
                this.$store.commit('storeNew',{key:'title_name',data:'Forget'});
                this.$store.commit('storeNew',{key:'sidebarOpen',data:false});
        },
        methods:
        {
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
            tocheck(val)
            {
                this.$router.push(val);
            }
        }

    }
</script>

<style scoped>

    .leftp
    {
        margin-left: 35%;
    }
</style>
