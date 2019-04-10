import store from "../../store";
import myajax from "./myajax";

class costum{


    static me()
    {
        let ajax = new myajax();
        ajax.ajax('auth/me','',(response)=>{
            localStorage.setItem('user_info',JSON.stringify(response.data));
            store.commit('storeNew',{key:'user_info',data:response.data});
        },(err)=>{console.log(err.response)},'get',true);
    }

    static changepassword(oldpassword,newpassword)
    {
        return new Promise((resolve,reject)=> {
            let ajax = new myajax();
            const data = {
                public: {},
                secret: {
                    oldpassword,
                    newpassword,

                }
            };
            ajax.ajax('changepassword', data, (response) => {
                console.log(response);
                resolve(response);
            }, (err) => {
                console.log(err.response.data);
                reject(err.response.data);
            }, 'post', true);
        });

    }
    static changename(newname)
    {
        return new Promise((resolve,reject)=>{
            const data = {
                newname
            };
            let ajax = new myajax();
            ajax.ajax('changename',data,(response)=>{
                console.log(response);
                resolve(response);
            },(err)=>{
                console.log(err.response);
                reject(err.response);
            },'post',true);
        });
    }
}

export default costum;
