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

    it("time issue",function(){
        var parser = new (require('../index').XlsParser)();
        const parseDateExcel = (excelTimestamp) => {

            const secondsInDay = 24 * 60 * 60;
        
            const excelEpoch = new Date(1899, 11, 31);
        
            const excelEpochAsUnixTimestamp = excelEpoch.getTime();
        
            const missingLeapYearDay = secondsInDay * 1000;
        
            const delta = excelEpochAsUnixTimestamp - missingLeapYearDay;
        
            const excelTimestampAsUnixTimestamp = excelTimestamp * secondsInDay * 1000;
        
            const parsed = excelTimestampAsUnixTimestamp + delta;
        
            return isNaN(parsed) ? null : parsed;
        
        };

        var ret = parser.parseXls2Json('./example/sample7.xlsx');
        var x  = ret[0][1]
        var b = new Date((x.time - (25567 + 1))*86400*1000)
        var a = new Date(Math.round((x.time - (25567 + 2))*86400)*1000);//ok
        //https://gist.github.com/christopherscott/2782634
        var c  = parseDateExcel(x.time)
        const expect =
        [
            [
                {
                    'price': 100,
                    'time':
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
        //assert.deepEqual(expect, ret)        
    })

    it("output to camel case", function(){
        var parser = new (require('../index').XlsParser)();
 
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
        var parse = new (require('../index').XlsParser)();
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

        var parse = new (require('../index').XlsParser)();
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
  
                      
       var parse = new (require('../index').XlsParser)();
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
  
                      
        var parse = new (require('../index').XlsParser)();
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
     
    it('transformation exception', function(){
        var parse = new (require('../index').XlsParser)();
        parse.setTranseform( [
            function(sheet1){
                sheet1.number = sheet1.number.trim();
                sheet1.buyer = sheet1.buyer.split(';').filter( item=>item.trim()!=='');
                sheet1.buyer.forEach( (e,i,arr) => {
                    arr[i]=e.trim();
                });
                if(sheet1.buyer.length <1)
                {
                    throw new Error('length of sheet1.buyer < 1 ')
                }     
   
            },
            function(sheet2){
                sheet2.Type = sheet2.Type.toLowerCase(); 
            }
        ]);
   
        var data 
        try
        {
            data = parse.parseXls2Json('./example/sample8.xlsx');
        }catch(err)
        {
            if (err instanceof require('../index').failedToTransformError){
                console.log('name: '+ err.name)
                console.log('message: '+ err.message)
                //console.log('stack: '+ err.stack)
                assert.isTrue(true)
                return
            }
            assert.fail()
        }
        assert.fail()
    })
  })

  describe("using default instance", function(){

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

        var parse = require('../index')
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


    it("output to camel case", function(){
        var parser = require('../index')
        parser.setTranseform([]);
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

     
    it('transformation exception', function(){
        var parse = require('../index')
        parse.setTranseform( [
            function(sheet1){
                sheet1.number = sheet1.number.trim();
                sheet1.buyer = sheet1.buyer.split(';').filter( item=>item.trim()!=='');
                sheet1.buyer.forEach( (e,i,arr) => {
                    arr[i]=e.trim();
                });
                if(sheet1.buyer.length <1)
                {
                    throw new Error('length of sheet1.buyer < 1 ')
                }     
   
            },
            function(sheet2){
                sheet2.Type = sheet2.Type.toLowerCase(); 
            }
        ]);
   
        var data 
        try
        {
            data = parse.parseXls2Json('./example/sample8.xlsx');
        }catch(err)
        {
            if (err instanceof require('../index').failedToTransformError){
                console.log('name: '+ err.name)
                console.log('message: '+ err.message)
                //console.log('stack: '+ err.stack)
                assert.isTrue(true)
                return
            }
            assert.fail()
        }
        assert.fail()
    })

  })
  

  describe("basic usage", function() {

    it("should be work if no transform", function() {
        // Create an instance for XlsParser
        var parse = require('../index');
        parse.setTranseform(undefined);
        var doc = parse.parseXls2Json('./example/sample.xlsx');
        //print the data of the first sheet
        console.log(doc[0]);
    })

  })