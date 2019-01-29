<template>
    <div>
        <mu-appbar class="toptitle" color="primary" :class="this.$store.state.screen > 4/3 && this.$store.state.sidebarOpen ? '':'long'"  >
            <mu-button icon slot="left" v-if="!this.$store.state.table" @click="sidebar()">
                <mu-icon value="menu" > </mu-icon>
            </mu-button>
            <div v-else slot="left" class="bigtest">
                {{this.$store.state.title_name}}
            </div>
            <div v-if="!this.$store.state.table">
                {{this.$store.state.title_name}}
            </div>
        </mu-appbar>
    </div>
</template>

<script>
    export default {
        name: "titles",
        methods:{
            sidebar()
            {
                const isopen = !this.$store.state.sidebarOpen;
                this.$store.commit('newdata',{key:'sidebarOpen',data:isopen});
            }
        }
    }
</script>

<style scoped>

</style>
