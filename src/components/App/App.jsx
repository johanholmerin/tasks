import { h, Fragment } from 'preact';
import { connect } from 'unistore/preact'
import { getErrorMessage } from '../../state/utils.js';
import MainView from '../MainView/MainView.jsx';
import TaskView from '../TaskView/TaskView.jsx';
import LoginView from '../LoginView/LoginView.jsx';
import Loading from '../Loading/Loading.jsx';
import ErrorView from '../ErrorView/ErrorView.jsx';
import usePromise from '../../utils/use-promise.js';

function getView(signedIn, selectedTask) {
  if (!signedIn) return LoginView;

  return selectedTask ? TaskView : MainView;
}

const App = connect(['signedIn', 'selectedTask', 'loading'])(({
  signedIn,
  selectedTask,
  ready,
  loading
}) => {
  const { error, done } = usePromise(ready);
  if (error) return <ErrorView message={getErrorMessage(error)} />;
  if (!done) return <Loading />;

  const View = getView(signedIn, selectedTask);
  return (
    <>
      {loading && <Loading />}
      <View />
    </>
  );
});

export default App;
