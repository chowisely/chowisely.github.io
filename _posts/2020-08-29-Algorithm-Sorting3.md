---
layout:		post
title:		"[Algorithm] Sorting - Time Complexity O(N)"
date:			2020-08-29 13:00:00 +0930
tags:			[algorithm, sort]
series: 	Algorithm
comments:	true
---

시간 복잡도가 O(N)인 정렬 알고리즘을 하나를 알아보자.

### Counting Sort

특이하게도 counting sort는 정렬 알고리즘이지만 비교 연산을 하지 않는다. 이름처럼 해당 숫자를 '카운팅'할 뿐이다. 정렬하고자 하는 숫자들의 범위가 주어져야 하는 것이 조건이다.

\[3,2,2,1,4,1\] (4 이하의 음이 아닌 정수들이라는 조건이 미리 주어진다.)
각 숫자의 값들을 인덱스라고 하고, 해당하는 인덱스에 위치하는 값을 각 숫자가 나타난 횟수라고 한다면 \[0,2,2,1,1\]로 나타낼 수 있다. 이 배열은 결국 \[1,1,2,2,3,4\]로 정렬한 것과 같아진다.

카운팅하기 위해서는 배열의 길이만큼 한번만 훑으면 되므로 시간 복잡도는 O(N)이 된다.

```c
#include <stdio.h>

int main() {
	int range = 6;
	int arr[10] = {5,5,3,2,1,4,3,2,0,1};
	int counting[6] = {0,};

	for(int i = 0; i < 10; i++) {
		counting[arr[i]] += 1;
	}

	for(int i = 0; i < range; i++) {
		for(int j = 0; j < counting[i]; j++) {
			printf("%d ", i);
		}
	}
}
```
