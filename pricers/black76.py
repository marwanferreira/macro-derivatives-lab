import math
from scipy.stats import norm


def black76_call(F, K, T, r, sigma):
    if T <= 0 or sigma <= 0:
        return max(math.exp(-r * T) * (F - K), 0.0)
    d1 = (math.log(F / K) + 0.5 * sigma**2 * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    return math.exp(-r * T) * (F * norm.cdf(d1) - K * norm.cdf(d2))


def black76_put(F, K, T, r, sigma):
    if T <= 0 or sigma <= 0:
        return max(math.exp(-r * T) * (K - F), 0.0)
    d1 = (math.log(F / K) + 0.5 * sigma**2 * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)
    return math.exp(-r * T) * (K * norm.cdf(-d2) - F * norm.cdf(-d1))


def straddle_price(F, K, T, r, sigma):
    return black76_call(F, K, T, r, sigma) + black76_put(F, K, T, r, sigma)


def call_spread_price(F, K1, K2, T, r, sigma):
    return black76_call(F, K1, T, r, sigma) - black76_call(F, K2, T, r, sigma)