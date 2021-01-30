---
layout:		post
title:		"[Compiler Theory] Top-Down Parsing"
date:			2020-08-22 13:00:00 +0930
tags:			[compiler]
series: 	Compiler Theory
comments:	true
---

하향식 구문 분석에 대해 알아보자.

---

**하향식 구문 분석(top-down parsing)**는 시작 기호부터 좌단 유도를 적용하면서 문장을 찾는다. 파스 트리는 루트 노드에서 시작해 터미널 노드까지 확장해 나간다. 상향식 구문 분석(bottom-up parsing)에 비해 구현이 간단하지만 **역추적(backtracking)** 문제 때문에 잘 사용되지 않는다.

하향식 구문 분석을 위해서는 문맥 자유 문법(context free grammar)에 존재하는 **좌재귀(left recursion)**을 제거해야 하며, 공통된 접두사를 가진 생성규칙들을 **좌인수분해(left factoring)**해야 한다.

---

일반적으로 하향식 구문 분석은 역추적을 하면서 순서대로 생성 규칙을 적용하기 때문에 시간이 많이 소요된다.

역추적을 하는 파서(parser)는 **Recursive Descent Parser**가 있다. 터미널과 논터미널에 대해 프로시저를 모두 작성하여 재귀적으로 프로시저를 호출하며 구문 분석을 한다. 구현이 쉽다는 장점이 있지만, 역추적 문제를 안고 있으며 생성 규칙을 수정하게 되면 파서의 많은 부분을 바꾸어야 한다.

역추적 문제를 해결하기 위해서는 **결정적으로 구문 분석**을 할 수 있는 방법이 필요하다.

---

### LL Condition
**LL 조건(LL condition)**은 문맥 자유 문법에 어떠한 조건을 붙이며, **First Set**과 **Follow Set**을 사용해 생성 규칙을 선택하여 결정적 구문 분석을 가능하게 한다.

First Set은 어떠한 논터미널로부터 유도되어 처음에 나타날 수 있는 터미널들의 집합이다.

Follow Set은 어떠한 논터미널 뒤에 나타날 수 있는 터미널들의 집합이다.

---

### LL Parser
LL 조건을 만족하는 문법을 LL 문법이라 하고 LL 문법으로 구성한 파서를 **LL 파서(LL Parser)**라고 한다.

LL Parser는 LL 조건과 lookahead를 사용함으로써 결정적인 구문 분석이 가능하다.

LL은 **left to right scanning & leftmost derivation**의 약자로, 입력을 왼쪽에서 오른쪽으로 읽으며 좌단 유도로 좌파스를 생성한다. 또한 LL Parser는 LL(1) Parser라고 하기도 하는데, 1은 lookahead 기호 개수를 나타낸다.

![](https://images.velog.io/images/chowisely/post/7d73a057-ff99-4522-8f67-71d3c9e9bcdc/compiler4_1.jpg)

파서를 만들기 위해서는 문법 G에 대하여 First Set과 Follow Set을 구하고, 문법이 LL 조건에 부합하는지 확인한다. 부합한다면, 파싱 테이블을 구성하고 다음 알고리즘을 따라 주어진 문장에 대해 구문 분석을 진행하면 된다.

---

### LL Parser Algorithm

![](https://images.velog.io/images/chowisely/post/25440a31-e1ab-40ca-a792-98b712031e6f/compiler4_2.png)
