import gulp from 'gulp';
import {build} from 'aurelia-cli';
import project from '../aurelia.json';
import fs from 'fs';
import UglifyJS from 'uglify-js';

export default gulp.series(
  readProjectConfiguration,
  writeBundles,
  minifyBundles
);

function readProjectConfiguration() {
  let sources = [].concat(project.build.bundles);

  sources.forEach(bundle => {
    bundle.prepend = [
      'aurelia_project/preamble.js'
    ];
  });

  return build.src(project);
}

function writeBundles() {
  return build.dest();
}

function minifyBundles() {
  project.build.bundles.map(x => {
    let name = 'scripts/' + x.name;
    let newName = name.replace('.js', '.min.js');

    let contents = fs.readFileSync(name);
    let minificationOptions = { fromString: true };
    let minificationResult = UglifyJS.minify(String(contents), minificationOptions);

    fs.writeFileSync(newName,  minificationResult.code);
  })
}
