//jshint esversion:6

module.exports.getDate = function() {
  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };

  return new Date().toLocaleDateString("en-AU", options);
};

module.exports.getDay = function() {
  let options = {
    weekday: 'long'
  };

  return new Date().toLocaleDateString("en-AU", options);
};
