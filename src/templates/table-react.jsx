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
              indices.map(function (index, j) {
                return <td key={index.field}>{String(row[index.field].displayValue)}</td>;
              })
            }</tr>;
          })
        }
      </tbody>
    </table>
  );
}