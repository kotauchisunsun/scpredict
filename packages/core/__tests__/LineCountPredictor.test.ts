import { LineCountPredictor } from "../LineCountPredictor";
import '@tensorflow/tfjs-node';
import { Statics } from "../Statics";

function expectErrorRange(expected: number, actual: number, errorRange = 0.2): void { 
    expect(actual).toBeGreaterThan(expected * (1 - errorRange))
    expect(actual).toBeLessThan(expected* (1 + errorRange))
}

function expectStatics(statics: Statics, expected: number[], errorRange = 0.2): void { 
    expectErrorRange(statics.mean,     expected[0], errorRange);
    expectErrorRange(statics.median,   expected[1], errorRange);
    expectErrorRange(statics.p50Lower, expected[2], errorRange);
    expectErrorRange(statics.p50Upper, expected[3], errorRange);
    expectErrorRange(statics.p95Lower, expected[4], errorRange);
    expectErrorRange(statics.p95Upper, expected[5], errorRange);
}

// eslint-disable-next-line jest/expect-expect
test("predict LineCountStatics", () => {
    const lineCount = 4081;

    const manHourSamplingCount = 10000;
    const manHourResamplingCount = 100;
    const monthSamplingCount = 1000;
    const monthResamplingCount = 10000;

    const lineCountPredictor = LineCountPredictor.predict(
        lineCount,
        manHourSamplingCount,
        manHourResamplingCount,
        monthSamplingCount,
        monthResamplingCount,
        0
    );

    console.log("man-hour:")
    lineCountPredictor.manHourStatics.print()

    const monthCost = 373500

    console.log("month:")
    lineCountPredictor.monthStatics.print()

    console.log(`mean:   ${(lineCountPredictor.monthStatics.mean     * monthCost).toFixed()}\n` +
                `median: ${(lineCountPredictor.monthStatics.median   * monthCost).toFixed()}\n` +
                `50%:    ${(lineCountPredictor.monthStatics.p50Lower * monthCost).toFixed()} - ${(lineCountPredictor.monthStatics.p50Upper * monthCost).toFixed()}\n` + 
                `95%:    ${(lineCountPredictor.monthStatics.p95Lower * monthCost).toFixed()} - ${(lineCountPredictor.monthStatics.p95Upper * monthCost).toFixed()}`);

    console.log("develop detail")
    lineCountPredictor.developStatics.print()

    expectStatics(
        lineCountPredictor.manHourStatics,
        [
            5285.826859,
            3244.241805,
            1690.705173,
            6066.640553,
             499.5393297,
            20532.71875
        ]
    )

    expectStatics(
        lineCountPredictor.monthStatics,
        [
             6.337557,
             5.600422,
             3.990860,
             7.827798,
             2.066552,
            14.988579
        ]
    )

    expectStatics(
        lineCountPredictor.developStatics.baseDesignStatics,
        [
            1.285499,
            1.063298,
            0.678205,
            1.629719,
            0.244418,
            3.639999
        ]
    )

    expectStatics(
        lineCountPredictor.developStatics.detailDesignStatics,
        [
            1.064343,
            0.887824,
            0.561551,
            1.358695,
            0.208441,
            2.966564
        ]
    )

    expectStatics(
        lineCountPredictor.developStatics.developStatics,
        [
            1.586542,
            1.323382,
            0.877002,
            1.982910,
            0.385172,
            4.351885
        ]
    )

    expectStatics(
        lineCountPredictor.developStatics.integrationTestStatics,
        [
            1.258465,
            1.041031,
            0.657820,
            1.608799,
            0.223249,
            3.563258
        ]
    )

    expectStatics(
        lineCountPredictor.developStatics.systemTestStatics,
        [
            1.184032,
            0.959278,
            0.579270,
            1.530863,
            0.168715,
            3.503142
        ]
    )
})

// eslint-disable-next-line jest/no-commented-out-tests
/*
test("Sample", () => {
    const lineCounts = [
        791.2,
        2095.9,
        4100.,
        7000.,
        9937.275,       
        12600.,
        17385.51,
        21013.2,
        26067.95,
        31786.,
        45000.,
        72796.8,
        127505.6,
        271020.375
    ]

    const manHourSamplingCount = 10000;
    const manHourResamplingCount = 100;
    const monthSamplingCount = 1000;
    const monthResamplingCount = 10000;

    let s = "";

    for (const lineCount of lineCounts) { 
        const lineCountPredictor = LineCountPredictor.predict(
            lineCount,
            manHourSamplingCount,
            manHourResamplingCount,
            monthSamplingCount,
            monthResamplingCount
        );

        const s1 = lineCountPredictor.manHourStatics;
        const s2 = lineCountPredictor.monthStatics;
        const s3 = lineCountPredictor.developStatics.developStatics;
        
        const l1 = `${lineCount}\t${s1.mean}\t${s1.median}\t${s1.p50Lower}\t${s1.p50Upper}\t${s1.p95Lower}\t${s1.p95Upper}`
        const l2 = `${lineCount}\t${s2.mean}\t${s2.median}\t${s2.p50Lower}\t${s2.p50Upper}\t${s2.p95Lower}\t${s2.p95Upper}`
        const l3 = `${lineCount}\t${s3.mean}\t${s3.median}\t${s3.p50Lower}\t${s3.p50Upper}\t${s3.p95Lower}\t${s3.p95Upper}`

        //console.log(s2);

        //s += l1 + l2 + "\n";
        //s = s + l1 + "\n"
        s = s + l3 + "\n"
    }

    console.log(s)


})
*/