def binary_search(array: list[int], target: int) -> int:
    left, right = 0, len(array) - 1

    while left <= right:
        middle = (left + right) // 2

        if array[middle] == target:
            return middle
        elif array[middle] < target:
            left = middle + 1
        else: 
            right = middle - 1
    return -1



arr = [3, 2, 5, 6, 2, 6, 7]

print(binary_search(arr, 7))