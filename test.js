var nodejieba = require('nodejieba')

var fs =require('fs')

var data = fs.readFileSync('./englishtest.txt', 'utf-8')

var keywordset = new Set()

// var result = nodejieba.cut('南京市长江大桥')
var result = nodejieba.tag(data)



for (let index = 0; index < result.length; index++) {
    const element = result[index];
    if(element.tag!='x'){

        keywordset.add(element.word)
        // console.log(element.word)
    }
}


// keywordset.forEach((v,k)=>{
//     console.log(k + ":" + v);//k和v是相同的
// })



for (let v of keywordset) {
    console.log(v);
}
