pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ERC20PresetMinterPauser.sol";
import './TokenCount.sol';
import {TokenCount} from './TokenCount.sol';

contract TokenExchange{
   
    address public owner;
    address tokenAAddress;
    address tokenBAddress;
    uint public price;
    uint public decimals = 18;


    constructor(address _tokenAAddress,address _tokenBAddress,uint _price){
        owner = msg.sender;
        price = _price;
        tokenAAddress = _tokenAAddress;
        tokenBAddress = _tokenBAddress;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier contractRegistered(address _tokenAddress) {
        require(tokenAAddress == _tokenAddress || tokenBAddress == _tokenAddress, "Invalid address");
        _;
        
    }

    function updatePrice(uint _price) public onlyOwner {
        price = _price;
    }

    function updateDecimals(uint _decimals) public onlyOwner {
        decimals = _decimals;
    }
    
    function deposit(address _tokenAddress, uint _amount) public onlyOwner {
        require(_amount >= 0);
        IERC20(_tokenAddress).transferFrom(msg.sender, address(this), _amount);
    }

    function exchange(address _tokenAddress, uint _amount) public contractRegistered(_tokenAddress) {
        
        uint tokens;
        if(_tokenAddress == tokenAAddress){
             
            tokens = TokenCount.count(_amount,price,decimals,false,ERC20PresetMinterPauser(tokenAAddress).decimals(),ERC20PresetMinterPauser(tokenBAddress).decimals());
            
            require(IERC20(tokenBAddress).balanceOf(address(this)) >= tokens);

            require(IERC20(_tokenAddress).transferFrom(msg.sender,address(this),_amount));
            require(IERC20(tokenBAddress).transfer(msg.sender, tokens));
         

        }else {
           
            tokens = TokenCount.count(_amount,price,decimals,true,ERC20PresetMinterPauser(tokenAAddress).decimals(),ERC20PresetMinterPauser(tokenBAddress).decimals());

            require(IERC20(_tokenAddress).transferFrom(msg.sender,address(this),_amount)); 
            require(IERC20(tokenAAddress).transfer(msg.sender, tokens));
        }
    }
    
}