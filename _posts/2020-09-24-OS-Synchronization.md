---
layout:		post
title:    "[Operating Systems] Synchronization"
date:     2020-09-24 12:00:00 +0930
tags:     [os]
series:   Operating Systems
comments: true
---

동기화에 대해 알아보자.

**병렬성(parallelism)** 과 **병행성(concurrency)**의 개념을 헷갈려하는 사람들이 꽤 있다. **병렬성**은 멀티코어 프로세서에서 각 코어에 하나의 작업을 실행시켜 특정 시간에 두 개 이상의 작업이 실행되고 있는 것을 말한다. 반면 **병행성**은 *싱글코어를 기준*으로 여러 프로세스들이 매우 짧은 주기로 교체되어 실행되는 것을 말한다. 매우 짧은 시간마다 작업을 번갈아 가며 실행하기 때문에 사용자 입장에서는 여러 작업이 동시에 진행되고 있는 것처럼 보인다. 다시 말하면, 특정 시간에서 병렬성은 두 개 이상의 일, 병행성은 하나의 일을 수행한다.

병행성을 가지는 **병행 프로세스(concurrent process)**는 **독립 프로세스(independent process)**와 **협력 프로세스(cooperating process)**으로 나눌 수 있다. 협력 프로세스는 특정한 목적을 달성하기 위해 다른 프로세스들과 협력한다. 이들은 제한된 컴퓨터 자원의 효율성을 증대하고, 계산 속도를 향상시키지만 자원을 공유하는 데에서 **데이터 불일치(data inconsistency)**를 야기할 수 있다. 따라서 협력 프로세스들이 공유 자원에 접근하는 순서를 조정하는 메커니즘이 필요하다.

---

### Synchronization
**동기화(synchronization)**은 **상호 배제(mutual exclusion)**를 위해 실행을 제어하는 메커니즘을 말한다. 상호 배제란 공유 자원에 접근하는 프로세스는 하나만 허용하고 이외의 모든 접근은 차단하는 것이다. 다음 글에서 설명하겠지만 이로 인해 **교착 상태(deadlock)**와 **기아 상태(starvation)**가 발생할 수 있다.

하드웨어 기반 메커니즘|소프트웨어 기반 메커니즘|
---|---|
Test-and-Set, Compare-and-Swap, Mutex Lock|Dekker's Algorithm, Peterson's Algorithm, Semaphore, Monitor|

---

### Race Condition
**경쟁 상태(race condition)**은 공유 자원을 여러 프로세스가 동시에 접근하고, 이들이 접근하는 순서에 따라 결과가 달라지는 현상이다.

다음은 `counter++`와 `counter--`를 컴퓨터 내부적으로 어떻게 실행하는지 나타낸 코드다.
```c
/* counter++ */
line 1: register1 = counter
line 2: register1 = register1 + 1
line 3: counter = register1

/* counter-- */
line 4: register2 = counter
line 5: register2 = register2 - 1
line 6: counter = register2
```
프로그래머는 counter에 1을 증가시키기 위해 단 하나의 문장만 사용한다. 하지만 내부적으로는 2개 이상의 명령어를 실행하는 꼴이다. 두 개의 프로세스 P1과 P2가 간발의 차로 각각 `counter++`와 `counter--`를 실행하면 어떻게 될까? counter의 초기값을 5라고 하고, P1이 `counter++`를 먼저 실행하는 하나의 시나리오는 다음과 같다.
```c
P1 executes line 1: register1 = 5
P1 executes line 2: register1 = 6
P2 executes line 4: register2 = 5
P2 executes line 5: register2 = 4
P1 executes line 3: counter = 6
P2 executes line 6: counter = 4
```
위 시나리오대로라면 P1은 counter로 6을, P2는 counter로 4를 얻어 다음 실행을 계속할 것이다. 하지만 counter는 동일한 메모리 주소에 저장되어 있는 변수이므로 데이터에 일관성을 유지해야한다.


---

### Critical Section
두 개 이상의 프로세스가 실행 중일 때, 각 프로세스는 **임계 영역(critical solution)**을 가지고 있다. 임계 영역은 코드 상에서 프로세스가 공유 자원을 바꿀 가능성이 있는 부분을 말한다. 동시에 하나의 프로세스만이 임계 영역에 들어갈 수 있다는 보장을 하면, 공유 자원의 데이터 불일치를 해소할 수 있다.

