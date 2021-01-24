---
layout:		post
title:		"[Algorithm] Sorting - Time Complexity O(NlogN)"
date:		2020-08-29 12:30:00 +0930
tags:		[algorithm, sort]
comments: 	true
---

지난 글에 이어서 이번 글은 시간 복잡도가 O(NlogN)인 알고리즘을 정리해보았다.

---

### Quick Sort
Quick sort가 시간 복잡도를 NlogN으로 줄일 수 있는 이유는 Divide and Conquer 접근법을 이용했기 때문이다. (Divide and Conquer 접근법이란 큰 문제를 여러 하위 문제로 쪼개고, 각 문제의 솔루션들을 구해서 하나의 솔루션으로 합치는 것이다. 그리고 합친 솔루션은 결국 본래의 문제를 해결하게 된다. 하지만 아무런 기준 없이 하위 문제로 쪼개어서는 안되고 하위 문제는 본래 문제에서 사이즈만 줄어든 축소판 형식이어야 한다.)

Divide and Conquer를 정렬 문제에 적용하면 긴 배열을 정렬해야 하는 문제를 작은 배열들로 나누고 그것들을 정렬하여 합치면 된다. 작은 배열로 나누는 기준은 pivot을 정하고 pivot의 왼쪽에는 pivot보다 작은 값들이, pivot의 오른쪽에는 pivot의 큰 값들이 오도록 만들어 준다. 그리고 다시 pivot의 왼쪽과 오른쪽 그룹에서 각각 pivot 하나를 선택해 동일하게 처리한다.

