---
layout:		post
title:		"[Compiler Theory] Ambiguous Grammar"
date:			2020-08-22 12:30:00 +0930
tags:			[compiler]
series: 	Compiler Theory
comments:	true
---

모호한 문법에 대해 알아보자.

---

좌단 유도(leftmost derivation) 혹은 우단 유도(rightmost derivation)를 적용했을 때 하나의 문장에 대하여 **두 개 이상의 파스 트리(parse tree)**가 생성될 때 **모호한 문법(ambiguous grammar)**이라고 한다.

모호한 문법으로 파스 트리를 결정적으로 생성하기 위해서는 두가지 방법이 존재한다.

첫 번째는 문법 자체를 모호하지 않은 문법으로 바꾸는 것이다.
두 번째는 문법을 건드리지 않고 파싱 테이블 내에서 모호성을 없애는 것이다. (모호한 문법의 경우 파싱 테이블의 어떠한 엔트리에 두 개 이상의 생성 규칙이 포함되어 있다.) 대표적으로는 most closely nested rule이 있다.

이 글에서는 우선 첫번째 방법에 대해서만 쓰려고 한다.

---

다음 예제를 보자.

![](https://images.velog.io/images/chowisely/post/2065caf9-e39a-4a79-b17b-62b90051ce31/compiler3_1.jpg)

문법 G로 34 - 3 \* 42에 대한 파스 트리 생성하면 두 가지 트리가 만들어진다. 왼쪽의 경우 (34 - 3) \* 42이며 오른쪽의 경우 34 - (3 * 42)이다. 두 결과가 다르다. 연산자의 우선순위를 고려하면 오른쪽의 경우가 올바른 파스 트리이다.

왼쪽의 트리가 만들어진 이유는 문법 G가 연산자 우선 순위를 고려하지 않았기 때문이다. 연산자의 우선순위가 더 높을 경우, 생성 규칙들에서 더 아래에 위치해야 한다.

---

다음은 문법 G를 연산자 우선순위를 고려한 문법 G'으로 바꾸었다.

![](https://images.velog.io/images/chowisely/post/7a0f7f22-31db-4034-b402-bc840505ef9b/compiler3_2.jpg)

연산자 우선 순위를 고려했음에도 불구하고, 문법 G'로 34 - 3 - 42에 대해 두 가지 파스 트리를 생성되며 그 결과 역시 다르다.

일반적으로 left-associativity를 사용하므로 left-associativity를 적용한다면 왼쪽 트리가 우리가 원하는 트리이다. 오른쪽 트리는 right-associativity를 적용했을 때 나온다.

---

left-associativity를 고려하여 문법 G'을 G''으로 바꾸면 다음과 같다.

![](https://images.velog.io/images/chowisely/post/3c365b93-ea6e-4301-a7b4-a0d9b70f456b/compiler3_3.jpg)

이로써 모호한 문법 G를 모호하지 않은 문법 G''으로 바꾸었다.
