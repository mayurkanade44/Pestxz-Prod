import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Footer, ProtectedRoute } from "./components";

import {
  Landing,
  Dashboard,
  Error,
  Report,
  RegisterClient,
  Stats,
  SingleClient,
  QRLocation,
  Profile,
  ServiceProduct,
  SuperAdmin,
} from "./pages";

function App() {
  return (
    <Router>
      <ToastContainer position="top-center" autoClose={2000} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role={["Admin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<Stats />} />
          <Route path="add-client" element={<RegisterClient />} />
          <Route path="report" element={<Report />} />
          <Route path="profile" element={<Profile />} />
          <Route path="client/:id" element={<SingleClient />} />
          <Route path=":id" element={<ServiceProduct />} />
        </Route>
        <Route
          path="/qr-location/:id"
          element={
            <ProtectedRoute role={["Admin", "Operator"]}>
              <QRLocation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superAdmin"
          element={
            <ProtectedRoute role={["Super Admin"]}>
              <SuperAdmin />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
