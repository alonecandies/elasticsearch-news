import React, { useEffect, useState, useMemo } from "react";
import { TableHeader } from "./components";
import { BiSearch } from "react-icons/bi";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const [journals, setJournal] = useState([]);
  const [sorting, setSorting] = useState({ field: "", order: "" });
  const [searchAll, setSearchAll] = useState("");
  const [domain, setDomain] = useState("");
  const [URL, setURL] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");

  const ITEMS_PER_PAGE = 30;

  const headers = [
    { name: "ID", field: "id", sortable: false, width: "5%" },
    { name: "Domain", field: "domain", sortable: true, width: "10%" },
    { name: "URL", field: "url", sortable: true, width: "15%" },
    { name: "Date", field: "date", sortable: true, width: "10%" },
    { name: "Category", field: "category", sortable: false, width: "10%" },
    { name: "Content", field: "content", sortable: false, width: "50%" },
  ];

  const handleSearchAll = () => {
    axios
      .post("http://localhost:4000/searchAll", {
        query: searchAll,
      })
      .then((res) => {
        setJournal(res.data);
      });
  };

  const handleSearchQuery = () => {
    axios
      .post("http://localhost:4000/search", {
        domain,
        URL,
        content,
        date,
        category,
      })
      .then((res) => {
        console.log(res);
        setJournal(res.data);
      });
  };

  const fetchData = () => {
    axios.get("http://localhost:4000/getAll").then((res) => {
      setJournal(res.data);
    });
  };

  const handleGetAll = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const journalsData = useMemo(() => {
    let computedJournals = journals;

    //Sorting
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedJournals = computedJournals.sort();
    }

    //Current Page slice
    return computedJournals;
  }, [journals, sorting]);

  return (
    <>
      <div className="container d-flex align-items-center justify-content-center">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleGetAll}
        >
          Get All
        </button>
      </div>
      <div className="container">
        <form>
          <div className="form-group d-flex justify-content-center align-items-center my-3 search-all">
            <span>Search All</span>
            <input
              type="text"
              className="form-control"
              placeholder="Insert search text..."
              value={searchAll}
              onChange={(e) => setSearchAll(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSearchAll}
            >
              <BiSearch />
            </button>
          </div>
        </form>
        <form className="search-query">
          <div className="form-group d-flex justify-content-center align-items-center my-3">
            <span>Search query</span>
            <input
              type="text"
              className="form-control"
              placeholder="Domain..."
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="URL..."
              value={URL}
              onChange={(e) => setURL(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Date..."
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Category..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSearchQuery}
            >
              <BiSearch />
            </button>
          </div>
        </form>
      </div>
      <div className="row w-100">
        <div className="col mb-3 col-12 text-center">
          <table className="table table-striped">
            <TableHeader
              headers={headers}
              onSorting={(field, order) => setSorting({ field, order })}
            />
            <tbody>
              {journalsData.map((journal) => (
                <tr key={journal._id}>
                  <th scope="row">{journal._id}</th>
                  <td>{journal._source.domain}</td>
                  <td>{journal._source.URL}</td>
                  <td>{journal._source.date}</td>
                  <td>{journal._source.category}</td>
                  <td><div style={{height:"200px", overflow:"scroll"}}>{journal._source.content}</div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default App;
