<template>

    <div ref="getfile" style=" left:0;top:0;z-index: 214748364; width: 100%;height: 100% ;background-color: rgba(0,0,0,0.18);opacity: 0.8;font-size: 5rem ;padding-left: 10vw;padding-top: 20%" :class="isdrag?'hover':'none'">
        <!--<p ref="getfile2" style=" position: fixed;z-index: 2147;top:50%;margin: auto;margin-left:100px;margin-right:100px;font-size: 5rem">-->
        拖动至此上传文件至当前目录
        <!--</p>-->
    </div>

</template>

<script>

    import SparkMD5 from 'spark-md5'
    import ajax from './../plugings/API/myajax'
    import {mapGetters} from 'vuex'



    export default {
        name: "dropfiles",
        data()
        {
            return {
                filesarray:[],
            };
        },
        mounted()
        {
            let timer;
            this.$refs.getfile.addEventListener('dragenter',(e)=>{
                this.cancelall(e);
                this.$store.commit("storeNew",{key:"drag",data:true});
            },false);

            this.$refs.getfile.addEventListener("dragover",(e)=>{
                clearTimeout(timer);
                this.cancelall(e);
                timer = setTimeout(()=>{
                    this.$store.commit("storeNew",{key:"drag",data:false});
                },1000);
                this.$store.commit("storeNew",{key:"drag",data:true});
            },true);
            this.$refs.getfile.addEventListener('dragleave',(e)=>{
                this.cancelall(e);
                if (e.target.nodeName.toLowerCase()=== 'div')
                    this.$store.commit("storeNew",{key:"drag",data:false});
            },false);
            this.$refs.getfile.addEventListener('drop',(e)=>{
                this.cancelall(e);
                clearTimeout(timer);
                this.$store.commit("storeNew",{key:"drag",data:false});
/*                console.log(e.dataTransfer.items[0].webkitGetAsEntry().createReader().readEntries((entries)=> {
                    entries.forEach((entry)=> {
                        console.log(entry)
                    })}));*/
              //  console.log(e.dataTransfer.files.webkitGetAsEntry());
              //  console.log(e.dataTransfer.items);
                this.fetchfile(e.dataTransfer.items);
             //   this.portionfiles(e.dataTransfer.files);
                return false;
            },false);


        },
        computed:
            {
                ...mapGetters(["isdrag","scroll"]),
            },
        methods:
            {

                fetchfile(items)
                {
                    let files = [];
                    (async (files)=> {
                        for (let i=0 ;i<items.length; i++)
                        {
                            if (items[i].webkitGetAsEntry().isDirectory)
                            {
                                files =  files.concat(await this.scanFiles(items[i].webkitGetAsEntry()));
                          //      console.log(files);
                            }
                            else
                            {
                                files.push(items[i].getAsFile());
                               // this.filesarray.push(items[i].getAsFile());
                            }
                        }
                        console.log(files);
                      //  this.portionfiles(files);
                    })(files);
                },

                scanFiles(item)
                {
                    //console.log(files);
                    // 要发送一个建立文件夹信息
                    //   nowpath   +item.fullpath

                    return new Promise( (resolve)=> {
                        let files = [];
                        let reader = item.createReader();
                        let promises = [];
                       // let i = 0;
                        reader.readEntries(async (entries)=>{
                         //   let files = [];
                            console.log(entries.length);
                            for (let i=0;i < entries.length; i++)
                            {
                                if (entries[i].isDirectory )
                                {
                                    // i++;
                                    console.log('aaa');
                                    files = files.concat(await this.scanFiles(entries[i]));
                                    console.log('bbb');
                                    // console.log(files);
                                    // i--;
                                }
                                else
                                {
                                    //this.filesarray.push(entry);
                                    files.push(entries);
                                }
                             //   console.log(i);
                                if (i >= entries.length-1)
                                {
                                    console.log(files);
                                    resolve(files);
                                }
                            }





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
                        });

                    });
                },



                portionfiles(files)
                {
                 //   console.log(evt.dataTransfer.items[i].webkitGetAsEntry());
                    //  console.log(files );
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
                        this.$store.commit('addfilelist',{key:'files',data:filesarray});
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
                calcfilemd5(resolve,reject,file,allleng)
                {

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
                cancelall(e)
                {
                    e.preventDefault();
                    e.cancelBubble = true;
                    e.stopPropagation();
                }


            }

    }
</script>

<style scoped>

    .hover{
        display:block;
        position: fixed;
    }
    .none{
        display:none;
        position: fixed;
    }


</style>
