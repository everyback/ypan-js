<template>
    <div  class="pan"  @mouseover.self="outover()"  >
        <!--<transition-group appear  name="fadeLeft" mode="out-in" :duration="300" tag="div" >-->
        <transition appear  name="zoom" mode="out-in" :duration="300" >
            <dl style="margin: auto;margin-bottom: 5px; background-color: rgba(230,231,230,0.1);width:98%;"  >
                <dt style="border-bottom:1px solid #bbdefb;">
                    <ul class="ul-head">
                        <li class="li-head" style="width: 40px;position: relative;top:8px">
                            <mu-checkbox   @change="to_selectall()"  :checked-icon="!!selectall  ? 'indeterminate_check_box' :'check_box'"> </mu-checkbox>
                        </li>
                        <li class="li-head filename-width" @click="tosort('name')">
                            分享文件名
                        </li>
                        <li class="li-head read-width">
                            浏览次数
                        </li>
                        <li class="li-head resave-width">
                            转存次数
                        </li>
                        <li class="li-head download-width">
                            下载次数
                        </li>
                        <li class="li-head download-width">
                            分享形式
                        </li>
                        <li class="li-head time-width" >
                            分享时间
                        </li>
                    </ul>
                </dt>
                <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" style="overflow: auto;height: 720px ;"  @scroll="lazyload($event)" >
                    <div v-if="datas.length !== 0" ref="toscroll" id="scr"  >
                        <dd   v-for="(value,index) in datas" :key="value + '/'+index " class="dds" :class="[selects[index] ? 'selected':'',hoverindex === index ? 'dds-hover':'']"  @mouseover="isonover(index)"  @mouseleave="isonleave(index)" >
                            <div  @dblclick="to(value.share_path)"  @click="showlink(index)"  >
                            <span class="text-left in-block " style="width: 40px;position: relative;top:8px">
                                <mu-checkbox v-model="selects[index]" />
                            </span>
                                <span class="text-left in-block filename-width " @click="showlink(index)">
                                <mu-icon class="icon" size="24" value="insert_drive_file" color="#b3e5fc"  />
                                    <!--<mu-tooltip class="hidename" style="width:80%" placement="bottom" :content="value.folder_name">-->
                                <router-link class="left-margin hidename"   :to="'/share/link/' + value.share_path">{{value.show_name}}</router-link>
                                    <!--</mu-tooltip>-->
                            </span>
                            <span class=" in-block read-width">
                                {{value.read}}次
                            </span>
                            <span class=" in-block resave-width">
                                {{value.resave}}次
                            </span>
                            <span class=" in-block download-width">
                                {{value.download}}次
                            </span>
                            <span class=" in-block download-width">
                                {{value.private === "0" ? "公开": "加密"}}
                            </span>

                            <span class=" in-block time-width"  @click="showlink(index)" >
                                {{ format(value.created_at)}}
                             </span>
                            </div>
                            <span class=" in-block" style="position: absolute;left: 35%;top:0;" v-if="hoverindex === index" >
                                <mu-button icon color="error" small class="name-button" @click="tocancelshare(index)">
                                        <mu-icon value="delete_forever" />
                                </mu-button>
                            </span>
                            <div v-if="showlinks === index" class="dds" style="padding-left: 0">
                                <div style="padding-left:0;position: relative ;width:350px">
                                    分享链接: {{webpath}}/share/link/{{value.share_path}}
                                    <span class="in-block" style="margin-left: 20px"  v-if="value.private === '1'" > 提取码：{{value.code}}</span>
                                    <span class="in-block" style="margin-left: 20px" v-if="value.private === '0'"> 公开分享</span>
                                    <span class="in-block" style="margin-left: 20px" v-else> 私密分享</span>
                                    <mu-button class="copybtn" style="margin-left: 10px" flat color="red" @click="copylink(index)"> Copy Link </mu-button>
                                </div>

                            </div>
                        </dd>
                    </div>
                    <div v-else>
                        no share(s)
                    </div>
                </mu-load-more>
            </dl>
        </transition>
        <a :href="herf" :download="downloadname" v-show="false"  ref="downloadfile">4</a>
        <my-dialog   :action="()=>todelete()" :open.sync="selectopen.delete"  :name="'取消分享'" :message="'确认要取消'+selectnumber +'个分享么?'" :confirm="true" />
    </div>

