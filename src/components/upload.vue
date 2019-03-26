<template>
    <div @dragstart="false" >
        <mu-paper v-if="isuploadBoxOpen"  class="upbox" :class="isshow? '':'upbox-min'" :z-depth	='0'>
            <mu-appbar style="width: 100%;border-radius: 0.5rem 0.5rem 0 0 "  :z-depth='0'>
                <div slot="left" @dragstart="false" style="user-select: none">
                    Uploading
                </div>
            </mu-appbar>
            <div style="position: absolute;right: -20px;top: 10px;width: 150px">
                <mu-button icon v-if="isshow" style="display: inline-block" @click="minbox()">
                    <mu-icon size="23" value="remove" > </mu-icon>
                </mu-button>
                <mu-button icon v-else style="display: inline-block" @click="minbox()">
                    <mu-icon size="23" value="crop_5_4" > </mu-icon>
                </mu-button>
                <mu-button icon  style="display: inline-block;" @click="closebox()">
                    <mu-icon size="23" value="close" > </mu-icon>
                </mu-button>
            </div>
            <div v-if="!isshow" style="position: absolute;right: 50%;width: 150px;top:20px;font-size: 1.2rem;user-select: none">
                {{numberofsuccess}}/{{countfiles}}
            </div>
            <div  style="overflow-y:auto;width: 100%;height:380px;user-select: none" @dragstart="false" >
                <div class="table"  style="width:98%;margin: auto">
                    <div class="table-thead"  >
                        <div class="table-row" style="height: 50px;" >
                            <div class="table-cell" style="width: 35%;" >
                                filename
                            </div>
                            <div class="table-cell" style="width: 10%" >
                                size
                            </div>
                            <div class="table-cell" style="width: 8%" >
                                to
                            </div>
                            <div class="table-cell" style="width: 15%" >
                                result
                            </div>
                            <div class="table-cell" style="width: 13%" >
                                state
                            </div>
                            <div class="table-cell" style="width: 19%" >
                                operation
                            </div>
                        </div>
                    </div>
                    <div class="table-tbody" v-if="toupload">
                        <div class="table-row" v-for="(val,index) in files.files" :key=" index" style="height: 30px">
                            <div class="table-cell" style="overflow: hidden;white-space:nowrap;text-overflow:ellipsis;">
                                {{ val.name}}
                            </div>
                            <div class="table-cell">
                                {{bytesToSize(val.size) }}
                            </div>
                            <div class="table-cell">

                            </div>
                            <div class="table-cell">
                                {{ files.fileuploading[index]}}
                            </div>
                            <div class="table-cell">
                                {{ files.filestatus[index]}}
                            </div>
                            <div class="table-cell">
                                <div v-if="files.filestatus[index] !== 'success' && files.filestatus[index] !== 'failed'&&  files.filestatus[index] !== 'user cancel'">
                                    <mu-button icon  small color="primary">
                                        <mu-icon size="15" value="pause" > </mu-icon>
                                    </mu-button>
                                    <mu-button icon  small color="red" @click="cancel(index)">
                                        <mu-icon size="15" value="close" > </mu-icon>
                                    </mu-button>
                                </div>
                                <div v-else-if=" files.filestatus[index] === 'success' ">
                                        <mu-icon size="15" value="check" color="green"> </mu-icon>
                                </div>
                                <div v-else-if=" files.filestatus[index] === 'user cancel' ">
                                    <mu-icon size="15" value="close" color="primary"> </mu-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </mu-paper>
    </div>
</template>

<script>
    import MuAppbar from "muse-ui/es5/AppBar/AppBar";
    import {mapGetters} from 'vuex'
    import MuPaper from "muse-ui/es5/Paper/Paper";
    import formats from './../plugings/formats'

    export default {
        components: {
            MuPaper,
            MuAppbar},
        name: "upload",
        data()
        {
            return {
              isshow:true,
                toupload:false,
                ismini:false,
              //  files:[],

            };
        },
        computed:{
            ...mapGetters(['files',"isuploadBoxOpen",'numberofsuccess','countfiles']),
        },
        watch:{
            files(val)
            {
                //console.log(val);
                if (val.files.length !== 0 )
                {
                    this.toupload = true;
                }
            }
        },
        methods:
            {
                gogogo(val)
                {
                  console.log(val)
                },
                cancel(index)
                {
                    this.$store.commit('filecancel',{key:index,data:true});
                },
                minbox()
                {
                    this.isshow = !this.isshow;
                },
                closebox()
                {
                    this.$store.commit("storeNew",{key:"uploadBoxOpen",data:false});
                },
                bytesToSize(size)
                {
                    return formats.bytesToSize(size);
                },
            }

    }
</script>

<style scoped>
    .table{
       display: table;
        table-layout:fixed;
    }
    .table-row {
        display: table-row;
    }
    .table-cell{
        display: table-cell;
    }
    .table-thead{
        display:table-header-group;

    }
    .table-tbody{
        display:table-row-group;
    }

/*    .upbox-show{

    }*/
    .upbox{
        border-radius: 0.5rem;
        box-shadow:10px 10px 20px rgba(0,0,0,0.25);
        width: 37.5rem;
        height:28.15rem;
        position:fixed;
        bottom: 0;
        right: 50px
    }
    .upbox-min{
        /*margin-bottom: -400px;*/
        /*//top:450px;*/
        bottom: -385px;
    }
    .upbox-hide{
        display:none;
    }

</style>

