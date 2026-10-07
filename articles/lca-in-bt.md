# Lowest Common Ancestor of a Binary Tree

## Approach

To find the Lowest Common Ancestor (LCA) of two nodes `p` and `q` in a binary tree, we use **Depth First Search (DFS) with recursion**.

The idea is to recursively search for both nodes in the left and right subtrees.

We handle three cases:

1. **Base Case:** If the current node is `nullptr`, return `nullptr`. If the current node is either `p` or `q`, return the current node itself.
2. **Both Subtrees Return Non-Null:** If the left and right recursive calls both return a valid node, it means `p` and `q` are present in different subtrees. Therefore, the current node is their Lowest Common Ancestor.
3. **Only One Subtree Returns Non-Null:** If only one subtree returns a valid node, propagate that node upward because it contains either `p`, `q`, or their LCA.

The important observation is that we do not need to explicitly check whether both nodes exist at every step. The recursive calls naturally propagate the required node upward.

## Algorithm

1. If the current node is `nullptr`, return `nullptr`.
2. If the current node is equal to `p` or `q`, return the current node.
3. Recursively search for `p` and `q` in the left subtree.
4. Recursively search for `p` and `q` in the right subtree.
5. If both left and right recursive calls return non-null nodes, the current node is the LCA.
6. Otherwise, return whichever subtree returned a non-null node.
7. If both return `nullptr`, return `nullptr`.


## C++ Solution

```cpp
class Solution {
private:
    TreeNode* runner(TreeNode* root, TreeNode* p, TreeNode* q) {

        if (!root) return nullptr;

        if (root == p || root == q) return root;

        TreeNode* l = runner(root->left, p, q);
        TreeNode* r = runner(root->right, p, q);

        if (l && r) return root;

        return (l) ? l : r;
    }

public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        return runner(root, p, q);
    }
};
```

## Fun Fact 1

Lowest Common Ancestor queries help represent shared structures in file systems, XML documents, and compiler syntax trees. For example, they can identify the nearest common directory shared by two files or the closest enclosing construct shared by two expressions.

## Fun Fact 2

In genealogical and taxonomy systems, LCA helps identify the closest shared ancestor, such as the nearest common ancestor of two individuals in a family tree or the shared classification of two organisms.

## Fun Fact 3

LCA is also useful in version control systems and hierarchical data structures, where identifying a shared parent can help compare different branches or determine relationships between nodes.

## Fun Fact 4

The LCA problem has an important connection with graph algorithms. In a rooted tree, the LCA of two nodes is the deepest node that is an ancestor of both, making it a special case of ancestor queries in trees.

