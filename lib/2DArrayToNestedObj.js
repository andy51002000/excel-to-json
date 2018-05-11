
var _ = require('lodash');

module.exports = ( arr ) => {

    return arr.map( element => {

        var newArr = [];
        Object.keys( element).forEach( key => {
            let propname = key;
            let value = element[propname];
            let subKeys = propname.split('.');
            let baseObj = {};
            constructObj( baseObj, subKeys.reverse(), value );
            newArr.push( baseObj );   

        });

        var newObj = {}
        newArr.forEach( o => {
            newObj = _.merge( newObj, o);
        })

        return newObj;
    })

    
}

function constructObj( obj, keys, value ){

    if( keys.length ===1 ){
        var key = keys.pop();
        obj[key] = value;
        return;
    }

    var key = keys.pop();
    [isList, keyName, idx] = parseKeyName(key)
    if(isList){

        obj[keyName] = (function(){
            var results = []
            for (startedIdx = k = 0, ref2 = idx; (0 <= ref2 ? k <= ref2 : k >= ref2); startedIdx = 0 <= ref2 ? ++k : --k) {
                results.push({});
            }
            return results
        })();
        
        constructObj( obj[keyName][idx], keys, value );
    }else{
        obj[key] = {};
        obj = obj[key]
        constructObj( obj, keys, value );
    }

}

function parseKeyName(key) {
    var index;
    index = key.match(/\[(\d+)\]$/);
    switch (false) {
      case !index:
        return [true, key.split('[')[0], Number(index[1])];
      case key.slice(-2) !== '[]':
        return [true, key.slice(0, -2), void 0];
      default:
        return [false, key, void 0];
    }
  };