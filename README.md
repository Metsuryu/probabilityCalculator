Calculator of probabilities.

https://metsuryu.github.io/probabilityCalculator/

Can add named variables with a min, max, and weight values, then they get averaged out by weight, and the resulting range is shown.

I added a preset for my p(doom from AI) calculation, where I calculate the probabilities for AI going catastrophically wrong.

Values in this readme might be outdated, see .js for latest values, this is just plain text to roughly explain the concept.

# Assumptions
- Orthogonality is true = 100-ε%
- Moral realism is false = 100-ε%
- Probability that misalignment is impossible = ε%

# Scenarios
  * Technical [Determines whether alignment is solved]
  - Instrumental convergence applies to AGI = 80-95% Weight:1

  - AGI not achieved with robustly alignable methods = 55-80% Weight:1
  - Interp doesn't hold for stronger models = 60 - 75% Weight:0.9
  - AGI can be deceptively aligned = 5-80% (5% if achieved with robust methods and Interp holds for stronger models, up to 80% if using something else, or interp. becomes harder). Weight:1

  - We don't figure out how to have it prioritize corrigibility = 50-55% Weight:0.6
  - We can't use corrigibility to prevent irreversible catastrophe before it occurs (might not show signs of misalignemnt until it knows we won't be able to correct it) = 90% if deceptive alignment is possible, 15% if not. Weight:0.45
  - Unforeseen alignment issues = 15% Weight:0.6

  * Societal [Does not determine, but influences likelihood of solving alignment (S), and applying it(A)]
  - (S:1) A capability pause doesn't happen or isn't properly enforced = 98% (excludes hardware pause = 99%)
  - (S:1 && A:1) We don't form an international collaboration to work on alignment = 85-90%
  - (S:0.1 && A:0.6) Other coordination issues or non-technical mistakes = 65%

  S is applied to "Alignment not solved" probability after weighted calculation, A is applied to "Alignment solution is not applied" and "Alignment solved and applied, but the AGI is misused".

# Outcomes
  - Alignment not solved to satisfactory degree before we get AGI = 53.3% - 78.5%
  - Alignment solved but not applied properly, or applied, but the AGI is misused = 3.0% - 8.7%
  - Alignment solved and applied = 24.6% - 55.4%
  - Uncertainty = 30%
