<template>
    <div>
        <div style="position: relative;">
            <div style="position: absolute;height: 0.8rem;width: 12rem;background-color: darkgray;border-radius: 5px;box-shadow:0 0 20px #9e9e9e;">
            </div>
            <div style="position: absolute; z-index:1;height: 0.82rem;background-color:green ;border-radius: 6px 3px 3px 6px;transition:width 0.8s ease 0s; " :style="{'width':spaceused*100+'%','background-color':spacecolor}">
            </div>
            <span style="position: absolute;font-size: 0.8rem; z-index: 10;font-weight: 600;top: -3px;left :40%;transition:color 0.8s ease 0s;" :style="{'color':fontcolor}">
                {{(spaceused*100).toFixed(2)+'%'}}
            </span>
        </div>
        <p style="position: relative;top: 1.05rem ;margin-left: -5px" >
            {{bytesToSize(userInfo.space_used)}}/{{bytesToSize(userInfo.space)}}
        </p>
    </div>
</template>

<script>

    import {mapActions, mapGetters} from 'vuex'
    import formats from './../plugings/formats'

    export default {
        name: "space",
        computed:{
            ...mapGetters(["spaceused","userInfo"]),
            spacecolor()
            {
                /*switch (this.spaceused)
                {
                    case >0.5:
                }*/

                if (this.spaceused < 0.5)
                {
                    return "#69f0ae";
                }
                if (this.spaceused < 0.7)
                {
                    return "#ffb74d";
                }
                if (this.spaceused < 0.9)
                {
                    return "#d32f2f";
                }
                if (this.spaceused < 0.98)
                {
                    return "#b71c1c";
                }
                if (this.spaceused >= 1)
                {
                    return "#3e2723";
                }
            },
            fontcolor()
            {
                switch(this.spacecolor)
                {
                    case "#69f0ae":return "#212121";
                    case "#ffb74d":return "#e0e0e0";
                    case "#d32f2f":return "#f5f5f5";
                    case "#b71c1c":return "#eeeeee";
                    case "#3e2723":return "#e0e0e0";

                }
            }
        },
        methods:{
            bytesToSize(size)
            {
                return formats.bytesToSize(size);
            },
        }
    }
</script>

<style scoped>

</style>
