---
layout:		post
title:		"[Algorithm] Sorting - Shortest Path"
date:		2020-08-29 13:30:00 +0930
tags:		[algorithm, sort]
comments:	true
---

이 글에서 다룰 최단 거리를 구하는 알고리즘은 두 가지 종류로 나눌 수 있다.

>1. Single Source Shortest Path: 모든 정점의 집합을 V라고 했을 때, 주어진 정점 s ∈ V에 대하여 모든 정점 t ∈ V로 가는 거리를 구한다.
2. All Pairs Shortest Path: 모든 정점 s ∈ V에 대하여 모든 정점 t ∈ V로 가는 거리를 구한다.

1번의 경우 대표적으로는 **Dijkstra, Bellman-Ford Algorithm**이 있으며,
2번의 경우에는 **Floyd-Warshall Algorithm**이 있다.

밑에서 다룰 알고리즘들은 모두 **Dynamic Programming** 기법을 사용한다. s ∈ V부터 t ∈ V까지 가는 최소 거리를 구하기 위해서 s ∈ V부터 k ∈ V까지 가는 이미 계산되어 있는 최소 거리를 이용하기 때문이다.

---

### Dijkstra
우선 순위 큐에 모든 정점을 넣고, 큐에서 제일 작은 값을 가진 정점을 꺼내어 그와 연결된 간선들에 대해서 relaxation을 해주는 방식이다. (이때, 값이란 주어진 정점으로부터 그 정점까지 가는 최단 거리이다.) 큐에서 항상 그 시점에서 제일 작은 값을 꺼내기 때문에 Greedy 기법을 사용했다고 할 수 있다.

주의할 점은 모든 간선들의 가중치는 0 이상의 정수여야 한다는 거다. 만약, 음의 가중치가 포함되어 있을 경우 이에 대처하지 못하고 무한 루프에 빠지게 된다. 하지만 현실 세계에서는 음의 가중치로 나타내야 하는 일이 없는 편이다보니 자주 쓰인다.

다음 코드는 Single Source Shortest Path를 구하는 알고리즘이지만 All Pairs Shortest Path를 구하도록 만들었다.

```cpp
#include <iostream>
#include <queue>
#include <functional>

#define INF 999

using namespace std;

int dist[5][5] = {
	{0, 2, 3, 4, INF},
	{2, 0, 5, 1, 7},
	{3, 5, 0, INF, 1},
	{4, 1, INF, 0, 3},
	{INF, 7, 1, 3, 0}
};

int path[5][5] = {
	{0, INF, INF, INF, INF},
	{INF, 0, INF, INF, INF},
	{INF, INF, 0, INF, INF},
	{INF, INF, INF, 0, INF},
	{INF, INF, INF, INF, 0}
};

int parent[5][5] = {
	{0, -1, -1, -1, -1},
	{-1, 0, -1, -1, -1},
	{-1, -1, 0, -1, -1},
	{-1, -1, -1, 0, -1},
	{-1, -1, -1, -1, 0}
};

bool visited[5] = {false,};

typedef struct node {
	int nodenum;
	int dist;
	node(int n, int d): nodenum(n), dist(d) {}
} node;

struct cmp {
    bool operator()(node n, node m){
        return n.dist > m.dist;
    }
};

void init() {
	for(int i = 0; i < 5; i++) {
		visited[i] = false;
	}
}

void find_path(int src) {
	priority_queue<node, vector<node>, cmp > q;

	init();
	q.push(node(src, 0));

	while(!q.empty()) {
		int x = q.top().nodenum;
		q.pop();
		visited[x] = true;

		for(int i = 0; i < 5; i++) {
			if(!visited[i]) {
				if(path[src][i] > path[src][x] + dist[x][i]) {
					path[src][i] = path[src][x] + dist[x][i];
					parent[src][i] = x;
					q.push(node(i, path[src][i]));
				}
			}
		}
	}
}

int main() {
	for(int i = 0; i < 5; i++) {
		find_path(i);
	}

	for(int i = 0; i < 5; i++) {
		for(int j = 0; j < 5; j++) {
			printf("%4d ", path[i][j]);
		}
		printf("\n");
	}
}
```
---

### Bellman-Ford
Dijkstra와 달리 음의 가중치를 포함한 간선이 존재해도 문제없다. 정점의 개수를 N이라고 한다면, 모든 간선들에 대해서 relaxation을 진행하고 이를 N - 1회만큼 반복한다. 만약 N번째 반복에서도 relaxtion이 되는 경우가 있다면 사이클을 포함한다는 뜻이다.

