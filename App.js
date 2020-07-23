import { StatusBar } from "expo-status-bar";

import React from "react";
import MainApp from "./src";


export default class App extends React.Component {
  constructor() {
    super();
  }
  render() {
    return (
      <MainApp/>
    );
  }
}
