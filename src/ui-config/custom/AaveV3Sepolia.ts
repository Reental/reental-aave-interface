const POOL_ADDRESSES_PROVIDER = '0x261A9386797e7C6C73dbEA2333D95364E421Ef13';
const POOL = '0x8dF15753152DfE83A7C4753A20075950ED0c1123';
const POOL_IMPL = '0x8EAF09D370FC548986Bc72793dbe451b3525ccd6';
const POOL_CONFIGURATOR = '0x400241CA46fECE64BCB7300427c4Fc0e785ed95E';
const POOL_CONFIGURATOR_IMPL = '0x0739f271F3c577FE19b41C9C76F5cC1d4711283D';
const ORACLE = '0xeD8Aee30bfd9Bf17Ca10C394fa0231286D3C0fAb';
const AAVE_PROTOCOL_DATA_PROVIDER = '0x17Da7Cd489EC9d09b2Cf0a47D4Add5b9E7a7761C';
const ACL_MANAGER = '0x7F7303a254d5F4613B051C48582a638f22e940Be';
const ACL_ADMIN = '0x0de25ce96D5369601926E9a986eA9093Bfb3687d';
const COLLECTOR = '0xFb63E6Bb14b575Dfd1F26F943825c223b9ea07Cb';
const DEFAULT_INCENTIVES_CONTROLLER = '0x566372ef1742C463d757B72625770e78BC96EAdb';
const DEFAULT_A_TOKEN_IMPL_REV_1 = '0x4d5759092b4B20dCcf2a5d4bD71fEAA39E1Cf0A0';
const DEFAULT_VARIABLE_DEBT_TOKEN_IMPL_REV_1 = '0x16f34F08B5197D6c361c7f825Ec6B5e898624e6a';
const DEFAULT_STABLE_DEBT_TOKEN_IMPL_REV_1 = '0xa01c1277bdc01CB4e98BF868ab61CFD16cd0517e';
const EMISSION_MANAGER = '0x6326994FEBD5Fa70C9c79b2Fd64E3C45870c9686';
const FAUCET = '0xC959483DBa39aa9E78757139af0e9a2EDEb3f42D';
const UI_INCENTIVE_DATA_PROVIDER = '0x03d102069ac5B54A24da1b8Ba5A018c5e1b035C1';
const UI_POOL_DATA_PROVIDER = '0x254859738365A861833A16628f3d2A544dBB548F';
const WALLET_BALANCE_PROVIDER = '0x84E1Cc51890ec05C8E56c53767416Cd2187Db396';
const WETH_GATEWAY = '0xc0122290d116f853a42fB1cc95f4CFb6F2330606';
const STATIC_A_TOKEN_FACTORY = '0x6D08892Fd74FEEC919a9bF8CeE1B8849A352f694';
const UI_GHO_DATA_PROVIDER = '0x69B9843A16a6E9933125EBD97659BA3CCbE2Ef8A';
const CHAIN_ID = 11155111;

