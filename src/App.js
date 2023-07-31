import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React, {useState} from "react";
import ChatBot from "./ChatBotpage";
import HomeScreen from "./HomeScreen";
import FaceRecog from "./FaceRecog";
import Map from "./Map";
import './css/global.css'
import NavLink from './component/NavLink';

function App() {
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
              <NavLink to="/">홈</NavLink>
            </li>
            <li style={{ margin: "0 10px" }}>
              <NavLink to="/ChatBot">챗봇</NavLink>
            </li>
            <li style={{ margin: "0 10px" }}>
              <NavLink to="/Map">지도</NavLink>
            </li>
            <li style={{ margin: "0 10px" }}>
              <NavLink to="/Face-recognition">표정 인식</NavLink>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route exact path="/">
            <HomeScreen />
          </Route>
          <Route path="/ChatBot">
            <ChatBot addToDo={addToDo}/>
          </Route>
          <Route path="/Map">
            <Map addToDo={addToDo}/>
          </Route>
          <Route path="/Face-recognition">
            <FaceRecog addToDo={addToDo}/>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
