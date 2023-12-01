function getAvg(weighedParamsArray, mode = 'min') {
  let total = 0;
  let allWeights = 0;

  weighedParamsArray.forEach(weighedParam => {
    allWeights += weighedParam.weight;
    if (mode === 'min') {
      total += (weighedParam.min * weighedParam.weight);
    } else{
      total += (weighedParam.max * weighedParam.weight);
    }
  });

  return total / allWeights;
}

function calculateMisalignmentLikelihood(mode = 'min') {
  const orthogonalityTrue = 100 - Number.EPSILON;
  const moralRealismTrue = 100 - Number.EPSILON;
  const misalignmentImpossible = 100 - ((orthogonalityTrue + moralRealismTrue) / 2);

  const instrumentalConvergence = {
    min: 80,
    max: 95,
    weight: 1
  };

  const AGINotAchievedWithRobustMethods = {
    min: 55,
    max: 80,
    weight: 1
  };

  const interpFails = {
    min: 60,
    max: 75,
    weight: 0.9
  };

  const deceptiveAlignment = {
    min: 5,
    max: 80,
    weight: 1
  };

  const corrigibility = {
    min: 50,
    max: 55,
    weight: 0.6
  };

  const corrigibilityUseless = {
    min: 15,
    max: 90,
    weight: 0.45
  };

  const unforeseenConsequences = {
    min: 15,
    max: 20,
    weight: 0.5
  };

  return getAvg(
    [
      instrumentalConvergence,
      AGINotAchievedWithRobustMethods,
      interpFails,
      deceptiveAlignment,
      corrigibility,
      corrigibilityUseless,
      unforeseenConsequences
    ], mode) - misalignmentImpossible;
}

function calculateSocietalWeights(mode = 'min') {
  const noPause = {
    min: 98,
    max: 99,
    weight: 1
  };

  const noCollab = {
    min: 85,
    max: 90,
    weight: 1
  };

  const otherS = {
    min: 60,
    max: 65,
    weight: 0.1
  };

  const otherA = {
    min: 60,
    max: 65,
    weight: 0.6
  };

  return {
    s: getAvg([noPause, noCollab, otherS], mode),
    a: getAvg([noPause, noCollab, otherA], mode),
  };
}

function calculate() {
  const misalignmentMin = calculateMisalignmentLikelihood('min');
  const societalWeightsMin = calculateSocietalWeights('min');
  console.log('societalWeightsMin', societalWeightsMin);
  const misalignmentMax = calculateMisalignmentLikelihood('max');
  const societalWeightsMax = calculateSocietalWeights('max');

  const notSolvedMin = misalignmentMin + (societalWeightsMin.s / 100);
  // const minSolved = (100 - notSolvedMin);
  const solvedNotAppliedOrMisuseMin = (societalWeightsMin.a / 100);
  console.log('notSolvedMin', notSolvedMin);
  console.log('solvedNotAppliedOrMisuseMin', solvedNotAppliedOrMisuseMin);

  const notSolvedMax = misalignmentMax + (societalWeightsMax.s / 100);
  // const maxSolved = (100 - notSolvedMax);
  const solvedNotAppliedOrMisuseMax = (societalWeightsMax.a / 100);
  console.log('notSolvedMax', notSolvedMax);
  console.log('solvedNotAppliedOrMisuseMax', solvedNotAppliedOrMisuseMax);

  const minRes = (notSolvedMin + solvedNotAppliedOrMisuseMin);
  const maxRes = (notSolvedMax + solvedNotAppliedOrMisuseMax);

  const range = `Range: ${minRes.toFixed(1)}% - ${maxRes.toFixed(1)}%`;
  console.log(range);
  document.querySelector('.range').innerHTML = range;
}

const customVars = [];

function addVariableElToDOM (name, min, max, weight) {
  const customVarsContainer = document.querySelector('.vars');
  console.log('customVarsContainer', customVarsContainer);
  const container = document.createElement('div');
  container.classList.add('customVar');

  const nameEl = document.createElement('p');
  nameEl.innerHTML = `Name: ${name}`;
  const minEl = document.createElement('p');
  minEl.innerHTML = `Min: ${min}`;;
  const maxEl = document.createElement('p');
  maxEl.innerHTML = `Max: ${max}`;;
  const weightEl = document.createElement('p');
  weightEl.innerHTML = `Weight: ${weight}`;
  container.append(nameEl);
  container.append(minEl);
  container.append(maxEl);
  container.append(weightEl);

  customVarsContainer.append(container);
}

function addVariable() {
  const nameEl = document.querySelector('#name');
  const nameVal = nameEl.value;
  nameEl.value = '';

  const minEl = document.querySelector('#min');
  const minVal = parseInt(minEl.value, 10);
  minEl.value = 0;

  const maxEl = document.querySelector('#max');
  const maxVal = parseInt(maxEl.value, 10);
  maxEl.value = 0;

  const weightEl = document.querySelector('#weight');
  const weightVal = parseFloat(weightEl.value);
  weightEl.value = 1;

  customVars.push({
    name: nameVal,
    min: minVal,
    max: maxVal,
    weight: weightVal
  });

  addVariableElToDOM(nameVal, minVal, maxVal, weightVal);
}

function calculateCustom() {
  console.log('customVars', customVars);
  const misalignmentMin = getAvg(customVars, 'min');
  const misalignmentMax = getAvg(customVars, 'max');

  const range = `Range: ${misalignmentMin.toFixed(1)}% - ${misalignmentMax.toFixed(1)}%`;
  console.log(range);
  document.querySelector('.range').innerHTML = range;
}
