pragma solidity ^0.5.0;

contract Purchasing {

  address[16] public customers;  // 保存购买者的地址

    // 购买鲜花
  function purchase(uint flowerId) public returns (uint) {
    require(flowerId >= 0 && flowerId <= 15);  // 确保id在数组长度内
    customers[flowerId] = msg.sender;        // 保存调用这地址
    return flowerId;
  }

  // 返回购买
  function getCustomers() public view returns (address [16]memory) {
    return customers;
  }

}