require('babel-register');
require('babel-polyfill');

module.exports = {
    networks: {
        development: {
            host: '127.0.0.1',
            port: '7545',
            network_id: '*'  //connect to any network
        },
    },

    contracts_directory: './src/contracts',  //root level is default, since it's in directory 'src' provided path explicitly
    contracts_build_directory: './src/truffle_abis', // //root level is default, since it's in directory 'src' provided path explicitly
    
    compilers: {
        solc: {
            version: '^0.8.0',
            optimizer: {
                enabled: true,
                runs: 200
            },
        }
    }
}



