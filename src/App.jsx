import { AppThemeProvider } from "./providers/AppThemeProvider";
import { UsersTable } from "./widgets/table/UserTable";
import { Header } from "./widgets/header/Header";

function App() { return ( <AppThemeProvider> <Header /> 
  <div style={{ maxWidth: 1400, width: "100%", margin: "0 auto", padding: 20 }}> 
    <UsersTable /> </div> </AppThemeProvider> ); }

export default App;