import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

def calc_hour_date_regression():
    data = pd.read_csv("data/hour_date_source.csv",comment="#")

    data["log(hour_man)"] = np.log(data["hour_man"])
    data["log(month)"] = np.log(data["month"])

    n=len(data["hour_man"])
    log_hour_man = np.array(data["log(hour_man)"]).reshape((n,1))
    log_month = data["log(month)"]
    reg = LinearRegression().fit(log_hour_man,log_month)

    diff = log_month - reg.predict(log_hour_man)

    return reg,diff.mean(),diff.std()

if __name__=="__main__":

    x = 1224.489796
    y = 4.071660555

    log_x = np.log(x)
    reg,m,s = calc_hour_date_regression()

    c = 1000
    noise = np.random.default_rng().normal(m,s,c)
    p = pd.Series(np.exp(reg.predict([[log_x]])+noise))
