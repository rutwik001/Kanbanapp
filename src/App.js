import React, { useState, useEffect } from "react";


function App() {
  const [data, setData] = useState({ tickets: [], users: [] });
  const [loading, setLoading] = useState(true);
  const [groupBy, setGroupBy] = useState("status");
  const [sortBy, setSortBy] = useState("priority");

  useEffect(() => {
   
  fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
  .then((response) => response.json())
  .then((data) => {
    setData(data);
    setLoading(false);
  })
  .catch((error) => {
    console.error("Error fetching data: ", error);
    setLoading(false);
  });
  }, []);

  const sortedData = sortData(data.tickets, sortBy);
  const groupedData = groupData(sortedData, groupBy);

  const groupOptions = ["status", "user", "priority"];
  const sortOptions = ["priority", "title"];

  const handleGroupByChange = (e) => {
    setGroupBy(e.target.value);
  };

  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };

   
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function getUserById(userId) {
    return data.users.find((user) => user.id === userId) || { name: "Unknown User" };
  }

  function groupData(data, key) {
    return data.reduce((result, item) => {
      const groupKey = key === "user" ? getUserById(item.userId).name : item[key];
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {});

  }

  function sortData(data, key) {
    return [...data].sort((a, b) => {
      if (key === "priority") {
        return b.priority - a.priority;
      } else if (key === "title") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }

  const priorityLabels = {
    4: "Urgent",
    3: "High",
    2: "Medium",
    1: "Low",
    0: "No priority",
  };
  const priorityMappings = {
    Urgent: '❗',
    High: '🔴',
    Medium: '🟡',
    Low: '🟢',
  };
  const statusMappings = {
    Todo: '🟢',
    Backlog: '🔴',
  };
  return (
<div>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#"><h1>Kanban</h1></a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav">
      <a class="nav-link active" aria-current="page">
      <label>
        <h3>Grouping</h3>
        <select value={groupBy} onChange={handleGroupByChange}>
          {groupOptions.map((option) => (
            <option key={option} value={option}>
              {capitalizeFirstLetter(option)}
            </option>
          ))}
        </select>
      </label>
      </a>
      <a class="nav-link"> 
      <label>
        <h3>Ordering</h3>
        <select value={sortBy} onChange={handleSortByChange}>
          {sortOptions.map((option) => (
            <option key={option} value={option}>
              {capitalizeFirstLetter(option)}
            </option>
          ))}
        </select>
      </label>
      </a>
      </div>
    </div>
  </div>
  </nav>

  {loading ? (
    <p>Loading data...</p>
  ) : (
  <div>
   <div className="row container-fluid display">
    {groupedData && typeof groupedData === "object" && Object.keys(groupedData).map((groupKey) => (
        <div className="col-md-2 container" key={groupKey}>

         <h4>
         {priorityMappings[priorityLabels[groupKey]] || statusMappings[groupKey]}{' '}
          {priorityLabels[groupKey] || groupKey}{' '}[{groupedData[groupKey].length}]{' ✚...'}
         </h4>

        {groupedData[groupKey].map((item) => (
            <div class="card mb-2">
              <div class="row g-0">
              <div class="col-md-10">
            <div class="card-body">
            <h5 class="card-title" >{item.id}</h5>
            <h2 class="card-subtitle mb-2 " >⚪ {item.title}</h2>
            <p className="card-text text-muted" style={{ fontSize: "0.82rem"}}>🛞 {item.tag}</p>
            <h2 className="card-text text-muted">{item.status}</h2>
               
            </div>
            <div class="col-md-2">
                <img src="../images/images.jpg" class="img-fluid rounded-start" style={{ margin: "0.8rem" }} alt=".."/>
            </div>
          </div>
      </div>
      </div>
          ))}
       </div>
    ))}
   </div>
  </div>
  
  )} 

    
</div>
  );
}

export default App;
