App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var flowerRow = $('#flowerRow');
      var flowerTemplate = $('#flowerTemplate');

      for (i = 0; i < data.length; i ++) {
        flowerTemplate.find('.panel-title').text(data[i].name);
        flowerTemplate.find('img').attr('src', data[i].picture);
        flowerTemplate.find('.size').text(data[i].size);
        flowerTemplate.find('.color').text(data[i].color);
        flowerTemplate.find('.pet-location').text(data[i].location);
        flowerTemplate.find('.btn-adopt').attr('data-id', data[i].id);
        flowerTemplate.find('.Price').text(data[i].Price);
        flowerRow.append(flowerTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
   // Modern dapp browsers...
if (window.ethereum) {
  App.web3Provider = window.ethereum;
  try {
    // Request account access
    await window.ethereum.enable();
  } catch (error) {
    // User denied account access...
    console.error("User denied account access")
  }
}
// Legacy dapp browsers...
else if (window.web3) {
  App.web3Provider = window.web3.currentProvider;
}
// If no injected web3 instance is detected, fall back to Ganache
else {
  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
}
web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    // 加载Purchasing.json，保存了Purchasing的ABI（接口说明）信息及部署后的网络(地址)信息，它在编译合约的时候生成ABI，在部署的时候追加网络信息
    $.getJSON('Purchasing.json', function(data) {
     // 用Purchasing.json数据创建一个可交互的TruffleContract合约实例。
     var PurchasingArtifact = data;
     App.contracts.Purchasing = TruffleContract(PurchasingArtifact);

     // Set the provider for our contract
     App.contracts.Purchasing.setProvider(App.web3Provider);

     // Use our contract to retrieve and mark the adopted pets
     
     //return App.markPurchased();
   });
    
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markPurchased: function(event) {
    var purchasingInstance;
  
    App.contracts.Purchasing.deployed().then(function(instance) {
      purchasingInstance = instance;
      // 调用合约的getCustomers(), 用call读取信息不用消耗gas
      return purchasingInstance.getCustomers.call();
    }).then(function(customers) {
      for (i = 0; i < customers.length; i++) {
        if (customers[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });

  },

  handleAdopt: function(event) {
    
    event.preventDefault();

    var flowerId = parseInt($(event.target).data('id'));
    
    // 获取用户账号
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
        
      }

      var account = accounts[0];
      App.contracts.Purchasing.deployed().then(function(instance) {

        purchasingInstance = instance;
        
        // 发送交易领养宠物
        return purchasingInstance.purchase(flowerId, {from: account});
      }).then(function(result) {
        
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};


$(function() {
  $(window).load(function() {
    App.init();
  });
});
