<template>



    <div  class="pan"  >
        <router-link v-if="!(fullsharefolderpath === '/')" ondragstart="return false" class="text-left in-block returnone" :to="{ name: 'sharecontentpan', query: { path: getpath(paths.length -1 ) }}"> 返回上一层 </router-link>
        <mu-breadcrumbs class="left-leave" >
            <mu-icon value="chevron_right" slot="divider"/>
            <mu-breadcrumbs-item v-for="(value,index) in this.$store.state.path" :key="value + '/'+index" :to="{ name: 'sharecontentpan', query: { path: getpath(index + 1) }}" :disabled=" index === paths.length - 1 "  >{{value}}</mu-breadcrumbs-item>
        </mu-breadcrumbs>
        <transition appear  name="zoom" mode="out-in" :duration="300" >
            <dl style="margin: auto;margin-bottom: 5px; background-color: rgba(230,231,230,0.1);width:98%;"  >
                <dt style="border-bottom:1px solid #bbdefb;">
                    <ul class="ul-head">
                        <li class="li-head" style="width: 40px;position: relative;top:8px">
                            <mu-checkbox   @change="to_selectall()"  :checked-icon="!!selectall  ? 'indeterminate_check_box' :'check_box'"> </mu-checkbox>
                        </li>
                        <li class="li-head filename-width" @click="tosort('name')">
                            文件名
                        </li>
                        <li class="li-head size-width">
                            大小
                        </li>
                        <li class="li-head time-width" >
                            修改时间
                        </li>
                    </ul>
                </dt>
                <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" style="overflow: auto;height: 580px ;"  @scroll="lazyload($event)" >
                    <div v-if="datas.length !== 0" ref="toscroll" id="scr"  >
                        <dd   v-for="(value,index) in datas" :key="value + '/'+index " class="dds" :class="[selects[index] ? 'selected':'',hoverindex === index ? 'dds-hover':'']"  @mouseover="isonover(index)"  @mouseleave="isonleave(index)" >
                            <div v-if="value.isfile === 0" @dblclick="to(value.name)"  >
                                <span class="text-left in-block " style="width: 40px;position: relative;top:8px">
                                    <mu-checkbox v-model="selects[index]" />
                                </span>
                                <span class="text-left in-block filename-width " @click.self.stop="set(index)"  >
                                <mu-icon class="icon" size="24" value="folder" color="amber200"  />
                                     <router-link class="left-margin hidename"   :to="{ name: 'sharecontentpan', query: { path: fullsharefolderpath+'/'+ value.name }}">{{value.name}}</router-link>
                                </span>
                                <span class="text-left in-block size-width" @click.self.stop="set(index)">
                                    --
                                </span>
                                <span class="text-left in-block time-width" @click.self.stop="set(index)">
                                    {{ value.updated_at}}
                                 </span>
                                </div>
                            <div v-else>
                                <div class="text-left in-block " style="width: 40px;position: relative;top:8px">
                                    <div>
                                        <mu-checkbox v-model="selects[index]" />
                                    </div>
                                </div>
                                <div class="text-left in-block filename-width  "  @click.self.stop="set(index)"  >
                                    <div  class="hidename" >
                                        <mu-tooltip class="hidename" style="width:80%" placement="bottom" :content="value.name">
                                            <span>{{value.name}}</span>
                                        </mu-tooltip>
                                    </div>
                                </div>
                                <span class="text-left in-block size-width">
                                <span > {{bytesToSize(parseInt(value.size))}}</span>
                                </span>
                                <span class="text-left in-block time-width">
                                    {{ value.updated_at}}
                                </span>
                            </div>
                            <span class=" in-block" style="position: absolute;left: 45%;top:0;" v-if="hoverindex === index" >
                                <mu-button icon color="error" small class="name-button" @click="download(index)">
                                    <mu-icon value="cloud_download" />
                                </mu-button>
                            </span>
                        </dd>
                    </div>
                    <div v-else>
                        nofile(s)
                    </div>
                </mu-load-more>
            </dl>
        </transition>
        <a :href="herf" :download="downloadname" v-show="false"  ref="downloadfiles">4</a>
    </div>
</template>

