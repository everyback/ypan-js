
import myajax from './myajax'
import store from '../../store'


class shareAPI{


    static todelete(datas,dir)
    {
        return new Promise((resolve,reject)=>{
            let url = 'file/delete';
            let ajax = new myajax();

            ajax.ajax(url,{filename:datas,dir},(response)=>{
                console.log(response);
                resolve();
            },(err)=>{
                console.log(err.response);
                reject();
            },'delete')
        }).then(()=>{
            costum.me()
        });
    };

    static create()
    {
        return new Promise((resolve,reject)=>{
            let url = 'share/delete';
            let ajax = new myajax();

            ajax.ajax(url,{filename:datas,dir},(response)=>{
                console.log(response);
                resolve();
            },(err)=>{
                console.log(err.response);
                reject();
            },'delete')
        });
    };


    static userlist()
    {
        return new Promise((resolve,reject)=>{
            let url = 'share/userlist';
            let ajax = new myajax();

            ajax.ajax(url,{filename:datas,dir},(response)=>{
                console.log(response);
                resolve();
            },(err)=>{
                console.log(err.response);
                reject();
            },'delete')
        });
    }

    static download(datas,dir)
    {

        return new Promise((resolve,reject)=>{
            //let url = 'createdownload';
            let url = 'createpath';
            let ajax = new myajax();
            ajax.ajax(url,{filename:datas.files,foldername:datas.folders,dir},(response)=>{
                resolve(response.data.success);
            },(err)=>{
                console.log(err.response);
                reject();
            },'post')

        });
    }


}


export default fileAPI;
