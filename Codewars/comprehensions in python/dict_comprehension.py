tea_prices = {
  "Masala Chai": 40,
  "Green Tea": 50,
  "Lemon Tea": 200
}

tea_prices_usd = {tea:price / 80 for tea, price in tea_prices.items() }

print(tea_prices_usd)