# Binary Tree Right Side View

## Approach

To find the right side view of a binary tree, we use **level order traversal (BFS)**. The idea is to store the last node encountered at every level because that node will be visible when viewing the tree from the right side.

We maintain a `map` to store:

`level -> node value`

The root starts at level `0`, and both its left and right children are assigned level `1`.

During BFS, we process nodes level by level. For every node, we update the map with its value at the current level.

Since we insert the **left child before the right child**, the rightmost node at each level is processed last. Therefore, updating the map every time ensures that the last node encountered at each level is retained.

Finally, we traverse the map and store the values in the answer vector. Since the map maintains sorted keys, the nodes are returned from the top level to the bottom level.

## Algorithm

1. Create an empty answer vector.
2. If the root is `nullptr`, return the empty vector.
3. Create a map to store the level and corresponding node value.
4. Push the root into the queue with level `0`.
5. Perform BFS traversal:
   - Get the current node and its level from the queue.
   - Update the map with the current node's value at that level.
   - Push the left child with level `row + 1`.
   - Push the right child with level `row + 1`.
6. Traverse the map and add its values to the answer vector.
7. Return the answer.

## C++ Solution

```cpp
class Solution {
public:
    vector<int> rightSideView(TreeNode* root) {

        vector<int> ans;

        if (!root) return ans;

        map<int, int> mp;

        queue<pair<TreeNode*, int>> qt;
        qt.push({root, 0});

        while (!qt.empty()) {

            int s = qt.size();

            for (int i = 0; i < s; i++) {

                pair<TreeNode*, int> top = qt.front();
                qt.pop();

                int row = top.second;
                TreeNode* curr = top.first;

                // Replace the value at the current level
                mp[row] = curr->val;

                if (curr->left) {
                    qt.push({curr->left, row + 1});
                }

                if (curr->right) {
                    qt.push({curr->right, row + 1});
                }
            }
        }

        for (pair<int, int> m : mp) {
            ans.push_back(m.second);
        }

        return ans;
    }
};