![](https://images.velog.io/images/chowisely/post/a167ba3a-4615-4719-9e77-1d7d7a893418/image.png)

pivot을 어떤 기준으로 선택하느냐에 따라 성능이 달라질 수 있다. pivot을 가장 작은 혹은 가장 큰 값으로 고를 경우 partitioning을 해야하는 횟수가 그만큼 많아지기 때문이다. 따라서 최악의 경우에는 시간 복잡도가 O(N^2)가 되지만 평균적인 경우에는 O(NlogN)이다.

```c
#include <stdio.h>

void quickSort(int *arr, int start, int end) {
	if(start >= end)
		return;

	int pivot = start;
	int left = start + 1, right = end;
	int tmp;

	while(left <= right) {
		while(left <= end && arr[pivot] > arr[left]) {
			left++;
		}
		while(right >= start + 1 && arr[pivot] < arr[right]) {
			right--;
		}
		if(left < right) {
			tmp = arr[left];
			arr[left] = arr[right];
			arr[right] = tmp;
		}
		else {
			tmp = arr[right];
			arr[right] = arr[pivot];
			arr[pivot] = tmp;
		}
	}

	quickSort(arr, start, right - 1);
	quickSort(arr, right + 1, end);
}

int main() {
	int arr[10] = {1,10,5,8,7,6,4,3,2,9};

	quickSort(arr, 0, sizeof(arr) / sizeof(int) - 1);

	for(int i = 0; i < 4; i++) {
		printf("%d ", arr[i]);
	}
}
```

---

### Merge Sort
Quick Sort와 마찬가지로 Divide and Conquer 접근법을 이용해서 시간 복잡도를 줄인 알고리즘이다. 그러나 최악의 경우에도 O(NlogN)을 보장한다는 데서 차이가 있다.

어떻게 보장할 수 있는 것일까? Quick Sort는 pivot에 따라 partitioning의 수가 달라지지만, Merge Sort는 정확하게 절반의 지점에서 두 그룹으로 나누어 정렬하고 합치는 것이다. 또한 Quick Sort는 pivot을 기준으로 왼쪽에는 pivot보다 작은 값이, 오른쪽에는 pivot보다 큰 값이 오도록 만들어서 재귀적으로 정렬한다. 하지만 Merge Sort는 n/2 길이의 배열 두개를 n 길이의 배열에 정렬하는 것이다. 그리고 작은 배열의 경우 이미 정렬이 되어있다고 가정하기 때문에 이를 합치는 데 걸리는 시간은 O(n)이다. 'in place'에서 정렬을 하는 것이 아니기 때문에 정렬하려는 배열의 크기와 같은 추가적인 배열이 필요하다는 것이 단점으로 꼽힌다.

![](https://images.velog.io/images/chowisely/post/253f4703-ca5f-44fd-9f42-0a56185ebad3/image.png)

```c
#include <stdio.h>

int sorted[10] = {0,};

void merge(int *arr, int start, int mid, int end) {
	int i = start, j = mid + 1;
	int idx = start;

	while(i <= mid && j <= end) {
		if(arr[i] < arr[j]) {
			sorted[idx++] = arr[i];
			i++;
		}
		else {
			sorted[idx++] = arr[j];
			j++;
		}
	}

	for(int t = i; t <= mid; t++) {
		sorted[idx++] = arr[t];
	}

	for(int t = j; t <= end; t++) {
		sorted[idx++] = arr[t];
	}

	for(int t = start; t <= end; t++) {
		arr[t] = sorted[t];
	}
}

void mergeSort(int *arr, int start, int end) {
	if(start < end) {
		int mid = (start + end) / 2;
		mergeSort(arr, start, mid);
		mergeSort(arr, mid + 1, end);
		merge(arr, start, mid, end);
	}
}

int main() {
	int arr[10] = {1,10,5,8,7,6,4,3,2,9};

	mergeSort(arr, 0, sizeof(arr) / sizeof(int) - 1);

	for(int  i = 0; i < 10; i++) {
		printf("%d ", arr[i]);
	}
}
```

---

### Heap Sort
이전 정렬 알고리즘과는 다르게 완전 이진 트리를 사용해서 정렬을 수행한다. 우선 정렬하고자 하는 배열을 최대 힙으로 만들기 위해 heapify 연산을 해준다. 그러면 가장 큰 값이 트리의 루트에 오게 될 것이다. 다음은 우선 순위 큐의 delete 연산과 아주 비슷하다. 루트에 있는 가장 큰 값을 가장 작은 말단 노드와 바꿔 준다. 그러면 루트 노드를 제외하고 루트 노드의 왼쪽 서브트리와 오른쪽 서브트리는 heap을 이루는 상태다. 따라서 루트 노드에서 heapify 연산을 해주면 전체 트리가 heap 성질을 만족하게 된다. (가장 큰 값이 이동한 위치의 노드를 제외하고) 연산 후에 그 다음으로 큰 값이 루트에 위치한다.



> 🔎 **heapify**란?
>
> 해당 노드와 그 밑에 있는 트리들이 heap을 이루도록 만드는 연산



heap을 구성할 때 중간 지점부터 루트까지 차례대로 heapify를 하는 이유는, 항상 중간 노드부터 자식이 존재하기 때문이다.

```c
#include <stdio.h>

void heapify(int *arr, int len, int parent) {
	if(len == parent) {
		return;
	}

	int tmp;
	int child = parent * 2;

	if(child + 1 <= len && arr[child] < arr[child + 1]) {
		child++;
	}

	if(arr[parent] < arr[child]) {
		tmp = arr[parent];
		arr[parent] = arr[child];
		arr[child] = tmp;
	}

	if(child * 2 <= len) {
		heapify(arr, len, child);
	}
}

int main() {
	int len = 10;
	int arr[11] = {-1, 1,10,5,8,7,6,4,3,2,9};

	// max heap
	for(int i = len / 2; i > 0; i--) {
		heapify(arr, len, i);
	}

	// sort
	int parent, child, tmp;
	for(int i = len; i > 1; i--) {
		tmp = arr[1];
		arr[1] = arr[i];
		arr[i] = tmp;

		heapify(arr, i - 1, 1);
	}

	for(int i = 1; i <= len; i++) {
		printf("%d ", arr[i]);
	}
}
```