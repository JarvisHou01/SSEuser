//验证是否是中文
 
var pattern = new RegExp("[\u4E00-\u9FA5]+");
 
var str = "中文字符"
 
if(pattern.test(str)){
 
    console.log('该字符串是中文');
 
}
 
//验证是否是英文
 
var pattern2 = new RegExp("[A-Za-z]+");
 
var str2 = "dsfdsf"
 
if(pattern2.test(str2)){
 
console.log('该字符串是英文');
 
}
 
//验证是否是数字
 
var pattern3 = new RegExp("[0-9]+");
 
var str3 = "234234"
 
if(pattern3.test(str3)){
 
console.log('该字符串是数字');
 
}