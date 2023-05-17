import { useSelector, Provider, useDispatch } from 'react-redux';
import store from "/services/redux";

import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
