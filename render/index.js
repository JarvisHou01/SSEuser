const { dialog } = require('electron').remote
const clipboard = require('electron').clipboard;
const fs = require('fs')
const crypto = require('crypto')
const path = require('path')
const nodejieba = require('nodejieba')
const { remote,shell } = require('electron')



var addword = document.getElementById('addword')



addword.onclick = function(e){
    var childwindow = new remote.BrowserWindow({
        height:350,
        width:450,
        frame:false,
        resizable:false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        }
    })

    //childwindow.webContents.openDevTools({ mode: 'detach' })
    childwindow.loadFile('addwordpage.html')

    childwindow.on('closed', () => {
        childwindow = null
    })
}



const key = '9cd5b4cf89949207'

const Alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'g', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

var upFile = document.getElementById('upFile')
var downindexfile = document.getElementById('downindexfile')
var downfile = document.getElementById('downfile')


var upencodedfile = document.getElementById('upencodedfile')
var downdecodedfile = document.getElementById('downdecodedfile')




var upfilepath = null;

var data =null;

var keywordset = null;



var upcodedfilepath = null;


const aesCryption = function (data, secretKey) {
    var iv = "";
    const cipherEncoding = 'utf8';
    const clearEncoding = 'base64';
    var cipher = crypto.createCipheriv('aes-128-ecb', secretKey, iv);
    return cipher.update(data, cipherEncoding, clearEncoding) + cipher.final(clearEncoding);
}

//传文件路径和 加密 key, 返回加密base64字符串.
function encryption_file(file_path, key) {
    var iv = "";
    var clearEncoding = 'binary';
    var cipherEncoding = 'base64';
    var cipherChunks = [];
    var cipher = crypto.createCipheriv('aes-128-ecb', key, iv);
    cipher.setAutoPadding(true);

    var buf = fs.readFileSync(file_path);
    cipherChunks.push(cipher.update(buf, clearEncoding, cipherEncoding));
    cipherChunks.push(cipher.final(cipherEncoding));
    return cipherChunks.join('');
}

//传文件路径和 加密 key, 返回字符串.
function decryption_file(file_path, key) {
    var iv = "";
    var clearEncoding = 'utf8';
    var cipherEncoding = 'base64';
    var cipherChunks = [];
    var cipher = crypto.createDecipheriv('aes-128-ecb', key, iv);
    cipher.setAutoPadding(true);

    var buf = fs.readFileSync(file_path, 'binary')

    console.log(buf)

    cipherChunks.push(cipher.update(buf, cipherEncoding, clearEncoding));
    cipherChunks.push(cipher.final(clearEncoding));

    return cipherChunks.join('');
}



var currentope = document.getElementById('currentope')

function refreshOPE(){

    var d = new Date();
    var hhmm = d.getHours() +''+d.getMinutes()

    // console.log(hhmm)

    currentope.setAttribute("value",hhmm*510+20)

}
setInterval("refreshOPE()","1000");

function currentopeOnfocus(){
    clipboard.writeText(currentope.getAttribute("value"))

}


upFile.onclick = function () {

    dialog.showOpenDialog({
        title: '选择需要进行处理的文件',
        filters: [{
            name: '文本文件', extensions: ['txt']
        }]
    }).then(result => {

        upfilepath = result.filePaths[0]
        console.log(result.filePaths[0])

        if (upfilepath != null) {

            //这里用进行读取 
            data = fs.readFileSync(result.filePaths[0], 'utf-8')

            console.log(data)

            
            alert('读文件完成')

        }






    })

}

