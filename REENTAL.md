# Reental

Comentarios básicos para entender las relaciones entre contratos y configuraciones de Aave V3

## Config de Aave V3 personalizado

Ubicados en el directorio `src/ui-config/custom`

La correspondencia entre solidity y la configuracion de AAve V3

```
{
  DEFAULT_A_TOKEN_IMPL_REV_1 - "aToken": "0x959bAF9Fd9255Dda84C1a225bB7A7FF90a93Ef02",
  "aave-v3-factory-branch": "main",
  "aave-v3-factory-commit": "aa406c8d11444b68a4732d831fefba7de7d7ee4a",
  ORACLE - "aaveOracle": "0x9E313D8cDA997dCEEA20bEA444720702958cd0F3",
  "aaveParaSwapFeeClaimer": "0x0000000000000000000000000000000000000000",
  ACL_MANAGER - "aclManager": "0x462F1E83B2CE6b98AD553F91fdFD775b4aC5Ceb8",
  "configEngine": "0xDEA1a8B684c0937D3698E256E5AFcEFa37BC5f4e",
  "defaultInterestRateStrategy": "0xfB1003CD1274E161359697E4fc53abF130245ff3",
  EMISSION_MANAGER - "emissionManager": "0x17ED7638f9F85ca0C521FA2C5Dc878bcE78B7CE8",
  "l2Encoder": "0x0000000000000000000000000000000000000000",
  "paraSwapLiquiditySwapAdapter": "0x0000000000000000000000000000000000000000",
  "paraSwapRepayAdapter": "0x0000000000000000000000000000000000000000",
  "paraSwapWithdrawSwapAdapter": "0x0000000000000000000000000000000000000000",
  POOL_ADDRESSES_PROVIDER - "poolAddressesProvider": "0x717c2A6FA0820b04B9D4793DACa33A229AEc85ca",
  "poolAddressesProviderRegistry": "0x1E2Ce78D5b2cc2b9B9082bC615136c688D7058Df",
  POOL_CONFIGURATOR_IMPL -"poolConfiguratorImplementation": "0xAa9C22B7AeE7F8434D7E614c1f863bb2e4394C71",
  POOL_CONFIGURATOR - "poolConfiguratorProxy": "0x907cfeC9eD5cfEB0Fe57d926545e52adc9EF4B26",
  POOL_IMPL - "poolImplementation": "0xD0dB19B084fA02f210f32DE67fbf5c2B50386ed3",
  POOL - "poolProxy": "0x67dC8037Db6309Dd5571D82c65F5f593F7da1505",
  "priceOracleSentinel": "0x0000000000000000000000000000000000000000",
  AAVE_PROTOCOL_DATA_PROVIDER - "protocolDataProvider": "0x5542ac41138f6A52A13C644F1DB56BAda71a4021",
  "proxyAdmin": "0xb3854864322078A292b80e8534E5b8fD6174486f",
  "rewardsControllerImplementation": "0x30d3D2dB5C9eC26C19d3EDA5D38CAE42594413c6",
  DEFAULT_INCENTIVES_CONTROLLER - "rewardsControllerProxy": "0x32fb7bAD0099b63dF86943b43646347C5b9FF5d1",
  DEFAULT_STABLE_DEBT_TOKEN_IMPL_REV_1 - "stableDebtToken": "0xa9811d14F8140e9f73c17D0bbC98f7C9539886a1",
  "staticATokenFactoryImplementation": "0xC2beA594f0d210b2Ddc6e25258c0F02ccB7B2C4E",
  "staticATokenFactoryProxy": "0x4F918cefA998C47e06F84257582EE4dEc923F00c",
  "staticATokenImplementation": "0xA239641e422f082e7F4a438DF74D02A1E99Ced62",
  STATIC_A_TOKEN_FACTORY - "transparentProxyFactory": "0x88E9066A96bcD71B972be9D4a064137e9aFA0fED",
  ACL_ADMIN - "treasury": "0x414F65A595b1cb51b685C936169a3BBdF5dC07c5",
  "treasuryImplementation": "0x0000000000000000000000000000000000000000",
  UI_INCENTIVE_DATA_PROVIDER - "uiIncentiveDataProvider": "0x94C4867b175881e365099a4aD4FA519C1860Eb7C",
  UI_POOL_DATA_PROVIDER - "uiPoolDataProvider": "0xC74cEeEA87C7879d9A10Ef6A13a60f058983E10A",
  DEFAULT_VARIABLE_DEBT_TOKEN_IMPL_REV_1 - "variableDebtToken": "0x32f84e59a91E040106EBA18dcC5c57b2D368f776",
  WALLET_BALANCE_PROVIDER - "walletBalanceProvider": "0x47eD9AcA221654E413FD8558E87B7B1B96fDaa91",
  WETH_GATEWAY - "wrappedTokenGateway": "0x4B4EFF8F9DaAaD75aE3aAD52aFB12022aE4Cb79e"
}
```

## Códigos de referido on-chain

Atribuimos depósitos a partners usando el `referralCode` (uint16) de Aave V3, que queda indexado en el evento `Supply` del Pool. Sin servicios de analítica de terceros.

### Añadir un partner

Editar `src/ui-config/referralCodes.json` (slug → número):

```json
{
  "merkl": 1,
  "turtle": 2
}
```

- Slugs en minúsculas.
- Valores enteros entre `1` y `65535` (`0` = sin referido). No reutilizar números de partners antiguos.
- Para desactivar un partner basta con quitarlo del JSON: los usuarios que ya lo tuvieran guardado vuelven a enviar `0`.

Enlace a compartir con el partner: `https://<app>/?referral_code=<slug>`

### Comportamiento

- Se activa por market con el flag `enabledFeatures.referralCode` en `src/ui-config/marketsConfig.tsx` (activo en `reental_polygon_v3` y `reental_sepolia_v3`). En markets sin el flag (p. ej. Aave Ethereum) se envía siempre `0`. Lo resuelve `getReferralCodeForMarket(marketData)`.
- `captureReferralCode()` (`src/utils/referral.ts`) se ejecuta al cargar `pages/_app.page.tsx`, lee `referral_code` de la URL y, si el slug está en la whitelist, lo guarda en `localStorage` (`reental_referral_v1`).
- Last-touch: un nuevo enlace válido sobrescribe el anterior. Slugs desconocidos se ignoran (no borran el existente).
- Caduca a los 30 días (`REFERRAL_TTL_DAYS`).
- En markets con el flag, el código se envía en todos los depósitos: `supply`, `supplyWithPermit`, depósito de ETH nativo vía WETH Gateway y tokens envueltos (`TokenWrapperService`).

### Cómo medir

Filtrar los eventos `Supply` del proxy del Pool (`POOL` en `src/ui-config/custom`) por `referralCode` (topic 3, indexado):

```ts
import { createPublicClient, http, parseAbiItem } from 'viem';
import { polygon } from 'viem/chains';

const client = createPublicClient({ chain: polygon, transport: http() });

const logs = await client.getLogs({
  address: POOL_PROXY_ADDRESS,
  event: parseAbiItem(
    'event Supply(address indexed reserve, address user, address indexed onBehalfOf, uint256 amount, uint16 indexed referralCode)'
  ),
  args: { referralCode: 1 },
  fromBlock: FROM_BLOCK,
  toBlock: 'latest',
});
```

Limitación: solo se atribuyen los depósitos hechos a través de este front-end; los depósitos directos al contrato o desde otras interfaces llevarán su propio `referralCode` (normalmente `0`).
