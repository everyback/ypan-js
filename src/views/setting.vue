<template>
    <p>this is setting</p>
</template>

<script>
    export default {
        name: "setting",
        created()
        {
            this.$store.commit("storeNew",{key:"title_name",data:"Setting"});

        },
    }
</script>

<style scoped>

</style>