```c
do {
  // entry section
  // critical section
  // exit section
  // remainder section
} while(1);
```
임계 영역의 전과 후에는 entry section과 exit section이 있다. entry section에서 critical section에 들어가기 위한 요청을 하기 때문에 critical section에는 모든 시간에 단 하나의 프로세스만 접근한다는 보장을 할 수 있다.

임계 영역을 구현하기 위한 메커니즘은 **상호 배제(mutual exclusion)**, **진행(progress)**, **유한 대기(bounded waiting)**이 있다.

#### Mutual Exclusion
어떠한 프로세스가 임계 영역에 있다면, 동시에 다른 프로세스들이 임계 영역에 접근할 수 없도록 막는다.

#### Progress
어떠한 프로세스도 임계 영역에 없으며 임계 영역에 들어가고자 하는 프로세스들이 있다면, 어떤 프로세스를 허용할지 유한 시간 내에 결정해야 한다.

#### Bounded Waiting
한 프로세스가 임계 영역에 들어가고자 요청한 후 그 요청이 승인되기 전까지 다른 프로세스들이 임계 영역에 들어갈 수 있는 횟수는 제한되어야 한다. 임계 영역에 들어가고자 무한정 기다리는 상태를 방지하기 위함이다.

---

### Synchronization Mechanism
#### Hardware-Based Mechanism
##### Mutex
뮤텍스(mutex)는 스레드가 획득하고 해제할 수 있는 일종의 잠금 기능이 있는 변수다. 한 스레드가 뮤텍스 m에 대한 acquire()을 호출하면 m에 대한 열쇠를 가지게 된다. 만약 다른 스레드가 뮤텍스 m에 대한 열쇠를 지고 있다면 release()가 호출되기 전까지 기다린다. 바쁜 대기(busy wait)를 요한다.

#### Software-Based Mechanism
##### Semaphore
뮤텍스보다 더 정교하게 프로세스들을 동기화한다. 임계 구역의 상호 배제를 구현하는 것 외에도 프로세스들의 실행 순서를 제어할 수 있다. 세마포는 정수 값을 가지는 변수다.

>🔎 *세마포 연산*
1. S.wait(): 세마포 S의 값을 1 감소시킨다. S >= 0이면 다음 실행으로 넘어가고, S < 0이면 스레드를 대기 큐에 넣고 블락시킨다.
2. S.signal(): 세마포 S의 값을 1 증가시킨다. S > 0이면 다음 실행으로 넘어가고, S <= 0이면 대기 큐에 있는 스레드 하나를 깨운다.

실행 순서를 제어하는 건 아래 예제들을 참고하자.

Example 1) P1의 S1 -> P2의 S2

```c
// semaphore 's' initialized to 0

/* P1 */
// do S1
s.signal()

/* P2 */
s.wait()
// do S2
```

Example 2) deposit과 withdraw를 1회씩 번갈아 실행

```c
// semaphore 'dsem' initialized to 0
// semaphore 'wsem' initialized to 0

/* P1 */
deposit()
wsem.signal()
dsem.wait()

/* P2 */
wsem.wait()
withdraw()
dsem.signal()
```


##### Monitor
동시에 수행 중인 프로세스 사이에서 ADT(abstract data type)의 안전한 공유를 보장하기 위해 상위 레벨에서 동기화를 구현한 것이 **모니터(monitor)**다. 모니터 내부를 몰라도 상호 배제를 쉽게 구현할 수 있다. 모니터를 활용한 예로는 Java의 Thread 라이브러리에 있는 wait(), notify()가 있다.

>🔎 *모니터 특징*
1. 모니터 내에서는 한번에 하나의 프로세스만 활동이 가능하다.
2. 프로세스가 모니터 안에서 기다릴 수 있도록 조건 변수를 사용한다.
3. 조건 변수의 도입으로 하나 이상의 프로세스가 동일한 모니터에 존재할 수 있다. 조건 변수는 현재 그 조건으로 대기 중인 프로세스들의 큐와 연결되어 있다.
4. 조건 변수는 프로시저를 통해서만 접근이 가능하다.