const ASSETS = {
  DAI: {
    decimals: 18,
    UNDERLYING: '0xFF34B3d4Aee8ddCd6F9AFFFB6Fe49bD371b8a357',
    A_TOKEN: '0x29598b72eb5CeBd806C5dCD549490FdA35B13cD8',
    S_TOKEN: '0xbEF786E742edB13361ff2f005b901A82c23AA491',
    V_TOKEN: '0x22675C506A8FC26447aFFfa33640f6af5d4D4cF0',
    INTEREST_RATE_STRATEGY: '0xA813CC4d67821fbAcF24659e414A1Cf6c551373c',
    ORACLE: '0x9aF11c35c5d3Ae182C0050438972aac4376f9516',
    STATA_TOKEN: '0xDE46e43F46ff74A23a65EBb0580cbe3dFE684a17',
  },
  LINK: {
    decimals: 18,
    UNDERLYING: '0xf8Fb3713D459D7C1018BD0A49D19b4C44290EBE5',
    A_TOKEN: '0x3FfAf50D4F4E96eB78f2407c090b72e86eCaed24',
    S_TOKEN: '0x8f7440aa789924626ab9f5687AF305da2ffB996b',
    V_TOKEN: '0x34a4d932E722b9dFb492B9D8131127690CE2430B',
    INTEREST_RATE_STRATEGY: '0xCA30c502d52F905FB3D04eE60cA48F5A1A89f8dB',
    ORACLE: '0x14fC51b7df22b4D393cD45504B9f0A3002A63F3F',
    STATA_TOKEN: '0x8227a989709a757f25dF251C3C3e71CA38627836',
  },
  USDC: {
    decimals: 6,
    UNDERLYING: '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8',
    A_TOKEN: '0x16dA4541aD1807f4443d92D26044C1147406EB80',
    S_TOKEN: '0x42A218F7bd03c63c4835496506492A383EfcF726',
    V_TOKEN: '0x36B5dE936eF1710E1d22EabE5231b28581a92ECc',
    INTEREST_RATE_STRATEGY: '0x5CB1008969a2d5FAcE8eF32732e6A306d0D0EF2A',
    ORACLE: '0x98458D6A99489F15e6eB5aFa67ACFAcf6F211051',
    STATA_TOKEN: '0x8A88124522dbBF1E56352ba3DE1d9F78C143751e',
  },
  WBTC: {
    decimals: 8,
    UNDERLYING: '0x29f2D40B0605204364af54EC677bD022dA425d03',
    A_TOKEN: '0x1804Bf30507dc2EB3bDEbbbdd859991EAeF6EefF',
    S_TOKEN: '0xc7AEA6Cf353b4FA27aBf1b4A8D536A4e87383EB5',
    V_TOKEN: '0xEB016dFd303F19fbDdFb6300eB4AeB2DA7Ceac37',
    INTEREST_RATE_STRATEGY: '0xCA30c502d52F905FB3D04eE60cA48F5A1A89f8dB',
    ORACLE: '0x784B90bA1E9a8cf3C9939c2e072F058B024C4b8a',
    STATA_TOKEN: '0x131a121bda71ED810bCAf2aC9079214925e59C18',
  },
  WETH: {
    decimals: 18,
    UNDERLYING: '0xC558DBdd856501FCd9aaF1E62eae57A9F0629a3c',
    A_TOKEN: '0x5b071b590a59395fE4025A0Ccc1FcC931AAc1830',
    S_TOKEN: '0xEb45D5A0efF06fFb88f6A70811c08375A8de84A3',
    V_TOKEN: '0x22a35DB253f4F6D0029025D6312A3BdAb20C2c6A',
    INTEREST_RATE_STRATEGY: '0xCA30c502d52F905FB3D04eE60cA48F5A1A89f8dB',
    ORACLE: '0xDde0E8E6d3653614878Bf5009EDC317BC129fE2F',
    STATA_TOKEN: '0x162B500569F42D9eCe937e6a61EDfef660A12E98',
  },
  USDT: {
    decimals: 6,
    UNDERLYING: '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0',
    A_TOKEN: '0xAF0F6e8b0Dc5c913bbF4d14c22B4E78Dd14310B6',
    S_TOKEN: '0xEAF54fA3b1C7243033C2893c6B807f9cEaBCf0AF',
    V_TOKEN: '0x9844386d29EEd970B9F6a2B9a676083b0478210e',
    INTEREST_RATE_STRATEGY: '0x5CB1008969a2d5FAcE8eF32732e6A306d0D0EF2A',
    ORACLE: '0x4e86D3Aa271Fa418F38D7262fdBa2989C94aa5Ba',
    STATA_TOKEN: '0x978206fAe13faF5a8d293FB614326B237684B750',
  },
  AAVE: {
    decimals: 18,
    UNDERLYING: '0x88541670E55cC00bEEFD87eB59EDd1b7C511AC9a',
    A_TOKEN: '0x6b8558764d3b7572136F17174Cb9aB1DDc7E1259',
    S_TOKEN: '0x4F15CaD6ebAE920a773bF00C6E941cccCB704915',
    V_TOKEN: '0xf12fdFc4c631F6D361b48723c2F2800b84B519e6',
    INTEREST_RATE_STRATEGY: '0xCA30c502d52F905FB3D04eE60cA48F5A1A89f8dB',
    ORACLE: '0xda678Ef100c13504edDb8a228A1e8e4CB139f189',
    STATA_TOKEN: '0x56771cEF0cb422e125564CcCC98BB05fdc718E77',
  },
  EURS: {
    decimals: 2,
    UNDERLYING: '0x6d906e526a4e2Ca02097BA9d0caA3c382F52278E',
    A_TOKEN: '0xB20691021F9AcED8631eDaa3c0Cd2949EB45662D',
    S_TOKEN: '0x08878209484D8178DD1FFA50AB1689F21aDBB856',
    V_TOKEN: '0x94482C7A7477196259D8a0f74fB853277Fa5a75b',
    INTEREST_RATE_STRATEGY: '0x5CB1008969a2d5FAcE8eF32732e6A306d0D0EF2A',
    ORACLE: '0xCbE15C1f40f1D7eE1De3756D1557d5Fdc2A50bBD',
    STATA_TOKEN: '0x72B49a461900e11632C95dfa563e7173438D4e3E',
  },
  GHO: {
    decimals: 18,
    UNDERLYING: '0xc4bF5CbDaBE595361438F8c6a187bDc330539c60',
    A_TOKEN: '0xd190eF37dB51Bb955A680fF1A85763CC72d083D4',
    S_TOKEN: '0xdCA691FB9609aB814E59c62d70783da1c056A9b6',
    V_TOKEN: '0x67ae46EF043F7A4508BD1d6B94DB6c33F0915844',
    INTEREST_RATE_STRATEGY: '0x521247B4d0a51E71DE580dA2cBF99EB40a44b3Bf',
    ORACLE: '0x00f7fecFAEbEd9499e1f3f9d04E755a21E5fc47C',
  },
};

