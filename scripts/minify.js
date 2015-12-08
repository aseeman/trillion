require('shelljs/global');

cd('dist');

rm('*.min.js');

ls('*.js').forEach(function (file) {
  console.log('Minifying', file);
  var minName = file.replace('.js', '.min.js');
  exec('uglifyjs ' + file + ' -o ' + minName);
});