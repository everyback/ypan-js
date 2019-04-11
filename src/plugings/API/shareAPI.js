
import myajax from './myajax'
import store from '../../store'
import costum from './costum'


class shareAPI{


    static todelete(datas)
    {
        return new Promise((resolve,reject)=>{
            let url = 'share/delete';
            let ajax = new myajax();

            ajax.ajax(url,{sharepath:datas},(response)=>{
                console.log(response);
                resolve();
            },(err)=>{
                console.log(err.response);
                reject();
            },'delete')
        });
    };

    static create({file,folder},ispriv,activetime,dir)
    {
        return new Promise((resolve,reject)=>{
            let url = 'share/create';
            let ajax = new myajax();

            ajax.ajax(url,{filename:file,foldername:folder,private:ispriv,activetime,dir},(response)=>{
                console.log(response);
                resolve(response.data.success);
            },(err)=>{
                console.log(err.response);
                reject();
            },'post')
        });
    };

    static copy({file,folder},sharepath,dir,dir_to,code="")
    {
        return new Promise((resolve,reject)=>{
            let url = 'share/copy';
            let ajax = new myajax();

            ajax.ajax(url,{filename:file,foldername:folder,sharepath,dir,dir_to,code},(response)=>{
                console.log(response);
                resolve(response.data.success);
            },(err)=>{
                console.log(err.response);
                reject();
            },'post').then(()=>{
                costum.me()
            })
        });
    };

    static download(datas,dir,sharepath,code="")
    {

        return new Promise((resolve,reject)=>{
            //let url = 'createdownload';
            let url = 'share/createdownload';
            let ajax = new myajax();
            ajax.ajax(url,{filename:datas.files,foldername:datas.folders,dir,sharepath,code},(response)=>{
                resolve(response.data.success);
            },(err)=>{
                console.log(err.response);
                reject();
            },'post')

        });
    }

    static publicshare(page)
    {
        return new Promise((resolve,reject)=>{
            //let url = 'createdownload';
            let url = 'share/publiclist';
            let ajax = new myajax();
            ajax.ajax(url,{page},(response)=>{
                resolve(response.data.success);
            },(err)=>{
                console.log(err.response);
                reject();
            },'get')

        });
    }

    static usershare(page)
    {
        return new Promise((resolve,reject)=>{
            //let url = 'createdownload';
            let url = 'share/userlist';
            let ajax = new myajax();
            ajax.ajax(url,{page},(response)=>{
                resolve(response.data.success);
            },(err)=>{
                console.log(err.response);
                reject();
            },'get')

        });
    }





}


export default shareAPI;
