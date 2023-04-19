export default {
  init: () => {
    const SEGMENT_KEY = process.env.SEGMENT_KEY
    if (SEGMENT_KEY) {
      ;(function () {
        var t, e, a
        var analytics = (window.analytics = window.analytics || [])
        if (!analytics.initialize) {
          if (analytics.invoked) {
            window.console &&
              console.error &&
              console.error('Segment snippet included twice.')
          } else {
            analytics.invoked = !0
            analytics.methods = [
              'trackSubmit',
              'trackClick',
              'trackLink',
              'trackForm',
              'pageview',
              'identify',
              'reset',
              'group',
              'track',
              'ready',
              'alias',
              'debug',
              'page',
              'once',
              'off',
              'on',
            ]
            analytics.factory = function (t) {
              return function () {
                var e = Array.prototype.slice.call(arguments)
                e.unshift(t)
                analytics.push(e)
                return analytics
              }
            }

            for (t = 0; t < analytics.methods.length; t++) {
              e = analytics.methods[t]
              analytics[e] = analytics.factory(e)
            }
            analytics.load = function (t, e) {
              var n = document.createElement('script')
              n.type = 'text/javascript'
              n.async = !0
              n.src = `https://cdn.segment.com/analytics.js/v1/${t}/analytics.min.js`
              a = document.getElementsByTagName('script')[0]
              a.parentNode.insertBefore(n, a)
              analytics._loadOptions = e
            }
            analytics.SNIPPET_VERSION = '4.1.0'
            analytics.load(SEGMENT_KEY)
            analytics.page()
          }
        }
      })()
      const infoUser = localStorage.getItem('infoUser')
      if (infoUser) {
        const user = JSON.parse(infoUser)
        analytics.identify(
          parseInt(user.id),
          {
            email: user.email,
            firstname: user.first_name,
            lastname: user.last_name,
          },
          () => {
            analytics.track('continue')
          }
        )
      }
    } else {
      //mocking segment interface in order to allow developers work without a segment key
      window.analytics = (function () {
        var noop = function (a, b, callback) {
          if (callback && typeof callback === 'function') {
            console.log('WARINIG: Executing callback with segment mock')
            callback()
          }
        }
        return {
          identify: noop,
          track: noop,
          page: noop,
          screen: noop,
          group: noop,
          alias: noop,
        }
      })()
    }
  },
}
