# Maximum depth of a Binary Tree

**Problem Statement:**  
Given the root of a Binary Tree, return the height of the tree. The height is the number of nodes on the longest path from root to a leaf.

## Examples

**Input:** Binary Tree: 1 2 5 -1 -1 4 6 5

**Output:** 4

**Explanation:** The height is the number of nodes on the longest path from the root to a leaf.

## Approach

### Algorithm

To find the depth of a binary tree using BFS, we can use level-order traversal.

1. Initialize a queue and a variable `level`.
2. If the root is null, return 0.
3. Insert the root into the queue.
4. Process the tree level by level.
5. Return the number of levels.

## Code

```cpp
class Solution {
public:
    int maxDepth(Node* root) {
        if (root == NULL) return 0;

        int lh = maxDepth(root->left);
        int rh = maxDepth(root->right);

        return 1 + max(lh, rh);
    }
};