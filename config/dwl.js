/**
 * @author: @davaskwebltd
 */

exports.path = {
  head_config: './src/app/config/head-config.common',
  index: './src/app/root/index.html',
  styles: [ '/node_modules/' ]
};
exports.from = [
  { from: 'src/app/assets/css', to: 'assets/css' },
  { from: 'src/app/assets/dev', to: 'assets/dev' },
  { from: 'src/app/assets/icon', to: 'assets/icon' },
  { from: 'src/app/assets/img', to: 'assets/img' },
  { from: 'src/app/assets/js', to: 'assets/js' },
  { from: 'src/app/root'}
];
exports.theme = {
  title: 'AWS | dwl',
  description: 'Angular2 Webpack Starter Customized by @davaskwebltd',
  author: 'davask web ltd.',
  baseUrl: '/',
  manifest_title: 'davask web',
  theme_color: '#5496c6',
  ga: 'UA-26278829-1'
};