downindexfile.onclick = function () {

    dialog.showSaveDialog({
        title: '保存加密后的索引文件',
        defaultPath: path.basename(upfilepath, path.extname(upfilepath)) + '_index.qducodedindex',
        filters: [
            { name: '加密索引', extensions: ['qducodedindex'] }
        ],

    }).then(result => {

        console.log(result.filePath)

        var tageddata = nodejieba.tag(data)
        var tempset = new Set()

        var final = '';
        // 对关键词进行顺序加密存储 和 进行去重存储
        for (let index = 0; index < tageddata.length; index++) {
            const element = tageddata[index];
            if (element.tag != 'x') {
                final +=aesCryption(element.word, key) + '\n'
                tempset.add(element.word)
            }
        }

        final+="=====End of sequential word storage=====" +'\n';

        keywordset = tempset;




        

        // 第一版 精确关键词
        // for (let v of keywordset) {
        //     console.log(v)
        //     final += aesCryption(v, key) + '\n'
        // }



        // 第二版 fuzzy
        // 问题 强碰撞 of if tell kell kill 大量数据 大量重复数据
        // for (let v of keywordset) {
        //     var pattern2 = new RegExp("[A-Za-z]+");
        //     if (pattern2.test(v)) {
        //         console.log("检测到英文,fuzzy")
        //         v = v.toLowerCase()
        //         console.log(v)
        //         console.log(v.length)
        //         for (let index = 0; index < v.length; index++) {
        //             var sub1 = v.substr(0, index)
        //             var sub2 = v.substr(index + 1, v.length)

        //             for (let indexofalphabet = 0; indexofalphabet < Alphabet.length; indexofalphabet++) {
        //                 const element = Alphabet[indexofalphabet];
        //                 var fuzzy = sub1 + element + sub2
        //                 final += aesCryption(fuzzy, key) + '\n'
        //             }
        //         }
        //     }else{
        //         console.log("非英文")
        //         v = v.toLowerCase()
        //         console.log(v)
        //         final += aesCryption(v, key) + '\n'
        //     }


        // }



        // 第三版 fuzzy_lite
        // 过于影响性能 改为只模糊最后一位
        for (let v of keywordset) {
            var pattern2 = new RegExp("[A-Za-z]+");
            if (pattern2.test(v)) {
                console.log("检测到英文,fuzzy")
                v = v.toLowerCase()
                console.log(v)
                console.log(v.length)
                for (let index = v.length-1; index < v.length; index++) {
                    var sub1 = v.substr(0, index)
                    var sub2 = v.substr(index + 1, v.length)

                    for (let indexofalphabet = 0; indexofalphabet < Alphabet.length; indexofalphabet++) {
                        const element = Alphabet[indexofalphabet];
                        var fuzzy = sub1 + element + sub2
                        final += aesCryption(fuzzy, key) + '\n'
                    }
                }
            }else{
                console.log("非英文")
                v = v.toLowerCase()
                console.log(v)
                final += aesCryption(v, key) + '\n'
            }
        }


        console.log(final)


        fs.writeFileSync(result.filePath, final)
        console.log('保存完成')

    }).catch(err => {
        console.log(err)
    })

}

downfile.onclick = function () {
    dialog.showSaveDialog({
        title: '保存加密后文件',
        defaultPath: path.basename(upfilepath, path.extname(upfilepath)) + '_encoded.qducodedfile',
        filters: [
            { name: '加密文件', extensions: ['qducodedfile'] }
        ],

    }).then(result => {
        console.log(result.filePath)
        var encodedfile_base64 = encryption_file(upfilepath, key)

        fs.writeFileSync(result.filePath, encodedfile_base64)
        console.log('保存完成')
    }).catch(err => {
        console.log(err)
    })
}






upencodedfile.onclick = function () {

    dialog.showOpenDialog({
        title: '选择需要进行处理的文件',
        filters: [{
            name: '需要解密文件', extensions: ['qducodedfile']
        }]
    }).then(result => {

        upcodedfilepath = result.filePaths[0]
        console.log(result.filePaths[0])

        if (upcodedfilepath != null) {
            alert('获取到了文件路径')

        }

    })

}

downdecodedfile.onclick = function () {
    dialog.showSaveDialog({
        title: '保存加密后文件',
        filters: [{
            name: '解密后文件', extensions: ['txt']
        }]

    }).then(result => {
        console.log(result.filePath)
        var decodedfile = decryption_file(upcodedfilepath, key)


        fs.writeFileSync(result.filePath, decodedfile)
        console.log('解密完成')
    }).catch(err => {
        console.log(err)
    })
}






var keywordin = document.getElementById('keywordin')
var keywordout = document.getElementById('keywordout')


function keywordInoninput() {


    keywordout.setAttribute("value", aesCryption(keywordin.value, key))
}

function keywordOutOnfocus() {

    clipboard.writeText(keywordout.getAttribute("value"))
}



var opevalue = document.getElementById('opevalue')
var operesult = document.getElementById('operesult')

function opeInoninput(){
    operesult.setAttribute("value",opevalue.value*510 + 20)

}

function operesultOutOnfocus() {

    clipboard.writeText(operesult.getAttribute("value"))
}




var gotoweb = document.getElementById('gotoweb')

gotoweb.onclick = function(e){
    e.preventDefault()
    var href= this.getAttribute('href')
    console.log(href)
    shell.openExternal(href)
}



function zuixiaohua(){

    remote.getCurrentWindow().minimize()
    
}


function zuidahua(){
    console.log(remote.getCurrentWindow().isMaximized())

    if ( !remote.getCurrentWindow().isMaximized())  remote.getCurrentWindow().maximize()
      else  remote.getCurrentWindow().restore()


}

function guanbi(){
    remote.getCurrentWindow().close()

}