# Excel-to-json
Read excel file and parse it to javascript Object.

# Install

```sh
npm install excel-to-json
```

# Usage(basic) 

 .parseXls2Json(path)

 Where 
 *  path is your excel file path

## Input
| item | price | number |
| :------------- | :--------- | :------------- |
| apple |100 |2 |
| banana | 200 | 12 |
| coffee | 150| 3 |

## Output
```js
[
    [
        {
            "item":"apple",
            "price":100,
            "number":2    
        },
        {
            "item":"banana",
            "price":200,
            "number":12
        },
        {
            "item":"coffee",
            "price":150,
            "number":3
        }
    ]
]
```

## Example
``` javascript
var parser = require('simple-excel-to-json');
var doc = parser.parseXls2Json('./example/sample.xlsx');
//print the data of the first sheet
console.log(doc[0]);
```



# Usage(advance)

You can apply transfomation function to transform the output 

.setTranseform(func)

Where
*   func is your transfomation function to convert the output into you expected 

## Input

### sheet 1

| item | price | number | buyer |
| :------------- | :--------- | :------------- | :---------- |
| apple | 100 | two | Andy;Bob |
| banana | 200 | twelve | Tom; |
| coffee| 150 |          three | Mary; Calvin |

### sheet 2

|Type|Price|
| :------------- | :--------- |
|Car|10000|
|Bus|200000|

## Output

```js
[
    [
        {
            "item":"apple",
            "price":100,
            "number":"two",
            "buyer": ["Andy","Bob"]    
        },
        {
            "item":"banana",
            "price":200,
            "number":"twelve",
            "buyer":["Tom"]
        },
        {
            "item":"coffee",
            "price":150,
            "number":"three",
            "buyer":["Mary","Calvin"]
        }
    ],
    [
        {
            "Type":"car",
            "Price":10000
        },
        {
            "Type":"bus",
            "Price":20000
        }
    ]
]

```

##  Example

``` javascript
var parser = require('simple-excel-to-json');
parse.setTranseform( [
    function(sheet1){
        sheet1.number = sheet1.number.trim();
        sheet1.buyer = sheet1.buyer.split(';').filter( item=>item.trim()!=='');
        sheet1.buyer.forEach( (e,i,arr) => {
            arr[i]=e.trim();
        });     
   
    },
    function(sheet2){
        sheet2.Type = sheet2.Type.toLowerCase();
    }        
]);


var doc = parser.parseXls2Json('./example/sample2.xlsx');

```




