export const guide_en = `
**RNT Lend Protocol — Market Risk & Liquidation Framework**

_Institutional Overview_

The tokenized real-estate collateralization market of the Reental ecosystem, deployed on the Aave V3 architecture. A conservative, fully overcollateralized lending infrastructure with clearly defined, permissionless liquidation mechanisms that protect protocol solvency.

**Key figures:** Maximum LTV 75% · Liquidation threshold 80% · Liquidation bonus 10% · 250+ distributed borrowers · 5 countries of assets · 2 minor liquidations to date.

## 1. Executive Summary

This page outlines the **risk management architecture and liquidation framework** of the RNT Lend lending market. The system ensures that all borrowing activity remains **fully overcollateralized**, combining the proven Aave V3 architecture with the structural characteristics of tokenized real-estate assets.

- Conservative **Loan-to-Value parameters**.
- Automated **liquidation thresholds**.
- Economic incentives for **permissionless liquidators**.
- Strong **borrower and collateral diversification**.
- A secondary **P2P liquidity layer** enabling collateral exits.
- Borrowing and liquidations settled in **multiple stablecoins** — USDT · USDC.

At present, the protocol exhibits **very low liquidation activity**, with only two minor liquidations recorded — both immediately absorbed by market demand from new investors. No single borrower represents material systemic exposure, and no asset has more than 50% of its supply used as collateral.

## 2. Protocol Risk Philosophy

RNT Lend adopts a **conservative overcollateralization model**, built on the Aave V3 lending architecture used by established DeFi protocols such as Aave and Compound, but adapted to the specific characteristics of tokenized real-estate assets. The framework rests on four core principles.

1. **Overcollateralization.** Borrowers must deposit collateral significantly exceeding the value of their loans.
2. **Automated Liquidation.** When positions exceed predefined risk thresholds, liquidation can be executed by any market participant.
3. **Economic Incentives.** Liquidators receive a discount on collateral, creating a market-driven mechanism to absorb risk.
4. **Secondary Market Liquidity.** Collateral tokens can be sold through the existing P2P secondary market, ensuring exit liquidity.

## 3. Risk Parameters

The protocol currently applies the following risk parameters to all supported assets.

| Parameter | Value | Description |
| --- | --- | --- |
| Maximum Loan-to-Value (LTV) | 75% | Maximum borrowing capacity relative to collateral value |
| Liquidation Threshold | 80% | Borrow positions become eligible for liquidation |
| Liquidation Bonus | 10% | Discount granted to liquidators |
| Borrowable / Liquidation Assets | USDT · USDC | Stablecoins used to borrow against collateral and to repay debt during liquidation |

### Borrowing Lifecycle

A user deposits tokenized real-estate assets as collateral and borrows up to the defined LTV in **USDT or USDC**. If the debt-to-collateral ratio reaches the liquidation threshold, the position becomes liquidatable, and a liquidator may repay the debt to receive collateral with the bonus. This buffer between borrowing capacity and the liquidation threshold reduces liquidation frequency while maintaining robust risk protection.

### Health Factor

> Health Factor = (Collateral Value × Liquidation Threshold) ÷ Debt

- **HF > 1** — Position remains safe.
- **HF = 1** — Position reaches the liquidation threshold.
- **HF < 1** — Position becomes eligible for liquidation.

### Collateral Valuation Methodology

Unlike volatile crypto assets such as ETH or BTC, tokenized RWAs follow a **fixed issuance valuation model**: the reference value corresponds to the original issuance price of the tokenized asset. Real-estate assets exhibit low short-term volatility and valuations evolve gradually, so the protocol treats the issuance price as the reference oracle value unless otherwise defined by DAO governance.

### Operational Liquidation Flow — "Three-Strike Notification Framework"

Monitoring infrastructure continuously tracks borrower Health Factors. As a position approaches the threshold, borrowers receive escalating early-warning notifications before any liquidation can occur.

- **Strike 1 — Early Risk Notification.** The Health Factor begins approaching the threshold; the borrower still maintains a comfortable margin to adjust the position.
- **Strike 2 — Warning Notification.** The position approaches closer to the threshold; the borrower is alerted that action should be taken promptly.
- **Strike 3 — Final Warning.** The Health Factor approaches the threshold with no corrective action; the borrower is warned the position is about to become liquidatable.

At any point borrowers may add collateral or repay debt. The liquidation mechanism itself remains permissionless and protocol-driven; this monitoring layer simply improves borrower experience and reduces involuntary liquidations.

## 4. Liquidation Mechanics

Once the threshold is exceeded, the position becomes eligible for liquidation. A liquidator repays part or all of the outstanding debt — in **USDT or USDC** — and receives collateral with a **10% liquidation bonus**.

### Numerical Example

A borrower has deposited tokenized real-estate tokens as collateral and borrowed a stablecoin against them. As the Health Factor falls below the threshold, the position becomes eligible for liquidation. A liquidator repays 50% of the debt in the same stablecoin and receives collateral tokens at a discount through the bonus.

**Reference rates:** 1 token = 100 EUR · 1 EUR = 1.18 USD · 1 USD = 1 USDT · 1 USD = 1 USDC.

**Liquidator — Initial Position**

- Reental Tokens: 0 tokens ~ 0.00 USD
- USDT / USDC: 5,000.00 ~ 5,000.00 USD

**Borrower — Initial Position**

- Collateral: 100 tokens ~ 11,800.00 USD
- Debt: 9,700.00 ~ 9,700.00 USD
- Liquidation Threshold: 80%
- Max. Liquidatable: 50%
- Health Factor: LIQUIDATABLE 0.97

**Transaction**

- Liquidator pays 50% of the debt (USDT / USDC): 4,850.00 ~ 4,850.00 USD
- Liquidator receives Reental tokens for the value paid + Bonus (10%): 45.21 tokens ~ 5,335.00 USD

**Liquidator — Final Position**

- Reental Tokens: 45.21 tokens ~ 5,335.00 USD
- USDT / USDC: 150.00 ~ 150.00 USD
- Net: +485.00 USD

**Borrower — Final Position**

- Collateral: 54.79 tokens ~ 6,465.00 USD
- Debt: 4,850.00 ~ 4,850.00 USD
- Liquidation Threshold: 80%
- Max. Liquidatable: 0%
- Health Factor: NOT LIQUIDATABLE 1.06
- Net: -485.00 USD

_Partial liquidation flow (50% repayment), settled in USDT or USDC._

## 5. Borrower & Collateral Diversification

### Borrowers

**More than 250 borrowers** participate in the market, with the largest individual position around **$400,000** — easily absorbable by market demand, substantially reducing concentration risk. Verifiable on-chain via the collateral token holder list.

### Collateral

**No single real-estate project** has more than 50% of its token supply used as collateral, and assets span projects in five countries. This preserves secondary-market liquidity and prevents liquidations from overwhelming supply.

## 6. Liquidator Participation & Liquidity

Liquidation is **permissionless** — open to arbitrage traders, market makers, DAO participants, automated bots and institutional actors. The 10% bonus allows liquidators to profit while maintaining solvency, with net realized margins typically **2%–6%** after collateral resale.

Rather than dumping collateral on DEXs, RNT Lend integrates a **P2P marketplace for tokenized real-estate assets**. Liquidators sell received tokens there, where incoming investors provide natural liquidity — historically allowing fast exits with limited price impact.

## 7. Stress Scenario Analysis

Potential stress scenarios — rapid asset price corrections, multiple borrowers approaching liquidation simultaneously, or temporary reductions in secondary-market liquidity — are mitigated through multiple overlapping layers.

- **Conservative collateralization** — 75% LTV provides a substantial safety margin.
- **Economic liquidation incentives** — the 10% bonus attracts liquidation capital when needed.
- **Borrower diversification** — no single borrower can materially impact solvency.
- **Asset diversification** — collateral distributed across multiple projects and countries.
- **Active investor demand** — incoming investors create ongoing secondary-market liquidity.

**Historical Liquidation Activity.** Liquidation activity has been minimal — only two minor liquidations to date, both immediately absorbed by incoming investor demand. No liquidation backlog has accumulated, indicating healthy liquidity conditions.

## 8. Future Risk Infrastructure Roadmap

The framework above reflects the architecture today. Several upgrades are under consideration for future DAO governance discussions.

- **Atomic Liquidation Matching.** Direct matching between liquidations and P2P buy orders, so liquidation and resale settle in a single transaction — liquidators instantly receive USDT or USDC liquidity, significantly reducing market risk.
- **Automated Secondary-Market Listings.** After liquidation, the system automatically creates sell offers on the P2P marketplace, ensuring liquidators always have an immediate exit pathway.
- **Liquidation Monitoring Infrastructure.** A real-time monitoring layer in the RNT Lend Admin dashboard, potentially exposed via public dashboards, API feeds and DAO tools for independent liquidation bots.

## 9. Conclusion

The RNT Lend lending market operates under a **conservative and transparent risk framework** combining overcollateralized borrowing, permissionless liquidation, strong economic incentives, borrower and collateral diversification, active secondary-market liquidity, and multi-stablecoin settlement in **USDT and USDC**. Current data indicates very limited liquidation activity and strong investor demand, supporting the stability of the system — while planned automation and monitoring improvements will further strengthen its resilience at scale.
`;
