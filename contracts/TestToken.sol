pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract TestToken is ERC20PresetMinterPauser{

    uint8 private precision;

    constructor(string memory _name, string memory _symbol, uint8 _decimals) ERC20PresetMinterPauser(_name,_symbol){
        precision = _decimals;
    }

    function decimals() public view override returns(uint8) {
        return precision;
    }
}