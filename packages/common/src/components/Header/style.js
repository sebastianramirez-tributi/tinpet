import styled from '@emotion/styled'
import { css } from '@emotion/core'
import Button from 'antd/lib/button'
import { media } from '../../styles/utils'
import { Drawer, Menu } from 'antd'

export const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const FilingDetails = styled.span(
  ({ theme }) => `
    align-self: center;
    color: ${theme.colors.text.backgroundContrast};
    display: flex;
    flex-direction: column;
    font-size: 0.8rem;
    margin-top: 0.25rem;
    padding: 0px 12.5% 0px;

    & > .item {
      text-align: center;
    }
  `,
  ({ theme }) => media.md`
    align-items: center;
    align-self: flex-end;
    display: flex;
    flex-direction: row;

    & > .item:not(:last-of-type):after {
      border-right: 1px solid ${theme.colors.text.backgroundContrast};
      content: "";
      height: 1rem;
      margin: 0 0.5rem;
    }
  `
)

export const Container = styled('div')(
  (props) => css`
    align-items: center;
    background-color: ${props.theme.colors.white.main};
    border: 1px solid ${props.theme.colors.gray.line};
    box-shadow: 0 2px 9px 0 ${props.theme.colors.black06};
    display: flex;
    height: 3.4rem;
    justify-content: space-between;
    margin-bottom: 0.3rem;
    width: 100%;
    padding-left: 5%;
    z-index: 999;

    ${media.md`
    padding: 0px 12.5% 0px;
  `}
    ${media.lg`
    height: 4.125rem;
  `}

  @media print {
      display: none;
    }
  `
)

export const Tributi = styled('img')`
  width: 10.6rem;
  height: 2.1rem;
  ${media.lg`
    width: 11.75rem;
    height: auto;
  `}
`

export const ButtonOpen = styled(Button)(
  (props) => css`
    border-color: ${props.theme.colors.white.main};
    padding: 0;
    color: ${props.theme.colors.primary.main};
    font-size: 1.8rem;
    background-color: ${props.theme.colors.white.main};
    margin-top: -3px;
    &:hover {
      border-color: ${props.theme.colors.white.main};
      color: ${props.theme.colors.primary.main};
      background-color: ${props.theme.colors.white.main};
    }

    display: inline-block;

    .anticon {
      display: inline-block;
    }
  `,
  media.lg`
    display: none;
  `
)

export const LinkDrawer = styled.a(
  ({ theme }) => css`
    align-items: center;
    border-radius: 0.5rem;
    border: solid 1px ${theme.colors.gray.alto};
    box-shadow: 0 2px 4px 0 ${theme.colors.black15};
    color: ${theme.colors.black45};
    display: none;
    font-size: 16px;
    font-weight: 400;
    padding: 5px 10px;
    span {
      margin-right: 0.6rem;
    }

    span.anticon.anticon-down {
      font-size: 12px;
      margin-right: 0;
      padding: 0 1px;
    }
    &:hover {
      color: ${theme.colors.primary.main};
      text-decoration: underline;
    }
    ${media.lg`
      display: flex;
    `}
  `
)

export const DrawerMenu = styled(Drawer)`
  div.ant-drawer-body {
    padding: 0px;
  }
`

export const HeaderDrawer = styled('div')(
  (props) => css`
    background-image: linear-gradient(
      104deg,
      ${props.theme.colors.primary.brighter} 5%,
      ${props.theme.colors.primary.main} 97%
    );
    width: 100%;
    border-bottom: 1px solid ${props.theme.colors.gray.line};
    color: ${props.theme.colors.white.main};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    padding: 1.4rem;
    font-size: 1rem;
    div {
      background: white;
      border-radius: 1.8rem;
      width: 3.75rem;
      height: 3.75rem;
      align-items: center;
      justify-content: center;
      display: flex;
      border: 1px solid ${props.theme.colors.gray.line};
      box-shadow: 1px 1px 6px 0 ${props.theme.colors.black15};
      margin-bottom: 0.9rem;
      img {
        width: 1.8rem;
        height: 1.8rem;
        margin-bottom: 3px;
      }
    }

    span:first-of-type {
      font-weight: bold;
    }
    i {
      font-size: 2.5rem;
      margin-bottom: 0.6rem;
    }
  `
)

export const BodyDrawer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  text-align: end;
`

export const MenuDrawer = styled(Menu)(
  (props) => css`
    width: 100%;
    margin-top: 0.75rem;

    li {
      font-size: 0.9rem;
      padding: 0 16px;
      text-align: right;

      &.ant-menu-item-selected {
        background-color: ${props.theme.colors.table.expand};
        a {
          color: ${props.theme.colors.black65};
        }
      }

      a {
        color: ${props.theme.colors.black65};

        &:hover {
          color: inherit;
        }
      }

      .anticon {
        margin-left: 0.6rem;
      }
      .anticon {
        margin-left: 0.6rem;
      }
    }

    .item-invite-friends {
      padding: 1.625rem 1rem;
    }
  `
)

export const Item = styled(Menu.Item)`
  display: flex;
  justify-content: flex-end;
`

export const ButtonItem = styled(Menu.Item)(
  `
    align-items: center;
    display: flex;
    justify-content: flex-end;
  `,
  media.lg`
	    display: none;
	`
)

export const BannerButtonContainer = styled.div(
  `
  display: flex;
  flex-direction: column;
  gap: 1rem;
  `,
  ({ withGap }) =>
    !withGap &&
    media.lg`
      gap: unset
  `
)

export const Content = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;

  span {
    display: none;
  }

  div.ant-divider {
    display: none;
  }

  ${media.lg`
    display: flex;
    span {
      display: block;
    }
    div.ant-divider {
      display: block;
      height: 100%;
    }
  `}
`

export const TributiLogo = styled.img`
  width: 5.7rem;
  ${media.lg`
    width: 8rem;
  `}
`
export const TributiIcon = styled.img`
  width: 2rem;
`

export const HeaderLabel = styled.span`
  font-size: 13px;
`
export const ContainerLink = styled('div')`
  align-items: center;
  display: flex;
  justify-content: flex-end;
  padding-right: 0.2rem;
`
