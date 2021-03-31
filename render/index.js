const { dialog } = require('electron').remote
const clipboard = require('electron').clipboard;
const fs = require('fs')
const crypto = require('crypto')
const path = require('path')
const nodejieba = require('nodejieba')



const key = '9cd5b4cf89949207'


var upFile = document.getElementById('upFile')
var downindexfile = document.getElementById('downindexfile')
var downfile = document.getElementById('downfile')


var upencodedfile = document.getElementById('upencodedfile')
var downdecodedfile = document.getElementById('downdecodedfile')



var upfilepath = null;

var keywordset =null;



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
            var data = fs.readFileSync(result.filePaths[0], 'utf-8')

            console.log(data)

            var tageddata = nodejieba.tag(data)

            var tempset = new Set()

            for (let index = 0; index < tageddata.length; index++) {
                const element = tageddata[index];
                if (element.tag != 'x') {
                    tempset.add(element.word)
                }
            }

            keywordset = tempset;
            
            alert('读文件完成')

        }




        

    })

}

downindexfile.onclick = function () {

    dialog.showSaveDialog({
        title: '保存加密后的索引文件',
        defaultPath:path.basename(upfilepath,path.extname(upfilepath))+'_index.qducodedindex',
        filters: [
            { name: '加密索引', extensions: ['qducodedindex'] }
        ],

    }).then(result => {

        console.log(result.filePath)

        var final = '';


        for (let v of keywordset) {
            console.log(v)
            final += aesCryption(v, key) + '\n'
        }


        fs.writeFileSync(result.filePath, final)
        console.log('保存完成')

    }).catch(err => {
        console.log(err)
    })

}

downfile.onclick = function () {
    dialog.showSaveDialog({
        title: '保存加密后文件',
        defaultPath:path.basename(upfilepath,path.extname(upfilepath))+'_encoded.qducodedfile',
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

