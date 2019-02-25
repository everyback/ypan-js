<template>
    <div class="box" :class="type==='menu' ?'':'bbox'">
        <div class="top legt" :class="type==='menu' ?'':'btop'" ></div>
        <div class="middum legt  " :class="type==='menu' ?'':'bmiddum'"></div>
        <div class="buttom legt " :class="type==='menu' ?'':'bbuttom'"></div>
    </div>
</template>

<script>
    export default {
        name: "menuicon",
        props:{
            type:{
                type:String,
                default:"menu",
            }
        },

    }
</script>

<style scoped>
    .top{
        transition: all 0.5s ease-in-out 0s;
    }
    .middum{
        position: relative;
        top: 8px;
        transition: all 0.5s ease-in-out 0s;
    }
    .buttom {
        position: relative;
        top: 16px;
        transition: all 0.5s ease-in-out 0s;
    }
    .legt{
        width: 2.8rem;
        height: 0.3rem;
        border-radius: 0.1875rem;
        background-color: #ffffff;
    }
    .box{
        transform: scale(0.4);
        margin-bottom: 0.5rem;
        transition: all 0.3s ease-in-out 0s;
    }
    .bbox{
        transform: scale(0.5);
    }
    .bmiddum
    {
        width: 2.3rem;
        transform: rotate(-180deg) ;
    }
    .btop
    {
        width: 1.5625rem;
        transform: rotate(-45deg) translateX(-0.45rem) translateY(0.122rem);
    }
    .bbuttom
    {
        width: 1.5625rem;
        transform: rotate(45deg) translateX(-0.45rem) translateY(-0.122rem);
    }
    .box:hover
    {
        transform:scaleX(0.5) scaleY(0.45);
    }

</style>
