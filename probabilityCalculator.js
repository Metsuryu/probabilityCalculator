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
    min: 85,
    max: 95,
    weight: 0.8
  };

  const AGINotAchievedWithRobustMethods = {
    min: 20,
    max: 80,
    weight: 0.8
  };

  const interpFails = {
    min: 14,
    max: 65,
    weight: 0.6
  };

  const deceptiveAlignment = {
    min: 5,
    max: 65,
    weight: 0.8
  };

  const corrigibility = {
    min: 19,
    max: 45,
    weight: 0.8
  };

  const corrigibilityUseless = {
    min: 15,
    max: 70,
    weight: 0.45
  };

  const unforeseenConsequences = {
    min: 14,
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
  const noCollab = {
    min: 80,
    max: 90,
    weight: 1
  };

  /* Influences probability of solving alignment */
  const otherSolve = {
    min: 38,
    max: 63,
    weight: 0.1
  };

  /* Influences probability of applying alignment */
  const otherApply = {
    min: 35,
    max: 65,
    weight: 0.6
  };

  return {
    solve: getAvg([noCollab, otherSolve], mode),
    apply: getAvg([noCollab, otherApply], mode),
  };
}

function getRange(num1, num2) {
  if (num1 < num2) {
    return `${num1.toFixed(1)}% - ${num2.toFixed(1)}%`;
  } else {
    return `${num2.toFixed(1)}% - ${num1.toFixed(1)}%`;
  }
}

function calculate() {
  const misalignmentMin = calculateMisalignmentLikelihood('min');
  const societalWeightsMin = calculateSocietalWeights('min');
  const misalignmentMax = calculateMisalignmentLikelihood('max');
  const societalWeightsMax = calculateSocietalWeights('max');

  const notSolvedMin = misalignmentMin + (societalWeightsMin.solve / 100);
  const minSolved = (100 - notSolvedMin);
  const solvedNotAppliedOrMisuseMin = minSolved - (minSolved * (societalWeightsMin.apply / 100));

  const notSolvedMax = misalignmentMax + (societalWeightsMax.solve / 100);
  const maxSolved = (100 - notSolvedMax);
  const solvedNotAppliedOrMisuseMax = maxSolved - (maxSolved * (societalWeightsMax.apply / 100));

  const minSNAM = solvedNotAppliedOrMisuseMin < solvedNotAppliedOrMisuseMax ? solvedNotAppliedOrMisuseMin : solvedNotAppliedOrMisuseMax;
  const maxSNAM = solvedNotAppliedOrMisuseMin < solvedNotAppliedOrMisuseMax ? solvedNotAppliedOrMisuseMax : solvedNotAppliedOrMisuseMin;

  const minRes = (notSolvedMin + minSNAM);
  const maxRes = (notSolvedMax + maxSNAM);

  const uncertainty = 30;

  const range = `
  <p>Not solved range: ${getRange(notSolvedMin, notSolvedMax)}</p>
  <p>Solved but not applied or misused range: ${getRange(solvedNotAppliedOrMisuseMin, solvedNotAppliedOrMisuseMax)}</p>
  <p>Not solved, applied, or misused (total) range: ${getRange(minRes, maxRes)}</p>
  <p>Solved range: ${getRange(minSolved, maxSolved)}</p>
  <p>Uncertainty on all values: ${uncertainty}%</p>`;
  document.querySelector('.range').innerHTML = range;
}

let customVars = [];

function addVariableElToDOM (name, min, max, weight) {
  const customVarsContainer = document.querySelector('.vars');
  const container = document.createElement('div');
  container.classList.add('customVar');
  container.id = name;

  const removeCustomVar = () => {
    customVars = customVars.filter(el => el.name !== name);
    document.querySelector(`#${name}`)?.remove();
  };

  const nameEl = document.createElement('p');
  nameEl.innerHTML = `Name: ${name}`;
  const minEl = document.createElement('p');
  minEl.innerHTML = `Min: ${min}`;;
  const maxEl = document.createElement('p');
  maxEl.innerHTML = `Max: ${max}`;;
  const weightEl = document.createElement('p');
  weightEl.innerHTML = `Weight: ${weight}`;
  const remove = document.createElement('div');
  remove.classList.add('removeEl');
  remove.onclick = removeCustomVar.bind(this);
  remove.innerHTML = '[X]';
  container.append(remove);
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

  const range = `Range: ${getRange(misalignmentMin, misalignmentMax)}`;
  console.log(range);
  document.querySelector('.range').innerHTML = range;
}

function saveCustomToCookies() {
  localStorage.setItem('customVars', JSON.stringify(customVars));
}

function loadCustomVars() {
  const loaded = JSON.parse(localStorage.getItem('customVars'));
  customVars = loaded;
  loaded.forEach(loadedVar => {
    addVariableElToDOM(loadedVar.name, loadedVar.min, loadedVar.max, loadedVar.weight);
  });
}
