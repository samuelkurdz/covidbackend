
const convertToDays = (periodType, timeToElapse) => {
  switch (periodType) {
    case 'weeks':
      return timeToElapse * 7;
    case 'months':
      return timeToElapse * 30;
    default:
      return timeToElapse;
  }
};

const fifteenPercent = (infectionsByRequestedTime) => Math.trunc(0.15 * infectionsByRequestedTime);

const availableBeds = (totalHospitalBeds, severeCasesByRequestedTime) => {
  const availableBedSpace = 0.35 * totalHospitalBeds;
  return Math.trunc(availableBedSpace - severeCasesByRequestedTime);
};

const ICUcare = (infectionsByRequestedTime) => Math.trunc(0.05 * infectionsByRequestedTime);

const ventilators = (infectionsByRequestedTime) => Math.trunc(0.02 * infectionsByRequestedTime);

const dollarsInFlightCalc = (
  infectionsByRequestedTime,
  avgDailyIncome,
  avgDailyIncomePercent,
  days
) => {
  const value = (infectionsByRequestedTime * avgDailyIncome * avgDailyIncomePercent) / days;
  return Math.trunc(value);
};

const covid19ImpactEstimator = (data) => {
  const outputData = {
    data: null,
    impact: {},
    severeImpact: {}
  };

  // destructuringthe data Object
  const {
    timeToElapse,
    reportedCases,
    periodType,
    totalHospitalBeds
  } = data;
  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = data.region;
  const { impact, severeImpact } = outputData;
  outputData.data = data;
  impact.currentlyInfected = reportedCases * 10;
  severeImpact.currentlyInfected = reportedCases * 50;
  const days = convertToDays(periodType, timeToElapse);
  const factor = 2 ** Math.trunc(days / 3);
  impact.infectionsByRequestedTime = impact.currentlyInfected * factor;
  severeImpact.infectionsByRequestedTime = severeImpact.currentlyInfected * factor;
  impact.severeCasesByRequestedTime = fifteenPercent(
    impact.infectionsByRequestedTime
  );
  severeImpact.severeCasesByRequestedTime = fifteenPercent(
    severeImpact.infectionsByRequestedTime
  );
  impact.hospitalBedsByRequestedTime = availableBeds(
    totalHospitalBeds,
    impact.severeCasesByRequestedTime
  );
  severeImpact.hospitalBedsByRequestedTime = availableBeds(
    totalHospitalBeds,
    severeImpact.severeCasesByRequestedTime
  );
  impact.casesForICUByRequestedTime = ICUcare(impact.infectionsByRequestedTime);
  severeImpact.casesForICUByRequestedTime = ICUcare(
    severeImpact.infectionsByRequestedTime
  );
  impact.casesForVentilatorsByRequestedTime = ventilators(
    impact.infectionsByRequestedTime
  );
  severeImpact.casesForVentilatorsByRequestedTime = ventilators(
    severeImpact.infectionsByRequestedTime
  );
  impact.dollarsInFlight = dollarsInFlightCalc(
    impact.infectionsByRequestedTime,
    avgDailyIncomePopulation,
    avgDailyIncomeInUSD,
    days
  );
  severeImpact.dollarsInFlight = dollarsInFlightCalc(
    severeImpact.infectionsByRequestedTime,
    avgDailyIncomePopulation,
    avgDailyIncomeInUSD,
    days
  );
  return outputData;
};

module.exports = covid19ImpactEstimator;