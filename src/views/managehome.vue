<template>
    <p>managehome</p>
</template>

<script>
    export default {
        name: "managehome",
        created()
        {
            this.$store.commit("storeNew",{key:"title_name",data:"Manage"});

        },
    }
</script>

<style scoped>

</style>
