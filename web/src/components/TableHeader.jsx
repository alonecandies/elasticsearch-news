import React, { useState } from "react";
import { BiDownArrow, BiUpArrow } from "react-icons/bi";

const TableHeader = ({ headers, onSorting }) => {
  const [sortingField, setSortingField] = useState("");
  const [sortingOrder, setSortingOrder] = useState("asc");

  const onSortingChange = (field) => {
    const order =
      field === sortingField && sortingOrder === "asc" ? "desc" : "asc";

    setSortingField(field);
    setSortingOrder(order);
    onSorting(field, order);
  };

  return (
    <thead>
      <tr>
        {headers.map(({ name, field, sortable, width }) => (
          <th
            key={name}
            onClick={() => (sortable ? onSortingChange(field) : null)}
            style={{ width }}
          >
            {name}

            {sortingField &&
              sortingField === field &&
              (sortingOrder === "asc" ? <BiDownArrow /> : <BiUpArrow />)}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeader;
