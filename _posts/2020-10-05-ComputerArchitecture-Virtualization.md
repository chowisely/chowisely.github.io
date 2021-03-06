---
layout:		post
title:		"[Architecture] Virtualization"
date:     2020-10-05 12:00:00 +0930
tags:     [architecture]
series:   Computer Architecture
comments: true
---

"반도체 칩에 들어가는 트랜지스터의 수는 시간의 흐름에 따라 지수적으로 증가했다. 하지만 CPU에서는 performance, DRAM에서는 capacity를 높이는 용도로 서로의 지향점이 달랐다. 이는 결국 CPU와 DRAM의 속도 차이를 야기했고, 이 간격을 메우기 위해 캐시가 등장했다."

"트랜지스터가 작아짐에 따라 reliability가 떨어진다. 그에 따라 CPU, 메모리, 스토리지가 완벽하게 동작한다고 할 수 없다. 앞으로의 challenge는 이 reliability를 올리는 것이 될 것이다."

---

## Virtualization

하나의 physical CPU로 여러 logical CPU를 가지는 것처럼 일종의 illusion을 만드는 것이 virtualization이다. 메모리에 여러 프로세스를 올리고, 각 프로세스마다 PC를 둔다. 프로세서는 이들의 PC를 번갈아 가며 실행한다.

### Example

#### Virtual Machine

#### Cache Memory

SRAM의 속도, DRAM의 용량을 합친 메모리가 있다는 illusion을 심어준다. 프로세서의 메모리 접근에 패턴이 있기 때문에 cache memory를 사용할 수 있다. 이 패턴을 locality라고 부르며 spatial locality와 temporal locality 두 가지 종류가 있다.

#### Interrupt vs. Exception

##### 공통점
OS가 control을 뺏어가서 처리한다.

##### 차이점
exception은 진행 중인 프로세스가 유발한 동기적 이벤트. ex) page fault

interrupt는 진행 중인 프로세스가 아닌 외부에서 발생한 비동기적 이벤트. ex) timer, interrupt, disk I/O