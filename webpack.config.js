const CopyPlugin = require('copy-webpack-plugin');
const ChromeManifestPlugin = require('chrome-manifest-plugin');

module.exports = {
  entry: {
    background: './src/Controller/Background.js',
    popup: './src/Controller/Popup.js',
    contentScript: './src/Controller/Content.js'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/build'
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: './public', to: './' }
      ]
    }),
    new ChromeManifestPlugin({
      fileName: 'manifest.json',
      author: 'david asquiedge - marasit.com',
      version: '4.0.0',
      version_name: 'v4.0.0',
      description: '__MSG_manifest_description__',
      name: '__MSG_manifest_name__',
      short_name: '__MSG_manifest_short_name__',
      update_url: 'https://clients2.google.com/service/update2/crx',
      icons: {
        '16': './assets/icon16.png',
        '48': './assets/icon48.png',
        '128': './assets/icon128.png'
      },
      content_security_policy: 'default-src \'self\' \'unsafe-eval\'; script-src \'self\' \'unsafe-eval\' https://www.google-analytics.com; connect-src *; img-src \'self\' data: *; media-src *; style-src \'self\' \'unsafe-inline\';',
      current_locale: 'en',
      default_locale: 'en',
      key: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAukuxhe/qOHTGwUSF8aPbwdKSSpBcE6PFgOBdIpDfRm80S31twbCgU0DRcEkpOQ5oLA4RjREiZ79NvWaCuhAuEFI/S3ucJJ3bb4pBQu2UOtkt4QKvOcwt8yl11Vqu+zE+GbPkjkK+nptByqEn/LoNN/pUHyUwf/VJXEmZh+V9LcS+26y28Sfz0b7I87MJfIG9ui1xZnlmfKlMm8wwrMKoYdNZpMZCqTePkP3gEgszMznWjahfAb24H0JA8eC227NQz8cq9kJphENITvfNHsdd8/6kNIYI5vKJXBEejqFPg/rHHvWAHzhPFDAMIu1iqfNuqezD0uZI4iaELe2YXD1kRwIDAQAB',
      offline_enabled: true,
      web_accessible_resources: [
        'assets/img/icon128.png'
    ],
      browserAction: {
        defaultTitle: '__MSG_manifest_name__',
        defaultPopup: 'popup.html'
      },
      page_action: {
        default_icon: {
            '19': 'assets/img/icon48.png',
            '38': 'assets/img/icon48.png'
        },
        default_title: '__MSG_manifest_name__'
    },
      background: {
        persistent: true,
        scripts: [
            'assets/dev/hot-reload.js',
            'assets/vendor/jquery-2.0.3/js/jquery-2.0.3.min.js',
            'assets/vendor/dwl/library/extension.chrome.js',
            'assets/vendor/dwl/library/bookmarker.chrome.js',
            'assets/vendor/dwl/js/manager.tags.component.js',
            'assets/vendor/dwl/js/bk.component.js',
            'assets/js/background.fct.js',
            'assets/js/background.js'
        ]
      },
      content_scripts: [
        {
            css: [
                'assets/vendor/dwl/css/content.bk.component.css'
            ],
            js: [
                'assets/vendor/jquery-2.0.3/js/jquery-2.0.3.min.js',
                'assets/js/content.fct.js',
                'assets/js/content.js'
            ],
            matches: [
                '<all_urls>'
            ],
            run_at: 'document_end'
        }
    ],
      permissions: [
        'activeTab',
        'bookmarks',
        'identity',
        'identity.email',
        'management',
        'notifications',
        'storage',
        'tabs',
        'contentSettings',
        '<all_urls>',
        'chrome://favicon/'
    ]
    })
  ]
};
