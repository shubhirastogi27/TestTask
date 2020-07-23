import { StatusBar } from "expo-status-bar";

import React from "react";
import {
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import axios from "axios";
import { styling } from "./style";
import { getData } from "./api";
import moment from "moment";

const screenWidth = Dimensions.get("window").width * 0.9;
const screenHeight = Dimensions.get("window").height * 0.6;

export default class MainApp extends React.Component {
  constructor() {
    super();

    this.state = {
      open: false,
      data: {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        datasets: [
          {
            data: [10, 20, 25, 45, 28, 80, 99, 43],
          },
        ],
      },
      btcusd: 0,
      active: "Yearly",
      loader: true,
    };
  }

  componentDidMount() {
    this.getYearlyData();
    const subscribe = {
      type: "subscribe",
      channels: [
        {
          name: "ticker",
          product_ids: ["BTC-USD"],
        },
      ],
    };

    this.ws = new WebSocket("wss://ws-feed.gdax.com");

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify(subscribe));
    };

    this.ws.onmessage = (e) => {
      const value = JSON.parse(e.data);
      if (value.type !== "ticker") {
        return;
      }
      this.setState({
        btcusd: value.price,
      });
    };
  }

  getYearlyData = () => {
    this.setState({
      active: "Yearly",
      loader: true,
    });
    let endStart = [
      new Date().getFullYear(),
      0 + `${new Date().getMonth() + 1}`,
      new Date().getDate(),
    ].join("-");
    let oldEnd = [
      new Date().getFullYear() - 1,
      0 + `${new Date().getMonth() + 1}`,
      new Date().getDate(),
    ].join("-");
    getData(oldEnd, endStart)
      .then((res) => {
        let arr = [];
        let labelArr = [];
        let obj = res.data;
        for (let i of obj) {
          arr.push(i.rate);
          labelArr.push(
            moment(i.timestamp).format("MMM")
          );
        }
        labelArr = labelArr.filter(function (item, index, inputArray) {
          return inputArray.indexOf(item) == index;
        });
        let objNew = this.state.data;

        objNew.datasets[0].data = arr;
        objNew.labels = labelArr;
        this.setState({
          data: objNew,

          loader: false,
        });
      })
      .catch((err) => {
        console.warn(err, "err");
        this.setState({
          loader: false,
        });
      });
  };

  getMonthly = () => {
    this.setState({
      active: "Monthly",
      loader: true,
    });
    let endStart = [
      new Date().getFullYear(),
      0 + `${new Date().getMonth() + 1}`,
      new Date().getDate(),
    ].join("-");
    let oldEnd = [
      new Date().getFullYear(),
      0 + `${new Date().getMonth()}`,
      new Date().getDate(),
    ].join("-");
    getData(oldEnd, endStart)
      .then((res) => {
        let arr = [];
        let labelArr = [];
        let obj = res.data;
        for (let i of obj) {
          arr.push(i.rate);
          labelArr.push(
           moment(i.timestamp).format('MMM Do YY')
          );
        }
        let objNew = this.state.data;
        objNew.datasets[0].data = arr;
        objNew.labels = labelArr;
        this.setState({
          data: objNew,
          loader: false,
        });
      })
      .catch((err) => {
        console.warn(err, "err");
        this.setState({
          loader: false,
        });
      });
  };

  getToday = () => {
    this.setState({
      active: "Today",
      loader: true,
    });
    let arr = [
      new Date().getFullYear(),
      0 + `${new Date().getMonth() + 1}`,
      new Date().getDate(),
    ].join("-");
    getData(arr, null)
      .then((res) => {
        let arr = [];
        let labelArr = [];
        let obj = res.data;
        for (let i of obj) {
          arr.push(i.rate);
          labelArr.push(new Date(i.timestamp).getHours());
        }
        let objNew = this.state.data;
        objNew.datasets[0].data = arr;
        objNew.labels = labelArr;
        this.setState({
          data: objNew,
          loader: false,
        });
      })
      .catch((err) => {
        console.warn(err, "err");
        this.setState({
          loader: false,
        });
      });
  };

  componentWillUnmount() {
    this.ws.close();
  }

  render() {
    return (
      <View style={styling.container}>
        <StatusBar style="dark" />
        <View style={{ flexDirection: "row" }}>
          <View>
            <Text>Bit Coin USD </Text>
          </View>
          <View>
            <Text>{this.state.btcusd}</Text>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            height: "80%",
            justifyContent: "center",
            // borderWidth: 1,
          }}
        >
          {this.state.loader ? (
            <ActivityIndicator />
          ) : (
            <>
              <View
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  padding: "2%",
                }}
              >
                <View style={styling.tabs}>
                  <TouchableOpacity onPress={this.getYearlyData}>
                    <Text
                      style={{
                        color:
                          this.state.active === "Yearly" ? "pink" : "black",
                      }}
                    >
                      Yearly
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styling.tabs}>
                  <TouchableOpacity onPress={this.getMonthly}>
                    <Text
                      style={{
                        color:
                          this.state.active === "Monthly" ? "pink" : "black",
                      }}
                    >
                      Monthly
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styling.tabs}>
                  <TouchableOpacity onPress={this.getToday}>
                    <Text
                      style={{
                        color: this.state.active === "Today" ? "pink" : "black",
                      }}
                    >
                      Today
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <LineChart
                data={this.state.data}
                width={screenWidth}
                height={screenHeight}
                chartConfig={{
                  backgroundColor: "#2896f3",
                  backgroundGradientFrom: "white",
                  backgroundGradientTo: "white",
                  decimalPlaces: 0, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(36,142,249, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(16,16,16, ${opacity})`,

                  style: {
                    borderRadius: 16,
                    //  fontSize : 4
                  },
                  propsForDots: {
                    r: "0",
                    strokeWidth: "4",
                    stroke: "#2896f3",
                  },
                }}
                bezier
                withDots={true}
                withVerticalLines={true}
                withInnerLines={true}
                fromZero={true}
                segments={10}
                onDataPointClick={(value) => alert(parseInt(value.value))}
                verticalLabelRotation={90}
              />
            </>
          )}
        </View>
      </View>
    );
  }
}
