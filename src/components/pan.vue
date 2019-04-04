<template>
    <div  class="pan" ondragstart="return false" @mouseover.self="outover()"  >
        <!--<transition-group appear  name="fadeLeft" mode="out-in" :duration="300" tag="div" >-->
            <router-link v-if="!(fullPath === '/')" ondragstart="return false" class="text-left in-block returnone" :to="{ name: 'dir', query: { path: getpath(paths.length -1 ) }}"> 返回上一层 </router-link>
            <mu-breadcrumbs class="left-leave" >
                <mu-icon value="chevron_right" slot="divider"/>
                <mu-breadcrumbs-item v-for="(value,index) in this.$store.state.path" :key="value + '/'+index" :to="{ name: 'dir', query: { path: getpath(index + 1) }}" :disabled=" index === paths.length - 1 "  >{{value}}</mu-breadcrumbs-item>
            </mu-breadcrumbs>
        <!--</transition-group>-->
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
            <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" style="overflow: auto;height: 580px ;"  >
                <dd  v-if="cnfolder" class="dds" >
                    <div>
                        <span class="text-left in-block " style="width: 40px;position: relative;top:8px">
                            <mu-checkbox v-model="test" disabled />
                        </span>
                        <span class="text-left in-block filename-width">
                            <mu-icon class="icon" size="24" value="folder" color="amber200"  />
                            <mu-text-field class="left-margin phone" v-model="new_name" placeholder="please input folder name" > </mu-text-field>
                            <mu-button icon color="success" small class="name-button" @click="createfolder()">
                            <mu-icon value="done" />
                            </mu-button>
                            <mu-button icon color="error" small class="name-button" @click="cancelcreate()">
                                <mu-icon value="clear" />
                            </mu-button>
                        </span>
                        <span class="text-left in-block size-width">
                            --
                        </span>
                        <span  class="text-left in-block time-width">
                            now
                        </span>
                    </div>
                </dd>
                <div v-if="datas.length !== 0" ref="toscroll" id="scr" >
                    <dd   v-for="(value,index) in datas" :key="value + '/'+index " class="dds" :class="[selects[index] ? 'selected':'',hoverindex === index ? 'dds-hover':'']"  @mouseover="isonover(index)"  @mouseleave="isonleave(index)" >
                        <div>
                            <div v-if="value.is_file === false" @dblclick="to(value.folder_name)"  >
                                <span class="text-left in-block " style="width: 40px;position: relative;top:8px">
                                    <mu-checkbox v-model="selects[index]" />
                                </span>
                                <span class="text-left in-block filename-width " @click.self.stop="set(index)" v-if="selectrename !== index" >
                                    <mu-icon class="icon" size="24" value="folder" color="amber200"  />
                                    <router-link class="left-margin hidename" ondragstart="return false"  :to="{ name: 'dir', query: { path: fullPath+'/'+ value.folder_name }}">{{value.folder_name}}</router-link>
                                </span>
                                <span class="text-left in-block filename-width"  v-else>
                                    <mu-text-field class="left-margin phone" v-model="new_name" :placeholder="value.folder_name" />
                                    <mu-button icon color="success" small class="name-button" @click="torename()">
                                        <mu-icon value="done" />
                                    </mu-button>
                                    <mu-button icon color="error" small class="name-button" @click="cancelrename()">
                                        <mu-icon value="clear" />
                                    </mu-button>
                                </span>
                                <span class="text-left in-block size-width" @click.self.stop="set(index)">
                                    --
                                </span>
                                <span class="text-left in-block time-width" @click.self.stop="set(index)">
                                    {{ format(value.updated_at)}}
                                 </span>
                            </div>
                            <div v-else>
                                <span class="text-left in-block " style="width: 40px;position: relative;top:8px">
                                    <mu-checkbox v-model="selects[index]" />
                                </span>
                                <span class="text-left in-block filename-width "  @click.self.stop="set(index)" v-if="selectrename !== index"  >
                                    <span class="hidename" > {{value.file_name}} </span>
                                </span>
                                <span class="text-left in-block filename-width "  v-else>
                                    <mu-text-field class="left-margin phone" v-model="new_name" :placeholder="value.file_name" />
                                    <mu-button icon color="success" small class="name-button" @click="torename()">
                                        <mu-icon value="done" />
                                    </mu-button>
                                    <mu-button icon color="error" small class="name-button" @click="cancelrename()">
                                        <mu-icon value="clear" />
                                    </mu-button>
                                </span>
                                <span class="text-left in-block size-width">
                                    <span > {{bytesToSize(value.file_size)}}</span>
                                </span>
                                <span class="text-left in-block time-width">
                                    {{ format(value.updated_at)}}
                                </span>
                            </div>
                            <span class=" in-block" style="position: absolute;left: 45%;top:0;" v-if="hoverindex === index" >
                                <mu-button icon color="error" small class="name-button" @click="cancelcreate()">
                                    <mu-icon value="cloud_download" />
                                </mu-button>
                                <mu-menu placement="top-start" :open.sync="openlist" >
                                    <mu-button icon color="error" small class="name-button" >
                                        <mu-icon value="more_vert" />
                                    </mu-button>
                                    <mu-list slot="content" >
                                        <mu-list-item button @click="prename(index)">
                                           <mu-list-item-title> RENAME</mu-list-item-title>
                                        </mu-list-item>
                                            <mu-list-item button>
                                           <mu-list-item-title> MOVE</mu-list-item-title>
                                        </mu-list-item>
                                        <mu-list-item button>
                                           <mu-list-item-title> COPY</mu-list-item-title>
                                        </mu-list-item>
                                        <mu-list-item button>
                                           <mu-list-item-title> DELETE</mu-list-item-title>
                                        </mu-list-item>
                                    </mu-list>
                                </mu-menu>
                            </span>
                        </div>
                    </dd>
                </div>
                <div v-else>
                    nofile(s)
                </div>
            </mu-load-more>
        </dl>
        </transition>
    </div>

