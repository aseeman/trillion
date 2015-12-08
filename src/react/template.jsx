export default function template () {
  let rows = this.state.rows || [];
  let indices = this.state.indices || [];

  return (
    <div className="TrillionTable">
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            {
              indices.map((index, i) => {
                if (index.visible) {
                  return <th key={i} onClick={this.sortByHeader.bind(this, i)}>{index.label}</th>;  
                }
              })
            }
          </tr>
        </thead>
        <tbody>
          {
            rows.map(function (row, i) {
              return <tr key={i}>{
                indices.map(function (index, j) {
                  if (index.visible) {
                    return <td key={index.field}>{String(row[index.field].display)}</td>;
                  }
                })
              }</tr>;
            })
          }
        </tbody>
      </table>

      <div className="TrillionTable-pages">
        <button onClick={this.prevPage} type="button" className="btn btn-default">Prev</button><button onClick={this.nextPage} type="button" className="btn btn-default">Next</button>
      </div>
    </div>
  );
}