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
            let isrole = !!this.$store.state.role;
            console.log(this.$store.state.login);
            localStorage.clear();
            sessionStorage.clear();
           // this.$store.commit("storeNew",{key:'user_info',data:{}});
            this.$store.commit("storeNew",{key:'login',data:false});
            this.$store.commit("storeNew",{key:'r_map',data:[]});
            this.$store.commit("storeNew",{key:'path',data:['/']});
            this.$store.commit("storeNew",{key:'dir_to',data:"/"});
            this.$store.commit("storeNew",{key:'role',data:false});
            this.$store.commit("storeNew",{key:'role_items',data:[]});
            sessionStorage.setItem("role",false);
            this.$router.push('login');
            //location.reload();
            console.log('退出成功');
           // this.$router.push('login');
            if (this.$store.state.login === true)
            {
                ajax.ajax(url,{},(response)=>{
                    localStorage.clear();
                    sessionStorage.clear();
                    this.$store.commit("storeNew",{key:'user_info',data:{}});
                    this.$store.commit("storeNew",{key:'login',data:false});
                    this.$store.commit("storeNew",{key:'r_map',data:[]});
                    this.$store.commit("storeNew",{key:'path',data:['/']});
                    this.$store.commit("storeNew",{key:'dir_to',data:"/"});
                    this.$store.commit("storeNew",{key:'role',data:false});
                    this.$store.commit("storeNew",{key:'role_items',data:[]});
                    sessionStorage.setItem("role",false);
                    console.log('退出成功');
                    this.$router.push('login');

                },(err)=>{
                    localStorage.clear();
                    sessionStorage.clear();
                    this.$store.commit("storeNew",{key:'user_info',data:{}});
                    this.$store.commit("storeNew",{key:'login',data:false});
                    this.$store.commit("storeNew",{key:'r_map',data:[]});
                    this.$store.commit("storeNew",{key:'path',data:['/']});
                    this.$store.commit("storeNew",{key:'dir_to',data:"/"});
                    this.$store.commit("storeNew",{key:'role',data:false});
                    this.$store.commit("storeNew",{key:'role_items',data:[]});
                    sessionStorage.setItem("role",false);
                    console.log(err.response);
                    this.$router.push('login');
                },'post').then(()=>{
                   // if (isrole)
                    localStorage.clear();
                    sessionStorage.clear();
                    this.$router.push('login');
                     //   location.reload();
                    });
            }
            else
            {
                this.$router.push("/login");
            }

        },
        destroyed()
        {
            location.reload();
        }
    }
</script>

<style scoped>

</style>
