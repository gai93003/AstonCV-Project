# Middle of a linked list
# Find the middle node of a linked list
# Input: 0 1 2 3 4
# Output: 2
# If the number of nodes is even, then return the second middle node
# Input: 0 1 2 3 4 5
# Output: 3


class Node:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next

def middle_of_linked_list(head: Node) -> int:
    slow = fast = head
    
    while fast and fast.next:
        fast = fast.next.next
        slow = slow.next
    return slow.val

def build_list(node, f): ...

if __name__ == "__main__": ...