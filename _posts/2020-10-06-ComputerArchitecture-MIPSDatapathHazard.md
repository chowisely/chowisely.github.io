---
layout:		post
title:		"[Architecture] MIPS & Datapath & Hazard"
date:     2020-10-06 12:30:00 +0930
tags:     [architecture]
series:   Computer Architecture
comments: true
---

몇 가지의 datapath와 그에 관련한 hazard를 알아보자.

## Procedure Calling

프로시저를 부르는 곳을 caller, 호출되는 프로시저를 callee라고 한다. caller와 callee 모두 같은 레지스터를 사용하기 때문에 서로의 레지스터 값을 보호하기 위해 두 가지 방법이 사용된다.

### Caller Save vs. Callee Save

Caller Save: 나중에 사용될 레지스터들(live register)만 따로 저장한 후에 callee를 호출한다.

Callee Save: 프로시저를 실행하며 변경할 레지스터들만 따로 저장한다.

return address(\$ra), argument(\$a0~\$a3), return value(\$v0~\$v1)는 반드시 caller가 저장해야 한다.

MIPS는 caller save 방식을 채택한다.

---

## Datapath

### Sequential Implementation

### Single-Cycle Implementation

critical path에 따라 성능이 결정되고 한 cycle에서 하나의 resource를 여러 용도로 사용할 수 없는 한계점이 있다.
### Multi-Cycle Implementation

### Pipelined(Overlapped) Implementation

>🔎**Break up the instructions into steps**
>
>* Balance the amount of work to be done
>* Restrict each cycle to use only one major functional unit


각 instruction을 완료하는 시간은 그대로다. 하지만 한 cycle이 끝날 때마다 한 instruction이 끝나면서 throughput이 증가하게 된다. (CPI=1)

### Control Signal

Multiplexor, ALU operation, Read/Write를 나타내는 세 종류가 있다.

---

## Hazard

Pipelined implementation에서 다음 cycle에서 뒤따라오는 instruction이 어떠한 이유로 실행되지 못하는 현상을 가리킨다.

### Structural Hazard

서로 다른 instruction이 동일한 cycle에 동일한 resource를 요구하는 경우다. 메모리와 레지스터 파일을 한 사이클에서 읽기와 쓰기를 동시에 할 수 없다.
>🔎 **Solution**
>
>1. Resource duplication: 메모리는 instruction과 data용을 따로 둔다.
>2. Time-Multiplexed: 한 cycle을 두 subcycle로 나누어 각각 읽기와 쓰기로 사용한다.
>3. Multi-Port register: 한 cycle에 두 개의 레지스터를 읽고 한 개의 레지스터를 쓰는 작업을 동시에 한다.


### Data Hazard

```
ADD $1, $2, $3
SUB $4, $1, $5
```
첫번째 instruction의 결과 는 WB 단계에 레지스터 파일의 $1에 쓰인다. 두번째 instruction은 ID 단계에서 $1을 읽는다. 하지만 현재 구현으로는 두번째 instruction은 첫번째 instruction이 WB 단계를 끝내기 전에 $1을 읽게 되어있다. 어떻게 해야 데이터의 correctness를 지킬 수 있을까?
>🔎 **Solution**
>
>1. Stall: 하드웨어적으로 새로운 instruction을 시작하지 말고 리소스를 사용할 수 있을 때까지 기다린다.
>2. Forwarding: 두 가지 경우가 있다. 1) ALU 연산의 결과를 다음 instruction에서 사용할 때, WB 단계에서 레지스터 파일에 쓸 때까지 기다리지 않고 **EX 단계**의 결과를 끌어다 사용한다. Stall이 필요없다. 2) lw 결과를 다음 instruction에서 사용할 때, WB 단계에서 레지스터 파일에 쓸 때까지 기다리지 않고 **MEM 단계**의 결과에서 끌어다 사용한다. Stall 1이 필요하다. 이를 **load-use hazard**라고 한다.
>3. 컴파일러 스케쥴링: 컴파일러가 register의 의존성을 고려해 instruction의 순서를 재배치한다.
>4. NOP: 소프트웨어적으로는 컴파일러가 register의 의존성을 검사해서 nop를 추가하고, 하드웨어적으로는 nop를 만나면 파이프라인을 메꾼다.


### Branch(Control) Hazard

Branch instruction에서 비교 연산의 결과에 따라 다음 PC 값을 계산한다. 비교 연산은 EX 단계에 수행되고, 주소 계산은 MEM 단계에서 수행된다. 따라서 WB 단계가 되어야만 다음 instruction이 무엇이 될지 알 수 있다.

