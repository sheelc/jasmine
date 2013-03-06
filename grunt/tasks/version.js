var grunt = require("grunt");

function gemLib(path) { return './lib/jasmine-core/' + path; }

module.exports = {
  copyToGem: function() {
    var versionRb = grunt.template.process(
      grunt.file.read("grunt/templates/version.rb.jst"),
      { data: { jasmineVersion: global.jasmineVersion }});

    grunt.file.write(gemLib("version.rb"), versionRb);
  }
};
