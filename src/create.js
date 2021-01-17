const fs = require('fs')
const utils = require('../utils/index')
const npm = require('./install')

/* 三变量判断异步操作 */
let fileCount = 0  /* 文件数量 */
let dirCount = 0   /* 文件夹数量 */
let flat = 0       /* readir数量 */
let isInstall = false

module.exports = function(res){
    /* 创建文件 */
    utils.green('------开始构建-------')
    const sourcePath = __dirname.slice(0,-3)+'template'
    utils.blue('当前路径:'+ process.cwd())
    /* 修改package.json*/
    revisePackageJson( res ,sourcePath ).then(()=>{
        copy( sourcePath , process.cwd() ,npm() )
    })
}

function copy (sourcePath,currentPath,cb){
    flat++
    fs.readdir(sourcePath,(err,paths)=>{
        flat--
        if(err){
            throw err
        }
        paths.forEach(path=>{
            if(path !== '.git' && path !=='package.json' ) fileCount++
            const  newSoucePath = sourcePath + '/' + path
            const  newCurrentPath = currentPath + '/' + path
            fs.stat(newSoucePath,(err,stat)=>{
                if(err){
                    throw err
                }
                if(stat.isFile() && path !=='package.json' ){
                    const readSteam = fs.createReadStream(newSoucePath)
                    const writeSteam = fs.createWriteStream(newCurrentPath)
                    readSteam.pipe(writeSteam)
                    utils.green( '创建文件：'+ newCurrentPath  )
                    fileCount--
                    completeControl(cb)
                }else if(stat.isDirectory()){
                    if(path!=='.git' && path !=='package.json' ){
                        dirCount++
                        dirExist( newSoucePath , newCurrentPath ,copy,cb)
                    }
                }
            })
        })
    })
}

function dirExist(sourcePath,currentPath,copyCallback,cb){
    fs.exists(currentPath,(ext=>{
        if(ext){
            copyCallback( sourcePath , currentPath,cb)
        }else {
            fs.mkdir(currentPath,()=>{
                fileCount--
                dirCount--
                copyCallback( sourcePath , currentPath,cb)
                utils.yellow('创建文件夹：'+ currentPath )
                completeControl(cb)
            })
        }
    }))
}
function completeControl(cb){
    if(fileCount === 0 && dirCount ===0 && flat===0){
        utils.green('------构建完成-------')
        if(cb && !isInstall ){
            isInstall = true
            utils.blue('-----开始install-----')
            cb(()=>{
                utils.blue('-----完成install-----')
                /* 判断是否存在webpack  */
                runProject()
            })
        }
    }
}

function runProject(){
    try{
        const doing = npm([ 'start' ])
        doing()
    }catch(e){
       utils.red('自动启动失败，请手动npm start 启动项目')
    }
}

function revisePackageJson(res,sourcePath){
    return new Promise((resolve)=>{
        fs.readFile(sourcePath+'/package.json',(err,data)=>{
            if(err) throw err
            const { author , name  } = res
            let json = data.toString()
            json = json.replace(/demoName/g,name.trim())
            json = json.replace(/demoAuthor/g,author.trim())
            const path = process.cwd()+ '/package.json'
            fs.writeFile(path, new Buffer(json) ,()=>{
                utils.green( '创建文件：'+ path )
                resolve()
            })
        })
    })
}