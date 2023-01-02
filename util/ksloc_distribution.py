import pandas as pd
import numpy as np

data = pd.read_csv("data/ksloc_distribution.csv",comment="#")

q = [
    0.05,
    0.10,
    0.15,
    0.20,
    0.25,
    0.30,
    0.35,
    0.40,
    0.45,
    0.50,
    0.60,
    0.70,
    0.80,
    0.90
]

qdata = data.quantile(q)
qdata["sloc"] = qdata["ksloc"] * 1000

del qdata["ksloc"]

data.describe()
"""
              ksloc
count   1350.000000
mean     152.230856
std      790.892523
min        0.001000
25%        9.937275
50%       31.786000
75%       96.090750
max    21759.000000
"""

qdata
"""
            sloc
0.05     791.200
0.10    2095.900
0.15    4100.000
0.20    7000.000
0.25    9937.275
0.30   12600.000
0.35   17385.510
0.40   21013.200
0.45   26067.950
0.50   31786.000
0.60   45000.000
0.70   72796.800
0.80  127505.600
0.90  271020.375
"""