import store from "@/store"
import myajax from "./myajax"

class getrolemap{

    static getrolemap()
    {
        return new Promise((resolve,reject)=>{
            if (store.state.user_info || JSON.parse(localStorage.getItem("user_info")) !== "" )
            {
                let user = JSON.parse(localStorage.getItem("user_info"));
                // console.log(user);
                if (!user ||user === {})
                {
                    reject (0);
                }
                if (user.role !== 1 )
                {
                    resolve(0);
                }
                if (sessionStorage.getItem("role") === true)
                {
                    resolve(0);
                }

                if (store.state.r_map.length !== 0)
                {
                    resolve(store.state.r_map);
                }
                console.log(user.role);
                if (user.role === 1 )
                {
                    let ajax = new myajax();
                    ajax.ajax("rolerouter",{},(response)=>{
                        console.log(response.data.success.routes);
                        if (response.data.success.routes.length !== 0)
                        {
                            store.commit("storeNew",{key:"r_map",data:response.data.success.routes});
                            store.commit("storeNew",{key:'role',data:true});
                            store.commit("storeNew",{key:"role_items",data:response.data.success.items});
                            sessionStorage.setItem("role",true);
                            resolve(this.generaMenu(response.data.success.routes));
                        }
                    },(err)=>{
                        console.log(err.response.data.err);
                        reject(err.response.data.err);
                    },"get",false );
                }
            }
        });

    }

    static generaMenu(data)
    {
        data.forEach((item)=>{
            item.component = this.lazy(item.component,item.path);
            if(item.children){
                this.generaMenu(item.children)
            }
        });
        return data;
    }
    static lazy(name,path) {
        console.log('name = '+name);
        return () => import(`@/views/${name}.vue`);
        /*if (name === 'supers' || name === 'mainpage' )
            return  () =>  import(`@/components/${name}/${name}.vue`);*/
       /* else if (name === 'articles' )
        {
            return () => import(`@/components/supers/article/template/articles.vue`);
        }
        else if ( path === 'p/:id')
        {
            return () => import(`@/components/supers/article/template/alterarticle.vue`);
        }
        else
        {
            return () => import(`@/components/supers/${name}/${name}.vue`);
        }*/

    }
}

export default getrolemap;