<script>

    import myajax from './../plugings/API/myajax'
    import {mapGetters} from 'vuex'
    import formats from './../plugings/formats'
    import ShareAPI from "../plugings/API/shareAPI"

    export default {
        name: "sharecontentpan",
        props:{
            copy:{
                type:Function,
                default:()=>{},
            },
            delete:{
                type:Function,
                default:()=>{},
            },
            code:{
              type:String,
              default:'',
            },
        },
        data()
        {
            return{
                sharepath:this.$route.params.sharepath,
                sharelink:'',
                page:1,
                firstin:true,
                refreshing:false,
                loading:false,
                end:false,
                filelist:false,
                over:false,
                pagesize:20,
                datas:[],
                selects:[],
                hoverindex:-1,
                herecode:'',
                herf:'',
                downloadname:'',
            }
        },
        beforeCreate()
        {
            if (this.$route.params.sharepath === "")
            {
                this.$router.push("/share/");
            }

        },
        beforeMount()
        {
            this.herecode = this.code;
            this.datas = [];
            let sharelink = this.sharepath+'_'+this.fullsharefolderpath;
            this.sharelink = sharelink;
            if (this.$store.state.sharefolderpath.length === 1 && this.$route.query.path)//比如刷新这种的vuex 的数据失效的情况，需要获取路由内容重新给vuex取值
            {
                let arr = this.$route.query.path.split('/');
                arr = arr.filter((val)=>{
                    return !(val === "" || val === "/");
                });
                arr.unshift("/");
                if (arr.length !== 0 )
                {
                    this.$store.commit('changeShareFolderPath',arr)
                }
            }
            if (sessionStorage.getItem(sharelink) && JSON.parse(sessionStorage.getItem(sharelink)).datas.length !== 0 )//获取缓存页码
            {
                this.page = JSON.parse(sessionStorage.getItem(sharelink)).page;
            }
            if (!this.$route.query.path && !this.$route.query.search)
            {
                this.listfile(this.page);
            }
            else if (this.$route.query.path )
            {
                this.listfile(this.page,this.getpath());
            }
            else if (this.$route.query.search)
            {
                console.log("search");
                console.log(this.$route.query.search);
            }
        },
        computed:{
            ...mapGetters(['fullsharefolderpath','paths',"fresh","cnfolder","isrename","islogin","userInfo"]),
            selectall()
            {
                return this.selects.every((val)=>{
                    return val
                })
            },
        },
        watch:{
            selects(val)
            {
                let file = [];
                let folder = [];
                let data = {};
                this.rename = [];
                this.selects.forEach((val, index) => {
                    if (val) {
                        this.datas[index].isfile ? file.push(this.datas[index].name) : folder.push(this.datas[index].name);
                        this.rename.push(index);
                    }
                });

                data = {folder, file};
                this.$store.commit("storeNew",{key:"selected",data});
            },
        },
        methods:
        {
            refresh () {
                this.refreshing = true;
                sessionStorage.removeItem(this.sharelink);
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
            getpath(index = null)
            {
                let arr = this.$store.state.sharefolderpath;
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
            format(time)
            {
                return formats.format(time);
            },
            bytesToSize(size)
            {
                return formats.bytesToSize(size);
            },
            isonover(index)
            {
                // if (!this.openlist)
                // {
                    this.hoverindex = index;

                // }
                // this.openlist = false;
            },
            isonleave(index)
            {
/*                if (!this.openlist)
                {*/
                    this.hoverindex = -1;
/*                    this.openlist = false;
                }*/
            },
            download(index)
            {
                if (index === -1)
                {
                    return 0;
                }
                this.$nextTick(()=>{
                        let data = this.$store.state.selected;
                        let pro = [];
                        let fs = {
                            files:[],
                            folders:[],
                        };
                        if (!!this.datas[index].isfile)
                        {
                            fs.files = [this.datas[index].name];
                        }
                        else
                        {
                            fs.folders = [this.datas[index].name];
                        }

                        pro.push(ShareAPI.download(fs,this.fullsharefolderpath,this.sharepath,this.code));
                        Promise.all(pro).then((resolve)=>{
                            console.log(resolve[0]);
                            this.isdownload = true;
                            this.herf = "http://" + resolve[0].path;
                            this.downloadname = resolve[0].name;
                            this.$nextTick(()=>{
                                this.$refs.downloadfiles.click();
                                this.isdownload = false;
                            });
                        },(reject)=>{
                            console.log("failed");
                        });
                    }
                );
            },



            listfile(page, dir = null, foldername = null) {
                return new Promise((resolve, reject) => {
                    let url = "share/link/" + this.sharepath;
                    dir = dir || this.fullsharefolderpath;
                    //let gets = [];
                    let showdir = '';
                    if (dir !== "/")
                    {
                        showdir = this.sharepath + '_'+ dir;
                    }
                    else
                    {
                        showdir = this.sharepath + '_/';
                    }

                    if (sessionStorage.getItem(this.sharepath+"_code") !== '' ) {
                        //this.code = sessionStorage.getItem(this.sharepath+"_code");
                        this.$emit('update:code',sessionStorage.getItem(this.sharepath+"_code"));
                    }



                    if ((sessionStorage.getItem(showdir) && JSON.parse(sessionStorage.getItem(showdir)).datas.length !== 0) && (page === 1 || this.firstin === true)) {
                        this.firstin = false;
                        //this.page ++;
                        this.datas = JSON.parse(sessionStorage.getItem(showdir)).datas;
                        resolve();
                    } else {
                        let ajax = new myajax();
                        let data = {
                            dir,
                            page,
                            pagesize: this.pagesize,
                            code :this.code,

                        };
                        ajax.ajax(url, data, (response) => {
                               console.log(response.data);
                            // console.log(this.datas);
                            if (page === 1) {
                                this.datas = [];
                            }
                            if (response.data.success.data.length === 0) {
                                this.end = true;
                            }
                            /*else
                       {

                       }*/
                            response.data.success.data.forEach((value) => {
                                this.datas = this.datas.concat(value);
                            });
                            //   console.log(this.datas);
                            sessionStorage.setItem(showdir, JSON.stringify({datas: this.datas, page}));
                            resolve();
                        }, (err) => {
                            console.log(err);
                        }).then(() => {
                            if (foldername) {
                                this.$store.commit('pushShareFolderPath', foldername);
                            }
                            console.log(this.selects);
                        });
                    }

                }).then(() => {
                    if (page === 1) {

                        this.selects = Array(this.datas.length).fill(false);
                    }
                    else {
                        let lens = this.datas.length - this.selects.length;
                        this.selects = this.selects.concat(Array(lens).fill(false));
                    }

                });
            }
        },

    }
</script>

<style scoped>

    .pan
    {
        user-select: none;
    }
    ul li{
        list-style: none;
    }

    .ul-head{
        padding-left: 0;
    }
    .in-block{
        display: inline-block;
        user-select: none;
        vertical-align:top;
    }
    .filename-width{
        width: 51%;
    }

    .size-width{
        width: 17%;
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
        height: 3em;
        line-height:3em;
        margin-left: 0;
        position: relative;
        /*font-size: 0;*/
        -webkit-text-size-adjust:none;
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
