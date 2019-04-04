<template>
   <div>
       <div>
           <mu-paper style=" min-height: 5rem; " :z-depth="5">
               <div class="flex-box">
                       <mu-menu placement="bottom-start" open-on-hover >
                           <mu-button color="primary">UPLOAD</mu-button>
                           <mu-list slot="content">
                               <mu-list-item button>
                                   <input @dragstart="false" title="点击选择文件" id="h5Input0" multiple  accept="*/*" type="file" name="html5uploader" style="position:absolute;opacity:0;top:0;left:0;width:100%;height:100%;cursor:pointer;" ref="file" @change="getfolder($event)">
                                   <mu-list-item-title> UPLOAD FILE</mu-list-item-title>
                               </mu-list-item>
                               <mu-list-item button>
                                   <input @dragstart="false" title="点击选择文件" id="h5Input1" multiple accept="*/*" type="file" webkitdirectory mozdirectory name="html5uploader" style="position:absolute;opacity:0;top:0;left:0;width:100%;height:100%;cursor:pointer;" ref="folder"  @change="getfolder($event)">
                                   <mu-list-item-title> UPLOAD FOLDER</mu-list-item-title>
                               </mu-list-item>
                           </mu-list>
                       </mu-menu>
                       <mu-button @click="opencreate()" >
                           CREATE NEW FOLDER
                       </mu-button>
                   <mu-button v-if="haveselected" @click="openmove()">
                      MOVE
                   </mu-button>
                   <mu-button v-if="haveselected" @click="opencopy()">
                       COPY
                   </mu-button>
                   <mu-button v-if="haveselected" @click="opendelete()">
                       DELETE
                   </mu-button>
                   <mu-button v-if="haveselected" @click="download()">
                       DOWNLOAD
                   </mu-button>
                   <mu-button v-if="haveselected" @click="openshare()">
                       SHARE
                   </mu-button>
                   <mu-button v-if="haveselected" @click="onrename()" :disabled="selectsum !== 1">
                       RENAME
                   </mu-button>
               </div>
           </mu-paper>
           <folder :action="()=>move()" :open.sync="selectopen.move" />
           <folder :action="()=>copy()" :open.sync="selectopen.copy"  />
           <selectshare  :open.="selectopen.share"   />
           <my-dialog   :action="()=>todelete()" :open.sync="selectopen.delete"  :name="dialog.name" :message="dialog.msg" :confirm="true" />
       </div>
       <mu-paper style="margin-top: 20px;min-height:670px;" :z-depth="5">
           <!--<dragfiles />-->
           <!--<keep-alive>-->

                <router-view :key="key" />
           <!--</keep-alive>-->
       </mu-paper>
       <upload />
       <dragfiles />
       <a :href="herf" :download="downloadname" v-show="false"  ref="downloadfile">4</a>
   </div>


</template>

