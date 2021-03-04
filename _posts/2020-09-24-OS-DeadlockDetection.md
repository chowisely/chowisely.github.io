---
layout:		post
title:    "[Operating Systems] Deadlock Detection"
date:     2020-09-24 14:00:00 +0930
tags:     [os]
series:   Operating Systems
comments: true
---

교착 상태 탐지에 대해 알아보자.

### Bug Detection Approach

Resource Deadlock|Communication Deadlock|
---|---|
Basic Potential Deadlock Detection Algorithm, GoodLock Algorithm|CHECKMATE

---

### Basic Potential Deadlock Detection
>🔎 *Cyclic Deadlock Monitoring Algorithm*
- 런타임에 프로세스가 lock을 획득하고 해제하는 행동을 관찰한다.
- Lock Graph(N, E) (Directed Graph)
  - 스레드가 lock X를 획득하면 노드 Nx를 생성한다.
  - 스레드가 lock X를 획득한 상태에서 lock Y를 획득하면 (Nx, Ny) 엣지를 생성한다.
  - 스레드가 lock X를 해제하면 노드 Nx와 Nx의 incoming edge와 outcoming edge를 모두 지운다.
 - 런타임에 그래프 내에 사이클이 생기면 교착 상태에 빠졌음을 알린다.

---

### Basic Potential Deadlock Prediction
>🔎 *Potential Cyclic Deadlock Detection Algorithm*
- 런타임에 프로세스가 lock을 획득하고 해제하는 행동을 관찰한다.
- Lock Graph(N, E) (Directed Graph)
  - 스레드가 lock X를 획득하면 노드 Nx를 생성한다.
  - 스레드가 lock X를 획득한 상태에서 lock Y를 획득하면 (Nx, Ny) 엣지를 생성한다.
 - 프로그램 실행이 끝난 후에 그래프에 사이클이 있으면 잠재적인 교착 상태가 있음을 알린다.

위 알고리즘은 소프트웨어 툴로 상용화되어 있지만 3가지 false positive의 경우가 생긴다.

#### False Positive 1: Single Thread Cycle
사이클이 한 스레드가 만든 엣지들로만 이루어져 있을 경우 교착 상태가 아니다.

#### False Positive 2: Gate Lock
```c
/* T1 */
lock(x);
lock(y);
lock(z);
unlock(z);
unlock(y);
unlock(x);

/* T2 */
lock(x);
lock(z);
lock(y);
unlock(y);
unlock(z);
unlock(x);
```

두 스레드가 가장 먼저 lock x를 획득하고 다른 락들을 획득한다. Lock graph를 그리면 lock y와 z에서 사이클이 생기지만 x를 먼저 획득하는 것이 전제 조건이므로 false positive다. lock x를 guard lock 혹은 gate lock이라고 한다.

#### False Positive 3: Thread Segment
![](https://images.velog.io/images/chowisely/post/54fac0fa-7902-4d66-a75b-a713325c9c37/image.png)
메인 스레드를 제외한 런타임에 생기는 모든 스레들은 happened-before relation을 가진다. 위 그림에서 T1의 seg[0]과 T2의 seg[0], T2의 seg[0]과 T3의 seg[0]은 happened-before relation을 가진다. 하지만 T1의 seg[1]과 T3의 seg[0]은 그렇지 않음을 유의하자. 만약 T1의 seg[0]와 T2의 seg[0]에서 생긴 엣지들로 사이클이 이루어졌다면 'T1 happens before T2'이므로 false positive다. T1의 seg[1]과 T3의 seg[0]에서 생긴 엣지들로 사이클이 생기면 true positive다.

---

### GoodLock Algorithm
Basic Potential Deadlock Detection에서 false positive 세 가지 경우를 추가로 고려해 만든 알고리즘이다.

>🔎 *A cycle is valid only when every pair of edges(m11, (s11, t2, G1, s12), m12) and (m21, (s21, t2, G2, s22), m22) in the cycle satisfies:*
1. t1 != t2
2. G1 ∩ G2 = ∅
3. ¬(s12 -> s21) (s1과 s2가 happened-before relation이 아닐 때)

---

#### Deadlock Detection 구현👇🏻
[Github 코드](https://github.com/chowisely/2019-1-OperatingSystem/blob/master/Deadlock/ddetector.c)

운영체제 수업 들을 당시 deadlock detector와 predictor를 구현하는 게 과제였다. 학기 말이었던지라 매우 지쳐있었는데 엄청나게 고민하고 몇번 엎으면서 짰던 기억이 있다. 과제 3개 중에 쉬운 편이라고 하셨는데 저는 제일 어려웠어요 교수님...🤨 아무튼 생각했던 것보다 점수를 너무 잘 받아서 detector 코드만 올려두었다. (predictor는 guard lock을 구현하지 못했다.)
