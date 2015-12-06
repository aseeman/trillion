export default function template () {
  let rows = this.state.rows || [];
  let indices = this.state.indices || [];

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
          rows.map(function (row, i) {
            return <tr key={i}>{
              indices.map(function (index, j) {
                return <td key={index.field}>{String(row[index.field].display)}</td>;
              })
            }</tr>;
          })
        }
      </tbody>
    </table>
  );
}