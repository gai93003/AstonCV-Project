def chai_customer():
    print("Welcome! What chai would you like? ")
    order = yield
    count = 1

    while True:
        print(f"Preparing order number {count} which is: {order}")
        order = yield
        count +=1
stall = chai_customer()

next(stall)

stall.send("Masala Chai")
stall.send("Lemon Chai")