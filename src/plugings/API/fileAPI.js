
import myajax from './myajax'

class fileAPI{
    static put(files,dir)
    {
        return new Promise((resolve,reject)=>{
            let url = 'file/put';
            let ajax = new myajax();
            ajax.ajax(url,files,(response)=>{
                console.log(response);
                resolve();
            },(err)=>{
                console.log(err.response)
            },'post',)

        });
    };

    static move(datas,dir,dir_to)
    {
        return new Promise((resolve,reject)=>{
            let url = 'file/move';
            let ajax = new myajax();
            ajax.ajax(url,{filename:datas,dir,dir_to},(response)=>{
                console.log(response);
                resolve();
            },(err)=>{
                reject();
                console.log(err.response)
            },'post',)

        });
    };

    static copy(datas,dir,dir_to)
    {
        return new Promise((resolve,reject)=>{
            let url = 'file/copy';
            let ajax = new myajax();

            ajax.ajax(url,{filename:datas,dir,dir_to},(response)=>{
                console.log(response);
                resolve();
            },(err)=>{
                console.log(err.response);
                reject();
            },'post')

        });
    };

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
            },'post')

        });
    };

    static download(datas,dir)
    {

        return new Promise((resolve,reject)=>{
            let url = 'file/createdownload';
            let ajax = new myajax();
            ajax.ajax(url,{filename:datas,dir},(response)=>{
                //console.log(response.data.success);
                //this.startdownload(response.data.success.path);

                resolve(response.data.success.path);
            },(err)=>{
                console.log(err.response);
                reject();
            },'post')

        });
    }

/*    static startdownload(path)
    {
        let code = path.split("/");
        code = code[code.length - 1];
        return new Promise((resolve,reject)=>{
            let url = 'download/' + code;
            let ajax = new myajax();

            ajax.ajax(url,{},(response)=>{
                resolve();
            },(err)=>{
                console.log(err.response);
                reject();
            },'get');

        });
    }*/

    static rename()
    {

    }

}


export default fileAPI;
