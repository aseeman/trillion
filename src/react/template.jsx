export default function template () {
  let rows = this.state.rows || [];
  let indices = this.state.indices || [];

  return (
    <div>
    <table className="table table-striped table-bordered">
      <thead>
        <tr>
          {
            indices.map((index, i) => {
              return <th key={i} onClick={this.sortByHeader.bind(this, i)}>{index.label}</th>;
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
    <div><a href="#" onClick={this.prevPage}>Prev</a> <a href="#" onClick={this.nextPage}>Next</a></div>
    </div>
  );
}