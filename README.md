#### π¨ λ³Έ λ¬Έμμ μ€μ λ΄ μ€μΉ λ° μ€νλ°©λ²μ μμΈν μ μ΄λμμΌλ λ°λμ λ¬Έμλ₯Ό λͺ¨λ μ½κ³  λ΄μ μ¬μ©νμκΈ° λ°λλλ€.


# Swap-Bot
Klayswap κΈ°λ° μλ ν ν° μ€μ λ΄  


# μ¬μ© λͺ©μ 
ν΄λ μ΄νΌ μ§κ° λ΄ KLAY λ° κ°μ’ ν ν° μμ°μ μ£ΌκΈ°μ μΌλ‘ νΉμ  ν ν°μΌλ‘ μ€μνμ¬ μ‘κΈ μ§κ°μΌλ‘ μ μ‘ν©λλ€.  
μλ₯Ό λ€λ©΄, λ§€μΆ EOAμ μμ΄λ λ€μν μ’λ₯μ ν ν°μ νλλ‘ μλμ€μνμ¬ ν΅ν©ν  λ μ¬μ©ν  μ μμ΅λλ€.  


# Requirements
- Serverless νλ μμν¬κ° μ€μΉλμ΄ μμ΄μΌ ν©λλ€.
- AWS Credentialμ΄ νμν©λλ€.

## Setup (Serverless & AWS Credential)
#### Serverless μ€μΉ
```
npm install -g serverless
```
μ΄ν μ€μΉ κ³Όμ  λ° AWS Credential λ±λ‘μ μμΈν κ³Όμ μ μλ λ§ν¬λ₯Ό μ°Έμ‘°ν΄μ£ΌμΈμ.

