<template>
    <mu-dialog title="Dialog" width="360" :open.sync="dialog.open" :overlay-close="false" :esc-press-close="false">
        <span slot="title">{{dialog.name}}</span>
        {{dialog.msg}}
        <mu-button slot="actions" flat color="primary" @click="closedialog()" v-if="confirm">Cancel</mu-button>
        <mu-button slot="actions" flat color="primary" @click="closedialog(dialog.path)" >Ok！</mu-button>
    </mu-dialog>
</template>

<script>
    export default {
        name: "my-dialog",
        props:{
            open:{
                type:null,
                default:false,
            },
            name:{
                type:String,
                default:'信息',
            },
            message:{
                type:String,
                default:'?????',
            },
            path:{
                type:null,
                default:'',
            },
            confirm:{
                type:null,
                default:false,
            },
            action:{
                type:Function,
                default:()=>{},
            },

        },
        data()
        {
            return {
                dialog:{
                    open:false,
                    name:'提示',
                    msg:'nodata',
                    path:'',
                    confirm:false,
                },
            }
        },
        watch:{
            open:{
                //  deep:true,
                handler:function (){
                    if (this.open )
                        this.dialog.open = this.open;
                        this.dialog.name = this.name;
                        this.dialog.msg  = this.message;
                        this.dialog.path = this.path;
                        this.dialog.confirm = this.confirm;
                },
            }
        },
        methods:
            {
                closedialog(path = undefined)
                {
                    //console.log(path);
                    this.action();
                    this.dialog.open = false;
                    !!path  ? this.$router.push(path):'';
                },
            }


    }
</script>

<style scoped>

</style>
