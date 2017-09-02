import * as states from './states';
import * as view from '../view';
import { updateRoute } from '../router';


function representation(model) {
  const state = Object.values(states).find(s => s(model));
  const repr = view[state.name](model.data, model.present);

  view.display(repr);
}

// function nextAction(model) {
//   const present = model.present;
//   Take action with present
// }

// TODO: Resolve next line
// eslint-disable-next-line
export async function render(model) {
  representation(model);
  updateRoute(model);
  // nextAction(model);
}
