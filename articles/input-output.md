# C++ Basic Input/Output

<p align="center">
  <img src="images/input-output.webp" alt="Two Sum illustration">
</p>

## Introduction

When you start learning C++, it’s important to focus on the basics first. Input and Output (I/O) are fundamental concepts, and they are handled using streams in C++.

Let’s walk through the structure of a C++ program and how input/output works.

## Including Libraries

1. Libraries provide pre-built functions and tools.
2. `#include<iostream>` → used for input/output.
3. `#include<math.h>` → used for mathematical functions.

```cpp
#include<iostream>

int main() {
    // Your code here
    return 0;
}
```

## Output with cout

To print output, we use `cout` from the iostream library. Since it belongs to the standard namespace, we write `std::cout`.

```cpp
#include<iostream>

int main() {
    std::cout << "Hey, Striver!";
    return 0;
}
```

**Output:**
```text
Hey, Striver!
```

### Printing on Multiple Lines

1. If you write cout statements repeatedly, they print on the same line.

```cpp
#include<iostream>

int main() {
    std::cout << "Hey, Striver!";
    std::cout << "Hey, Striver!";
    return 0;
}
```

**Output:**
```text
Hey, Striver!Hey, Striver!
```

2. Use `\n` (newline character) or `std::endl` to print on new lines.

```cpp
#include<iostream>

int main() {
    std::cout << "Hey, Striver!" << "\n";
    std::cout << "Hey, Striver!";
    return 0;
}
```

**Output:**
```text
Hey, Striver!
Hey, Striver!
```

### \n vs std::endl

1. `\n` → inserts a new line (faster, commonly used).
2. `std::endl` → inserts a new line and flushes the output buffer (slower).

```cpp
#include<iostream>

int main() {
    std::cout << "Hey, Striver!" << std::endl;
    std::cout << "Hey, Striver!";
    return 0;
}
```

## Using namespace std

Writing `using namespace std;` removes the need to prefix `std::`. This makes code cleaner but can cause naming conflicts in large projects.

```cpp
#include<iostream>
using namespace std;

int main() {
    cout << "Hey, Striver!" << endl;
    cout << "Hey, Striver!";
    return 0;
}
```

## Taking User Input with cin

`cin` is used to take input from the user.

```cpp
#include<iostream>
using namespace std;

int main() {
    int x;
    cin >> x;
    cout << "Value of x: " << x;
    return 0;
}
```

**Input:**
```text
10
```

**Output:**
```text
Value of x: 10
```

### Multiple Inputs

```cpp
#include<iostream>
using namespace std;

int main() {
    int x, y;
    cin >> x >> y;
    cout << "Value of x: " << x << " and y: " << y;
    return 0;
}
```

**Input:**
```text
10 20
```

**Output:**
```text
Value of x: 10 and y: 20
```

## Shortcut: bits/stdc++.h

Instead of including libraries one by one, you can use:

```cpp
#include<bits/stdc++.h>
```

1. Includes almost all standard libraries at once.
2. Useful in competitive programming.
3. Not recommended for production (due to compile-time overhead).

```cpp
#include<bits/stdc++.h>
using namespace std;

int main() {
    int x, y;
    cin >> x >> y;
    cout << "Value of x: " << x << " and y: " << y;
    return 0;
}
```