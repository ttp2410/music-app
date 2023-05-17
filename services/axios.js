import axios from 'axios'
import store from "/services/redux";
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
	toast: true,
	position: 'top-end',
	showConfirmButton: false,
	timer: 2000,
	timerProgressBar: true,
	background: "#121212"
})

axios.defaults.baseURL = 'https://itunes.apple.com';

axios.defaults.withCredentials = false;
axios.defaults.include = true;

const _ServerInstance = (method, url, dataObject, callback) => {
	axios({
	    method: method,
	    url: url,
	    withCredentials: false,
	    include: true,
		...dataObject,
	    headers: 'Content-Type',
	    retries: 3,
	    timeout: 8000
	}).then(async function (response) {
      	callback && callback(null, response)
    }).catch(function (error){
		if(error.response && error.response?.status === 500){
			store.dispatch({type: "update/musicData", payload: null})
		}else{
			callback && callback(error, null)
			Toast.fire({
				title: `${"Can't not search keyword"}`,
				icon: 'error'
			})
		}
    });
}

export {_ServerInstance, axios};