<template>
    <div>
        <ul class="list">
            <li class="in-li">
                <div>
                    用户id：{{}}
                </div>
            </li>
            <li class="in-li">
                <div>
                    用户名
                </div>
            </li>
            <li class="in-li">
                密码
                <div>
                    密码
                </div>
            </li>
            <li class="in-li">

                <div>
                    邮箱
                </div>
            </li>
        </ul>
    </div>
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

    ul{
        list-style: none;
        border-radius: 20px;
    }
    li:nth-child(2n){
        background-color: #f5f5f5;
    }
    li{
        list-style: none;
        background-color: #e0e0e0;
    }
    li:first-child{
        border-radius: 10px 10px 0 0 ;
    }
    li:last-child{
         border-radius: 0 0 10px 10px;
    }
    .list{
        height: 50vh;

    }
    .in-li{
        height: 25%;
    }



</style>