<script>
    import {mapGetters} from 'vuex'
    import Pan from "./../components/pan"
    import upload from './../components/upload'
    import dragfiles from './../components/dragfiles'
    import Folder from "../components/Folder/folder"
    import FolderAPI from '../plugings/API/folderAPI'
    import FileAPI from '../plugings/API/fileAPI'
    import MyDialog from "../components/myDialog";
    import md5 from "../plugings/md5"
    import sha1 from "../plugings/sha1"
    import queue from "../plugings/queue"
    import Share from "./share";
    import Selectshare from "../components/share";

    export default {
        components: {
            Selectshare,
            Share,
            MyDialog,
            Folder,
            Pan,
            dragfiles,
            upload,
        },
        name: "disk",
        data()
        {
            return {
                dialog:{
                    name:'提示',
                    msg:'确认删除7个文件？',
                    path:''
                },
                selectopen:{
                    move:false,
                    copy:false,
                    delete:false,
                    share:false,
                },
                isdownload:false,
                herf:'',
                downloadname:"",
                ques:new queue(),

            }
        },
        created()
        {
            this.$store.commit("storeNew",{key:"title_name",data:"Disk"});
/*            this.$on('selecteds',(datas)=>{
                console.log(datas);
                this.$store.commit('storeNew',{key:'needselectes',data:false});
              //  this.$off('selecteds');
            });*/
        },
        destroyed()
        {
            this.$store.commit("storeNew",{key:'path',data:['/']});
            this.$store.commit("storeNew",{key:'dir_to',data:"/"});
        },
        computed:{
            ...mapGetters(['fullPath',"haveselected","selectsum","files"]),
            key() {
                return this.$route.name !== undefined? this.$route.name +new Date(): this.$route +new Date()
            },
        },
        watch:{
            $route(to ,from)
            {
                //console.log(to);
               // console.log(this.$route.query.path);
                if (JSON.stringify(this.$route.query) === '{}')
                {
                    this.$store.commit("storeNew",{key:'path',data:['/']});
                    this.$store.commit("storeNew",{key:'dir_to',data:"/"});
                    return ;
                }
                let arr = this.$route.query.path.split('/');
                arr = arr.filter((val)=>{
                    return !(val === "" || val === "/");
                });
                arr.unshift("/");
                if (arr.length !== 0 )
                {
                    //this.$store.commit('pushPath',arr[arr.length - 1]);
                    this.$store.commit('changePath',arr);
                }
                //this.listfile(1 , val);
            },
        },
        methods:
            {
                move()
                {
                    let to = this.$store.state.dir_to;
                //   this.$store.commit('storeNew',{key:'needselectes',data:!this.$store.state.needselectes});
                   // this.$store.commit('storeNew',{key:'needselectes',data:false});
                    let data = this.$store.state.selected;
                    let pro = [];
                    if (data.folder.length > 0)
                    {
                        pro.push(FolderAPI.move(data.folder,this.fullPath,to));
                    }
                    if (data.file.length > 0)
                    {
                        pro.push(FileAPI.move(data.file,this.fullPath,to));
                    }
                    Promise.all(pro).then((resolve)=>{
                        //this.selectopen.move = false;
                        this.$store.commit("storeNew",{key:"closedialog",data:true});
                        this.$nextTick(()=>this.$store.commit("storeNew",{key:"closedialog",data:false}));
                        this.$emit("update:open",false);
                        sessionStorage.clear();
                        this.$store.commit("storeNew",{key:"refresh",data:true});

                       // console.log("allover");
                    },(reject)=>{
                        console.log("failed");
                    });

                },
                copy()
                {
                    let to = this.$store.state.dir_to;
                    let data = this.$store.state.selected;
                    let pro = [];
                    if (data.folder.length > 0)
                    {
                        pro.push(FolderAPI.copy(data.folder,this.fullPath,to));
                    }
                    if (data.file.length > 0)
                    {
                        pro.push(FileAPI.copy(data.file,this.fullPath,to));
                    }
                    Promise.all(pro).then((resolve)=>{
                        //this.selectopen.move = false;
                        this.$store.commit("storeNew",{key:"closedialog",data:true});
                        this.$nextTick(()=>this.$store.commit("storeNew",{key:"closedialog",data:false}));
                        this.$emit("update:open",false);
                        sessionStorage.clear();
                        this.$store.commit("storeNew",{key:"refresh",data:true});

                        // console.log("allover");
                    },(reject)=>{
                        console.log("failed");
                    });

                },
                todelete()
                {
                    let data = this.$store.state.selected;
                    let pro = [];
                    if (data.folder.length > 0)
                    {
                        pro.push(FolderAPI.todelete(data.folder,this.fullPath));
                    }
                    if (data.file.length > 0)
                    {
                        pro.push(FileAPI.todelete(data.file,this.fullPath));
                    }
                    Promise.all(pro).then((resolve)=>{
                        //this.selectopen.move = false;
                        this.$store.commit("storeNew",{key:"closedialog",data:true});
                        this.$nextTick(()=>this.$store.commit("storeNew",{key:"closedialog",data:false}));
                        sessionStorage.clear();
                        this.$store.commit("storeNew",{key:"refresh",data:true});
                    },(reject)=>{
                        console.log("failed");
                    });
                },
                download()
                {
                    let data = this.$store.state.selected;
                    let pro = [];
/*                    if (data.folder.length > 0)
                    {
                        pro.push(FolderAPI.todelete(data.folder,this.fullPath));
                    }
                    if (data.file.length > 0)
                    {
                        pro.push(FileAPI.todelete(data.file,this.fullPath));
                    }*/
                    if (data.file.length === 1)
                    {
                        pro.push(FileAPI.download(data.file,this.fullPath));
                    }
                    Promise.all(pro).then((resolve)=>{
                        //this.selectopen.move = false;
                       // this.$store.commit("storeNew",{key:"closedialog",data:true});
                       // this.$nextTick(()=>this.$store.commit("storeNew",{key:"closedialog",data:false}));
                       // sessionStorage.clear();
                      //  this.$store.commit("storeNew",{key:"refresh",data:true});
                        console.log(resolve[0]);
                        this.isdownload = true;
                         this.herf = "http://" + resolve[0].path;
                         this.downloadname = resolve[0].name;
                         this.$nextTick(()=>{
                             this.$refs.downloadfile.click();
                             this.isdownload = false;
                         });


                    },(reject)=>{
                        console.log("failed");
                    });
                },
                opencreate()
                {
                    this.$store.commit("storeNew",{key:'createnewfolder',data:true});
                },
                openmove()
                {
                    this.selectopen.move = this.haveselected ;
                    //this.$nextTick(()=>this.selectopen.move = false);
                    //setTimeout(()=>this.selectopen.move = false,1000);
                   // this.selectopen.move = true;
                },
                 opencopy()
                {
                    this.selectopen.copy = true;
                   // this.$nextTick(()=>this.selectopen.copy = false);
                },
                opendelete()
                {
                    let data = this.$store.state.selected;
                    let all = data.file.length + data.folder.length;
                    this.dialog.msg = `确认删除${all}个文件？`;
                    this.selectopen.delete = true;
                    //this.$nextTick(()=>this.selectopen.delete = false);
                },
                onrename ()
                {
                    this.$store.commit("storeNew",{key:"rename",data:true});
                },
                getfolder(event)
                {
                    console.log(Array.from(event.target.files) );
                    let list = Array.from(event.target.files);

                    if (!list.length || list.length === 0)
                        return console.error("没有文件");
                    let alllength = 0;
                    this.$store.commit("storeNew",{key:"uploadBoxOpen",data:true});

                    if (this.$store.state.files[0])//添加文件列表
                    {
                        alllength = this.$store.state.files.length;//旧长度
                        this.$store.commit('addfilelist',list);
                    }
                    else
                    {
                        this.$store.commit('storeNew',{key:'files',data:list});
                    }

                    let dir =  this.fullPath;
                    if (dir === "/" )
                    {
                        dir = "";
                    }
                    list.forEach(async (value,index)=>{
                        let allleng = alllength+index;
                        this.$store.commit('filecancel',{key:allleng,data:false});
                        try{
                            //console.log(value.webkitRelativePath.lastIndexOf("/"));
                            value.path = dir + "/" + value.webkitRelativePath.slice(0,value.webkitRelativePath.lastIndexOf("/"));
                            this.$store.commit('storefilestatus',{key:allleng,data:'calc md5'});
                            value.md5 = await md5.calcfilemd5(value,allleng);
                            this.$store.commit('storefilestatus',{key:allleng,data:'calc sha1'});
                            value.silce_sha1 = await sha1.sha1File(value);
                            this.$store.commit('storefilestatus',{key:allleng,data:'waiting upload'});
                            //FileAPI.uploadfile(allleng,value);
                            this.ques.push(allleng);
                        }
                        catch(err)
                        {
                            console.log(err.message);
                            if (err.message.indexOf("user") !== -1)
                            {
                                this.$store.commit('storefilestatus',{key:allleng,data:err.message});
                            }
                            return 1;
                        }
                        }
                    );
                    this.$refs.folder.value = null;
                    this.$refs.file.value = null;
                },
                openshare()
                {

                }
/*
                getfile($event)
                {
                    console.log($event);
                }
*/

            }
    }
</script>

<style scoped>


    .flex-box{
        flex-flow: row wrap;
        justify-content:flex-start;
        align-items:flex-start;
        align-content: space-around;
    }

</style>
