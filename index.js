import { init } from './app/actions';
import Model from './app/model';
import { render } from './app/state';


const model = new Model(render);

init(model.present);
