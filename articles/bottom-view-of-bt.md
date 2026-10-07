# Bottom View of Binary Tree
<p align="center">
    <img src="images/bottom-view-of-bt.png" style="width: 100%; max-width: 600px; height: auto;">
</p>


## Approach

The approach is pretty similar to the **Top View of Binary Tree**. We use **level order traversal (BFS)** along with a horizontal distance to identify the nodes visible from the bottom.

We assign a horizontal distance (HD) to every node:

- The root has horizontal distance `0`.
- The left child has horizontal distance `HD - 1`.
- The right child has horizontal distance `HD + 1`.

We use a `map` to store:

`horizontal distance -> node value`

The main difference between Top View and Bottom View is how we update the map.

- **Top View:** We store only the first node encountered at a horizontal distance because BFS visits the upper nodes first.
- **Bottom View:** We replace the existing value at every horizontal distance with the current node's value. This ensures that the last node encountered at that horizontal distance is stored.

Since BFS processes nodes level by level, updating the map ensures that the bottommost node at each horizontal distance is retained. If multiple nodes have the same horizontal distance and depth, the latter node in level order traversal is considered.

The `map` automatically maintains horizontal distances in sorted order, allowing us to return the answer from left to right.

## Algorithm

1. Create an empty map to store horizontal distances and corresponding node values.
2. Push the root node into a queue along with its horizontal distance `0`.
3. Perform BFS traversal:
   - Remove the front element from the queue.
   - Update the map with the current node's value at its horizontal distance.
   - Add the left child with horizontal distance `HD - 1`.
   - Add the right child with horizontal distance `HD + 1`.
4. Traverse the map and store the values in the answer vector.
5. Return the answer.

## C++ Solution

```cpp
class Solution {
public:
    vector<int> bottomView(Node *root) {

        vector<int> ans;

        map<int, int> mp;
        queue<pair<Node*, int>> qt;

        qt.push({root, 0});

        while (!qt.empty()) {

            int s = qt.size();

            for (int i = 0; i < s; i++) {

                pair<Node*, int> top = qt.front();

                int x = top.second;
                Node* curr = top.first;

                qt.pop();

                // Replace the existing value at this horizontal distance
                mp[x] = curr->data;

                if (curr->left) {
                    qt.push({curr->left, x - 1});
                }

                if (curr->right) {
                    qt.push({curr->right, x + 1});
                }
            }
        }

        for (pair<int, int> m : mp) {
            ans.push_back(m.second);
        }

        return ans;
    }
};