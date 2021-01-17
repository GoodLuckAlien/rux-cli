const chalk = require('chalk')

const colors = [ 'green' , 'blue' , 'yellow' ,'red'  ]

const utils = {}
/* console color */
colors.forEach(color=>{
    utils[color] = function(text,isConsole=true){
         return isConsole ? console.log( chalk[color](text) ) : chalk[color](text)
    }
})

module.exports = utils