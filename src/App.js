import logo from "./logo.svg";
import "./App.css";
import SummaryForm from "./page/summary/SummaryForm";
import Options from "./page/entry/Options";

function App() {
  return (
    <div className="App">
      <Options optionType="scoops" />
      <SummaryForm />
    </div>
  );
}

export default App;
