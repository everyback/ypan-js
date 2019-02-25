import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
Vue.use(Router);

const Login = resolve('Login');
const Mindex = resolve('Mindex');
const Register = resolve('Register');
const forgetpassword = resolve('forgetpassword');
const forgetpw_s1 = resolve('stepone',"./views/forget");
const forgetpw_s2 = resolve('steptwo',"./views/forget");
const forgetpw_s3 = resolve('stepthree',"./views/forget");
const logout = resolve('logout');

function resolve(name,fullpath = null)
{
    let path = fullpath === null ? './views/'+ name : fullpath + '/' + name;
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
            path: '/',
            alias:'home',
            component: Home, //展示引导界面,先不做
        },
        {
            path: '/home',
            alias:'home',
            component: Home,
        },
        {
            path: '/index',
            alias:'index',
            component: Mindex, //展示引导界面,先不做
        },
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
        },/*
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
    ]
});

/*router.beforeEach((to, from, next) => {

    if (localStorage.getItem('user'))
    {

        if (!sessionStorage.getItem('map'))
        {
            const url = 'showroutes';
            myajax.ajax(url,{},(response)=>{
                console.log(response.data.success);
                const way = response.data.success;
                sessionStorage.setItem('map',JSON.stringify(way));
            },(err)=>{console.log(err.response)},'get',false);
        }

    }
    if (to.path === '/login')
    {
        next();
    }
    next();
});*/

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
