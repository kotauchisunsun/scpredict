import * as tf from "@tensorflow/tfjs";
import * as c from "./config.json";
import { Statics } from "./Statics";
import { DevelopStatics } from "./DevelopStatics";
import { resampling } from "./StaticsUtil";
import { lezlm } from "./Regression";
import { predictManHour } from "./predictManHour";

export class LineCountPredictor {
    public constructor(
        readonly manHourStatics: Statics,
        readonly monthStatics: Statics,
        readonly developStatics: DevelopStatics
    ) {
    }

    public static predict(lineCount: number, manHourSamplingCount: number, manHourResamplingCount: number, monthSamplingCount: number, monthResamplingCount: number, seed?: number): LineCountPredictor {
        const manHourStatics = predictManHour(lineCount,manHourSamplingCount, seed)
        const manHourResamples = resampling(manHourStatics.data, manHourResamplingCount);
        const monthSampling = lezlm(
            c.man_hour_month.coefficient,
            c.man_hour_month.intercept,
            manHourResamples.tile([monthSamplingCount]),
            tf.randomNormal(
                [manHourResamplingCount * monthSamplingCount],
                c.man_hour_month.mean,
                c.man_hour_month.std,
                'float32',
                seed
            )
        );

        const monthResamples = resampling(monthSampling, monthResamplingCount, seed);

        const monthStatics = Statics.build(monthSampling);
        const developStatics = DevelopStatics.build(monthResamples);
        return { manHourStatics, monthStatics, developStatics };
    }
}