>🔎 **Solution**
>
>1. Stall: MEM 단계에서 주소가 결정될 때까지 **stall 3**를 실행한다.
>2. Optimized Branch Processing: 비교 연산과 주소 계산을 MEM 단계에서 ID 단계로 옮긴다. PC+4가 branch address로 바뀌어야 할 경우 ID/MEM에서 IF.Flush를 설정한다. **Stall을 3에서 1**로 줄이는 효과가 있다. 추가적인 하드웨어와 forwarding이 필요하다.
>3. Branch Prediction: 예측에 실패하면 **stall 1**으로 flush한다. 항상 not-taken을 선택하는 static한 방법과 런타임 시 branch 패턴으로 결정하는 dynamic 방법이 있다.
>4. Delayed Branch: branch instruction 뒤에는 어느 조건에서도 실행되는 instruction을 실행한다.


### Stall

하드웨어적으로 모든 control signal을 0으로 만들어 nop를 실행한다.

---

## Forwarding

>🔎 **Data Dependency가 생기는 경우**
>
>1a. EX/MEM.RegisterRd == ID/EX.RegisterRs
>
>1b. EX/MEM.RegisterRd == ID/EX.RegisterRt
>
>2a. MEM/WB.RegisterRd == ID/EX.RegisterRs
>
>2b. MEM/WB.RegisterRd == ID/EX.RegisterRt



### EX Hazard

if(EX/MEM.RegWrite and (EX/MEM.RegistedRd != 0) and (1a or 1b))

### MEM Hazard

if(MEM/WB.RegWrite and (MEM/WB.RegistedRd != 0) and (1a or 1b))

```
ADD $1, $1, $2
ADD $1, $1, $3
ADD $1, $1, $4
```
첫번째 instruction의 $1를 세번째 instruction의 $1에 forwarding하면 두번째 instruction에서 $1을 업데이트하기 때문에 최신값이 아니다. 이를 double data hazard라고 하며 위의 조건을 다음과 같이 수정해야 한다.

if(MEM/WB.RegWrite and (MEM/WB.RegistedRd != 0) and (1a or 1b) **and not EX Hazard**)

---

## Concurrent Execution

여러 instruction들을 concurrent execution(out-of-order execution)으로 실행하기 위해서는 조건이 있다. 이 조건들을 나타내기 위해 어떠한 instruction I에 대해서 읽기 레지스터의 집합을 R, 쓰기 레지스터의 집합을 W라고 하자.

### Example

#### Example 1

instruction I0, I1는 다음과 같다.
```
I0: ADD $1, $2, $3
I1: SUB $4, $1, $5
```
I0이 업데이트하는 $1을 I1이 읽어서 사용한다. 둘 사이에 dependency가 존재하기 때문에 I1이 먼저 실행될 수 없다.

R(I0) = {$2, $3}, W(I0) = {$1}, R(I1) = {$1, $5}, W(I1) = {$4}

W(I0)과 R(I1)의 교집합이 존재한다.

또다른 instruction I0, I1는 다음과 같다.
```
I0: ADD $1, $2, $3
I1: SUB $2, $4, $5
```
I1가 먼저 실행될 경우 업데이트된 $1의 값을 I0이 사용하게 되므로 둘 사이에 dependency가 존재한다. 따라서 I1이 먼저 실행될 수 없다.

R(I0) = {$2, $3}, W(I0) = {$1}, R(I1) = {$4, $5}, W(I1) = {$2}

R(I0)과 W(I1)의 교집합이 존재한다.

#### Example 2

```
I0: SW $1, 24($3)
I1: LW $4, 16($2)
```
M24($3)과 M16($2)의 주소가 일치한다면 dependency가 존재하기 때문에 I1이 먼저 실행될 수 없다.

#### Example 3

instruction I0, I1는 다음과 같다.
```
I0: ADD $1, $2, $3
I1: SUB $1, $4, $5
```
R(I0) = {$2, $3}, W(I0) = {$1}, R(I1) = {$4, $5}, W(I1) = {$1}

sequential execution으로 실행을 마치면, I1에서 계산한 값이 $1에 저장되어야 한다. 하지만 I0이 나중에 실행되면 $1에 값이 덮어씌워진다.

W(I0)과 W(I1)의 교집합이 존재한다.



>🔎 **Concurrent Execution이 가능한 경우**
>
>instruction Ii, Ij가 있다면, (R(Ii) ∩ W(Ij)) ∪ (R(Ij) ∩ W(Ii)) ∪ (M(Ii) ∩ M(Ij)) == ∅을 만족해야 한다.
