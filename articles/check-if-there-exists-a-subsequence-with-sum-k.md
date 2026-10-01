# Subsequence with Sum K

## Approach 1: Top-Down Dynamic Programming (Memoization)

We use recursion with memoization to explore all possible subsequences and determine whether a subsequence with sum `k` exists.

At each index `idx`, we have two choices:

1. **Take:** Include the current element in the subsequence and reduce the target by `arr[idx]`.
2. **Skip:** Exclude the current element and move to the next index without changing the target.

To avoid recomputing the same states, we maintain a 2D DP array where `dp[idx][target]` stores whether it is possible to achieve the remaining target using elements starting from index `idx`.

### Base Cases

- If `target == 0`, we have successfully formed the required sum, so return `true`.
- If `target < 0`, the required sum cannot be achieved, so return `false`.
- If `idx == n`, all elements have been processed without achieving the target, so return `false`.

### Recurrence Relation

```cpp
take = runner(nums, target - nums[idx], idx + 1, dp);
skip = runner(nums, target, idx + 1, dp);

dp[idx][target] = take || skip;
```

### C++ Solution

```cpp
class Solution {
private:
    bool runner(vector<int>& nums, int target, int idx, vector<vector<int>>& dp) {
        if(target < 0) return false;
        if(target == 0) return true;
        if(idx == (int)nums.size()) return false;

        if(dp[idx][target] != -1) return dp[idx][target];

        // Take the current element
        bool take = runner(nums, target - nums[idx], idx + 1, dp);

        // Skip the current element
        bool skip = runner(nums, target, idx + 1, dp);

        dp[idx][target] = take || skip;

        return dp[idx][target];
    }

public:
    bool checkSubsequenceSum(vector<int>& arr, int k) {
        int idx = 0;
        int n = arr.size();

        vector<vector<int>> dp(n + 1, vector<int>(k + 1, -1));

        return runner(arr, k, idx, dp);
    }
};
```

### Complexity Analysis

- **Time Complexity:** `O(n * k)` because there are `n * k` possible states, and each state is calculated only once.
- **Space Complexity:** `O(n * k)` for the DP array and `O(n)` auxiliary recursion stack space.

---

## Approach 2: Bottom-Up Dynamic Programming (Tabulation)

We convert the recursive solution into an iterative approach using a 2D DP table.

Instead of solving the problem recursively, we build the DP table from smaller subproblems to larger subproblems.

We define:

`dp[i][sum]` represents whether a subsequence with sum `sum` can be formed using the first `i` elements of the array.

### Base Case

A sum of `0` is always achievable by selecting an empty subsequence.

Therefore:

```cpp
dp[i][0] = 1;
```

for every `i` from `0` to `n`.

Initially, all other states are `false` because no positive sum can be formed using zero elements.

### State Transition

For every element, we have two choices:

1. **Skip:** Exclude the current element. The result depends on whether the same sum was achievable using the previous elements.

   `skip = dp[i-1][sum]`

2. **Take:** Include the current element if its value does not exceed the current sum.

   `take = dp[i-1][sum-arr[i-1]]`

The final transition becomes:

```cpp
dp[i][sum] = take || skip;
```

### Optimization 1: Using vector<char>

Instead of using `vector<vector<bool>>`, we use `vector<vector<char>>`.

The `vector<bool>` specialization uses bit-packing, which can introduce additional overhead during element access and modification. Using `char` provides direct element access while keeping memory consumption relatively low.

### Optimization 2: Early Termination

After processing each element, we check whether the target sum `k` has already been achieved.

If `dp[i][k]` becomes true, we immediately return `true` because we have already found a valid subsequence. There is no need to process the remaining elements.

### C++ Solution

```cpp
class Solution {
public:
    bool checkSubsequenceSum(vector<int>& arr, int k) {
        int n = arr.size();

        // Use vector<char> instead of vector<bool>
        vector<vector<char>> dp(n + 1, vector<char>(k + 1, 0));

        // Base case: Sum 0 is always possible
        for(int i = 0; i <= n; i++) {
            dp[i][0] = 1;
        }

        for(int i = 1; i <= n; i++) {
            for(int sum = 1; sum <= k; sum++) {

                bool take = false;

                if(sum - arr[i-1] >= 0) {
                    take = dp[i-1][sum - arr[i-1]];
                }

                bool skip = dp[i-1][sum];

                dp[i][sum] = take || skip;
            }

            // Early termination if target sum is achieved
            if(dp[i][k]) {
                return true;
            }
        }

        return dp[n][k];
    }
};
```

### Complexity Analysis

- **Time Complexity:** `O(n * k)` because we process each element against every possible sum from `1` to `k`.
- **Space Complexity:** `O(n * k)` for the 2D DP table.

---

## Comparison: Memoization vs Tabulation

| Parameter | Memoization | Tabulation |
|---|---|---|
| Approach | Top-Down | Bottom-Up |
| Technique | Recursion + DP | Iterative DP |
| State | `dp[idx][target]` | `dp[i][sum]` |
| Base Case | Checked inside recursion | Initialized before iteration |
| Computation | Only required states | Iteratively fills states |
| Recursion Stack | O(n) | O(1) |
| Time Complexity | O(n * k) | O(n * k) |
| Space Complexity | O(n * k) | O(n * k) |
| Optimization | Avoids repeated recursive calls | Uses `vector<char>` and early termination |