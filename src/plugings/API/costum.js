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
}

export default costum;
