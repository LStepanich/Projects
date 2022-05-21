'use strict';
console.log('Connected');
const MAX_DISPLAY_LENGTH = 8;
let firstNumber = '';
let secondNumber = '';
let dote = false;

let result = 0;
let roundedResult = 0;
let action;
let long;

const out = document.querySelector('.scoreboard p');

// Button "AC"
function clearAll() {
  firstNumber = '';
  secondNumber = '';
  result = 0;
  dote = false;
  out.textContent = '0';
}
document.querySelector('.ac').addEventListener('click', clearAll);

//button change sign
function changeSign() {
  out.textContent = 0 - +out.textContent;
}
document.querySelector('.plusMinus').addEventListener('click', changeSign);

//number buttons processing
function numberButtonClicked(number) {
  if (number == 0 && out.textContent.length == MAX_DISPLAY_LENGTH && out.textContent == 0) {
    out.textContent = '0';
    dote = false;
  }
  if (out.textContent == '0') out.textContent = '';
  if (out.textContent.length < MAX_DISPLAY_LENGTH) out.textContent += number;
}

document.querySelector('.one').addEventListener('click', () => numberButtonClicked('1'));
document.querySelector('.two').addEventListener('click', () => numberButtonClicked('2'));
document.querySelector('.three').addEventListener('click', () => numberButtonClicked('3'));
document.querySelector('.four').addEventListener('click', () => numberButtonClicked('4'));
document.querySelector('.five').addEventListener('click', () => numberButtonClicked('5'));
document.querySelector('.six').addEventListener('click', () => numberButtonClicked('6'));
document.querySelector('.seven').addEventListener('click', () => numberButtonClicked('7'));
document.querySelector('.eight').addEventListener('click', () => numberButtonClicked('8'));
document.querySelector('.nine').addEventListener('click', () => numberButtonClicked('9'));
document.querySelector('.zero').addEventListener('click', () => numberButtonClicked('0'));

//dote button processing
function doteClicked() {
  if (out.textContent.length < MAX_DISPLAY_LENGTH && !dote) {
    out.textContent += '.';
    dote = true;
  }
}
document.querySelector('.dote').addEventListener('click', doteClicked);

//action button processing
function actionButton(pressedButton) {
  firstNumber = out.textContent;
  out.textContent = '0';
  dote = false;
  action = pressedButton;
}

document.querySelector('.plus').addEventListener('click', () => actionButton('plus'));
document.querySelector('.division').addEventListener('click', () => actionButton('division'));
document
  .querySelector('.multiplication')
  .addEventListener('click', () => actionButton('multiplication'));
document.querySelector('.minus').addEventListener('click', () => actionButton('minus'));

//result calculating
function equal() {
  // if equal pressed with action button
  if (firstNumber != '') {
    secondNumber = out.textContent;
    //division by ZERO
    if ((action == 'division' && secondNumber == '0') || secondNumber == 'ERROR') {
      out.textContent = 'ERROR';
    }
    //action implement
    else {
      if (action == 'plus') result = +firstNumber + +secondNumber;
      if (action == 'minus') result = +firstNumber - +secondNumber;
      if (action == 'multiplication') result = +firstNumber * +secondNumber;
      if (action == 'division') result = +firstNumber / +secondNumber;
      //Big number processing
      if (+result > 99999999 || +result < -99999999) {
        out.textContent = 'ERROR';
      }
      //long result rounding
      else {
        if (String(result).length > MAX_DISPLAY_LENGTH) {
          result = result.toFixed(7 - String(result).indexOf('.'));
        }
        action = '';
        firstNumber = '';
        out.textContent = Number(result);
      }
    }
  }
  // if equal pressed without action button
  else {
    out.textContent = Number(out.textContent);
    if (out.textContent == 0) dote = false;
  }
}

document.querySelector('.equal').addEventListener('click', equal);
