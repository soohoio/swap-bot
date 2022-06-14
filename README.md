#### 🚨 본 문서에 스왑 봇 설치 및 실행방법을 상세히 적어두었으니 반드시 문서를 모두 읽고 봇을 사용하시기 바랍니다.


# Swap-Bot
Klayswap 기반 자동 토큰 스왑 봇  


# 사용 목적
클레이튼 지갑 내 KLAY 및 각종 토큰 자산을 주기적으로 특정 토큰으로 스왑하여 송금 지갑으로 전송합니다.  
예를 들면, 매출 EOA에 쌓이는 다양한 종류의 토큰을 테더로 자동스왑하여 통합할 때 사용할 수 있습니다.  


# Requirements
- Serverless 프레임워크가 설치되어 있어야 합니다.
- AWS Credential이 필요합니다.

## Setup (Serverless & AWS Credential)
#### Serverless 설치
```
npm install -g serverless
```
이후 설치 과정 및 AWS Credential 등록은 자세한 과정은 아래 링크를 참조해주세요.

- [공식문서 - Serverless 설치](https://www.serverless.com/framework/docs/getting-started)
- [공식문서 - AWS 연결](https://www.serverless.com/framework/docs/providers/aws/guide/credentials)
- [블로그](https://velog.io/@jeffyoun/Serverless-%ED%94%84%EB%A0%88%EC%9E%84%EC%9B%8C%ED%81%AC-%EC%82%AC%EC%9A%A9%ED%95%B4%EC%84%9C-%EB%B0%B0%ED%8F%AC%ED%95%98%EA%B8%B0)

## Installation
```
git clone https://github.com/soohoio/swap-bot
```
```
npm install
```

# Setting
## 환경변수 설정
1. `config/config-sample.js`에서 각종 환경변수를 설정해 줍니다.
  - **NODE_URL** : KAS 노드 엔드포인트 ('https://node-api.klaytnapi.com/v1/klaytn')
  - **KAS_ACCESS_KEY_ID**
  - **KAS_SECRET_ACCESS_KEY**
  - **SOURCE_ADDRESS** : 출금 지갑(스왑 대상 토큰이 들어있는 지갑)의 주소
  - **SOURCE_PRIVATE_KEY** : 출금 지갑의 Private Key
  - **DESTINATION_ADDRESS** : 송금 지갑의 주소(출금 지갑 주소와 동일한 주소로 설정할 수 있습니다.)
  - **FROM_TOKENS** : 스왑을 진행할 토큰 목록. (토큰명을 쉼표( **,** )로 분리하여 작성해 주시기 바랍니다.)
  - **TO_TOKEN** : 어떤 토큰으로 스왑을 진행할 것인지 (토큰명)
  - **SLIPPAGE** : 슬리피지 제한 [default: 0.003(0.3%)]
  - **RESERVED_KLAY** : 스왑 진행 시 남겨둘 KLAY 양(단위: KLAY)
    - Swap을 진행하기 위해서는 가스비로 사용될 KLAY가 필요하기 때문에, 최소 가스비 이상의 KLAY를 지갑에 남겨두어야 합니다.
    - 만약 RESERVED_KLAY값이 가스비(약 0.1~0.3KLAY)보다 작다면 스왑 컨트랙트 실행에 실패할 수 있습니다.
  - **WKLAY_ADDRESS** : (optional) WKLAY(Wrapped Klaytn)의 컨트랙트 주소
    - WKLAY_ADDRESS를 입력하면, 스왑을 진행하기 전 가지고 있는 모든 WKLAY를 KLAY로 인출하는 과정을 수행합니다.

  > 본 Bot은 FROM_TOKEN에 해당하는 **잔고 전체(KLAY 제외)** 를 TO_TOKEN으로 스왑합니다.  
  만약 `FROM_TOKEN=KDAI,oETH,KLAY` 이고 `TO_TOKEN=oUSDT` 라면, swap 실행 시 지갑 내 KDAI와 oETH **토큰 전량** 이 oUSDT로 스왑되고,
  KLAY는 **(RESERVED_KLAY - 가스비)** 만큼만 남게 됩니다.

2. 파일명을 변경해 줍니다.

`config-sample.js` -> `config.js`


## 토큰 목록 설정
`tokens-dev.json`, `tokens-prod.json`에서 토큰 목록을 추가 / 삭제할 수 있습니다.  
반드시 `{name: <토큰 Symbol>, address: <컨트랙트 주소>}`의 format으로 추가하셔야 하며,
토큰명은 체인 상의 token symbol을 기입해 주시기 바랍니다.

## serverless 설정
#### 0. `serverless-sample.yml`의 파일명을 변경해 줍니다.  
`serverless-sample.yml` -> `serverless.yml`


#### 1. 먼저 org와 application name을 설정해 주어야 합니다.  
  swap-bot 루트 폴더로 이동 후 아래 명령어를 실행합니다.
```
serverless
```
위 명령어를 실행하면 아래 질문들에 org와 application 이름을 자유롭게 입력해 주시면 됩니다.
```
- What org do you want to add this service to?
- What application do you want to add this to?
(- What do you want to name this application?)
```
 
org와 app name 설정 이후 [Serverless 대시보드](https://app.serverless.com/)에서 app name이 정상적으로 등록되었는지 확인해 주세요.  
```
Do you want to deploy now?
```
org와 application 이름 등록 후 위와 같이 지금 deploy할 것인지 묻는데요, 일단 deploy하지 마시고 아래 설정을 모두 마치신 후 아래 [Deploy](https://github.com/soohoio/swap-bot/blob/main/README.md#deploy)의 절차를 따라 주시기 바랍니다.


#### 2. (serverless-sample.yml 37~38행) Swap 봇이 주기적으로 실행될 시간을 설정해 줍니다.
```
events:
  # 매주 월요일 오전 11:00(한국시) 실행 (02:00UTC)
  - schedule: 
      rate: cron(0 2 ? * MON *)
```
[LAMBDA schedule expression 참고](https://docs.aws.amazon.com/ko_kr/lambda/latest/dg/services-cloudwatchevents-expressions.html)  
* 이외에도 aws region 등 기타 설정들 또한 자유롭게 설정하시면 됩니다.  



# Deploy
서버리스 프레임워크를 통해 Swap 봇을 AWS 상에 배포합니다.
```
npm run deploy:dev
```
```
npm run deploy:prod
```

> 봇을 deploy하기 전 내부 파일시스템에 Liquidity Pool의 정보를 최신화하는 작업을 수행합니다.  
> 따라서 기존의 서버리스에 deploy하는 명령어(serverless deploy)로 deploy 수행 시 liquidity pool이 최신화 되지 않을 수 있습니다.  
> liquidity pool이 추가/변경/삭제되었거나 token 목록을 추가/삭제하는 경우, deploy를 다시 수행해 주시기 바랍니다.  


# Manually Swap
수동으로 swap을 실행합니다.
```
npm run swap:dev
```
```
npm run swap:prod
```

# 보내는 토큰 / 받는 토큰 / 보내는 토큰 양을 지정하여 스왑 함수 실행
* 로컬에서만 작동 가능합니다.  
* singleSwap 함수를 실행하기 전에 반드시 updatePools을 진행해야 합니다. (빌드 시 자동으로 진행됩니다.)
* <from> 토큰 <amount>만큼을 <to>토큰으로 스왑합니다.
```
from=KLEVA to=oUSDT amount=100000000000 npm run singleSwap:dev:local
```
```
from=oUSDT to=KDAI amount=500000 npm run singleSwap:prod:local
```
