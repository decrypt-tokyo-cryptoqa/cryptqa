var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = 'grocery path long ceiling anger poem child donate flag hunt level maple';
var accessToken = 'https://rinkeby.infura.io/v3/94e76b992a1e4125954bf0525ccf0010';
const gas = 4000000;
const gasPrice = 1000000000 * 60;

module.exports = {
    networks: {
        rinkeby: {
            provider: function () {
              return new HDWalletProvider(
                mnemonic,
                accessToken
            );
            },
            network_id: 4,
            gas: gas,
            gasPrice: gasPrice,
            skipDryRun: true
        }
    },
    compilers: {
      solc: {
        version: "0.5.2",
      }
    }
};