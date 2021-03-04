---
layout:		post
title:    "[Operating Systems] Deadlock & Starvation"
date:     2020-09-24 13:00:00 +0930
tags:     [os]
series:   Operating Systems
comments: true
---

교착 상태와 기아 상태에 대해 알아보자.

### Deadlock
**두 개 이상의 프로세스들이 결코 일어나지 않을 사건을 기다리는 상태**를 교착 상태(deadlock)이라고 한다. 예를 들어, 프로세스 P1이 자원 A를 가지고 자원 B를 기다리며 프로세스 P2는 자원 B를 가지고 자원 A를 기다리는 경우가 있을 수 있다.

>🔎 *교착 상태가 되기 위한 필요 조건*
1. 상호 배제: 한 번에 프로세스 하나만 해당 자원을 사용할 수 있다.
2. 점유와 대기: 하나 이상의 자원을 가진 프로세스가 존재하고 다른 프로세스는 그 자원을 기다리고 있는 상태다.
3. 비선점: 프로세스에 의해 점유된 자원은 강제로 뺏을 수 없다.
4. 환형 대기: 공유 자원과 공유 자원을 사용하기 위해 대기하는 프로세스들이 원형으로 구성되어 있다.
1~3번이 만족하면 교착 상태가 발생할 수 있다.

교착 상태를 해결하는 방법으로는 예방, 회피, 탐지 및 회복이 있다.

#### 예방
교착 상태의 네 가지 조건이 하나라도 발생하지 않도록 한다.
1. 상호 배제 방지: 하나의 공유 자원을 동시에 여러 프로세스가 사용할 수 있도록 한다.
2. 점유와 대기 방지: 필요한 자원을 한꺼번에 요청하고 획득해야 한다.
3. 비선점 방지: 이미 할당된 자원에 대한 선점권이 없어야 한다. 즉시 할당할 수 없는 자원을 요청하면, 현재 점유한 자원들이 선점된다.
4. 환형 대기 방지: 모든 자원에 일련의 순서를 부여하고 프로세스가 자원을 오름차순으로만 요청하도록 허용한다.

#### 회피
E,J,Dijkstra가 제안한 방법으로, 은행에서 모든 고객의 요구가 충족되도록 현금을 할당하는 데서 유래한 기법이다.
프로세스가 자원을 요구할 때 시스템은 자원을 할당한 후에도 안정 상태로 남아있게 되는지를 사전에 검사하여 교착 상태를 회피하는 기법
안정 상태에 있으면 자원을 할당하고, 그렇지 않으면 다른 프로세스들이 자원을 해지할 때까지 대기함
출처: https://includestdio.tistory.com/12 [includestdio]

---

### Starvation
교착 상태가 자원을 자유롭게 할당한 자원 부족의 결과라면, 기아 상태(starvation)은 자원 적절히 할당하는 데서 소외될 때 발생하는 문제이다. **특정 프로세스가 자원을 할당받지 못하면 끝없이 기다리는 상태**에 빠져 작업을 진행하지 못한다.

---

### Classical Problems of Synchronization
동기화로 인해 발생하는 대표적인 문제들이 있다.

#### Producer and Consumer Problem(Bounded-Buffer Problem)
아이템을 담을 수 있는 길이가 N인 순환형 배열의 버퍼가 있고, 생산자와 소비자는 이 버퍼를 공유한다. 생산자는 버퍼에 아이템을 채우고 소비자는 아이템을 소비한다. 생산과 소비는 **비동기적**으로 이루어지고 대부분의 경우 버퍼는 유한하다.

```c
/* Producer */
item nextProduced;
while(1) {
  while(counter == BUFFER_SIZE);
  buffer[in] = nextProduced;
  in = (in + 1) % BUFFER_SIZE;
  counter++;
}

/* Consumer */
item nextConsumed;
while(1) {
  while(counter == 0);
  nextConsumed = buffer[out];
  out = (out + 1) % BUFFER_SIZE;
  counter--;
}
```

