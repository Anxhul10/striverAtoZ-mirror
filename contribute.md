# Contribute an Article

Help make the Striver A2Z tracker more useful by adding explanations,
examples, diagrams, and solutions for problems that do not have an
article yet.

Articles are written in **Markdown** and stored in the `articles/`
directory. The article collection is a work in progress, so
contributions are welcome!

## 1. Find the problem slug

Each article filename must match the problem's URL slug.

For example, if the problem opens with:

``` text
article.html?id=two-sum
```

its Markdown file must be:

``` text
articles/two-sum.md
```

Use the exact `id` value after `?id=` as the filename, followed by
`.md`.

## 2. Write your article

Use clear headings and explain the solution in your own words. You can
include:

-   Problem summary
-   Approach and intuition
-   Step-by-step explanation
-   Code examples
-   Time and space complexity
-   Diagrams or images, when useful

### Sample article

Create `articles/two-sum.md`:

``` markdown
# Two Sum

## Approach

We use an unordered map to store previously visited elements.

For each number, calculate the complement:

`complement = target - nums[i]`

If the complement is already in the map, we have found the answer.

## C++ Solution

```cpp
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;

        for (int i = 0; i < nums.size(); i++) {
            int rem = target - nums[i];

            if (mp.count(rem)) {
                return {mp[rem], i};
            }

            mp[nums[i]] = i;
        }

        return {};
    }
};
```

## Complexity

-   **Time:** O(n), on average
-   **Space:** O(n)

```{=html}
<!-- -->
```

    ## 3. Add images (optional)

    You can include images using standard Markdown syntax:

    ```markdown
    ![Two Sum illustration](../images/two-sum.png)

Put the image in the repository's `images/` directory and include it in
your pull request. Use images you created or have permission to share.
Keep image files reasonably small.

## 4. Preview your article

Run the project with a local web server from the project directory:

``` bash
python -m http.server 8000
```

Open `http://localhost:8000`, navigate to the problem, and check that
the article, code blocks, and images render correctly.

## 5. Submit a pull request

1.  Fork this repository on GitHub.
2.  Clone your fork.
3.  Create a branch for your contribution, for example
    `add-two-sum-article`.
4.  Add your article to `articles/` using the exact problem slug as its
    filename.
5.  Add any images you reference.
6.  Preview the article locally.
7.  Commit your changes and push the branch to your fork.
8.  Open a pull request against this repository.

In the pull request description, include:

-   Problem title
-   Article filename
-   A short summary of what you added
-   Any images or other files included

## Contribution guidelines

-   Write original explanations in your own words. Do not copy articles
    from other websites.
-   Keep the explanation accurate, readable, and focused on the problem.
-   Use Markdown headings and fenced code blocks for code.
-   Check that image paths and the article filename are correct.
-   If you are improving an existing article, edit that article instead
    of creating a duplicate.

Thank you for helping improve the project!