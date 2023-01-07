import * as tf from "@tensorflow/tfjs";
import * as c from "./config.json";
import { Statics } from "./Statics";

export class DevelopStatics {
  public constructor(
        readonly baseDesignStatics: Statics,
        readonly detailDesignStatics: Statics,
        readonly developStatics: Statics,
        readonly integrationTestStatics: Statics,
        readonly systemTestStatics: Statics
  ) { }

  public static build(monthResamples: tf.Tensor1D): DevelopStatics {
    const monthResamplingCount = monthResamples.size;

    const records = tf.tensor2d(c.develop5_records);
    const samplingIndicies = tf.randomUniform([monthResamplingCount], 0, records.shape[0], "int32");

    const samplingRecords = records.gather(samplingIndicies);
    const developMonthSamples = monthResamples.reshape([monthResamplingCount, 1]).mul(samplingRecords);

    const ranges = developMonthSamples.transpose();
    const baseDesign = ranges.gather([0]).reshape([monthResamplingCount]).as1D();
    const detailDesign = ranges.gather([1]).reshape([monthResamplingCount]).as1D();
    const develop = ranges.gather([2]).reshape([monthResamplingCount]).as1D();
    const integrationTest = ranges.gather([3]).reshape([monthResamplingCount]).as1D();
    const sytemTest = ranges.gather([4]).reshape([monthResamplingCount]).as1D();

    const baseDesignStatics = Statics.build(baseDesign);
    const detailDesignStatics = Statics.build(detailDesign);
    const developStatics = Statics.build(develop);
    const integrationTestStatics = Statics.build(integrationTest);
    const systemTestStatics = Statics.build(sytemTest);
    return new DevelopStatics(baseDesignStatics, detailDesignStatics, developStatics, integrationTestStatics, systemTestStatics);
  }

  public print() {
    console.log("base design");
    this.baseDesignStatics.print();
    console.log("detail design");
    this.baseDesignStatics.print();
    console.log("develop");
    this.developStatics.print();
    console.log("integration test");
    this.integrationTestStatics.print();
    console.log("system test");
    this.systemTestStatics.print();
  }
}
