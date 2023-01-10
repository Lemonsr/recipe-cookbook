const operations = {
  "+": (a, b) => parseFloat(a) + parseFloat(b),
  "-": (a, b) => a - b,
  "x": (a, b) => a * b,
  "÷": (a, b) => b != 0 ? a / b : false,
  "%": a => a / 100,
  "+/-": a => a * -1,
  ".": a => a
};

const btn = document.querySelectorAll("button");
console.log(btn.length);

function infixToPostfix(ops) {
  const stack = [];
  const postfix = [];
  const prec = c => (c == '÷' || c == 'x') ? 2 : 1;
  
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    
    if (op in operations) {
      while (stack.length != 0 && prec(op) <= prec(stack[stack.length - 1])) {
        postfix.push(stack.pop());
      }
      stack.push(op);
    } else {
      postfix.push(op);
    }
  }
  // pop all remaining operators from stack
  while (stack.length != 0) {
    postfix.push(stack.pop());
  }
  console.log("post", postfix);
  return postfix;
}

function evalPostfix(ops) { 
  const stack = [];
  
  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    
    if (!(op in operations)) {
      stack.push(op);
    } else {
      const val1 = stack.pop();
      const val2 = stack.pop();
      
      const result = operations[op](val2, val1);
      if (result == false) {
        return "NaN";
      } 
      stack.push(result);
    }
  }
  return stack.pop();
}

function eval() {
  // convert infix to postfix to eval
  // evaluate answer and return output
  const ops = document.querySelector('.display-input').innerText.split(" ");
  // if input eqn is empty
  if (ops.join().length == 0) {
    return '0';
  }
  
  const postfix = infixToPostfix(ops);
  const value = evalPostfix(postfix);
  
  return value;
}

function updateEqn(btnClicked) {
  const btnText = btnClicked.currentTarget.innerText;
  //console.log(btnText); // The currentTarget event property returns the element whose event listeners triggered the event.
  const input = document.querySelector('.display-input');
  const output = document.querySelector('.display-output');
  // if curr text input is diff type from last text input, add spacing
  const lastInput = input.innerText.split(" ").pop();
  console.log(lastInput);

  if (btnText === 'C') {
    input.innerHTML = input.innerText.slice(0, -lastInput.length);
  } else if (btnText === 'AC') {
    input.innerHTML = '';
  } else if ((btnText === '%' || btnText === "+/-") && !(lastInput in operations)) {
    input.innerText = input.innerText.slice(0, -lastInput.length) + operations[btnText](lastInput);
  } else if (btnText in operations && (lastInput in operations || lastInput === '')
              || !(btnText in operations) && lastInput === '0'
              || btnText === '.' && lastInput.includes('.')
              || btnText === '=') {
    // do not allow input of multiple ops or number input after 0
  } else if (btnText in operations ^ lastInput in operations && btnText !== '.' && lastInput !== '.') { 
    input.innerHTML += " " + btnText;
  } else {
    input.innerHTML += btnText;
  }
  // if button clicked is =, update output too (trigger eval())
  if (btnText === '=') {
    output.innerText = eval();
    output.style.fontSize = Math.min(42, 400 / output.innerText.length) + "px";
  }
}

console.log("==== Running ====");

for (var i = 0 ; i < btn.length; i++) {
  btn[i].addEventListener("click", updateEqn, false); // must add eventlisteners to each btn, not the array
}