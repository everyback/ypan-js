


<template>
    <mu-dialog :width="700" :open.sync="open" :overlay-close="false">
        <!--<p>当前选定位置:{{this.$store.state.dir_to}}</p>-->
        <div class="india" v-if="!havelink">
                <p>请选择分享方式</p>
            <div class="select-block">
                <mu-flex class="select-control-row select-s" :key="index" v-for="(items,index) in share_type">
                    <mu-radio  :value="items.key" v-model="private"  :label="items.name" class=" in-radio" />
                    <span class="explanation"> {{items.explanation}}
                    </span>
                </mu-flex>
            </div>

            <mu-select label="选择有效期" v-model="share_day" style=" margin-left: 10px; margin-top: 20px" >
                <mu-option v-for="(items,index) in days" :key="index" :label="items.name" :value="items.day" />
            </mu-select>
        </div>
        <div v-else>
            <mu-alert color="success" v-if="setalert" delete   @delete="()=>this.setalert = false">
                <mu-icon left value="check_circle"/> 链接生成完毕
            </mu-alert>
            <div>
                <span>访问链接:</span><mu-text-field  disabled :value="link.path" class="textarea" />
            </div>
            <div v-if="link.code !== ''">
                <span>提取码:</span><mu-text-field  disabled :value="link.code" class="textarea"  />
            </div>

            <p v-if="share_day !== -1">该链接有效期为: {{share_day}}天 </p>
            <p v-else>该链接有效期为: 永久 </p>
            <mu-button class="copybtn" flat color="red" @click="copylink()"> Copy Link </mu-button>
            <span v-if="copysuccess">  复制成功</span>
        </div>


        <mu-button slot="actions" flat color="red" @click="close()" >Cancel</mu-button>
        <mu-button slot="actions" flat color="primary" @click="createlink()" >Ok！</mu-button>
    </mu-dialog>
</template>

<script>
    import myajax from './../plugings/API/myajax'

    import {mapGetters} from 'vuex'
    import shareAPI from './../plugings/API/shareAPI'
    import Clipboard from 'clipboard';
    // import MuButton from "muse-ui/es5/Button/Button";
    // import MuRadio from "muse-ui/es5/Radio/Radio";


    export default {
        components: {
            // MuButton
             // MuRadio,
            },
        name: "selectshare",
        props:{
        /*    action:{
                type:Function,
                default:()=>{},
            },*/
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
                havelink:false,
                setalert:true,
                copysuccess:false,
                link:{
                    path:'',
                    code:'',
                },

                share_day:7,
                days:[
                    {name: "7天", day: 7},
                    {name: "15天", day: 15},
                    {name: "永久", day: -1},
                ],
                private:false,
                share_type:[
                    {name:"公开", explanation:"您的分享链接将可以被公开展示" ,  key:false},
                    {name:"加密", explanation:"您的分享链接将需要访问码访问并不会被公开展示" ,key:true},
                ],
            };
        },
        created()
        {

        },
        mounted()
        {
            //console.log(this.res);

        },
        computed:
            {
                ...mapGetters(['dialog_c',"fullPath"]),
            },
        watch:{
/*            open(val)
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
            }*/
        },
        methods:
            {
                createlink()
                {
                    if (this.havelink === true)
                    {
                        this.close();
                    }
                    else {
                        let data = this.$store.state.selected;
                        shareAPI.create(data,this.private,this.share_day,this.fullPath).then((resolve)=>{
                            this.havelink = true;
                            this.link.path = resolve.path;
                            if (resolve.code)
                            {
                                this.link.code = resolve.code;
                                // this.link.code = resolve.code;
                            }
                        });
                    }
                },
                copylink()
                {
                  //  let Url = this.versions[index].notifyUrl;
                    let text = this.link.code === "" ?  `分享链接:${this.link.path}`:`分享链接:${this.link.path}\n 提取码:${this.link.code}`;

                    let clipboard = new Clipboard('.copybtn', {
                        text: ()=> {
                                return text;
                        }
                    });
                    clipboard.on('success', e => {
                         console.log("复制成功!");
                        // 释放内存
                        this.copysuccess = true;
                        clipboard.destroy()
                    });
                    clipboard.on('error', e => {
                        // 不支持复制
                        // tips(this, '该浏览器不支持自动复制!', 'warning');
                        // 释放内存
                        clipboard.destroy()
                    })


                },
                close()
                {
                    this.$emit("update:open",false);
                    this.link = {
                            path:'',
                            code:'',
                    };
                    this.havelink = false;
                    this.setalert = true;
                    this.copysuccess = false;

                }
            },

    }
</script>

<style scoped>

    .select-control-row
    {
        /*white-space:nowrap;*/
    }
    .select-s
    {
        display: inline-block;
        float: left;
        vertical-align:bottom;
        width: 80%;
        height: 2rem;
        margin-left: 10px;

        margin-top: 20px;

    }

    .select-block
    {
        width: 100%;
    }

    .select-block:after{
        content: '';
        visibility:hidden;
        display:block;
        clear:both;
    }
    .explanation{
        display: inline-block;
        position: relative;
        font-size: 0.8em;
        color: #bdbdbd;
        text-align: center;
        /*vertical-align:bottom;*/
        top: 4px;
        bottom: 0;
        height: 100%;
    }
    .textarea{
        width: 25rem;
        margin-left: 20px;
    }

    .in-radio{
        margin-right:30px;
    }
    .india{
        max-height: 60vh;
        overflow: auto;
        margin:auto;
        width:90%;
    }

    .copybtn
    {

    }
</style>
