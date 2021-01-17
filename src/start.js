
'use strict';
/* 启动项目 */
const child_process = require('child_process')
const chalk = require('chalk')
const fs = require('fs')
const currentPath = process.cwd()+'/node_modules/rux-react-webpack-plugin'

module.exports = (type) => {
    return new Promise((resolve,reject)=>{
        fs.exists(currentPath,(ext)=>{
            if(ext){
              const children = child_process.fork(currentPath + '/index.js' )
              children.on('message',(message)=>{
                  const msg = JSON.parse( message )
                  if(msg.type ==='end'){
                      children.kill()
                      resolve()
                  }else if(msg.type === 'error'){
                      children.kill()
                      reject()
                  }
              })
              children.send(JSON.stringify({
                  cwdPath:process.cwd(),
                  type: type || 'build'
              }))
            }else{
               console.log( chalk.red('rux-react-webpack-plugin does not exist , please install rux-react-webpack-plugin')   )
            }
        })
    })
}