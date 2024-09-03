import React, { Component } from "react";
import { Table } from "@finos/perspective";
import { ServerRespond } from "./DataStreamer";
import { DataManipulator } from "./DataManipulator";
import "./Graph.css";

interface IProps {
  data: ServerRespond[];
}

interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void;
}
class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement("perspective-viewer");
  }

  componentDidMount() {
    // Get element from the DOM.
    const elem = (document.getElementsByTagName(
      "perspective-viewer"
    )[0] as unknown) as PerspectiveViewerElement;

    const schema = {
      ratio: "float",
      uthresh: "float",
      lthresh: "float",
      alert: "float",
      timestamp: "date",
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }
    if (this.table) {
      // Load the `table` in the `<perspective-viewer>` DOM reference.
      elem.load(this.table);
      elem.setAttribute("view", "y_line");
      elem.setAttribute("row-pivots", '["timestamp"]');
      elem.setAttribute("columns", '["ratio", "lthresh", "uthresh", "alert"]');
      elem.setAttribute(
        "aggregates",
        JSON.stringify({
          ratio: "avg",
          lthresh: "avg",
          uthresh: "avg",
          alert: "avg",
          timestamp: "distinct count",
        })
      );
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update([DataManipulator.generateRow(this.props.data)] as any);
    }
  }
}

export default Graph;
