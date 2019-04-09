<template>

    <div>
        <div v-if="islogin">
            <div >
                <mu-paper style=" min-height: 5rem; " :z-depth="5">
                    <div class="flex-box">
                        <mu-button v-if="haveselected" @click="opencopy()">
                            COPY
                        </mu-button>
                        <mu-button v-if="haveselected" @click="download()">
                            DOWNLOAD
                        </mu-button>
                    </div>
                </mu-paper>
                <folder :action="()=>move()" :open.sync="selectopen.move" />
                <!--<selectshare  :open.="selectopen.share"   />-->
            </div>
            <mu-paper style="margin-top: 20px;min-height:670px;" :z-depth="5">
                <!--<dragfiles />-->
                <!--<keep-alive>-->

                <router-view :key="key" :move="()=>openmove()" :copy="()=>opencopy()" :delete="()=>opendelete()"  :download="download"/>
                <!--</keep-alive>-->
            </mu-paper>
            <a :href="herf" :download="downloadname" v-show="false"  ref="downloadfile">4</a>
        </div>
    </div>










</template>

<script>

    import myajax from './../plugings/API/myajax'
    import {mapGetters} from 'vuex'
    import Folder from "../components/Folder/folder";

    export default {
        components: {Folder},
        name: "sharecontent",
        data()
        {
          return{
              sharepath:this.$route.params.sharepath,
              page:1,
              downloadname:'files',
              herf:"",
              selectopen:{
                  copy:false,
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

        },
        computed:{
            ...mapGetters(['fullPath','paths',"fresh","cnfolder","isrename"]),
        },
        methods:
        {

        }
    }
</script>

<style scoped>



</style>
