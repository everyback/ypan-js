import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import dirpan from '@/components/pan'
import store from './store'
// import disk from "./views/disk"
Vue.use(Router);
// import testtree from '@/components/Folder/folder'
import getrole from "@/plugings/API/getrolerouter"
import test from './components/selectShare'

const Login = resolve('Login');
const Mindex = resolve('Mindex');
const Register = resolve('Register');
const forgetpassword = resolve('forgetpassword');
const forgetpw_s1 = resolve('stepone',"./views/forget");
const forgetpw_s2 = resolve('steptwo',"./views/forget");
const forgetpw_s3 = resolve('stepthree',"./views/forget");
const logout = resolve('logout');
const disk = resolve('disk');
const setting = resolve('setting');
const share =resolve('share');
const myshare = resolve('myshare');
const sharecontent = resolve("sharecontent");
const publicshare = resolve("publicshare");
const sharecontentpan = resolve("sharecontentpan");
// const dirpan = resolve('',"@components/pan");

function resolve(name,fullpath = null)
{
    let path = fullpath === null ? './views/'+ name : fullpath + '/' + name;
   //  console.log(path);
    return resolve =>{
        import(`${path}`).then(moudle => {
            resolve(moudle)
        })
    };
}

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/index',
            alias:'index',
            component: Mindex, //计划做基础总和页面
        },
        {
            path: '/home',
            component: Home,
            children:[
            {
                path: '/',
                redirect: '/home/disk',
            },
            {
                path: 'disk',
                component: disk,
               // name:"disk",
                   children:[
                    {
                         path: 'dir/:path?',
                         name:'dir',
                         component: dirpan,
                     },
                     {
                         path: '/',
                         redirect: '/home/disk/dir',
                     },

                 ],
            },

            ],
        },
        {
            path: '/disk',
            redirect: '/home/disk',
        },
        {
            path: '/',
            redirect: '/home/disk',
        },
/*        {
            path: '/index',
            name:'index',
            component: Mindex, //展示引导界面,先不做
        },*/
        {
            path: '/login',
            name: 'login',
            component: Login,
        },
        {
            path: '/register',
            name: 'register',
            component: Register,
        },
        {
            path: '/logout',
            name: 'logout',
            component: logout,
        },
        {
            path: '/test',
            name: 'test',
            component: test,
        },
        {
            path: '/setting',
            name: 'setting',
            component: setting,
        },
        {
            path: '/share',
            component: share,
            children:[
                {
                    path: '/',
                    name: 'publicshare',
                    component: publicshare,
                },
                {
                    path: 'link/:sharepath',//链接具体内容
                    // name: 'link',
                    component: sharecontent,
                    children:[
                        {
                            path: '/',
                            name: 'sharecontentpan',
                            component: sharecontentpan,
                        },
                    ],
                },
                {
                    path: 'public',
                    redirect:"/share/",
                },
            ],

        },
        {
            path:"/myshare",
            name: "myshare",
            component: myshare,
        },
        /*
        {
            path: '/share',
            name: 'share',
            component: share,
        },
        {
            path: '/user',
            name: 'user',
            component: user,
        },*/
        {
            path: '/forgetpassword',
            component: forgetpassword,
            children:[
                {
                    path: '/',
                    alias: 'stepone',
                    component: forgetpw_s1,
                },
                {
                    path: 'steptwo',
                    name: 'steptwo',
                    component: forgetpw_s2,
                },
                {
                    path: 'stepthree',
                    name: 'stepthree',
                    component: forgetpw_s3,
                },
            ],
        },
        {
            path: '*',
            redirect: '/setting',
        },
    ]
});

router.beforeEach((to, from, next) => {
    if ((to.path !== from.path && sessionStorage.getItem("role") === "false") || from.path === '/login')
    {
        getrole.getrolemap().then((resolve)=>{
            if (resolve !== 0)
            {
                router.addRoutes(resolve);
            }
        },(reject)=>{

        }).then(()=>next());
    }else
    {
        if (to.path === '/login')
        {

            next();
        }
        next();
    }



});

export default router;






/*export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/!* webpackChunkName: "about" *!/ './views/About.vue')
}
  ]
})*/
