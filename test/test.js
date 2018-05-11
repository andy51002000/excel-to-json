var assert = require("chai").assert;
var _2dCont = require('../lib/2DArrayToNestedObj')

describe('lib testing', function(){

        it("2D array to nested JSON object", function(){
        
        var _2DArray_1 = 
            { "price": 100.,
            "product.type.hasGPS": "y",
            "product.type.name": "sedan" ,
            "product.type.style.color": "red",
            "product.type.style.size": "small",
            "number.sold": 100 ,
            "number.store": 2
            }

        var _2DArray_2 = 
            { "price": 150 ,
             "product.type.hasGPS": "y" ,
             "product.type.name": "SUV" ,
             "product.type.style.color": "green",
             "product.type.style.size": "big",
             "number.sold": 50 ,
             "number.store": 20
            };

        var _2DArray_3 = 
            { "price": 200 ,
             "product.type.hasGPS": "n" ,
             "product.type.name": "Sports Cars" ,
             "product.type.style.color": "white",
             "product.type.style.size": "big",
             "number.sold": 10 ,
             "number.store": 2 ,
             "dealership.tw[0].location": 'tc',
             "dealership.tw[1].location": 'tpe',
             "dealership.jp[0].location": 'tky',
             "dealership.jp[0].peopleInCharge": 'Andy;Mark;Calvin'
            }           
        

        var productList = [ _2DArray_1 , _2DArray_2, _2DArray_3]
        var result = _2dCont(productList);
        var expect = [
            {
                price: 100,
                product: {
                    type:{
                        hasGPS: "y",
                        name: "sedan",
                        style: {
                            color: "red",
                            size: "small"
                        }
                    }
                },
                number: {
                    sold: 100,
                    store: 2
                }
            },
            {
                price: 150,
                product: {
                    type:{
                        hasGPS: "y",
                        name: "SUV",
                        style: {
                            color: "green",
                            size: "big"
                        }
                    }
                },
                number: {
                    sold: 50,
                    store: 20
                }
            },
            {
                price: 200,
                product: {
                    type:{
                        hasGPS: "n",
                        name: "Sports Cars",
                        style: {
                            color: "white",
                            size: "big"
                        }
                    }
                },
                number: {
                    sold: 10,
                    store: 2
                },
                dealership:
                {
                    tw:[
                        {
                            location: 'tc'
                        },
                        {
                            location: 'tpe'
                        }
                    ],
                    jp:[
                        {
                            location: 'tky',
                            peopleInCharge: 'Andy;Mark;Calvin'
                        }
                    ]
                }
            },
        ]

        assert.deepEqual( expect, result);


    })
})

describe("xlsParse",function(){

    it("output to camel case", function(){
        var parser = require('../index');
 
        var option = 
        {
            isToCamelCase: true,
            isNested: true,
        }
        var ret = parser.parseXls2Json('./example/sample6.xlsx', option );

        const expect =
        [
            [
                {
                    'price': 100,
                    'product':
                    {
                        'type':
                        {
                            'hasGPS': 'y'
                        }
                    },
                    'modelName': 'sedan 01'
                },
                {
                    'price': 150,
                    'product':
                    {
                        'type':
                        {
                            'hasGPS': 'y'
                        }
                    },
                    'modelName': 'SUV 22'
                },
                {
                    'price': 200,
                    'product':
                    {
                        'type':
                        {
                            'hasGPS': 'n'
                        }
                    },
                    'modelName': 'Sports Cars IV'
                },
            ]
        ]
        assert.deepEqual(expect, ret)

    })


    it("Nested case", function(){
        var parse = require('../index');
        parse.setTranseform(function(tmp){
   
   
        });
        var data = parse.parseXls2Json('./example/sample3.xlsx', { isNested: true});
        var ret = _2dCont(data[0]);
        var expect = [
            {
                price: 100,
                product: {
                    type:{
                        hasGPS: "y",
                        name: "sedan",
                        style: {
                            color: "red",
                            size: "small"
                        }
                    }
                },
                number: {
                    sold: 100,
                    store: 2
                }
            },
            {
                price: 150,
                product: {
                    type:{
                        hasGPS: "y",
                        name: "SUV",
                        style: {
                            color: "green",
                            size: "big"
                        }
                    }
                },
                number: {
                    sold: 50,
                    store: 20
                }
            },
            {
                price: 200,
                product: {
                    type:{
                        hasGPS: "n",
                        name: "Sports Cars",
                        style: {
                            color: "white",
                            size: "big"
                        }
                    }
                },
                number: {
                    sold: 10,
                    store: 2
                }
            },
        ]   

        assert.deepEqual(expect, ret)

    })

    it("Nested case with transform", function(){

        var parse = require('../index');
        parse.setTranseform( [
            function(sheet1){
                sheet1['dealership.us[0].manager'] = sheet1['dealership.us[0].manager'].split(';').map( e => e.trim());     
                sheet1['dealership.us[0].location'] = sheet1['dealership.us[0].location'].trim();
                sheet1['dealership.us[1].location'] = sheet1['dealership.us[1].location'].trim();
                sheet1['dealership.jp[0].location'] = sheet1['dealership.jp[0].location'].trim();    
            }
        ]);
   
        var data = parse.parseXls2Json('./example/sample5.xlsx',{ isNested: true});
        let expect = [
         {
           "price": "100",
            "dealership":{
                'us':[
                    {
                        location: 'New York',
                        manager: ['Andy', 'Tom']
                    },
                    {
                        location: 'Dallas',

                    }
                ],
                'jp':[
                    {
                        location: 'Tokyo',
                    }
                ]
            }
         },
         {
            "price": "50",
            "dealership":{
                'us':[
                    {
                        location: 'Calfonia',
                        manager: ['Mary']
                    },
                    {
                        location: ""
                    }
                ],
                'jp':[
                    {
                        location: 'Kyoto'
                    }
                ]
            }
         },
         {
            "price": "5",
            "dealership":{
                'us':[
                    {
                        location: 'Verginia',
                        manager: ['Roger']

                    },
                    {
                        location: ""
                    }
                ],
                'jp':[
                    {
                        location: 'Osaka'
                    }
                ]
            }
         }
       ];

       var ret =  data[0];
       assert.deepEqual(ret,expect);


    })

    it("parseXls to JSON",function(){
  
                      
       var parse = require('../index');
       parse.setTranseform(function(tmp){
  
  
       });
  
       var data = parse.parseXls2Json('./example/sample.xlsx');
       let expect = [
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
      ];
      var ret =  data[0];
      assert.deepEqual(ret,expect);
    })
    
    it("parseXls to JSON and transform",function(){
  
                      
        var parse = require('../index');
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
   
        var data = parse.parseXls2Json('./example/sample2.xlsx');
        let expect = [
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
             "buyer": ["Tom"]
         },
         {
             "item":"coffee",
             "price":150,
             "number":"three",
             "buyer":["Mary","Calvin"]
         }
       ];

       var ret =  data[0];
       assert.deepEqual(ret,expect);


       let expect2= [
           {
               "Type": "car",
               "Price": 10000
           },
           {
            "Type": "bus",
            "Price": 200000
            }
       ]

       var ret2 =  data[1];
       assert.deepEqual(ret2,expect2);
     })

  })
  