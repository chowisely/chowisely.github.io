---
layout:		post
title:		"[Architecture] Virtualization"
date:     2020-10-07 12:00:00 +0930
tags:     [architecture]
series:   Computer Architecture
comments: true
---

메모리 계층 구조에 대해 알아보자.

## Memory Hierarchy
만약 속도가 빠르고, 크기가 크고, 가격이 싼 메모리를 개발할 수 있는 기술이 있다면 메모리 계층 구조(memory hierarchy) 개념이 등장하지 않았을 것이다. 하지만 일반적으로 속도가 빠르면 가격이 비싸지고, 크기가 커지면 속도가 느려지는 메모리의 한계점을 해결하지 못한다. 따라서 메모리를 하나의 계층 구조로 나타낼 수 있는데, 빠른 속도, 싼 가격, 작은 크기를 가질수록 메모리의 상위 계층에 존재한다.

CPU < Cache Memory < Main Memory < Secondary Storage

RAM은 휘발성 메모리로 전원이 꺼지면 저장된 내용이 소실된다. Cache Memory는 SRAM, Main Memory는 DRAM을 사용한다.

ROM은 비휘발성 메모리로 전원이 꺼져도 저장된 내용이 유지된다.

(OS에서 main memory는 RAM과 부트로더가 담긴 ROM으로 이루어져 있다고 배웠기 때문에 혼동됐다. 찾아보니 일반적으로 main memory를 가리킬 때는 ROM을 포함하지 않는다고 한다.)

### Cache Memory
속도가 빠르고, 크기가 크고, 가격이 싼 메모리 있는 illusion을 심어준다. 메모리 접근 패턴에 locality 특성이 있기 때문에 가능하다.

CPU와 메모리 사이에 CPU 캐시가 생기면서 메모리 접근이 줄어듦에 따라 시스템 버스는 I/O 연산에 더 많은 시간을 할애할 수 있다.

#### Cache Hit
찾고자 하는 데이터가 캐시에 존재할 때를 가리킨다.

Hit Ratio: 캐시에서 데이터를 찾은 횟수/전체 데이터 접근 횟수

Hit Time: 캐시에서 데이터를 가져오는 데 걸리는 시간

#### Cache Miss
찾고자 하는 데이터가 캐시에 존재하지 않아 아래 계층에서 가져와야 할 때를 가리킨다.

Miss Ratio: 1 - Hit Ratio

Miss Penalty: 아래 계층에서 데이터를 가져오는 시간 + 캐시에서 기존의 데이터를 가져온 데이터로 교체하는 시간

>🔎 **Average Memory Access Time**
>
>Average Memory Access Time = Hit Time + Miss Penalty * Miss Ratio
