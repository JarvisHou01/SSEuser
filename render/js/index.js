const ipcRenderer = require('electron').ipcRenderer;

const axios = require('axios');



let param = new URLSearchParams()
param.append('username', 'admin')
param.append('password', 'admin')
console.log(param)



axios({
    method: 'post',
    url: 'http://localhost:8080/api/user/login',
    data: param
}).then(function(response){console.log(response)})


// axios.default.post('http://localhost:8080/api/user/login', param).then(function (response) {
//     console.log(response);
// }).catch(function (error) {
//     console.log(error);
// }).then(function () {
//     // always executed
// })