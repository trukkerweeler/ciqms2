import { loadHeaderFooter } from './utils.mjs';
// loadHeaderFooter();

// hide the main-nav element
// document.querySelector('#main-nav').style.display = 'none';

// append the button ncm with an anchor to ncms.html
const ncmButton = document.querySelector('#ncm');
ncmButton.addEventListener('click', () => {
  window.location.href = 'ncms.html';
});

// append the button ca with an anchor to corrective.html
const caButton = document.querySelector('#ca');
caButton.addEventListener('click', () => {
  window.location.href = 'corrective.html';
});

// append the button ca with an anchor to corrective.html
const sysDocButton = document.querySelector('#sysdoc');
sysDocButton.addEventListener('click', () => {
  window.location.href = 'documents.html';
});

// append the button ca with an anchor to corrective.html
const supplierButton = document.querySelector('#supplier');
supplierButton.addEventListener('click', () => {
  window.location.href = 'suppliers.html';
});