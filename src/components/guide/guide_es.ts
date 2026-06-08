export const guide_es = `
**Protocolo RNT Lend — Marco de Riesgo de Mercado y Liquidación**

_Visión institucional_

El mercado de colateralización de inmuebles tokenizados del ecosistema Reental, desplegado sobre la arquitectura Aave V3. Una infraestructura de préstamo conservadora y totalmente sobrecolateralizada, con mecanismos de liquidación claramente definidos y sin permisos que protegen la solvencia del protocolo.

**Cifras clave:** LTV máximo 75% · Umbral de liquidación 80% · Bonus de liquidación 10% · 250+ prestatarios distribuidos · 5 países de los activos · 2 liquidaciones menores hasta la fecha.

## 1. Resumen Ejecutivo

Esta página describe la **arquitectura de gestión de riesgo y el marco de liquidación** del mercado de préstamo RNT Lend. El sistema garantiza que toda la actividad de préstamo permanezca **totalmente sobrecolateralizada**, combinando la probada arquitectura Aave V3 con las características estructurales de los activos inmobiliarios tokenizados.

- Parámetros **Loan-to-Value conservadores**.
- **Umbrales de liquidación** automatizados.
- Incentivos económicos para **liquidadores sin permisos**.
- Sólida **diversificación de prestatarios y colateral**.
- Una **capa de liquidez P2P** secundaria que permite salidas de colateral.
- Préstamos y liquidaciones liquidados en **múltiples stablecoins** — USDT · USDC.

Actualmente, el protocolo presenta una **actividad de liquidación muy baja**, con solo dos liquidaciones menores registradas — ambas absorbidas de inmediato por la demanda del mercado de nuevos inversores. Ningún prestatario representa una exposición sistémica material, y ningún activo tiene más del 50% de su oferta utilizada como colateral.

## 2. Filosofía de Riesgo del Protocolo

RNT Lend adopta un **modelo de sobrecolateralización conservador**, construido sobre la arquitectura de préstamo Aave V3 utilizada por protocolos DeFi consolidados como Aave y Compound, pero adaptado a las características específicas de los activos inmobiliarios tokenizados. El marco se basa en cuatro principios fundamentales.

1. **Sobrecolateralización.** Los prestatarios deben depositar un colateral que supere significativamente el valor de sus préstamos.
2. **Liquidación Automatizada.** Cuando las posiciones superan los umbrales de riesgo predefinidos, cualquier participante del mercado puede ejecutar la liquidación.
3. **Incentivos Económicos.** Los liquidadores reciben un descuento sobre el colateral, creando un mecanismo de mercado para absorber el riesgo.
4. **Liquidez del Mercado Secundario.** Los tokens de colateral pueden venderse en el mercado secundario P2P existente, garantizando liquidez de salida.

## 3. Parámetros de Riesgo

Actualmente el protocolo aplica los siguientes parámetros de riesgo a todos los activos soportados.

| Parámetro | Valor | Descripción |
| --- | --- | --- |
| Loan-to-Value máximo (LTV) | 75% | Capacidad máxima de endeudamiento respecto al valor del colateral |
| Umbral de Liquidación | 80% | Las posiciones de préstamo pasan a ser elegibles para liquidación |
| Bonus de Liquidación | 10% | Descuento otorgado a los liquidadores |
| Activos prestables / de Liquidación | USDT · USDC | Stablecoins usadas para pedir prestado contra el colateral y para repagar la deuda durante la liquidación |

### Ciclo de Vida del Préstamo

Un usuario deposita activos inmobiliarios tokenizados como colateral y pide prestado hasta el LTV definido en **USDT o USDC**. Si la relación deuda-colateral alcanza el umbral de liquidación, la posición pasa a ser liquidable y un liquidador puede repagar la deuda para recibir colateral con el bonus. Este margen entre la capacidad de endeudamiento y el umbral de liquidación reduce la frecuencia de liquidaciones manteniendo una protección de riesgo robusta.

### Health Factor

> Health Factor = (Valor del Colateral × Umbral de Liquidación) ÷ Deuda

- **HF > 1** — La posición permanece segura.
- **HF = 1** — La posición alcanza el umbral de liquidación.
- **HF < 1** — La posición pasa a ser elegible para liquidación.

### Metodología de Valoración del Colateral

A diferencia de los criptoactivos volátiles como ETH o BTC, los RWA tokenizados siguen un **modelo de valoración de emisión fija**: el valor de referencia corresponde al precio de emisión original del activo tokenizado. Los activos inmobiliarios presentan baja volatilidad a corto plazo y sus valoraciones evolucionan de forma gradual, por lo que el protocolo trata el precio de emisión como el valor de referencia del oráculo salvo que la gobernanza de la DAO defina lo contrario.

### Flujo Operativo de Liquidación — «Marco de Notificación de Tres Avisos»

La infraestructura de monitorización sigue de forma continua los Health Factor de los prestatarios. A medida que una posición se acerca al umbral, los prestatarios reciben notificaciones de alerta temprana escaladas antes de que pueda producirse cualquier liquidación.

- **Aviso 1 — Notificación de Riesgo Temprano.** El Health Factor empieza a acercarse al umbral; el prestatario aún mantiene un margen cómodo para ajustar la posición.
- **Aviso 2 — Notificación de Advertencia.** La posición se aproxima más al umbral; se alerta al prestatario de que debe actuar con prontitud.
- **Aviso 3 — Advertencia Final.** El Health Factor se acerca al umbral sin acción correctiva; se avisa al prestatario de que la posición está a punto de ser liquidable.

En cualquier momento los prestatarios pueden añadir colateral o repagar deuda. El mecanismo de liquidación en sí permanece sin permisos e impulsado por el protocolo; esta capa de monitorización simplemente mejora la experiencia del prestatario y reduce las liquidaciones involuntarias.

## 4. Mecánica de Liquidación

Una vez superado el umbral, la posición pasa a ser elegible para liquidación. Un liquidador repaga parte o la totalidad de la deuda pendiente — en **USDT o USDC** — y recibe colateral con un **bonus de liquidación del 10%**.

### Ejemplo Numérico

Un prestatario ha depositado tokens inmobiliarios tokenizados como colateral y ha pedido prestada una stablecoin contra ellos. A medida que el Health Factor cae por debajo del umbral, la posición pasa a ser elegible para liquidación. Un liquidador repaga el 50% de la deuda en la misma stablecoin y recibe tokens de colateral con descuento gracias al bonus.

**Tipos de referencia:** 1 token = 100 EUR · 1 EUR = 1.18 USD · 1 USD = 1 USDT · 1 USD = 1 USDC.

**Liquidador — Posición Inicial**

- Tokens Reental: 0 tokens ~ 0.00 USD
- USDT / USDC: 5,000.00 ~ 5,000.00 USD

**Prestatario — Posición Inicial**

- Colateral: 100 tokens ~ 11,800.00 USD
- Deuda: 9,700.00 ~ 9,700.00 USD
- Umbral de Liquidación: 80%
- Máx. Liquidable: 50%
- Health Factor: LIQUIDABLE 0.97

**Transacción**

- El liquidador paga el 50% de la deuda (USDT / USDC): 4,850.00 ~ 4,850.00 USD
- El liquidador recibe tokens Reental por el valor pagado + Bonus (10%): 45.21 tokens ~ 5,335.00 USD

**Liquidador — Posición Final**

- Tokens Reental: 45.21 tokens ~ 5,335.00 USD
- USDT / USDC: 150.00 ~ 150.00 USD
- Resultado neto: +485.00 USD

**Prestatario — Posición Final**

- Colateral: 54.79 tokens ~ 6,465.00 USD
- Deuda: 4,850.00 ~ 4,850.00 USD
- Umbral de Liquidación: 80%
- Máx. Liquidable: 0%
- Health Factor: NO LIQUIDABLE 1.06
- Resultado neto: -485.00 USD

_Flujo de liquidación parcial (repago del 50%), liquidado en USDT o USDC._

## 5. Diversificación de Prestatarios y Colateral

### Prestatarios

**Más de 250 prestatarios** participan en el mercado, con la mayor posición individual en torno a **$400.000** — fácilmente absorbible por la demanda del mercado, reduciendo sustancialmente el riesgo de concentración. Verificable on-chain mediante la lista de holders del token de colateral.

### Colateral

**Ningún proyecto inmobiliario** tiene más del 50% de su oferta de tokens utilizada como colateral, y los activos abarcan proyectos en cinco países. Esto preserva la liquidez del mercado secundario y evita que las liquidaciones saturen la oferta.

## 6. Participación de Liquidadores y Liquidez

La liquidación es **sin permisos** — abierta a traders de arbitraje, market makers, participantes de la DAO, bots automatizados y actores institucionales. El bonus del 10% permite a los liquidadores obtener beneficio manteniendo la solvencia, con márgenes netos realizados típicamente del **2%–6%** tras la reventa del colateral.

En lugar de volcar el colateral en DEXs, RNT Lend integra un **marketplace P2P para activos inmobiliarios tokenizados**. Los liquidadores venden allí los tokens recibidos, donde los inversores entrantes aportan liquidez natural — históricamente permitiendo salidas rápidas con un impacto de precio limitado.

## 7. Análisis de Escenarios de Estrés

Los posibles escenarios de estrés — correcciones rápidas del precio de los activos, múltiples prestatarios acercándose a la liquidación simultáneamente, o reducciones temporales de la liquidez del mercado secundario — se mitigan mediante múltiples capas superpuestas.

- **Colateralización conservadora** — un LTV del 75% proporciona un margen de seguridad sustancial.
- **Incentivos económicos de liquidación** — el bonus del 10% atrae capital de liquidación cuando es necesario.
- **Diversificación de prestatarios** — ningún prestatario puede impactar materialmente la solvencia.
- **Diversificación de activos** — colateral distribuido entre múltiples proyectos y países.
- **Demanda activa de inversores** — los inversores entrantes generan liquidez continua en el mercado secundario.

**Actividad Histórica de Liquidación.** La actividad de liquidación ha sido mínima — solo dos liquidaciones menores hasta la fecha, ambas absorbidas de inmediato por la demanda de inversores entrantes. No se ha acumulado ningún backlog de liquidación, lo que indica condiciones de liquidez saludables.

## 8. Hoja de Ruta de Infraestructura de Riesgo Futura

El marco anterior refleja la arquitectura actual. Se están considerando varias mejoras para futuras discusiones de gobernanza de la DAO.

- **Emparejamiento Atómico de Liquidaciones.** Emparejamiento directo entre liquidaciones y órdenes de compra P2P, de modo que liquidación y reventa se liquiden en una sola transacción — los liquidadores reciben liquidez en USDT o USDC al instante, reduciendo significativamente el riesgo de mercado.
- **Listados Automáticos en el Mercado Secundario.** Tras una liquidación, el sistema crea automáticamente ofertas de venta en el marketplace P2P, asegurando que los liquidadores siempre tengan una vía de salida inmediata.
- **Infraestructura de Monitorización de Liquidaciones.** Una capa de monitorización en tiempo real en el panel de RNT Lend Admin, potencialmente expuesta mediante dashboards públicos, feeds de API y herramientas de la DAO para bots de liquidación independientes.

## 9. Conclusión

El mercado de préstamo RNT Lend opera bajo un **marco de riesgo conservador y transparente** que combina préstamos sobrecolateralizados, liquidación sin permisos, sólidos incentivos económicos, diversificación de prestatarios y colateral, liquidez activa del mercado secundario y liquidación multi-stablecoin en **USDT y USDC**. Los datos actuales indican una actividad de liquidación muy limitada y una fuerte demanda de inversores, lo que respalda la estabilidad del sistema — mientras que las mejoras planificadas de automatización y monitorización fortalecerán aún más su resiliencia a escala.
`;
