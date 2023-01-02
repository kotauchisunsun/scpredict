import pandas as pd
import numpy as np

def calc_develop_ratio(nn,c):
    data = pd.read_csv("data/develop5_source.csv",comment="#")
    k=data.sample(c,replace=True).to_numpy()

    base_design = nn*k[:,0].reshape(c,1)
    detail_design = nn*k[:,1].reshape(c,1)
    develop = nn*k[:,2].reshape(c,1)
    integration_test = nn*k[:,3].reshape(c,1)
    system_test = nn*k[:,4].reshape(c,1)

    base_design_series=pd.Series(base_design.flatten())
    detail_design_series=pd.Series(detail_design.flatten())
    develop_series=pd.Series(develop.flatten())
    integration_test_series=pd.Series(integration_test.flatten())
    system_test_series=pd.Series(system_test.flatten())

    return [
        base_design_series,
        detail_design_series,
        develop_series,
        integration_test_series,
        system_test_series
    ]


if __name__=="__main__":
    calc_develop_ratio(np.array([1,2,3,4,5]),2)