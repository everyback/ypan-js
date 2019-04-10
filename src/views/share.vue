<template>
    <div>
        <!--<p>this is share</p>-->
        <router-view />

    </div>
</template>

<script>
    export default {
        name: "share",
        created()
        {
            this.$store.commit("storeNew",{key:"title_name",data:"Share"});
        },

    }
</script>

<style scoped>

</style>


