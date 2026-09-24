import AuthInitializer from "./components/auth/AuthInitializer";
import AppRoutes from "./routes/AppRoutes";
import ToastContainer from "./components/common/ToastContainer";

function App() {
  return (
    <>
      <AuthInitializer>
        <AppRoutes />
      </AuthInitializer>
      <ToastContainer />
    </>
  );
}

export default App;