다음 코드는 Single Source Shortest Path를 구하는 알고리즘이지만 All Pairs Shortest Path를 구하도록 만들었다.

```cpp
#include <iostream>
#include <utility>
#include <vector>

#define INF 999

using namespace std;

int dist[5][5] = {
	{0, 2, 3, 4, INF},
	{2, 0, 5, 1, 7},
	{3, 5, 0, INF, 1},
	{4, 1, INF, 0, 3},
	{INF, 7, 1, 3, 0}
};

int path[5][5] = {
	{0, INF, INF, INF, INF},
	{INF, 0, INF, INF, INF},
	{INF, INF, 0, INF, INF},
	{INF, INF, INF, 0, INF},
	{INF, INF, INF, INF, 0}
};

int parent[5][5] = {
	{0, -1, -1, -1, -1},
	{-1, 0, -1, -1, -1},
	{-1, -1, 0, -1, -1},
	{-1, -1, -1, 0, -1},
	{-1, -1, -1, -1, 0}
};

vector<pair<int, int> > edge;

void find_path(int src, vector<pair<int, int> > edge) {
	vector<pair<int, int> >::iterator iter;

	for(int i = 0; i < 4; i++) {
		for(iter = edge.begin(); iter != edge.end(); iter++) {
			if(path[src][(*iter).second] > path[src][(*iter).first] + dist[(*iter).first][(*iter).second]) {
				path[src][(*iter).second] = path[src][(*iter).first] + dist[(*iter).first][(*iter).second];
				parent[src][(*iter).second] = (*iter).first;
			}
		}
	}
}

int main() {
	for(int i = 0; i < 5; i++) {
		for(int j = 0; j < 5; j++) {
			if(dist[i][j] != 0) {
				edge.push_back(make_pair(i, j));
			}
		}
	}

	for(int i = 0; i < 5; i++) {
		find_path(i, edge);
	}

	for(int i = 0; i < 5; i++) {
		for(int j = 0; j < 5; j++) {
			printf("%4d ", path[i][j]);
		}
		printf("\n");
	}
}
```

---
### Floyd-Warshall
위의 알고리즘들로도 모든 정점에 대하여 최소 거리를 구할 수 있지만 시간 복잡도가 그만큼 증가하게 된다. 이들보다 효율적으로 모든 정점에 대하여 최소 거리를 구할 수 있는 것이 Floyd-Warshall이다.

s ∈ V부터 t ∈ V까지 가는 최소 거리를 구할 때 임의의 정점 k ∈ V을 거쳐가는 길과 거쳐가지 않은 길을 비교하여 짧은 거리를 택해주는 방식이다.이때 k는 V = <1, 2, 3, ... n>에서 1부터 n까지에 대하여 한번씩 계산해주어야 한다.

Bellman-Ford와 같이 음의 가중치를 가진 간선이 있더라도 문제없다.

```cpp
#include <iostream>

#define INF 999

using namespace std;

int dist[5][5] = {
	{0, 2, 3, 4, INF},
	{2, 0, 5, 1, 7},
	{3, 5, 0, INF, 1},
	{4, 1, INF, 0, 3},
	{INF, 7, 1, 3, 0}
};

int parent[5][5] = {
	{0, -1, -1, -1, -1},
	{-1, 0, -1, -1, -1},
	{-1, -1, 0, -1, -1},
	{-1, -1, -1, 0, -1},
	{-1, -1, -1, -1, 0}
};

int path[6][6][6] = {0,};

void find_path() {
	for(int i = 1; i < 6; i++) {
		for(int j = 1; j < 6; j++) {
			path[0][i][j] = dist[i - 1][j - 1];
		}
	}

	for(int k = 1; k < 6; k++) {
		for(int i = 1; i < 6; i++) {
			for(int j = 1; j < 6; j++) {
				if(i == j) {
					path[k][i][j] = 0;
				}
				else if(path[k - 1][i][j] > path[k - 1][i][k] + path[k - 1][k][j]) {
					path[k][i][j] = path[k - 1][i][k] + path[k - 1][k][j];
					parent[i][j] = k;
				}
				else {
					path[k][i][j] = path[k - 1][i][j];
				}
			}
		}
	}
}

int main() {
	find_path();

	for(int i = 1; i < 6; i++) {
		for(int j = 1; j < 6; j++) {
			printf("%4d ", path[5][i][j]);
		}
		printf("\n");
	}
}
```