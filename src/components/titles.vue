<template>
    <div style="user-select: none">
        <transition name="fade" >
        <mu-appbar class="toptitle" color="primary" :class="this.$store.state.screen > 4/3 && this.$store.state.sidebarOpen ? '':'long'"  >
            <mu-button icon slot="left" v-if="!this.$store.state.table" @click="titleaction()">
                <!--<mu-icon value="menu" > </mu-icon>-->
                <menuicon :type="type"> </menuicon>
            </mu-button>
                <div v-else slot="left" class="bigtest">
                    <transition name="fade" mode="out-in">
                        {{this.$store.state.title_name}}
                    </transition>
                </div>
                <div v-if="!this.$store.state.table">

                        {{this.$store.state.title_name}}
                </div>
        </mu-appbar>
        </transition>
    </div>
</template>

<script>
    import menuicon from "./menuicon"
    import {mapGetters} from 'vuex'

    export default {
        name: "titles",
        components:{
            menuicon,
        },
        data()
        {
            return {
                type:'menu',
            }
        },
        computed:
        {
            ...mapGetters(["titlename"]),
        },
        watch:{
            titlename(val)
            {
               this.type = this.$store.state.sidebarBanName.includes(val) ? 'back': 'menu';
            },
        },
        created()
        {
            this.type = this.titlename === "Login" ? 'back': 'menu';
        },
        methods:{
            sidebar()
            {
                const isopen = !this.$store.state.sidebarOpen;
                this.$store.commit('storeNew',{key:'sidebarOpen',data:isopen});
            },
            back()
            {
                console.log(this.$route.fullPath.includes("login"));
                if (this.$route.fullPath.includes("login"))
                    this.$router.push("/home");
                else if (this.$route.fullPath.includes("forgetpassword"))
                    if (this.$route.fullPath.includes("/step"))
                        this.$router.push("/forgetpassword");
                    else
                        this.$router.push("/login");
                else
                    this.$router.back(-1);
            },
            titleaction()
            {
                if ( this.type === "menu")
                {
                    this.sidebar();
                }
                else
                {
                    this.back();
                }
            },
        }
    }
</script>

<style scoped>

</style>
