import { MOUNT_ELEMENT_ID } from './config';
// import * as intents from './intents';
import * as actions from './actions';
import * as theme from '../theme';


export function ready(data, present) {
  return {
    html: theme.welcome(data),

    intent: (parentElement) => {
      parentElement
        .querySelector('form')
        .addEventListener('submit', function searchOwner(event) {
          event.preventDefault();
          actions.loadOwner(this.owner.value, present);
        });
    },

    toString() {
      return this.html;
    },
  };
}


export function owner(data, present) {
  return {
    html: theme.owner(data),

    intent: (parentElement) => {
      parentElement.querySelectorAll('.card').forEach((card) => {
        card
          .querySelector('a')
          .addEventListener('click', (event) => {
            event.preventDefault();
            actions.openRepo(card.getAttribute('data-key'), present);
          });
      });

      parentElement
        .querySelectorAll('#filters input, #filters select')
        .forEach((input) => {
          input.addEventListener('change', () => {
            actions.filter(input, present);
          });
        });

      parentElement
        .querySelector('#sort-criteria')
        .addEventListener('change', (event) => {
          actions.sort(event.target.value, present);
        });
    },

    toString() {
      return this.html;
    },
  };
}

export function dialog(data) {
  return {
    html: theme.repo(data.dialog),

    intent: () => {
      //
    },

    toString() {
      return this.html;
    },
  };
}


export function display(repr) {
  let mountElement = document.getElementById(MOUNT_ELEMENT_ID);

  if (!mountElement) {
    mountElement = document.createElement('div');
    mountElement.id = MOUNT_ELEMENT_ID;
    document.body.appendChild(mountElement);
  }

  mountElement.innerHTML = repr;

  if (repr.intent) {
    repr.intent(mountElement);
  }
}
