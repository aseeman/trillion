export default function (type, field, value) {
  const name = `${type}-${field}-${value}`;
  let fn = function () {
    return true;
  };

  if (type === 'match') {
    fn = function (data) {
      return data[field].raw.indexOf(value) !== -1;
    };
  }

  fn._name = name;

  return fn;
};