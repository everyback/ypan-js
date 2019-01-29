import Resource from 'vue-resource';
import Vue from 'vue'
//import vueEvent from 'vevent'
// Vue.use(Resource);
import JsEncrypt from 'jsencrypt'
import axios from 'axios'
//import Vue from 'vue'
import store from './../store'
// import Vue from 'vue'
export default
{
    name:'myajax',
    //rootpath:'http://182.254.134.224/laravel',
   // rootpath:'http://127.0.0.1:8000/api/',
    store,
    ajax(url,data,callback,errcallback = (err)=>{console.log(err.response)},method = 'get',front = true)
    {
        if (front)
        {
            store.commit('Nprogress',true);
        }
        let encrypted = '';
      //  console.log(data);
        //console.log(JSON.stringify(data.secret));
        if (data.secret )
        {
            if (localStorage.getItem('pubkey'))
            {
                let jse = new JsEncrypt;
                let pubkey = JSON.parse(localStorage.getItem("pubkey"));
                jse.setPublicKey(decodeURIComponent(pubkey));
                encrypted = jse.encrypt(JSON.stringify(data.secret));
                if (encrypted === false)
                {
                    return 'key不对';
                }
            }
            else
            {
                return false;
            }
        }

        let newdatas;
        if (data.secret)
        {
            let sname = data.sname ? data.sname:'priv';
            newdatas = Object.assign({},data.public,{[sname]:encrypted});
        }
        else
        {
            newdatas = Object.assign({},data.public,);
        }
      //  console.log('fffff');
      //  console.log(newdatas);
        let ways = 'params';
        if ([ 'put','post','patch'].includes(method) )
        {
            ways = 'data';
        }
        const instance = axios.create({
            method:method,
            baseURL: 'http://127.0.0.1:8000/api/',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded ',
               // 'Content-Type':'multipart/form-data'
               // 'Content-Type':'application/json',
            },
            //cancelToken: source.token,
            timeout: 5000,
            responseType: 'json',
            withCredentials:true,   //加了这段就可以跨域了

          //  [ways]: newdatas,
            params:newdatas,
        });
/*        instance.interceptors.request.use((response)=>{
            store.commit('Nprogress',false);
        },(err)=>{
            store.commit('Nprogress',false);
        });*/
        instance(
            url,
            method,
         //   newdatas,

        ).then(callback,errcallback).then(()=>{
            //console.log(front);
            front ? store.commit('Nprogress',false):'';});
        return true;
    },




















/*    ajax (that,url,data,callback ,method = 'post', errcallback = (err)=>{console.log(err)} )
    {
        // const url = "http://182.254.134.224/new/apig/apikeys.php";
        if (localStorage.getItem('idsession') && localStorage.getItem("pubkey"))
            if (localStorage.getItem('idsession') !== "" || localStorage.getItem("pubkey") !== '') {

                let sess = JSON.parse(localStorage.getItem('idsession'));
                let pubkey = JSON.parse(localStorage.getItem("pubkey"));
                let jse = new JsEncrypt;
                jse.setPublicKey(decodeURIComponent(pubkey));
                let encrypted = jse.encrypt(sess);
                // let enkey = jse.encrypt(privkey);
                if (encrypted == false) {
                    /!*          this.getk();
                              this.message = "pub key 不正确";*!/
                    console.log("pub key 不正确");
                }
                else
                {
                    let post = Object.assign({},{utoken:sess},{priv: encrypted},postdata);
                    // console.log(post);
                    that.$http.post(url,post,{emulateJSON: true}).then((response)=>{
                            callback(response);
                        },
                        (err)=>{
                            errcallback(err);
                        }
                    );
                }
            }
    },*/

}
