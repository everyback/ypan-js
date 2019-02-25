import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

let state = {
    screen : 9/16,
    read:0,
    step :0,
    code :'',
    scroll:0,
    drag : false,
    sidebarOpen:true,//左侧边栏开关
    uploadBoxOpen:false,
    Nprogress:false,//加载进度条
    title_name:'Home',
    sidebarBanName:["Login","Register","Forget","Reset"],
    user_info:{},
    login:false,

    files:[],
    filestatus:[],
    fileuploading:[],
    filecancel:[],
};

let getters = {
    bigscreen:(state)=>{
        //console.log(val);
        return state.screen > 4/3;
    },
    islogin(state)
    {
        if (state.login == false)
        {
            state.login = localStorage.getItem('login');

        }
        return !!state.login;
    },
    barOpen(state)
    {
        return state.sidebarOpen;
    },
    read(state)
    {
        return state.read;
    },
    scroll(state)
    {
        return state.scroll;
    },
    titlename(state)
    {
        return state.title_name;
    },
    isdrag(state)
    {
      return state.drag;
    },
    isuploadBoxOpen(state)
    {
        return state.uploadBoxOpen;
    },
    files(state)
    {
        const files = state.files;
        const filestatus = state.filestatus;
        const fileuploading = state.fileuploading;
        return {
            files,
            filestatus,
            fileuploading,
        };
    },
    numberofsuccess(state)
    {
        let all = state.filestatus.length ;
        let suc = 0;
        state.filestatus.forEach((val)=>{
            val === 'success' ? suc++:'';
        });
        return suc;
    },
    countfiles(state)
    {
        return state.files.length;
    },
    userInfo(state)
    {
        if (state.user_info.name)
        {
            return state.user_info;
        }
        if (localStorage.getItem('user_info'))
        {
            return JSON.parse(localStorage.getItem('user_info'));
        }
        else
            return false;
    }

};

let mutations = {
/*    storeNew(state,datas)
    {
        state[datas.key] = datas.data;
    },*/
    storeNew(state, datas)
    {
        state[datas.key] = datas.data;
    },
    storefilestatus(state,datas)
    {
        Vue.set(state.filestatus,datas.key,datas.data);
       // state.filestatus[datas.key] = datas.data;
    },
    storefileuploading(state,datas)
    {
        Vue.set(state.fileuploading,datas.key,datas.data);
       // state.fileuploading[datas.key] = datas.data;
    },
    addfilelist(state,datas)
    {
        state.files = state.files.concat(datas.data);
    },
    filecancel(state,datas)
    {
        Vue.set(state.filecancel,datas.key,datas.data);
    },

};

let actions = {

};


const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions
});

export default store;
