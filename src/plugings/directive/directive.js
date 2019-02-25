import Vue from 'vue';
import Hammer from 'hammerjs'


function vueTouch(el,vnode){

    return  new Hammer(el);
}

function Vtouch(type)
{
    return Vue.directive(type,{
        bind:(el,binding,vnode)=>{
            self.type = type;
            self[self.type] = vueTouch(el,vnode);
            self[self.type].on(self.type,binding.value);

        },
        unbind:(el,binding)=>{
            self[self.type].off(self.type,binding.value);
        }
    });
}

/*const tap = Vtouch("tap");
const swipeleft = Vtouch("swipeleft");
const swiperight = Vtouch("swiperight");
const press = Vtouch("press");*/

const tap = Vue.directive("tap",{
    bind:(el,binding,vnode)=>{
        self.type = "tap";
        self[self.type] = vueTouch(el,vnode);
        self[self.type].on(self.type,binding.value);
    },
    unbind:(el,binding,vnode)=>{
        self[self.type].off(self.type,binding.value);
    }
});
const swipeleft = Vue.directive("swipeleft",{
    bind:(el,binding,vnode)=>{
        self.type = "swipeleft";
        self[self.type] = vueTouch(el,vnode);
        self[self.type].on(self.type,binding.value);
    },
    unbind:(el,binding)=>{
        self[self.type].off(self.type,binding.value);
    }
});
const swiperight = Vue.directive("swiperight",{
    bind:(el,binding,vnode)=>{
        self.type = "swiperight";
        self[self.type] = vueTouch(el,vnode);
        self[self.type].on(self.type,binding.value);
    },
    unbind:(el,binding,vnode)=>{
        self[self.type].off(self.type,binding.value);
    }
});
const press = Vue.directive("press",{
    bind:(el,binding,vnode)=>{
        self.type = "press";
        self[self.type] = vueTouch(el,vnode);
        self[self.type].on(self.type,binding.value);
    },
    unbind:(el,binding,vnode)=>{
        self[self.type].off(self.type,binding.value);
    }
});



const touch = {tap,swipeleft,swiperight,press};



export default touch;

