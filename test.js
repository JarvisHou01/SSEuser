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

const Alphabet =['a','b','c','d','e','f','g','h','i','g','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']


for (let v of keywordset) {
    v =v.toLowerCase()
    console.log(v)
    console.log(v.length)

    for (let index = 0; index < v.length; index++) {
        var sub1 = v.substr(0,index)
        var sub2 = v.substr(index+1,v.length)


        for (let indexofalphabet = 0; indexofalphabet < Alphabet.length; indexofalphabet++) {
            const element = Alphabet[indexofalphabet];
            console.log(sub1+element+sub2)
        }
        
    }

    
}

