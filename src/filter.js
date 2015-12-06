export function Match (haystack, needle) {
  return haystack.indexOf(needle) !== -1;
}

const filters = {
  'match': Match
};

export default function (type, field, value) {
  const name = `${type}-${field}-${value}`;
  let fn = function () {
    return true;
  };

  if (filters[type]) {
    fn = function (data) {
      return filters[type](data[field].raw, value)
    };
  }

  fn._name = name;

  return fn;
};