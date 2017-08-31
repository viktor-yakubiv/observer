import * as actions from '../actions';

export function searchOwner(event) {
  event.preventDefault();
  actions.loadOwner(event.target.owner, this.present);
}
