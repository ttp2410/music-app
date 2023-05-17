import React, {useState, useEffect} from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';

import {_ServerInstance as Axios} from '/services/axios';

import {TickCircle as IconTick, CloseCircle as IconClose, DollarCircle as IconDollar} from "iconsax-react"
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import Select from 'react-select'
import {NumericFormat} from "react-number-format";

const Index = () => {
	const dispatch = useDispatch();
	const musicDataStore = useSelector(state => state.musicData)

	const [onFetching, sOnFetching] = useState(false);

	const [keySearch, sKeySearch] = useState("")
	const [explicit, sExplicit] = useState({value: 1, label: "All"});
	const [minPrice, sMinPrice] = useState(null);
	const [maxPrice, sMaxPrice] = useState(null);

	const [musicData, sMusicData] = useState([]);
	const [resultCount, sResultCount] = useState(0);
	const [limitPerPage, sLimitPerPage] = useState(6);

	useBottomScrollListener(()=> {
        musicData.length >= limitPerPage && sLimitPerPage(limitPerPage + 6)
    }, {
        offset: 300,
        debounce: 0,
        triggerOnNoScroll: false
    })

	const _ServerFetching = () => {
        Axios("GET", "/search", {
            params: {
                term: keySearch
            }
        }, (err, response) => {
            if(!err){
                var {resultCount, results} = response.data;
				sMusicData(results)
				dispatch({type: "update/musicData", payload: results})
            }
			sLimitPerPage(6)
			window.scrollTo({top: 0, left: 0,behavior: "smooth"});
            sOnFetching(false)
        })
    }

	useEffect(() => {
        onFetching && _ServerFetching()
    }, [onFetching]);

	const _HandleOnChangeKeySearch = ({target: {value}}) => {
        sKeySearch(value)
		sExplicit({value: 1, label: "All"})
		sMinPrice(null)
		sMaxPrice(null)
		if(value?.length == 0){
			sMusicData([])
			dispatch({type: "update/musicData", payload: []})
		}else{
			setTimeout(() => {
				if(!value){
					sOnFetching(true)
				}
				sOnFetching(true)
			}, 1500);
		}
    };

	const _HandleChangeValueFilter = (type, value) => {
		if(type == "min"){
			sMinPrice(value?.value)
			const filteredData = musicDataStore.filter(item => item.trackPrice >= value?.value);
			sMusicData(filteredData);
		}else if(type == "max"){
			sMaxPrice(value?.value)
			const filteredData = musicDataStore.filter(item => item.trackPrice < value?.value);
			sMusicData(filteredData);
		}else if(type == "explicit"){
			sExplicit(value)
			sMaxPrice(null)
			sMinPrice(null)
			// if(value?.value == 2){
			// 	const filteredData = musicDataStore.filter(item => item.trackExplicitness === "explicit");
			// 	sMusicData(filteredData);
			// }else if(value?.value == 3){
			// 	const filteredData = musicDataStore.filter(item => item.trackExplicitness === "notExplicit");
			// 	sMusicData(filteredData);
			// }else if(value?.value == 1){
			// 	sMusicData(musicDataStore);
			// }
		}
	}

	//explicit data Filter
	const explicitFilter = [
		{value: 1, label: "All"},
		{value: 2, label: "Explicit"},
		{value: 3, label: "not Explicit"}
	]

	//image loading
	const toBase64 = (str) => typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str)

	const shimmer = (w, h) => `
	<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
		<defs>
			<linearGradient id="g">
			<stop stop-color="#333" offset="20%" />
			<stop stop-color="#222" offset="50%" />
			<stop stop-color="#333" offset="70%" />
			</linearGradient>
		</defs>
		<rect width="${w}" height="${h}" fill="#333" />
		<rect id="r" width="${w}" height="${h}" fill="url(#g)" />
		<animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
	</svg>`
	  
	return (
		<>
			<Head>
				<title>Music App</title>
			</Head>
			<div className='bg-black max-w-screen min-h-screen overflow-x-hidden'>
				<div className='lg:container lg:mx-auto mx-5 py-10'>
					<h1 className='bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500 text-5xl text-center font-bold py-2'>Music App</h1>
					<div className="flex lg:flex-row flex-col justify-between mt-10 lg:items-end items-center">
						<label className='relative cursor-text'>
							<input onChange={_HandleOnChangeKeySearch.bind(this)} type="text" name="search" placeholder="Search for songs, artists, albums..." autoComplete="off" className='md:w-96 w-80 px-5 py-3 text-white bg-black border-gray-900 border-2 rounded-lg border-opacity-50 outline-none focus:border-violet-500 placeholder-gray-300 placeholder-opacity-0 transition duration-200' />
							<span className='text-gray-500 text-opacity-80 bg-black absolute left-5 top-3 px-1 transition duration-200 input-text'>Search for songs, artists, albums...</span>
						</label>
						<div className='flex md:flex-row flex-col md:space-x-10 lg:mt-0 mt-5 md:items-end items-center'>
							<div className='space-y-1'>
								<label className='text-gray-500 text-xs'>Explicit</label>
								<Select 
									placeholder="Select Explicit"
									options={explicitFilter}
									value={explicit}
									onChange={_HandleChangeValueFilter.bind(this, "explicit")}
									className="w-60 text-white"
									theme={(theme) => ({
										...theme,
										colors: {
											...theme.colors,
											primary25: '#7c3aed',
											primary50: '#a78bfa',
											primary: '#8b5cf6',
											neutral0: "black",
										},
									})}
								/>
							</div>
							<div className='flex space-x-3 items-end md:mt-0 mt-5'>
								<div className='space-y-1 flex flex-col'>
									<label className='text-gray-500 text-xs'>Min Price</label>
									<NumericFormat
										className="w-32 px-5 py-[6px] text-white bg-black border-gray-900 border-2 rounded border-opacity-50 outline-none focus:border-violet-500 placeholder-gray-300 placeholder-opacity-0 transition duration-200"
										onValueChange={_HandleChangeValueFilter.bind(this, "min")}
										value={minPrice}
										prefix={'$'}
										thousandSeparator=","   
									/>
								</div>
								<div className='text-gray-500 pb-3'>-</div>
								<div className='space-y-1 flex flex-col'>
									<label className='text-gray-500 text-xs'>Max Price</label>
									<NumericFormat
										className="w-32 px-5 py-[6px] text-white bg-black border-gray-900 border-2 rounded border-opacity-50 outline-none focus:border-violet-500 placeholder-gray-300 placeholder-opacity-0 transition duration-200"
										onValueChange={_HandleChangeValueFilter.bind(this, "max")}
										value={maxPrice}
										prefix={'$'}
										thousandSeparator=","   
									/>
								</div>
							</div>
						</div>
					</div>

					<div className='mt-16 bg-white/5 p-5 rounded-lg relative'>
						<div className='w-full flex md:justify-center justify-start relative -top-6'>
							<h5 className="text-lg font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 w-fit px-8 py-3 rounded">List Result</h5>
						</div>
						{onFetching ?
							<div className='grid lg:grid-cols-2 gap-10'>
								<div className='bg-white/[0.02] p-5 flex items-center rounded relative space-x-3'>
									<div className='min-w-[100px] h-[100px] bg-white/[0.05] animate-pulse' />
									<div className='w-full space-y-3'>
										<div className='w-full h-3 rounded-full bg-white/[0.05] animate-pulse' />
										<div className='w-full h-3 rounded-full bg-white/[0.05] animate-pulse' />
										<div className='w-full h-3 rounded-full bg-white/[0.05] animate-pulse' />
										<div className='w-full h-3 rounded-full bg-white/[0.05] animate-pulse' />
										<div className='w-full h-3 rounded-full bg-white/[0.05] animate-pulse' />
									</div>
								</div>
								<div className='bg-white/[0.02] p-5 flex items-center rounded relative space-x-3'>
									<div className='min-w-[100px] h-[100px] bg-white/[0.05] animate-pulse' />
									<div className='w-full space-y-3'>
										<div className='w-full h-3 rounded-full bg-white/[0.05] animate-pulse' />
										<div className='w-full h-3 rounded-full bg-white/[0.05] animate-pulse' />
										<div className='w-full h-3 rounded-full bg-white/[0.05] animate-pulse' />
										<div className='w-full h-3 rounded-full bg-white/[0.05] animate-pulse' />
										<div className='w-full h-3 rounded-full bg-white/[0.05] animate-pulse' />
									</div>
								</div>
							</div>
							:
							<>
								{musicData?.length == 0 ? 
									<div className="h-80 w-full flex flex-col justify-center items-center">
										<Image alt='Not Found' src="/owl.png" width={128} height={153} quality={100} className="w-auto h-auto object-contain" />
										<p className="text-white font-medium ml-2">No results found</p>
									</div>
									:
									<div className='grid lg:grid-cols-2 gap-10 mx-5 mt-10'>
										<h6 className='text-gray-400 absolute top-2 right-2 md:text-sm text-xs'>{`Number of Results: ${musicData?.length}`}</h6>
										{musicData?.map((e, i) => i < limitPerPage &&
											<div key={i} className='bg-white/[0.02] p-5 flex items-center rounded relative'>
												<div className='relative -top-12 -left-8'>
													<Image alt={e?.artistName + i} src={e?.artworkUrl100} width={100} height={100} quality={100} className="min-w-[100px] h-[100px] object-cover relative z-[1]" loading='lazy' placeholder="blur" blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`} />
													<div className='absolute w-[100px] h-[100px] bg-black/80 top-2 left-2 blur' />
												</div>
												{/* <img alt={e?.artistName + i} src={e?.artworkUrl100} className="w-[100px] h-auto object-contain" /> */}
												<div className='text-white flex flex-col'>
													<label className='text-gray-300 text-sm'>Artist Name: <span className='text-white text-base'>{e?.artistName}</span></label>
													<label className='text-gray-300 text-sm'>Genre: <span className='text-white text-base'>{e?.primaryGenreName}</span></label>
													<label className='text-gray-300 text-sm'>Kind: <span className='text-white text-base'>{e?.kind}</span></label>
													<label className='text-gray-300 text-sm'>Track Name: <span className='text-white text-base'>{e?.trackName}</span></label>
													<label className='text-gray-300 text-sm'>Track price: <span className='text-white text-base'>{e?.trackPrice}</span></label>
													<label className='text-gray-300 text-sm'>Track explicit: <span className='text-white text-base'>{e?.trackExplicitness}</span></label>
												</div>
											</div>
										)}
									</div>
								}
							</>
						}
					</div>
				</div>
			</div>
		</>
	);
}

export default Index;
