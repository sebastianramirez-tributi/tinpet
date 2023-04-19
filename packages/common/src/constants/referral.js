import {
  WhatsAppOutlined,
  TwitterOutlined,
  FacebookOutlined,
  LinkedinOutlined,
} from '@ant-design/icons'

export const CODE_KEY = '{referral_code}'

/**
 * this link config is shared between apps, if you want to change
 * any link, you have to change it on the locale file.
 *
 * @IMPORTANT remember to use the `{referral_code}` reserved keyword
 * to share the referral code
 */
export const shareSocialInfo = [
  {
    name: 'whatsapp',
    type: WhatsAppOutlined,
    id: 'Share-WhatsApp',
    url: translate('referral.socials.whatsapp'),
  },
  {
    name: 'facebook',
    type: FacebookOutlined,
    id: 'Share-Facebook',
    url: translate('referral.socials.facebook'),
  },
  {
    name: 'linkedin',
    type: LinkedinOutlined,
    id: 'Share-LinkedIn',
    url: translate('referral.socials.linkedin'),
  },
  {
    name: 'twitter',
    type: TwitterOutlined,
    id: 'Share-Twitter',
    url: translate('referral.socials.twitter'),
  },
]