- [κ³΅μλ¬Έμ - Serverless μ€μΉ](https://www.serverless.com/framework/docs/getting-started)
- [κ³΅μλ¬Έμ - AWS μ°κ²°](https://www.serverless.com/framework/docs/providers/aws/guide/credentials)
- [λΈλ‘κ·Έ](https://velog.io/@jeffyoun/Serverless-%ED%94%84%EB%A0%88%EC%9E%84%EC%9B%8C%ED%81%AC-%EC%82%AC%EC%9A%A9%ED%95%B4%EC%84%9C-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0)

## Installation
```
git clone https://github.com/soohoio/swap-bot
```
```
npm install
```

# Setting
## νκ²½λ³μ μ€μ 
1. `config/config-sample.js`μμ κ°μ’ νκ²½λ³μλ₯Ό μ€μ ν΄ μ€λλ€.
  - **NODE_URL** : KAS λΈλ μλν¬μΈνΈ ('https://node-api.klaytnapi.com/v1/klaytn')
  - **KAS_ACCESS_KEY_ID**
  - **KAS_SECRET_ACCESS_KEY**
  - **SOURCE_ADDRESS** : μΆκΈ μ§κ°(μ€μ λμ ν ν°μ΄ λ€μ΄μλ μ§κ°)μ μ£Όμ
  - **SOURCE_PRIVATE_KEY** : μΆκΈ μ§κ°μ Private Key
  - **DESTINATION_ADDRESS** : μ‘κΈ μ§κ°μ μ£Όμ(μΆκΈ μ§κ° μ£Όμμ λμΌν μ£Όμλ‘ μ€μ ν  μ μμ΅λλ€.)
  - **FROM_TOKENS** : μ€μμ μ§νν  ν ν° λͺ©λ‘. (ν ν°λͺμ μΌν( **,** )λ‘ λΆλ¦¬νμ¬ μμ±ν΄ μ£ΌμκΈ° λ°λλλ€.)
  - **TO_TOKEN** : μ΄λ€ ν ν°μΌλ‘ μ€μμ μ§νν  κ²μΈμ§ (ν ν°λͺ)
  - **SLIPPAGE** : μ¬λ¦¬νΌμ§ μ ν [default: 0.003(0.3%)]
  - **RESERVED_KLAY** : μ€μ μ§ν μ λ¨κ²¨λ KLAY μ(λ¨μ: KLAY)
    - Swapμ μ§ννκΈ° μν΄μλ κ°μ€λΉλ‘ μ¬μ©λ  KLAYκ° νμνκΈ° λλ¬Έμ, μ΅μ κ°μ€λΉ μ΄μμ KLAYλ₯Ό μ§κ°μ λ¨κ²¨λμ΄μΌ ν©λλ€.
    - λ§μ½ RESERVED_KLAYκ°μ΄ κ°μ€λΉ(μ½ 0.1~0.3KLAY)λ³΄λ€ μλ€λ©΄ μ€μ μ»¨νΈλνΈ μ€νμ μ€ν¨ν  μ μμ΅λλ€.
  - **WKLAY_ADDRESS** : (optional) WKLAY(Wrapped Klaytn)μ μ»¨νΈλνΈ μ£Όμ
    - WKLAY_ADDRESSλ₯Ό μλ ₯νλ©΄, μ€μμ μ§ννκΈ° μ  κ°μ§κ³  μλ λͺ¨λ  WKLAYλ₯Ό KLAYλ‘ μΈμΆνλ κ³Όμ μ μνν©λλ€.

  > λ³Έ Botμ FROM_TOKENμ ν΄λΉνλ **μκ³  μ μ²΄(KLAY μ μΈ)** λ₯Ό TO_TOKENμΌλ‘ μ€μν©λλ€.  
  λ§μ½ `FROM_TOKENS=KDAI,oETH,KLAY` μ΄κ³  `TO_TOKEN=oUSDT` λΌλ©΄, swap μ€ν μ μ§κ° λ΄ KDAIμ oETH **ν ν° μ λ** μ΄ oUSDTλ‘ μ€μλμ΄ **DESTINATION κ³μ’** λ‘ μ?κ²¨μ§κ³ ,
  **SOURCE κ³μ’** μλ **(RESERVED_KLAY - κ°μ€λΉ)** λ§νΌμ KLAYλ§ λ¨κ² λ©λλ€.  

2. νμΌλͺμ λ³κ²½ν΄ μ€λλ€.

`config-sample.js` -> `config.js`


## ν ν° λͺ©λ‘ μ€μ 
`tokens-dev.json`, `tokens-prod.json`μμ ν ν° λͺ©λ‘μ μΆκ° / μ­μ ν  μ μμ΅λλ€.  
λ°λμ `{name: <ν ν° Symbol>, address: <μ»¨νΈλνΈ μ£Όμ>}`μ formatμΌλ‘ μΆκ°νμμΌ νλ©°,
ν ν°λͺμ μ²΄μΈ μμ token symbolμ κΈ°μν΄ μ£ΌμκΈ° λ°λλλ€.

## serverless μ€μ 
#### 0. `serverless-sample.yml`μ νμΌλͺμ λ³κ²½ν΄ μ€λλ€.  
`serverless-sample.yml` -> `serverless.yml`


#### 1. λ¨Όμ  orgμ application nameμ μ€μ ν΄ μ£Όμ΄μΌ ν©λλ€.  
  swap-bot λ£¨νΈ ν΄λλ‘ μ΄λ ν μλ λͺλ Ήμ΄λ₯Ό μ€νν©λλ€.
```
serverless
```
μ λͺλ Ήμ΄λ₯Ό μ€ννλ©΄ μλ μ§λ¬Έλ€μ orgμ application μ΄λ¦μ μμ λ‘­κ² μλ ₯ν΄ μ£Όμλ©΄ λ©λλ€.
```
- What org do you want to add this service to?
- What application do you want to add this to?
(- What do you want to name this application?)
```
 
orgμ app name μ€μ  μ΄ν [Serverless λμλ³΄λ](https://app.serverless.com/)μμ app nameμ΄ μ μμ μΌλ‘ λ±λ‘λμλμ§ νμΈν΄ μ£ΌμΈμ.  
```
Do you want to deploy now?
```
orgμ application μ΄λ¦ λ±λ‘ ν μμ κ°μ΄ μ§κΈ deployν  κ²μΈμ§ λ¬»λλ°μ, μΌλ¨ deployνμ§ λ§μκ³  μλ μ€μ μ λͺ¨λ λ§μΉμ  ν μλ [Deploy](https://github.com/soohoio/swap-bot/blob/main/README.md#deploy)μ μ μ°¨λ₯Ό λ°λΌ μ£ΌμκΈ° λ°λλλ€.


#### 2. (serverless-sample.yml 37~38ν) Swap λ΄μ΄ μ£ΌκΈ°μ μΌλ‘ μ€νλ  μκ°μ μ€μ ν΄ μ€λλ€.
```
events:
  # λ§€μ£Ό μμμΌ μ€μ  11:00(νκ΅­μ) μ€ν (02:00UTC)
  - schedule: 
      rate: cron(0 2 ? * MON *)
```
[LAMBDA schedule expression μ°Έκ³ ](https://docs.aws.amazon.com/ko_kr/lambda/latest/dg/services-cloudwatchevents-expressions.html)  
* μ΄μΈμλ aws region λ± κΈ°ν μ€μ λ€ λν μμ λ‘­κ² μ€μ νμλ©΄ λ©λλ€.  



# Deploy
μλ²λ¦¬μ€ νλ μμν¬λ₯Ό ν΅ν΄ Swap λ΄μ AWS μμ λ°°ν¬ν©λλ€.
```
npm run deploy:dev
```
```
npm run deploy:prod
```

> λ΄μ deployνκΈ° μ  λ΄λΆ νμΌμμ€νμ Liquidity Poolμ μ λ³΄λ₯Ό μ΅μ ννλ μμμ μνν©λλ€.  
> λ°λΌμ κΈ°μ‘΄μ μλ²λ¦¬μ€μ deployνλ λͺλ Ήμ΄(serverless deploy)λ‘ deploy μν μ liquidity poolμ΄ μ΅μ ν λμ§ μμ μ μμ΅λλ€.  
> liquidity poolμ΄ μΆκ°/λ³κ²½/μ­μ λμκ±°λ token λͺ©λ‘μ μΆκ°/μ­μ νλ κ²½μ°, deployλ₯Ό λ€μ μνν΄ μ£ΌμκΈ° λ°λλλ€.  


# Manually Swap
μλμΌλ‘ swapμ μ€νν©λλ€.
```
npm run swap:dev
```
```
npm run swap:prod
```

# λ³΄λ΄λ ν ν° / λ°λ ν ν° / λ³΄λ΄λ ν ν° μμ μ§μ νμ¬ μ€μ ν¨μ μ€ν
* λ‘μ»¬μμλ§ μλ κ°λ₯ν©λλ€.  
* singleSwap ν¨μλ₯Ό μ€ννκΈ° μ μ λ°λμ updatePoolsμ μ§νν΄μΌ ν©λλ€. (λΉλ μ μλμΌλ‘ μ§νλ©λλ€.)
* <from> ν ν° <amount>λ§νΌμ <to>ν ν°μΌλ‘ μ€μν©λλ€.
```
from=KLEVA to=oUSDT amount=100000000000 npm run singleSwap:dev:local
```
```
from=oUSDT to=KDAI amount=500000 npm run singleSwap:prod:local
```
