from calc_hour_date_regression import *
from calc_loc_hour_regression import *
from calc_develop_ratio import *

def print_stats(d):
    q = [0.025,0.25,0.50,0.75,0.975]

    mean = np.mean(d)
    q025,q250,q500,q750,q975 = d.quantile(q)

    #print(f"平均：　    {mean:8.2f}")
    #print(f"中央値：    {q500:8.2f}")
    #print(f"50%信頼区間 {q250:8.2f} - {q750:8.2f}")
    #print(f"95%信頼区間 {q025:8.2f} - {q975:8.2f}")

    print(f"平均：　    {mean:f}")
    print(f"中央値：    {q500:f}")
    print(f"50%信頼区間 {q250:f} - {q750:f}")
    print(f"95%信頼区間 {q025:f} - {q975:f}")


loc = 4081
n1 = 1000
n2 = 1000
n3 = 1000

reg_loc_hour,m1,s1 = calc_loc_hour_regression()

log_loc = np.log(loc)

noise1 = np.random.default_rng().normal(m1,s1,n1)
r1 = np.exp(reg_loc_hour.predict([[log_loc]])+noise1)
r1s = pd.Series(r1)
r1ds = pd.Series(r1/8)

reg_hour_date,m2,s2 = calc_hour_date_regression()
noise2 = np.random.default_rng().normal(m2,s2,n2)

r2 = np.exp(reg_hour_date.predict(np.log(r1).reshape(n1,1))+noise2.reshape(n2,1))
r2s = pd.Series(r2.flatten())

#r2 = pd.Series(np.exp(reg.predict([[log_x]])+noise))

s = np.random.choice(r2.flatten(),10000,replace=True)

base_design_series,detail_design_series,develop_series,integration_test_series,system_test_series = calc_develop_ratio(s,n3)

print(f"SLOC:{loc}")
print(f"開発5工程の人時予測[人時]")
print_stats(r1s)
print(f"開発5工程の人時予測[人日]")
print_stats(r1ds)
print(f"開発5工程の工期予測[月]")
print_stats(r2s)
print(f"基礎設計の工期予測[月]")
print_stats(base_design_series)
print(f"詳細設計の工期予測[月]")
print_stats(detail_design_series)
print(f"開発の工期予測[月]")
print_stats(develop_series)
print(f"結合テストの工期予測[月]")
print_stats(integration_test_series)
print(f"総合テストの工期予測[月]")
print_stats(system_test_series)
