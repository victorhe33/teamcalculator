// Utils

function copy_to_clipboard(text) {
  const copyElement = document.createElement('textarea');
  copyElement.value = text;
  document.body.appendChild(copyElement);
  copyElement.select();
  copyElement.setSelectionRange(0, 99999); /* For mobile devices? */
  document.execCommand('copy');
  document.body.removeChild(copyElement);
}

// Operations
const addition = Symbol(['+', '+'])
const subtraction = Symbol(['-', '-'])
const multiplication = Symbol(['*', 'x'])
const division = Symbol(['/', '÷'])

// Functions
const clear = Symbol('AC')
const sign = Symbol('±')
const percent = Symbol('%')

// Symbols
const decimal = Symbol(['.','.']) // second member could be used for locale translation?

// Settings
const max_numbers_on_display = 9;

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

    
    if (!all_clear)
    {
      var div = document.querySelector('.calculator-buttons');
      div.classList.remove('broken');

      this.disable_bug_icon('#jsicon');
      this.disable_bug_icon('#cssicon');
    }

  }

  enable_bug_icon(pID)
  {
    var elem = document.querySelector(pID);
    elem.classList.add('active');
  }

  disable_bug_icon(pID)
  {
    var elem = document.querySelector(pID);
    elem.classList.remove('active');
  }

  do_special_op(op)
  {
    switch(op) {
      case '80085': // Show current time on calculator display
      {
        var now = new Date();
        var current_time = now.getHours() + ':' + now.getMinutes();
        this.enable_bug_icon('#jsicon');
        return current_time;
      }
        
      case '43110':
        var div = document.querySelector('.calculator-buttons');
        div.classList.add('broken');
        this.enable_bug_icon('#cssicon');
        return op;
      case '69420':
        window.location.replace(window.location.href.replace('index.html', 'error.html'));
        break;
      default:
        return op;
        break;
    }
  }

  get_current_value()
  {
    var current_value = this.operator ? this.rval : this.lval;
    return current_value.toString();
  }

  set_current_value(current_value)
  {
    if (this.operator)
      this.rval = current_value;
    else
      this.lval = current_value;
  }

  calculate()
  {
    if (this.lval.length == 0) this.lval = "0";
    var operation = this.lval + this.operator.description[0] + this.rval 
    return eval(operation);
  }

  append_number(num)
  {
    var current_value = this.get_current_value();

    if (current_value.length < max_numbers_on_display)
    {
      if (num != 0) {
        if (current_value[0] == '0' && !current_value.includes(decimal.description[0]))
          current_value = num;
        else
          current_value += num;
      } else {
        if (current_value.includes(decimal.description[0]) || current_value.length == 0 || current_value[0] !== '0')
          current_value+=num;
      }
    }

    this.set_current_value(current_value);

    this.refresh_display();
  }

  append_decimal()
  {
    var decimal_symbol = decimal.description[0];
    var current_value = this.get_current_value();

    if ( ! current_value.includes(decimal_symbol))
      current_value+=decimal_symbol;

    this.set_current_value(current_value);

    this.refresh_display();
  }

  set_sign()
  {
    var current_value = this.get_current_value();

    if (current_value[0] == '-')
      current_value = current_value.slice(1);
    else
    {
      if (!current_value[0] == '0')
        current_value = '-' + current_value;
    }
      
    this.set_current_value(current_value);
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
      {
        var result = 'ERR';
        if (this.rval.length > 0)
          result = this.calculate();
        else
          result = this.do_special_op(this.lval);
        this.clear(true);
        if (result.toString().length > max_numbers_on_display)
        {
          copy_to_clipboard(result);
          this.display.innerText = 'CLIPBOARD';
          this.lval = '0';
          return;
        }
        else
          this.lval = result;
        break;
      }
        

      default:
        break;
    }
    this.refresh_display(zero_display);
  }

  refresh_display(zero_display = false)
  {
    if (zero_display) {this.display.innerText = '0'; return;}

    if (this.operator && this.rval.length > 0)
      this.display.innerText = this.rval;
    else
    {
      if (this.lval.length == 0) this.display.innerText = '0'
      else this.display.innerText = this.lval;
    }
      
  }


}


const numbers_buttons = document.querySelectorAll('.number');
const operators_buttons = document.querySelectorAll('.operator');
const function_buttons = document.querySelectorAll('.function');
const dark_mode_button = document.querySelector('.dark_mode_btn')
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


dark_mode_button.addEventListener('click', () => {
  var style = document.getElementById('page_style');
  if (style.getAttribute('href').includes('darkmode'))
    style.setAttribute('href', 'css/stylesheet.css')
  else
    style.setAttribute('href', 'css/darkmode.css')
})