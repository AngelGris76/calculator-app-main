const body = document.querySelector(".body");
const themeSwitch = document.querySelector(".theme-switch");
const display = document.querySelector(".calc-display");
const keypad = document.querySelector(".keypad");
const buttonCollection = document.querySelectorAll(".keypad__button");

const themeSelectorOptions = { dark: 1, light: 2, custom: 3 };
let themeSaved;

let operationToRealize;
let firstOperand = null;
let secondOperand = null;

const operations = {
  "+": (operandA, operandB) => {
    return operandA + operandB;
  },
  "-": (operandA, operandB) => {
    return operandA - operandB;
  },
  "*": (operandA, operandB) => {
    return operandA * operandB;
  },
  "/": (operandA, operandB) => {
    if (operandB === 0) {
      throw new Error("division por cero");
    } else {
      return operandA / operandB;
    }
  },
};

const wait100ms = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 100);
  });
};

const isDisplayEmpty = () => {
  if (display.textContent === "0") return true;
  else return false;
};

const resetCalculator = () => {
  display.textContent = "0";
  firstOperand = null;
  secondOperand = null;
};

const addNumber = (number) => {
  if (isDisplayEmpty() && number !== "0" && number !== ".") {
    display.textContent = `${number}`;
    return;
  } else if (!isDisplayEmpty() || number === ".") {
    display.textContent = `${display.textContent}${number}`;
  }
};

const deleteLastNumber = () => {
  const result = display.textContent.slice(0, display.textContent.length - 1);
  return result;
};

const calculate = (firstOperand, secondOperand, mathFunction) => {
  if (isNaN(firstOperand) || isNaN(secondOperand)) {
    throw new Error("Alguno de los operandos no es un numero");
  }
  return operations[mathFunction](firstOperand, secondOperand);
};

if (localStorage.length) {
  themeSaved = localStorage.getItem("theme");
  body.dataset.theme = themeSaved;
  themeSwitch.value = themeSelectorOptions[themeSaved];
} else {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    themeSwitch.value = 1;
  }
  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    themeSwitch.value = 2;
  }
}

themeSwitch.addEventListener("change", () => {
  const themeToStorage =
    Object.keys(themeSelectorOptions)[themeSwitch.valueAsNumber - 1];
  localStorage.setItem("theme", themeToStorage);
  body.dataset.theme = themeToStorage;
});

keypad.addEventListener("click", (e) => {
  const buttonPressed = e.target.dataset.value;
  const buttonPressedNumber = parseInt(buttonPressed);

  if (buttonPressed === "c") {
    resetCalculator();
  }
  if (display.textContent !== "E") {
    const canWriteDot =
      buttonPressed === "." && !display.textContent.includes(".");

    const isNumber = buttonPressedNumber >= 0 && buttonPressedNumber <= 9;

    const isOperand =
      buttonPressed !== "Enter" &&
      !isNumber &&
      buttonPressed !== "." &&
      buttonPressed !== "c" &&
      buttonPressed !== "Backspace";

    if (canWriteDot || isNumber) {
      addNumber(buttonPressed);
    }

    if (buttonPressed === "Backspace") {
      if (display.textContent.length === 1) {
        display.textContent = "0";
      } else {
        display.textContent = deleteLastNumber();
      }
    }

    if (isOperand && firstOperand === null) {
      firstOperand = parseFloat(display.textContent);
      display.textContent = "0";
      operationToRealize = buttonPressed;
    }

    if (buttonPressed === "Enter" && firstOperand !== null) {
      secondOperand = parseFloat(display.textContent);
      try {
        display.textContent = calculate(
          firstOperand,
          secondOperand,
          operationToRealize
        );
      } catch (error) {
        display.textContent = "E";
      }
      firstOperand = null;
      secondOperand = null;
    }
  }
});

document.addEventListener("keydown", (e) => {
  const button = Array.from(buttonCollection).filter(
    (key) => key.dataset.value === e.key
  );
  if (button.length) {
    button[0].click();
  }
});
