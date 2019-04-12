
export default
{
  name:'formats',
   format(UnixTime){
   //  let a = UnixTime.replace("/Date(", "").replace(")/", "");
     //console.log(UnixTime);
     if (!UnixTime)
        UnixTime =Date.parse(new Date())/1000;
     let date = new Date(parseInt(UnixTime*1000));
     let y = date.getFullYear();
     let m = date.getMonth() + 1;
     m = m < 10 ? ('0' + m) : m;
     let d = date.getDate();
     d = d < 10 ? ('0' + d) : d;
     let h = date.getHours();
     h = h < 10 ? ('0' + h) : h;
     let minute = date.getMinutes();
     let second = date.getSeconds();
     minute = minute < 10 ? ('0' + minute) : minute;
     second = second < 10 ? ('0' + second) : second;
     // console.log(a);
     return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;

    },
    bytesToSize(bytes) {
      //console.log(bytes);
        if (parseInt(bytes) == 0  )
            return '0 B';
        let k = 1024;
        let sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let i = Math.floor(Math.log(bytes) / Math.log(k));
        //return (bytes / Math.pow(k, i)) + ' ' + sizes[i];
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }
}