</template>

<script>
    import {mapGetters} from 'vuex'
    import myajax from './../plugings/API/myajax'
    import formats from './../plugings/formats'
    import FolderAPI from '../plugings/API/folderAPI'
    import FileAPI from '../plugings/API/fileAPI'
    import ShareAPI from "../plugings/API/shareAPI"
    import MyDialog from "../components/myDialog";
    import Clipboard from 'clipboard';

    export default {

        components: {MyDialog},
        name: "myshare",
        props:{
            delete:{
                type:Function,
                default:()=>{},
            },
        },
        data()
        {
            return {
                refreshing: false,
                loading: false,
                text: 'List',
                page:1,
                pagesize:20,
                datas:[],
                selects:[],
                all:0,
                new_name:'',
                test:false,
                end:false,
                firstin:true,
                filelist:false,
                over:false,
                hoverindex:-1,
                // rename: [],
                herf:'',
                downloadname:'',
                selectnumber:5,
                showlinks:-1,
                isdownload:false,
                selectopen:{
                    delete:false,
                },
                selectpaths:[],
                webpath :'',

            }
        },
        created()
        {
            this.datas = [];
            this.$store.commit("storeNew",{key:"title_name",data:"My Share"});
            let a = window.location.href.split("/");
            a.pop();
            this.webpath = "http://"+a.pop();
            // if (this.$store.state.path.length === 1 && this.$route.query.path)
            // {
            /*                let arr = this.$route.query.path.split('/');
                            arr = arr.filter((val)=>{
                                return !(val === "" || val === "/");
                            });
                            arr.unshift("/");
                            if (arr.length !== 0 )
                            {
                                this.$store.commit('changePath',arr)
                            }
                        }
                        if (sessionStorage.getItem(this.fullPath) && JSON.parse(sessionStorage.getItem(this.fullPath)).datas.length !== 0 )
                        {
                            this.page = JSON.parse(sessionStorage.getItem(this.fullPath)).page;
                        }
                        if (!this.$route.query.path && !this.$route.query.search)
                        {
                            this.listfile(this.page);
                        }
                        else if (this.$route.query.path )
                        {*/
            this.listfile(this.page,this.getpath());
            /* }
             else if (this.$route.query.search)
             {
                 console.log("search");
                 console.log(this.$route.query.search);
             }*/


        },
        computed:
            {
                ...mapGetters(['fullPath','paths',"fresh","cnfolder","isrename"]),
                /* key() {
                     return this.$route.name !== undefined? this.$route.name +new Date(): this.$route +new Date()
                 },*/
                testa()
                {
                    return this.$store.state.path.join('/');
                },
                path()
                {
                    let arr = this.$store.state.path;
                    arr = arr.filter((val)=>{
                        return !(val === "" || val === "/");
                    });
                    arr.unshift("");
                    return arr.join('/');
                },
                selectall()
                {
                    return this.selects.every((val)=>{
                        return val
                    })
                },

            },
        watch:{
            path(val)
            {
                // console.log(val);
                // console.log("aaaaaaaaaaa");
                this.listfile(this.page,val);
            },
            /*selects(val)
            {
                let file = [];
                let folder = [];
                let data = {};
                this.rename = [];
                this.selects.forEach((val, index) => {
                    if (val) {
                        this.datas[index].is_file ? file.push(this.datas[index].file_name) : folder.push(this.datas[index].folder_name);
                        this.rename.push(index);
                    }
                });

                data = {folder, file};
                this.$store.commit("storeNew",{key:"selected",data});
            },*/
            fresh(val)
            {
                if (val)
                {
                    this.listfile(1,this.getpath());
                    this.$store.commit("storeNew",{key:"refresh",data:false});
                    this.end = false;
                }
            },
            cnfolder(val)
            {
                //console.log("a.scrollTdfgdfgdfgop");
                let a = document.querySelector('#scr');
                console.log(a.scrollTop);
                if (val)
                    a.scrollTop = 0;
                //   document.documentElement.scrollTop = 0;
            },



        },
        methods:{
            refresh () {
                this.refreshing = true;
                // sessionStorage.removeItem(this.getpath());
                this.page = 1;
                this.listfile(1).then((result)=>{
                    this.refreshing = false;
                    this.end = false;
                    //  this.page = 1;
                },(reject)=>{
                    this.refreshing = false;
                });

            },
            load () {
                this.loading = true;
                if (!this.end)
                {
                    this.listfile(this.page++).then(()=>{
                        this.loading = false;
                    });
                }
                else {
                    this.loading = false;
                }
                return 0;
            },
            intofolder(foldername)
            {
                let dir = this.fullPath.length === 1 ? this.fullPath + foldername : this.fullPath+'/'+foldername;
                //  console.log(foldername);
                this.page = 1;
                this.listfile(1,dir,foldername);

            },
            format(time)
            {
                return formats.format(time);
            },
            bytesToSize(size)
            {
                return formats.bytesToSize(size);
            },
            listfile(page ,dir = null,foldername = null)
            {
                return new Promise((resolve,reject)=>{
                    ShareAPI.usershare(page).then((resolves)=>{
                        if (page === 1) {
                            this.datas = [];
                        }
                        if (page === 1)
                        {
                            this.selects = Array(this.datas.length).fill(false);
                        }
                        else {
                            let lens = this.datas.length - this.selects.length;
                            this.selects = this.selects.concat(Array(lens).fill(false));
                        }
                        if (resolves.length === 0)
                        {
                            this.end = true;
                        }else
                        {
                            console.log(resolves);
                            this.datas = this.datas.concat(resolves);
                        }
                        resolve();
                    });
                });
            },
            getpath(index = null)
            {
                let arr = this.$store.state.path;
                arr = arr.filter((val)=>{
                    return !(val === "" || val === "/");
                });
                arr.unshift("");
                if (index)
                {
                    arr = arr.slice(0,index);
                    return arr.join('/');
                }
                if (arr.length === 1)
                {
                    return '/';
                }
                return arr.join('/');
            },
            tonot()
            {
                return false;
            },
            to_selectall()
            {
                if (this.selectall)
                {
                    this.selects = Array(this.datas.length).fill(false)
                }
                else
                {
                    this.selects = Array(this.datas.length).fill(true);
                }
            },
            set(index)
            {
                this.selects = Array(this.datas.length).fill(false);
                this.$set(this.selects,index,true);

                this.openlist = false;  //修改层次
                this.hoverindex = index;
            },
            createfolder()
            {
                let foldername = this.new_name;
                let dir = this.fullPath;
                FolderAPI.createfile(foldername,dir).then((resolve)=>{
                    this.$store.commit("storeNew",{key:'createnewfolder',data:false});
                    this.new_name = '';
                    sessionStorage.removeItem(dir);
                    this.listfile(1);
                },(reject)=>{
                    console.log(reject);
                });
            },
            copylink(index)
            {
                //  let Url = this.versions[index].notifyUrl;
                let text = this.datas[index].code === "0" ?  `分享链接:${this.webpath + "/" + this.datas[index].share_path}`:`分享链接:${this.webpath + "/" + this.datas[index].share_path}\n 提取码:${this.datas[index].code}`;

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
            cancelcreate()
            {
                this.$store.commit("storeNew",{key:'createnewfolder',data:false});
                this.new_name = '';
            },
            to(sharepath)
            {
                this.$router.push("/share/link/"+sharepath);
            },

            tosort(by)
            {
                console.log("fdgdfgd");
                if (this.filelist)
                {
                    this.datas = this.datas.sort((a,b)=>{return toString((b["folder_name"])).localeCompare( (a["folder_name"])) });
                    this.datas = this.datas.sort((a,b)=>{return toString((b["file_name"])).localeCompare( (a["file_name"])) });
                }
                else
                {
                    this.datas = this.datas.sort((a,b)=>{return toString((a["folder_name"])).localeCompare( (b["folder_name"]))});
                    this.datas = this.datas.sort((a,b)=>{return toString((a["file_name"])).localeCompare( (b["file_name"])) });
                }
                this.filelist = !this.filelist;
                /*(a,b)=>{return (a["folder_name"||"file_name"]).localeCompare(b["folder_name"||"file_name"])}*/
            },
            isonover(index)
            {
                if (!this.openlist)
                {
                    this.hoverindex = index;

                }
                // this.openlist = false;
            },
            isonleave(index)
            {
                if (!this.openlist)
                {
                    this.hoverindex = -1;
                    this.openlist = false;
                }
            },
            outover()
            {
                if (!this.openlist)
                {
                    this.hoverindex = -1;
                    this.openlist = false;
                }
            },
            isoutside()
            {
                this.openlist = false;
                this.hoverindex = -1 ;
            },
            lazyload(e)
            {
                console.log(e);
            },
            showlink(index)
            {
                if(this.showlinks === index)
                {
                    this.showlinks = -1;

                }else
                {
                    this.showlinks = index;

                }
            },
            godownload(index)
            {
                ShareAPI.download({folder:[],file:[]},'/',this.datas[index].share_path).then((resolve)=>{
                    console.log(resolve);
                    this.isdownload = true;
                    this.herf = "http://" + resolve.path;
                    this.downloadname = resolve.name;
                    this.$nextTick(()=>{
                        this.$refs.downloadfile.click();
                        this.isdownload = false;
                    });
                });
            },
            tocancelshare(tocancelshare)
            {
                let sel = this.selects;
                this.selectpaths = [];
                sel.forEach((val,index)=>
                {
                    if (val === true)
                        this.selectpaths.push(this.datas[index].share_path)
                });
                this.selectnumber = this.selectpaths.length;
                this.selectopen.delete = true;
            },
            todelete()
            {

                ShareAPI.todelete(this.selectpaths).then(()=>{
                    this.listfile(1);
                });
            },
            selectcalcel(index)
            {
                this.selectnumber = 1;
                this.selectopen.delete = true;
            }
        }
    }
</script>

<style scoped>

    .pan
    {
        /*user-select: none;*/
    }
    ul li{
        list-style: none;
    }

    .ul-head{
        padding-left: 0;
    }
    .in-block{
        display: inline-block;
        /*user-select: none;*/
        vertical-align:top;
    }
    .filename-width{
        width: 38%;
    }

    .size-width{
        width: 8%;
    }
     .read-width{
         width: 8%;
     }
     .resave-width{
         width: 8%;
     }
     .download-width{
         width: 8%;
     }
     .copybtn{

     }
    .time-width{
        width: 24%;
    }
    .text-left{
        text-align: left;
    }

    .li-head{
        display: inline-block;
        text-align: left;
        vertical-align: bottom;
    }
    .returnone{
        margin-top: 0.9rem;
        margin-left: 1rem;
        width: 5rem;
        float: left;
    }
    .dds{
        min-height: 3em;
        line-height:3em;
        margin-left: 0;
        position: relative;
        /*font-size: 0;*/
        /*-webkit-text-size-adjust:none;*/
        /*border-top: 1px solid black;*/
        /*overflow:hidden;*/
        white-space:nowrap;
        border-bottom:1px solid #e3f2fd;
    }
    .hidename{
        text-overflow:ellipsis;
        white-space:nowrap;
        overflow:hidden;
        max-width:650px;
    }
    /* .dds:hover{
         background-color: #e0e0e0;
     }*/
    .dds-hover{
        background-color: #e0e0e0;
    }
    .name-button
    {
        top:3px;
        margin-left: 15px;
    }
    .icon{
        /*top: 10px;*/
        transform: translateY(6px);
    }
    .left-margin{
        margin-left: 10px;
    }
    .selected{
        background-color: #f5f5f5;
    }

    @media screen and ( max-aspect-ratio:10/16	)
    {
        .filename-width{
            width: 30%;
            text-overflow:ellipsis;
        }
        .size-width{
            width: 15%;
        }
        .time-width{
            width:30%;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
        .dds{
            height: 6em;
            line-height:6em;
            margin-left: 0;
            /*border-top: 1px solid black;*/
            border-bottom:1px solid #e3f2fd;
        }
        .returnone{
            margin-top: 1.8rem;
            margin-left: 1rem;
            width: 5rem;
            float: left;
        }
        .phone{
            width: 3rem;
        }
    }



</style>

