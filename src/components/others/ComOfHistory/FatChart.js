import React from "react";
import { Line } from "react-chartjs-2";

import { connect } from "react-redux";
import { checkFirestoreNutritionRecord } from "../../../store/actions/dailyAction";
import { removeUsingFilterFunction } from "../../../store/actions/dailyAction";

class FatChart extends React.Component {
  constructor() {
    super();
    this.state = {
      dataUpdate: ""
    };
  }

  componentWillUnmount = () => {
    this.props.removeUsingFilterFunction();
  };

  render() {
    if (
      this.props.recordTotalNutrition == undefined &&
      this.props.recordTotalName == undefined &&
      this.props.recordTotalServe == undefined
    ) {
      return (
        <div className="lineCharts">
          <Line
            width={600}
            height={250}
            options={{ responsive: true, maintainAspectRatio: true }}
          />
        </div>
      );
    } else {
      let nutritionObject = this.props.recordTotalNutrition;

      let dataFatArray = [];
      let result = Object.keys(nutritionObject).map(function(key) {
        return { key: nutritionObject[key] };
      });

      let fat;
      for (let d = 0; d < result.length; d++) {
        fat = result[d].key["粗脂肪(g)"];
        dataFatArray.push(fat);
      }

      let theDays = [];
      // if using filter time function, rearrange days label
      if (this.props.usingFilterFunction == true) {
        let daysInProps = this.props.recordTotalNutrition;
        let theDaysResult = Object.keys(daysInProps).map(function(key) {
          return [Number(key), daysInProps[key]];
        });
        for (let t = 0; t < theDaysResult.length; t++) {
          theDays.push(theDaysResult[t][0].toString());
        }
      } else {
        let daysInProps = this.props.recordTotalNutrition;
        let theDaysResult = Object.keys(daysInProps).map(function(key) {
          return [Number(key), daysInProps[key]];
        });
        for (let t = 0; t < theDaysResult.length; t++) {
          theDays.push(theDaysResult[t][0].toString());
        }
      }

      // 25% total calorie
      let calorie;
      let calorieArray = [];
      for (let d = 0; d < result.length; d++) {
        calorie = result[d].key["修正熱量(kcal)"];
        calorieArray.push(calorie);
      }
      let averageArray = [];
      calorieArray.forEach(eachCalorie => {
        averageArray.push(eachCalorie * 0.25 * 0.11); // kcal/g(transfer kcal to g)
      });

      const data = {
        labels: theDays,
        datasets: [
          {
            label: "Average",
            borderColor: "rgb(255, 184, 3)",
            backgroundColor: "rgb(255, 184, 3)",
            data: averageArray
          },
          {
            label: "Weekly-Fat",
            borderColor: "rgb(247, 237, 151)",
            backgroundColor: "rgb(247, 237, 151)",
            data: dataFatArray
          }
        ]
      };
      let meal = this.props.recordTotalMeal;
      let dateAndName = this.props.recordTotalName;
      let serve = this.props.recordTotalServe;

      let theDate;
      let dateArray;

      let labelArray = {};
      let labelObject;
      let object = {};

      let detailArray = [];
      let resultArray = [];

      let test;
      let key;

      for (let o = 0; o < dateAndName.length; o++) {
        theDate = dateAndName[o].date;
        labelObject =
          meal[o] +
          " : " +
          dateAndName[o].name.foodName +
          " " +
          serve[o] +
          " 份 ";

        if (!labelArray[theDate]) {
          labelArray[theDate] = [];
        }

        if (labelArray[theDate].detail) {
          labelArray[theDate].detail.push(labelObject);
        } else {
          labelArray[theDate].detail = [labelObject];
        }
      }

      for (key in labelArray) {
        detailArray.push(labelArray[key]);
      }

      for (let i = 0; i < detailArray.length; i++) {
        resultArray.push(detailArray[i].detail);
      }

      const option = {
        responsive: true,
        maintainAspectRatio: true,
        title: {
          display: true,
          position: "top",
          fontSize: 12,
          fontColor: "grey"
        },
        tooltips: {
          enabled: true,
          mode: "single",
          callbacks: {
            label: function(tooltipItems, data) {
              let multistringText = [tooltipItems.yLabel];
              for (let x = 0; x < resultArray[tooltipItems.index].length; x++) {
                multistringText.push(resultArray[tooltipItems.index][x]);
              }
              return multistringText;
            },
            title: function(tooltipItems, data) {
              let title = ["當天飲食"];
              return title;
            }
          }
        },
        legend: {
          display: true,
          position: "bottom",
          labels: {
            fontColor: "#333",
            fontSize: 12
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0
              }
            }
          ]
        }
      };

      if (data.datasets) {
        data.datasets.forEach(set => {
          set.pointHoverBackgroundColor = "red";
          set.pointHoverBorderColor = "red";

          set.borderWidth = 3;
          set.borderJoinStyle = "miter";
          set.borderCapStyle = "round";
          set.fill = "false";
        });
      }
      return (
        <div className="lineCharts">
          <Line width={600} height={250} options={option} data={data} />
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    recordTotalNutrition: state.daily.recordTotalNutrition,
    recordTotalName: state.daily.recordTotalName,
    recordTotalServe: state.daily.recordTotalServe,
    recordTotalMeal: state.daily.recordTotalMeal,
    auth: state.firebase.auth,
    userInfo: state.firebase.profile,
    startDate: state.daily.startDate,
    endDate: state.daily.endDate,
    usingFilterFunction: state.daily.usingFilterFunction
  };
};

const mapDispatchToProps = dispatch => {
  return {
    checkFirestoreNutritionRecord: (startDate, endDate, userUID) => {
      dispatch(checkFirestoreNutritionRecord(startDate, endDate, userUID));
    },
    removeUsingFilterFunction: () => {
      dispatch(removeUsingFilterFunction());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FatChart);
