<template>



    <div  class="pan" @mouseover.self="outover()"  >
        <router-link v-if="!(fullPath === '/')" ondragstart="return false" class="text-left in-block returnone" :to="{ name: 'dir', query: { path: getpath(paths.length -1 ) }}"> 返回上一层 </router-link>
        <mu-breadcrumbs class="left-leave" >
            <mu-icon value="chevron_right" slot="divider"/>
            <mu-breadcrumbs-item v-for="(value,index) in this.$store.state.path" :key="value + '/'+index" :to="{ name: 'dir', query: { path: getpath(index + 1) }}" :disabled=" index === paths.length - 1 "  >{{value}}</mu-breadcrumbs-item>
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
                    <dd  v-if="cnfolder" class="dds"  >
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
                    <div v-if="datas.length !== 0" ref="toscroll" id="scr"  >
                        <dd   v-for="(value,index) in datas" :key="value + '/'+index " class="dds" :class="[selects[index] ? 'selected':'',hoverindex === index ? 'dds-hover':'']"  @mouseover="isonover(index)"  @mouseleave="isonleave(index)" >
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
                                <div class="text-left in-block " style="width: 40px;position: relative;top:8px">
                                    <div>
                                        <mu-checkbox v-model="selects[index]" />
                                    </div>
                                </div>
                                <div class="text-left in-block filename-width  "  @click.self.stop="set(index)" v-if="selectrename !== index"  >
                                    <div  class="hidename" >
                                        <mu-tooltip class="hidename" style="width:80%" placement="bottom" :content="value.file_name">
                                            <span>{{value.file_name}}</span>
                                        </mu-tooltip>
                                    </div>
                                </div>
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
                            <mu-button icon color="error" small class="name-button" @click="godownload(index)">
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
    </div>
</template>

<script>

    import myajax from './../plugings/API/myajax'


    export default {
        name: "sharecontentpan",
        data()
        {
            return{
                sharepath:this.$route.params.sharepath,
                page:1,
                firstin:false,

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

        },
        computed:{
            ...mapGetters(['fullPath','paths',"fresh","cnfolder","isrename","islogin","userInfo"]),
        },
        methods:
        {
            listfile(page, dir = null, foldername = null) {
                return new Promise((resolve, reject) => {
                    let url = "share/link/" + this.sharepath;
                    dir = dir || this.fullPath;
                    //let gets = [];
                    if ((sessionStorage.getItem(dir) && JSON.parse(sessionStorage.getItem(dir)).datas.length !== 0) && (page === 1 || this.firstin === true)) {
                        this.firstin = false;
                        //this.page ++;
                        this.datas = JSON.parse(sessionStorage.getItem(dir)).datas;
                        resolve();
                    } else {
                        let ajax = new myajax();
                        let data = {
                            dir,
                            page,
                            pagesize: this.pagesize
                        };
                        ajax.ajax(url, data, (response) => {
                            //   console.log(response.data);
                            // console.log(this.datas);
                            if (page === 1) {
                                this.datas = [];
                            }
                            if (response.data.success[0].length === 0) {
                                this.end = true;
                            }
                            /*else
                       {

                       }*/
                            response.data.success.forEach((value) => {
                                this.datas = this.datas.concat(value);
                            });
                            //   console.log(this.datas);
                            sessionStorage.setItem(dir, JSON.stringify({datas: this.datas, page}));
                            resolve();
                        }, (err) => {
                            console.log(err.response);
                        }).then(() => {
                            if (foldername) {
                                this.$store.commit('pushPath', foldername);
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
