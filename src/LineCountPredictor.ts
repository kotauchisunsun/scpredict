import * as tf from "@tensorflow/tfjs";
import * as c from "./config.json";
import { Statics } from "./Statics";
import { DevelopStatics } from "./DevelopStatics";
import { resampling } from "./StaticsUtil";
import { lezlm } from "./Regression";

export class LineCountPredictor {
    public constructor(
        readonly manHourStatics: Statics,
        readonly monthStatics: Statics,
        readonly developStatics: DevelopStatics
    ) {
    }

    public static predict(lineCount: number, manHourSamplingCount: number, manHourResamplingCount: number, monthSamplingCount: number, monthResamplingCount: number): LineCountPredictor {
        const manHourSamples = lezlm(
            c.loc_man_hour.coefficient,
            c.loc_man_hour.intercept,
            tf.tensor1d([lineCount]),
            tf.randomNormal(
                [manHourSamplingCount],
                c.loc_man_hour.mean,
                c.loc_man_hour.std
            )
        );

        const manHourResamples = resampling(manHourSamples, manHourResamplingCount);
        const monthSampling = lezlm(
            c.man_hour_month.coefficient,
            c.man_hour_month.intercept,
            manHourResamples.tile([monthSamplingCount]),
            tf.randomNormal(
                [manHourResamplingCount * monthSamplingCount],
                c.man_hour_month.mean,
                c.man_hour_month.std
            )
        );

        const monthResamples = resampling(monthSampling, monthResamplingCount);

        const manHourStatics = Statics.build(manHourSamples);
        const monthStatics = Statics.build(monthSampling);
        const developStatics = DevelopStatics.build(monthResamples);
        return { manHourStatics, monthStatics, developStatics };
    }
}
