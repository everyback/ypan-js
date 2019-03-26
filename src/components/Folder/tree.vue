<template>

    <ul v-if="data[0] !== 'empty'">
        <li v-for="(name,index) in data" v-if="data.length !==0" >
            <div class="inli" v-if="data[0] !== 'empty'" @dblclick.stop.self="opens(index)" @click.stop.self="select(index)">
                <span class="more" v-if="data[0] !== 'empty'"   @click.stop.self="opens(index)">[{{ selects[index] ? '-' : '+' }}]</span>
                <mu-icon class="icon" size="25" value="folder"  v-if="!selects[index]"/>
                <mu-icon class="icon" size="25" value="folder_open" v-else />
                <span >{{name.folder_name}}</span>
            </div>
            <tree v-if="selects[index]" :folder="name.folder_name" :dir="dirthis">
            </tree>
        <div  class="inspan" @click.stop.self="noselect()" v-if="data[0] === 'empty'">
            no folder
        </div>
        </li>
    </ul>


</template>

<script>
   // import myajax from '@/plugings/API/myajax'
   import myajax from './../../plugings/API/myajax'
    export default {
        name: "tree",
        props:{
            folder:{
                type:String,
                default:false,
            },
            dir:{
                type:String,
                default:"/",
            },
        },
        data()
        {
            return {
                data:[],
                selects:[],
                loading:true,
                dirthis :"",
                dir_to:"/",
            };
        },
        created()
        {
            let ajax = new myajax();
            let url = 'folder/list';

            if (this.dir === "/")
            {
                this.dirthis = this.dir + this.folder;
            }
            else
            {
                this.dirthis = this.dir + "/" + this.folder;
            }
            this.dir_to = this.dirthis;
            let dirthis = this.dirthis;
                ajax.ajax(url,{dir:dirthis},(response)=>{
                this.res = response;
                console.log(response);
                if (response.data)
                {

                    //this.$set(this,'selects',Array(response.data.data.length).fill(false));
                    this.selects = Array(response.data.length).fill(false);
                    this.data = Array.from(response.data);
                    //console.log(!this.data[0]);
                }
                else
                    this.data = [];
                if (this.data === 0)
                {
                    this.$destroy();
                }
            });
        },
        methods:
            {
                check()
                {
                    console.log(!!this.data[0]);
                    return !!this.data[0];
                },
                opens(index)
                {
                    this.$set(this.selects,index,!this.selects[index]);
                    if (!this.selects[index])
                    {
                        this.dir_to = this.dir;
                    }
                },
                select(index)
                {
                    this.dir_to = this.dir + this.data[index].folder_name;
                    this.$store.commit("storeNew",{key:"dir_to",data:this.dirthis + "/" + this.data[index].folder_name });
                },
                noselect()
                {
                    this.dir_to = this.dir ;
                    this.$store.commit("storeNew",{key:"dir_to",data:this.dirthis });
                }
            }

    }
</script>

<style scoped>

    li{
        cursor: pointer;
        min-width:15rem;
        min-height:3rem;
        text-align: left;
        list-style: none;
        padding-top: 1rem;
        user-select: none;
        /*padding-left: 10px;*/
    }
    .inli{
        min-height: 3rem;

    }
    li:hover{
        background-color: #e0e0e0;
    }
    li:hover>ul {
        background-color: whitesmoke;
    }
    li:hover>div>ul {
        background-color: whitesmoke;
    }

    li:hover>li {
        background-color: #e0e0e0;
    }
    .more{
        margin-right: 20px;
    }
    span{
        padding-left: 10px;
    }
    .icon{
        transform: translateY(5px);
    }
</style>
