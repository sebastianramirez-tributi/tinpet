import styled from '@emotion/styled'
import { css } from '@emotion/core'
import { media } from '../../../styles/utils'

export const Button = styled('button')(
  ({ theme }) => css`
    width: 3.12rem;
    height: 1.3rem;
    font-size: 0.7rem;
    display: inline-block;
    border-radius: 0.5rem;
    border: 1px solid #ddd;
    background: transparent;
    color: #858585;
    transition: border-color 500ms;
    text-align: center;

    &.primary {
      backgroundColor: ${theme.colors.primary.main},
      border: 2px solid ${theme.colors.white.main},
      borderRadius: 8px,
      color: ${theme.colors.white.main},
      fontFamily: ${theme.fontFamily.body},
      fontStretch: normal,
      fontStyle: normal,
      fontWeight: 600,
      alignItems: center,
      justifyContent: center,
      letterSpacing: normal,
      lineHeight: 1.2,
      transition: 400ms,

      &:disabled {
        pointerEvents: none,
        cursor: default,
      },

      &:enabled:hover {
        backgroundColor: ${theme.colors.white.main},
        borderColor: ${theme.colors.primary.main},
        color: ${theme.colors.primary.main},
      },
    }

    &.success {
      color: ${theme.colors.primary.main};

      &:hover {
        border-color: ${theme.colors.primary.main};
        color: ${theme.colors.primary.main};
      }
    }

    &.danger {
      color: ${theme.colors.danger.main};
      .anticon-delete {
        border: none;
        pointer-events: none;
      }

      &:hover {
        background: ${theme.colors.danger.main};
        color: ${theme.colors.white.main};
        .anticon {
          color: ${theme.colors.white.main};
        }
      }
    }

    &.outstanding {
      padding: 16px 32px;
      background: linear-gradient(to right, #42e0c4, #1fbe92);
      border: none;
      color: #f1f1f1;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);

      &:hover {
        opacity: 0.7;
        color: #f1f1f1;
      }
    }

    &.icon {
      width: 1.3rem;
      height: 1.3rem;
      border: solid 1px #ececec;
      padding: 0px 4px;
      margin-left: 0.4rem;
      border-radius: 50%;
      transition: background 500ms, color 500ms;
      .anticon {
        font-size: 0.7rem;
        color: #333;
      }
    }

    &.full-width {
      display: block;
      width: 100%;
    }

    &.left-icon {
      padding-left: 0.2rem;
    }

    &.outlined {
      border: none;
      height: auto;
      &.danger {
        &:hover {
          background: #fff;
          color: #f5222d;
        }
      }
    }

    ${media.md`
      padding: 4px 16px;
      width: auto;
      height: auto;
      font-size: 0.8rem;
      &.icon {
        width: 1.8rem;
        height: 1.8rem;

        .anticon {
          font-size: 0.9rem;
          margin-right: 0px;
        }
      }
      &.outlined {
        border: 1px solid #ddd;
        width: 100%;
      }
    `}
  `
)
