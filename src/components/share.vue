<template>
    <mu-dialog :width="700" :open.sync="open">
        <div class="india">
            <ul>
                <li>
                    <div class="inli"  @dblclick.stop.self="opens_r()" @click.stop.self="select_r()">
                        <span class="more" v-if="data[0] !== 'empty'" @click.stop.self="opens_r()">[{{ open_r ? '-' : '+' }}]</span>
                        <mu-icon class="icon" size="25" value="folder"  v-if="!open_r"/>
                        <mu-icon class="icon" size="25" value="folder_open" v-else />
                        <span> / </span>
                    </div>
                </li>
                <li v-if="open_r">
                    <ul>
                        <li v-for="(name,index) in data" v-if="data.length !==0"   >
                            <div class="inli" v-if="data[0] !== 'empty'" @dblclick.stop.self="opens(index)" @click.stop.self="select(index)">
                                <span class="more" v-if="data[0] !== 'empty'" @click.stop.self="opens(index)">[{{ selects[index] ? '-' : '+' }}]</span>
                                <mu-icon class="icon" size="25" value="folder"  v-if="!selects[index]"/>
                                <mu-icon class="icon" size="25" value="folder_open" v-else />
                                <span>{{name.folder_name}}</span>
                            </div>
                            <tree v-if="selects[index]" :folder="name.folder_name" :dir="dir">
                            </tree>
                        </li>
                        <!--<li class="inspan" v-else>
                            no folder
                        </li>-->
                    </ul>
                </li>
            </ul>
        </div>
        <mu-button slot="actions" flat color="primary" @click="closedialog()" >Cancel</mu-button>
        <mu-button slot="actions" flat color="primary" @click="action()" >Ok！</mu-button>
    </mu-dialog>
</template>

<script>
    export default {
        name: "selectshareno",
        props:{
            action:{
                type:Function,
                default:()=>{},
            },
            open:{
                type:Boolean,
                default:false,
            }
        },
        data()
        {
            return {
                data:[],
                res :{},
                selects:[],
                open_r:true,

                dialog:{
                    open:false,
                },
            };
        },
    }
</script>

<style scoped>

</style>
