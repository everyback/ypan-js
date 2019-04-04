<template>
    <p>this is share</p>
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
