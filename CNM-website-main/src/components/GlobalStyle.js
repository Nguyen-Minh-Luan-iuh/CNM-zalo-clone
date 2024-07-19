import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --color-60: #e0e8ef;
    --color-30: #0091ff;
    --color-10: #1A73E8;
    --blue-message: #e5efff;
    --white-message: #fff;
    --text-primary: #081c36;
    --text-secondary: #7589a3;
    --text-information: #005ae0;
    --text-errors: #d91b1b;
    --button-tertiary-neutral-hover: #dfe2e7;
    --button-tertiary-primary-text: #0068ff;
    --button-tertiary-primary-hover: #e5efff;
    --button-primary-normal: #0068ff;
    --button-primary-hover: #004bb9;
    --button-neutral-normal: #eaedf0;
    --button-neutral-hover: #dfe2e7;
    --button-neutral-text: #081c36;
    --button-tertiary-neutral-focus-bg: #e5efff;
    --button-tertiary-neutral-focus-text: #005ae0;
    --button-tertiary-neutral-hover: #dfe2e7;
    --button-secondary-danger-normal: #fbdfdf;
    --button-secondary-danger-text: #d91b1b;
    --button-secondary-danger-hover: #f9cdcd;
    --button-danger-normal: #c31818;
    --button-danger-text: #fff;
    --button-danger-hover: #9a1313;
    --border: #d6dbe1;
    --border-focused: #0068ff;
    --border-disabled: #c5c9ce;
    --icon-primary: #081c36;
    --icon-secondary: #7589a3;
    --layer-background-hover: #f3f5f6;
    --layer-background-selected: #e5efff;
    --layer-background-leftmenu-selected: #006edc;
    --layer-background-leftmenu-hover: rgba(0, 0, 0, 0.1);
    --field-bg-filled: #eaedf0;
    --color-10: #91caee;
    --color-11: #dce1e8;
    --red-dot: #c31818;
  }

  * {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  input::placeholder {
    color: #778aa4 !important;
  }
`;

export default GlobalStyle;
