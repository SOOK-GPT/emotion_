import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import React, {useState} from "react";
import Page1 from "./1";
import Page2 from "./2";

function Map() {
  const [toDos, setToDos] = useState([]);
  const addToDo = (todo) => {
    setToDos((prevToDos) => [todo, ...prevToDos]);
  };

  return (
    <Router>
      <div>
        <nav>
          <ul style={{ display: "flex", listStyle: "none" }}>
            <li style={{ margin: "0 10px" }}>
              <Link to="/Page1">근처 사회복지기관 보기</Link>
            </li>
            <li style={{ margin: "0 10px" }}>
              <Link to="/Page2">사회복지기관 한 눈에 보기</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/Page1">
            <Page1 addToDo={addToDo}/>
          </Route>
          <Route path="/Page2">
            <Page2 addToDo={addToDo}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default Map;