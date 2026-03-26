def is_palindrome(s: str) -> bool:
    l, r = 0, len(s) - 1

    while l < r:
        while l < r and not s[l].isalnum(): # Note 1, 2
            l += 1
        while l < r and not s[r].isalnum():
            r += 1
        if s[l].lower() != s[r].lower(): # Ignore case
            return False
        l += 1
        r -= 1

    return True


if __name__ == "__main__":
    s = input()
    res = is_palindrome(s)
    print("true" if res else "false")