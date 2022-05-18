var router = express.Router();
const axios = require("axios");
const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: ES_URL, pingTimeout: 3000 });
const ES_URL = "http://localhost:9200/";
const ES_INDEX = "journal";
const QUERY_DATA = {
  query: {
    match_all: {},
  },
  size: 600,
};

const queryType = (data, searchType) => {
  var query = [];
  if (data?.domain) {
    query.push({ [searchType]: { domain: data.domain } });
  }
  if (data?.URL) {
    query.push({ [searchType]: { URL: data.URL } });
  }
  if (data?.content) {
    query.push({ [searchType]: { content: data.content } });
  }
  if (data?.date) {
    query.push({ [searchType]: { date: data.date } });
  }
  if (data?.category) {
    query.push({ [searchType]: { category: data.category } });
  }
  return query;
};

const matchQuery = async (data) => {
  return JSON.stringify({
    query: {
      bool: {
        must: queryType(data, "match"),
      },
    },
    size: 100,
  });
};

router.post("/searchAll", async function (req, res, next) {
  var data = {
    query: {
      query_string: {
        query: req.body.query,
      },
    },
  };

  const searchDoc = async () => {
    const response = await client.search({
      index: ES_INDEX,
      body: data,
    });

    res.send(response?.body?.hits?.hits);
  };
  searchDoc().catch((e) => console.log("error:", e));
});

router.post("/search", async function (req, res, next) {
  var data = QUERY_DATA;
  data = await matchQuery(req.body);

  const searchDoc = async () => {
    const response = await client.search({
      index: ES_INDEX,
      body: data,
    });

    res.send(response?.body?.hits?.hits);
  };
  searchDoc().catch((e) => console.log("error>", e));
});

router.get("/getAll", function (req, res, next) {
  axios.get(ES_URL + ES_INDEX + "/_search?size=600").then((response) => {
    res.send(response.data.hits.hits);
  });
});

module.exports = router;
