var noClientError = function(){
    var page = location.pathname.split("/").slice(-1);
    if( page.toString() === "mydeals.html" || page.toString() === "alldeals.html" )     alert("Could not find an ethereum client");             
    $("#before_load").html("<h1>Could not find an ethereum client</h1>");
    return -1;
};

var startPage = function(){    
    var simplemixerContract = web3.eth.contract(contractABI);    
    globalContractInstance = simplemixerContract.at(contractAddress);
    var page = location.pathname.split("/").slice(-1);
    if( page.toString() === "mydeals.html"){            
         myDealsPage();
    }
    else if( page.toString() === "alldeals.html" ){
        allDealsPage();
    }  
    

};



window.addEventListener('load', function() {
    $(".span_collatoral_value").html(depositSizeInEther.toString());
    $(".span_deposit_value").html(claimSizeInEther.toString());                              
    
    if(typeof web3 !== 'undefined' && typeof Web3 !== 'undefined') {
        // If there's a web3 library loaded, then make your own web3
        web3 = new Web3(web3.currentProvider);

    } else if (typeof Web3 !== 'undefined') {
        // If there isn't then set a provider
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        if( ! web3.isConnected()) return noClientError();
    } else{
        return noClientError();    
    }
    globalWeb3 = web3;
    
    globalWeb3.eth.getBlock(0, function(err, result){
        if( err ) return HandleError(err);
        if( result.hash.toString() === "0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3" ){
            // live etc or eth
            var amIOnTheForkABI = [{"constant":true,"inputs":[],"name":"forked","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"update","outputs":[],"type":"function"}];
            var amIOnTheForkContract = web3.eth.contract(amIOnTheForkABI);   
            var amIOnTheForkContractInstance = amIOnTheForkContract.at("0x2bd2326c993dfaef84f696526064ff22eba5b362");
            amIOnTheForkContractInstance.forked({},function(err,result){
                if( err ) return HandleError(err);
                if( ! result ){
                    etc = true;
                    contractAddress = contractAddressClassic;
                }
                else{
                    etc = false;
                    contractAddress = contractAddressMainnet;
                }
                
                startPage();
            });          
        }
        else if( result.hash.toString() === "0x0cd786a2425d16f152c658316c423e6ce1181e15c3295826d7c9904cba9ce303"){
            // testnet
            contractAddress = contractAddressTestnet;
            startPage();
        }
        else{
            return HandleError("unrecognized genesis block");
        }
    });
});