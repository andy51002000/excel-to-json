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

class failedToTransformError extends Error
{
    constructor(name, message, stack)
    {
        super();
        this.name = name
        this.message = message;
        this.stack = stack
    }
}


function toJSON(headers, entry) {

    let obj={};
    headers.forEach( (e,i)=>{

        obj[e] = typeof(entry[i])==='undefined' ? '' : entry[i]

    })

    return obj;
}


function parse( sheet, trans, isToCamelCase, sheetnum){
    let xlsdata;
    let xlsObjs = [];
    let headers = sheet.data.first();
    if( typeof headers === 'undefined'){
        return;
    }
    headers.forEach( (e,i,arr)=>{

        arr[i] = isToCamelCase ? e.trim().toCamelCase() : e.trim().replace(/\s\s+/g, ' ').split(' ').join('_');

    })
    let headerLength = headers.length;
    if(headerLength <1){
        throw new Error("No data")
    }
    //remove header
    sheet.data.shift();
    sheet.data.forEach(function (element, idx) {

        if (element === headers ) {
            return;
        }
        xlsdata = toJSON(headers, element);
        if(typeof trans !== 'undefined' && trans.length > 0){
            try{
                trans(xlsdata);
            }catch(err)
            {
                throw new failedToTransformError('failedToTransformError', 
                    JSON.stringify({
                        'sheet number': sheetnum,
                        'element': JSON.stringify(xlsdata),
                        'index': idx,
                        'errorMessage':  err.message   
                    }),
                    err.stack)
            }
        }
        xlsObjs.push(xlsdata);
    })    
    return xlsObjs;
}



class XlsParser
{
    constructor(trans)
    {
        this.transforms = typeof trans !== 'undefined' ? trans: []
    }

    setTranseform( func){
        this.transforms = func;
    }

    parseXls2Json (path, option, xlsxParseOption) {

        let obj = xlsx.parse(path, xlsxParseOption); // parses a file
        let xlsDoc = []
        obj.forEach( (e,i) => {
            //sheet
            let isToCamelCase = false;
            if(option && typeof option.isToCamelCase !== 'undefined') 
                isToCamelCase = option.isToCamelCase
    
            let o = parse(e, this.transforms ? this.transforms[i]: [], isToCamelCase, i);
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

var _ = new XlsParser();


module.exports = {
    failedToTransformError,
    XlsParser,
    parseXls2Json: _.parseXls2Json,
    setTranseform: _.setTranseform
}

