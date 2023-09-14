import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import axios from "axios";
import { useQueries, useQuery } from "@tanstack/react-query";
function App() {
  const test = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_KEY}/product/getAll`
    );
    return res.data;
  };
  const query = useQuery({ queryKey: ["todos"], queryFn: test });
  console.log("query", query);
  // useEffect(() => {
  //   test();
  // }, []);
  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route, index) => {
            const Page = route.page;
            const Layout = route.isShowHeader ? DefaultComponent : Fragment;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
