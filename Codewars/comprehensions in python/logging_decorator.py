from functools import wraps

def log_activity(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Calling: {func._name_}")
        result = func(*args, **kwargs)
        print(f"Calling: {func._name_}")
        return result
    return wrapper

@log_activity
def brew_chai(type):
    print(f"Brewing {type} chai")

brew_chai("Masala")