import { Statics } from "./Statics";
import { DevelopStatics } from "./DevelopStatics";
import { resampling } from "./StaticsUtil";
import { predictManHour } from "./predictManHour";
import { predictMonth } from "./predictMonth";

export class LineCountPredictor {
  public constructor(
        readonly manHourStatics: Statics,
        readonly monthStatics: Statics,
        readonly developStatics: DevelopStatics
  ) {
  }

  public static predict(lineCount: number, manHourSamplingCount: number, manHourResamplingCount: number, monthSamplingCount: number, monthResamplingCount: number, seed?: number): LineCountPredictor {
    const manHourStatics = predictManHour(lineCount, manHourSamplingCount, seed)
    const manHourResamples = resampling(manHourStatics.data, manHourResamplingCount);
    const monthStatics = predictMonth(manHourResamples, monthSamplingCount, seed);
    const monthResamples = resampling(monthStatics.data, monthResamplingCount, seed);

    const developStatics = DevelopStatics.build(monthResamples);
    return { manHourStatics, monthStatics, developStatics };
  }
}
