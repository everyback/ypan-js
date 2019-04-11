<template>

    <div ref="getfile" style="user-select: none" class="getfile" @dragenter.prevent.stop="cancel($event)"   @dragover.caputre.prevent.stop="capt($event)"  @dragleave.prevent.stop="leave($event)" @drop.prevent.stop="drop($event)" :class="isdrag?'hover':'none'">
        <!--<p ref="getfile2" style=" position: fixed;z-index: 2147;top:50%;margin: auto;margin-left:100px;margin-right:100px;font-size: 5rem">-->
        拖动至此上传文件至当前目录
        <!--</p>-->
    </div>

</template>

<script>

    import SparkMD5 from 'spark-md5'
    import ajax from './../plugings/API/myajax'
    import {mapGetters} from 'vuex'
    //import sha1 from 'crypto-js/sha1';
    import sha1 from './../plugings/sha1'
    import folderAPI from './../plugings/API/folderAPI'
    import queue from "../plugings/queue"

    export default {
        name: "dropfiles",
        data()
        {
            return {
                filesarray:[],
                timer:'',
                ques:new queue(),
            };
        },
        computed:
            {
                ...mapGetters(["isdrag","scroll",'fullPath','paths']),
            },
        methods:
            {
                cancel(e){
                   // this.cancelall(e);
                    if (this.$store.state.title_name === 'Home')
                    {
                        this.$store.commit("storeNew", {key: "drag", data: true});
                    }

                },
                capt(e)
                {
                    if (this.$store.state.title_name === 'Home')
                    {
                        clearTimeout(this.timer);
                        // this.cancelall(e);
                        this.timer = setTimeout(()=>{
                            this.$store.commit("storeNew",{key:"drag",data:false});
                        },1000);
                        this.$store.commit("storeNew",{key:"drag",data:true});
                    }

                },
                leave(e)
                {
                    if (e.target.nodeName.toLowerCase()=== 'div')
                        this.$store.commit("storeNew",{key:"drag",data:false});
                },
                drop(e)
                {

                    clearTimeout(this.timer);
                    this.$store.commit("storeNew",{key:"drag",data:false});
                    if(!e.dataTransfer.items[0].webkitGetAsEntry())
                    {
                        return false;
                    }
                    this.fetchfile(e.dataTransfer.items);
                    return false;
                },
                fetchfile(items)
                {
                    let files = [];
                    let arrs = [];


                    console.log(items[0].webkitGetAsEntry());

                },

                scanFiles(item)
                {
                    return new Promise( (resolve)=> {
                        let files = [];
                        let reader = item.createReader();
                        reader.readEntries(async (entries)=> {
                            for (let i = 0; i < entries.length; i++)//换成同步写法，不然导致异步更恶心
                            {
                                if (entries[i].isDirectory) {
                                    //这边要获取path进行上传
                                    this.createFolder(entries[i].fullPath);
                                    console.log(entries[i].fullPath);
                                    //console.log(entries[i].webkitGetAsEntry().fullPath);
                                    files = files.concat(await this.scanFiles(entries[i]));
                                }
                                else {
                                    new Promise(resolve2 => {
                                        entries[i].file( async( file)=> {
                                            file.fullPath = entries[i].fullPath;
                                            files.push(file);
                                            if (i >= entries.length -1)
                                            {
                                                resolve2();
                                                resolve(files);
                                            }
                                        });
                                    });
                                }
                            }
                        });
                    });
                },

                portionfiles(files)
                {

                    if (!files.length || files.length === 0)
                        return console.error("没有文件");
                   // let filesarray = Array.from(files);//数组化，顺便保存一份清单
                    let filesarray = files;
                    // let md5s = [];
                    /*            this.$store.commit('storeNew',{key:'filestatus',data:[]});
                                this.$store.commit('storeNew',{key:'fileuploading',data:[]});*/
                    let alllength = 0;
                    this.$store.commit("storeNew",{key:"uploadBoxOpen",data:true});

                    if (this.$store.state.files[0])
                    {
                        alllength = this.$store.state.files.length;
                        this.$store.commit('addfilelist',filesarray);
                    }
                    else
                    {
                        this.$store.commit('storeNew',{key:'files',data:filesarray});
                    }

                    filesarray.forEach((val,index)=>{
                        let md5 = false;
                        let allleng = alllength +index;
                        this.$store.commit('filecancel',{key:allleng,data:false});
                        this.$store.commit('storefilestatus',{key:allleng,data:'calc md5'});
                        new Promise((resolve, reject) =>this.calcfilemd5(resolve,reject,val,allleng)).then((result)=>{
                            this.$store.commit('storefilestatus',{key:allleng,data:'waiting upload'});
                            this.uploadfile(val,allleng,result)
                        },(err)=>{
                            console.log(err);
                            this.$store.commit('storefilestatus',{key:allleng,data:'user cancel'});
                        })
                    });
                },

                uploadfile(file,index,md5)
                {
                    this.$store.commit('storefilestatus',{key:index,data:'uploading'});
                    let lastsize = 0;
                    let lasttime = new Date().getTime();
                    let putf = new ajax.ajax();
                    putf.putfile('putfile',{file,md5},index,(response)=>{
                            console.log(response);
                            this.$store.commit('storefilestatus',{key:index,data:'success'});
                        },(e)=>{
                            this.$store.commit('storefileuploading',{key:index,data:Math.floor((e.loaded / e.total*10000))/100 + '%'});
                            console.log( Math.floor(((e.loaded-lastsize)/(new Date().getTime()-lasttime))*1000/1024*100)/100 );
                            lastsize = e.loaded;
                            lasttime = new Date().getTime();
                            if (this.$store.state.filecancel[index])
                            {
                                putf.choosecancel('user cancel upload');
                            }
                        },(err)=>{
                            console.log(err.message);
                            //  console.log(err.response);
                            // if (err.response))
                            if (err.message === 'user cancel upload')
                            {
                                this.$store.commit('storefilestatus',{key:index,data:'user cancel'});
                                this.$store.commit('storefileuploading',{key:index,data:0});
                            }
                            else
                            {
                                this.$store.commit('storefilestatus',{key:index,data:'failed'});
                                this.$store.commit('storefileuploading',{key:index,data:0});
                            }
                        }
                    )

                },
                upload(evlists)
                {
                    let list = Array.from(evlists);

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
                            this.$store.commit('storefilestatus',{key:allleng,data:'waiting calc'});
                            try{
                                value.path = dir + "/" + value.webkitRelativePath.slice(0,value.webkitRelativePath.lastIndexOf("/"));
                                this.ques.calcpush(allleng);
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
                }



            }

    }
</script>

<style scoped>

    .getfile{
        left:0;
        top:0;
        z-index: 214748364;
        width: 100%;
        height: 100% ;
        background-color: rgba(0,0,0,0.18);
        opacity: 0.8;
        font-size: 5rem ;
        padding-left: 10vw;
        padding-top: 20%;
    }


</style>



<!--




                          /*
                            for (let i=0;i < entries.length-1; i++)
                            {
                                (async (entry)=>
                                {
                                    if (entry.isDirectory )
                                    {
                                       // i++;
                                        console.log('aaa');
                                        files = files.concat(await this.scanFiles(entry));
                                        console.log('bbb');
                                       // console.log(files);
                                       // i--;
                                    }
                                    else
                                    {
                                        //this.filesarray.push(entry);
                                        files.push(entry);
                                    }
                                    if (i === entries.length-1)
                                    {
                                        console.log(files);
                                        resolve(files);
                                    }
                                })(entries[i]);
                            }*/
/*                            entries.forEach(async (entry,index)=>{
                                (async (entry)=>
                                {
                                    if (entry.isDirectory )
                                    {
                                        i++;
                                        files = files.concat(await this.scanFiles(entry));
                                        console.log(files);
                                        i--;
                                    }
                                    else
                                    {
                                        //this.filesarray.push(entry);
                                        files.push(entry);
                                    }
                                    if (index === entries.length-1)
                                    {
                                        console.log(files);
                                        resolve(files);
                                    }
                                })(entry);
                            });*/

                                            calcfilemd5(resolve,reject,file,allleng)
                {
                    console.time('aaa');
                    function calcing(resolve2,reject2,file,cancel) {
                        const chunkSize = 5*(8*1024*1024);              //8*1024*1024*5              // Read in chunks of 2MB
                        let chunks = Math.ceil(file.size / chunkSize);
                        let currentChunk = 0;
                        let spark = new SparkMD5.ArrayBuffer();
                        let fileReader = new FileReader();
                        let blobSlice = File.prototype.slice;
                        let md5 = false;

                        fileReader.onload =  (e)=> {
                            spark.append(e.target.result);                   // Append array buffer
                            currentChunk++;

                            if (currentChunk < chunks) {
                                loadNext();
                            } else {
                                md5 = spark.end();
                                console.timeEnd('aaa');
                                resolve2(md5);
                            }
                        };

                        fileReader.onerror = (e)=> {
                            console.warn('oops, something went wrong.');
                            reject2(false);
                        };

                        function loadNext() {
                            let start = currentChunk * chunkSize,
                                end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
                            fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
                            if (cancel[allleng])
                            {
                                reject2('user cancel md5');
                            }
                        }
                        // console.log(cancel);
                        loadNext();
                    }
                    let md5 = false;
                    // console.log(this);
                    let promi = new Promise( (resolve2,reject2)=>{
                        calcing(resolve2,reject2,file,this.$store.state.filecancel)
                    });
                    promi.then((result)=>{resolve(result)},(err)=>reject(err));

                },

                                 /*createFolder(pathname)
                {
                    let dir = this.paths;
                    let path = pathname.split("/");
                    path = path.filter((val)=>{
                        return !(val === "" || val === "/");
                    });
                    let name = path.pop();
                    dir = dir.filter((val)=>{
                        return !(val === "" || val === "/");
                    });
                    dir.unshift("");
                    if (this.$store.state.path.length === 1)
                    {
                        dir = "/" + path.join("/");
                    }
                    else if (path.length <= 1)
                    {
                        dir = dir.join('/') ;
                    }
                    else
                    {
                        dir = dir.join('/') + "/" + path.join("/");
                    }
                    let folder_name = name;
                    let create = new ajax.ajax();
                    let url = "folder/create";
                    create.ajax(url,{dir,folder_name},(respone)=>{
                        console.log(respone);
                    },(err)=>{
                        console.log(err.respone);
                    },'post');
                }*/



                                 /*   (async ()=> {
                        let pro = [];
                        for (let i in items)
                        {
                            console.log('start');

                            if (!isNaN(parseInt(i)))
                            {
                                console.log(items[i].webkitGetAsEntry().isDirectory);
                                if (items[i].webkitGetAsEntry().isDirectory)
                                {
                                    console.log(items[i].webkitGetAsEntry().fullPath);
                                    this.createFolder(items[i].webkitGetAsEntry().fullPath);
                                    console.log('before');
                                    files = files.concat(await this.scanFiles(items[i].webkitGetAsEntry()));
                                    console.log('after');
                                }
                                else
                                {
                                    //console.log(items[i].getAsFile());
                                    let file = items[i].getAsFile();
                                    //console.log(items[i]);
                                   // file.dir_path = fullPath;
                                    files.push(file.dir_path);
                                    /!*                                sha1.sha1File(items[i].getAsFile()).then((resolve)=>{
                                                                        console.log(resolve);
                                                                    })*!/
                                }
                            }

                        }

                        console.log(files);

                        //this.portionfiles(files);
                    })();*/


                                       /*         for (let i in items)
                    {
                        if (!isNaN(parseInt(i)))
                        {
                            arrs.push(items[i]);
                        }
                    }*/


                    //console.log(items instanceof Array);

-->