</template>

<script>
    import {mapGetters} from 'vuex'
    import myajax from './../plugings/API/myajax'
    import formats from './../plugings/formats'
    import FolderAPI from '../plugings/API/folderAPI'
    import FileAPI from '../plugings/API/fileAPI'

    export default {

        name: "pan",
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
                openlist:false,
                hoverindex:-1,
                // rename: [],
                selectrename :-1,

            }
        },
        created()
        {
            this.datas = [];
            if (this.$store.state.path.length === 1 && this.$route.query.path)
            {
                let arr = this.$route.query.path.split('/');
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
            {
                this.listfile(this.page,this.getpath());
            }
            else if (this.$route.query.search)
            {
                console.log("search");
                console.log(this.$route.query.search);
            }


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
            selects(val)
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
            },
            fresh(val)
            {
                if (val)
                {
                    this.cancelrename();
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
            isrename(val)
            {
            //  this.
                if (this.rename.length === 1)
                {
                    this.selectrename = this.rename[0];
                }
                else
                {
                    this.rename = -1;
                }
                this.$store.commit("storeNew",{key:"rename",data:false});
            },


        },
        methods:{
            refresh () {
                this.refreshing = true;
                sessionStorage.removeItem(this.getpath());
                this.page = 1;
                this.cancelrename();
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
                   let url = "file/showpageinate";
                   dir = dir ||this.fullPath;
                   //let gets = [];
                   if ((sessionStorage.getItem(dir) && JSON.parse(sessionStorage.getItem(dir)).datas.length !== 0 )&& (page === 1 ||this.firstin === true))
                   {
                       this.firstin = false;
                       //this.page ++;
                       this.datas = JSON.parse(sessionStorage.getItem(dir)).datas;
                       resolve();
                   }else
                   {
                       let ajax = new myajax();
                       let data = {
                           dir,
                           page,
                           pagesize:this.pagesize
                       };
                       ajax.ajax(url,data,(response)=>{
                           console.log(response.data);
                           console.log(this.datas);
                           if (page === 1) {
                               this.datas = [];
                           }
                           if (response.data.success[0].length === 0)
                           {
                               this.end = true;
                           }/*else
                           {

                           }*/
                           response.data.success.forEach((value)=>{
                               this.datas = this.datas.concat(value);
                           });
                           console.log(this.datas);
                           sessionStorage.setItem(dir,JSON.stringify({datas:this.datas,page}));
                           resolve();
                       }, (err)=>{
                           console.log(err.response);
                       }).then(()=>{
                           if(foldername)
                           {
                               this.$store.commit('pushPath',foldername);
                           }
                           console.log(this.selects);
                       });
                   }

               }).then(()=>{
                   if (page === 1)
                   {

                       this.selects = Array(this.datas.length).fill(false);
                   }
                   else {
                       let lens = this.datas.length - this.selects.length;
                       this.selects = this.selects.concat(Array(lens).fill(false));
                   }

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
            cancelcreate()
            {
                this.$store.commit("storeNew",{key:'createnewfolder',data:false});
                this.new_name = '';
            },
            to(filename)
            {
                this.$router.push({ name: 'dir', query: { path: this.fullPath+'/'+ filename }});
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
            torename ()
            {
                let sels = this.selectrename;
                let newname = this.new_name;
                if (this.datas[sels].is_file === false)
                {
                    let oldname = this.datas[sels].folder_name;
                    FolderAPI.rename(oldname,newname,this.fullPath).then((resolve)=>{
                        this.new_name = '';
                        sessionStorage.removeItem(this.fullPath);
                        this.refresh();
                        this.cancelrename();
                    },(reject)=>{
                        console.log(reject);
                    }).then(()=>this.$store.commit("storeNew",{key:"rename",data:false}));
                }
                else
                {
                    let oldname = this.datas[sels].file_name;
                    FileAPI.rename(oldname,newname,this.fullPath).then((resolve)=>{
                        this.new_name = '';
                        sessionStorage.removeItem(this.fullPath);
                        this.refresh();
                        this.cancelrename();
                    },(reject)=>{
                        console.log(reject);
                    }).then(()=>this.$store.commit("storeNew",{key:"rename",data:false}));
                }

            },
            cancelrename()
            {
                this.selectrename = -1;
                this.new_name = '';
                this.$store.commit("storeNew",{key:"rename",data:false});
            },
            prename(index = -1)
            {
                if(index !== -1)
                {
                    this.selectrename = index;
                }
                this.openlist = false;
                this.new_name = '';

                this.$store.commit("storeNew",{key:"rename",data:true});
            }
        }
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
        /*border-top: 1px solid black;*/
        border-bottom:1px solid #e3f2fd;
    }
    .hidename{
        text-overflow:ellipsis;
        white-space:nowrap;
        overflow:hidden;
        /*width:500px;*/
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
