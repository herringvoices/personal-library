import { useEffect, useState } from "react";
import { tryGetLoggedInUser } from "./managers/authManager";
import { Spinner } from "react-bootstrap";
import ApplicationViews from "./components/ApplicationViews";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
library.add(fas, far, fab);

function App() {
  const [loggedInUser, setLoggedInUser] = useState();

  useEffect(() => {
    tryGetLoggedInUser().then(setLoggedInUser);
  }, []);

  return loggedInUser === undefined ? (
    <Spinner animation="border" role="status" />
  ) : (
    <>
      <ApplicationViews loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />
    </>
  );
}

export default App;