위의 코드는 생산자와 소비자가 counter라는 동일한 변수를 변경하는 부분이 있고 임계 영역에 대한 구현이 없다. `counter++`, `counter--`를 실행하면 경쟁 상태에 빠져 데이터 불일치가 생길 수 있다고 조금 전에 언급했다. 이 코드에 임계 영역을 구현하면 다음과 같다.

```c
// semaphore 'mutex' initialized to 1

/* Producer */
item nextProduced;
while(1) {
  while(counter == BUFFER_SIZE);
  mutex.wait();
  buffer[in] = nextProduced;
  in = (in + 1) % BUFFER_SIZE;
  counter++;
  mutex.signal();
}

/* Consumer */
item nextConsumed;
while(1) {
  while(counter == 0);
  mutex.wait();
  nextConsumed = buffer[out];
  out = (out + 1) % BUFFER_SIZE;
  counter--;
  mutex.signal();
}
```

세마포 mutex를 사용해서 counter를 읽고 변경하는 부분에 임계 영역을 걸어두었다. 하지만 여전히 조금 아쉬운 부분이 있다. 생산자와 소비자가 바쁜 대기를 하면서 CPU 이용률을 떨어트릴 수 있다. 세마포를 추가해서 바쁜 대기를 해결하는 코드는 다음과 같다.

```c
// semaphore 'mutex' initialized to 1
// semaphore 'full' initialized to 0
// semaphore 'empty' initialized to BUFFER_SIZE

/* Producer */
do {
  // produce an item
  empty.wait();
  mutex.wait();
  // add to the buffer
  mutex.signal();
  full.signal();
} while(true);

/* Consumer */
do{
  full.wait();
  mutex.wait();
  // remove an item from buffer
  mutex.signal();
  empty.signal();
  // consume the item
} while(true);
```

#### Readers and Writers Problem
공유 자원을 가지고 무엇을 하느냐에 따라 프로세스의 유형이 나뉜다. 공유 자원을 읽기만 하는 경우에는 여러 프로세스들의 동시 접근을 허용한다. 하지만 읽기와 쓰기를 동시에 하는 경우 하나의 프로세스만 공유 자원에 접근하도록 해야 한다.

#### Dining-Philosophers Problem
![](https://images.velog.io/images/chowisely/post/0b45be3b-e80e-4038-b624-12e603e2210a/image.png)
원형 탁자에 철학자들이 N명 둘러앉아 있다. 각 철학자들의 왼쪽과 오른쪽에 젓가락이 하나씩 놓여 있고, 자기 앞에 놓인 왼쪽과 오른쪽 젓가락 두 개를 잡면 식사를 할 수 있다. 식사를 마치면 젓가락을 놓는다. 왼쪽 젓가락을 잡은 후에만 오른쪽을 잡을 수 있다. 다음 코드를 보자.

```c
do {
  lstick.wait()
  rstick.wait()
  eating()
  lstick.signal()
  rstick.signal()
  thinking()
} while(1);
```

임의의 철학자들이 젓가락을 잡는 시간은 랜덤이다. 만약 모든 철학자들이 자신에게 주어진 왼쪽 젓가락을 동시에 잡는다면 어떻게 될까? 탁자에 놓인 모든 젓가락은 이미 어떤 철학자에 의해 소유된 상태가 될 것이다. 하지만 모든 철학자들은 왼쪽 젓가락만 잡은 상태이므로 누군가가 잡고 있는 오른쪽 젓가락을 기다리게 된다. 이게 바로 교착 상태의 예다.

>🔎 *Dining-Philosophers Problem을 해결할 수 있는 방법들*
1. 홀수 번호 의자에 앉은 철학자들은 왼쪽 젓가락 먼저, 짝수 번호에 앉은 철학자들은 오른쪽 젓가락 먼저 들면 된다.
2. N명이 앉을 수 있는 탁자에 최대 N-1명 까지만 앉을 수 있도록 한다.
3. 모든 철학자는 양쪽 젓가락이 비선점된 상태일 때만 두 젓가락을 점유하도록 한다.
