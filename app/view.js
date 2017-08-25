import { MOUNT_ELEMENT_ID } from './config';


export function ready() {
  return 'Hello';
}

export function owner(data) {
  return `owner ${data.owner.name}`;
}

export function repo(data) {
  return `repo ${data.repo.name}`;
}


export function display(repr) {
  let mountElement = document.getElementById(MOUNT_ELEMENT_ID);

  if (!mountElement) {
    mountElement = document.createElement('div');
    mountElement.id = MOUNT_ELEMENT_ID;
    document.body.appendChild(mountElement);
  }

  mountElement.innerHTML = repr;
}
