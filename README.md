# Simple-Excel-to-json
Read excel file and parse it to javascript Object.

# Install

```sh
npm install simple-excel-to-json
```

# Basic Usage
*   Normal case
*   Output Nested JSON

##   Case (Normal)

 .parseXls2Json(path)

 Where 
 *  path is your excel file path

### Example
``` javascript
var parser = require('simple-excel-to-json');
var doc = parser.parseXls2Json('./example/sample.xlsx');
//print the data of the first sheet
console.log(doc[0]);
```

### Input
| item | price | number |
| :------------- | :--------- | :------------- |
| apple |100 |2 |
| banana | 200 | 12 |
| coffee | 150| 3 |

### Output
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



##   Case (Nested JSON)

```js
 .parseXls2Json(path, true)
```
*   Assign true as second parameter to enable output nested JSON

### Example
``` javascript
var parser = require('simple-excel-to-json');
var doc = parser.parseXls2Json('./example/sample.xlsx', true);
//print the data of the first sheet
console.log(doc[0]);
```

### Input
|Type|Dealership.us[0].location|Dealership.us[1].location|Dealership.jp[0].location
| :-------------| :--------- | :--------- | :--------- |
|Sedan|New York|Dallas|Tokyo|
|SUV|Ohio||Osaka|

### Output

```js
[
    [
        {
            "type": "Sedan",
            "dealership":
            {
                "us": 
                [
                    {
                        "location": "New York"
                    },
                    {
                        "location": "Dallas"
                    }
                ],
                "jp":
                [
                    {
                        "location": "Tokyo"
                    }
                ]
            }
        },
        {
            "type": "SUV",
            "dealership":
            {
                "us": 
                [
                    {
                        "location": "Ohio"
                    },
                    {
                        "location": ""
                    }
                ],
                "jp":
                [
                    {
                        "location": "Osaka"
                    }
                ]
            }
        }
    ]
]
```




# Advance Usage

You can apply transfomation function to transform the output 

.setTranseform(func)

Where
*   func is your transfomation function to convert the output into you expected 

###  Example

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

### Input

#### sheet 1

| item | price | number | buyer |
| :------------- | :--------- | :------------- | :---------- |
| apple | 100 | two | Andy;Bob |
| banana | 200 | twelve | Tom; |
| coffee| 150 |          three | Mary; Calvin |

#### sheet 2

|Type|Price|
| :------------- | :--------- |
|Car|10000|
|Bus|200000|

### Output

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



##   Case (Nested JSON)

###  Example

``` javascript
var parser = require('simple-excel-to-json');
parse.setTranseform( [
    function(sheet1){
        sheet1['type'] = sheet1['type'].toLowerCase(); 
        sheet1['price'] = sheet1['price'].split(';').map( e => e.trim());     
        sheet1['dealership.us[0].location'] = sheet1['dealership.us[0].location'].trim(); 
    },      
]);


var doc = parser.parseXls2Json('./example/sample2.xlsx', true);

```

### Input
|Type|Price|Dealership.us[0].location|
| :------------- | :--------- | :--------- |
|Sedan|2000;1000|New York|
|SUV|2000;500|Ohio|

### Output

```js
[
    [
        {
            "type": "sedan",
            "price": ["2000","1000"],
            "dealership":
            {
                "us":
                [
                    {
                        "location": "new york"
                    }
                ]
            }
        },
        {
            "type": "suv",
            "price": ["2000";"500"],
            "dealership":
            {
                "us":
                [
                    {
                        "location": "ohio"
                    }
                }
            }
        }
    ]
]
```




#   Sheet has empty cell

If your sheet contains empty cell, simple-excel-to-json will give "" for this cell in result object.
*   Normal case
*   Output Nested JSON case

## Case (Normal)
|Type|Price|
| :------------- | :--------- |
|Car||
|Bus|200000|

```js
    [
        {
            "Type":"car",
            "Price":""
        },
        {
            "Type":"bus",
            "Price":20000
        }
    ]
]

```

## Case (Nested JSON)

|Type|Price|Dealership.us[0].location|
| :------------- | :--------- | :--------- |
|Sedan|2000||
|SUV|2000|Ohio|

```js
[
    [
        {
            "type": "Sedan",
            "price": 2000,
            "dealership":
            {
                "us":
                [
                    {
                        "location": ""
                    }
                ]
            }
        },
        {
            "type": "SUV",
            "price": 2000,
            "dealership":
            {
                "us":
                [
                    {
                        "location": "ohio"
                    }
                }
            }
        }
    ]
]
```




# Release Note:

## 1.1.8
Update README.md
## 1.1.7
Usage in README.md. Add example for Nested Case of Advance Usage  
## 1.1.6
Support Nested JSON format
