
import store from "./../store"
import FileAPI from "./API/fileAPI"
import myajax from './API/myajax'
import md5 from "./md5"
import sha1 from "./sha1"

class queue {

    constructor()
    {
        this.list = [];
        this.line = 3;
        this.time =  '';
        this.count = 0;
        this.calcline = 5;
        this.calclist = [];
        this.calccount = 0;
        this.calctime = '';
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

    calcpush(index)
    {
        this.calclist.push(index);
        if (store.state.calcindoing < this.calcline)
        {
            //FileAPI.uploadfile(allleng,value).then();
            this.calcshift();
        }
    }

    calcshift()
    {
        store.commit("calcplus");
        let leng = this.calclist.shift();
        let ind = store.state.files[leng];

        (async ()=>{
            store.commit('storefilestatus',{key:leng,data:'calc md5'});
            ind.md5 = await md5.calcfilemd5(ind,leng);
            store.commit('storefilestatus',{key:leng,data:'calc sha1'});
            ind.silce_sha1 = await sha1.sha1File(ind);
            store.commit('storefilestatus',{key:leng,data:'waiting upload'});

        })().then((resolve)=>{
            store.commit("calcminus");
            this.push(leng);
            if (store.state.calcindoing < this.calcline && this.calclist.length >0)
            {
                this.calcshift();
            }
        });







/*        FileAPI.uploadfile(ind).then((resolve)=>{
            store.commit("calcminus");
            if (store.state.calcindoing < this.calcline && this.calclist.length >0)
            {
                this.calcshift();
            }
            if (this.count <=10)
            {
                clearTimeout(this.calctime);
                this.count++;
            }
            else {
                this.count = 0;
            }
            this.calctime = setTimeout(()=>{
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
        });*/
    }



}


export default queue;
