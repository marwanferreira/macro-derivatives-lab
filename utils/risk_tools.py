import numpy as np

def realized_vol(returns, window=20, annualization=252):
    return returns.rolling(window).std() * np.sqrt(annualization)

def rolling_abs_move(series, window=20):
    return series.diff().abs().rolling(window).mean()

def rolling_n_day_move(series, n=5, window=20):
    return (series - series.shift(n)).abs().rolling(window).mean()