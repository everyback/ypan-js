
import SparkMD5 from 'spark-md5'
import store from '../store'

class md5{
    static calcfilemd5(file,allleng)
    {
        let md5 = false;
        return new Promise((resolve,reject)=>{
            const chunkSize = 5*(8*1024*1024);              //8*1024*1024*5              // Read in chunks of 2MB
            let chunks = Math.ceil(file.size / chunkSize);
            let currentChunk = 0;
            let spark = new SparkMD5.ArrayBuffer();
            let fileReader = new FileReader();
            let blobSlice = File.prototype.slice;
            let md5 = false;

            fileReader.onload =  (e)=> {
                spark.append(e.target.result);                   // Append array buffer
                currentChunk++;

                if (currentChunk < chunks) {
                    loadNext();
                } else {
                    md5 = spark.end();
                    // console.timeEnd('aaa');
                    resolve(md5);
                }
            };

            fileReader.onerror = (e)=> {
                console.warn('oops, something went wrong.');
                reject(false);
            };

            function loadNext() {
                let start = currentChunk * chunkSize,
                    end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
                fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
                if (store.state.filecancel[allleng])
                {
                    reject('user cancel md5');
                }
            }
            loadNext();
        });
    };
}

export default md5;
