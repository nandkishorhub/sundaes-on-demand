import "./App.css";
import OrderEntry from "./page/entry/OrderEntry";
import { OrderDetailsProvider } from "./context/OrderDetails";
import { Container } from "react-bootstrap";

function App() {
  return (
    <Container>
      <OrderDetailsProvider>
        {/* SummaryPage and entry page needs provider */}
        <OrderEntry />
      </OrderDetailsProvider>
      {/* confirmation page does not need provider*/}
    </Container>
  );
}

export default App;
