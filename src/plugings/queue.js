
import store from "./../store"
import FileAPI from "./API/fileAPI"
import myajax from './API/myajax'

class queue {

    constructor()
    {
        this.list = [];
        this.line = 3;
        this.time =  '';
        this.count = 0;
    }

     push(index)
    {
        this.list.push(index);
        if (store.state.indoing < this.line)
        {
            //FileAPI.uploadfile(allleng,value).then();
            this.shift();
        }
    }

     shift()
    {
        store.commit("plusload");
        let ind = this.list.shift();
        FileAPI.uploadfile(ind).then((resolve)=>{
            store.commit("minusload");
            if (store.state.indoing < this.line && this.list.length >0)
            {
                this.shift();
            }
            if (this.count <=10)
            {
                clearTimeout(this.time);
                this.count++;
            }
            else {
                this.count = 0;
            }
            this.time = setTimeout(()=>{
                let ajax = new myajax();
                ajax.ajax('auth/me','',(response)=>{
                    localStorage.setItem('user_info',JSON.stringify(response.data));
                    store.commit('storeNew',{key:'user_info',data:response.data});
                },(err)=>{console.log(err.response)},'get',true);
            },5000);

        },(reject)=>{
                store.commit("minusload");
                if (store.state.indoing < this.line && this.list.length >0)
                {
                    this.shift();
                }
        });
    }



}


export default queue;
