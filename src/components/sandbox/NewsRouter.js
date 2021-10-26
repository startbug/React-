import axios from "axios";
import React, { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "react-router";
import Audit from "../../views/sandbox/audit-manage/Audit";
import AuditList from "../../views/sandbox/audit-manage/AuditList";
import Home from "../../views/sandbox/home/Home";
import NewsAdd from "../../views/sandbox/news-manage/NewsAdd";
import NewsCategory from "../../views/sandbox/news-manage/NewsCategory";
import NewsDraft from "../../views/sandbox/news-manage/NewsDraft";
import Nopermission from "../../views/sandbox/nopermission/Nopermission";
import Published from "../../views/sandbox/publish-manage/Published";
import Sunset from "../../views/sandbox/publish-manage/Sunset";
import Unpublished from "../../views/sandbox/publish-manage/Unpublished";
import RightList from "../../views/sandbox/right-manage/RightList";
import RoleList from "../../views/sandbox/right-manage/RoleList";
import UserList from "../../views/sandbox/user-manage/UserList";

const LocalRouterMap = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightList,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/category": NewsCategory,
  "/audit-manage/audit": Audit,
  "/audit-manage/list": AuditList,
  "/publish-manage/unpublished": Unpublished,
  "/publish-manage/published": Published,
  "/publish-manage/sunset": Sunset,
};

export default function NewsRouter() {
  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8000/rights"),
      axios.get("http://localhost:8000/children"),
    ]).then((res) => {
      setBackRouteList([...res[0].data, ...res[1].data]);
    });
  }, []);

  const [backRouteList, setBackRouteList] = useState([]);

  const user = JSON.parse(localStorage.getItem("token"));

  const checkRoute = () => {
    return true;
  };

  const checkPermission = () => {
    return true;
  };

  return (
    <Switch>
      {backRouteList.map((route) => {
        if (checkRoute() && checkPermission()) {
          return (
            <Route
              path={route.key}
              key={route.key}
              component={LocalRouterMap[route.key]}
              exact
            />
          );
        }
        return null;
      })}
      <Redirect from="/" to="/home" exact />
      {backRouteList.length > 0 && <Route path="*" component={Nopermission} />}
    </Switch>
  );
}