export default function template () {
  return (
    <table>
      <thead>
        <tr>
          {
            indices.map(function (index, i) {
              return <th key={i}>{index.label}</th>;
            })
          }
        </tr>
      </thead>
      <tbody>
        {
          this.state.rows.map(function (row, i) {
            return <tr key={i}>{
              row.map(function (field, j) {
                return <td key={j}>{field}</td>;
              })
            }</tr>;
          })
        }
      </tbody>
    </table>
  );
}