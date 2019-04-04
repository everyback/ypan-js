<template>
    <mu-dialog :width="700" :open.sync="open">
        <P>当前选定位置:{{this.$store.state.dir_to}}</P>
        <div class="india">
            <ul>
                <li>
                    <div class="inli"  @dblclick.stop.self="opens_r()" @click.stop.self="select_r()">
                        <span class="more" v-if="data[0] !== 'empty'" @click.stop.self="opens_r()">[{{ open_r ? '-' : '+' }}]</span>
                        <mu-icon class="icon" size="25" value="folder"  v-if="!open_r"/>
                        <mu-icon class="icon" size="25" value="folder_open" v-else />
                        <span> / </span>
                    </div>
                </li>
                <li v-if="open_r">
                    <ul>
                        <li v-for="(name,index) in data" v-if="data.length !==0"   >
                            <div class="inli" v-if="data[0] !== 'empty'" @dblclick.stop.self="opens(index)" @click.stop.self="select(index)">
                                <span class="more" v-if="data[0] !== 'empty'" @click.stop.self="opens(index)">[{{ selects[index] ? '-' : '+' }}]</span>
                                <mu-icon class="icon" size="25" value="folder"  v-if="!selects[index]"/>
                                <mu-icon class="icon" size="25" value="folder_open" v-else />
                                <span>{{name.folder_name}}</span>
                            </div>
                            <tree v-if="selects[index]" :folder="name.folder_name" :dir="dir">
                            </tree>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <mu-button slot="actions" flat color="primary" @click="closedialog()" >Cancel</mu-button>
        <mu-button slot="actions" flat color="primary" @click="action()" >Ok！</mu-button>
    </mu-dialog>
</template>

<script>
    import myajax from './../../plugings/API/myajax'
    import Tree from "./tree";
    import {mapGetters} from 'vuex'


    export default {
        components: {Tree},
        name: "folder",
        props:{
            action:{
                type:Function,
                default:()=>{},
            },
            open:{
                type:Boolean,
                default:false,
            }
        },
        data()
        {
            return {
                data:[],
                res :{},
                selects:[],
                open_r:true,
              //  open_dialog:false,
                dir:"/",
                dir_to:"/",
                dialog:{
                    open:false,
                },
            };
        },
        created()
        {
            this.dialog.open = this.open;

          // this.getlist();

        },
        mounted()
        {
            //console.log(this.res);

        },
        computed:
            {
                ...mapGetters(['dialog_c']),
            },
        watch:{
            open(val)
            {
              if (val)
              {
                  this.dialog.open = this.open;
                  this.getlist();
              }
            },
            dialog_c(val)
            {
                console.log("closed");
                if (!val)
                    this.closedialog();
            }
        },
        methods:
            {
                check()
                {
                   // console.log(this.data.length);
                    return this.data.length !== 0 && this.data.length !== undefined;
                },
                makeFolder()
                {

                },
                opens(index)
                {
                    //console.log("aaaaa");
                    this.$set(this.selects,index,!this.selects[index]);
                    if (!this.selects[index])
                    {
                        this.dir_to = this.dir;
                    }
                   // this.selects[index] = !this.selects[index];
                },
                select(index)
                {
                    this.dir_to = this.dir + this.data[index].folder_name;
                    this.$store.commit("storeNew",{key:"dir_to",data:this.dir_to});
                },
                opens_r()
                {
                    this.open_r = !this.open_r;
                },
                select_r()
                {
                    this.dir_to = "/";
                    this.$store.commit("storeNew",{key:"dir_to",data:"/" });
                },
                closedialog()
                {
                   // this.dialog.open = false;
                    //this.open = false;
                    //this.$destroy();
                    this.$emit("update:open",false);
                },
                getlist()
                {
                    let ajax = new myajax();
                    let url = 'folder/list';
                    let dir = "/";
                    ajax.ajax(url,{dir},(response)=>{
                        this.res = response;
                        console.log(response.data);
                        if (response.data)
                        {
                            //this.$set(this,'selects',Array(response.data.data.length).fill(false));
                            this.selects = Array(response.data.length).fill(false);
                            this.data = Array.from(response.data);
                        }
                        else
                            this.data = [];
                    });
                },

            },

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
        font-size: medium;
        user-select: none;
        /*padding-left: 10px;*/
    }
    ul{
        background-color: whitesmoke;
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
    .india{
        max-height: 60vh;
        overflow: auto;
    }
</style>
