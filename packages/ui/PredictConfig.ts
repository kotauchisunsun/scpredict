export type PredictConfig = {
  manHourSamplingCount: number;
  manHourResamplingCount: number;
  monthSamplingCount: number;
  monthResamplingCount: number;
  seed: number;
};

export const config: PredictConfig = {
  manHourSamplingCount: 10000,
  manHourResamplingCount: 100,
  monthSamplingCount: 1000,
  monthResamplingCount: 10000,
  seed: 1
}
