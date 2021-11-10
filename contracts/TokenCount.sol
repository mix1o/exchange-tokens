pragma solidity ^0.8.0;

library TokenCount {

    function count(uint _amount, uint _price, uint _decimals,bool _isBuy, uint _tokenADecimals,uint _tokenBDecimals) public pure returns(uint){
        
        int precision = int(_tokenADecimals) + int(_tokenBDecimals) - int(_decimals); 
        
   
        if(precision >= 0){
            if(!_isBuy){
                return _amount * _price / (10 **uint(precision));
            }else {
                return _amount *  (10 **uint(precision)) / _price;
                
            }   
        }else {
            precision *= -1;
            
            if(!_isBuy){
                return _amount * _price / (10**uint(precision));
            }else {
                return _amount * (10**uint(precision)) / _price; 
            }

        }

    }



}    


// function count(uint _amount, uint _price, uint _decimals,bool _isBuy, uint _tokenADecimals,uint _tokenBDecimals) public pure returns(uint){
//         int precision;
//         bool isNegative;
        
//         if(_tokenADecimals + _tokenBDecimals >= _decimals){
//             precision = int(_tokenADecimals) + int(_tokenBDecimals) - int(_decimals);
        
//         }else {
//             isNegative = true;
//             precision = (int(_tokenADecimals) - int(_decimals) + int(_tokenBDecimals)) * -1;
//         }

//         if(!_isBuy){
//            if(precision >= 0){
//                return _amount / _price / (10 ** uint(precision));
//            }
//            if(isNegative) {
//                return _amount / _price / (1 / 10**uint(precision));
//            }
//         }else {
//            if(precision >= 0){
//                return _amount * _price / (10 ** uint(precision));
//            }
//            if(isNegative) {
//                return _amount * _price / (1 / 10**uint(precision));
//            }
//         }
//     }