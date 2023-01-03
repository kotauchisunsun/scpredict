import * as tf from "@tensorflow/tfjs";
import { predictMonth } from "../predictMonth";

function expectErrorRange(expected: number, actual: number, errorRange = 0.1): void { 
    expect(actual).toBeGreaterThan(expected * (1 - errorRange))
    expect(actual).toBeLessThan(expected* (1 + errorRange))
}

// eslint-disable-next-line jest/expect-expect
describe("IPAの計算結果と一致している", () => {
    const errorRange = 0.05;
    const samplingCount = 10000;
    const seed = 1;

    const table = [
        [1224.489796,4.071660555,5.31520663,3.119054597,8.85448042,1.872319875],
        [2448.979592,5.103571829,6.657422945,3.91239157,11.07497351,2.35182914],
        [3673.469388,5.82452633,7.595568199,4.466434383,12.62826104,2.686443277],
        [4897.959184,6.397008066,8.340777332,4.906222834,13.86295203,2.95187577],
        [6122.44898,6.879532125,8.969079162,5.276791675,14.90456014,3.175401475],
        [12244.89796,8.623063213,11.24087998,6.614893076,18.67563883,3.981508738],
        [18367.34694,9.841197579,12.82953024,7.548925644,21.31728964,4.543221556],
        [24489.79592,10.80847038,14.09185036,8.290113003,23.41896677,4.988393939],
        [30612.2449,11.62374948,15.15637945,8.914500485,25.19313379,5.363030781],
        [36734.69388,12.33532561,16.08591686,9.459221959,26.74364359,5.689585919],
        [42857.14286,12.97083419,16.91640901,9.945523273,28.12996761,5.980900577],
        [48979.59184,13.54774156,17.67057971,10.38682966,29.38971588,6.245085943],
        [55102.04082,14.07787158,18.3638147,10.79222763,30.54836228,6.487629891],
        [61224.4898,14.56964292,19.00707062,11.16818573,31.62405355,6.712437878],
        [67346.93878,15.02928675,19.60845844,11.51949098,32.63022736,6.92239921],
        [73469.38776,15.4615591,20.17416992,11.84979658,33.57714471,7.119718244],
        [79591.83673,15.87018202,20.70905136,12.16196111,34.47283904,7.306119376],
        [85714.28571,16.25812935,21.21697537,12.45826821,35.3237314,7.482979838],
        [91836.73469,16.62781904,21.70109107,12.74057443,36.13504447,7.651419005],
        [97959.18367,16.98124666,22.16399777,13.0104118,36.91109009,7.812360388],
        [104081.6327,17.32008058,22.60786886,13.26906102,37.65547432,7.966575825],
        [110204.0816,17.64573148,23.0345422,13.51760485,38.37124718,8.114717718],
        [116326.5306,17.95940402,23.44558745,13.75696785,39.0610141,8.257343034],
        [122448.9796,18.26213609,23.84235707,13.98794648,39.72702044,8.394931486],
        [128571.4286,18.55482898,24.22602565,14.2112323,40.37121654,8.527899524],
        [134693.8776,18.83827087,24.59762048,14.42743008,40.99530856,8.656611257],
        [140816.3265,19.11315556,24.95804588,14.63707203,41.6007986,8.78138708],
        [146938.7755,19.38009723,25.3081025,14.84062935,42.18901686,8.902510575],
        [153061.2245,19.63964257,25.64850304,15.03852133,42.76114753,9.020234078],
        [159183.6735,19.8922805,25.97988498,15.231123,43.31825002,9.134783223],
        [165306.1224,20.13845029,26.30282105,15.41877122,43.86127632,9.246360669],
        [171428.5714,20.37854821,26.61782801,15.60176988,44.39108541,9.355149203],
        [177551.0204,20.61293311,26.92537381,15.78039415,44.90845536,9.461314313],
        [183673.4694,20.84193112,27.22588381,15.95489409,45.41409343,9.565006366],
        [189795.9184,21.0658396,27.51974585,16.12549769,45.90864464,9.666362436],
        [195918.3673,21.28493053,27.80731469,16.29241345,46.39269905,9.765507872],
        [202040.8163,21.4994534,28.08891578,16.45583262,46.86679803,9.862557631],
        [208163.2653,21.70963766,28.36484845,16.6159311,47.3314396,9.957617422],
        [214285.7143,21.91569491,28.63538874,16.77287106,47.78708305,10.0507847],
        [220408.1633,22.11782069,28.90079182,16.92680239,48.234153,10.14214953],
        [226530.6122,22.31619619,29.16129408,17.07786394,48.67304287,10.23179533],
        [232653.0612,22.5109896,29.41711498,17.2261846,49.10411797,10.31979952],
        [238775.5102,22.70235737,29.66845869,17.37188425,49.52771816,10.40623411],
        [244897.9592,22.89044532,29.91551551,17.51507464,49.94416027,10.49116622],
        [251020.4082,23.0753896,30.15846312,17.65586008,50.35374015,10.57465848],
        [257142.8571,23.25731754,30.39746773,17.79433814,50.75673455,10.65676947],
        [263265.3061,23.43634844,30.63268504,17.9306002,51.15340279,10.73755407],
        [269387.7551,23.61259423,30.86426115,18.06473201,51.54398822,10.81706375],
        [275510.2041,23.78616009,31.09233337,18.19681415,51.92871954,10.89534687],
        [281632.6531,23.95714499,31.3170309,18.32692243,52.30781199,10.97244894],
        [287755.102,24.12564219,31.5384755,18.45512828,52.68146841,11.04841282],
        [293877.551,24.29173968,31.75678204,18.5814991,53.04988023,11.12327896],
        [300000,24.45552059,31.97205905,18.70609855,53.41322829,11.19708556]        
    ];

    // eslint-disable-next-line jest/expect-expect
    test.each(table)("ManHour %f", (manHour, median, p50Upper, p50Lower, p95Upper, p95Lower) => {
        const data = tf.tensor1d([manHour])
        const s = predictMonth(data, samplingCount, seed);
        expectErrorRange(s.median,   median,   errorRange);
        expectErrorRange(s.p50Upper, p50Upper, errorRange);
        expectErrorRange(s.p50Lower, p50Lower, errorRange);
        expectErrorRange(s.p95Upper, p95Upper, errorRange);
        expectErrorRange(s.p95Lower, p95Lower, errorRange);
    });
});