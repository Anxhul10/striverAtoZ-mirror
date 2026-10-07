# Top View of Binary Tree

<p align="center">
  <img src="images/top-view-of-bt.png" alt="Two Sum illustration">
</p>

## Approach

To find the top view of a binary tree, we use **level order traversal (BFS)** because nodes closer to the root should always appear before nodes below them.

We assign a **horizontal distance (HD)** to every node:

- The root has horizontal distance `0`.
- The left child has horizontal distance `HD - 1`.
- The right child has horizontal distance `HD + 1`.

For every horizontal distance, we store only the **first node encountered** during BFS. This works because BFS visits nodes level by level, so the first node at any horizontal distance is always the topmost node.

We use a `map` to store:

`horizontal distance -> node value`

The map automatically keeps the horizontal distances sorted, which helps us return the answer from the leftmost node to the rightmost node.

## Algorithm

1. Create an empty map to store the top view nodes.
2. Push the root node into a queue along with its horizontal distance `0`.
3. Perform BFS traversal:
   - Remove the front element from the queue.
   - If the horizontal distance is not already present in the map, store the node value.
   - Add the left child with horizontal distance `HD - 1`.
   - Add the right child with horizontal distance `HD + 1`.
4. Traverse the map and store the values in the answer vector.

## C++ Solution

```cpp
class Solution {
public:
    vector<int> topView(Node *root) {

        map<int, int> storage;
        vector<int> ans;

        queue<pair<Node*, int>> qt;

        qt.push({root, 0});

        while (!qt.empty()) {

            pair<Node*, int> qt_store = qt.front();
            qt.pop();

            Node* curr = qt_store.first;
            int x = qt_store.second;

            // Store only the first node at this horizontal distance
            if (storage.find(x) == storage.end()) {
                storage[x] = curr->data;
            }

            if (curr->left) {
                qt.push({curr->left, x - 1});
            }

            if (curr->right) {
                qt.push({curr->right, x + 1});
            }
        }

        for (auto node : storage) {
            ans.push_back(node.second);
        }

        return ans;
    }
};