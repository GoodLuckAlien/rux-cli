
const inquirer = require('inquirer')
const qustion = require('./qustion')


function create (){
    return new Promise((resolve)=>{
        inquirer.prompt(qustion.create).then(res=>{
            resolve(res)
        })
    })
} 

module.exports = {
    create
}