import Vue from 'vue';
import hammer from 'hammerjs'

function vueTouch(el,type,binding){
    this.el = el;
    this.type = type;
    this.binding = binding;
    let hammertime = new Hammer(this.el);
    hammertime.on(this.type,this.binding.value);
}



const tap = Vue.directive("tap",{
    bind:function(el,binding){
        new vueTouch(el,"tap",binding);
    }
});
const swipeleft = Vue.directive("swipeleft",{
    bind:function(el,binding){
        new vueTouch(el,"swipeleft",binding);
    }
});
const swiperight = Vue.directive("swiperight",{
    bind:function(el,binding){
        new vueTouch(el,"swiperight",binding);
    }
});
const press = Vue.directive("press",{
    bind:function(el,binding){
        new vueTouch(el,"press",binding);
    }
});

const touch = {tap,swipeleft,swiperight,press,vueTouch};

export default touch;
