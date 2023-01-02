from calc_log_hour_regression import *
from calc_hour_date_regression import *
import json


with open("src/config.json","w") as f:
    r1,m1,s1 = calc_loc_hour_regression()
    c1 = {
        "coefficient" : r1.coef_[0],
        "intercept": r1.intercept_,
        "mean": m1,
        "std": s1
    }

    r2,m2,s2 = calc_hour_date_regression()
    c2 = {
        "coefficient": r2.coef_[0],
        "intercept": r2.intercept_,
        "mean": m2,
        "std": s2
    }

    records = pd.read_csv("data/develop5_source.csv",comment="#").to_numpy().tolist()
    
    json.dump(
        {
            "loc_man_hour": c1,
            "man_hour_month": c2,
            "develop5_records": records
        },
        f,
        indent=4
    )
