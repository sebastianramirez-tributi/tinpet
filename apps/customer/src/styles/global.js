import { css } from '@emotion/core'
import { typographyStyle, media, maxMedia } from '@tributi-co/common'

const globalStyles = (theme) => {
  return css(
    `
    @import url('https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800|Roboto:300,400,400i,500,700,900|Nunito+Sans:400,600,700,800');

    a,
    *::before,
    *::after {
      box-sizing: inherit;
    }

    *,
    a:visited,
    a:active {
      text-decoration: none;
      color: inherit;
    }

    *,
    *:focus {
      outline: none;
    }

    html {
      box-sizing: border-box;
    }

    html,
    body {
      -webkit-font-smoothing: antialiased;
      -webkit-print-color-adjust: exact;
      font-family: ${theme.fontFamily.body};
      font-weight: 400;
      font-size: 16px;
      line-height: 1.5;
      color: ${theme.colors.black.main};
      padding: 0;
      margin: 0;
    }

    *::placeholder {
      font-family: ${theme.fontFamily.body} !important;
    }

    .ant-modal,
    .ant-input,
    .ant-input-number,
    .ant-select-item,
    .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
      color: ${theme.colors.black65};
    }
    .ant-input-affix-wrapper {
      padding-bottom: 0;
      padding-top: 0;

      > .ant-input {
        &,
        &:hover {
          border: none;
          box-shadow: none;
        }
      }

      > .ant-input-lg {
        height: 38px;
      }
    }

    .ant-modal {
      .anticon.anticon-info-circle {
        color: ${theme.colors.icon.pending};
      }

      [data-testid="feedback"] {
        .anticon.anticon-info-circle {
          color: inherit;
        }
      }
    }

    .ant-input-number-disabled {
      color: rgba(0, 0, 0, 0.25);
    }
    .ant-picker-cell-disabled {
      pointer-events: auto;
    }

    // workarround to avoid create another version of SC, delete after next
    // version and once font size in user transcriber will be this one
    .ant-modal-body .ant-col.ant-form-item-label label {
      font-size: 0.875rem;
    }

    .ant-picker-cell-today {
      .ant-picker-cell-inner {
        color: ${theme.colors.text.links.visited};
        font-weight: 700;
        border-color: ${theme.colors.text.links.visited};
      }
      &.ant-picker-cell-disabled .ant-picker-cell-inner {
        color: rgba(0, 0, 0, 0.25);
      }
    }
    .ant-picker-cell:hover:not(.ant-picker-cell-selected):not(.ant-picker-cell-range-start):not(.ant-picker-cell-range-end):not(.ant-picker-cell-range-hover-start):not(.ant-picker-cell-range-hover-end):not(.ant-picker-cell-disabled).ant-picker-cell-in-view
      .ant-picker-cell-inner {
      background: ${theme.colors.green.lily};
    }

    .ant-picker-cell:hover:not(.ant-picker-cell-in-view) .ant-picker-cell-inner,
    .ant-picker-cell:hover:not(.ant-picker-cell-selected):not(.ant-picker-cell-range-start):not(.ant-picker-cell-range-end):not(.ant-picker-cell-range-hover-start):not(.ant-picker-cell-range-hover-end)
      .ant-picker-cell-inner {
      background: none;
    }

    .ant-input {
      height: 32px;
    }

    .ant-btn {
      border-radius: 4px;
    }

    [class='ant-btn'] {
      color: ${theme.colors.black65};
    }

    .ant-btn-dangerous {
      background: ${theme.colors.danger.main};
      color: ${theme.colors.white.main};

      &.ant-btn:active {
        background: ${theme.colors.danger.main};
        color: ${theme.colors.white.main};
      }

      &:hover,
      &:focus {
        background: ${theme.colors.danger.light};
        border-color: ${theme.colors.danger.light};
        color: ${theme.colors.white.main};
      }
    }

    .ant-modal-content {
      border-radius: 4px;
    }

    .ant-modal-confirm-body .ant-modal-confirm-content {
      color: ${theme.colors.black65};
    }

    .ant-col {
      min-height: auto;
    }

    .ant-table-tbody > tr.ant-table-row:hover > td {
      background: ${theme.colors.green.lily};
    }

    .ant-form-item-control {
      line-height: 40px;
    }

    .ant-select-item-option-active:not(.ant-select-item-option-disabled),
    .ant-dropdown-menu-item:hover {
      background-color: ${theme.colors.green.lily};
    }

    .anticon.ant-calendar-picker-icon {
      color: rgba(0, 0, 0, 0.25);
    }

    .anticon-delete {
      align-items: center;
      border-radius: 50%;
      color: ${theme.colors.icon.none};
      display: flex;
      font-size: 1rem;
      justify-content: center;
      padding: 3px;
      transition: 100ms;
    }

    .panel_footer,
    .box-question__buttons {
      background: linear-gradient(
        180deg,
        ${theme.colors.gray.gallery},
        ${theme.colors.white.main}
      );
      border-bottom-right-radius: 15px;
      display: flex;
      justify-content: center;
      border-bottom-left-radius: 15px;
      margin-top: 2rem;
      padding: 0.5rem;
      text-align: center;
    }

    .btn__next {
      border: 2px solid ${theme.colors.primary.main},
      boxShadow: 0 2px 4px 0 ${theme.colors.black10},
      font-size: 20px;
      font-weight: 600;
      margin: 0.5rem 0.2rem;
      min-height: 2rem;
      min-width: 7rem;
      padding: 1rem;
      ${media.md`
      min-height: 2.5rem;
      min-width: 10.5rem;
    `}
    }

    .user_transcriber_wrapper {
      .ant-modal {
        top: 50px;
      }

      .ant-modal-content {
        border-radius: 1rem;
      }

      .ant-modal-header {
        border-bottom: 2px solid ${theme.colors.gray.line};
        border-top-left-radius: 1rem;
        border-top-right-radius: 1rem;
      }

      .ant-modal-footer {
        align-items: center;
        border-top: 2px solid ${theme.colors.gray.line};
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 1rem 0;
        width: 100%;
        @media (min-width: 768px) {
          flex-direction: row;
        }
      }
    }

    .isCalculateField {
      background-color: ${theme.colors.white.main} !important;
    }

    .question-row {
      align-items: center;
      border-bottom: 1px solid ${theme.colors.gray.line};
      display: flex;
      flex-direction: column;
      margin-bottom: 0;
      .ant-form-item-label {
        display: inline-flex;
        max-width: 100%;
        > label {
          height: auto;
        }
      }

      .ant-form-item-control-wrapper {
        margin-bottom: 0.625rem;
      }

      ${media.md`
      flex-direction: row;
      .ant-form-item-control-wrapper {
        margin-left: auto;
        margin-bottom: 0;
      }
    `}

      &:hover {
        background: none;
      }

      .ant-switch {
        width: 47px;
      }

      .ant-switch-checked {
        background-color: ${theme.colors.primary.main};
      }

      .question-form-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;

        .ant-input {
          color: ${theme.colors.black65};
        }

        ${maxMedia.sm`
        justify-content: center;
      `};

        .ant-switch {
          &.ant-switch-checked {
            .ant-switch-inner {
              margin-right: 20px;
              margin-left: 0;
            }
            &::after {
              left: 100%;
              margin-left: -1px;
              transform: translateX(-100%);
            }
          }

          :not(.ant-switch-checked) {
            .ant-switch-inner {
              margin-right: 0;
              margin-left: 20px;
            }
          }

          &::after {
            background-color: ${theme.colors.white.main};
            border-radius: 18px;
            box-shadow: 0 2px 4px 0 rgba(0, 35, 11, 0.2);
            content: ' ';
            cursor: pointer;
            height: 18px;
            left: 1px;
            position: absolute;
            top: 2px;
            transition: all 0.36s cubic-bezier(0.78, 0.14, 0.15, 0.86);
            width: 18px;
          }
        }

        .ant-btn {
          margin-right: 1rem;
        }

        .help-btn {
          border: none;
          box-shadow: none;
          background: transparent;
          display: flex;
          align-items: center;
          margin-right: 0;
          padding-top: 2px;
          svg {
            height: 23px;
            width: 23px;
          }
          &:hover i {
            color: ${theme.colors.primary.main};
          }
        }

        .ant-input-number {
          min-width: 9rem;
          width: 100%;
          margin-top: 0;
        }

        input:read-only {
          border: none;
          box-shadow: none;
          background: transparent;
        }

        select,
        input {
          width: 9rem;
          margin-top: 0;
          ${maxMedia.sm`
          width: 100% !important;
        `};
        }
      }
    }

    .choice-input {
      margin-left: 1rem;
    }

    .anticon-question-circle {
      background: transparent;
      border: none;
      box-shadow: none;
      color: ${theme.colors.iconHelp.main};
      svg {
        height: 20px;
        width: 20px;
      }
    }

    .ant-form-item-label {
      text-align: left;
      .title {
        color: ${theme.colors.iconHelp.main};
        font-size: 15px;
        font-weight: 900;
        margin: 0;
      }
      .title2 {
        color: ${theme.colors.iconHelp.main};
        font-size: 14px;
        font-weight: 900;
      }
      .multichoice {
        color: ${theme.colors.black85};
        font-size: 14px;
        font-weight: 600;
      }
    }

    .anticon-check-circle {
      color: ${theme.colors.icon.none};
    }

    .ant-modal-body {
      font-family: ${theme.fontFamily.body};
    }

    .ant-menu-inline,
    .ant-menu {
      border-right: none;
    }

    .container-radio {
      display: block;
      position: relative;
      cursor: pointer;
      font-size: 22px;
      user-select: none;

      input[type='radio'] {
        width: 1rem !important;
      }

      input:checked ~ .checkmark {
        background-color: ${theme.colors.primary.main};
        &:after {
          background: ${theme.colors.white.main};
          border-radius: 50%;
          content: '';
          height: 8px;
          left: 9px;
          position: absolute;
          top: 9px;
          width: 8px;
        }
      }

      .checkmark {
        position: absolute;
        top: 5px;
        left: -5px;
        height: 25px;
        width: 25px;
        background-color: ${theme.colors.gray.line};
        border-radius: 50%;
        &:hover {
          background-color: ${theme.colors.primary.main};
        }
      }
    }

  em, b, strong {
      font-weight: 700;
    }

    form {
      input.ant-input:focus,
      input.ant-input:hover,
      span.ant-input-affix-wrapper:focus,
      span.ant-input-affix-wrapper:hover,
      span.ant-input-affix-wrapper-focused,
      div.ant-select-selector:focus,
      div.ant-select-selector:hover {
        border-color: ${theme.colors.primary.main};
        box-shadow: 0 0 0 1px ${theme.colors.primary.main};
      }
      input.ant-input-lg {
        font-size: 14px;
        height: 40px;
      }
      .ant-input,
      .ant-input-affix-wrapper,
      div.ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input)
        .ant-select-selector,
      div.ant-select:not(.ant-select-customize-input) .ant-select-selector {
        border-radius: 4px;

        &:focus,
        &:hover {
          border-color: ${theme.colors.primary.main};
          box-shadow: 0 0 0 1px ${theme.colors.primary.main};
        }
      }

      div.ant-select-focused:not(.ant-select-disabled).ant-select:not(.ant-select-customize-input)
        .ant-select-selector {
        border-color: ${theme.colors.primary.main};
        box-shadow: 0 0 0 1px ${theme.colors.primary.main};
      }

      div.ant-col {
        width: 100%;
      }

      input.ant-checkbox-input:focus + .ant-checkbox-inner {
        border-color: ${theme.colors.primary.main};
      }
      .ant-checkbox-wrapper:hover .ant-checkbox-inner,
      .ant-checkbox:hover .ant-checkbox-inner {
        border-color: ${theme.colors.primary.main};
      }
      span.ant-checkbox-checked {
        span.ant-checkbox-inner {
          background-color: ${theme.colors.primary.main};
          border-color: ${theme.colors.primary.main};
        }
      }
      .ant-radio-wrapper,
      .ant-select {
        color: ${theme.colors.black65};
      }
    }
    div.ant-popover-inner {
      border-radius: 1rem;
      div.ant-popover-inner-content {
        padding: 12px 16px;
        color: ${theme.colors.black65};

        .ant-popover-message {
          position: relative;
          padding: 4px 0 12px;
          color: ${theme.colors.black65};
          font-size: 14px;
        }

        .anticon-exclamation-circle:not([force-visible]) {
          display: none;
        }

        div.ant-popover-message-title {
          font-weight: 700;
          padding-left: 0;
        }
        button.ant-btn {
          height: 30px;
          border-radius: 10px;
          color: ${theme.colors.primary.main};
        }
        button.ant-btn-primary,
        button.ant-btn-primary:hover {
          background-color: ${theme.colors.primary.main};
          color: ${theme.colors.white.main};
          border: 1px solid ${theme.colors.primary.main};
        }
      }
    }
    div.ant-form-explain {
      text-align: center;
      font-size: 14px;
      font-weight: 400;
      padding: 5px 0;
    }
    div.ant-form-item-label > label {
      color: ${theme.colors.black60};
      font-weight: 600;
    }

    ul.ant-menu:not(.ant-menu-horizontal) {
      li.ant-menu-item-selected {
        background-color: #e8fdf8;
      }
    }

    div.ant-select-selection:active,
    div.ant-select-selection:focus,
    div.ant-select-selection:hover {
      border-color: ${theme.colors.primary.main};
      box-shadow: 0 0 0 1px ${theme.colors.primary.main};
    }

    .ant-spin-dot-item {
      background-color: ${theme.colors.primary.main};
    }

    @supports (-moz-appearance: none) {
      select {
        -moz-appearance: none !important;
        background: transparent
          url('data:image/gif;base64,R0lGODlhBgAGAKEDAFVVVX9/f9TU1CgmNyH5BAEKAAMALAAAAAAGAAYAAAIODA4hCDKWxlhNvmCnGwUAOw==')
          right center no-repeat !important;
        background-position: calc(100% - 5px) center !important;
      }
    }

    button:disabled {
      cursor: default !important;
    }

    @keyframes blinking-shadow {
      0% {
        box-shadow: 0px 0px 5px 0px ${theme.colors.primary.main};
      }
      25% {
        box-shadow: 0px 0px 10px 0px ${theme.colors.primary.main};
      }
      50% {
        box-shadow: 0px 0px 15px 0px ${theme.colors.primary.main};
      }
      75% {
        box-shadow: 0px 0px 10px 0px ${theme.colors.primary.main};
      }
      100% {
        box-shadow: 0px 0px 5px 0px ${theme.colors.primary.main};
      }
    }

    ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(
      (k) => `${k}, .${k}, .${k}-sm {${typographyStyle(k)}}`
    )}

    ${media.md`
    ${['h1', 'h2', 'h3', 'h4', 'h5'].map(
      (k) => `${k}, .${k} { ${typographyStyle(`lg.${k}`)} }`
    )}
  `}

  ${['h1', 'h2', 'h3', 'h4', 'h5'].map(
    (k) => `.${k}-lg { ${typographyStyle(`lg.${k}`)} }`
  )}

  ${['p1', 'p2', 'l1', 'l2'].map((k) => `.${k} {${typographyStyle(k)}}`)}

    .d-block {
      > div {
        width: 100%;
        padding: 0 1rem;
        ${media.md`
        padding: 0 2rem;
      `}
      }
    }
  `,
    `
    .summary-free-partner-modal {
      .ant-modal-confirm-btns {
        .ant-btn + .ant-btn {
          margin: 0;
          margin-top: 8px;
        }
      }
    }
  `,
    `.grecaptcha-badge {
      visibility: hidden;
  }
  `
  )
}

export default globalStyles
