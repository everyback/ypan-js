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
    path:['/'],
    count:0,
    dir_to:"/",

    selected:{
        file:[],
        folder:[],
    },
    rename:false,
    // needselectes:false,

    closedialog:false,
    refresh:false,
    createnewfolder:false,

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
    },
    fullPath(state)
    {
        if (state.path.length === 1)
        {
            return '/';
        }
        let arr = state.path;
        arr = arr.filter((val)=>{
            return !(val === "" || val === "/");
        });
        arr.unshift("");
        return arr.join('/');


    },
    paths(state)
    {
        return state.path;
    },
    haveselected(state)
    {

        return state.selected.file.length  !== 0 || state.selected.folder.length  !== 0;
    },
    dialog_c(state)
    {
        return state.closedialog;
    },
    fresh(state)
    {
        return state.refresh;
    },
    cnfolder(state)
    {
        return state.createnewfolder;
    },
    isrename(state)
    {
        return state.rename;
    },
    selectsum(state)
    {
        return state.selected.file.length + state.selected.folder.length ;
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
    addfilelist(state,data)
    {
        state.files = state.files.concat(data);
    },
    filecancel(state,datas)
    {
        Vue.set(state.filecancel,datas.key,datas.data);
    },
    addPath(state,data)
    {
        state.path = state.path.concat(data);
    },
    pushPath(state,data)
    {
        state.path.push(data);
    },
    popPath(state,data =1)
    {
        state.path.pop();
    },
    changePath(state,data)
    {
        state.path = data;
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
