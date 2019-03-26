<template>

</template>

<script>

    import myajax from './../plugings/API/myajax'

    export default {
        name: "logout",
        beforeMount()
        {
            let url = 'auth/logout';
            let ajax = new myajax();
            ajax.ajax(url,{},(response)=>{
                localStorage.clear();
                sessionStorage.clear();
                this.$store.commit("storeNew",{key:'user_info',data:{}});
                this.$store.commit("storeNew",{key:'login',data:false});
                console.log('退出成功');
                this.$router.push('login');
             //   this.$router.back(-1);

            },(err)=>{
                localStorage.clear();
                sessionStorage.clear();
                this.$store.commit("storeNew",{key:'user_info',data:false});
                this.$store.commit("storeNew",{key:'login',data:false});
                console.log(err.response);
                this.$router.push('login');
              //  this.$router.back(-1);
            },'post');
        },
    }
</script>

<style scoped>

</style>
