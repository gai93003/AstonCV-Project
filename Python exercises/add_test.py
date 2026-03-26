from add import add
import pytest

@pytest.mark.parametrize("a, b, expected", [
    (1, 2, 3),
    (2, 3, 5),
])


def test_add(a, b, expected):
    assert add(a, b) == expected