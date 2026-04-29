import matplotlib.pyplot as plt

def plot_series(series, title="", ylabel=""):
    plt.figure(figsize=(12, 5))
    plt.plot(series.index, series.values)
    plt.title(title)
    plt.xlabel("Date")
    plt.ylabel(ylabel)
    plt.grid(True)
    plt.show()