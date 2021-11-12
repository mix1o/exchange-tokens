pragma solidity ^0.8.0;

library TokenCount {

    function countExchangedTokens(uint _amount, uint _price, uint _decimals,bool _isBuy, uint _tokenADecimals,uint _tokenBDecimals) public pure returns(uint){
        
        int precision = int(_tokenADecimals) + int(_tokenBDecimals) - int(_decimals); 
        
        if(precision >= 0){
            if(!_isBuy){
                return _amount * _price * (10 **uint(precision));
            }else {
                return _amount *  (10 **uint(precision)) / _price;
            }   
        }else {
            precision *= -1;
            if(!_isBuy){
                return _amount * _price / (10**uint(precision));
            }else {
                return _amount / (10**uint(precision)) / _price; 
            }

        }
    }
}    