import * as states from './states';
import * as view from '../view';
import { openRepo } from '../actions';


function representation(model, present) {
  const state = Object.values(states).find(s => s(model));
  const repr = view[state.name](model, present);

  view.display(repr);
}

function nextAction(model, present) {
  if (model.dialog && !model.dialog.languages) {
    openRepo(model.dialog.fullName, present);
  }
}

// TODO: Resolve next line
// eslint-disable-next-line
export async function render(model, present) {
  representation(model, present);
  nextAction(model, present);
}