const E_MODES = {
  NONE: 0,
  STABLECOINS: 1,
};

const AaveV3Sepolia = {
  AAVE_PROTOCOL_DATA_PROVIDER,
  ACL_ADMIN,
  ACL_MANAGER,
  ASSETS,
  CHAIN_ID,
  COLLECTOR,
  DEFAULT_A_TOKEN_IMPL_REV_1,
  DEFAULT_INCENTIVES_CONTROLLER,
  DEFAULT_STABLE_DEBT_TOKEN_IMPL_REV_1,
  DEFAULT_VARIABLE_DEBT_TOKEN_IMPL_REV_1,
  E_MODES,
  EMISSION_MANAGER,
  FAUCET,
  ORACLE,
  POOL,
  POOL_ADDRESSES_PROVIDER,
  POOL_CONFIGURATOR,
  POOL_CONFIGURATOR_IMPL,
  POOL_IMPL,
  STATIC_A_TOKEN_FACTORY,
  UI_GHO_DATA_PROVIDER,
  UI_INCENTIVE_DATA_PROVIDER,
  UI_POOL_DATA_PROVIDER,
  WALLET_BALANCE_PROVIDER,
  WETH_GATEWAY,
};

export {
  AaveV3Sepolia as A,
  POOL as a,
  POOL_IMPL as b,
  COLLECTOR as C,
  POOL_CONFIGURATOR as c,
  DEFAULT_INCENTIVES_CONTROLLER as D,
  POOL_CONFIGURATOR_IMPL as d,
  EMISSION_MANAGER as E,
  AAVE_PROTOCOL_DATA_PROVIDER as e,
  FAUCET as F,
  ACL_MANAGER as f,
  ACL_ADMIN as g,
  DEFAULT_A_TOKEN_IMPL_REV_1 as h,
  DEFAULT_VARIABLE_DEBT_TOKEN_IMPL_REV_1 as i,
  DEFAULT_STABLE_DEBT_TOKEN_IMPL_REV_1 as j,
  UI_POOL_DATA_PROVIDER as k,
  WETH_GATEWAY as l,
  UI_GHO_DATA_PROVIDER as m,
  CHAIN_ID as n,
  ORACLE as O,
  ASSETS as o,
  POOL_ADDRESSES_PROVIDER as P,
  E_MODES as p,
  STATIC_A_TOKEN_FACTORY as S,
  UI_INCENTIVE_DATA_PROVIDER as U,
  WALLET_BALANCE_PROVIDER as W,
};
