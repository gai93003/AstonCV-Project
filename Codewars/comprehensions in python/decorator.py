from functools import wraps

def my_decorator(func):


    @wraps(func)
    def wrapper():
        print("Before function runs:")
        func()
        print("After the function runs:")

    return wrapper

@my_decorator
def greet():
    print("Hello from decorator class from chaicode")

greet()

print(greet.__name__)