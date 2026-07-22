import { AppProvider } from './context/AppContext.tsx';
import Layout from './components/Layout.tsx';
import PromptEditor from './components/PromptEditor.tsx';
import ContractEditor from './components/ContractEditor.tsx';
import ModelConfigPanel from './components/ModelConfigPanel.tsx';
import TestRunner from './components/TestRunner.tsx';
import ResultsDashboard from './components/ResultsDashboard.tsx';

export default function App() {
  return (
    <AppProvider>
      <Layout>
        <PromptEditor />
        <ContractEditor />
        <ModelConfigPanel />
        <TestRunner />
        <ResultsDashboard />
      </Layout>
    </AppProvider>
  );
}
