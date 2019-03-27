
import myajax from './myajax'
import store from '../../store'


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

    static getfilelist( items)//get  entry
    {
        (async ()=> {
            for (let i in items)
            {

                /* new Promise((resolve, reject) => {

                 })*/
                console.log('start');

                if (!isNaN(parseInt(i)))
                {
                    console.log(items[i].webkitGetAsEntry().isDirectory);
                    if (items[i].webkitGetAsEntry().isDirectory)
                    {
                        console.log(items[i].webkitGetAsEntry().fullPath);
                        this.createFolder(items[i].webkitGetAsEntry().fullPath);
                        console.log('before');
                        files = files.concat(await this.scanFiles(items[i].webkitGetAsEntry()));
                        console.log('after');
                    }
                    else
                    {
                        //console.log(items[i].getAsFile());
                        //let file = items[i].getAsFile();
                        console.log(items[i]);
                        // file.dir_path = fullPath;
                        //files.push(file.dir_path);
                        /*                                sha1.sha1File(items[i].getAsFile()).then((resolve)=>{
                                                            console.log(resolve);
                                                        })*/
                    }
                }

            }

            console.log(files);

            //this.portionfiles(files);
        })();
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

    static uploadfile(file,index)
    {

        return new Promise((resolve, reject) =>{
            store.commit('storefilestatus',{key:index,data:'uploading'});
            let lastsize = 0;
            let lasttime = new Date().getTime();
            let putf = new myajax();
            putf.ajax("file/put",{dir:file.path,
                filename:file.name,
                size:file.size,
                md5:file.md5,
                slice_sha1:file.slice_sha1},
                (response)=>{
                if (response.data.success === "No such file")
                {
                    put(file,index);
                }
                if (response.data.success === "save complete,by quick")
                {
                    store.commit('storefilestatus',{key:index,data:'success,by quick'});
                    store.commit('storefileuploading',{key:index,data:0});
                }
                },
                (err)=>{
                if(err.response)
                {
                    if (err.response.data.error === "already have same name file")
                    {
                        store.commit('storefilestatus',{key:index,data:'already have same name file'});
                        store.commit('storefileuploading',{key:index,data:0});
                    }
                    if (err.response.data.error === "space limit")
                    {
                        store.commit('storefilestatus',{key:index,data:'space limit'});
                        store.commit('storefileuploading',{key:index,data:0});
                    }
                }
                else
                {
                    store.commit('storefilestatus',{key:index,data:'unknow error'});
                    store.commit('storefileuploading',{key:index,data:0});
                    console.log(err);
                }

                },"post"
                );

            let put = (file,index)=>{
                putf.putfile('file/put',{file},index,(response)=>{
                        console.log(response);
                        store.commit('storefilestatus',{key:index,data:'success'});
                        store.commit('storefileuploading',{key:index,data:0});
                    },(e)=>{
                        store.commit('storefileuploading',{key:index,data:Math.floor((e.loaded / e.total*10000))/100 + '%'});
                        console.log( Math.floor(((e.loaded-lastsize)/(new Date().getTime()-lasttime))*1000/1024*100)/100 );
                        lastsize = e.loaded;
                        lasttime = new Date().getTime();
                        if (store.state.filecancel[index])
                        {
                            putf.choosecancel('user cancel upload');
                        }
                    },(err)=>{
                        console.log(err.message);
                        if (err.message === 'user cancel upload')
                        {
                            store.commit('storefilestatus',{key:index,data:'user cancel'});
                            store.commit('storefileuploading',{key:index,data:0});
                        }
                        else
                        {
                            store.commit('storefilestatus',{key:index,data:'failed'});
                            store.commit('storefileuploading',{key:index,data:0});
                        }
                    }
                )
            }
        } );
    }

    static rename(oldname,newname,dir)
    {
        return new Promise((resolve,reject)=>{
            let url = 'file/rename';
            let ajax = new myajax();
            ajax.ajax(url,{filename:oldname,new_filename:newname,dir},(response)=>{
                console.log(response);
                resolve();
            },(err)=>{
                console.log(err.response);
                reject();
            },'post')
        });
    }

}


export default fileAPI;
