export default function template () {
  return (
    <table>
      <thead>
        <tr>
          {
            this.state.indices.map(function (index, i) {
              return <th key={i}>{index.label}</th>;
            })
          }
        </tr>
      </thead>
      <tbody>
        {
          this.state.rows.map(function (row, i) {
            return <tr key={i}>{
              this.state.indices.map(function (index, j) {
                return <td key={index.field}>{String(row[index.field].display)}</td>;
              })
            }</tr>;
          })
        }
      </tbody>
    </table>
  );
}