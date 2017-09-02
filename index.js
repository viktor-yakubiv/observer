import { init, restoreState } from './app/actions';
import Model from './app/model';
import { render } from './app/state';


const model = new Model(render);

init(window.location, model.present);

window.addEventListener('popstate', (event) => {
  restoreState(event.state, model.present);
});
