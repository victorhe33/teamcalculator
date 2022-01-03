
// Operations
const addition = Symbol(['+', '+'])
const subtraction = Symbol(['-', '-'])
const multiplication = Symbol(['*', 'x'])
const division = Symbol(['/', '⁒'])

// Functions
const clear = Symbol('AC')
const sign = Symbol('±')
const percent = Symbol('%')

// Symbols
const decimal = Symbol(['.','.']) // second member could be used for locale translation?


class Calculator {
  constructor(display)
  {
    this.lval = '';
    this.rval = '';
    this.operator = undefined;
    this.display = display;
  }

  clear(all_clear = false)
  {
    this.lval = '';
    this.rval = '';
    this.operator = undefined;
  }

  calculate()
  {
    var operation = this.lval + this.operator.description[0] + this.rval 
    return eval(operation)
  }

  append_number(num)
  {
    if (this.operator)
      this.rval+=num;
    else
      this.lval+=num;

    this.refresh_display();
  }

  append_decimal()
  {
    var decimal_symbol = decimal.description[0];
    if (this.operator) { if (! this.rval.includes(decimal_symbol)) {this.rval+=decimal_symbol} }
    else { if (! this.lval.includes(decimal_symbol)) {this.lval+=decimal_symbol} }
    this.refresh_display();
  }

  set_sign()
  {
    if (this.operator)
      if (this.rval[0] == '-')
        this.rval = this.rval.slice(1);
      else
        this.rval = '-' + this.rval;
    else
      if (this.lval[0] == '-')
        this.lval = this.lval.slice(1);
      else
        this.lval = '-' + this.lval;
  }
  
  set_percent()
  {
    if (this.operator)
      this.rval = this.rval/100;
    else
      this.lval = this.lval/100;
  }

  set_operator(op)
  {
    switch (op) {
      case 'add':
        this.operator = addition;
        break;
      case 'subtract':
        this.operator = subtraction;
        break;
      case 'multiply':
        this.operator = multiplication;
        break;
      case 'divide':
        this.operator = division;
        break;

      default:
        this.operator = undefined;
        break;
    }
    this.refresh_display();
  }

  do_function(op)
  {
    var zero_display = false;
    switch (op) {
      case 'clear':
        this.clear();
        zero_display = true;
        break;
      case 'sign':
        this.set_sign();
        break;
      case 'percent':
        this.set_percent();
        break;

      case 'calculate':
        var result = this.calculate();
        this.clear(true);
        this.lval = result;
        break;

      default:
        break;
    }
    this.refresh_display(zero_display);
  }

  refresh_display(zero_display = false)
  {
    if (zero_display) {this.display.innerText = '0'; return;}

    this.display.innerText = this.lval;

    if (this.operator)
      this.display.innerText += this.operator.description[2];

    this.display.innerText += this.rval;
  }


}


const numbers_buttons = document.querySelectorAll('.number');
const operators_buttons = document.querySelectorAll('.operator');
const function_buttons = document.querySelectorAll('.function');
calculator = new Calculator(document.querySelector('.calculator-display'));

numbers_buttons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.action == 'decimal')
      calculator.append_decimal();
    else
      calculator.append_number(button.innerText);
  })
})

operators_buttons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.set_operator(button.dataset.action);
  })
})

function_buttons.forEach(button => {
  button.addEventListener('click', () => {
    calculator.do_function(button.dataset.action);
  })
})