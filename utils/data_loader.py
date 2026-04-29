import pandas as pd
import yfinance as yf

def download_close_series(ticker, start_date="2024-01-01"):
    df = yf.download(ticker, start=start_date, auto_adjust=False, progress=False)
    if isinstance(df.columns, pd.MultiIndex):
        df = df["Close"].copy()
    else:
        df = df[["Close"]].copy()
    df.columns = ["close"]
    return df.dropna()
def download_multi_close(tickers, start_date="2024-01-01"):
    df = yf.download(tickers, start=start_date, auto_adjust=False, progress=False)
    if isinstance(df.columns, pd.MultiIndex):
        df = df["Close"].copy()
    return df.dropna()