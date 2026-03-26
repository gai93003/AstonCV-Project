# Give a string s, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.
# Example:
# Input: s = "A man, a plan, a canal: Panama"
# Output: true
# Explanation: After removing non-alphanumeric characters.

# Input: s = "race a car"
# Output: false
# Explanation: After removing non-alphanumeric characters.


def is_palindrome(text):
    l, r = 0, len(text) - 1

    while l < r:
        while l < r and not text[l].isalnum():
            l += 1
        while l < r and not text[r].isalnum():
            r -= 1
        if text[r].lower() != text[l].lower():
            return False
        
        l += 1
        r -= 1

    return True


print(is_palindrome("A man, a plan, a canal: Panama"))
print(is_palindrome("race a car"))