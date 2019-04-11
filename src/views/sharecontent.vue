<template>

    <div>
        <div v-if="!needcode && !outtime"  >
            <div >
                <mu-paper style=" min-height: 5rem; " :z-depth="5">
                    <p v-if="!issharer">这是来自于用户{{sharername}}的 {{code !== "" && code !== null ? "私密":"公开"}}分享 </p>
                    <p v-if="issharer">这是来自于用户自身的分享</p>
                    <div class="flex-box">
                        <mu-button  :disabled="!haveselected && ( issharer || islogin)"  @click="opencopy()">
                            COPY
                        </mu-button>
                        <mu-button :disabled="!haveselected" @click="download()">
                            DOWNLOAD
                        </mu-button>
                        <mu-button v-if="issharer" @click="cancelshare()">
                            DELETE
                        </mu-button>
                    </div>
                </mu-paper>
                <folder :action="()=>copy()" :open.sync="selectopen.copy" />
            </div>
            <mu-paper style="margin-top: 20px;min-height:670px;" :z-depth="5">
                <router-view :key="key" :copy="()=>opencopy()"  :sharepath="sharepath" :code.sync="code" />
            </mu-paper>
            <a :href="herf" :download="downloadname" v-show="false"  ref="downloadfile">4</a>
        </div>
        <div v-if="needcode && !outtime">
            <mu-container class="tipsbox height">
                <mu-paper :z-depth="5"  >
                    <mu-form  :model="{}" >
                        <mu-row justify-content="center" align-content="center" fill wrap="wrap" >
                            <mu-col span="12">
                                <mu-appbar  title="需要提取码" color="grey300" :z-depth="0">
                                </mu-appbar>
                            </mu-col>
                            <mu-col span="10" md="8">
                                <mu-row  justify-content="center" align-content="center" fill wrap="wrap">
                                    <mu-col span="12"  class="col-top-15px" md="10" >
                                        <mu-form-item label="提取码"  prop="code"    >
                                            <mu-text-field v-model="code"  prop="code" :max-length="4" :error-text='coderr' >
                                            </mu-text-field>
                                        </mu-form-item>
                                    </mu-col>
                                    <mu-col span="4"  class="col-top-15px col-bottom-40px">
                                        <mu-button color="primary" @click="up()" >进入</mu-button>
                                    </mu-col>
                                </mu-row>
                            </mu-col>
                        </mu-row>
                    </mu-form>
                </mu-paper>
            </mu-container>
        </div>
        <div v-if="outtime">
            <mu-paper :z-depth="5" style="height: 800px"  >
                <p style="font-size: 2rem">  该链接可能已被删除或已过期</p>
                <mu-icon class="icon" size="200" value="cloud_off" color="red" style="position: relative;top: 40%;" />
            </mu-paper>
        </div>
        <my-dialog   :action="()=>todelete()" :open.sync="selectopen.delete"  :name="'取消分享'" :message="'确认要取消该分享么?'" :confirm="true" />
    </div>



</template>

<script>

    import myajax from './../plugings/API/myajax'
    import {mapGetters} from 'vuex'
    import Folder from "../components/Folder/folder";
    import ShareAPI from "../plugings/API/shareAPI"
    import MyDialog from "../components/myDialog";

    export default {
        components: {
            MyDialog,
            Folder},
        name: "sharecontent",
        data()
        {
          return{
              sharepath:this.$route.params.sharepath,
              page:1,
              downloadname:'files',
              herf:"",
              needcode:false,
              code:'',
              coderr:'',
              outtime:false,
              sharername:-2,
              selectopen:{
                  copy:false,
                  delete:false,
              },

          }
        },
        beforeCreate()
        {
            if (this.$route.params.sharepath === "")
            {
                this.$router.push("/share/");
            }
        },
        created()
        {
            this.$once('sharername',(name)=>{
                this.sharername = name;
        });
            this.testcode();




        },
        destroyed()
        {
            this.$store.commit("storeNew",{key:'sharefolderpath',data:['/']});
            this.$store.commit("storeNew",{key:'dir_to',data:"/"});
        },
        computed:{
            ...mapGetters(['paths',"fresh","cnfolder","isrename","islogin","userInfo","fullsharefolderpath","haveselected"]),
            issharer()
            {
                return this.sharername === this.userInfo.name;
            },
            key() {
                return this.$route.name !== undefined? this.$route.name +new Date(): this.$route +new Date()
            },
        },
        methods:
        {
            copy()
            {
                let to = this.$store.state.dir_to;
                let data = this.$store.state.selected;
                let pro = [];
                if (data.file.length + data.folder.length !== 0)
                {
                    pro.push(ShareAPI.copy(data,this.sharepath,this.fullsharefolderpath,to));
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
            opencopy()
            {
                this.selectopen.copy = true;
            },
            cancelshare()
            {
                this.selectopen.delete = true;
            },
            todelete()
            {
                let path = this.sharepath;
                ShareAPI.todelete([path]).then(()=>{
                    this.testcode();
                });
            },
            download()
            {
                this.$nextTick(()=>{
                        let data = this.$store.state.selected;
                        let pro = [];
                        pro.push(ShareAPI.download({files:data.file,folders:data.folder},this.fullsharefolderpath,this.sharepath));
                        Promise.all(pro).then((resolve)=>{
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
                    }
                );
            },
            testcode() {
                return new Promise((resolve, reject) => {
                    let url = "share/link/" + this.sharepath;
                    let dir = '/';
                    //let gets = [];


                    if (sessionStorage.getItem(this.sharepath+"_code") !== '' ) {
                        if (sessionStorage.getItem(this.sharepath+"_code") !== null)
                        {
                            this.code = sessionStorage.getItem(this.sharepath+"_code");
                            console.log("adsgfdsgdsfgdf");
                        }
                    }
                    let code = this.code;
                        let ajax = new myajax();
                        let data = {
                            dir,
                            code,

                        };
                        ajax.ajax(url, data, (response) => {
                            console.log(response.data);
                            // console.log(this.datas);
                            this.sharername = response.data.success.username;
                            sessionStorage.setItem(this.sharepath + "_code",this.code);
                            this.needcode = false;
                            resolve();
                        }, (err) => {
                            console.log(err);
                            let res = err.response.data.error;
                            if (res)
                            {
                                if (res.indexOf("code") !== -1)
                                {
                                    this.needcode = true;
                                }
                                if (this.coderr === '')
                                {
                                    this.coderr = "提取码错误";
                                }
                                if(res.indexOf('such') !== -1)
                                {
                                    console.log("no folder");
                                    this.outtime = true;
                                }
                            }
                        });
                })
            },
            up()
            {
                this.coderr = "";
                if (this.code.length === 0 )
                {
                    this.coderr = "未输入";
                }
                else
                {
                    this.testcode();
                }
            }
        }
    }
</script>

<style scoped>



</style>
