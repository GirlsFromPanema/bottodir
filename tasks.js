const fs = require('fs');
const util = require('util');

const DefaultRegistry = require('undertaker-registry');
const del = require('del');

function CommonRegistry(opts){
  DefaultRegistry.call(this);

  opts = opts || {};

  this.buildDir = opts.buildDir || './build';
}

util.inherits(CommonRegistry, DefaultRegistry);

CommonRegistry.prototype.init = function(gulpInst) {
  const buildDir = this.buildDir;
  const exists = fs.existsSync(buildDir);

  if(exists){
    throw new Error('Cannot initialize common tasks. ' + buildDir + ' directory exists.');
  }

  gulpInst.task('clean', function(){
    return del([buildDir]);
  });
}

module.exports = CommonRegistry;