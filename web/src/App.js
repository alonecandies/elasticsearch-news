import React, { useEffect, useState, useMemo } from "react";
import { TableHeader, Pagination } from "./components";
import { BiSearch } from "react-icons/bi";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  const [journals, setJournal] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
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
      .post("localhost:4000/searchAll", {
        query: searchAll,
      })
      .then((res) => {
        setJournal(res.data);
      });
  };

  const handleSearchQuery = () => {
    axios
      .post("localhost:4000/search", {
        domain,
        URL,
        content,
        date,
        category,
      })
      .then((res) => {
        setJournal(res.data);
      });
  };

  useEffect(() => {
    const fetchData = () => {
      axios.get("localhost:4000/getAll").then((res) => {
        setJournal(res.data);
      });
    };

    fetchData();
  }, []);

  const journalsData = useMemo(() => {
    let computedJournals = journals;

    setTotalItems(computedJournals.length);

    //Sorting
    if (sorting.field) {
      const reversed = sorting.order === "asc" ? 1 : -1;
      computedJournals = computedJournals.sort(
        (a, b) => reversed * a[sorting.field].localeCompare(b[sorting.field])
      );
    }

    //Current Page slice
    return computedJournals.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );
  }, [journals, currentPage, sorting]);

  return (
    <>
      <div className="container">
        <form>
          <div class="form-group d-flex justify-content-center align-items-center my-3 search-all">
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
          <div class="form-group d-flex justify-content-center align-items-center my-3">
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
          <div className="row">
            <div className="col-md-12 d-flex justify-content-center align-items-center">
              <Pagination
                total={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>

          <table className="table table-striped">
            <TableHeader
              headers={headers}
              onSorting={(field, order) => setSorting({ field, order })}
            />
            <tbody>
              {journalsData.map((journal) => (
                <tr key={journal.id}>
                  <th scope="row">{journal.id}</th>
                  <td>{journal.domain}</td>
                  <td>{journal.URL}</td>
                  <td>{journal.date}</td>
                  <td>{journal.category}</td>
                  <td>{journal.content}</td>
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
