# Root to Leaf Paths in Binary Tree

## Approach

To find all root-to-leaf paths in a binary tree, we use **Depth First Search (DFS) with backtracking**.

The idea is to maintain a `path` vector that stores the nodes visited from the root to the current node.

We recursively traverse the tree:

- First, add the current node's value to the path.
- If the current node is a leaf node (both left and right children are `nullptr`), we have found a complete root-to-leaf path, so we add the current path to the answer.
- Recursively explore the left subtree.
- Recursively explore the right subtree.
- Finally, remove the current node from the path using `pop_back()`.

The important part is **backtracking**. After exploring a node and its subtrees, we remove that node from the current path so that it does not affect the path of another subtree.

Since we pass the same `path` vector by reference throughout the recursion, we avoid creating a separate vector at every recursive call.

## Algorithm

1. Create an empty answer vector `ans` and an empty path vector `path`.
2. Call the recursive function `runner()` with the root.
3. Inside the recursive function:
   - If the current node is `nullptr`, return.
   - Add the current node's value to the path.
   - If the current node is a leaf node, store the current path in `ans`.
   - Recursively traverse the left child.
   - Recursively traverse the right child.
   - Remove the current node's value from the path using `pop_back()`.
4. Return the answer containing all root-to-leaf paths.

## C++ Solution

```cpp
class Solution {
    void runner(Node* root, vector<vector<int>>& ans, vector<int>& path) {

        if (!root) return;

        path.push_back(root->data);

        if (!root->left && !root->right) {
            ans.push_back(path);
        }

        runner(root->left, ans, path);
        runner(root->right, ans, path);

        // Backtracking
        path.pop_back();

        return;
    }

public:
    vector<vector<int>> paths(Node* root) {

        vector<vector<int>> ans;
        vector<int> path;

        runner(root, ans, path);

        return ans;
    }
};