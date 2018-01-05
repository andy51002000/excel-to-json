var assert = require("chai").assert;

describe("xlsParse",function(){


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
  