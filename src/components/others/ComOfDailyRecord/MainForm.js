import React from "react";
import { connect } from "react-redux";
import AppendInput from "../ComOfDailyRecord/AppendInput";

// App Components and Actions
import { addRecordInputName } from "../../../store/actions/dailyAction";
import { addRecordInputServe } from "../../../store/actions/dailyAction";
import { sendDataToFirebase } from "../../../store/actions/dailyAction";
import { updateDailyRecordName } from "../../../store/actions/dailyAction";
import { updateDailyRecordServe } from "../../../store/actions/dailyAction";
import { adjustRecordInputName } from "../../../store/actions/dailyAction";
import { adjustRecordInputServe } from "../../../store/actions/dailyAction";
import Delete from "../../../imgs/delete.png";

class MainForm extends React.Component {
  constructor() {
    super();
    this.state = {
      addInputComponent: 0
    };
  }
  // submit state to the firebase
  // addMealData = () => {
  // return {
  //   meals: meal.toString(),
  //   meal: prevState.snack
  // };
  // 以下為上方 object 改寫
  // let object = {};
  // object.meals = meal.toString();
  // object[meal] = prevState.snack;
  // };

  // change input, change data (state)
  inputNameChange = e => {
    console.log(e.target.id);
    let adjustIndex = Number(e.target.id);
    let meal = window.location.pathname.split("/")[2]; // checking by url subpath
    let obj = {};
    let foodName = e.target.value;
    // avoid onBlur with no data, empty input shouldn't be save into the data store
    if (foodName.trim() !== "") {
      // when no state in Redux store, add first data
      if (this.props.recordName === undefined) {
        console.log("first");
        obj = [{ foodName: foodName }];
        this.props.updateDailyRecordName(obj);
      } else {
        // if input's value isn't empty, check if the data is rewriting the previous answer
        if (
          foodName !== this.props.recordName[adjustIndex] &&
          this.props.recordName[adjustIndex] !== undefined
        ) {
          console.log("更新");
          obj = { foodName: foodName };
          this.props.adjustRecordInputName(adjustIndex, obj); // 寫更新的方法
        } else if (this.props.recordName[adjustIndex] === undefined) {
          console.log("新增一筆");
          obj = [{ foodName: foodName }];
          this.props.addRecordInputName(obj);
        }
      }
    }
  };

  inputServeChange = e => {
    let adjustIndex = Number(e.target.id);
    console.log(e.target.id);
    let meal = window.location.pathname.split("/")[2]; // checking by url subpath
    let obj = {};
    let foodServe = e.target.value;
    if (foodServe.trim() !== "") {
      // when no state in Redux store, add first data
      if (this.props.recordServe == undefined) {
        obj = [{ foodServe: foodServe }];
        this.props.updateDailyRecordServe(obj);
      } else {
        if (
          foodServe !== this.props.recordServe[adjustIndex] &&
          this.props.recordServe[adjustIndex] !== undefined
        ) {
          console.log("更新");
          obj = { foodServe: foodServe };
          this.props.adjustRecordInputServe(adjustIndex, obj); // 寫更新的方法
        } else if (this.props.recordServe[adjustIndex] === undefined) {
          console.log("新增一筆");
          obj = [{ foodServe: foodServe }];
          this.props.addRecordInputServe(obj);
        }
      }
    }
  };

  appendInput = () => {
    if (
      this.props.recordName === undefined &&
      this.props.recordServe === undefined
    ) {
      alert(" please add your first data!");
    } else if (
      this.props.recordName === undefined ||
      this.props.recordServe === undefined
    ) {
      alert("some info is missing ~!");
    } else if (this.props.recordName.length !== this.props.recordServe.length) {
      alert("some info is missing ~!");
    } else {
      this.setState(prevState => ({
        addInputComponent: prevState.addInputComponent + 1
      }));
    }
  };

  getAppendedComponents = () => {
    let addInputComponent = [];
    for (let i = 1; i < this.state.addInputComponent; i++) {
      addInputComponent.push(
        <form className="main-input">
          <input
            placeholder="輸入食物名稱"
            className="food-name"
            onBlur={this.inputNameChange}
            id={i}
          ></input>
          <input
            placeholder="輸入食物份量（100g 為一份）"
            className="food-serve"
            onBlur={this.inputServeChange}
            id={i}
          ></input>
          <img src={Delete} className="delete-button"></img>
        </form>
      );
    }
    return addInputComponent;
  };

  sendDataToFirebase = e => {
    e.preventDefault();
    console.log(this.props);
    let currentState = this.props;
    let stateName = this.props.recordName;
    let stateServe = this.props.recordServe;

    this.props.sendDataToFirebase(stateName, stateServe);

    // after sending data, empty all the input and cut down the append inputs

    this.setState({
      addInputComponent: 0
    });
    console.log(event.target.elements);
  };

  render() {
    return (
      <div className="main-form">
        <form className="main-input">
          <input
            placeholder="輸入食物名稱"
            className="food-name"
            onBlur={this.inputNameChange}
            // value={this.state.originalInput}
            id="0"
          ></input>
          <input
            placeholder="輸入食物份量（100g 為一份）"
            className="food-serve"
            onBlur={this.inputServeChange}
            // value={this.state.originalInput}
            id="0"
          ></input>
          <img src={Delete} className="delete-button"></img>
        </form>
        {this.getAppendedComponents()}
        <button className="add-input" onClick={this.appendInput}>
          新增欄位
        </button>
        <button className="add-record" onClick={this.sendDataToFirebase}>
          新增紀錄
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    date: new Date().toLocaleDateString(),
    meals: state.daily.meals,
    record: state.daily.record,
    recordName: state.daily.recordName,
    recordServe: state.daily.recordServe
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // create a method
    addRecordInputName: nextInput => {
      dispatch(addRecordInputName(nextInput));
    },
    addRecordInputServe: nextInput => {
      dispatch(addRecordInputServe(nextInput));
    },
    sendDataToFirebase: (stateName, stateServe) => {
      dispatch(sendDataToFirebase(stateName, stateServe));
    },
    updateDailyRecordName: newRecord => {
      dispatch(updateDailyRecordName(newRecord));
    },
    updateDailyRecordServe: newRecord => {
      dispatch(updateDailyRecordServe(newRecord));
    },
    adjustRecordInputName: (adjustIndex, newInputName) => {
      dispatch(adjustRecordInputName(adjustIndex, newInputName));
    },
    adjustRecordInputServe: (adjustIndex, newInputServe) => {
      dispatch(adjustRecordInputServe(adjustIndex, newInputServe));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainForm);
