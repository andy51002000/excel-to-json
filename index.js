// @ts-check
var xlsx = require('node-xlsx');
var convert2NestedObj = require('./lib/2DArrayToNestedObj')

Array.prototype.first = function () {
    return this[0];
}

String.prototype.toCamelCase = function () {

    return this.split('.').map(s => s.replace(/^([A-Z])|[\s-_]+(\w)/g, function (match, p1, p2, offset) {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();
    })).join('.')

};

class failedToTransformError extends Error {
    constructor(name, message, stack) {
        super();
        this.name = name
        this.message = message;
        this.stack = stack
    }
}


function toJSON(headers, entry) {

    var obj = {};
    headers.forEach((e, i) => {

        obj[e] = typeof (entry[i]) === 'undefined' ? '' : entry[i]

    })

    return obj;
}
function parse(sheet, trans, isToCamelCase, sheetnum) {
    return new Promise((resolve, reject) => {
        try {
            let xlsdata;
            let xlsObjs = [];
            let headers = sheet.data.first();
            if (typeof headers === 'undefined') {
                reject(new Error("No data"));
            }
            for (let i in headers) {
                headers[i] = isToCamelCase ? headers[i].toString().trim().toCamelCase() : headers[i].toString().trim().replace(/\s\s+/g, ' ').split(' ').join('_');
            }
            let headerLength = headers.length;
            if (headerLength < 1) {
                reject(new Error("No data"));
            }
            //remove header
            sheet.data.shift();
            for (let i in sheet.data) {
                if (sheet.data[i] === headers) {
                    continue;
                }
                xlsdata = toJSON(headers, sheet.data[i]);
                if (typeof trans !== 'undefined' && trans.length > 0) {
                    try {
                        trans(xlsdata);
                    }
                    catch (err) {
                        reject(new failedToTransformError('failedToTransformError',
                            JSON.stringify({
                                'sheet number': sheetnum,
                                'element': JSON.stringify(xlsdata),
                                'index': i,
                                'errorMessage': err.message
                            }),
                            err.stack));
                    }
                }
                xlsObjs.push(xlsdata);
            }
            resolve(xlsObjs);
        } catch (err) { reject(err); }
    });
}



class XlsParser {
    constructor(trans) {
        this.transforms = typeof trans !== 'undefined' ? trans : []
    }

    setTranseform(func) {
        this.transforms = func;
    }

    async parseXls2Json(path, option) {
        return new Promise(async (resolve, reject) => {
            try {
                var obj = await xlsx.parse(path); // parses a file
                var xlsDoc = [];
                for (let i in obj) {
                    //sheet
                    let isToCamelCase = false;
                    if (option && typeof option.isToCamelCase !== 'undefined')
                        isToCamelCase = option.isToCamelCase

                    let o = parse(obj[i], this.transforms ? this.transforms[i] : [], isToCamelCase, i);
                    if (typeof o !== 'undefined') {
                        if (option && option.isNested) {
                            xlsDoc.push(convert2NestedObj(o));
                        } else {
                            xlsDoc.push(o);
                        }
                    }
                }
                resolve(xlsDoc);
            } catch (err) { reject(err); }
        });
    }
}
var _ = new XlsParser();
module.exports = {
    failedToTransformError,
    XlsParser,
    parseXls2Json: _.parseXls2Json,
    setTranseform: _.setTranseform
}

