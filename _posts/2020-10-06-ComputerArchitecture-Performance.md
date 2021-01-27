---
layout:		post
title:		"[Architecture] Performance"
date:     2020-10-06 12:00:00 +0930
tags:     [architecture]
series:   Computer Architecture
comments: true
---

컴퓨터 아키텍쳐의 성능에 영향을 미치는 요인들을 파악하자.

---

### Performance

#### Time
wall-clock time, response time, elapsed time, CPU time

##### CPU Time
CPU Time = CPU time spent for a given program

= Cycles/Program (=Clock Cycles) * Seconds/Cycle (=Clock Cycle Time)

= Instructions/Programs (=IC) * Cycles Instruction (=CPI) * Seconds/Cycle

| -            | IC   | CPI  | Clock Cycle Time |      |
| ------------ | ---- | ---- | ---------------- | ---- |
| Program      | ✔️    |      |                  |      |
| Compiler     | ✔️    |      |                  |      |
| ISA          | ✔️    | ✔️    |                  |      |
| Organization |      | ✔️    | ✔️                |      |
| Technology   |      |      | ✔️                |      |

##### RISC(Reduced Instruction Set Computer) vs. CISC(Complexed Instruction Set Computer)
똑같은 프로그램이더라도 한 instruction 당 하는 일의 크기(?)가 다르기 때문에 RISC보다 CISC의 IC가 더 적다. (IC: RISC > CISC)

똑같은 프로그램이더라도 간단한 instruction은 빨리 끝나므로 RISC보다 CISC의 CPI가 더 크다. (CPI: RISC < CISC)

좋은 organization, design technology를 써서 CPI와 clock cycle time을 줄이는 게 목표!



캐시 메모리가 나오기 이전으로 돌아가면, CPU와 메모리의 속도 차이 때문에 CPU의 유휴 상태가 길었다. 따라서 메모리에서 하나의 instruction을 가져와 많은 일을 처리하는 것이 이득이었고, 그에 따라 CISC가 한 시대를 풍미했다. 하지만 캐시 메모리가 나오자 CPU와 메모리 사이의 간극이 메워졌다. 그러다 보니 한 instruction이 한번에 많은 일을 처리하는 것보다 간단한 일을 처리하는 instruction 여러 개를 pipelining시키는 RISC가 더 효과적이게 됐다.

>  **RISC의 성능이 더 좋은데 왜 CISC를 사용하는 x86을 아직 쓸까?**
>  x86은 겉으로는 CISC이지만 내부적으로 CISC를 RISC로 변환한 후 실행한다. CISC의 시장이 이미 커져버려서 성능을 얻고자 RISC로 바꾸면 이전에 사용했던 것들(?)을 그대로 가져다 쓸 수 없다.

컴퓨터의 경우에는 x86을 쓰지만 휴대폰, 임베디드 시스템 등에서는 RISC인 ARM architecutre를 쓴다. ARM은 특히 저전력을 사용하도록 설계되어 전력의 소모량이 중요한 곳에 쓰인다.

#### Throughput

-


---

### ISA(Instruction Set Architecture)
#### ADT(Abstract Data Type)
ADT는 data와 그에 대한 operation으로 이루어져 있다. ISA 또한 ADT로 나타낼 수 있는데 data의 경우에는 register, memory이며 operation의 경우에는 instruction이 된다. data는 state라고도 하는데 data를 다루는 instruction을 수행하고 나면 내부의 상태가 변화한다는 의미다.
