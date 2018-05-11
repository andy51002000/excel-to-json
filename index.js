
var xlsx = require('node-xlsx');
var convert2NestedObj = require('./lib/2DArrayToNestedObj')

Array.prototype.first = function () {
    return this[0];
}

String.prototype.toCamelCase = function() {
        
        return this.split('.').map( s =>  s.replace(/^([A-Z])|[\s-_]+(\w)/g, function(match, p1, p2, offset) {
            if (p2) return p2.toUpperCase();
            return p1.toLowerCase();        
        })).join('.')

};

var headers=[]; 
var transforms = [];
var xlsdata;

function toJSON(entry) {

    var obj={};
    headers.forEach( (e,i)=>{

        obj[e] = typeof(entry[i])==='undefined' ? '' : entry[i]

    })

    return obj;
}


function parse(sheet, trans, isToCamelCase){

    var xlsObjs = [];
    headers = sheet.data.first();
    if( typeof headers === 'undefined'){
        return;
    }
    headers.forEach( (e,i,arr)=>{

        arr[i] = isToCamelCase ? e.trim().toCamelCase() : e.trim().split(' ').join('_');

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

function toNestedObject(){

}

module.exports = {
    
    setTranseform: function( func){

        transforms = func;
    },
    parseXls2Json: function (path, option) {

        var obj = xlsx.parse(path); // parses a file
        var xlsDoc = []
        obj.forEach( (e,i) => {
            //sheet
            let isToCamelCase = false;
            if( option && typeof option.isToCamelCase !== 'undefined') 
            isToCamelCase = option.isToCamelCase

            let o = parse(e,transforms[i], isToCamelCase);
            if(typeof o !=='undefined'){
                if(option && option.isNested){
                    xlsDoc.push(convert2NestedObj(o));
                }else{
                    xlsDoc.push(o);
                }
            }
        })
        return xlsDoc;
    }
}

