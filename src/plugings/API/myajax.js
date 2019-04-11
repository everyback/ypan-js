
import JsEncrypt from 'jsencrypt'
import axios from 'axios'
import store from '../../store'
import Vue from 'vue'
import key from './key.local'
//import process from ''

class ajax{

    constructor() {
        this.CancelToken = axios.CancelToken;
        this.source = this.CancelToken.source();
      // this.baseURL = 'http://127.0.0.1:8002/api/';
        this.baseURL = 'http://47.107.45.231:8080/api/';
    };

    ajax(url,data,callback,errcallback = (err)=>{console.log(err.response)},method = 'get',front = true)
    {
        return new Promise((resolve,reject )=>{
            if (front)
            {
                store.commit('storeNew',{key:"Nprogress",data:true});
            }
            let encrypted = {};
            let newdatas;
            if (data !== {})
            {
                if (data.secret )
                {
                    let jse = new JsEncrypt;
                    let pubkey = key.publickey;
                    //let pubkey = JSON.parse(localStorage.getItem("pubkey"));
                    jse.setPublicKey(decodeURIComponent(pubkey));
                    let flag = true;
                    for (let i in data.secret)
                    {
                        encrypted[i] = jse.encrypt(data.secret[i]);
                        flag = encrypted[i] !== false && encrypted[i] !==  '';
                    }
                    // encrypted = jse.encrypt(JSON.stringify(data.secret));
                    if (flag === false)
                    {
                        return console.log('key不对');
                    }
                }
                if (data.secret)
                {
                    newdatas = Object.assign({},data.public,{secret:encrypted});
                }
                else if (data.public)
                {
                    newdatas = Object.assign({},data.public,);
                }
                else
                {
                    newdatas = Object.assign({},data,);
                }
            }
            else
            {
                newdatas = {};
            }
            let ways = 'params';
            if ([ 'put','post','patch'].includes(method) )
            {
                ways = 'data';
            }
            const instance = axios.create({
                method:method,
                baseURL: this.baseURL,
                headers:{
                    'Content-Type':'application/json',
                },
                //cancelToken: source.token,
                timeout: 100000,
                responseType: 'json',
                withCredentials:true,   //加了这段就可以跨域了
                [ways]: newdatas,
                //data:newdatas,
                // params:newdatas,
            });
            if (localStorage.getItem('user_token'))
                instance.defaults.headers.common['Authorization'] = 'Bearer '+localStorage.getItem('user_token');
            else
                instance.defaults.headers.common['Authorization'] = '';
          //  console.log(localStorage.getItem('user_token'));
            axios.interceptors.response.use( (response) =>{
                if (respose.headers.Authorization)
                {
                    localStorage.setItem('user_token',respose.headers.Authorization);
                }
                return response;
            },  (error)=> {
                return Promise.reject(error);
            });

            instance(
                url,
                method,
            ).then(callback,errcallback).then(()=>{
                //console.log(process.env.VUE_APP_API_URL);
                front ? store.commit('storeNew',{key:"Nprogress",data:true}):'';}).then(()=>resolve());
            return true;
        });
    };

    putfile(url,data,index,callback,Progress = (e)=>{console.log((e.loaded / e.total * 100 | 0) + '%')},errcallback = (err)=>{console.log(err.response)},method = 'post')
    {
        return new Promise((resolve,reject )=>{
            let file = data.file;
            let datas = new FormData();
            datas.append('file',file);
            datas.append('filename', file.name);
            datas.append('size', file.size);
            datas.append('md5',file.md5);
            datas.append('slice_sha1',file.slice_sha1);
            datas.append('dir',file.path);
            /* if ([ 'put','post','patch'].includes(method) )
             {
                 ways = 'data';
             }*/
            const instance = axios.create({
                method:method,
                baseURL: this.baseURL ,
                headers:{
                    'Content-Type':'multipart/form-data'
                },
                //cancelToken: source.token,
                timeout: 1000000000,
                responseType: 'json',
                withCredentials:true,   //加了这段就可以跨域了
                data:datas,
                cancelToken: this.source.token,
                //  [ways]: newdatas,
                //  params:newdatas,
                onUploadProgress:(e)=>{
                    Progress(e);
                },
            });
            instance(
                url,
                method,
            ).then(callback,errcallback);
            return true;
        }).then(()=>resolve());

    };
     choosecancel(message)
    {
        this.source.cancel(message);
    };
}

export default ajax;

