import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

def calc_loc_hour_regression():
    data = pd.read_csv("data/loc_hour_source.csv",comment="#")

    data["log(loc)"] = np.log(data["loc"])
    data["log(hour_man)"] = np.log(data["hour_man"])

    n=len(data["loc"])
    log_loc = np.array(data["log(loc)"]).reshape((n,1))
    log_hour_man = data["log(hour_man)"]
    reg = LinearRegression().fit(log_loc,log_hour_man)

    diff = log_hour_man - reg.predict(log_loc)

    return reg,diff.mean(),diff.std()

if __name__=="__main__":
    x = 4081.63
    y = 6066.64

    log_x = np.log(x)
    log_y = np.log(y)

    reg,m,s = calc_loc_hour_regression()
    c = 1000
    noise = np.random.default_rng().normal(m,s,c)
    p = pd.Series(np.exp(reg.predict([[log_x]])+noise))