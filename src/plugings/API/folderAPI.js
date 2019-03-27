
import myajax from './myajax'
import store from '../../store'


class folderAPI{

    static createfile(folder_name,dir = null)
    {
        return new Promise((resolve,reject)=> {
            let datas = {};
            if (folder_name.indexOf('/') !== -1)
                datas = folderAPI.splitpath(folder_name);
            else
                datas = {dir, folder_name};
            //let create = new ajax.ajax();
            //console.log(datas);
            let create = new myajax();
            let url = "folder/create";
            create.ajax(url, datas, (response) => {
                // console.log(response);
                resolve();
            }, (err) => {
                console.log(err.response);
                reject(err.response);
            }, 'post');
        });
    };

    static move(datas,dir,dir_to)
    {
        return new Promise((resolve,reject)=>{
            let url = 'folder/move';
            let ajax = new myajax();
            ajax.ajax(url,{folder_name:datas,dir,dir_to},(response)=>{
                console.log(response);
                resolve();
            },(err)=>{
                console.log(err.response);
                reject();
            },'post',)

        });
    };

    static copy(datas,dir,dir_to)
    {
        return new Promise((resolve,reject)=>{
            let url = 'folder/copy';
            let ajax = new myajax();
            ajax.ajax(url,{folder_name:datas,dir,dir_to},(response)=>{
                console.log(response);
                resolve();
            },(err)=>{
                console.log(err.response);
                reject();
            },'post',)

        });
    }
    static todelete(datas,dir)
    {
        return new Promise((resolve,reject)=>{
            let url = 'folder/delete';
            let ajax = new myajax();
            ajax.ajax(url,{folder_name:datas,dir},(response)=>{
                console.log(response);
                resolve();
            },(err)=>{
                console.log(err.response);
                reject();
            },'post',)

        });
    }
    static rename(oldname,newname,dir)
    {
        return new Promise((resolve,reject)=>{
            let url = 'folder/rename';
            let ajax = new myajax();
            ajax.ajax(url,{folder_name:oldname,new_foldername:newname,dir},(response)=>{
                console.log(response);
                resolve();
            },(err)=>{
                console.log(err.response);
                reject();
            },'post',)

        });
    }



    static splitpath(path)
    {
        let dir = store.state.path;
        path = path.split("/");
        path = path.filter((val)=>{
            return !(val === "" || val === "/");
        });

        let folder_name = path.pop();
        //console.log(path);
        dir = dir.filter((val)=>{
            return !(val === "" || val === "/");
        });
        dir.unshift("");
        if (store.state.path.length === 1)
        {
            dir = "/" + path.join("/");
        }
        else if (path.length === 0)
        {
           // console.log('me');
            dir = dir.join('/') ;
        }
        else
        {

            dir = dir.join('/') + "/" + path.join("/");
        }
        //console.log(dir);
        return {dir,folder_name};
    }




}



export default folderAPI;
