
var xlsx = require('node-xlsx');


Array.prototype.first = function () {
    return this[0];
}


var headers=[]; 
var transforms = [];
var xlsdata;

function toJSON(entry) {

    var obj={};
    headers.forEach( (e,i)=>{
        if(typeof(entry[i])==='undefined'){
            obj[e]='';
        }else{
            obj[e]=entry[i];
        }
    })

    return obj;
}


function parse(sheet, trans){

    var xlsObjs = [];
    headers = sheet.data.first();
    headers.forEach( (e,i,arr)=>{

        arr[i]=e.trim().split(' ').join('_');

    })
    var headerLength = headers.length;
    if(headerLength <1){
        throw new Error("No data")
    }
    //remove header
    sheet.data.shift();
    sheet.data.forEach(function (element) {

        if (element === headers ) {
            return;
        }
        xlsdata = toJSON(element);
        if(typeof(trans)!== 'undefined'){
            
            trans(xlsdata);
        }
        xlsObjs.push(xlsdata);
    })    
    return xlsObjs;
}

module.exports = {
    
    setTranseform: function( func){

        transforms = func;
    },
    parseXls2Json: function (path) {

        var obj = xlsx.parse(path); // parses a file
        var xlsDoc = []
        obj.forEach( (e,i) => {
            xlsDoc.push(parse(e,transforms[i]));
        })

        return xlsDoc;
    },



} 